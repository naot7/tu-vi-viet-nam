'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { Star } from '@/lib/ziwei/types';
import { STAR_DESCRIPTIONS } from '@/lib/ziwei/constants';

interface StarDetailPanelProps {
  star: Star | null;
  palaceName?: string;
  onClose: () => void;
}

// Hệ thống luận giải 14 chính tinh (Thầy Nghê Hải Hạ & Cổ thư Tử Vi Đẩu Số)
const STAR_DETAIL: Record<string, {
  niHaixia: string;
  classical: string;
  bestPalace: string;
  worstPalace: string;
  career: string;
  relationship: string;
  wealth: string;
  health: string;
}> = {
  'Tử Vi': {
    niHaixia: 'Thầy Nghê Hải Hạ luận: Tử Vi là đế tinh (sao Vua), tọa thủ Mệnh cung chủ về cốt cách thanh cao, thích độc lập, không ưa bị câu thúc. Tử Vi rất cần Tả Phụ, Hữu Bật giáp mệnh hoặc đồng cung để phò tá phát huy đế khí; nếu không chỉ là vua cô đơn ("cô quân"), giàu mà không sang. Đắc cách nhất tại Thìn Tuất khi tạo thành thế đôi Tử Phủ, tài quan song toàn. Kỵ nhất gặp Hỏa Linh Kình Đà hội chiếu, ngộ sát tinh chủ về cô quả, có quyền mà nhọc lòng.',
    classical: 'Cổ quyết: "Tử Vi đế tọa lâm mệnh chủ tôn quý, thống lĩnh quần tinh, tọa mệnh giả chủ quyền uy hiển đạt." Nam Bắc Sơn Nhân chú: "Tử Vi thủ mệnh vu Thìn vị, tài quan song mỹ, xuất tướng nhập tướng, vị chí tam công; Tý cung an mệnh giả, phú quý bất nại cửu."',
    bestPalace: 'Mệnh (Thìn, Tuất), Quan Lộc',
    worstPalace: 'Tật Ách, Phu Thê',
    career: 'Chính giới, quản lý cấp cao, khởi nghiệp độc lập, lãnh đạo tổ chức cần sự quyết đoán',
    relationship: 'Tình cảm có phần bị động, lòng tự tôn cao, cần bạn đời biết thấu hiểu và tôn trọng',
    wealth: 'Tài vận vững vàng, giữ của tốt hơn mạo hiểm, đắc tài quan song mỹ ở Thìn Tuất, hợp tích lũy dài hạn',
    health: 'Hành Thổ, cần lưu ý tỳ vị, hệ tiêu hóa. Tránh làm việc kiệt sức, cần điều dưỡng giấc ngủ',
  },
  'Thiên Cơ': {
    niHaixia: 'Thầy Nghê luận: Thiên Cơ là sao mưu sĩ, thông minh tột đỉnh nhưng thông minh lộ liễu quá thì tổn thân. Thiên Cơ Hóa Kỵ tối hung, dễ "thông minh quá bị thông minh hại". Thuộc Mộc, tính linh hoạt biến hóa, tại Mệnh chủ về tư duy mẫn tiệp nhưng hay đa mưu thiểu quyết. Rất hợp ly hương lập nghiệp, ứng biến linh hoạt theo thời cuộc là sở trường lớn nhất.',
    classical: 'Cổ quyết: "Vi nhân sinh tinh hoạt, tự hảo tác kinh doanh. Thiên Cơ tinh thuộc Mộc, cơ mưu tất viễn thân." Nam Bắc Sơn Nhân chú: "Thiên Cơ cư miếu vượng địa, chủ nhân tinh minh, thiện sách hoạch; cư hãm địa tắc ám đạm."',
    bestPalace: 'Mệnh (Mão), Quan Lộc',
    worstPalace: 'Phu Thê',
    career: 'Chuyên gia kỹ thuật, quân sư chiến lược, nghiên cứu, IT, hoạch định chính sách, tư vấn',
    relationship: 'Tình cảm giàu biến động, suy nghĩ quá nhiều dễ sinh nghi hoặc, nên kết hôn muộn',
    wealth: 'Kiếm tiền bằng trí tuệ và chuyên môn, không giỏi đầu cơ, dựa vào thực lực chuyên nghiệp tất bền',
    health: 'Hành Mộc, chú ý gan mật, hệ thần kinh. Hay nghĩ ngợi dễ mất ngủ, nên rèn luyện tĩnh tâm',
  },
  'Thái Dương': {
    niHaixia: 'Thầy Nghê luận: Thái Dương chủ về quang minh chính đại, hào sảng khẳng khái, vượng miếu từ Mão đến Ngọ; sau Ngọ dần hạ lạc. Tọa Mệnh là người trọng danh dự, ưa giúp đỡ người khác. Nam mệnh đắc cách thì quang huy hiển hách, nữ mệnh quá mạnh mẽ thì hôn nhân vất vả. Đại diện cho cha và chồng. Lạc hãm thì cần cù bôn ba, lao tâm khổ tứ.',
    classical: 'Cổ quyết: "Thái Dương cư Ngọ vi nhập miếu, quang huy đại phóng, chủ quý hiển, nam mệnh tối giai; lạc hãm tắc cô quả lao lục." Nam Bắc Sơn Nhân chú: "Thái Dương tại Ngọ cung thủ mệnh, tài quan song mỹ; Thìn vị an mệnh, trung niên tài quan biến mỹ."',
    bestPalace: 'Mệnh (Mão đến Ngọ), Quan Lộc',
    worstPalace: 'Phu Thê (với nữ mệnh), Tật Ách',
    career: 'Công chức, chính giới, truyền thông, ngoại giao, giáo dục, hoạt động xã hội',
    relationship: 'Nam mệnh duyên rộng nhưng bận rộn; nữ mệnh độc lập, cần người bạn đời thấu hiểu và nhường nhịn',
    wealth: 'Tài vận đến từ danh tiếng và sự cống hiến, phóng khoáng hay chi tiêu, miếu vượng tài lộc sung túc',
    health: 'Hành Hỏa, chú ý tim mạch, mắt, huyết áp. Ở hãm địa dễ kiệt sức do làm việc quá độ',
  },
  'Vũ Khúc': {
    niHaixia: 'Thầy Nghê luận: Vũ Khúc là đệ nhất tài tinh, tính cương nghị quyết đoán, sợ nhất cô khắc. Người có Vũ Khúc thủ mệnh ý chí kiên định như sắt đá, rất hợp tài chính kinh doanh, nhưng đối nhân xử thế quá thẳng thắn dễ làm tổn thương người khác. Vũ Khúc Hóa Kỵ phải phòng tai nạn huyết quang. Đắc địa tại Thìn Tuất Sửu Mùi, đồng cung với Thất Sát tạo thành Tướng Tài Cách đại phú.',
    classical: 'Cổ quyết: "Vũ Khúc thuộc Kim, cương cường chi tính, nhất sinh đa hình khắc; thủ mệnh vu vượng địa, xuất tướng nhập tướng." Nam Bắc Sơn Nhân chú: "Vũ Khúc thủ mệnh, tam phương tứ chính câu cát, tài quan song mỹ; dữ Thất Sát đồng cung vi Tướng Tài Cách, chủ đại phú."',
    bestPalace: 'Mệnh (Thìn Tuất Sửu Mùi), Tài Bạch, Quan Lộc',
    worstPalace: 'Phu Thê',
    career: 'Tài chính, ngân hàng, quân đội, công an, kế toán, kỹ sư kỹ thuật, quản lý vận hành',
    relationship: 'Tình cảm bộc trực, khô khan, thiếu lãng mạn; cần bạn đời nhu thuận bù trừ',
    wealth: 'Chính tài tinh bản mệnh, năng lực quản lý tài chính vượt trội, làm giàu vững chắc',
    health: 'Hành Kim, lưu ý phổi, phế quản, răng cốt. Hóa Kỵ cần đề phòng tổn thương kim khí, va chạm',
  },
  'Thiên Đồng': {
    niHaixia: 'Thầy Nghê luận: Thiên Đồng là phúc tinh, sao an nhàn hưởng thụ. Tọa Mệnh là người hiền hậu hòa nhã, ít bon chen, thích cuộc sống bình dị thong dong. Thiên Đồng đồng cung với Thiên Lương là thế tốt nhất, vừa có phúc vừa có sự che chở trường thọ. Thiên Đồng Hóa Lộc là cách hóa lộc mỹ mãn, cả đời no ấm an vui.',
    classical: 'Cổ quyết: "Thiên Đồng vi phúc đức chi tinh, tọa mệnh giả hưởng phúc hữu dư, chủ nhất sinh tiêu dao tự tại, bất tất lao khổ." Nam Bắc Sơn Nhân chú: "Thiên Đồng thủ mệnh, tam phương vô sát, nhất sinh khoái lạc, y thực phong túc."',
    bestPalace: 'Mệnh, Phúc Đức',
    worstPalace: 'Quan Lộc',
    career: 'Dịch vụ, giải trí, văn hóa nghệ thuật, ẩm thực, hành chính ổn định; tránh môi trường áp lực cao',
    relationship: 'Tình cảm dịu dàng, dễ mềm lòng, tính cách dễ gần, đời sống vợ chồng thuận hòa',
    wealth: 'Tài vận ổn định từ lương bổng, không ham đầu cơ phiêu lưu, đời sống ấm no đủ đầy',
    health: 'Hành Thủy, chú ý thận, bàng quang, hệ bài tiết. Cần chăm vận động thể chất tránh trì trệ',
  },
  'Liêm Trinh': {
    niHaixia: 'Thầy Nghê luận: Liêm Trinh là thứ đào hoa, tài hoa xuất chúng nhưng tình cảm phong ba. Liêm Trinh Hóa Kỵ tối hung, chủ về thị phi quan tụng, tù ngục hoặc tổn thương huyết quang. Khi hội tụ Thiên Tướng thì hóa hung thành cát thành Liêm Tướng Ấn Thụ Cách chưởng quản quyền hành. Hành Hỏa, tính khí cương liệt, đời nhiều thăng trầm nhưng có chí tiến thủ lớn.',
    classical: 'Cổ quyết: "Liêm Trinh vi thứ đào hoa, tài hoa hoành dật, cảm tình đa ba triết; Liêm Tướng đồng cung, hóa hung vi cát, thành hành chính ấn thụ cách." Nam Bắc Sơn Nhân chú: "Liêm Trinh thủ mệnh, kiến cát tinh tắc tài hoa xuất chúng; hóa Kỵ tắc quan ty triền thân."',
    bestPalace: 'Quan Lộc (hội Thiên Tướng), Mệnh (hóa Lộc)',
    worstPalace: 'Mệnh (hóa Kỵ), Phu Thê',
    career: 'Nghệ thuật, pháp luật, truyền thông, công quyền (khi có Thiên Tướng), quản trị nhân sự',
    relationship: 'Đào hoa vượng, cảm xúc mãnh liệt, duyên nợ phức tạp, nên kết hôn muộn để chín chắn',
    wealth: 'Tài vận lên xuống, kiếm tiền dựa vào tài năng độc đáo; đề phòng rủi ro pháp lý khi Hóa Kỵ',
    health: 'Hành Hỏa, lưu ý tim mạch, tuần hoàn máu, gan. Tránh va chạm thương tích khi gặp Kỵ Sát',
  },
  'Thiên Phủ': {
    niHaixia: 'Thầy Nghê luận: Thiên Phủ là sao thủ kho, kho báu trời ban, chủ về giữ gìn và tích lũy bền vững. Người có Thiên Phủ thủ Mệnh tính tình đĩnh đạc, cẩn trọng, chu đáo. Nữ mệnh Thiên Phủ rất vượng phu ích tử. Rất thích Tử Vi đồng cung hoặc triều chiếu thành Tử Phủ Đồng Cung Cách. Kỵ nhất Không Kiếp xung phá làm kho tiền thủng đáy.',
    classical: 'Cổ quyết: "Thiên Phủ vi tài khố chi tinh, thủ mệnh giả ổn trọng bảo thủ, chủ tích tài vượng gia; nữ mệnh phùng chi, năng vượng phu ích tử." Nam Bắc Sơn Nhân chú: "Thiên Phủ thủ mệnh, tam phương cát tụ, tài quan song mỹ, phú quý an khang; ngộ Không Kiếp tắc tài khố phá lậu."',
    bestPalace: 'Mệnh, Tài Bạch, Điền Trạch',
    worstPalace: 'Thiên Di',
    career: 'Quản trị điều hành, tài chính kế toán, bảo hiểm, bất động sản, ngân hàng',
    relationship: 'Chung thủy, chu đáo, rất coi trọng mái ấm gia đình và sự bảo đảm kinh tế',
    wealth: 'Tài vận hưng vượng, khả năng giữ tiền xuất sắc, rất hợp tích lũy điền sản và đầu tư giá trị',
    health: 'Hành Thổ, lưu ý tỳ vị, tiêu hóa. Thể chất ổn định, nên duy trì chế độ dinh dưỡng lành mạnh',
  },
  'Thái Âm': {
    niHaixia: 'Thầy Nghê luận: Thái Âm là tài tinh điềm đạm, chủ về mẹ, vợ và phái nữ. Nhập miếu tại Hợi Tý thì trăng sáng vằng vặc, phú quý tột bậc, khí chất nho nhã, tâm hồn phong phú sâu sắc. Lạc hãm tại Ngọ thì hao tài, tình duyên lận đận. Thái Âm Hóa Kỵ cần đặc biệt quan tâm đến sức khỏe mẹ/vợ hoặc người phụ nữ trong gia đình.',
    classical: 'Cổ quyết: "Thái Âm vi tài tinh, lợi nữ mệnh; Hợi Tý nhập miếu, quang huy toàn chiếu, tài vận cực vượng; Ngọ vị lạc hãm, ưu uất đa tình." Nam Bắc Sơn Nhân chú: "Thái Âm thủ mệnh, nhập miếu giả tài phú ưu hậu, nữ mệnh vưu giai."',
    bestPalace: 'Mệnh (Hợi, Tý), Tài Bạch',
    worstPalace: 'Mệnh (Ngọ - hãm địa)',
    career: 'Tài chính, bất động sản, nghệ thuật, văn học, giáo dục, thiết kế, tâm lý học',
    relationship: 'Tình cảm sâu lắng, tế nhị, giàu lòng trắc ẩn, cần một bến đỗ bình an và an toàn',
    wealth: 'Miếu vượng tài lộc dồi dào, kiếm tiền từ tốn bền bỉ, tích lũy điền sản đất đai rất đắc lợi',
    health: 'Hành Thủy, lưu ý thận, khí huyết, hệ sinh dục (nữ mệnh). Tránh lo âu phiền muộn thái quá',
  },
  'Tham Lang': {
    niHaixia: 'Thầy Nghê luận: Tham Lang là sao đa tài đa nghệ, đệ nhất đào hoa. Hóa Lộc thì duyên dáng hoạt bát, phong lưu thu hút. Tham Lang là sao phát về hậu vận, sau 30 tuổi mới bắt đầu định hình đại nghiệp. Đắc cách tại Dần Thân miếu địa; gặp Hỏa Tinh hoặc Linh Tinh tạo thành Hỏa Tham Cách / Linh Tham Cách chủ bạo phát bất ngờ.',
    classical: 'Cổ quyết: "Tham Lang phát phúc hanh thông, đa tài đa nghệ, đào hoa tối trọng; vãn phát giả chúng. Lạc hãm ngộ sát phản cát." Nam Bắc Sơn Nhân chú: "Tham Lang thủ mệnh, ngộ cát tắc phúc lộc đa thọ; ngộ Hỏa Linh tắc phát phúc hoành tài."',
    bestPalace: 'Mệnh (hóa Lộc), Phúc Đức, Thiên Di',
    worstPalace: 'Tật Ách',
    career: 'Nghệ thuật, ngoại giao, kinh doanh, giải trí, truyền thông, phong thủy, công nghệ sáng tạo',
    relationship: 'Đào hoa rất vượng, nhiều mối nhân duyên, nên lập gia đình muộn để giữ gìn hòa khí trăm năm',
    wealth: 'Phát về trung hậu vận, nhạy bén với cơ hội tài chính, tạo nên đột phá lớn khi hội cát tinh',
    health: 'Hành Mộc đới Thủy, chú ý gan, thận. Tránh tiệc tùng quá độ tổn hao sinh lực',
  },
  'Cự Môn': {
    niHaixia: 'Thầy Nghê luận: Cự Môn là ám tinh chủ về khẩu thiệt, đàm phán, ngôn từ. Khi đắc Hóa Lộc hoặc Hóa Quyền sẽ chuyển hung thành đại cát, biến tài ăn nói thành công cụ hái ra tiền danh tiếng lẫy lừng. Tọa Mệnh tính đa nghi, thấu đáo, hợp luật sư, giáo viên, diễn giả. Tối kỵ Hóa Kỵ sinh thị phi, khẩu thiệt, rắc rối kiện tụng.',
    classical: 'Cổ quyết: "Cự Môn vi ám diệu, chủ khẩu thiệt thị phi; hóa Lộc Quyền tắc chuyển vi dĩ khẩu tài mưu sinh, chủ phú quý." Nam Bắc Sơn Nhân chú: "Cự Môn thủ mệnh, phùng hóa Lộc Quyền, dĩ khẩu thiệt vi nghiệp giả đại cát."',
    bestPalace: 'Quan Lộc (khi hóa Lộc/Quyền), Mệnh (Tý, Ngọ)',
    worstPalace: 'Phu Thê, Tật Ách (khi hóa Kỵ)',
    career: 'Luật sư, nhà ngoại giao, giáo viên, diễn giả, truyền thông, tư vấn đàm phán thương mại',
    relationship: 'Nội tâm hay trăn trở, cần giao tiếp thẳng thắn, tránh hoài nghi đối phương',
    wealth: 'Lập nghiệp bằng thực lực chuyên môn và tài ăn nói, Hóa Lộc thì phát tài, tránh mập mờ tài chính',
    health: 'Hành Thủy, lưu ý họng, phế quản, răng miệng, dạ dày. Tránh suy nghĩ căng thẳng triền miên',
  },
  'Thiên Tướng': {
    niHaixia: 'Thầy Nghê luận: Thiên Tướng là sao ấn thụ chưởng quản công quyền hành chính. Người có Thiên Tướng thủ Mệnh đoan chính, giữ chữ tín, trọng nguyên tắc. Thiên Tướng cần chính tinh uy quyền đồng hội để phò tá đắc lực, tốt nhất là hội Liêm Trinh tạo Liêm Tướng tương hội. Sợ nhất Hóa Kỵ kẹp hai bên thành Hình Kỵ Giáp Ấn Cách.',
    classical: 'Cổ quyết: "Thiên Tướng vi ấn thụ chi tinh, chủ hành chính thứ vụ; Liêm Tương đồng cung, hóa hung vi cát, chưởng hành chính đại quyền." Nam Bắc Sơn Nhân chú: "Thiên Tướng thủ mệnh, trung quy trung củ, thích hợp công chức."',
    bestPalace: 'Quan Lộc, Mệnh (hội Liêm Trinh)',
    worstPalace: 'Tài Bạch (khi bị kẹp Hình Kỵ)',
    career: 'Hành chính công vụ, quản lý nội bộ, trợ lý cao cấp, tư pháp, thư ký điều hành',
    relationship: 'Trọng tình cảm, đứng đắn, người bạn đời đáng tin cậy và thủy chung',
    wealth: 'Tài vận ổn định từ chức vụ và công việc chính đạo, quản lý chi tiêu bài bản',
    health: 'Hành Thủy, chú ý thận, bàng quang, da liễu. Sinh hoạt điều độ giúp thể trạng bền vững',
  },
  'Thiên Lương': {
    niHaixia: 'Thầy Nghê luận: Thiên Lương là ấm tinh (che chở), sao của y dược, tôn giáo và sự trường thọ. Người có Thiên Lương thủ Mệnh có duyên với trưởng bối, sớm chịu trui rèn gian khó nhưng càng về hậu vận càng thanh nhàn phúc thọ. Đẹp nhất khi hội tụ với Thái Dương tạo thành Nhật Lương Xương Lộc Cách hiển đạt vinh hoa.',
    classical: 'Cổ quyết: "Thiên Lương vi ấm tinh, chủ tí ấm bảo hộ; tọa mệnh giả hữu trưởng bối duyên, tảo niên thụ ma luyện, vãn niên hưởng thanh phúc." Nam Bắc Sơn Nhân chú: "Thiên Lương thủ mệnh, kiến Thái Dương đồng cung, nhật nguyệt tịnh minh, chủ quý hiển."',
    bestPalace: 'Mệnh, Phụ Mẫu, Phúc Đức',
    worstPalace: 'Mệnh (khi hóa Kỵ), Tài Bạch',
    career: 'Y học, dược phẩm, luật pháp, công tác xã hội, từ thiện, kiểm toán, giáo dục',
    relationship: 'Duyên muộn hoặc kết hôn với người chênh lệch tuổi tác, thấu hiểu bao dung',
    wealth: 'Tài lộc có quý nhân trợ lực, hậu vận vượng tài, hợp làm ăn quang minh chính đại',
    health: 'Hành Thổ, lưu ý xương khớp, lưng eo, tiêu hóa. Rất có tiềm năng sống lâu trường thọ',
  },
  'Thất Sát': {
    niHaixia: 'Thầy Nghê luận: Thất Sát là dũng tướng tiên phong, quả cảm quyết liệt, mang khí chất cô độc lạnh lùng. Tọa Mệnh cần có cát tinh phụ tá kiềm chế sát khí mới thành đại nghiệp. Thất Sát đồng cung Vũ Khúc tại Mão Dậu thành Tướng Tài Cách. Sợ nhất gặp hạn Trúc La Tam Hạn (Kình Đà Hỏa Linh hội) gây biến động thăng trầm.',
    classical: 'Cổ quyết: "Thất Sát vi tướng quân chi tinh, quả quyết trùng kính cường; thủ mệnh giả cô khắc tính trọng, lục thân duyên bạc." Nam Bắc Sơn Nhân chú: "Thất Sát thủ mệnh, tam hợp cát tụ tắc đại quý; ngộ Trúc La tam hạn chủ hung hiểm."',
    bestPalace: 'Mệnh (có cát tinh), Quan Lộc',
    worstPalace: 'Phu Thê, Phụ Mẫu',
    career: 'Lực lượng vũ trang, chỉ huy tác chiến, kinh doanh mạo hiểm, công nghệ tiên phong, kiến trúc',
    relationship: 'Tính cách độc lập mạnh mẽ, khó chiều, nên chọn bạn đời trầm tĩnh, kết hôn muộn tốt lành',
    wealth: 'Biến động lớn, dám mạo hiểm làm giàu, cơ hội hoành tài cao nếu biết điểm dừng',
    health: 'Hành Kim, chú ý hô hấp, phổi, đại tràng. Cần giữ bình tĩnh, tránh nóng vội tổn khí huyết',
  },
  'Phá Quân': {
    niHaixia: 'Thầy Nghê luận: Phá Quân là sao tiên phong phá cũ lập mới, phá tán trước rồi mới xây dựng sau. Tọa Mệnh tính tình ngang tàng dám nghĩ dám làm, ghét gò bó rập khuôn. Phá Quân Hóa Lộc thì chuyển hóa kỳ diệu, biến đổ vỡ thành thành tựu huy hoàng. Thích hợp nhất trong vai trò khai sơn phá thạch.',
    classical: 'Cổ quyết: "Phá Quân vi tối năng phá cựu lập tân chi tinh, tọa mệnh giả khai sáng năng lực siêu cường; hóa Lộc hậu phá nhi hậu lập, khả thành đại nghiệp." Nam Bắc Sơn Nhân chú: "Phá Quân thủ mệnh, nhất sinh đa ba triết, hóa Lộc tắc tái kiến điền viên."',
    bestPalace: 'Quan Lộc (hóa Lộc), Thiên Di',
    worstPalace: 'Phu Thê, Phụ Mẫu',
    career: 'Đổi mới sáng tạo, phát triển sản phẩm mới, xây dựng, quân sự, kỹ thuật thực nghiệm',
    relationship: 'Nhiều trắc trở, phân ly rồi hợp, cần tôn trọng tự do không gian cá nhân của nhau',
    wealth: 'Tiền tài thăng trầm mạnh, sau tổn thất lại tái lập tài sản mới, trung hậu vận khởi sắc rực rỡ',
    health: 'Hành Thủy, lưu ý thận, bàng quang, xương khớp. Cần tập luyện đều đặn duy trì thể lực',
  },
};

