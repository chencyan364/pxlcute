export interface ColorTokenSpec {
  variable: string;
  hex: string;
  category: '暖纸画布与表面' | '鼠尾草与模块色' | '小金库与状态' | '五大门派色' | '文本与描边';
  usage: string;
  rule: string;
}

export const COLOR_TOKENS: ColorTokenSpec[] = [
  // 暖纸画布与表面
  {
    variable: '--bg',
    hex: '#f5f2eb',
    category: '暖纸画布与表面',
    usage: '全站默认暖亚麻米灰纸底 (60% 主画布，复刻「我们的小家」背景)',
    rule: '温润护眼手账纸感，告别冰冷纯白',
  },
  {
    variable: '--surface-warm',
    hex: '#efe6d5 → #e7dac3',
    category: '暖纸画布与表面',
    usage: '首页顶部「平凡的一天」晴天小屋横幅卡、「近期要留意」通知卡底色',
    rule: '搭配 1px #dfd2ba 暖沙描边，形成全屏第一温暖焦点',
  },
  {
    variable: '--card',
    hex: '#fcfbf7',
    category: '暖纸画布与表面',
    usage: '一级容器卡片、四宫格底座、列表项与弹层表面 (30% 结构面)',
    rule: '柔和象牙白，与 #f5f2eb 底形成细腻纸张明度差',
  },
  {
    variable: '--bg-subtle',
    hex: '#ebe6dc',
    category: '暖纸画布与表面',
    usage: '分段控件外槽、表格斑马纹、次级按钮底色',
    rule: '用于替代生硬描边，拉开区块呼吸感',
  },

  // 鼠尾草与模块色
  {
    variable: '--brand (鼠尾草橄榄绿)',
    hex: '#6f7d5c / soft #dce3d3',
    category: '鼠尾草与模块色',
    usage: '主操作按钮、选中态胶囊（「全团」胶囊）、打工模块与正向净赚数字 (#526040)',
    rule: '复刻参考图日历选中态与胶囊绿，沉稳治愈',
  },
  {
    variable: '--terracotta (砖红陶土)',
    hex: '#9e473c / soft #f3e3df',
    category: '鼠尾草与模块色',
    usage: '顶栏左上角小屋 Logo 底、请假模块强调色、「查看全部」文字链、待批红点角标',
    rule: '复刻参考图左上角小房子图标与右侧链接色',
  },
  {
    variable: '--peach (暖陶橘褐)',
    hex: '#b87638 / soft #f5e8dc',
    category: '鼠尾草与模块色',
    usage: '消费模块色块、消费金额强调、待审批暖琥珀提示',
    rule: '低饱和暖木棕橘，与亚麻纸底自然相融',
  },
  {
    variable: '--lilac (雾霾蓝灰)',
    hex: '#6b7d8c / soft #d9e1e6',
    category: '鼠尾草与模块色',
    usage: '顶栏右上角圆形单字成员头像底、娱乐时长模块色块、精简掉落标',
    rule: '复刻参考图右上角「爸」字雾蓝圆形头像配色',
  },

  // 小金库与状态
  {
    variable: '--gold / --gold-deep / --gold-soft',
    hex: '#c89648 / #755520 / #f5ebd6',
    category: '小金库与状态',
    usage: '首页中心 58px 金库圆水位、小金库页圆罐、晴天小太阳插画、玄晶掉落标',
    rule: '暖麦鎏金质感，不刺眼不俗艳',
  },
  {
    variable: '--st-wait / --st-wait-bg',
    hex: '#b87638 / #f6eadb',
    category: '小金库与状态',
    usage: '待审批 / 待我审批卡片微暖底 (#f5eedf) / 娱乐时长超阈值 (>14h)',
    rule: '第一顺位温和提醒「该我商量处理」',
  },
  {
    variable: '--st-pass / --st-pass-bg',
    hex: '#4e5b3e / #dce3d3',
    category: '小金库与状态',
    usage: '✓ 已通过徽章 / 正向纯收入',
    rule: '鼠尾草浅绿底 + 深橄榄绿字，完成后安静退居二线',
  },
  {
    variable: '--st-reject / --st-reject-bg',
    hex: '#a85248 / #f4e3e1',
    category: '小金库与状态',
    usage: '× 已驳回徽章 / 危险删除操作 / 校验报错',
    rule: '克制陶土砖红，报错/驳回明确但不制造焦虑',
  },

  // 五大门派色
  {
    variable: '--sect-xiu (七秀)',
    hex: '#a85869 / soft #f4e6e9',
    category: '五大门派色',
    usage: '角色表七秀分组头、打工记录角色前缀',
    rule: '压低饱和度融入暖纸色温，仅表门派位置',
  },
  {
    variable: '--sect-ge (长歌)',
    hex: '#527a73 / soft #e4efed',
    category: '五大门派色',
    usage: '角色表长歌分组头、打工记录角色前缀',
    rule: '仅表门派位置',
  },
  {
    variable: '--sect-du (五毒)',
    hex: '#635f94 / soft #e8e7f3',
    category: '五大门派色',
    usage: '角色表五毒分组头、打工记录角色前缀',
    rule: '仅表门派位置',
  },
  {
    variable: '--sect-hua (万花)',
    hex: '#73537d / soft #ece6ef',
    category: '五大门派色',
    usage: '角色表万花分组头、打工记录角色前缀',
    rule: '仅表门派位置',
  },
  {
    variable: '--sect-yao (药宗)',
    hex: '#657847 / soft #e8ede0',
    category: '五大门派色',
    usage: '角色表药宗分组头、打工记录角色前缀',
    rule: '仅表门派位置',
  },

  // 文本与描边
  {
    variable: '--text / --text-sub / --text-weak',
    hex: '#3d3831 / #6e665b / #999083',
    category: '文本与描边',
    usage: '三级文字阶梯：#3d3831 深焙咖啡褐主文 · #6e665b 暖灰褐次文 · #999083 亚麻灰元信息',
    rule: '全站禁用生硬纯黑 #000，保持手账印刷质感',
  },
];

