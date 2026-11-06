# KẾ HOẠCH KHẮC PHỤC LỖI KỸ THUẬT & CẬP NHẬT MÃ NGUỒN (PLAN-UPDATE.MD)
*Dự án: Tử Vi Đẩu Số Việt Nam (Vietnam Edition)*
*Phiên bản: 1.1.0-patch*

---

## TỔNG QUAN

Qua quá trình rà soát chi tiết toàn bộ mã nguồn (`source-review.txt` và `source-review-part2.txt`) trên commit mới nhất, hệ thống đã hoàn thiện khung sườn bản địa hóa (Single Locale `vi-VN`, múi giờ $\text{UTC}+7$, Chân Thái Dương Thời $105^\circ\text{E}$ và dịch thuật cổ thư). Tuy nhiên, hiện tại mã nguồn đang tồn tại **8 lỗi kỹ thuật cốt lõi (Critical & High)** gây sai lệch kết quả hiển thị tinh bàn, tê liệt một số tính năng nhận diện cách cục, tìm kiếm cổ thư và xuất thẻ chia sẻ.

Tài liệu này cung cấp bảng phân tích nguyên nhân gốc rễ (Root Cause), hậu quả thực tế và đoạn mã vá (patch code) cụ thể cho từng tập tin.

---

## DANH MỤC 8 LỖI KỸ THUẬT & GIẢI PHÁP VÁ CHI TIẾT

### Lỗi 1: Mất Trắng Độ Sáng Tinh Tú (`brightnessRaw` & `brightness`)
* **Mức độ**: 🔴 Nghiêm trọng (Critical)
* **Tập tin ảnh hưởng**: `lib/ziwei/algorithm.ts`
* **Nguyên nhân**:
  Hàm `schoolStarBrightness()` trong `lib/ziwei/school-data.ts` đã được Việt hóa để trả về các chuỗi ký tự tiếng Việt (`'Miếu'`, `'Vượng'`, `'Đắc'`, `'Lợi'`, `'Bình'`, `'Bất'`, `'Hãm'`). Tuy nhiên, trong `lib/ziwei/algorithm.ts`, hai hàm phân loại `extractRawBrightness()` và `mapBrightness()` vẫn chỉ kiểm tra chuỗi Hán tự giản thể (`'庙'`, `'旺'`, `'得'`, `'利'`, `'平'`, `'不'`, `'闲'`, `'陷'`).
* **Hậu quả**:
  * `extractRawBrightness` trả về `undefined` cho 100% các sao trên toàn bộ lá số, khiến nhãn độ sáng (ví dụ: `[Miếu]`, `[Vượng]`) biến mất trên ô cung.
  * `mapBrightness` luôn rơi vào nhánh mặc định `'normal'`, làm mất hoàn toàn màu sắc phân cấp miếu hãm (vàng kim rực rỡ cho Miếu/Vượng hoặc xám đỏ cho Hãm).
* **Mã nguồn khắc phục**:

```ts
// lib/ziwei/algorithm.ts

function mapBrightness(b?: string): 'bright' | 'normal' | 'dim' {
  if (!b) return 'normal';
  if (b === '庙' || b === '旺' || b === 'Miếu' || b === 'Vượng') return 'bright';
  if (b === '陷' || b === '不' || b === '闲' || b === 'Hãm' || b === 'Bất' || b === 'Nhàn') return 'dim';
  return 'normal';
}

function extractRawBrightness(b?: string): import('./types').StarBrightness | undefined {
  if (!b) return undefined;
  const mapCnToVi: Record<string, import('./types').StarBrightness> = {
    '庙': 'Miếu', '旺': 'Vượng', '得': 'Đắc', '利': 'Lợi',
    '平': 'Bình', '不': 'Bất', '闲': 'Nhàn', '陷': 'Hãm', '地': 'Địa',
  };
  if (mapCnToVi[b]) return mapCnToVi[b];
  const validVi: import('./types').StarBrightness[] = [
    'Miếu', 'Vượng', 'Đắc', 'Lợi', 'Bình', 'Bất', 'Nhàn', 'Hãm', 'Địa'
  ];
  for (const x of validVi) {
    if (b.includes(x)) return x;
  }
  return undefined;
}
```

