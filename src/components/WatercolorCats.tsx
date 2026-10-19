import React from 'react';

export type CatSpriteId =
  | 'wave'      // #1 打招呼猫 (进门页 / 欢迎)
  | 'walk'      // #2 走路猫 (请假模块卡 & 请假空态)
  | 'box'       // #3 纸箱猫 (消费模块卡 & 消费空态)
  | 'fish'      // #4 吃鱼猫 (打工模块卡 & 打工空态)
  | 'yarn'      // #5 毛线球猫 (娱乐模块卡 & 娱乐空态)
  | 'sleep'     // #6 睡觉猫 (小金库 0 金空态)
  | 'balloon'   // #7 气球猫 (小金库 100% 满额达成)
  | 'ledger'    // #8 账本猫 (角色管理空态 / 统计)
  | 'tilt';     // #9 歪头猫 (404 / 离线 / 异常提示)

export const CAT_SPRITE_META: Record<
  CatSpriteId,
  {
    index: number;
    name: string;
    spritePos: string;
    usage: string;
    mood: string;
    accentHex: string;
    softHex: string;
  }
> = {
  wave: {
    index: 1,
    name: '打招呼猫',
    spritePos: '0% 0%',
    usage: '进门页主视觉 (88px) · 首次建档引导',
    mood: '元气迎客 · 举右爪打招呼',
    accentHex: '#9e473c',
    softHex: '#f3e3df',
  },
  walk: {
    index: 2,
    name: '叼叶散步猫',
    spritePos: '50% 0%',
    usage: '首页「请假」卡 (40px) · 请假列表空态 (92px)',
    mood: '轻快出门 · 叼着鼠尾草叶去放风',
    accentHex: '#9e473c',
    softHex: '#f3e3df',
  },
  box: {
    index: 3,
    name: '钻纸箱猫',
    spritePos: '100% 0%',
    usage: '首页「消费」卡 (40px) · 消费列表空态 (92px)',
    mood: '拆快递蹲暖木箱 · 捂紧荷包',
    accentHex: '#b87638',
    softHex: '#f5e8dc',
  },
  fish: {
    index: 4,
    name: '抱小鱼干猫',
    spritePos: '0% 50%',
    usage: '首页「打工」卡 (40px) · 打工账本空态 (92px)',
    mood: '努力搬砖攒小鱼干 · 满载而归',
    accentHex: '#6f7d5c',
    softHex: '#e3e9dc',
  },
  yarn: {
    index: 5,
    name: '扑毛线球猫',
    spritePos: '50% 50%',
    usage: '首页「娱乐」卡 (40px) · 娱乐时长空态 (92px)',
    mood: '抱着雾蓝毛线球打滚 · 适度玩耍',
    accentHex: '#6b7d8c',
    softHex: '#e3e8ec',
  },
  sleep: {
    index: 6,
    name: '揣手睡觉猫',
    spritePos: '100% 50%',
    usage: '小金库 0 金空态 (88px) · 暂无待办静默态',
    mood: '蜷在亚麻软垫里呼呼大睡 · 等待第一笔入库',
    accentHex: '#c89648',
    softHex: '#f5ebd6',
  },
  balloon: {
    index: 7,
    name: '举金气球猫',
    spritePos: '0% 100%',
    usage: '小金库 100% 满额达成 (92px) · 全员目标达成',
    mood: '举着暖金圆气球欢呼 · 满载喜悦',
    accentHex: '#c89648',
    softHex: '#f5ebd6',
  },
  ledger: {
    index: 8,
    name: '戴眼镜算账猫',
    spritePos: '50% 100%',
    usage: '角色管理空态 (88px) · 账目核对',
    mood: '架着圆框小眼镜端详名册',
    accentHex: '#527a73',
    softHex: '#e4efed',
  },
  tilt: {
    index: 9,
    name: '歪头问号猫',
    spritePos: '100% 100%',
    usage: '404 页 (96px) · 网络离线重连提示 (36px)',
    mood: '歪脑袋冒小问号 · 温和报错不焦虑',
    accentHex: '#a85248',
    softHex: '#f4e3e1',
  },
};

