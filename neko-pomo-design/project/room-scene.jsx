// RoomScene — windowsill background with day / dusk / night variants.
// Built from simple rectangles + soft gradients so it reads as a cozy
// illustration without competing with Mugi.

function RoomScene({ time = 'day', children, height = 380 }) {
  // Sky colors per time of day
  const sky = {
    day:   { top: '#BFE3F2', mid: '#E5F2EE', sun: '#FFD27A', sunHalo: 'rgba(255,210,122,0.35)', wall: '#F2E3CE', sill: '#C9A57B', plant: '#7BA98A' },
    dusk:  { top: '#F4B07A', mid: '#FCD3A8', sun: '#FF8B7A', sunHalo: 'rgba(255,139,122,0.4)', wall: '#EFD4B5', sill: '#A88060', plant: '#6F8F73' },
    night: { top: '#1E2742', mid: '#2E3B5C', sun: '#FFE9A8', sunHalo: 'rgba(255,233,168,0.3)', wall: '#3D2E36', sill: '#2A1C20', plant: '#3D5A4C' },
  }[time] || {};

  const isNight = time === 'night';

  return (
    <div
      data-screen-label="cat-scene"
      style={{
        position: 'relative',
        height,
        width: '100%',
        overflow: 'hidden',
        background: sky.wall,
      }}
    >
      {/* Wall texture — vertical wood paneling */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(90deg,
          transparent 0px, transparent 38px,
          rgba(74,44,26,0.06) 38px, rgba(74,44,26,0.06) 39px)`,
      }} />

      {/* Window — large, centered. Slightly arched top */}
      <div style={{
        position: 'absolute',
        top: 28, left: '50%', transform: 'translateX(-50%)',
        width: 280, height: 220,
        background: `linear-gradient(180deg, ${sky.top} 0%, ${sky.mid} 100%)`,
        borderRadius: '120px 120px 8px 8px',
        boxShadow: 'inset 0 0 0 6px #4A2C1A, 0 2px 0 #4A2C1A',
        overflow: 'hidden',
      }}>
        {/* sun / moon */}
        <div style={{
          position: 'absolute', top: 36, right: 38,
          width: 54, height: 54, borderRadius: '50%',
          background: sky.sun,
          boxShadow: `0 0 36px 14px ${sky.sunHalo}`,
        }}>
          {isNight && (
            // moon crater
            <>
              <div style={{ position: 'absolute', top: 16, left: 32, width: 26, height: 26, borderRadius: '50%', background: '#1E2742' }} />
            </>
          )}
        </div>

        {/* clouds — daytime only */}
        {time === 'day' && (
          <>
            <div style={{ position: 'absolute', top: 80, left: 30, width: 56, height: 16, borderRadius: 20, background: 'rgba(255,255,255,0.75)' }} />
            <div style={{ position: 'absolute', top: 70, left: 40, width: 36, height: 14, borderRadius: 20, background: 'rgba(255,255,255,0.75)' }} />
            <div style={{ position: 'absolute', top: 130, right: 80, width: 44, height: 13, borderRadius: 20, background: 'rgba(255,255,255,0.6)' }} />
          </>
        )}

        {/* stars — night only */}
        {isNight && (
          <>
            {[
              [40, 30], [80, 60], [120, 24], [200, 50], [240, 90],
              [60, 110], [180, 130], [100, 150], [220, 160], [30, 170],
            ].map(([x, y], i) => (
              <div key={i} style={{
                position: 'absolute', top: y, left: x,
                width: 3, height: 3, borderRadius: '50%',
                background: '#FFF8E8',
                boxShadow: '0 0 4px rgba(255,248,232,0.8)',
              }} />
            ))}
          </>
        )}

        {/* distant rolling hills */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 50,
          background: isNight ? '#1A1F33' : (time === 'dusk' ? '#C57D5C' : '#9FC7A3'),
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          transform: 'translateY(20px) scaleX(1.4)',
        }} />

        {/* window cross — sash */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '50%', width: 5,
          background: '#4A2C1A', transform: 'translateX(-2.5px)',
        }} />
        <div style={{
          position: 'absolute', left: 0, right: 0, top: '50%', height: 5,
          background: '#4A2C1A', transform: 'translateY(-2.5px)',
        }} />
      </div>

      {/* Windowsill */}
      <div style={{
        position: 'absolute',
        top: 244, left: '50%', transform: 'translateX(-50%)',
        width: 320, height: 18,
        background: sky.sill,
        borderRadius: 4,
        boxShadow: '0 3px 0 rgba(74,44,26,0.25)',
      }} />

      {/* Small plant pot on sill, left */}
      <div style={{ position: 'absolute', top: 200, left: 36, width: 36, height: 42 }}>
        {/* leaves */}
        <div style={{ position: 'absolute', top: 0, left: 6, width: 12, height: 22, borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%', background: sky.plant, transform: 'rotate(-18deg)' }} />
        <div style={{ position: 'absolute', top: -2, left: 18, width: 12, height: 24, borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%', background: sky.plant, transform: 'rotate(12deg)' }} />
        <div style={{ position: 'absolute', top: 6, left: 12, width: 12, height: 18, borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%', background: sky.plant }} />
        {/* pot */}
        <div style={{ position: 'absolute', bottom: 0, left: 4, width: 28, height: 16, background: '#C97A5C', borderRadius: '2px 2px 6px 6px', clipPath: 'polygon(8% 0, 92% 0, 100% 100%, 0% 100%)' }} />
      </div>

      {/* Book stack on sill, right */}
      <div style={{ position: 'absolute', top: 212, right: 36, width: 44, height: 32 }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 44, height: 9, background: '#FF85A1', borderRadius: 1 }} />
        <div style={{ position: 'absolute', bottom: 9, left: 3, width: 38, height: 8, background: '#FFD5B8', borderRadius: 1 }} />
        <div style={{ position: 'absolute', bottom: 17, left: 6, width: 32, height: 8, background: '#4A2C1A', borderRadius: 1 }} />
        {/* tiny pages */}
        <div style={{ position: 'absolute', bottom: 1, left: 1, width: 42, height: 1, background: 'rgba(255,255,255,0.6)' }} />
        <div style={{ position: 'absolute', bottom: 10, left: 4, width: 36, height: 1, background: 'rgba(255,255,255,0.6)' }} />
      </div>

      {/* paw print decorations on wall */}
      {[
        { top: 30, left: 22, rot: -15, op: 0.12 },
        { top: 70, left: 14, rot: 10, op: 0.10 },
        { top: 50, right: 18, rot: 18, op: 0.12 },
        { top: 110, right: 10, rot: -8, op: 0.08 },
      ].map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: p.top, left: p.left, right: p.right,
          transform: `rotate(${p.rot}deg)`,
          opacity: p.op,
          color: '#4A2C1A',
        }}>
          <PawPrint size={28} />
        </div>
      ))}

      {/* Floor (under window) */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 100,
        background: `linear-gradient(180deg, ${isNight ? '#2A1C20' : '#D9BB94'} 0%, ${isNight ? '#1F1418' : '#B8956E'} 100%)`,
      }}>
        {/* floor planks */}
        <div style={{ position: 'absolute', inset: 0,
          backgroundImage: `repeating-linear-gradient(90deg,
            transparent 0px, transparent 56px,
            rgba(74,44,26,0.18) 56px, rgba(74,44,26,0.18) 57px)`,
        }} />
      </div>

      {/* Slot for cat */}
      {children}
    </div>
  );
}

function PawPrint({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <ellipse cx="12" cy="16" rx="6" ry="5"/>
      <ellipse cx="5" cy="9" rx="2.2" ry="3"/>
      <ellipse cx="9" cy="5" rx="2.2" ry="3"/>
      <ellipse cx="15" cy="5" rx="2.2" ry="3"/>
      <ellipse cx="19" cy="9" rx="2.2" ry="3"/>
    </svg>
  );
}

window.RoomScene = RoomScene;
window.PawPrint = PawPrint;