---

### Lỗi 2: Gãy Bộ Nhận Diện 38 Cách Cục Trong `patterns.ts`
* **Mức độ**: 🔴 Nghiêm trọng (Critical)
* **Tập tin ảnh hưởng**: `lib/ziwei/patterns.ts`
* **Nguyên nhân**:
  1. *Lệch chuỗi Tứ Hóa*: Các detector kiểm tra `s.siHua === '禄'`, `'权'`, `'科'`, `'忌'` trong khi `generateChart()` đã chuyển trường này thành `'Lộc'`, `'Quyền'`, `'Khoa'`, `'Kỵ'`.
  2. *Lệch tên Cung*: Các hàm `detectHuaLuRuCai` và `detectHuaQuanRuGuan` tìm kiếm `p.name === '财帛'` và `p.name === '官禄'`, trong khi tên cung đã được Việt hóa thành `'Tài Bạch'` và `'Quan Lộc'`.
  3. *Lệch mảng lọc cung trong Sát Phá Lang*: Đoạn `has.includes(getMajorStarNames(p)[0])` so sánh mảng chữ Hán `['七杀', '破军', '贪狼']` với tên sao tiếng Việt, khiến mảng `palaces` trả về rỗng (`[]`).
  4. *Lệch khóa `PATTERN_NAME_VI`*: Nhiều cách cục có tên tạo ra không khớp key từ điển (ví dụ: `武贪格` vs `武贪同行`, `廉贞天相格` vs `廉相同宫`), dẫn đến việc tên cách cục không được chuyển ngữ và nội dung `description` vẫn là chữ Hán.
* **Hậu quả**: Không nhận diện được hầu hết các cách cục lớn (Tam Kỳ Gia Hội, Song Lộc Triều Viên, Hóa Lộc Nhập Mệnh/Tài, Hóa Quyền Nhập Quan, v.v.).
* **Mã nguồn khắc phục**:

