import { NextRequest, NextResponse } from 'next/server';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';
import { detectPatterns, getMingGongSummary } from '@/lib/ziwei/patterns';

export const runtime = 'nodejs';

interface RequestBody {
  chart: ZiweiChart;
  messages: { role: 'user' | 'assistant'; content: string }[];
}

// ── Hàm tạo phản hồi SSE (Server-Sent Events) ──
function createSSEStream(fullText: string): Response {
  const encoder = new TextEncoder();
  const chunks = fullText.match(/.{1,12}/g) || [fullText];

  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        const payload = JSON.stringify({ delta: { text: chunk } });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        // Nghỉ ngắn để tạo hiệu ứng gõ chữ mượt mà
        await new Promise(r => setTimeout(r, 15));
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

// ── Hàm luận đoán ngoại tuyến thông minh (Offline Rule-based) ──
function generateOfflineInterpretation(chart: ZiweiChart, userPrompt: string): string {
  const mingPalace = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  const mingSummary = getMingGongSummary(chart);
  const patterns = detectPatterns(chart);

  const majorStarsInMing = mingPalace?.stars.filter(s => s.type === 'major') ?? [];
  const majorStarsText = majorStarsInMing.length > 0
    ? majorStarsInMing.map(s => `${s.name} (${s.brightness ?? 'Vượng'})`).join(', ')
    : 'Mệnh Vô Chính Diệu (mượn chính tinh từ cung Thiên Di đối chiếu)';

  const patternNames = patterns.map(p => `• **${p.name}**: ${p.description}`).slice(0, 3);
  const patternSection = patternNames.length > 0
    ? `\n\n**【Cách cục nổi bật】**\n${patternNames.join('\n')}`
    : '';

  // 1. Luận đoán theo chủ đề Tình Duyên
  if (userPrompt.includes('tình duyên') || userPrompt.includes('Phu Thê')) {
    const phuThe = chart.palaces.find(p => p.name.includes('Phu Thê') || p.name === 'Phu Thê');
    const phuTheBranchName = phuThe ? (BRANCHES[phuThe.branch] ?? '') : '';
    const stars = phuThe?.stars.filter(s => s.type === 'major').map(s => s.name).join(', ') || 'Vô chính diệu';
    return `**【Cục diện Tình Duyên & Hôn Nhân】**
Cung Phu Thê tại địa chi **${phuTheBranchName}**, có chính tinh tọa thủ: **${stars}**.

**【Phân tích chuyên sâu】**
Theo hệ thống Tử Vi Đẩu Số Nghê Hải Hạ, cung Phu Thê thể hiện nhân duyên, tính cách người phối ngẫu và sự hòa hợp gia đạo. ${stars !== 'Vô chính diệu' ? `Sao ${stars} thủ cung chủ về đối phương là người có bản lĩnh, khí chất rõ rệt.` : 'Cung Phu Thê vô chính diệu chủ về duyên phận kết hợp muộn màng hoặc cần sự tương kính như tân để bền vững.'}

**【Tam phương hội chiếu】**
Cung Phúc Đức (${chart.palaces.find(p => p.name.includes('Phúc Đức'))?.stars.filter(s => s.type === 'major').map(s => s.name).join(', ') || 'Vô chính diệu'}) và Thiên Di tác động trực tiếp đến tinh thần và sự gắn kết vợ chồng.

**【Lời khuyên gia đạo】**
Thầy Nghê Hải Hạ thường nhấn mạnh: "Trong hôn nhân, quan trọng nhất là chữ Nhẫn và hiểu rõ vị trí của mình". Cần lấy sự thấu hiểu và sẻ chia làm gốc để vun đắp tổ ấm vững bền.

---
*💡 Ghi chú: Đây là luận giải ngoại tuyến theo hệ thống dữ liệu Tử Vi Nghê Hải Hạ. Quý bạn có thể cấu hình API Key trong file \`.env.local\` để kích hoạt AI đàm đạo trực tiếp.*`;
  }

  // 2. Luận đoán theo chủ đề Sự Nghiệp / Công Danh
  if (userPrompt.includes('sự nghiệp') || userPrompt.includes('Quan Lộc')) {
    const quanLoc = chart.palaces.find(p => p.name.includes('Quan Lộc') || p.name === 'Quan Lộc');
    const quanLocBranchName = quanLoc ? (BRANCHES[quanLoc.branch] ?? '') : '';
    const stars = quanLoc?.stars.filter(s => s.type === 'major').map(s => s.name).join(', ') || 'Vô chính diệu';
    return `**【Cục diện Sự Nghiệp & Công Danh】**
Cung Quan Lộc tọa tại **${quanLocBranchName}**, có chính tinh: **${stars}**.

**【Phân tích đường công danh】**
${stars !== 'Vô chính diệu' ? `Sao ${stars} tại Quan Lộc biểu hiện năng lực chuyên môn và chí tiến thủ mạnh mẽ. Bạn hợp với các công việc đòi hỏi tầm nhìn chiến lược, quản trị hoặc chuyên gia sâu trong lĩnh vực của mình.` : 'Cung Quan Lộc vô chính diệu hợp với việc phát triển chuyên môn vững chắc hoặc làm việc trong các tổ chức lớn có nền tảng ổn định.'}

**【Tương tác Tài - Quan】**
Quan Lộc kết hợp chặt chẽ với cung Mệnh (${majorStarsText}) và cung Tài Bạch để hình thành vị thế công danh trong xã hội.

**【Lời khuyên định hướng】**
Theo lời dạy của Thầy Nghê Hải Hạ: "Người quân tử biết thời, biết thế, tiến thoái có chừng mực". Nắm bắt đúng thời điểm đại vận để bứt phá là chìa khóa then chốt của thành công.

---
*💡 Ghi chú: Đây là luận giải ngoại tuyến theo hệ thống dữ liệu Tử Vi Nghê Hải Hạ. Quý bạn có thể cấu hình API Key trong file \`.env.local\` để kích hoạt AI đàm đạo trực tiếp.*`;
  }

  // 3. Luận đoán theo chủ đề Tài Vận
  if (userPrompt.includes('tài vận') || userPrompt.includes('Tài Bạch')) {
    const taiBach = chart.palaces.find(p => p.name.includes('Tài Bạch') || p.name === 'Tài Bạch');
    const taiBachBranchName = taiBach ? (BRANCHES[taiBach.branch] ?? '') : '';
    const stars = taiBach?.stars.filter(s => s.type === 'major').map(s => s.name).join(', ') || 'Vô chính diệu';
    return `**【Cục diện Tài Vận & Tiền Tài】**
Cung Tài Bạch tọa tại **${taiBachBranchName}**, có chính tinh: **${stars}**.

**【Phương thức tụ tài】**
Cung Tài Bạch cai quản nguồn tiền bạc và cách thức kiếm tiền. ${stars !== 'Vô chính diệu' ? `Sao ${stars} chủ về đường tài vận rõ ràng, dòng tiền lưu chuyển tích cực thông qua năng lực thực tế.` : 'Tài Bạch vô chính diệu nên tích lũy bằng tài sản cố định hoặc điền sản, tránh đầu tư mạo hiểm đầu cơ.'}

**【Kho tài sản Điền Trạch】**
Cần phối hợp xem xét cung Điền Trạch để đánh giá khả năng tích lũy của cải lâu dài.

---
*💡 Ghi chú: Đây là luận giải ngoại tuyến theo hệ thống dữ liệu Tử Vi Nghê Hải Hạ. Quý bạn có thể cấu hình API Key trong file \`.env.local\` để kích hoạt AI đàm đạo trực tiếp.*`;
  }

  // 4. Luận đoán chi tiết cung vị cụ thể khi người dùng bấm chọn cung
  const palaceMatch = userPrompt.match(/【(.*?)】/);
  if (palaceMatch && palaceMatch[1]) {
    const targetPalaceName = palaceMatch[1];
    const targetPalace = chart.palaces.find(p => p.name.includes(targetPalaceName) || targetPalaceName.includes(p.name));
    if (targetPalace) {
      const targetBranchName = BRANCHES[targetPalace.branch] ?? '';
      const targetStemName = STEMS[targetPalace.stem] ?? '';
      const stars = targetPalace.stars.filter(s => s.type === 'major').map(s => `${s.name} (${s.brightness ?? 'Bình'})`).join(', ') || 'Vô chính diệu';
      return `**【Định tính cung ${targetPalace.name}】**
Cung tọa thủ tại địa chi **${targetBranchName}**, Cung can là **${targetStemName}**.
Chính tinh tọa thủ: **${stars}**.

**【Luận giải tinh diệu & Cổ quyết】**
Trong mệnh bàn, cung ${targetPalace.name} giữ trọng trách phản ánh vận trình và nhân sự tương ứng. Các tinh diệu hội tụ tại đây phản ánh khí thế và phương hướng ứng xử của mệnh chủ đối với phương diện này.

**【Tam phương tứ chính hội chiếu】**
Cung chịu ảnh hưởng tương hỗ từ đối cung và hai cung tam hợp, tạo nên thế cân bằng động cho tổng thể mệnh bàn.

---
*💡 Ghi chú: Luận giải ngoại tuyến theo chuẩn Tử Vi Đẩu Số. Bạn có thể thêm API Key trong file \`.env.local\` để AI đàm đạo chi tiết hơn.*`;
    }
  }

  // 5. Mặc định: Luận đoán Tổng quan Mệnh cách
  const mingBranchName = BRANCHES[chart.mingGongBranch] ?? '';
  const shenBranchName = BRANCHES[chart.shenGongBranch] ?? '';
  const yearName = chart.lunarInfo?.fourPillarsLunar?.[0] || chart.lunarInfo?.fourPillars?.[0] || `${chart.birthInfo.year}`;

  return `**【Định tính Mệnh cách】**
Mệnh chủ sinh năm **${yearName}** (${chart.birthInfo.day}/${chart.birthInfo.month}/${chart.birthInfo.year}), Cục số là **${chart.wuxingJuName}**.
Cung Mệnh an tại chi **${mingBranchName}**, Cung Thân an tại chi **${shenBranchName}**.

**【Luận giải Chính tinh thủ Mệnh】**
Chính tinh tọa thủ tại Mệnh: **${majorStarsText}**.
${mingSummary.keywords.length > 0 ? `Khí chất đặc trưng: **${mingSummary.keywords.join(' · ')}**.` : ''}
Theo tinh hoa 《Thiên Kỷ》 của Thầy Nghê Hải Hạ, mệnh cách được định hình bởi sự kết hợp giữa khí chất thiên phú và cách thức dụng tâm trong đời sống thực tế.${patternSection}

**【Tam phương tứ chính】**
Cung Mệnh liên hoàn cùng ba cung vị cốt lõi: Tài Bạch, Quan Lộc và Thiên Di, tạo thành trục vận hành chủ đạo cho cả cuộc đời.

**【Định hướng & Tu dưỡng】**
"Tận nhân lực, tri thiên mệnh". Nắm rõ sở trường của mệnh cách giúp bạn phát huy tối đa thiên phú, đồng thời tiết chế khuyết điểm để đạt tới sự an hòa, thuận lợi.

---
*💡 Ghi chú: Bạn có thể nhập API Key trong file \`.env.local\` để kích hoạt AI đàm đạo phân tích sâu hơn.*`;
}

// ── Xử lý POST request ──
export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { chart, messages } = body;

    if (!chart) {
      return NextResponse.json({ error: 'Thiếu dữ liệu lá số (chart)' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1]?.content || '';

    // Kiểm tra các API Key phổ biến nếu người dùng đã cấu hình trong .env.local
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY || process.env.GEMINI_API_KEY;

    // ── Trường hợp 1: Có Anthropic Claude API Key ──
    if (anthropicKey) {
      try {
        const { Anthropic } = await import('@anthropic-ai/sdk');
        const client = new Anthropic({ apiKey: anthropicKey });

        const stream = await client.messages.create({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 1500,
          temperature: 0.7,
          system: `Bạn là bậc thầy Tử Vi Đẩu Số theo trường phái Nghê Hải Hạ (Ni Haixia - Thiên Kỷ) kết hợp tinh hoa các bộ cổ thư 《Cốt Tủy Phú》, 《Tử Vi Đẩu Số Toàn Tập》, 《Tử Vi Đẩu Số Toàn Thư》. Luôn phân tích khách quan, chính trực, sâu sắc bằng tiếng Việt chuẩn mực, tập trung vào cách định hướng nhân sinh tích cực và thực tiễn.`,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          stream: true,
        });

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
          async start(controller) {
            for await (const chunk of stream) {
              if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                const payload = JSON.stringify({ delta: { text: chunk.delta.text } });
                controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
              }
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          },
        });

        return new Response(readable, {
          headers: {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } catch (err) {
        console.warn('Lỗi gọi Claude API, chuyển sang phân tích ngoại tuyến:', err);
      }
    }

    // ── Trường hợp 2: Có OpenAI / DeepSeek / Gemini API Key tương thích OpenAI protocol ──
    if (openaiKey) {
      try {
        const baseUrl = process.env.AI_BASE_URL || (process.env.DEEPSEEK_API_KEY ? 'https://api.deepseek.com/v1' : 'https://api.openai.com/v1');
        const model = process.env.AI_MODEL || (process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : 'gpt-4o-mini');

        const aiRes = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content: `Bạn là chuyên gia Tử Vi Đẩu Số theo trường phái Thầy Nghê Hải Hạ. Luận giải sắc bén, chân thành, chuẩn mực bằng tiếng Việt.`,
              },
              ...messages,
            ],
            stream: true,
          }),
        });

        if (aiRes.ok && aiRes.body) {
          return new Response(aiRes.body, {
            headers: {
              'Content-Type': 'text/event-stream; charset=utf-8',
              'Cache-Control': 'no-cache',
            },
          });
        }
      } catch (err) {
        console.warn('Lỗi gọi AI endpoint, chuyển sang phân tích ngoại tuyến:', err);
      }
    }

    // ── Trường hợp 3 (Mặc định): Luận giải Ngoại tuyến thông minh ──
    const offlineText = generateOfflineInterpretation(chart, lastMessage);
    return createSSEStream(offlineText);

  } catch (error) {
    console.error('Lỗi tại /api/interpret:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 });
  }
}
