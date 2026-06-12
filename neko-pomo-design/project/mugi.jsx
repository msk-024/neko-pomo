// Mugi — the kijitora (brown tabby) cat mascot for Nekopomo.
// Built from simple geometric primitives (circles, ellipses, paths) to read
// as a clean flat illustration without slop-y over-rendering.
//
// Props:
//   mood: 'calm' | 'focus' | 'happy' | 'grumpy' | 'sleep' | 'wave'
//   size: number (default 220)

function Mugi({ mood = 'calm', size = 220, style = {} }) {
  // Palette — kijitora warm tones tuned to sit on cream background.
  const fur     = '#D8A574';   // main body
  const furDk   = '#A87149';   // shadow / muzzle
  const stripe  = '#6B4226';   // tabby stripes
  const belly   = '#FBE9D2';   // belly + chin
  const ear     = '#F4B5A0';   // inner ear (peach)
  const nose    = '#E07B7B';   // pink nose
  const cheek   = '#FFB8C5';   // blush
  const mouth   = '#4A2C1A';
  const eyeDark = '#2D1810';
  const eyeShine= '#FFFFFF';

  // Eye / mouth shapes per mood.
  // Focus = closed peaceful eyes; Happy = ^^ smile; Grumpy = sharp angled;
  // Sleep = closed + Zzz; Wave = winking + open mouth; Calm = round eyes.
  const renderFace = () => {
    switch (mood) {
      case 'focus':
        return (
          <g>
            {/* closed gentle arches */}
            <path d="M85 122 Q92 117 99 122" stroke={eyeDark} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
            <path d="M133 122 Q140 117 147 122" stroke={eyeDark} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
            {/* tiny soft mouth */}
            <path d="M112 138 Q116 142 120 138" stroke={mouth} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          </g>
        );
      case 'happy':
        return (
          <g>
            {/* ^^ happy eyes */}
            <path d="M84 124 Q91 116 98 124" stroke={eyeDark} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
            <path d="M134 124 Q141 116 148 124" stroke={eyeDark} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
            {/* open smile */}
            <path d="M108 136 Q116 144 124 136" stroke={mouth} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          </g>
        );
      case 'grumpy':
        return (
          <g>
            {/* angled stern eyes */}
            <path d="M82 118 L101 124" stroke={eyeDark} strokeWidth="4" strokeLinecap="round"/>
            <path d="M131 124 L150 118" stroke={eyeDark} strokeWidth="4" strokeLinecap="round"/>
            <circle cx="91" cy="124" r="2.5" fill={eyeDark}/>
            <circle cx="141" cy="124" r="2.5" fill={eyeDark}/>
            {/* flat unimpressed mouth */}
            <path d="M108 140 L124 140" stroke={mouth} strokeWidth="2.5" strokeLinecap="round"/>
          </g>
        );
      case 'sleep':
        return (
          <g>
            <path d="M85 122 Q92 117 99 122" stroke={eyeDark} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
            <path d="M133 122 Q140 117 147 122" stroke={eyeDark} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
            <path d="M112 138 Q116 142 120 138" stroke={mouth} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
            {/* Zzz */}
            <text x="165" y="85" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="22" fill={stripe} opacity="0.8">z</text>
            <text x="180" y="68" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="16" fill={stripe} opacity="0.6">z</text>
          </g>
        );
      case 'wave':
        return (
          <g>
            {/* wink — left closed, right open */}
            <path d="M84 122 Q91 117 98 122" stroke={eyeDark} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
            <ellipse cx="141" cy="121" rx="4.5" ry="6" fill={eyeDark}/>
            <circle cx="142.5" cy="118.5" r="1.6" fill={eyeShine}/>
            {/* open mouth */}
            <ellipse cx="116" cy="140" rx="4" ry="3" fill={mouth}/>
          </g>
        );
      case 'calm':
      default:
        return (
          <g>
            {/* round eyes */}
            <ellipse cx="91" cy="122" rx="4.5" ry="6" fill={eyeDark}/>
            <ellipse cx="141" cy="122" rx="4.5" ry="6" fill={eyeDark}/>
            <circle cx="92.5" cy="119.5" r="1.6" fill={eyeShine}/>
            <circle cx="142.5" cy="119.5" r="1.6" fill={eyeShine}/>
            {/* small ω mouth */}
            <path d="M108 136 Q112 140 116 137 Q120 140 124 136" stroke={mouth} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 232 240"
      width={size}
      height={size * 240 / 232}
      style={{ display: 'block', overflow: 'visible', ...style }}
    >
      {/* shadow under cat */}
      <ellipse cx="116" cy="232" rx="62" ry="6" fill="#4A2C1A" opacity="0.12"/>

      {/* tail curling around right side */}
      <path
        d="M172 196 Q210 188 208 152 Q206 124 184 124"
        stroke={fur} strokeWidth="20" fill="none" strokeLinecap="round"
      />
      <path
        d="M172 196 Q210 188 208 152 Q206 124 184 124"
        stroke={stripe} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"
        strokeDasharray="2 18"
      />
      {/* tail tip white */}
      <circle cx="184" cy="124" r="9" fill={belly}/>

      {/* body — pear shape sitting */}
      <path
        d="M58 200 Q50 150 76 130 Q90 122 116 122 Q142 122 156 130 Q182 150 174 200 Q172 222 116 222 Q60 222 58 200 Z"
        fill={fur}
      />
      {/* belly */}
      <ellipse cx="116" cy="195" rx="40" ry="35" fill={belly}/>

      {/* body stripes */}
      <path d="M70 168 Q66 178 72 188" stroke={stripe} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M68 145 Q62 155 70 162" stroke={stripe} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M162 168 Q166 178 160 188" stroke={stripe} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M164 145 Q170 155 162 162" stroke={stripe} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/>

      {/* front paws */}
      <ellipse cx="92" cy="218" rx="18" ry="12" fill={fur}/>
      <ellipse cx="140" cy="218" rx="18" ry="12" fill={fur}/>
      {/* paw beans */}
      <circle cx="92" cy="220" r="3" fill={nose} opacity="0.5"/>
      <circle cx="140" cy="220" r="3" fill={nose} opacity="0.5"/>

      {/* head */}
      {/* ears */}
      <path d="M62 78 L72 38 L98 70 Z" fill={fur}/>
      <path d="M170 78 L160 38 L134 70 Z" fill={fur}/>
      <path d="M70 72 L76 50 L88 68 Z" fill={ear}/>
      <path d="M162 72 L156 50 L144 68 Z" fill={ear}/>
      {/* ear stripes */}
      <path d="M76 42 L80 60" stroke={stripe} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <path d="M156 42 L152 60" stroke={stripe} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>

      {/* head circle */}
      <ellipse cx="116" cy="110" rx="60" ry="52" fill={fur}/>
      {/* forehead M-stripes (kijitora signature) */}
      <path d="M104 70 Q108 80 106 92" stroke={stripe} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75"/>
      <path d="M116 68 Q116 80 116 90" stroke={stripe} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75"/>
      <path d="M128 70 Q124 80 126 92" stroke={stripe} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75"/>
      {/* side cheek stripes */}
      <path d="M68 108 Q60 112 64 122" stroke={stripe} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
      <path d="M164 108 Q172 112 168 122" stroke={stripe} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>

      {/* white muzzle area */}
      <ellipse cx="116" cy="138" rx="22" ry="14" fill={belly}/>

      {/* cheek blush */}
      <ellipse cx="82" cy="135" rx="7" ry="4.5" fill={cheek} opacity="0.75"/>
      <ellipse cx="150" cy="135" rx="7" ry="4.5" fill={cheek} opacity="0.75"/>

      {/* nose */}
      <path d="M113 128 L119 128 L116 132 Z" fill={nose}/>

      {/* face (mood-dependent) */}
      {renderFace()}
    </svg>
  );
}

window.Mugi = Mugi;
