# KẾ HOẠCH TÁI CẤU TRÚC & BẢN ĐỊA HÓA HỆ THỐNG TỬ VI ĐẨU SỐ (VIETNAM EDITION)

---

## PHẦN 1: PHÂN TÍCH HIỆN TRẠNG MÃ NGUỒN (SOURCE CODE AUDIT)

Qua quá trình rà soát toàn bộ mã nguồn của dự án (`ziwei-master`), hệ thống hiện tại là một ứng dụng Next.js 16 (App Router) viết bằng TypeScript, sử dụng Tailwind CSS và kết hợp hai thư viện lõi là `iztro` (an sao Tử Vi) và `lunar-javascript` (chuyển đổi lịch pháp, tính Tứ Trụ).

Dưới đây là các vấn đề kiến trúc và phụ thuộc cứng (hardcoded dependencies) cần giải quyết để đáp ứng các yêu cầu tái cấu trúc:

### 1.1. Hệ thống Thời gian & Định dạng (Time Format & Precision)
* **Thiếu độ chính xác đến giây (`ss`)**:
  * Giao diện nhập liệu `components/BirthForm.tsx` và cấu trúc `BirthFormState` chỉ quản lý `clockHour` và `clockMinute`, bỏ qua `clockSecond`.
  * Module điều chỉnh giờ `lib/ziwei/clock-adjust.ts` (`ClockTime`) và bộ chuyển đổi URL `lib/ziwei/share.ts` (`formToSearchParams`, `searchParamsToForm`) chỉ xử lý `HH:mm`.
  * Trong `lib/ziwei/true-solar-time.ts`, hàm `formatTrueSolarClock(solar, withSeconds = false)` mặc định tắt hiển thị giây (`withSeconds = false`), mặc dù thuật toán bên trong đã tính toán `second`.
* **Định dạng ngày tháng chưa theo chuẩn Việt Nam**:
  * Khắp nơi trong mã nguồn (`lib/ziwei/history.ts`, `components/BirthForm.tsx`, `components/ChartSummary.tsx`, `components/ShareCardCanvas.tsx`, `components/ChartBoard.tsx`) đang hiển thị ngày tháng theo chuẩn Trung Quốc (`YYYY年M月D日`) hoặc ISO (`YYYY-MM-DD`) thay vì chuẩn `DD/MM/YYYY HH:mm:ss`.

### 1.2. Ngôn ngữ & Thuật ngữ (Locale & Terminology Coupling)
* **Phụ thuộc chuỗi tiếng Trung trong Engine**:
  * `lib/ziwei/algorithm.ts` gọi trực tiếp `astro.bySolar(..., 'zh-CN')` và `astro.byLunar(..., 'zh-CN')`.
  * Các mảng hằng số trong `lib/ziwei/constants.ts` (`STEMS`, `BRANCHES`, `PALACE_NAMES_ORDER`, `SI_HUA_TABLE`), `lib/ziwei/school-data.ts` (`SCHOOL_STAR_ID_TO_NAME`, `BRIGHTNESS_NUM_TO_CN`), và `lib/ziwei/patterns.ts` (hơn 1.100 dòng nhận diện cách cục) đều đang so khớp (string matching) trực tiếp bằng chữ Hán giản thể (`紫微`, `命宫`, `化禄`, `庙`, `旺`...).
* **Dư thừa cấu trúc song ngữ Anh - Trung**:
  * Các tệp như `lib/ziwei/shier-shen.ts` (`SHIER_SHEN_EN`), `lib/ziwei/famous.ts` (`nameEn`, `descriptionEn`, `notableEn`), `lib/nihai/types.ts` (`nameEn`) đang lưu trữ dữ liệu tiếng Anh không cần thiết khi chuyển sang kiến trúc **Single Locale (`vi-VN`)**.

