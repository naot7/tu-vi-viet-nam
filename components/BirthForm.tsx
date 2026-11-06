'use client';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BirthInfo } from '@/lib/ziwei/types';
import { SHICHEN, BRANCHES } from '@/lib/ziwei/constants';
import { useTheme } from '@/components/ThemeProvider';
import { PROVINCES, DEFAULT_LONGITUDE } from '@/lib/ziwei/cities';
import { formToBirthInfo, calcTrueSolarBranch } from '@/lib/ziwei/share';
import { lunarToSolarVN, solarToLunarVN } from '@/lib/ziwei/lunar-solar';
import { getHistoricalTzPeriod } from '@/lib/ziwei/dst-vn';

export interface BirthFormState {
  name: string;
  year: string;
  month: string;
  day: string;
  clockHour: string;
  clockMinute: string;
  clockSecond?: string;
  unknownTime: boolean;
  province: string;
  city: string;
  longitude: number;
  gender: 'male' | 'female';
  calendarType?: 'solar' | 'lunar';
  isLeapMonth?: boolean;
}

interface BirthFormProps {
  onSubmit: (info: BirthInfo) => void;
  loading?: boolean;
  initialData?: Partial<BirthFormState>;
  onFormSave?: (data: BirthFormState) => void;
  /** Ẩn nút nộp biểu mẫu nội bộ (cho kịch bản kết hợp lá số vợ chồng/đối tác) */
  hideSubmit?: boolean;
}