export interface TypeScaleSpec {
  token: string;
  size: string;
  lineHeight: string;
  weight: string;
  tabular: boolean;
  usage: string;
}

export const TYPE_SCALE: TypeScaleSpec[] = [
  {
    token: 'serif-quote (21px 宋体)',
    size: '21px',
    lineHeight: '1.35',
    weight: '600 (Songti Serif)',
    tabular: false,
    usage: '首页暖沙横幅诗意主语「平凡的一天，也有小小的晴天。」、进门页主标题',
  },
  {
    token: 'num-hero (25px)',
    size: '25px',
    lineHeight: '1.15',
    weight: '700 (Bold)',
    tabular: true,
    usage: '小金库总额 (1190000 金)、娱乐汇总大数字',
  },
  {
    token: 'num-card-lg (20px~21px)',
    size: '20px ~ 21px',
    lineHeight: '1.2',
    weight: '700 (Bold)',
    tabular: true,
    usage: '打工单笔净赚 (+107738 金)、消费单笔金额 (¥288.00)、首页四宫格核心指标',
  },
  {
    token: 'title-item (15px~16px)',
    size: '15px ~ 16px',
    lineHeight: '1.4',
    weight: '700 (Bold)',
    tabular: false,
    usage: '顶栏「我们的小工作台」、列表项主标题、近期要留意条目主行',
  },
  {
    token: 'body-base (14px~15px)',
    size: '14px ~ 15px',
    lineHeight: '1.5',
    weight: '400 / 500',
    tabular: false,
    usage: '全站基准字号：事由备注、输入框内容、主次按钮文案',
  },
  {
    token: 'meta-sub (12px~13px)',
    size: '12px ~ 13px',
    lineHeight: '1.4',
    weight: '500',
    tabular: true,
    usage: '全团/成员圆点胶囊、收支拆解明细条、近期要留意副标题',
  },
  {
    token: 'meta-caption (10px~11.5px)',
    size: '10px ~ 11.5px',
    lineHeight: '1.35',
    weight: '500',
    tabular: true,
    usage: '时间戳、审批落款、6列统计表自适应字号（360px 窄屏自动缩至 10px）',
  },
];

export interface DecisionQA {
  id: number;
  question: string;
  verdict: string;
  rationale: string;
  implementationNote: string;
}