### 1.3. Lịch pháp & Múi giờ (Calendar & Timezone)
* **Lệch chuẩn múi giờ lịch pháp (UTC+8 so với UTC+7)**:
  * Thư viện `lunar-javascript` tính điểm Sóc (New Moon) và 24 Tiết khí dựa trên múi giờ Bắc Kinh (UTC+8, kinh tuyến 120°E).
  * Âm lịch Việt Nam (theo chuẩn lịch Hồ Ngọc Đức / Viện Hàn lâm KH&CN Việt Nam) sử dụng múi giờ UTC+7 (kinh tuyến 105°E). Khi thời điểm Sóc hoặc Tiết khí rơi vào khoảng `23:00:00` đến `23:59:59` giờ Việt Nam (UTC+7), tức `00:00:00` đến `00:59:59` ngày hôm sau theo giờ Bắc Kinh (UTC+8), ngày Mồng 1 Âm lịch hoặc tháng nhuận hoặc điểm giao tiết Lập Xuân của Việt Nam và Trung Quốc sẽ khác nhau (ví dụ: Tết Mậu Thân 1968, Ất Sửu 1985, Đinh Hợi 2007, Canh Tuất 2030).
  * Trong `lib/ziwei/algorithm.ts` (hàm `getLunarInfo`), việc tính Tứ Trụ qua `(Solar as any).fromYmdHms(year, month, day, effHour, 0, 0)` chỉ lấy giờ chẵn từ chỉ số Địa Chi (`hour * 2`) mà chưa truyền chính xác `HH:mm:ss` theo UTC+7.
* **Giao diện nhập liệu Âm lịch**:
  * Form nhập liệu `components/BirthForm.tsx` hiện chỉ cho nhập Dương lịch, chưa cho phép người dùng nhập theo Âm lịch (kèm tùy chọn tháng nhuận).

### 1.4. Chân Thái Dương Thời & Tọa độ Địa lý (True Solar Time & Coordinates)
* **Hardcode kinh tuyến chuẩn 120°E (UTC+8)**:
  * Trong `lib/ziwei/true-solar-time.ts`:
    ```ts
    const meridian = input.utcOffsetMinutes !== undefined && Number.isFinite(input.utcOffsetMinutes)
      ? input.utcOffsetMinutes / 4
      : 120;
    ```
    Mặc định đang lấy `480` phút (UTC+8 → 120°E). Đối với Việt Nam (UTC+7), `utcOffsetMinutes` chuẩn phải là `420` phút, tương ứng kinh tuyến chuẩn λ₀ = 105°E.
  * **Lỗi bất nhất nghiêm trọng trong `lib/ziwei/share.ts`**:
    Hàm `calcTrueSolarBranch` và `formToBirthInfo` trong `share.ts` đang tự tính tay `(longitude - 120) * 4` mà **bỏ qua Phương trình thời gian (Equation of Time - EoT)** đã được định nghĩa rất chuẩn trong `true-solar-time.ts`! Đồng thời giá trị mặc định của `longitude` trong `share.ts` và `BirthForm.tsx` đều đang gán cứng là `120` thay vì tọa độ Việt Nam.
* **Dữ liệu địa lý (`lib/ziwei/cities.ts`)**:
  * Hiện đang chứa danh sách 34 tỉnh/thành Trung Quốc, cần thay thế hoàn toàn bằng hệ thống đơn vị hành chính Việt Nam sau sắp xếp, sáp nhập theo Nghị quyết số 202/2025/QH15 của Quốc hội (gồm 34 Tỉnh/Thành phố: 6 thành phố trực thuộc Trung ương và 28 tỉnh), đồng thời lưu giữ đầy đủ các khu vực/quận/huyện và tỉnh cũ để phục vụ tra cứu kinh độ chính xác.

### 1.5. Quy tắc Giờ Mùa Hè / Lịch sử Đổi Múi Giờ (`lib/ziwei/dst-cn.ts`)
* Hiện tại `lib/ziwei/dst-cn.ts` đang kiểm tra lịch sử giờ mùa hè Trung Quốc (`XLS_CN` từ 1935–1991).
* Việt Nam không áp dụng DST kiểu hàng năm mà có **Lịch sử thay đổi múi giờ hành chính phức tạp theo thời kỳ lịch sử và vùng miền (Bắc - Nam vĩ tuyến 17)** (chuyển sang UTC+8 hoặc UTC+9). Cần xây dựng module mới thay thế hoàn toàn `dst-cn.ts`.