/** Kiểm tra ngày tháng năm hợp lệ */
function isValidDate(y: number, m: number, d: number): boolean {
  if (!y || !m || !d) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export default function BirthForm({ onSubmit, loading, initialData, onFormSave, hideSubmit }: BirthFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Chế độ lịch: Dương lịch ('solar') hoặc Âm lịch ('lunar')
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>(initialData?.calendarType ?? 'solar');

  // Trạng thái ngày Âm lịch riêng biệt cho tab Âm lịch
  const [lunarYear, setLunarYear] = useState<string>(initialData?.year ?? '');
  const [lunarMonth, setLunarMonth] = useState<string>(initialData?.month ?? '');
  const [lunarDay, setLunarDay] = useState<string>(initialData?.day ?? '');
  const [isLeapMonth, setIsLeapMonth] = useState<boolean>(initialData?.isLeapMonth ?? false);

  const [form, setForm] = useState<BirthFormState>({
    name: initialData?.name ?? '',
    year: initialData?.year ?? '',
    month: initialData?.month ?? '',
    day: initialData?.day ?? '',
    clockHour: initialData?.clockHour ?? '8',
    clockMinute: initialData?.clockMinute ?? '0',
    clockSecond: initialData?.clockSecond ?? '0',
    unknownTime: initialData?.unknownTime ?? false,
    province: initialData?.province ?? 'Thành phố Hà Nội',
    city: initialData?.city ?? 'Trung tâm Hà Nội (Hoàn Kiếm)',
    longitude: initialData?.longitude ?? DEFAULT_LONGITUDE,
    gender: initialData?.gender ?? 'male',
    calendarType: initialData?.calendarType ?? 'solar',
    isLeapMonth: initialData?.isLeapMonth ?? false,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Đồng bộ cho component cha
  useEffect(() => {
    onFormSave?.({ ...form, calendarType, isLeapMonth });
  }, [form, calendarType, isLeapMonth, onFormSave]);

  const cityList = useMemo(() => {
    const prov = PROVINCES.find(p => p.name === form.province);
    return prov ? prov.cities : [];
  }, [form.province]);

  const currentProvince = useMemo(() => {
    return PROVINCES.find(p => p.name === form.province);
  }, [form.province]);

  const currentCityData = useMemo(() => {
    return currentProvince?.cities.find(c => c.name === form.city);
  }, [currentProvince, form.city]);

  const isSouth = currentCityData?.isSouthOf17thParallel ?? currentProvince?.isSouthOf17thParallel ?? false;

  // Tính Chi của giờ Chân Thái Dương Thời
  const branch = useMemo(() => {
    if (form.unknownTime) return 0;
    return calcTrueSolarBranch(
      parseInt(form.clockHour, 10) || 0,
      parseInt(form.clockMinute, 10) || 0,
      form.longitude,
      parseInt(form.clockSecond || '0', 10) || 0,
    );
  }, [form.clockHour, form.clockMinute, form.clockSecond, form.longitude, form.unknownTime]);

  // Chênh lệch phút theo kinh tuyến chuẩn 105°E của Việt Nam
  const offsetMin = Math.round((form.longitude - 105) * 4);
  const shichenInfo = SHICHEN[branch];

  // ─── Kiểm tra múi giờ lịch sử Việt Nam ───────────────────────────
  const y = parseInt(form.year, 10) || 0;
  const m = parseInt(form.month, 10) || 0;
  const d = parseInt(form.day, 10) || 0;

  const historicalTz = useMemo(() => {
    if (y < 1940 || y > 1976 || !m || !d) return null;
    return getHistoricalTzPeriod(y, m, d, isSouth);
  }, [y, m, d, isSouth]);

  // Áp dụng quy đổi múi giờ lịch sử về UTC+7
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

  // ─── Đồng bộ tab Âm lịch ↔ Dương lịch ──────────────────────────
  const handleSwitchToLunar = () => {
    setCalendarType('lunar');
    if (y && m && d && isValidDate(y, m, d)) {
      const lunar = solarToLunarVN(y, m, d);
      if (lunar) {
        setLunarYear(String(lunar.lunarYear));
        setLunarMonth(String(lunar.lunarMonth));
        setLunarDay(String(lunar.lunarDay));
        setIsLeapMonth(lunar.isLeapMonth);
      }
    }
  };

  const handleSwitchToSolar = () => {
    setCalendarType('solar');
  };

  const handleLunarDateChange = (newLy: string, newLm: string, newLd: string, newLeap: boolean) => {
    setLunarYear(newLy);
    setLunarMonth(newLm);
    setLunarDay(newLd);
    setIsLeapMonth(newLeap);

    const lyNum = parseInt(newLy, 10);
    const lmNum = parseInt(newLm, 10);
    const ldNum = parseInt(newLd, 10);

    if (lyNum && lmNum && ldNum) {
      try {
        const solar = lunarToSolarVN(lyNum, lmNum, ldNum, newLeap);
        if (solar) {
          setForm(prev => ({
            ...prev,
            year: String(solar.year),
            month: String(solar.month),
            day: String(solar.day),
            isLeapMonth: newLeap,
          }));
        }
      } catch {
        // Ngày âm lịch không tồn tại trong tháng này
      }
    }
  };

  // ─── Kiểm tra tính hợp lệ của dữ liệu ────────────────────────────
  const errors = {
    year: !form.year ? 'Vui lòng chọn năm sinh'
      : y < 1900 || y > 2030 ? 'Năm sinh trong khoảng 1900–2030'
      : '',
    month: !form.month ? 'Vui lòng chọn tháng' : '',
    day: !form.day ? 'Vui lòng chọn ngày'
      : form.year && form.month && !isValidDate(y, m, d) ? `Tháng ${m} không có ngày ${d}`
      : '',
  };
  const hasError = Object.values(errors).some(Boolean);

  // Tiến trình hoàn thành
  const steps = [
    Boolean(form.year && form.month && form.day && !errors.year && !errors.month && !errors.day),
    Boolean(form.province && form.city),
    form.unknownTime || Boolean(form.clockHour !== undefined && form.clockMinute !== undefined),
    true,
  ];

  // Chuỗi tóm tắt
  const showSummary = steps[0] && steps[2] && !hasError;
  const summaryText = showSummary
    ? [
        `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`,
        form.city || form.province || '',
        form.unknownTime ? 'Giờ không rõ (Giờ Tý)' : `Giờ ${BRANCHES[branch]} (${form.clockHour.padStart(2, '0')}:${form.clockMinute.padStart(2, '0')}${form.clockSecond ? `:${form.clockSecond.padStart(2, '0')}` : ''})`,
        form.gender === 'male' ? 'Nam mệnh' : 'Nữ mệnh',
      ].filter(Boolean).join(' · ')
    : '';

  const handleProvince = (prov: string) => {
    const provData = PROVINCES.find(p => p.name === prov);
    const firstCity = provData?.cities[0];
    setForm({ ...form, province: prov, city: firstCity?.name || '', longitude: firstCity?.longitude ?? DEFAULT_LONGITUDE });
  };

  const handleCity = (cityName: string) => {
    const prov = PROVINCES.find(p => p.name === form.province);
    const cityData = prov?.cities.find(c => c.name === cityName);
    setForm({ ...form, city: cityName, longitude: cityData?.longitude ?? DEFAULT_LONGITUDE });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({ year: true, month: true, day: true });
    if (hasError) return;
    onFormSave?.({ ...form, calendarType, isLeapMonth });
    onSubmit(formToBirthInfo(form));
  };

  // ─── Định nghĩa màu sắc & giao diện ──────────────────────────────
  const bg = isDark ? 'rgba(8,16,40,0.85)' : 'rgba(255,255,255,0.92)';
  const border = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(200,160,60,0.2)';
  const labelClr = isDark ? 'rgba(180,200,225,0.9)' : 'rgba(120,80,10,0.55)';
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,252,240,0.8)';
  const inputBorder = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(200,160,60,0.25)';
  const inputClr = isDark ? '#e8eef8' : '#2a1a00';
  const focusBorder = isDark ? 'rgba(212,168,67,0.5)' : 'rgba(180,120,20,0.5)';
  const errorClr = isDark ? '#f87171' : '#dc2626';
  const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,250,235,0.7)';
  const panelBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(200,160,60,0.2)';
  const goldText = isDark ? '#d4a843' : '#7a5008';
  const summaryBg = isDark ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.07)';
  const summaryBorder = isDark ? 'rgba(37,99,235,0.35)' : 'rgba(37,99,235,0.25)';
  const summaryClr = isDark ? 'rgba(147,197,253,0.9)' : 'rgba(37,99,235,0.85)';

  const inputStyle = {
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    color: inputClr,
    borderRadius: '14px',
    padding: '10px 14px',
    fontSize: '13px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
  } as React.CSSProperties;

  const errorInputStyle = { ...inputStyle, borderColor: errorClr };

  function FieldError({ msg }: { msg: string }) {
    return (
      <AnimatePresence>
        {msg && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18 }}
            style={{ color: errorClr, fontSize: '11px', marginTop: '4px' }}
          >
            ✕ {msg}
          </motion.p>
        )}
      </AnimatePresence>
    );
  }

  const showErr = (field: string) => touched[field] || submitAttempted;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: bg, border: `1px solid ${border}`, borderRadius: '24px', padding: '28px', backdropFilter: 'blur(20px)' }}
    >
      {/* Tiêu đề */}
      <h3 style={{ color: goldText, fontSize: '12px', letterSpacing: '0.3em', textAlign: 'center', marginBottom: '16px', fontWeight: 600 }}>
        ── NHẬP THÔNG TIN SINH THẦN ──
      </h3>

      {/* ── Tiến trình hoàn thành ── */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
        {steps.map((done, i) => (
          <motion.div
            key={i}
            animate={{ background: done ? (isDark ? '#d4a843' : '#b07820') : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(200,160,60,0.15)') }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, height: '2px', borderRadius: '2px' }}
          />
        ))}
      </div>

      {/* ── Tab chuyển đổi Dương lịch / Âm lịch ── */}
      <div style={{ display: 'flex', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(200,160,60,0.1)', borderRadius: '12px', padding: '3px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={handleSwitchToSolar}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: calendarType === 'solar' ? 600 : 400,
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            background: calendarType === 'solar' ? (isDark ? '#d4a843' : '#b07820') : 'transparent',
            color: calendarType === 'solar' ? (isDark ? '#08080a' : '#ffffff') : labelClr,
            transition: 'all 0.2s',
          }}
        >
          Dương lịch (Mặt trời)
        </button>
        <button
          type="button"
          onClick={handleSwitchToLunar}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: calendarType === 'lunar' ? 600 : 400,
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            background: calendarType === 'lunar' ? (isDark ? '#d4a843' : '#b07820') : 'transparent',
            color: calendarType === 'lunar' ? (isDark ? '#08080a' : '#ffffff') : labelClr,
            transition: 'all 0.2s',
          }}
        >
          Âm lịch (Mặt trăng)
        </button>
      </div>

      {/* ── Họ và tên ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>Họ và tên (Tùy chọn)</label>
        <input
          type="text"
          placeholder="Ví dụ: Nguyễn Văn A"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = focusBorder; }}
          onBlur={e => { e.target.style.borderColor = inputBorder; }}
        />
      </div>

      {/* ── Ngày sinh (Dương lịch hoặc Âm lịch) ── */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ fontSize: '11px', color: labelClr, letterSpacing: '0.05em' }}>
            {calendarType === 'solar' ? 'Ngày sinh Dương lịch' : 'Ngày sinh Âm lịch'}
          </label>
          {calendarType === 'lunar' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: goldText, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isLeapMonth}
                onChange={e => handleLunarDateChange(lunarYear, lunarMonth, lunarDay, e.target.checked)}
              />
              Tháng nhuận
            </label>
          )}
        </div>

        {calendarType === 'solar' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div>
              <select
                value={form.day}
                onChange={e => { setForm({ ...form, day: e.target.value }); setTouched(t => ({ ...t, day: true })); }}
                style={showErr('day') && errors.day ? errorInputStyle : inputStyle}
                required
              >
                <option value="">Ngày</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(dy => (
                  <option key={dy} value={String(dy)}>Ngày {String(dy).padStart(2, '0')}</option>
                ))}
              </select>
              <FieldError msg={showErr('day') ? errors.day : ''} />
            </div>
            <div>
              <select
                value={form.month}
                onChange={e => { setForm({ ...form, month: e.target.value }); setTouched(t => ({ ...t, month: true })); }}
                style={showErr('month') && errors.month ? errorInputStyle : inputStyle}
                required
              >
                <option value="">Tháng</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(mo => (
                  <option key={mo} value={String(mo)}>Tháng {String(mo).padStart(2, '0')}</option>
                ))}
              </select>
              <FieldError msg={showErr('month') ? errors.month : ''} />
            </div>
            <div>
              <select
                value={form.year}
                onChange={e => { setForm({ ...form, year: e.target.value }); setTouched(t => ({ ...t, year: true })); }}
                style={showErr('year') && errors.year ? errorInputStyle : inputStyle}
                required
              >
                <option value="">Năm</option>
                {Array.from({ length: 131 }, (_, i) => 2030 - i).map(yr => (
                  <option key={yr} value={String(yr)}>{yr}</option>
                ))}
              </select>
              <FieldError msg={showErr('year') ? errors.year : ''} />
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div>
              <select
                value={lunarDay}
                onChange={e => handleLunarDateChange(lunarYear, lunarMonth, e.target.value, isLeapMonth)}
                style={inputStyle}
                required
              >
                <option value="">Mùng / Ngày</option>
                {Array.from({ length: 30 }, (_, i) => i + 1).map(ld => (
                  <option key={ld} value={String(ld)}>Ngày {String(ld).padStart(2, '0')}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={lunarMonth}
                onChange={e => handleLunarDateChange(lunarYear, e.target.value, lunarDay, isLeapMonth)}
                style={inputStyle}
                required
              >
                <option value="">Tháng Âm</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(lm => (
                  <option key={lm} value={String(lm)}>Tháng {lm}{isLeapMonth ? ' (Nhuận)' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={lunarYear}
                onChange={e => handleLunarDateChange(e.target.value, lunarMonth, lunarDay, isLeapMonth)}
                style={inputStyle}
                required
              >
                <option value="">Năm Âm</option>
                {Array.from({ length: 131 }, (_, i) => 2030 - i).map(yr => (
                  <option key={yr} value={String(yr)}>{yr}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {calendarType === 'lunar' && form.year && form.month && form.day && (
          <p style={{ fontSize: '11px', color: isDark ? 'rgba(180,210,235,0.85)' : 'rgba(100,70,10,0.6)', marginTop: '6px' }}>
            → Tương đương Dương lịch: {String(form.day).padStart(2, '0')}/{String(form.month).padStart(2, '0')}/{form.year}
          </p>
        )}
      </div>

      {/* ── Nơi sinh (Địa giới hành chính 34 tỉnh/thành NQ 202/2025/QH15) ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>
          Nơi sinh (Hiệu chỉnh Chân Thái Dương Thời theo kinh độ)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <select
            value={form.province}
            onChange={e => handleProvince(e.target.value)}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = focusBorder; }}
            onBlur={e => { e.target.style.borderColor = inputBorder; }}
          >
            <option value="">Chọn Tỉnh / Thành phố</option>
            {PROVINCES.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
          <select
            value={form.city}
            onChange={e => handleCity(e.target.value)}
            disabled={!form.province}
            style={{ ...inputStyle, opacity: form.province ? 1 : 0.45 }}
            onFocus={e => { e.target.style.borderColor = focusBorder; }}
            onBlur={e => { e.target.style.borderColor = inputBorder; }}
          >
            <option value="">{form.province ? 'Chọn Quận/Huyện/Khu vực' : 'Chọn Tỉnh/TP trước'}</option>
            {cityList.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <AnimatePresence mode="wait">
          {form.province ? (
            <motion.p
              key="location-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: '10px', color: isDark ? 'rgba(180,210,235,0.85)' : 'rgba(100,70,10,0.5)', marginTop: '5px' }}
            >
              {form.city || form.province} · Kinh độ {form.longitude.toFixed(2)}°E · Chênh lệch kinh tuyến 105°E: {offsetMin >= 0 ? '+' : ''}{offsetMin} phút
            </motion.p>
          ) : (
            <motion.p
              key="location-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: '10px', color: isDark ? 'rgba(165,185,210,0.7)' : 'rgba(140,100,20,0.45)', marginTop: '5px' }}
            >
              * Tự động tính Chân Thái Dương Thời theo kinh tuyến 105°E (UTC+7) chuẩn xác.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Banner cảnh báo đổi múi giờ lịch sử Việt Nam ── */}
      {historicalTz && historicalTz.deltaMinutes !== 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: isDark ? 'rgba(234, 179, 8, 0.12)' : 'rgba(234, 179, 8, 0.1)',
            border: '1px solid rgba(234, 179, 8, 0.35)',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '11px',
            color: isDark ? '#fef08a' : '#854d0e',
            lineHeight: 1.5,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>
            ⚠️ Lưu ý Múi giờ lịch sử: Giai đoạn này Việt Nam áp dụng {historicalTz.periodLabel} (UTC+{historicalTz.actualOffsetMinutes / 60}).
          </div>
          <div style={{ marginBottom: '8px' }}>
            Giờ ghi trên giấy khai sinh có thể chạy sớm hơn giờ chuẩn thiên văn UTC+7 là {Math.abs(historicalTz.deltaMinutes)} phút.
          </div>
          <button
            type="button"
            onClick={handleApplyHistoricalTzAdjust}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 600,
              background: '#eab308',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Tự động quy đổi về UTC+7 ({historicalTz.deltaMinutes} phút)
          </button>
        </motion.div>
      )}

      {/* ── Thời gian sinh (Giờ : Phút : Giây) ── */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>
          Thời gian sinh (HH:mm:ss theo đồng hồ dân dụng)
        </label>
        <div style={{ borderRadius: '14px', padding: '12px', background: panelBg, border: `1px solid ${panelBorder}`, opacity: form.unknownTime ? 0.45 : 1, pointerEvents: form.unknownTime ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <select
              value={form.clockHour}
              onChange={e => setForm({ ...form, clockHour: e.target.value })}
              style={inputStyle}
            >
              {Array.from({ length: 24 }, (_, i) => i).map(h => (
                <option key={h} value={String(h)}>{String(h).padStart(2, '0')} Giờ</option>
              ))}
            </select>
            <select
              value={form.clockMinute}
              onChange={e => setForm({ ...form, clockMinute: e.target.value })}
              style={inputStyle}
            >
              {Array.from({ length: 60 }, (_, i) => i).map(min => (
                <option key={min} value={String(min)}>{String(min).padStart(2, '0')} Phút</option>
              ))}
            </select>
            <select
              value={form.clockSecond || '0'}
              onChange={e => setForm({ ...form, clockSecond: e.target.value })}
              style={inputStyle}
            >
              {Array.from({ length: 60 }, (_, i) => i).map(sec => (
                <option key={sec} value={String(sec)}>{String(sec).padStart(2, '0')} Giây</option>
              ))}
            </select>
          </div>

          {/* Kết quả Chân Thái Dương Thời */}
          <div style={{ textAlign: 'center', padding: '4px 0' }}>
            <span style={{ fontSize: '11px', color: isDark ? 'rgba(170,195,220,0.75)' : 'rgba(140,100,20,0.5)' }}>Chân Thái Dương Thời → </span>
            <span style={{ fontSize: '15px', color: goldText, fontWeight: 700, letterSpacing: '0.08em' }}>
              Giờ {BRANCHES[branch]}
            </span>
            {shichenInfo && (
              <span style={{ fontSize: '11px', color: isDark ? 'rgba(170,195,220,0.75)' : 'rgba(140,100,20,0.5)', marginLeft: '4px' }}>
                ({shichenInfo.range})
              </span>
            )}
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.unknownTime}
            onChange={e => setForm({ ...form, unknownTime: e.target.checked })}
            style={{ width: '14px', height: '14px', borderRadius: '4px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '11px', color: isDark ? 'rgba(165,185,210,0.7)' : 'rgba(140,100,20,0.45)' }}>
            Không rõ giờ sinh cụ thể (Mặc định tính theo giờ Tý 23:00–01:00)
          </span>
        </label>
      </div>

      {/* ── Giới tính ── */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>Giới tính</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {(['male', 'female'] as const).map(g => {
            const active = form.gender === g;
            const isMale = g === 'male';
            const accent = isMale ? '37,99,235' : '225,29,72';
            return (
              <motion.button
                key={g}
                type="button"
                onClick={() => setForm({ ...form, gender: g })}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: `1px solid ${active ? `rgba(${accent},0.6)` : inputBorder}`,
                  background: active ? `rgba(${accent},0.08)` : inputBg,
                  color: active ? `rgba(${accent},0.9)` : (isDark ? 'rgba(190,205,225,0.7)' : 'rgba(100,80,40,0.4)'),
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                {isMale ? '♂ Nam Mệnh' : '♀ Nữ Mệnh'}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Thanh tóm tắt thông tin đã chọn ── */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: 12 }}
            exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div style={{
              background: summaryBg,
              border: `1px solid ${summaryBorder}`,
              borderRadius: '12px',
              padding: '9px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '12px', color: summaryClr }}>✓</span>
              <span style={{ fontSize: '11px', color: summaryClr, letterSpacing: '0.03em', flex: 1 }}>
                {summaryText}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nút xác nhận lập lá số ── */}
      {!hideSubmit && (
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={loading ? {} : { scale: 1.01 }}
          whileTap={loading ? {} : { scale: 0.98 }}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            background: loading
              ? (isDark ? 'rgba(212,168,67,0.15)' : 'rgba(180,120,20,0.15)')
              : (isDark
                ? 'linear-gradient(135deg, rgba(180,130,40,0.9), rgba(240,200,80,0.9))'
                : 'linear-gradient(135deg, #9a6210, #c88020)'),
            color: loading ? (isDark ? 'rgba(212,168,67,0.4)' : 'rgba(120,80,10,0.4)') : (isDark ? '#08080a' : '#fff8e8'),
            boxShadow: loading ? 'none' : (isDark ? '0 4px 20px rgba(212,168,67,0.2)' : '0 4px 16px rgba(140,100,20,0.25)'),
            transition: 'all 0.2s',
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }}
              />
              Đang an sao lập lá số…
            </span>
          ) : 'LẬP LÁ SỐ TỬ VI · LUẬN ĐOÁN MỆNH LÝ'}
        </motion.button>
      )}
    </motion.form>
  );
}
