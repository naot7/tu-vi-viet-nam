'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { TimeView } from './TimeNav';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hidden?: boolean; // Không hiển thị bong bóng người dùng cho các tin nhắn tự động theo chủ đề
}

interface SelectedSiHua {
  starName: string;
  siHua: string;
  view: TimeView;
}

interface InsightPanelProps {
  chart: ZiweiChart;
  selectedPalace?: Palace | null;
  selectedSiHua?: SelectedSiHua | null;
}

const TOPICS = [
  { key: 'overview',     label: 'Mệnh Cách' },
  { key: 'love',        label: 'Tình Duyên' },
  { key: 'career',      label: 'Sự Nghiệp' },
  { key: 'wealth',      label: 'Tài Vận' },
  { key: 'health',      label: 'Sức Khỏe' },
  { key: 'personality', label: 'Tính Cách' },
] as const;

const TOPIC_PROMPTS: Record<string, string> = {
  overview: `Xin hãy tổng quan luận đoán mệnh cách theo cấu trúc sau:

**【Định tính mệnh cách】**
Khái quát một câu về cốt cách cốt lõi của lá số và khí chất của mệnh chủ.

**【Luận giải chính tinh】**
Đặc tính cốt lõi của chính tinh thủ Mệnh, trích dẫn quan điểm của Thầy Nghê Hải Hạ hoặc cổ thư.

**【Tam phương tứ chính】**
Phân tích liên hoàn Tài Bạch, Quan Lộc, Thiên Di và thế đứng tổng thể của mệnh bàn.

**【Đại hạn hiện tại】**
Xu hướng đại vận 10 năm hiện tại và những phương diện đáng lưu tâm nhất.

**【Ưu thế & Lưu ý】**
Thiên phú bẩm sinh vượt trội, cùng với những rủi ro hoặc bài học cuộc đời cần tu dưỡng.`,

  love: `Xin hãy phân tích chuyên sâu về tình duyên và hôn nhân theo cấu trúc sau:

**【Cục diện tình cảm】**
Định tính một câu về duyên phận tình cảm trong đời.

**【Phân tích cung Phu Thê】**
Chính tinh, phụ tinh, tứ hóa tại cung Phu Thê, cùng luận điểm cụ thể của Thầy Nghê Hải Hạ.

**【Tam phương liên đới】**
Ảnh hưởng của cung Phúc Đức, Thiên Di, Quan Lộc đến đường tình duyên.

**【Tình duyên trong đại hạn hiện tại】**
Xu hướng tình cảm trong 10 năm hiện tại và các mốc thời gian đáng chú ý.

**【Lời khuyên thực tế】**
Lời khuyên chân thành và thiết thực để gìn giữ hạnh phúc gia đạo.`,

  career: `Xin hãy phân tích chuyên sâu về sự nghiệp theo cấu trúc sau:

**【Cục diện sự nghiệp】**
Định tính một câu về đường công danh: Hợp làm công chức, chuyên môn hay tự thân khởi nghiệp kinh doanh.

**【Phân tích cung Quan Lộc】**
Chính tinh, tứ hóa tại Quan Lộc, cùng đánh giá của Thầy Nghê Hải Hạ về cấu trúc này.

**【Liên kết với cung Tài Bạch】**
Mối quan hệ giữa sự nghiệp và nguồn tiền tài, đường kiếm tiền sở trường.

**【Đại hạn công danh hiện tại】**
Xu thế phát triển sự nghiệp trong vận trình 10 năm hiện tại.

**【Lời khuyên thực tế】**
Ngành nghề phù hợp nhất, hướng đi chiến lược và cách nắm bắt cơ hội.`,

  wealth: `Xin hãy phân tích chuyên sâu về tài vận và tiền bạc theo cấu trúc sau:

**【Cục diện tài vận】**
Định tính một câu về phương thức tụ tài: Là chính tài ổn định hay hoành tài bạo phát.

**【Phân tích cung Tài Bạch】**
Chính tinh, tứ hóa tại Tài Bạch, nguồn gốc tiền bạc và cách thức lưu chuyển dòng tiền.

**【Cung Điền Trạch (Kho tài sản)】**
Năng lực tích lũy của cải và vận thế bất động sản, đất đai nhà cửa.

**【Tài vận đại hạn hiện tại】**
Vận may tiền bạc hiện tại và những cảnh báo rủi ro hao tài cần phòng tránh.

**【Lời khuyên quản lý tài chính】**
Chiến lược đầu tư và giữ tiền tối ưu cho mệnh chủ.`,

  health: `Xin hãy phân tích sức khỏe và thể trạng theo cấu trúc sau:

**【Chính tinh cung Tật Ách】**
Ý nghĩa ngũ hành và các sao tọa thủ cung Tật Ách.

**【Những nguy cơ tiềm ẩn】**
Kết hợp lý thuyết Tử Ngọ Lưu Chú và Đông y Nghê Hải Hạ để chỉ ra các cơ quan cần chăm sóc đặc biệt.

**【Xu hướng sức khỏe trong đại hạn】**
Thể trạng hiện tại và các giai đoạn cần lưu tâm phòng ngừa.

**【Lời khuyên dưỡng sinh】**
Phương pháp rèn luyện, lối sống và chế độ điều dưỡng phù hợp.`,

  personality: `Xin hãy phân tích chuyên sâu về tính cách và tâm lý theo cấu trúc sau:

**【Tính cách chính tinh Mệnh】**
Bản chất tâm lý cốt lõi từ các sao thủ Mệnh theo góc nhìn Thầy Nghê Hải Hạ.

**【Tổng hòa tam phương】**
Ảnh hưởng của Tài, Quan, Di và Phúc Đức lên tư duy hành vi trọn vẹn.

**【Phong cách giao tế nhân sinh】**
Cách đối nhân xử thế, tương tác xã hội và phong thái làm việc.

**【Ưu thế & Bài học tu dưỡng】**
Điểm mạnh vượt trội cần phát huy và những góc khuất tâm lý cần chuyển hóa.`,
};