---

## PHẦN 2: CÁC QUYẾT ĐỊNH THIẾT KẾ ĐÃ THỐNG NHẤT

Dựa trên quá trình đối thoại và phê duyệt với người dùng, các quyết định kiến trúc cụ thể như sau:

1. **Chuẩn hóa ngôn ngữ tại biên (Boundary Normalization)**:
   * Engine `iztro` giữ nguyên lời gọi tính toán cốt lõi (`'zh-CN'`), toàn bộ đầu ra được chuẩn hóa tức thì tại biên của `lib/ziwei/algorithm.ts` thông qua bảng ánh xạ `CN_TO_VI_MAP` sang Tiếng Việt chuẩn Hán-Việt 100%.
   * Toàn bộ các module nội bộ phía trên (`types.ts`, `constants.ts`, `school-data.ts`, `sihua.ts`, `patterns.ts`, `shier-shen.ts`, `heming-knowledge.ts`, `components/*`, `app/*`) chỉ sử dụng duy nhất chuỗi Tiếng Việt, loại bỏ hoàn toàn chữ Hán và tiếng Anh dư thừa.
2. **Quy chuẩn danh xưng Cung thứ 8**:
   * Cung thứ 8 trong Thập Nhị Cung được hiển thị chuẩn hóa là: **`Nô Bộc (Giao Hữu)`**.
3. **Cơ chế nhập liệu Âm lịch tại `BirthForm.tsx`**:
   * Thêm tab chuyển đổi giữa **Dương lịch** và **Âm lịch** (có ô chọn Tháng Nhuận).
   * Khi người dùng nhập ngày Âm lịch, hệ thống tự động quy đổi ngầm sang ngày Dương lịch chuẩn Việt Nam (UTC+7) khi người dùng bấm lập lá số. **Không cần Live Preview** để giữ giao diện thanh thoát, trực quan.
4. **Cơ sở dữ liệu Địa lý 34 Tỉnh/Thành phố sau sáp nhập (`cities.ts`)**:
   * Cập nhật theo đúng **Nghị quyết số 202/2025/QH15** của Quốc hội (có hiệu lực từ ngày 12/06/2025) gồm **34 đơn vị hành chính cấp tỉnh**:
     * **06 Thành phố trực thuộc Trung ương**: Hà Nội, Hải Phòng, Huế, Đà Nẵng, TP. Hồ Chí Minh, Cần Thơ.
     * **28 Tỉnh**: Tuyên Quang, Lào Cai, Thái Nguyên, Phú Thọ, Bắc Ninh, Hưng Yên, Ninh Bình, Quảng Trị, Quảng Ngãi, Cao Bằng, Lạng Sơn, Lai Châu, Điện Biên, Sơn La, Thanh Hóa, Nghệ An, Hà Tĩnh, Quảng Ninh...
   * Bên trong mỗi đơn vị hành chính mới sẽ lưu kèm danh sách các quận/huyện và tên các tỉnh cũ tương ứng (kèm kinh độ Đông và cờ xác định Nam vĩ tuyến 17 `isSouthOf17thParallel`), đảm bảo người sinh ở bất kỳ thời kỳ lịch sử nào cũng chọn được đúng quê quán và có kinh độ chuẩn xác.
5. **Cơ sở dữ liệu Danh nhân & Lá số Mẫu (`famous.ts`)**:
   * Định vị rõ vai trò: Cung cấp các **Lá số mẫu (Sample Charts)** để người dùng tham khảo, nghiên cứu và kiểm thử các tính năng phân tích mệnh bàn, đại hạn, lưu niên, hỏi đáp AI.
   * Thay thế 11 nhân vật nước ngoài bằng bộ sưu tập danh nhân lịch sử, văn hóa, danh tướng và nhân vật tiêu biểu của Việt Nam có ngày giờ sinh đáng tin cậy.