// Cấu hình phân loại sao
const levelConfig = {
  major: { label: 'Chính Tinh', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  lucky: { label: 'Cát Tinh', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
  sha:   { label: 'Sát Tinh', color: 'text-red-400 border-red-500/30 bg-red-500/10' },
  minor: { label: 'Phụ Tinh', color: 'text-slate-400 border-slate-500/25 bg-slate-500/10' },
};

const siHuaColors: Record<string, string> = {
  'Lộc': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'Quyền': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'Khoa': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  'Kỵ': 'text-red-400 bg-red-500/10 border-red-500/30',
  // Giữ fallback Hán tự
  '禄': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  '权': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  '科': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  '忌': 'text-red-400 bg-red-500/10 border-red-500/30',
};

// Mapping ngược từ tiếng Hán sang tiếng Việt nếu star.name vẫn còn Hán tự
const CN_TO_VI_STAR_MAP: Record<string, string> = {
  '紫微': 'Tử Vi', '天机': 'Thiên Cơ', '太阳': 'Thái Dương', '武曲': 'Vũ Khúc',
  '天同': 'Thiên Đồng', '廉贞': 'Liêm Trinh', '天府': 'Thiên Phủ', '太阴': 'Thái Âm',
  '贪狼': 'Tham Lang', '巨门': 'Cự Môn', '天相': 'Thiên Tướng', '天梁': 'Thiên Lương',
  '七杀': 'Thất Sát', '破军': 'Phá Quân',
  '文昌': 'Văn Xương', '文曲': 'Văn Khúc', '左辅': 'Tả Phụ', '右弼': 'Hữu Bật',
  '天魁': 'Thiên Khôi', '天钺': 'Thiên Việt', '禄存': 'Lộc Tồn', '天马': 'Thiên Mã',
  '擎羊': 'Kình Dương', '陀罗': 'Đà La', '火星': 'Hỏa Tinh', '铃星': 'Linh Tinh',
  '地空': 'Địa Không', '地劫': 'Địa Kiếp',
};

export default function StarDetailPanel({ star, palaceName, onClose }: StarDetailPanelProps) {
  const starNameVi = star ? (CN_TO_VI_STAR_MAP[star.name] || star.name) : '';
  const desc = starNameVi ? STAR_DESCRIPTIONS[starNameVi] : null;
  const detail = starNameVi ? STAR_DETAIL[starNameVi] : null;
  const typeConfig = star ? levelConfig[star.type] : null;

  return (
    <AnimatePresence>
      {star && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="card-glass rounded-xl overflow-hidden"
        >
          {/* Thanh tiêu đề */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--t-border)' }}>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold" style={{ color: 'var(--t-gold)' }}>{starNameVi}</span>
              {typeConfig && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${typeConfig.color}`}>
                  {typeConfig.label}
                </span>
              )}
              {star.siHua && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${siHuaColors[star.siHua] || ''}`}>
                  Hóa {star.siHua}
                </span>
              )}
            </div>
            <button 
              onClick={onClose} 
              aria-label="Đóng bảng chi tiết"
              className="transition-colors text-lg leading-none hover:text-white" 
              style={{ color: 'var(--t-faint)' }}
            >
              ×
            </button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto max-h-[560px]">
            {/* Thông tin cơ bản */}
            {desc && (
              <div className="flex flex-wrap gap-1.5">
                {[
                  `Ngũ hành · ${desc.element}`,
                  `Đặc tính · ${desc.nature}`,
                  ...(palaceName ? [`Vị trí · ${palaceName}`] : []),
                  ...(star.brightnessRaw ? [`Độ sáng · ${star.brightnessRaw}`] : star.brightness ? [`Độ sáng · ${star.brightness === 'bright' ? 'Miếu Vượng' : star.brightness === 'dim' ? 'Hãm Địa' : 'Bình Hòa'}`] : []),
                ].map(tag => (
                  <div key={tag} className="text-[10px] px-2 py-1 rounded-full"
                    style={{
                      border: '1px solid var(--t-border)',
                      color: tag.includes('Miếu') || tag.includes('Vượng') ? '#eab308' : tag.includes('Hãm') ? '#ef4444' : 'var(--t-text2)',
                    }}>
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {/* Từ khóa đặc tính */}
            {desc && (
              <div>
                <div className="text-[10px] tracking-widest mb-1.5" style={{ color: 'var(--t-faint)' }}>Đặc tính tinh diệu</div>
                <div className="flex flex-wrap gap-1.5">
                  {desc.keywords.split('·').map(k => (
                    <span key={k} className="text-[11px] px-2 py-0.5 rounded-full"
                      style={{ color: 'var(--t-gold)', border: '1px solid rgba(212,168,67,0.2)', background: 'rgba(212,168,67,0.06)' }}>
                      {k.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Trích dẫn Cổ thư */}
            {detail && (
              <div className="rounded-xl p-3" style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.12)' }}>
                <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1" style={{ color: 'var(--t-gold)', opacity: 0.7 }}>
                  Cổ thư nguyên văn & chú giải
                </div>
                <p className="text-[11px] leading-relaxed italic" style={{ color: 'var(--t-gold)', opacity: 0.85 }}>{detail.classical}</p>
              </div>
            )}

            {/* Luận giải Thầy Nghê Hải Hạ */}
            {detail && (
              <>
                <div>
                  <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--t-faint)' }}>
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--t-border-acc)' }} />
                    Luận giải Thầy Nghê Hải Hạ
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--t-border-acc)' }} />
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>{detail.niHaixia}</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'Định hướng sự nghiệp', value: detail.career, icon: '◈' },
                    { label: 'Tình duyên & Hôn nhân', value: detail.relationship, icon: '♡' },
                    { label: 'Tài vận & Quản lý tiền bạc', value: detail.wealth, icon: '◆' },
                    { label: 'Sức khỏe & Dưỡng sinh', value: detail.health, icon: '☯' },
                  ].map(item => (
                    <div key={item.label} className="card-inner rounded-lg p-3">
                      <div className="text-[10px] mb-1 flex items-center gap-1" style={{ color: 'var(--t-faint)' }}>
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(74,222,128,0.15)', background: 'rgba(74,222,128,0.05)' }}>
                    <div className="text-emerald-500 mb-0.5 font-medium">Cung vị đắc địa</div>
                    <div className="text-emerald-500/80">{detail.bestPalace}</div>
                  </div>
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(248,113,113,0.15)', background: 'rgba(248,113,113,0.05)' }}>
                    <div className="text-red-500 mb-0.5 font-medium">Cung vị cần lưu ý</div>
                    <div className="text-red-500/80">{detail.worstPalace}</div>
                  </div>
                </div>
              </>
            )}

            {/* Phụ tinh / Sát tinh luận đoán */}
            {!detail && star.type !== 'major' && (
              <div className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>
                {star.type === 'lucky' && (
                  <>
                    {(starNameVi === 'Văn Xương' || star.name === '文昌') && 'Văn Xương nhập cung: Chủ về học vấn đỗ đạt, thi cử hanh thông, văn thư ấn tín thuận lợi, danh tiếng rạng rỡ. Cổ quyết: "Văn Xương khoa giáp, chủ văn chương hiển đạt, phùng khảo tất đệ."'}
                    {(starNameVi === 'Văn Khúc' || star.name === '文曲') && 'Văn Khúc nhập cung: Chủ về tài nghệ xuất chúng, khiếu thẩm mỹ cao, tài hùng biện, giỏi ứng biến linh hoạt. Cổ quyết: "Văn Khúc vi tài nghệ chi tinh, năng văn năng vũ, khẩu tài thắng nhân."'}
                    {(starNameVi === 'Tả Phụ' || star.name === '左辅') && 'Tả Phụ nhập cung: Chủ về quý nhân tương trợ, bạn bè đồng nghiệp hết lòng nâng đỡ, gặp hung hóa cát. Cổ quyết: "Tả Phụ vi trợ lực chi tinh, tọa mệnh tắc quý nhân đa, phùng hung hóa cát."'}
                    {(starNameVi === 'Hữu Bật' || star.name === '右弼') && 'Hữu Bật nhập cung: Chủ về âm phù mặc trợ, nhiều cơ hội tốt, nữ nhân quý trợ, giải trừ hung hiểm. Cổ quyết: "Hữu Bật vi âm trợ chi tinh, đa nữ tính quý nhân, hóa hiểm vi di."'}
                    {(starNameVi === 'Thiên Khôi' || star.name === '天魁') && 'Thiên Khôi nhập cung: Thiên Ất Quý Nhân, chủ về quý nhân công khai ban ngày, được cấp trên nâng đỡ thưởng thức. Cổ quyết: "Thiên Khôi vi Thiên Ất quý nhân, phùng chi tất hữu quý nhân phù trì."'}
                    {(starNameVi === 'Thiên Việt' || star.name === '天钺') && 'Thiên Việt nhập cung: Ngọc Đường Quý Nhân, chủ về cơ hội ngầm đến bất ngờ, phái nữ tương trợ, gia tăng phúc lành. Cổ quyết: "Thiên Việt vi Ngọc Đường quý nhân, chủ âm trợ, cát khánh tăng vinh."'}
                    {(starNameVi === 'Lộc Tồn' || star.name === '禄存') && 'Lộc Tồn nhập cung: Chủ về tài lộc trời ban, giữ của bền vững, thu nhập ổn định, tránh bôn ba mạo hiểm. Cổ quyết: "Lộc Tồn vi tài lộc chi tinh, chủ thủ tài hữu dư, tiến tài ổn kiện."'}
                    {(starNameVi === 'Thiên Mã' || star.name === '天马') && 'Thiên Mã nhập cung: Chủ về bôn ba di chuyển, động trung cầu tài, năng động viễn hành tạo nên thời vận mới. Cổ quyết: "Thiên Mã chủ động, phùng Lộc tắc tài lộc song toàn, động trung sinh tài."'}
                  </>
                )}
                {star.type === 'sha' && (
                  <>
                    {(starNameVi === 'Địa Không' || star.name === '地空') && 'Địa Không nhập cung: Chủ về dễ hư hao hụt hẫng, suy nghĩ bay bổng thiếu thực tế; hợp nghiên cứu triết học, nghệ thuật. Cổ quyết: "Địa Không chủ hư hao, nhập mệnh giả đa tinh thần mê mang, tu phòng không tưởng."'}
                    {(starNameVi === 'Địa Kiếp' || star.name === '地劫') && 'Địa Kiếp nhập cung: Chủ về tiền tài bất ngờ hao tổn, thăng trầm sóng gió, cần cẩn trọng đầu tư tài chính. Cổ quyết: "Địa Kiếp chủ kiếp tài, nhập mệnh giả tài vận thụ tổn, phòng ngoài ý muốn tổn thất."'}
                    {(starNameVi === 'Hỏa Tinh' || star.name === '火星') && 'Hỏa Tinh nhập cung: Tính khí nóng nảy, biến động bất ngờ; nhưng hội ngộ Tham Lang lại thành Hỏa Tham Cách hoành tài bạo phát. Cổ quyết: "Hỏa Tinh chủ cấp táo, nhiên ngộ Tham Lang đồng cung, phản vi Hỏa Tham cách, chủ bạo phát."'}
                    {(starNameVi === 'Linh Tinh' || star.name === '铃星') && 'Linh Tinh nhập cung: Ám hỏa âm ỉ, đề phòng tiểu nhân ám hại ngấm ngầm, làm việc nên khiêm tốn kín đáo. Cổ quyết: "Linh Tinh chủ ám sát, nhập mệnh giả tu phòng bối hậu thị phi."'}
                    {(starNameVi === 'Kình Dương' || star.name === '擎羊') && 'Kình Dương nhập cung: Dũng mãnh tiên phong nhưng mang sát khí hình thương, dễ có va chạm hoặc giải phẫu phẫu thuật. Cổ quyết: "Kình Dương vi hình khắc chi tinh, nhập mệnh cung giả đa hình khắc, tu phòng huyết quang."'}
                    {(starNameVi === 'Đà La' || star.name === '陀罗') && 'Đà La nhập cung: Chủ về dây dưa dùng dằng, tiến thoái lưỡng nan, thị phi ám hại, cần kiên nhẫn vượt khó. Cổ quyết: "Đà La chủ thị phi tha diên, nhập mệnh giả tác sự trì hoãn, tu phòng triền miên bất thanh."'}
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}