/* 复刻参考图顶部横幅右侧的「晴天小屋 + 微笑暖阳 + 盆栽飞鸟」绘本风插画 */
export const WarmSunnyHouseIllustration: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <svg
      width="156"
      height="108"
      viewBox="0 0 156 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* 地面暖沙阴影 */}
      <ellipse cx="86" cy="99" rx="62" ry="6" fill="#d8cbb4" fillOpacity="0.55" />

      {/* 远景飞鸟 */}
      <path
        d="M14 44 Q20 39 25 44 Q30 39 36 44"
        stroke="#8c7d6b"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 右上角微笑暖阳 */}
      <g>
        <circle cx="126" cy="36" r="14" fill="#e5b85c" fillOpacity="0.88" />
        {/* 阳光短射线 */}
        <line x1="126" y1="15" x2="126" y2="18" stroke="#c89648" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="141" y1="21" x2="139" y2="23" stroke="#c89648" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="147" y1="36" x2="144" y2="36" stroke="#c89648" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="111" y1="21" x2="113" y2="23" stroke="#c89648" strokeWidth="1.8" strokeLinecap="round" />
        {/* 太阳笑脸 */}
        <circle cx="122" cy="34" r="1.3" fill="#6e5225" />
        <circle cx="130" cy="34" r="1.3" fill="#6e5225" />
        <path
          d="M123 38 Q126 41 129 38"
          stroke="#6e5225"
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* 小屋烟囱 */}
      <rect x="97" y="42" width="8" height="15" rx="1.5" fill="#b36a4c" />

      {/* 小屋墙体 (暖米白) */}
      <path
        d="M52 60 L82 37 L112 60 V96 H52 V60 Z"
        fill="#fbf6eb"
        stroke="#bca98e"
        strokeWidth="1.4"
      />

      {/* 小屋人字形陶土红屋顶 */}
      <path
        d="M44 63 L82 33 L120 63 L115 67 L82 41 L49 67 Z"
        fill="#a45a3f"
      />

      {/* 阁楼爱心小窗 */}
      <path
        d="M82 54 C79 51, 76 49, 76 46.5 C76 44.8, 77.5 43.5, 79.2 43.5 C80.5 43.5, 81.5 44.3, 82 45.2 C82.5 44.3, 83.5 43.5, 84.8 43.5 C86.5 43.5, 88 44.8, 88 46.5 C88 49, 85 51, 82 54 Z"
        fill="#b36a4c"
      />

      {/* 左右暖黄圆窗 */}
      <g>
        <rect x="60" y="65" width="10" height="12" rx="5" fill="#e9c87b" stroke="#bca98e" strokeWidth="1" />
        <line x1="65" y1="65" x2="65" y2="77" stroke="#bca98e" strokeWidth="1" />
        <line x1="60" y1="71" x2="70" y2="71" stroke="#bca98e" strokeWidth="1" />
      </g>
      <g>
        <rect x="94" y="65" width="10" height="12" rx="5" fill="#e9c87b" stroke="#bca98e" strokeWidth="1" />
        <line x1="99" y1="65" x2="99" y2="77" stroke="#bca98e" strokeWidth="1" />
        <line x1="94" y1="71" x2="104" y2="71" stroke="#bca98e" strokeWidth="1" />
      </g>

      {/* 鼠尾草绿拱门 */}
      <path
        d="M75 96 V76 C75 71.5, 89 71.5, 89 76 V96 Z"
        fill="#7f9474"
        stroke="#627558"
        strokeWidth="1.2"
      />
      <circle cx="85.5" cy="85" r="1.2" fill="#fbf6eb" />

      {/* 左侧小盆栽 */}
      <g>
        <polygon points="28,87 39,87 37,97 30,97" fill="#b87654" />
        <path d="M33.5 87 V73" stroke="#5f7350" strokeWidth="1.6" strokeLinecap="round" />
        <ellipse cx="29" cy="76" rx="4.5" ry="2.8" transform="rotate(-24 29 76)" fill="#7f9474" />
        <ellipse cx="38" cy="73" rx="4.5" ry="2.8" transform="rotate(24 38 73)" fill="#7f9474" />
      </g>

      {/* 右侧小盆栽 */}
      <g>
        <polygon points="126,89 136,89 134,97 128,97" fill="#b87654" />
        <path d="M131 89 V79" stroke="#5f7350" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="127" cy="81" rx="4" ry="2.5" transform="rotate(-20 127 81)" fill="#7f9474" />
        <ellipse cx="135" cy="79" rx="4" ry="2.5" transform="rotate(20 135 79)" fill="#7f9474" />
      </g>
    </svg>
  );
};