6. **Việt hóa toàn văn 3 bộ Cổ thư (`lib/classics/data/`)**:
   * Dịch toàn bộ nội dung cả 3 tác phẩm sang chữ Quốc ngữ kèm âm Hán-Việt chuẩn:
     * `gusuifu.ts`: Cốt Tủy Phú
     * `quanji.ts`: Tử Vi Đẩu Số Toàn Tập
     * `quanshu.ts`: Tử Vi Đẩu Số Toàn Thư

---

## PHẦN 3: THIẾT KẾ KỸ THUẬT CHI TIẾT CHO 6 YÊU CẦU TRỌNG TÂM

### Yêu cầu 1: Định dạng thời gian chuẩn `DD/MM/YYYY HH:mm:ss`

1. **Xây dựng bộ hàm tiện ích trung tâm `lib/ziwei/datetime-vn.ts`**:
   * `formatDateVN(year, month, day)`: Trả về chuỗi chuẩn `DD/MM/YYYY` (luôn pad 2 chữ số cho ngày và tháng, ví dụ: `05/11/2026`).
   * `formatTimeVN(hour, minute, second = 0)`: Trả về chuỗi chuẩn `HH:mm:ss` (ví dụ: `08:05:00`).
   * `formatDateTimeVN(dt)`: Trả về chuỗi chuẩn `DD/MM/YYYY HH:mm:ss`.
   * `parseDateTimeVN(str)`: Phân tích chuỗi `DD/MM/YYYY HH:mm:ss` thành đối tượng `{ day, month, year, hour, minute, second }` kèm kiểm tra tính hợp lệ.
2. **Nâng cấp cấu trúc dữ liệu**:
   * Mở rộng `BirthInfo.origInput` trong `lib/ziwei/types.ts`: Thêm trường `clockSecond: number`.
   * Mở rộng `BirthFormState` trong `components/BirthForm.tsx`: Thêm `clockSecond: string` (mặc định `'0'`).
   * Mở rộng `TrueSolarTimeInput` trong `lib/ziwei/true-solar-time.ts`: Thêm `clockSecond?: number`. Công thức tính tổng số giây trong ngày:
     $$t_{\text{raw\_seconds}} = \text{clockHour} \times 3600 + \text{clockMinute} \times 60 + \text{clockSecond} + \text{round}(\Delta t_{\text{total\_minutes}} \times 60)$$
   * Trong `lib/ziwei/share.ts`: Cập nhật `formToSearchParams` và `searchParamsToForm` để lưu thêm tham số `s` (giây) trên URL.

---

### Yêu cầu 2: Thay thế trực tiếp thành Tiếng Việt hoàn toàn (Single Locale: `vi-VN`)

1. **Bảng Chuẩn hóa Thuật ngữ Tử Vi Việt Nam (`lib/ziwei/constants.ts` & `school-data.ts`)**:
   * **Thập Thiên Can (`STEMS`)**: `['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý']`.
   * **Thập Nhị Địa Chi (`BRANCHES`)**: `['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi']`.
   * **Thập Nhị Cung (`PALACE_NAMES_ORDER`)**: `['Mệnh', 'Huynh Đệ', 'Phu Thê', 'Tử Tức', 'Tài Bạch', 'Tật Ách', 'Thiên Di', 'Nô Bộc (Giao Hữu)', 'Quan Lộc', 'Điền Trạch', 'Phúc Đức', 'Phụ Mẫu']`.
   * **14 Chính Tinh**: `Tử Vi`, `Thiên Cơ`, `Thái Dương`, `Vũ Khúc`, `Thiên Đồng`, `Liêm Trinh`, `Thiên Phủ`, `Thái Âm`, `Tham Lang`, `Cự Môn`, `Thiên Tướng`, `Thiên Lương`, `Thất Sát`, `Phá Quân`.
   * **Lục Cát Tinh & Lục Sát Tinh**: `Văn Xương`, `Văn Khúc`, `Tả Phù`, `Hữu Bật`, `Thiên Khôi`, `Thiên Việt`, `Lộc Tồn`, `Thiên Mã` | `Kình Dương`, `Đà La`, `Hỏa Tinh`, `Linh Tinh`, `Địa Không`, `Địa Kiếp`.
   * **Tứ Hóa (`SiHua`)**: `'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ'`.
   * **Độ sáng sao (`StarBrightness`)**:
     * Hệ 7 cấp (`QS`/`XD1`): `'Miếu' | 'Vượng' | 'Đắc' | 'Bình' | 'Lợi' | 'Bất' | 'Hãm'`.
     * Hệ 5 cấp (`ZZ`/`XD2`): `'Miếu' | 'Vượng' | 'Lợi' | 'Bình' | 'Hãm'`.
   * **Ngũ Hành Cục (`JU_NAMES`)**: `{ 2: 'Thủy Nhị Cục', 3: 'Mộc Tam Cục', 4: 'Kim Tứ Cục', 5: 'Thổ Ngũ Cục', 6: 'Hỏa Lục Cục' }`.