```ts
// lib/ziwei/patterns.ts

// 1. Tạo hàm trợ thủ kiểm tra Tứ Hóa song ngữ an toàn
function isSiHua(starSiHua: string | undefined, target: 'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ'): boolean {
  if (!starSiHua) return false;
  const map: Record<string, string> = { '禄': 'Lộc', '权': 'Quyền', '科': 'Khoa', '忌': 'Kỵ' };
  return starSiHua === target || map[starSiHua] === target;
}

// 2. Chuẩn hóa hàm kiểm tra Tứ Hóa trong Cung và Tam Phương
function palaceHasSiHua(palace: Palace, hua: 'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ' | '禄' | '权' | '科' | '忌'): boolean {
  const map: Record<string, string> = { '禄': 'Lộc', '权': 'Quyền', '科': 'Khoa', '忌': 'Kỵ' };
  const targetVi = (map[hua] ?? hua) as 'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ';
  return palace.stars.some(s => isSiHua(s.siHua, targetVi));
}

function sanFangHasSiHua(chart: ZiweiChart, hua: 'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ' | '禄' | '权' | '科' | '忌'): boolean {
  return getSanFangPalaces(chart).some(p => palaceHasSiHua(p, hua));
}

// 3. Sửa hàm tìm Cung Tài Bạch / Quan Lộc theo tên song ngữ
function detectHuaLuRuCai(chart: ZiweiChart, patterns: Pattern[]) {
  const cai = chart.palaces.find(p => p.name === 'Tài Bạch' || p.name === '财帛');
  if (!cai) return;
  const luStar = cai.stars.find(s => s.type === 'major' && isSiHua(s.siHua, 'Lộc'));
  if (!luStar) return;
  patterns.push({
    name: 'Hóa Lộc Nhập Tài',
    level: 'good',
    description: `${luStar.name} Hóa Lộc nhập cung Tài Bạch, chủ nguồn tiền tài thông suốt, nguồn thu dồi dào ổn định. Năng lực kiếm tiền gắn liền với tính chất cốt lõi của sao ${luStar.name}.`,
    palaces: [cai.name],
    conditions: { required: [`${luStar.name} Hóa Lộc nhập cung Tài Bạch`] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Tứ Hóa Luận》',
  });
}

function detectHuaQuanRuGuan(chart: ZiweiChart, patterns: Pattern[]) {
  const guan = chart.palaces.find(p => p.name === 'Quan Lộc' || p.name === '官禄');
  if (!guan) return;
  const quanStar = guan.stars.find(s => s.type === 'major' && isSiHua(s.siHua, 'Quyền'));
  if (!quanStar) return;
  patterns.push({
    name: 'Hóa Quyền Nhập Quan',
    level: 'good',
    description: `${quanStar.name} Hóa Quyền nhập cung Quan Lộc, chủ sự nghiệp có thực quyền, năng lực quản lý điều hành xuất sắc, có thể gánh vác trọng trách độc lập.`,
    palaces: [guan.name],
    conditions: { required: [`${quanStar.name} Hóa Quyền nhập cung Quan Lộc`] },
    source: '《Tử Vi Đẩu Số Toàn Thư · Tứ Hóa Luận》',
  });
}

// 4. Sửa mảng palaces trong Sát Phá Lang & Cơ Nguyệt Đồng Lương
// Trong detectShaPoLang:
palaces: getSanFangPalaces(chart).filter(p => has.some(s => matchStarName(getMajorStarNames(p)[0] || '', s))).map(p => p.name);

// Trong detectJiYueTongLiang:
palaces: getSanFangPalaces(chart).filter(p => has.some(s => getMajorStarNames(p).some(ms => matchStarName(ms, s)))).map(p => p.name);
```

---

### Lỗi 3: Khởi Tạo Form Sai Tên Khiến Tê Liệt Menu Huyện/Thị Xã
* **Mức độ**: 🔴 Nghiêm trọng (Critical)
* **Tập tin ảnh hưởng**: `components/BirthForm.tsx`
* **Nguyên nhân**:
  Trong `components/BirthForm.tsx`, state mặc định được khởi tạo là:
  `province: 'Hà Nội'` và `city: 'Hà Nội'`.
  Tuy nhiên, trong danh mục hành chính `lib/ziwei/cities.ts`, tên tỉnh được khai báo chuẩn hóa là:
  `'Thành phố Hà Nội'` và thành phố/quận là `'Trung tâm Hà Nội (Hoàn Kiếm)'`.
* **Hậu quả**:
  Khi người dùng tải trang, lệnh `PROVINCES.find(p => p.name === form.province)` trả về `undefined`. Danh sách quận/huyện (`cityList`) bị rỗng. Ô chọn huyện/thị xã bị vô hiệu hóa (disabled) và hiển thị `"Chọn Tỉnh/TP trước"` dù ô Tỉnh đang hiển thị `"Hà Nội"`.
* **Mã nguồn khắc phục**:

```tsx
// components/BirthForm.tsx

const [form, setForm] = useState<BirthFormState>({
  name: initialData?.name ?? '',
  year: initialData?.year ?? '',
  month: initialData?.month ?? '',
  day: initialData?.day ?? '',
  clockHour: initialData?.clockHour ?? '8',
  clockMinute: initialData?.clockMinute ?? '0',
  clockSecond: initialData?.clockSecond ?? '0',
  unknownTime: initialData?.unknownTime ?? false,
  // Sửa đúng tên chuẩn theo cities.ts
  province: initialData?.province ?? 'Thành phố Hà Nội',
  city: initialData?.city ?? 'Trung tâm Hà Nội (Hoàn Kiếm)',
  longitude: initialData?.longitude ?? DEFAULT_LONGITUDE,
  gender: initialData?.gender ?? 'male',
  calendarType: initialData?.calendarType ?? 'solar',
  isLeapMonth: initialData?.isLeapMonth ?? false,
});
```