export const WatercolorCat: React.FC<{
  id: CatSpriteId;
  size?: number;
  className?: string;
}> = ({ id, size = 44, className = '' }) => {
  const uid = `cat-${id}-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label={CAT_SPRITE_META[id].name}
    >
      <defs>
        <radialGradient id={`${uid}-wash-terra`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#c87d65" stopOpacity="0.38" />
          <stop offset="70%" stopColor="#f3e3df" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#fcfbf7" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-wash-peach`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#d4956a" stopOpacity="0.38" />
          <stop offset="70%" stopColor="#f5e8dc" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#fcfbf7" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-wash-sage`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#7f9474" stopOpacity="0.38" />
          <stop offset="70%" stopColor="#e3e9dc" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#fcfbf7" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-wash-slate`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#7d909e" stopOpacity="0.38" />
          <stop offset="70%" stopColor="#e3e8ec" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#fcfbf7" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-wash-gold`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#d9a552" stopOpacity="0.40" />
          <stop offset="70%" stopColor="#f5ebd6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fcfbf7" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 底层暖纸水彩晕染背景 */}
      <circle
        cx="50"
        cy="52"
        r="44"
        fill={
          id === 'box'
            ? `url(#${uid}-wash-peach)`
            : id === 'fish' || id === 'ledger'
            ? `url(#${uid}-wash-sage)`
            : id === 'yarn'
            ? `url(#${uid}-wash-slate)`
            : id === 'sleep' || id === 'balloon'
            ? `url(#${uid}-wash-gold)`
            : `url(#${uid}-wash-terra)`
        }
      />

      {/* #1 打招呼猫 (wave) */}
      {id === 'wave' && (
        <g>
          <path
            d="M66 74 C78 72, 84 62, 79 54 C75 49, 71 57, 73 63"
            stroke="#4a4238"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="50" cy="69" rx="20" ry="16" fill="#fcfaf5" stroke="#4a4238" strokeWidth="2.2" />
          <ellipse cx="38" cy="40" rx="8" ry="6" fill="#c87d65" fillOpacity="0.5" />
          <ellipse cx="62" cy="42" rx="7" ry="5" fill="#d9a552" fillOpacity="0.45" />
          <path
            d="M31 46 C28 32, 30 22, 34 22 C39 22, 42 30, 45 32 L55 32 C58 30, 61 22, 66 22 C70 22, 72 32, 69 46 C72 55, 64 63, 50 63 C36 63, 28 55, 31 46 Z"
            fill="#fcfaf5"
            stroke="#4a4238"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M34 27 L33 36 L40 33 Z" fill="#c87d65" fillOpacity="0.6" />
          <path d="M66 27 L67 36 L60 33 Z" fill="#c87d65" fillOpacity="0.6" />
          <ellipse cx="37" cy="51" rx="4.2" ry="2.4" fill="#c87d65" fillOpacity="0.55" />
          <ellipse cx="63" cy="51" rx="4.2" ry="2.4" fill="#c87d65" fillOpacity="0.55" />
          <circle cx="42" cy="46" r="2.4" fill="#3d3831" />
          <circle cx="58" cy="46" r="2.4" fill="#3d3831" />
          <path d="M47 50 Q50 53 53 50" stroke="#4a4238" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path
            d="M66 60 C73 50, 79 44, 82 48 C85 52, 77 62, 69 66"
            fill="#fcfaf5"
            stroke="#4a4238"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="78" cy="50" r="2.2" fill="#c87d65" fillOpacity="0.7" />
          <path d="M84 39 Q89 43 87 49" stroke="#9e473c" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      )}

      {/* #2 走路猫 (walk - 请假) */}
      {id === 'walk' && (
        <g>
          <path
            d="M24 58 C16 51, 16 39, 22 37 C26 36, 26 45, 29 52"
            stroke="#4a4238"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="47" cy="62" rx="21" ry="13" fill="#fcfaf5" stroke="#4a4238" strokeWidth="2.2" />
          <ellipse cx="42" cy="57" rx="9" ry="5" fill="#c87d65" fillOpacity="0.42" />
          <path d="M34 72 L31 82" stroke="#4a4238" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M43 73 L45 83" stroke="#4a4238" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M55 73 L52 82" stroke="#4a4238" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M62 71 L67 80" stroke="#4a4238" strokeWidth="2.4" strokeLinecap="round" />
          <path
            d="M52 46 C50 34, 53 25, 57 25 C60 25, 63 31, 65 33 L72 33 C75 30, 78 25, 81 26 C84 27, 85 37, 81 47 C83 55, 76 61, 66 61 C56 61, 51 54, 52 46 Z"
            fill="#fcfaf5"
            stroke="#4a4238"
            strokeWidth="2.2"
          />
          <circle cx="62" cy="45" r="2.2" fill="#3d3831" />
          <circle cx="74" cy="45" r="2.2" fill="#3d3831" />
          <ellipse cx="59" cy="49" rx="3.2" ry="1.8" fill="#c87d65" fillOpacity="0.55" />
          <ellipse cx="77" cy="49" rx="3.2" ry="1.8" fill="#c87d65" fillOpacity="0.55" />
          <path d="M69 51 Q79 52 87 47" stroke="#526040" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M81 49 C84 42, 92 42, 91 49 C89 54, 83 53, 81 49 Z"
            fill="#7f9474"
            stroke="#526040"
            strokeWidth="1.6"
          />
        </g>
      )}

      {/* #3 纸箱猫 (box - 消费) */}
      {id === 'box' && (
        <g>
          <path
            d="M33 48 C30 35, 32 24, 36 24 C40 24, 43 31, 46 33 L54 33 C57 31, 60 24, 64 24 C68 24, 70 35, 67 48 C69 55, 62 60, 50 60 C38 60, 31 55, 33 48 Z"
            fill="#fcfaf5"
            stroke="#4a4238"
            strokeWidth="2.2"
          />
          <ellipse cx="38" cy="36" rx="6" ry="4" fill="#c87d65" fillOpacity="0.5" />
          <circle cx="43" cy="44" r="2.3" fill="#3d3831" />
          <circle cx="57" cy="44" r="2.3" fill="#3d3831" />
          <ellipse cx="38" cy="48" rx="3.5" ry="2" fill="#c87d65" fillOpacity="0.55" />
          <ellipse cx="62" cy="48" rx="3.5" ry="2" fill="#c87d65" fillOpacity="0.55" />
          <path d="M48 47 L50 49 L52 47" stroke="#4a4238" strokeWidth="1.8" strokeLinecap="round" />
          <rect
            x="24"
            y="53"
            width="52"
            height="28"
            rx="4"
            fill="#e8d5be"
            stroke="#4a4238"
            strokeWidth="2.2"
          />
          <path
            d="M24 53 L16 61 L24 64 Z"
            fill="#d4b896"
            stroke="#4a4238"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M76 53 L84 61 L76 64 Z"
            fill="#d4b896"
            stroke="#4a4238"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <ellipse cx="39" cy="53" rx="4.5" ry="3.2" fill="#fcfaf5" stroke="#4a4238" strokeWidth="2" />
          <ellipse cx="61" cy="53" rx="4.5" ry="3.2" fill="#fcfaf5" stroke="#4a4238" strokeWidth="2" />
          <rect x="44" y="63" width="12" height="7" rx="1.5" fill="#fcfbf7" stroke="#9e543d" strokeWidth="1.4" />
        </g>
      )}

      {/* #4 吃鱼猫 (fish - 打工) */}
      {id === 'fish' && (
        <g>
          <ellipse cx="50" cy="68" rx="21" ry="16" fill="#fcfaf5" stroke="#4a4238" strokeWidth="2.2" />
          <path
            d="M32 46 C29 33, 31 23, 35 23 C39 23, 43 30, 46 32 L54 32 C57 30, 61 23, 65 23 C69 23, 71 33, 68 46 C71 55, 63 62, 50 62 C37 62, 29 55, 32 46 Z"
            fill="#fcfaf5"
            stroke="#4a4238"
            strokeWidth="2.2"
          />
          <path d="M39 44 Q42 40 45 44" stroke="#4a4238" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M55 44 Q58 40 61 44" stroke="#4a4238" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <ellipse cx="36" cy="48" rx="3.8" ry="2.2" fill="#c87d65" fillOpacity="0.55" />
          <ellipse cx="64" cy="48" rx="3.8" ry="2.2" fill="#c87d65" fillOpacity="0.55" />
          <path
            d="M33 63 C42 54, 56 54, 65 63 L73 57 L71 69 L65 63 C56 72, 42 72, 33 63 Z"
            fill="#7f9474"
            stroke="#4a4238"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="41" cy="62" r="1.6" fill="#3d3831" />
          <ellipse cx="36" cy="66" rx="4.5" ry="3.2" fill="#fcfaf5" stroke="#4a4238" strokeWidth="2" />
          <ellipse cx="60" cy="66" rx="4.5" ry="3.2" fill="#fcfaf5" stroke="#4a4238" strokeWidth="2" />
        </g>
      )}

      {/* #5 毛线球猫 (yarn - 娱乐) */}
      {id === 'yarn' && (
        <g>
          <ellipse cx="44" cy="66" rx="19" ry="15" fill="#fcfaf5" stroke="#4a4238" strokeWidth="2.2" />
          <path
            d="M28 45 C25 33, 27 23, 31 23 C35 23, 39 30, 42 32 L50 32 C53 30, 57 23, 61 23 C65 23, 67 33, 64 45 C67 54, 59 60, 46 60 C33 60, 25 54, 28 45 Z"
            fill="#fcfaf5"
            stroke="#4a4238"
            strokeWidth="2.2"
          />
          <circle cx="39" cy="44" r="2.4" fill="#3d3831" />
          <circle cx="53" cy="44" r="2.4" fill="#3d3831" />
          <ellipse cx="35" cy="48" rx="3.4" ry="2" fill="#c87d65" fillOpacity="0.55" />
          <ellipse cx="57" cy="48" rx="3.4" ry="2" fill="#c87d65" fillOpacity="0.55" />
          <circle cx="69" cy="68" r="13" fill="#7d909e" fillOpacity="0.8" stroke="#4a4238" strokeWidth="2.2" />
          <path d="M60 63 Q69 59 77 66" stroke="#4a4238" strokeWidth="1.5" fill="none" />
          <path d="M62 73 Q71 67 79 73" stroke="#4a4238" strokeWidth="1.5" fill="none" />
          <path d="M66 57 Q72 68 65 79" stroke="#4a4238" strokeWidth="1.5" fill="none" />
          <path d="M56 75 Q44 83 32 79" stroke="#495a68" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      )}

      {/* #6 睡觉猫 (sleep - 金库0金) */}
      {id === 'sleep' && (
        <g>
          <ellipse cx="50" cy="72" rx="33" ry="12" fill="#efe6d5" stroke="#c89648" strokeWidth="2" />
          <path
            d="M24 64 C24 47, 40 40, 56 43 C70 45, 77 56, 75 66 C73 74, 59 77, 45 76 C31 75, 24 71, 24 64 Z"
            fill="#fcfaf5"
            stroke="#4a4238"
            strokeWidth="2.2"
          />
          <path d="M32 48 L29 36 L39 42" fill="#fcfaf5" stroke="#4a4238" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M46 44 L48 34 L55 42" fill="#fcfaf5" stroke="#4a4238" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M34 57 Q37 60 40 57" stroke="#4a4238" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M46 57 Q49 60 52 57" stroke="#4a4238" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="32" cy="61" rx="3.2" ry="1.8" fill="#c87d65" fillOpacity="0.55" />
          <ellipse cx="54" cy="61" rx="3.2" ry="1.8" fill="#c87d65" fillOpacity="0.55" />
          <text x="64" y="36" fill="#966922" fontSize="11" fontWeight="700">z</text>
          <text x="72" y="28" fill="#c89648" fontSize="14" fontWeight="700">Z</text>
        </g>
      )}

      {/* #7 气球猫 (balloon - 金库满额) */}
      {id === 'balloon' && (
        <g>
          <path d="M72 44 Q68 56 64 64" stroke="#966922" strokeWidth="1.8" fill="none" />
          <ellipse cx="74" cy="27" rx="13" ry="15" fill="#d9a552" fillOpacity="0.88" stroke="#4a4238" strokeWidth="2" />
          <ellipse cx="70" cy="22" rx="3.5" ry="5" fill="#fcfbf7" fillOpacity="0.6" />
          <ellipse cx="44" cy="71" rx="18" ry="14" fill="#fcfaf5" stroke="#4a4238" strokeWidth="2.2" />
          <path
            d="M28 49 C25 37, 27 27, 31 27 C35 27, 39 34, 42 36 L48 36 C51 34, 55 27, 59 27 C63 27, 65 37, 62 49 C65 57, 57 63, 45 63 C33 63, 25 57, 28 49 Z"
            fill="#fcfaf5"
            stroke="#4a4238"
            strokeWidth="2.2"
          />
          <circle cx="38" cy="47" r="2.3" fill="#3d3831" />
          <circle cx="52" cy="47" r="2.3" fill="#3d3831" />
          <ellipse cx="34" cy="51" rx="3.5" ry="2" fill="#c87d65" fillOpacity="0.6" />
          <ellipse cx="56" cy="51" rx="3.5" ry="2" fill="#c87d65" fillOpacity="0.6" />
          <path d="M42 51 Q45 56 48 51 Z" fill="#c87d65" stroke="#4a4238" strokeWidth="1.6" />
        </g>
      )}

      {/* #8 账本猫 (ledger - 角色管理) */}
      {id === 'ledger' && (
        <g>
          <ellipse cx="50" cy="69" rx="20" ry="15" fill="#fcfaf5" stroke="#4a4238" strokeWidth="2.2" />
          <path
            d="M31 46 C28 33, 30 23, 34 23 C38 23, 42 30, 45 32 L55 32 C58 30, 62 23, 66 23 C70 23, 72 33, 69 46 C72 55, 64 62, 50 62 C36 62, 28 55, 31 46 Z"
            fill="#fcfaf5"
            stroke="#4a4238"
            strokeWidth="2.2"
          />
          <circle cx="42" cy="45" r="5.5" fill="#e4efed" stroke="#527a73" strokeWidth="2" />
          <circle cx="58" cy="45" r="5.5" fill="#e4efed" stroke="#527a73" strokeWidth="2" />
          <path d="M47.5 45 L52.5 45" stroke="#527a73" strokeWidth="2" />
          <circle cx="42" cy="45" r="2" fill="#3d3831" />
          <circle cx="58" cy="45" r="2" fill="#3d3831" />
          <rect x="35" y="60" width="30" height="20" rx="3" fill="#efe6d5" stroke="#4a4238" strokeWidth="2" />
          <path d="M41 66 L59 66" stroke="#9e473c" strokeWidth="2" strokeLinecap="round" />
          <path d="M41 72 L53 72" stroke="#8c8274" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {/* #9 歪头猫 (tilt - 404 / 离线) */}
      {id === 'tilt' && (
        <g>
          <ellipse cx="50" cy="70" rx="19" ry="14" fill="#fcfaf5" stroke="#4a4238" strokeWidth="2.2" />
          <g transform="rotate(-11 50 45)">
            <path
              d="M31 46 C28 33, 30 23, 34 23 C38 23, 42 30, 45 32 L55 32 C58 30, 62 23, 66 23 C70 23, 72 33, 69 46 C72 55, 64 62, 50 62 C36 62, 28 55, 31 46 Z"
              fill="#fcfaf5"
              stroke="#4a4238"
              strokeWidth="2.2"
            />
            <circle cx="42" cy="46" r="2.4" fill="#3d3831" />
            <circle cx="58" cy="46" r="2.4" fill="#3d3831" />
            <ellipse cx="37" cy="50" rx="3.4" ry="2" fill="#c87d65" fillOpacity="0.55" />
            <ellipse cx="63" cy="50" rx="3.4" ry="2" fill="#c87d65" fillOpacity="0.55" />
            <circle cx="50" cy="51" r="2" fill="#9e473c" />
          </g>
          <text x="72" y="30" fill="#9e473c" fontSize="18" fontWeight="700">?</text>
        </g>
      )}
    </svg>
  );
};