2. **Loại bỏ mã nguồn đa ngôn ngữ dư thừa**:
   * Xóa `README.en.md` (hoặc gộp thành `README.md` tiếng Việt hoàn toàn).
   * Xóa `SHIER_SHEN_EN` và hàm `shierShenLabel(name, lang)` trong `lib/ziwei/shier-shen.ts`.
   * Xóa các trường `nameEn`, `descriptionEn`, `notableEn` trong `lib/ziwei/famous.ts` và `lib/nihai/types.ts`.

---

### Yêu cầu 3: Hiển thị cả hai lịch pháp Âm lịch và Dương lịch theo múi giờ Việt Nam (UTC+7)

1. **Chuẩn hóa Múi giờ Việt Nam (UTC+7 - `Asia/Ho_Chi_Minh`)**:
   * Mọi phép lấy thời gian hiện tại không dùng `new Date().getFullYear()` phụ thuộc máy trạm của trình duyệt hoặc server quốc tế, mà lấy theo múi giờ `Asia/Ho_Chi_Minh` (UTC+7).
2. **Xử lý Lịch Âm - Dương Việt Nam (UTC+7) trong `lib/ziwei/lunar-solar.ts` và `lib/ziwei/algorithm.ts`**:
   * Hiệu chỉnh độ lệch giao tiết Lập Xuân giữa UTC+7 và UTC+8 của `lunar-javascript`:
     $$t_{\text{UTC}+8} = t_{\text{UTC}+7} + 60\text{ phút}$$
   * Bổ sung hàm chuyển đổi lịch pháp hai chiều chuẩn Việt Nam:
     * `solarToLunarVN(year, month, day, hour, minute, second)`
     * `lunarToSolarVN(lunarYear, lunarMonth, lunarDay, isLeapMonth)`
3. **Hiển thị song song trên giao diện**:
   * **Tại `BirthForm.tsx`**: Cho phép chuyển chế độ nhập Dương lịch / Âm lịch (hỗ trợ chọn Tháng Nhuận).
   * **Tại Thiên bàn trung tâm (`ChartBoard.tsx`), `ChartSummary.tsx` và Ảnh chia sẻ (`ShareCardCanvas.tsx`)**:
     * Hiển thị đầy đủ: Dương lịch (`DD/MM/YYYY HH:mm:ss`), Âm lịch Việt Nam (`DD/MM/YYYY`), Chân Thái Dương Thời và Tứ Trụ (Năm, Tháng, Ngày, Giờ Can Chi).

---

### Yêu cầu 4: Mang bối cảnh Việt Nam

1. **Typography & Giao diện (`app/globals.css`, `components/*`)**:
   * Bộ font hỗ trợ đầy đủ dấu Tiếng Việt:
     * Font chính: `'Be Vietnam Pro', 'Inter', sans-serif`.
     * Font cổ phong / tiêu đề: `'Noto Serif', Georgia, serif`.
     * Font số / giờ: `'JetBrains Mono', Consolas, monospace`.