const PALACE_ROLES: Record<string, string> = {
  'Mệnh':               'Bản thân, cốt cách, tính danh, tiên thiên',
  'Huynh Đệ':           'Anh chị em, tri kỷ, đối tác hợp tác',
  'Phu Thê':            'Tình duyên, phối ngẫu, đời sống hôn nhân',
  'Tử Tức':             'Con cái, hậu duệ, học trò, cấp dưới',
  'Tài Bạch':           'Nguồn tiền tài, thu nhập, phương thức kiếm tiền',
  'Tật Ách':            'Sức khỏe, thể trạng, bệnh tật, ách nạn',
  'Thiên Di':           'Giao tế bên ngoài, xuất ngoại, môi trường hoạt động',
  'Nô Bộc (Giao Hữu)':  'Bạn bè, đồng nghiệp, nhân viên, khách hàng',
  'Quan Lộc':           'Sự nghiệp, học vấn, chức vị, thành tựu xã hội',
  'Điền Trạch':         'Bất động sản, đất đai, nhà ở, kho của cải',
  'Phúc Đức':           'Đời sống tinh thần, thọ khang, phúc ấm tổ tiên',
  'Phụ Mẫu':            'Cha mẹ, trưởng bối, quan hệ bảo hộ văn thư',
};

/** Render Markdown từ AI: **【Tiêu đề】** → đầu đề vàng nổi bật, **chữ đậm** → strong */
function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\*\*【(.+?)】\*\*$/);
        if (sectionMatch) {
          return (
            <div key={i} className="pt-3 pb-0.5 first:pt-0">
              <span className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--t-gold)' }}>
                【{sectionMatch[1]}】
              </span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} className="text-[11px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>
            {parts.map((part, j) =>
              j % 2 === 0
                ? part
                : <strong key={j} className="font-medium" style={{ color: 'var(--t-text)' }}>{part}</strong>
            )}
          </div>
        );
      })}
      {streaming && (
        <span
          className="inline-block w-1.5 h-3 ml-0.5 animate-pulse rounded-sm align-middle"
          style={{ background: 'var(--t-gold)', opacity: 0.6 }}
        />
      )}
    </div>
  );
}