/* 全站线性 SVG 图标 (24x24, stroke 1.7, currentColor) */
export type LinearIconId =
  | 'leave'
  | 'expense'
  | 'work'
  | 'play'
  | 'vault'
  | 'roles'
  | 'settings'
  | 'plus'
  | 'back'
  | 'check'
  | 'close'
  | 'edit'
  | 'trash'
  | 'copy'
  | 'sync'
  | 'bell'
  | 'pin'
  | 'leaf';

export const LinearIcon: React.FC<{
  name: LinearIconId;
  size?: number;
  className?: string;
}> = ({ name, size = 20, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      {name === 'leave' && (
        <>
          <rect x="3.5" y="4.5" width="17" height="16" rx="3" />
          <path d="M8 3v3M16 3v3M3.5 9.5h17" />
          <path d="M9 14l2 2 4-4" />
        </>
      )}
      {name === 'expense' && (
        <>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="M3 10h18" />
          <circle cx="16.5" cy="14.5" r="1.5" />
        </>
      )}
      {name === 'work' && (
        <>
          <rect x="3" y="7" width="18" height="13" rx="2.5" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M12 12v3M3 13h18" />
        </>
      )}
      {name === 'play' && (
        <>
          <rect x="2.5" y="6.5" width="19" height="11" rx="5.5" />
          <path d="M7.5 12h3M9 10.5v3" />
          <circle cx="15.5" cy="11" r="0.9" fill="currentColor" />
          <circle cx="17.5" cy="13" r="0.9" fill="currentColor" />
        </>
      )}
      {name === 'vault' && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M9.5 10.5c0-1.1 1.1-2 2.5-2s2.5.9 2.5 2c0 2-5 1.8-5 4 0 1.1 1.1 2 2.5 2s2.5-.9 2.5-2" />
          <path d="M12 7v1.5M12 15.5V17" />
        </>
      )}
      {name === 'roles' && (
        <>
          <circle cx="9" cy="8.5" r="3.2" />
          <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
          <circle cx="17" cy="9.5" r="2.3" />
          <path d="M15.5 14.5c2.2.3 4 1.8 4 4.2" />
        </>
      )}
      {name === 'settings' && (
        <>
          <circle cx="12" cy="12" r="3.2" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.77 1.05 1.51 1.09H21a2 2 0 1 1 0 4h-.09c-.74.04-1.25.49-1.51 1z" />
        </>
      )}
      {name === 'plus' && <path d="M12 5v14M5 12h14" />}
      {name === 'back' && <path d="M15 18l-6-6 6-6" />}
      {name === 'check' && <path d="M5 12.5l4.5 4.5L19 7.5" />}
      {name === 'close' && <path d="M6 6l12 12M18 6L6 18" />}
      {name === 'edit' && (
        <>
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5z" />
        </>
      )}
      {name === 'trash' && (
        <>
          <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
        </>
      )}
      {name === 'copy' && (
        <>
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </>
      )}
      {name === 'sync' && (
        <>
          <path d="M21 12a9 9 0 0 0-15.5-6.3L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 15.5 6.3L21 16" />
          <path d="M16 16h5v5" />
        </>
      )}
      {name === 'bell' && (
        <>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </>
      )}
      {name === 'pin' && (
        <>
          <path d="M9 4h6l-1 6 3 3v2H7v-2l3-3-1-6z" />
          <path d="M12 15v5" />
        </>
      )}
      {name === 'leaf' && (
        <>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </>
      )}
    </svg>
  );
};