2. **Danh nhân & Lá số Mẫu Việt Nam (`lib/ziwei/famous.ts`)**:
   * Bộ sưu tập danh nhân tiêu biểu của Việt Nam (Lịch sử, Văn hóa, Doanh nhân...).
3. **Thư viện Kinh điển & Hệ thống Tri thức (`lib/classics/*`, `lib/seo/*`, `lib/ziwei/patterns.ts`)**:
   * Việt hóa toàn bộ 38+ cách cục trong `patterns.ts`.
   * Việt hóa toàn văn 3 bộ kinh điển trong `lib/classics/data/` (`Cốt Tủy Phú`, `Tử Vi Đẩu Số Toàn Tập`, `Tử Vi Đẩu Số Toàn Thư`) sang chữ Quốc ngữ kèm âm Hán-Việt.
   * Cập nhật `InsightPanel.tsx` và `ChatPanel.tsx` với câu hỏi gợi ý và phản hồi bằng Tiếng Việt.
4. **SEO, Metadata & Pháp lý**:
   * Cập nhật `<html lang="vi">`, `openGraph.locale` thành `'vi_VN'`.
   * Xóa bỏ mã xác thực Baidu, 360 và giấy phép ICP Trung Quốc ở Footer; cập nhật Điều khoản và Chính sách bảo mật theo chuẩn Việt Nam.

---

### Yêu cầu 5: Cập nhật Chân Thái Dương Thời và Tọa độ Địa lý Việt Nam (34 Tỉnh/Thành NQ 202/2025/QH15)

1. **Công thức Toán học Chân Thái Dương Thời cho Việt Nam (`lib/ziwei/true-solar-time.ts`)**:
   * Múi giờ chuẩn: $\text{utcOffsetMinutes}_{\text{VN}} = 7 \times 60 = 420\text{ phút}$.
   * Kinh tuyến chuẩn: $\lambda_0 = 105^\circ\text{E}$.
   * Độ lệch thời gian kinh độ:
     $$\Delta t_{\text{lon}} = (\lambda_{\text{local}} - 105) \times 4\text{ (phút)}$$
   * Phương trình thời gian (NOAA Spencer):
     $$\gamma = \frac{2\pi}{N_{\text{days}}} \left( \text{DOY} - 1 + \frac{h_{\text{frac}} - 12}{24} \right)$$
     $$\Delta t_{\text{EoT}} = 229.18 \times \left(0.000075 + 0.001868\cos\gamma - 0.032077\sin\gamma - 0.014615\cos(2\gamma) - 0.040849\sin(2\gamma)\right)$$
   * Tổng độ lệch Chân Thái Dương Thời:
     $$\Delta t_{\text{total}} = \Delta t_{\text{lon}} + \Delta t_{\text{EoT}}\text{ (phút)}$$
2. **Hợp nhất logic trong `lib/ziwei/share.ts` và `lib/ziwei/true-solar-time.ts`**:
   * `share.ts` gọi trực tiếp `calculateTrueSolarTime` thay vì tính thủ công; kinh độ chuẩn mặc định là `105.85` (Hà Nội) hoặc `105.0`.
3. **Cơ sở dữ liệu 34 Tỉnh/Thành phố sau sáp nhập (`lib/ziwei/cities.ts`)**:
   * Thiết kế interface:
     ```ts
     export interface CityInfo {
       name: string;        // Tên Quận / Huyện / Khu vực / Tỉnh cũ trước sáp nhập
       longitude: number;   // Kinh độ Đông
       latitude?: number;   // Vĩ độ Bắc
     }

     export interface ProvinceInfo {
       name: string;        // 34 Tỉnh/Thành phố theo NQ 202/2025/QH15
       region: 'north' | 'central' | 'south';
       isSouthOf17thParallel: boolean; // Phục vụ quy tắc giờ mùa hè 1954-1975
       cities: CityInfo[];
     }
     ```

---

### Yêu cầu 6: Quy tắc Giờ Mùa Hè & Lịch sử Múi Giờ của Việt Nam (`lib/ziwei/dst-vn.ts`)