export default function InsightPanel({ chart, selectedPalace, selectedSiHua }: InsightPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>('overview');
  const messagesRef = useRef<Message[]>([]);
  const loadingRef = useRef(false);
  const autoLoaded = useRef(false);
  const lastPalaceBranch = useRef<number | undefined>(undefined);
  const lastSiHuaKey = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Tự động phân tích tổng quan mệnh cách khi khởi tạo
  useEffect(() => {
    if (autoLoaded.current) return;
    autoLoaded.current = true;
    sendMessage(TOPIC_PROMPTS.overview, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Phân tích cung vị khi người dùng chọn cung trên bàn cờ
  useEffect(() => {
    if (!selectedPalace || selectedPalace.branch === lastPalaceBranch.current) return;
    lastPalaceBranch.current = selectedPalace.branch;

    const majorStars = selectedPalace.stars.filter(s => s.type === 'major');
    const starDesc = majorStars.length > 0
      ? majorStars.map(s => `${s.name}${s.siHua ? ' Hóa ' + s.siHua : ''}`).join(', ')
      : 'Vô chính diệu (mượn chính tinh cung đối diện)';
    const role = PALACE_ROLES[selectedPalace.name] ?? '';

    const prompt = `Xin hãy phân tích trọng điểm cung 【${selectedPalace.name}】 (${role ? `chủ quản: ${role}` : ''}), cung này có chính tinh tọa thủ là: ${starDesc}, theo cấu trúc sau:

**【Định tính cung vị】**
Ý nghĩa của cung ${selectedPalace.name} trong mệnh bàn, cùng đánh giá tổng quát về cách cục tinh diệu này.

**【Luận giải chính tinh】**
Luận giải chi tiết vị trí chính tinh tại cung này theo quan điểm Thầy Nghê Hải Hạ và cổ quyết.

**【Tam phương tứ chính hội chiếu】**
Tác động qua lại của các cung tam phương và đối cung lên cung vị này.

**【Lời khuyên thực tiễn】**
Những định hướng ứng xử và hành động phù hợp nhất với cung vị này.`;

    sendMessage(prompt, true);
  }, [selectedPalace]); // eslint-disable-line react-hooks/exhaustive-deps

  // Phân tích phi hóa khi người dùng chọn tứ hóa
  useEffect(() => {
    if (!selectedSiHua) return;
    const key = `${selectedSiHua.starName}-${selectedSiHua.siHua}-${selectedSiHua.view}`;
    if (key === lastSiHuaKey.current) return;
    lastSiHuaKey.current = key;

    const palaceOfStar = chart.palaces.find(p =>
      p.stars.some(s => s.name === selectedSiHua.starName)
    );
    const palaceName = palaceOfStar?.name ?? 'Không rõ cung vị';
    const viewLabel = selectedSiHua.view === 'daxian' ? 'Đại Hạn' : 'Lưu Niên';

    const prompt = `Xin hãy phân tích tác động phi hóa 【${viewLabel}: ${selectedSiHua.starName} Hóa ${selectedSiHua.siHua}】 theo cấu trúc sau:

**【Ý nghĩa Hóa ${selectedSiHua.siHua}】**
Hàm nghĩa trọng tâm của Hóa ${selectedSiHua.siHua} trong hệ thống Tử Vi Nghê Hải Hạ, cùng ý nghĩa chuyên biệt khi đi cùng sao ${selectedSiHua.starName}.

**【Tác động tại cung tọa thủ】**
${selectedSiHua.starName} Hóa ${selectedSiHua.siHua} đóng tại 【${palaceName}】, lĩnh vực cung này cai quản chịu biến chuyển ra sao.

**【Đường bay phi hóa tam phương tứ chính】**
Tác động liên hoàn đến cung đối và hai cung tam hợp.

**【Xu hướng vận trình hiện tại】**
Trong chu kỳ ${viewLabel}, tác động thực tế của Hóa ${selectedSiHua.siHua} lên vận số gần đây của mệnh chủ.

**【Lời khuyên hành động】**
Hành động thực tế cần làm để đón nhận cát khí hoặc hóa giải hung hiểm.`;

    sendMessage(prompt, true);
  }, [selectedSiHua]); // eslint-disable-line react-hooks/exhaustive-deps

  const streamResponse = async (apiMessages: { role: 'user' | 'assistant'; content: string }[]) => {
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart, messages: apiMessages }),
      });
      if (res.status === 404) throw new Error('api-missing');
      if (!res.ok) throw new Error('Yêu cầu thất bại');
      if (!res.body) throw new Error('Không có luồng phản hồi');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const delta = JSON.parse(data).delta?.text ?? '';
            assistantText += delta;
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'assistant', content: assistantText };
              return updated;
            });
          } catch { /* skip */ }
        }
      }
    } catch (e) {
      const missing = e instanceof Error && e.message === 'api-missing';
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: missing 
          ? 'Phiên bản nguồn mở chưa cấu hình API giải đoán (/api/interpret). Quý bạn vui lòng cấu hình API Key trong biến môi trường để kích hoạt tính năng luận đoán AI. Bản thân thuật toán an sao lá số hoạt động hoàn toàn offline.' 
          : 'Giải đoán tạm thời bị gián đoạn, quý bạn vui lòng thử lại sau.' 
      }]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const sendMessage = (text: string, hidden = false) => {
    if (!text.trim() || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const userMsg: Message = { role: 'user', content: text, hidden };
    const apiMessages = [...messagesRef.current, userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    streamResponse(apiMessages);
  };

  const handleTopicClick = (topicKey: string) => {
    if (loadingRef.current) return;
    setActiveTopic(topicKey);
    sendMessage(TOPIC_PROMPTS[topicKey], true);
  };

  const handleSend = () => {
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden card-glass">

      {/* ── Các nút chủ đề luận đoán ── */}
      <div className="flex-shrink-0 px-2 pt-2.5 pb-2" style={{ borderBottom: '1px solid var(--t-border)' }}>
        <div className="grid grid-cols-6 gap-1">
          {TOPICS.map(t => {
            const isActive = activeTopic === t.key;
            return (
              <button
                key={t.key}
                onClick={() => handleTopicClick(t.key)}
                disabled={loading}
                className="py-1.5 text-[10px] font-medium rounded-lg transition-all duration-150 disabled:opacity-40"
                style={{
                  background: isActive ? 'rgba(212,168,67,0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(212,168,67,0.3)' : 'var(--t-border)'}`,
                  color: isActive ? 'var(--t-gold)' : 'var(--t-faint)',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Danh sách tin nhắn trao đổi ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3" style={{ color: 'var(--t-gold)', opacity: 0.1 }}>✦</div>
            <p className="text-[10px] animate-pulse" style={{ color: 'var(--t-faint)' }}>Đang tạo luận giải mệnh lý…</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            if (msg.role === 'user' && msg.hidden) return null;

            if (msg.role === 'user') {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div
                    className="max-w-[85%] rounded-xl px-3 py-2 text-[11px]"
                    style={{
                      background: 'rgba(212,168,67,0.08)',
                      border: '1px solid rgba(212,168,67,0.18)',
                      color: 'var(--t-gold)',
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              );
            }

            // Phản hồi từ AI Mệnh lý sư
            const isLastMsg = i === messages.length - 1;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className="text-[9px] tracking-widest mb-2 flex items-center gap-1.5"
                  style={{ color: 'var(--t-faint)' }}
                >
                  <span style={{ color: 'var(--t-gold)', opacity: 0.4 }}>✦</span>
                  Luận Đoán Mệnh Lý
                </div>
                <AiContent text={msg.content} streaming={loading && isLastMsg} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Ô nhập câu hỏi tiếp nối ── */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2" style={{ borderTop: '1px solid var(--t-border)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Hỏi tiếp, ví dụ: Năm nay có cơ hội thăng tiến không?"
            disabled={loading}
            className="flex-1 rounded-lg px-3 py-2 text-[11px] focus:outline-none transition-colors"
            style={{
              background: 'var(--t-card)',
              border: '1px solid var(--t-border)',
              color: 'var(--t-text)',
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-3 py-2 rounded-lg text-[11px] font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(212,168,67,0.15)',
              border: '1px solid rgba(212,168,67,0.25)',
              color: 'var(--t-gold)',
            }}
          >
            {loading ? '…' : 'Hỏi tiếp'}
          </button>
        </div>
      </div>

    </div>
  );
}