---

### Lỗi 4: Đảo Chiều Phép Tính Quy Đổi Múi Giờ Lịch Sử Việt Nam
* **Mức độ**: 🔴 Nghiêm trọng (Critical)
* **Tập tin ảnh hưởng**: `components/BirthForm.tsx`
* **Nguyên nhân**:
  Trong `lib/ziwei/dst-vn.ts`, giá trị `deltaMinutes` của các giai đoạn $\text{UTC}+8$ và $\text{UTC}+9$ được gán giá trị âm (`-60` và `-120` phút) nhằm chỉ ra số phút cần cộng/trừ để đưa về giờ $\text{UTC}+7$.
  Tuy nhiên trong `BirthForm.tsx`, hàm xử lý nút bấm lại viết:
  ```ts
  const adjustedMinutes = (totalMinutes - historicalTz.deltaMinutes + 1440) % 1440;
  ```
  Phép toán `totalMinutes - (-60)` trở thành **cộng thêm 60 phút**!
* **Hậu quả**:
  Một người sinh lúc `09:15` trong giai đoạn $\text{UTC}+8$ (cần lùi về `08:15` $\text{UTC}+7$) khi bấm nút quy đổi lại bị đẩy lên thành `10:15` (lệch hẳn 2 tiếng, nhảy sang một giờ Địa Chi khác). Nhãn trên nút bấm hiển thị lỗi thẩm mỹ: `(- -60 phút)`.
* **Mã nguồn khắc phục**:

```tsx
// components/BirthForm.tsx

const handleApplyHistoricalTzAdjust = () => {
  if (!historicalTz || historicalTz.deltaMinutes === 0) return;
  const totalMinutes = (parseInt(form.clockHour, 10) || 0) * 60 + (parseInt(form.clockMinute, 10) || 0);
  // deltaMinutes mang dấu âm (-60 hoặc -120), dùng phép cộng để lùi giờ về UTC+7 chuẩn xác
  const adjustedMinutes = (totalMinutes + historicalTz.deltaMinutes + 1440) % 1440;
  const newH = Math.floor(adjustedMinutes / 60);
  const newM = adjustedMinutes % 60;
  setForm(prev => ({
    ...prev,
    clockHour: String(newH),
    clockMinute: String(newM),
  }));
};
```
Và cập nhật nhãn nút bấm:
```tsx
<button type="button" onClick={handleApplyHistoricalTzAdjust} ...>
  Tự động quy đổi về UTC+7 ({historicalTz.deltaMinutes} phút)
</button>
```

---

### Lỗi 5: Bàn Cờ Bị Lộn Ngược $180^\circ$ Trên Thẻ Chia Sẻ PNG
* **Mức độ**: 🟠 Cao (High)
* **Tập tin ảnh hưởng**: `components/ShareCardCanvas.tsx`
* **Nguyên nhân**:
  Mảng tọa độ `ZHIWEI_LAYOUT` trong `ShareCardCanvas.tsx` đang gán cung Dần (branch 2) ở góc trên bên trái (`row: 0, col: 0`) và cung Hợi ở góc dưới bên trái (`row: 3, col: 0`). Ngược lại, bàn cờ chính thống trong `ChartBoard.tsx` (và đồ hình Tử Vi truyền thống) xếp hàng trên cùng là Tỵ (5) – Ngọ (6) – Mùi (7) – Thân (8), hàng dưới cùng là Dần (2) – Sửu (1) – Tý (0) – Hợi (11).
* **Hậu quả**:
  Ảnh PNG tải về để chia sẻ trên mạng xã hội bị lộn ngược hoàn toàn so với lá số người dùng đang nhìn trên màn hình web.
* **Mã nguồn khắc phục**:

```ts
// components/ShareCardCanvas.tsx

// Chuẩn hóa đúng bố cục Địa Bàn 12 Cung Tử Vi
const ZHIWEI_LAYOUT: Array<{ branch: number; row: number; col: number }> = [
  // Hàng 1 (trên cùng): Tỵ, Ngọ, Mùi, Thân
  { branch: 5,  row: 0, col: 0 },
  { branch: 6,  row: 0, col: 1 },
  { branch: 7,  row: 0, col: 2 },
  { branch: 8,  row: 0, col: 3 },
  // Hàng 2: Thìn (trái), Dậu (phải)
  { branch: 4,  row: 1, col: 0 },
  { branch: 9,  row: 1, col: 3 },
  // Hàng 3: Mão (trái), Tuất (phải)
  { branch: 3,  row: 2, col: 0 },
  { branch: 10, row: 2, col: 3 },
  // Hàng 4 (dưới cùng): Dần, Sửu, Tý, Hợi
  { branch: 2,  row: 3, col: 0 },
  { branch: 1,  row: 3, col: 1 },
  { branch: 0,  row: 3, col: 2 },
  { branch: 11, row: 3, col: 3 },
];
```

---

### Lỗi 6: In Số Thứ Tự Thay Vì Tên Can/Chi Trong Luận Đoán AI
* **Mức độ**: 🟡 Trung bình (Medium)
* **Tập tin ảnh hưởng**: `app/api/interpret/route.ts`
* **Nguyên nhân**:
  Trong hàm luận giải ngoại tuyến `generateOfflineInterpretation`, template string đang chèn trực tiếp thuộc tính index dạng số `${palace.branch}` và `${palace.stem}` vào câu văn tiếng Việt:
  ```ts
  `Cung Phu Thê tại địa chi **${phuThe?.branch ?? ''}**...` // In ra: Cung Phu Thê tại địa chi 1
  `Cung can là **${targetPalace.stem}**...`                // In ra: Cung can là 0
  ```
* **Hậu quả**: Lời văn phản hồi của AI bị ngô nghê, hiển thị số nguyên thay vì tên chữ (ví dụ: "địa chi 1" thay vì "địa chi Sửu", "Cung can là 0" thay vì "Cung can là Giáp").
* **Mã nguồn khắc phục**:

```ts
// app/api/interpret/route.ts

// Chuyển đổi sang tên Can Chi tiếng Việt thông qua mảng hằng số STEMS và BRANCHES
const phuTheBranchName = phuThe ? BRANCHES[phuThe.branch] : '';
const quanLocBranchName = quanLoc ? BRANCHES[quanLoc.branch] : '';
const taiBachBranchName = taiBach ? BRANCHES[taiBach.branch] : '';
const targetBranchName = targetPalace ? BRANCHES[targetPalace.branch] : '';
const targetStemName = targetPalace ? STEMS[targetPalace.stem] : '';
```

---

### Lỗi 7: Tìm Kiếm Cổ Thư Bị Liệt Với Chữ Thường & Từ Dịch Nghĩa
* **Mức độ**: 🟡 Trung bình (Medium)
* **Tập tin ảnh hưởng**: `lib/classics/index.ts`
* **Nguyên nhân**:
  Hàm `searchClassics(query)` sử dụng `p.text.indexOf(q)` (phân biệt hoa thường) và chỉ tìm kiếm trên trường `p.text` (âm Hán-Việt), bỏ qua trường `p.translation` (bản dịch nghĩa tiếng Việt).
* **Hậu quả**:
  Khi người dùng tìm kiếm từ khóa viết thường như `"thất sát"` (thay vì `"Thất Sát"`), hoặc tìm các từ ngữ dịch nghĩa phổ thông như `"vợ chồng"`, `"tiền của"`, `"con cái"`, kết quả luôn trả về rỗng.
* **Mã nguồn khắc phục**:

```ts
// lib/classics/index.ts

export function searchClassics(query: string, limit = 30): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 1) return [];

  const hits: SearchHit[] = [];
  for (const book of ALL_BOOKS) {
    for (const chapter of book.chapters) {
      for (const p of chapter.paragraphs) {
        const textLower = p.text.toLowerCase();
        const transLower = (p.translation || '').toLowerCase();

        let matchField: 'text' | 'translation' | null = null;
        let matchIdx = textLower.indexOf(q);
        if (matchIdx >= 0) {
          matchField = 'text';
        } else {
          matchIdx = transLower.indexOf(q);
          if (matchIdx >= 0) matchField = 'translation';
        }

        if (!matchField || matchIdx < 0) continue;

        const sourceStr = matchField === 'text' ? p.text : p.translation!;
        const start = Math.max(0, matchIdx - 40);
        const end = Math.min(sourceStr.length, matchIdx + q.length + 40);
        const before = sourceStr.slice(start, matchIdx);
        const matched = sourceStr.slice(matchIdx, matchIdx + q.length);
        const after = sourceStr.slice(matchIdx + q.length, end);

        const snippet = (start > 0 ? '…' : '')
          + escapeHtml(before)
          + `<mark>${escapeHtml(matched)}</mark>`
          + escapeHtml(after)
          + (end < sourceStr.length ? '…' : '');

        hits.push({
          bookSlug: book.slug,
          bookTitle: book.title,
          chapterTitle: chapter.title,
          paragraphId: p.id,
          snippet,
          text: p.text,
        });

        if (hits.length >= limit) return hits;
      }
    }
  }
  return hits;
}
```

---

### Lỗi 8: Danh Mục 34 Tỉnh/Thành NQ 202/2025/QH15 & Dọn Dẹp Mã Thừa
* **Mức độ**: 🟠 Cao (High)
* **Tập tin ảnh hưởng**: `lib/ziwei/cities.ts`, `package.json`, `lib/ziwei/dst-cn.ts`
* **Nguyên nhân**:
  1. `lib/ziwei/cities.ts` chỉ có 30 tỉnh thành (thiếu 4 tỉnh) và phương án ghép tỉnh chưa chuẩn theo Nghị quyết 202/2025/QH15 (thiếu Gia Lai, Đắk Lắk, Tây Ninh, Đồng Tháp, Cà Mau độc lập sau sáp nhập).
  2. Chưa có cờ `isSouthOf17thParallel: true` cho riêng `TP. Đông Hà` và `TX. Quảng Trị` trong tỉnh Quảng Trị mới (vốn bao gồm cả Quảng Bình cũ nằm ở bờ Bắc).
  3. Hai tệp thừa `lib/ziwei/dst-cn.ts` và `scripts/regression/dst-cn.test.ts` vẫn còn tồn tại.
  4. Script `"test"` trong `package.json` chỉ gọi 4 test file, bỏ qua các test hồi quy còn lại.