Bảng quy tắc lịch sử 4 giai đoạn đổi múi giờ tại Việt Nam:

| Giai đoạn | Từ ngày | Đến ngày | Phạm vi | Múi giờ | Bù giờ về UTC+7 | Ghi chú |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **1. Thế chiến II** | `01/01/1943` | `14/03/1945` | Toàn quốc | UTC+8 | -60 phút | Pháp đổi sang giờ mùa hè UTC+8. |
| **2. Nhật chiếm đóng** | `15/03/1945` | `01/09/1945` | Toàn quốc | UTC+9 | -120 phút | Áp dụng giờ Tokyo UTC+9. |
| **3. Đông Dương** | `01/04/1947` | `30/06/1955` | Vùng Pháp KS / Miền Nam | UTC+8 | -60 phút | Hà Nội về UTC+7 sau ngày 10/10/1954. |
| **4. Miền Nam 1960–1975** | `01/01/1960` | `12/06/1975` | Nam vĩ tuyến 17 | UTC+8 | -60 phút | Miền Nam áp dụng UTC+8 (Sắc lệnh 362-TTP). Thống nhất về UTC+7 từ 13/06/1975. |

---

## PHẦN 4: KẾ HOẠCH THỰC THI THEO TỪNG GIAI ĐOẠN

### Giai đoạn 1: Tái cấu trúc Lõi Thời Gian, Lịch Pháp & Địa Lý (`lib/ziwei/`)
1. `[TẠO MỚI] lib/ziwei/datetime-vn.ts`: Hàm format `DD/MM/YYYY`, `HH:mm:ss`, timezone `Asia/Ho_Chi_Minh`.
2. `[TẠO MỚI/THAY THẾ] lib/ziwei/dst-vn.ts`: Bảng lịch sử 4 giai đoạn đổi giờ Việt Nam (`VN_TIMEZONE_PERIODS`).
3. `[CẬP NHẬT] lib/ziwei/clock-adjust.ts`: Nâng cấp hỗ trợ `clockSecond` và dịch giờ -60 / -120 phút.
4. `[CẬP NHẬT] lib/ziwei/true-solar-time.ts`: Mặc định λ₀ = 105°E (UTC+7, 420 phút), hỗ trợ `clockSecond`.
5. `[CẬP NHẬT] lib/ziwei/cities.ts`: Thay thế bằng 34 Tỉnh/Thành phố theo NQ 202/2025/QH15 kèm khu vực/tỉnh cũ.
6. `[CẬP NHẬT] lib/ziwei/lunar-solar.ts`: Hàm `solarToLunarVN`, `lunarToSolarVN` chuẩn UTC+7.
7. `[CẬP NHẬT] lib/ziwei/share.ts`: Tích hợp `calculateTrueSolarTime`, lưu tham số `s` trên URL.

### Giai đoạn 2: Việt hóa Hoàn toàn Engine Tử Vi Đẩu Số (`lib/ziwei/`)
1. `[CẬP NHẬT] lib/ziwei/types.ts`: Chuẩn hóa kiểu dữ liệu Tiếng Việt (`SiHua`, `StarBrightness`, `clockSecond`).
2. `[CẬP NHẬT] lib/ziwei/constants.ts`: Việt hóa Can Chi, Cung vị (`Nô Bộc (Giao Hữu)`), Ngũ Hành Cục, Tứ Hóa.
3. `[CẬP NHẬT] lib/ziwei/school-data.ts` & `school-config.ts`: Việt hóa 82 sao, bảng miếu hãm, nhãn trường phái.
4. `[CẬP NHẬT] lib/ziwei/algorithm.ts`: Ánh xạ tại biên `CN_TO_VI_MAP`, tính Lập Xuân UTC+7.
5. `[CẬP NHẬT] lib/ziwei/sihua.ts`, `shier-shen.ts`, `yunxian-context.ts`, `history.ts`: Việt hóa toàn bộ hằng số và định dạng lịch sử `DD/MM/YYYY HH:mm:ss`.
6. `[CẬP NHẬT] lib/ziwei/patterns.ts`: Việt hóa 38+ cách cục.

