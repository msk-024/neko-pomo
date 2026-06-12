// Shared design tokens for Nekopomo.
const NP = {
  cream:    '#FFF8F0',
  creamDk:  '#F5EAD8',
  pink:     '#FF85A1',
  pinkSoft: '#FFB8C5',
  pinkBg:   '#FFE8EE',
  brown:    '#4A2C1A',
  brownMid: '#7A5640',
  brownLt:  '#A88060',
  peach:    '#FFD5B8',
  peachDk:  '#F4B5A0',
  green:    '#7BA98A',
  yellow:   '#FFD27A',
  shadow:   'rgba(74,44,26,0.10)',
  shadowSm: 'rgba(74,44,26,0.06)',
  font: '"Nunito", "Hiragino Maru Gothic ProN", "ヒラギノ丸ゴ ProN W4", system-ui, sans-serif',
};
window.NP = NP;

// ─────────────────────────────────────────────────────────────
// SpeechBubble — cat's speech in a cloud bubble
// ─────────────────────────────────────────────────────────────
function SpeechBubble({ text, side = 'right', style = {} }) {
  return (
    <div style={{
      position: 'absolute',
      ...style,
      maxWidth: 160,
      fontFamily: NP.font,
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: 18,
        padding: '10px 14px',
        fontSize: 13,
        fontWeight: 700,
        color: NP.brown,
        lineHeight: 1.4,
        boxShadow: '0 4px 14px rgba(74,44,26,0.12)',
        position: 'relative',
        border: `2px solid ${NP.brown}`,
        whiteSpace: 'pre-line',
      }}>
        {text}
        {/* tail */}
        <div style={{
          position: 'absolute',
          bottom: -10,
          [side === 'right' ? 'left' : 'right']: 20,
          width: 14, height: 14,
          background: '#FFFFFF',
          borderRight: `2px solid ${NP.brown}`,
          borderBottom: `2px solid ${NP.brown}`,
          transform: 'rotate(45deg)',
        }} />
      </div>
    </div>
  );
}
window.SpeechBubble = SpeechBubble;

// ─────────────────────────────────────────────────────────────
// Circular timer dial with progress arc
// ─────────────────────────────────────────────────────────────
function TimerDial({ remaining, total, mode, running }) {
  const size = 240;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, remaining / total));
  const dashOffset = C * (1 - pct);

  const modeColor = mode === 'focus' ? NP.pink : (mode === 'break' ? NP.green : NP.yellow);
  const trackColor = mode === 'focus' ? NP.pinkBg : (mode === 'break' ? '#E6F0E8' : '#FFF5DC');

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* paw-dotted outer ring */}
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={trackColor} strokeWidth={stroke} strokeLinecap="round" />
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={modeColor} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      {/* paw marks at quarters */}
      {[0, 1, 2, 3].map(i => {
        const angle = (i * 90 - 90) * Math.PI / 180;
        const x = size/2 + (r) * Math.cos(angle) - 8;
        const y = size/2 + (r) * Math.sin(angle) - 8;
        return (
          <div key={i} style={{
            position: 'absolute', left: x, top: y,
            width: 16, height: 16, background: '#fff', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: pct < (1 - i/4) ? NP.brownLt : modeColor,
            boxShadow: `0 0 0 3px ${pct < (1 - i/4) ? trackColor : modeColor}`,
          }}>
            <PawPrint size={9} />
          </div>
        );
      })}
      {/* center content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 4,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 800, letterSpacing: 2,
          color: NP.brownMid, textTransform: 'uppercase',
        }}>
          {mode === 'focus' ? 'しゅうちゅう' : mode === 'break' ? 'きゅうけい' : 'ながきゅうけい'}
        </div>
        <div style={{
          fontFamily: NP.font,
          fontSize: 54, fontWeight: 800, color: NP.brown,
          lineHeight: 1, letterSpacing: -1,
          fontVariantNumeric: 'tabular-nums',
        }}>{timeStr}</div>
        <div style={{
          fontSize: 12, fontWeight: 700, color: NP.brownLt,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {running ? (
            <>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: modeColor,
                animation: 'np-pulse 1.4s ease-in-out infinite',
              }} />
              <span>むぎが見守り中</span>
            </>
          ) : (
            <span>タップしてスタート</span>
          )}
        </div>
      </div>
    </div>
  );
}
window.TimerDial = TimerDial;