* **Mã nguồn khắc phục**:
  * **Cập nhật danh mục chuẩn 34 đơn vị hành chính cấp tỉnh trong `cities.ts`**:
    * **06 Thành phố trực thuộc TW**: Hà Nội, Hải Phòng (gộp Hải Dương), Huế, Đà Nẵng (gộp Quảng Nam), TP. Hồ Chí Minh (gộp Bình Dương, Bà Rịa - Vũng Tàu), Cần Thơ (gộp Hậu Giang, Sóc Trăng).
    * **28 Tỉnh**: Cao Bằng, Lạng Sơn, Quảng Ninh, Lai Châu, Điện Biên, Sơn La, Tuyên Quang (gộp Hà Giang), Lào Cai (gộp Yên Bái), Thái Nguyên (gộp Bắc Kạn), Phú Thọ (gộp Vĩnh Phúc, Hòa Bình), Bắc Ninh (gộp Bắc Giang), Hưng Yên (gộp Thái Bình), Ninh Bình (gộp Hà Nam, Nam Định), Thanh Hóa, Nghệ An, Hà Tĩnh, Quảng Trị (gộp Quảng Bình), Quảng Ngãi (gộp Kon Tum), **Gia Lai** (gộp Bình Định), **Đắk Lắk** (gộp Phú Yên), Khánh Hòa (gộp Ninh Thuận), Lâm Đồng (gộp Đắk Nông, Bình Thuận), Đồng Nai (gộp Bình Phước), **Tây Ninh** (gộp Long An), **Đồng Tháp** (gộp Tiền Giang), Vĩnh Long (gộp Bến Tre, Trà Vinh), An Giang (gộp Kiên Giang), **Cà Mau** (gộp Bạc Liêu).
  * **Gán cờ chi tiết cho Quảng Trị**:
    ```ts
    {
      name: 'Tỉnh Quảng Trị',
      region: 'central',
      isSouthOf17thParallel: false,
      cities: [
        { name: 'Khu vực Đồng Hới (Quảng Bình cũ)', longitude: 106.62, latitude: 17.47, isSouthOf17thParallel: false },
        { name: 'TX. Ba Đồn (Quảng Bình cũ)', longitude: 106.42, latitude: 17.75, isSouthOf17thParallel: false },
        { name: 'TP. Đông Hà (Nam vĩ tuyến 17)', longitude: 107.09, latitude: 16.82, isSouthOf17thParallel: true },
        { name: 'TX. Quảng Trị (Nam vĩ tuyến 17)', longitude: 107.19, latitude: 16.75, isSouthOf17thParallel: true },
        { name: 'Vĩnh Linh (Bắc sông Bến Hải)', longitude: 107.03, latitude: 17.06, isSouthOf17thParallel: false },
      ],
    }
    ```
  * **Xóa tệp**: Xóa bỏ `lib/ziwei/dst-cn.ts` và `scripts/regression/dst-cn.test.ts`.
  * **Cập nhật script `"test"` trong `package.json`**:
    ```json
    "scripts": {
      "dev": "next dev",
      "build": "next build --webpack",
      "start": "next start",
      "typecheck": "tsc --noEmit",
      "test": "tsx scripts/regression/dst-vn.test.ts && tsx scripts/regression/famous-hour-consistency.test.ts && tsx scripts/regression/clock-adjust.test.ts && tsx scripts/regression/gender-validation.test.ts && tsx scripts/regression/solar-date-exists.test.ts && tsx scripts/regression/form-true-solar-day.test.ts"
    }
    ```

---

## QUY TRÌNH THỰC HIỆN VÀ KIỂM TRA NGHIỆM THU

### Bước 1: Áp dụng các bản vá
1. Áp dụng bản vá Lỗi 1 vào `lib/ziwei/algorithm.ts`.
2. Áp dụng bản vá Lỗi 2 vào `lib/ziwei/patterns.ts`.
3. Áp dụng bản vá Lỗi 3 & 4 vào `components/BirthForm.tsx`.
4. Áp dụng bản vá Lỗi 5 vào `components/ShareCardCanvas.tsx`.
5. Áp dụng bản vá Lỗi 6 vào `app/api/interpret/route.ts`.
6. Áp dụng bản vá Lỗi 7 vào `lib/classics/index.ts`.
7. Áp dụng bản vá Lỗi 8 vào `lib/ziwei/cities.ts` và `package.json`, xóa bỏ các file DST Trung Quốc cũ.

### Bước 2: Kiểm thử hồi quy tự động
Chạy lần lượt trên terminal để xác minh:
```bash
npm run typecheck
npm test
```
*Yêu cầu*: 0 lỗi biên dịch TypeScript và toàn bộ kịch bản kiểm thử chạy thành công.

### Bước 3: Đẩy commit lên GitHub
```bash
git checkout -b fix/vietnam-core-calibration
git add .
git commit -m "fix: calibrate star brightness, pattern detection, form initial state and 34 provinces dataset"
git push origin fix/vietnam-core-calibration
```