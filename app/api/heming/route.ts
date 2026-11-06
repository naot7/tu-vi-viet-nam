import { NextRequest, NextResponse } from 'next/server';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { BRANCHES } from '@/lib/ziwei/constants';
import { detectPatterns, getMingGongSummary } from '@/lib/ziwei/patterns';

export const runtime = 'nodejs';

interface HemingRequestBody {
  chartA: ZiweiChart;
  chartB: ZiweiChart;
  question?: string;
}

function createSSEStream(fullText: string): Response {
  const encoder = new TextEncoder();
  const chunks = fullText.match(/.{1,12}/g) || [fullText];

  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        const payload = JSON.stringify({ delta: { text: chunk } });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        await new Promise(r => setTimeout(r, 12));
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}

function generateOfflineHeming(chartA: ZiweiChart, chartB: ZiweiChart, question?: string): string {
  const mingA = chartA.palaces.find(p => p.branch === chartA.mingGongBranch);
  const mingB = chartB.palaces.find(p => p.branch === chartB.mingGongBranch);
  const summaryA = getMingGongSummary(chartA);
  const summaryB = getMingGongSummary(chartB);

  const branchNameA = BRANCHES[chartA.mingGongBranch] ?? '';
  const branchNameB = BRANCHES[chartB.mingGongBranch] ?? '';

  const starsA = mingA?.stars.filter(s => s.type === 'major').map(s => s.name).join(', ') || 'Vô chính diệu';
  const starsB = mingB?.stars.filter(s => s.type === 'major').map(s => s.name).join(', ') || 'Vô chính diệu';

  return `## 【Hợp Bàn Đối Chiếu Hai Mệnh Bàn】

${question ? `**Câu hỏi trọng tâm:** *${question}*\n\n` : ''}
### 1. Tương Quan Khí Chất Hai Mệnh Chủ
- **Bên A**: Mệnh tại **${branchNameA}**, Cục số: **${chartA.wuxingJuName}**, Chính tinh thủ Mệnh: **${starsA}** ${summaryA.keywords.length > 0 ? `(${summaryA.keywords.join(', ')})` : ''}.
- **Bên B**: Mệnh tại **${branchNameB}**, Cục số: **${chartB.wuxingJuName}**, Chính tinh thủ Mệnh: **${starsB}** ${summaryB.keywords.length > 0 ? `(${summaryB.keywords.join(', ')})` : ''}.

### 2. Đánh Giá Độ Tương Hợp & Tương Tác
Theo quan điểm Tử Vi Đẩu Số của Thầy Nghê Hải Hạ trong 《Thiên Kỷ》:
- Sự kết hợp giữa hai lá số không đơn thuần là xem sinh khắc ngũ hành, mà quan trọng là **tính cách bù trừ** và **mục tiêu đồng điệu**.
- Bên A mang nét năng động, quyết đoán trong khi Bên B có xu hướng thận trọng, tinh tế. Hai bên có thể hỗ trợ và bổ khuyết rất tốt cho nhau trong cả công việc lẫn tình cảm nếu biết tôn trọng không gian riêng của đối phương.

### 3. Phương Diện Cần Lưu Tâm
- Khi xảy ra bất đồng quan điểm, đôi bên cần tránh việc dùng sự cố chấp để áp đặt, nên dùng lý lẽ khách quan và thái độ hòa nhã để cùng tìm giải pháp.
- Giai đoạn đại hạn có sự biến động của một bên cần sự kiên nhẫn và thấu hiểu đồng hành từ người còn lại.

### 4. Lời Khuyên Chung
"Nhân định thắng thiên". Mệnh bàn chỉ ra những điểm giao thoa và thử thách tiềm tàng, nhưng sự chân thành, bao dung và nỗ lực vun đắp từ cả hai phía mới là yếu tố quyết định sự gắn kết lâu bền.

---
*💡 Ghi chú: Phân tích hợp bàn quy tắc ngoại tuyến theo trường phái Nghê Hải Hạ. Cấu hình API Key trong file \`.env.local\` để kích hoạt AI đàm đạo đối chiếu chuyên sâu.*`;
}

export async function POST(req: NextRequest) {
  try {
    const body: HemingRequestBody = await req.json();
    const { chartA, chartB, question } = body;

    if (!chartA || !chartB) {
      return NextResponse.json({ error: 'Cần đủ dữ liệu của cả hai lá số (chartA và chartB)' }, { status: 400 });
    }

    const offlineText = generateOfflineHeming(chartA, chartB, question);
    return createSSEStream(offlineText);
  } catch (error) {
    console.error('Lỗi tại /api/heming:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 });
  }
}