export const DESIGN_DECISIONS_QA: DecisionQA[] = [
  {
    id: 1,
    question: '1. 视觉基调：「同日 · 把日子过在一起」暖感亚麻纸本风如何落地？',
    verdict: '拍板：采用「#F5F2EB 亚麻纸底 + #EFE6D5 暖沙横幅 + #6F7D5C 鼠尾草绿 + 宋体人文标题」！',
    rationale:
      '参考图之所以让人觉得温馨、愿意每天打开，核心在于：① 放弃冷白背景，改用暖亚麻米灰纸底（#F5F2EB）与象牙白卡片（#FCFBF7）；② 顶部横幅采用暖沙渐变底配宋体诗意短句（「平凡的一天，也有小小的晴天。」）与右下角晴天小屋插画；③ 成员筛选采用带色点的圆润胶囊（「全团 | • 小明 | • 阿璃」），底部「近期要留意」采用暖麦色收拢跨模块动态。',
    implementationNote: '全部使用系统内置宋体栈（Songti SC / Noto Serif SC）与内联 SVG 插画，0 外部字体体积。',
  },
  {
    id: 2,
    question: '2. 导航模型：继续「卡片式首页 + 逐层进入」，还是加底部 Tab？',
    verdict: '拍板：保持「卡片式首页 + 逐层进入」，顶栏复刻「砖红小屋图标 + 铃铛 + 雾蓝单字头像圆」！',
    rationale:
      '首页保留极具辨识度的「四宫格 + 中心 58px 挖洞金库圆」，外层包裹在一张象牙白大卡中（类似参考图中间的主日历大卡），不加常驻底部 Tab 避免挤压 360px 竖屏下的 6 列账本表格空间。',
    implementationNote: '右上角圆形单字头像（「明/璃/团/舟」）一键切换成员视角，铃铛带砖红待批数字角标。',
  },
  {
    id: 3,
    question: '3. 账本密度与角色管理表：6 列在 360px 上很挤，是否改两行卡片？',
    verdict: '拍板：严格保留「6 列零横滚自适应表」（遵守物理定律 #5 & #7），配暖纸斑马纹！',
    rationale:
      '通过 `table-layout: fixed` + `tabular-nums` 等宽数字 + 360px 下字号自动缩至 10px，完整展示 `+107738 金` 真数不缩写，奇数行采用 `#F5F2EB` 亚麻纸斑马纹，纵向对比一目了然。',
    implementationNote: '0 显示为「—」，正向净赚用深橄榄绿 #526040，负向用暖琥珀 #B87638。',
  },
  {
    id: 4,
    question: '4. 猫插画与晴天小屋：如何在不增加图片体积的前提下融合？',
    verdict: '拍板：保留现有 9 只水彩猫雪碧图用于四宫格、小金库与空态，首页横幅采用纯内联 SVG 晴天小屋！',
    rationale:
      '内联 SVG 晴天小屋仅 ~1.8KB 文本，无需额外网络请求；同时 9 只水彩猫搭配暖沙/鼠尾草/雾蓝柔和色块底座，与暖亚麻纸底完美融合。',
    implementationNote: '满足「全站只能有一张位图雪碧图」的硬约束。',
  },
  {
    id: 5,
    question: '5. 深色模式：要不要做？',
    verdict: '拍板：不做深色模式，专注把「暖亚麻纸本浅色体系」打磨到极致。',
    rationale:
      '`#F5F2EB` 暖米灰纸底与 `#EFE6D5` 暖沙色本身已经消除了刺眼眩光，夜间阅读如翻阅纸质手账般柔和。',
    implementationNote: '单套 CSS 变量体系，代码极简好维护。',
  },
  {
    id: 6,
    question: '6. 首页信息优先级：如何平衡「待办提醒」与「账本概览」？',
    verdict: '拍板：顶部晴天横幅做情绪与待办引导 + 中部四宫格看核心数字 + 底部「近期要留意」看跨模块流水！',
    rationale:
      '完美复刻参考图的三段式呼吸节奏：① 上段暖沙晴天卡给情绪温度；② 中段象牙白大卡承载四宫格与 58px 金库圆；③ 下段「全团/成员圆点胶囊」+ 暖麦色「近期要留意」卡片，支持按成员一键筛选动态。',
    implementationNote: '彻底告别「白卡片堆叠像后台表格」的旧貌。',
  },
];