### Giai đoạn 3: Việt hóa Cơ sở Tri thức, Kinh điển & Danh nhân
1. `[CẬP NHẬT] lib/ziwei/famous.ts`: Danh nhân lịch sử - văn hóa Việt Nam làm lá số mẫu.
2. `[CẬP NHẬT] lib/ziwei/db-analysis.ts`, `heming-knowledge.ts`, `lib/seo/knowledge.ts`: Việt hóa tri thức và SEO.
3. `[CẬP NHẬT] lib/classics/data/*.ts`: Dịch toàn văn `gusuifu.ts`, `quanji.ts`, `quanshu.ts` sang Quốc ngữ kèm âm Hán-Việt.

### Giai đoạn 4: Nâng cấp Giao diện Người dùng (`components/` & `app/`)
1. `[CẬP NHẬT] components/BirthForm.tsx`: Tab Âm/Dương lịch, chọn giây `HH:mm:ss`, cảnh báo giờ mùa hè lịch sử.
2. `[CẬP NHẬT] components/ChartBoard.tsx`, `PalaceCell.tsx`, `TimeNav.tsx`: Hiển thị song song Âm - Dương, nhãn tiếng Việt.
3. `[CẬP NHẬT] components/ChartSummary.tsx`, `PatternsCard.tsx`, `StarDetailPanel.tsx`, `FamousPersonCard.tsx`.
4. `[CẬP NHẬT] components/ShareCardCanvas.tsx`, `ShareModal.tsx`, `InsightPanel.tsx`, `ChatPanel.tsx`.
5. `[CẬP NHẬT] app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `app/chart/page.tsx`, `app/terms/page.tsx`, `app/privacy/page.tsx`.

### Giai đoạn 5: Cập nhật Hệ thống Kiểm thử Hồi quy (`scripts/regression/`)
1. Cập nhật toàn bộ các bài test sang kiểm tra theo chuẩn múi giờ UTC+7, kinh tuyến 105°E, quy tắc giờ Việt Nam và nhãn Tiếng Việt.

---

## PHẦN 5: DANH SÁCH KIỂM TRA NGHIỆM THU

- [x] **Tiêu chí 1 (Định dạng thời gian)**: Mọi nơi hiển thị và nhập liệu thời gian đều tuân thủ nghiêm ngặt định dạng `DD/MM/YYYY HH:mm:ss`.
- [x] **Tiêu chí 2 (Single Locale `vi-VN`)**: Không còn ký tự chữ Hán hoặc nhãn tiếng Anh thừa trên giao diện và trong `ZiweiChart`.
- [x] **Tiêu chí 3 (Song hành Âm - Dương lịch UTC+7)**: Nhập và đối chiếu chính xác lịch Âm - Dương theo múi giờ Việt Nam.
- [x] **Tiêu chí 4 (Bối cảnh Việt Nam)**: Font chữ hỗ trợ tiếng Việt, danh nhân Việt Nam, tên cung `Nô Bộc (Giao Hữu)`, thuật ngữ Tử Vi chuẩn Việt.
- [x] **Tiêu chí 5 (Chân Thái Dương Thời & Tọa độ 34 Tỉnh/Thành NQ 202/2025/QH15)**: Kinh tuyến chuẩn λ₀ = 105°E (UTC+7, 420 phút), Phương trình thời gian EoT, dữ liệu 34 Tỉnh/Thành phố sau sáp nhập.
- [x] **Tiêu chí 6 (Giờ mùa hè lịch sử Việt Nam)**: Nhận diện chính xác 4 giai đoạn đổi giờ lịch sử Việt Nam và hỗ trợ nút chuyển đổi về UTC+7.
- [x] **Tiêu chí 7 (Kho thư tịch cổ)**: Dịch trọn vẹn cả 3 bộ cổ thư sang Quốc ngữ kèm âm Hán-Việt.