export const PRODUCTION_CSS_SNIPPET = `/* ==========================================================================
   小工作台 · 「同日·暖感亚麻纸本风」核心样式表 (Chrome 55+ / 单文件 Bundle 直接替换)
   复刻暖亚麻纸底 #F5F2EB + 暖沙横幅 #EFE6D5 + 鼠尾草绿 #6F7D5C + 宋体诗意标题
   ========================================================================== */

:root {
  --bg: #f5f2eb;
  --bg-subtle: #ebe6dc;
  --surface-warm: #efe6d5;
  --card: #fcfbf7;
  --card-line: #e5dfd3;

  --brand: #6f7d5c;
  --brand-deep: #526040;
  --brand-soft: #dce3d3;
  --brand-ghost: #f7f4ed;

  --terracotta: #9e473c;
  --peach: #b87638;
  --mint: #526040;
  --lilac: #495a68;
  --gold: #c89648;
  --gold-deep: #755520;
  --gold-soft: #f5ebd6;

  /* 三级文字阶梯：深焙咖啡褐 / 暖灰褐 / 亚麻灰 */
  --text: #3d3831;
  --text-sub: #6e665b;
  --text-weak: #999083;

  /* 状态色 */
  --st-pass: #4e5b3e; --st-pass-bg: #dce3d3;
  --st-reject: #a85248; --st-reject-bg: #f4e3e1;
  --st-wait: #b87638; --st-wait-bg: #f6eadb;

  /* 5 大门派色 (暖纸低饱和古风调) */
  --sect-xiu: #a85869; --sect-xiu-soft: #f4e6e9; --sect-xiu-rail: #dfc2c8;
  --sect-ge:  #527a73; --sect-ge-soft:  #e4efed; --sect-ge-rail:  #bdd6d2;
  --sect-du:  #635f94; --sect-du-soft:  #e8e7f3; --sect-du-rail:  #c5c3de;
  --sect-hua: #73537d; --sect-hua-soft: #ece6ef; --sect-hua-rail: #cebfd4;
  --sect-yao: #657847; --sect-yao-soft: #e8ede0; --sect-yao-rail: #c4d0b2;

  --shadow-card: 0 6px 20px rgba(82, 71, 56, 0.05);
  --shadow-vault: 0 6px 18px rgba(184, 134, 56, 0.20);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

/* 1. 宋体会刊感问候标题 + 暖沙横幅卡 */
.font-editorial-serif {
  font-family: "Songti SC", "Noto Serif SC", "STSong", "SimSun", serif;
}
.warm-hero-banner {
  background: linear-gradient(135deg, #efe7d6 0%, #e7dac3 100%);
  border: 1px solid #dfd2ba;
  border-radius: 22px;
  position: relative;
  overflow: hidden;
}
.warm-notice-card {
  background: #ede6d6;
  border: 1px solid #dfd6c3;
  border-radius: 20px;
}

/* 2. 首页四宫格与 58px 金库圆联动 (圆直径 58px / 间距 10px / 挖洞半径 35px) */
.bento-grid-2x2 {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.bento-card {
  position: relative;
  background: #f7f4ed;
  border: 1px solid #e6dfd2;
  border-radius: 20px;
  padding: 14px;
  transition: transform 150ms var(--ease);
}
.bento-card:active { transform: scale(0.985); }
.bento-tl { -webkit-mask-image: radial-gradient(circle 35px at calc(100% + 5px) calc(100% + 5px), transparent 34.5px, #000 35px); }
.bento-tr { -webkit-mask-image: radial-gradient(circle 35px at -5px calc(100% + 5px), transparent 34.5px, #000 35px); }
.bento-bl { -webkit-mask-image: radial-gradient(circle 35px at calc(100% + 5px) -5px, transparent 34.5px, #000 35px); }
.bento-br { -webkit-mask-image: radial-gradient(circle 35px at -5px -5px, transparent 34.5px, #000 35px); }`;
