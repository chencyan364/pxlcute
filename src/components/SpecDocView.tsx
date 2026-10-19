import React, { useState } from 'react';
import {
  COLOR_TOKENS,
  DESIGN_DECISIONS_QA,
  PRODUCTION_CSS_SNIPPET,
  TYPE_SCALE,
} from '../data/designSpecData';
import { ScreenId, SCREEN_META, SimStateMode } from './MobilePreview';
import {
  CAT_SPRITE_META,
  CatSpriteId,
  LinearIcon,
  LinearIconId,
  WatercolorCat,
} from './WatercolorCats';

export type SpecTabId =
  | 'decisions' // 第9节：6大拍板决策 + 第G节：布局取舍说明
  | 'tokens'    // A. 设计 Token (表 + JSON)
  | 'components'// B. 组件规格 (全状态卡片)
  | 'screens'   // C & D. 逐屏高保真规格 (412/360) + 6态矩阵
  | 'motion'    // E & F. 动效规范 + 图标与9猫雪碧图规则
  | 'code';     // 可直接落地的单文件 CSS 代码

interface SpecDocViewProps {
  activeSpecTab: SpecTabId;
  onSelectScreen: (s: ScreenId) => void;
  onSelectSimState: (st: SimStateMode) => void;
  onSelectViewport: (w: 412 | 360) => void;
}

export const SpecDocView: React.FC<SpecDocViewProps> = ({
  activeSpecTab,
  onSelectScreen,
  onSelectSimState,
  onSelectViewport,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const tokenJsonString = JSON.stringify(
    {
      colors: Object.fromEntries(COLOR_TOKENS.map((t) => [t.variable, { value: t.hex, usage: t.usage }])),
      typography: TYPE_SCALE,
      radius: {
        card: '18px',
        item: '16px',
        input: '12px',
        button: '12px',
        sheetTop: '22px',
        orb: '50%',
      },
      layout: {
        maxWidth: '560px',
        pagePaddingX: '14px',
        bentoGap: '10px',
        vaultOrbDiameter: '58px',
        bentoCutoutRadius: '35px',
      },
    },
    null,
    2
  );

  return (
    <div className="space-y-6">
      {/* =================================================================
          TAB 1: 拍板决策 (Section 9) & 取舍说明 (Deliverable G)
         ================================================================= */}
      {activeSpecTab === 'decisions' && (
        <div className="space-y-6">
          {/* 6个核心拍板问题 */}
          <div className="bg-white rounded-2xl border border-[#f4e4ec] p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#f4e4ec] pb-3.5 mb-4">
              <div>
                <h2 className="text-[18px] font-bold text-[#524549]">
                  九、6 个核心设计问题的最终拍板结论
                </h2>
                <p className="text-[13px] text-[#7d6d73] mt-0.5">
                  在不破坏 12 条物理定律、不加第 2 张图片、兼容 Chrome 55+ 的前提下给出明确方案
                </p>
              </div>
              <span className="text-[12px] font-semibold text-[#c9758f] num-tabular">
                共 6 项拍板
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DESIGN_DECISIONS_QA.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-[16px] bg-[#fffbfd] border border-[#f4e4ec] flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[14px] font-bold text-[#524549]">{item.question}</div>
                    <div className="mt-2 px-3 py-1.5 rounded-[10px] bg-[#fdeef4] text-[#c9758f] text-[13px] font-semibold">
                      {item.verdict}
                    </div>
                    <p className="mt-2.5 text-[13px] text-[#524549] leading-relaxed">
                      {item.rationale}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[#f4e4ec] text-[12px] text-[#7d6d73]">
                    <span className="font-semibold text-[#524549]">落地要点：</span>
                    {item.implementationNote}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* G. 需要说明取舍与调整布局的地方 (逐条对应原 12 条诊断痛点) */}
          <div className="bg-white rounded-2xl border border-[#f4e4ec] p-5 shadow-xs">
            <h2 className="text-[18px] font-bold text-[#524549] mb-1">
              G. 视觉重构取舍与布局改造清单（对应原 12 条简陋诊断）
            </h2>
            <p className="text-[13px] text-[#7d6d73] mb-4">
              以下 6 处调整了 DOM 内部信息排布顺序与 CSS 样式，未改变任何后端接口与业务口径：
            </p>

            <div className="space-y-3">
              {[
                {
                  title: '取舍 1：首页四宫格从「平铺文字」改为「上名下数·左图右标」双层锚点结构',
                  before: '原版：猫图标 + 模块名 + 副信息 + 关键数字垂直堆叠，四张卡扫视长得完全一样。',
                  after:
                    '新稿：上半区固定为「44px 模块色底猫插画 + 模块名 + 待批总计」，下半区用 1px 浅描边分隔后专门承载 21px 大号模块色主数字（本月已通过 2 次 / ¥45.00 / +107738 金 / 13 小时），并为内角预留 35px 挖洞遮罩安全内边距。',
                  screen: 'home' as ScreenId,
                },
                {
                  title: '取舍 2：列表项四行结构重组为「主标题+右置主角大数 → 正文备注 → 底栏落款与操作」',
                  before: '原版：标题行、标签行、备注行、按钮行四行等高平铺，金额/净赚和普通标签一样大。',
                  after:
                    '新稿：将消费金额（¥288.00）、打工净赚（+107738 金）、娱乐时长（3.5 小时）全部提拔至卡片右上角 20px~21px 粗体等宽数字；把收支明细（收·分·支·代）收拢进一条 #faf3f6 浅底胶囊条内，大幅压缩纵向杂乱感。',
                  screen: 'work' as ScreenId,
                },
                {
                  title: '取舍 3：状态系统引入「待我批 vs 等人批 vs 已完结」三重视觉权重',
                  before: '原版：待审批/已通过/已驳回只是三个小胶囊，一眼看不出哪条该我动手批。',
                  after:
                    '新稿：当记录为「他人提交 + 待审批」时，整张卡片背景微暖（#fffdf9）、描边变为暖琥珀色（#c98a5a/45%），右下角直接亮出实心「通过」与浅红「驳回」按钮；而本人提交的待批项则安静显示「本人提交 · 等其他伙伴审批」，绝不给自批入口。',
                  screen: 'leave' as ScreenId,
                },
                {
                  title: '取舍 4：顶栏右侧补齐「当前成员快捷视角 & 角色管理直达」',
                  before: '原版：54px 顶栏只有左箭头和标题，右边大片空白浪费。',
                  after:
                    '新稿：顶栏右侧常驻显示当前登录成员昵称胶囊（点按可进设置或换人），在打工页顶栏右侧额外提供「角色」快捷胶囊，与首页打工卡右上角的圆形角色按钮形成双入口。',
                  screen: 'roles' as ScreenId,
                },
                {
                  title: '取舍 5：色彩规则确立「谁能上色」边界',
                  before: '原版：模块色、5套门派色、状态色、金库金四套并存，容易混淆。',
                  after:
                    '新稿：① 门派色（秀/歌/毒/花/药）严格限制在「角色标签小块」与「角色表分组头」；② 数字正负统一用深薄荷青（#4e8c77 正）与暖琥珀（#c98a5a 负）；③ 金色（#d9a552）仅限中心金库圆、小金库页与「玄晶」掉落标。',
                  screen: 'vault' as ScreenId,
                },
              ].map((row, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-[14px] bg-[#fffbfd] border border-[#f4e4ec] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="text-[14px] font-bold text-[#524549]">{row.title}</div>
                    <div className="text-[12px] text-[#ab9ba3]">
                      <span className="font-semibold text-[#7d6d73]">改造前：</span>
                      {row.before}
                    </div>
                    <div className="text-[13px] text-[#524549]">
                      <span className="font-semibold text-[#c9758f]">改造后：</span>
                      {row.after}
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectScreen(row.screen)}
                    className="px-3.5 py-2 rounded-[10px] bg-[#fdeef4] text-[#c9758f] text-[12px] font-semibold shrink-0 self-start md:self-center"
                  >
                    在左侧预览此屏 →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          TAB 2: A. 设计 Token (颜色 / 字号阶梯 / 间距圆角阴影 / JSON)
         ================================================================= */}
      {activeSpecTab === 'tokens' && (
        <div className="space-y-6">
          {/* 颜色 Token 表 */}
          <div className="bg-white rounded-2xl border border-[#f4e4ec] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[18px] font-bold text-[#524549]">
                  A1. 色彩系统 Token（低饱和少女心 · 严守上色边界）
                </h2>
                <p className="text-[13px] text-[#7d6d73] mt-0.5">
                  保留主粉 #f2a3bd 不调艳，新增第 2 档过渡文本色 --text-sub (#7d6d73) 与状态浅底色
                </p>
              </div>
              <button
                onClick={() => handleCopy(tokenJsonString, 'json')}
                className="px-3.5 py-1.5 rounded-[10px] bg-[#fdeef4] text-[#c9758f] text-[12px] font-semibold flex items-center gap-1.5"
              >
                <LinearIcon name="copy" size={14} />
                <span>{copiedKey === 'json' ? '已复制 Token JSON' : '复制完整 JSON'}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-[#f4e4ec] text-[#7d6d73] bg-[#faf3f6]">
                    <th className="py-2.5 px-3 text-left">分组</th>
                    <th className="py-2.5 px-3 text-left">CSS 变量名</th>
                    <th className="py-2.5 px-3 text-left">色值预览 & Hex</th>
                    <th className="py-2.5 px-3 text-left">用于哪一屏 / 哪个位置</th>
                    <th className="py-2.5 px-3 text-left">上色纪律</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4e4ec]/70">
                  {COLOR_TOKENS.map((t) => {
                    const firstHex = t.hex.split('/')[0].trim();
                    return (
                      <tr key={t.variable} className="hover:bg-[#fffbfd]">
                        <td className="py-2.5 px-3 font-medium text-[#7d6d73] whitespace-nowrap">
                          {t.category}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[12px] font-semibold text-[#c9758f] whitespace-nowrap">
                          {t.variable}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              style={{ backgroundColor: firstHex }}
                              className="w-5 h-5 rounded-md border border-black/10 shrink-0"
                            />
                            <span className="font-mono text-[12px] text-[#524549]">{t.hex}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-[#524549]">{t.usage}</td>
                        <td className="py-2.5 px-3 text-[#7d6d73] text-[12px]">{t.rule}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 字号阶梯与排版节奏 */}
          <div className="bg-white rounded-2xl border border-[#f4e4ec] p-5 shadow-xs">
            <h2 className="text-[18px] font-bold text-[#524549] mb-1">
              A2. 字号阶梯与三级信息层级（全数字强制 tabular-nums）
            </h2>
            <p className="text-[13px] text-[#7d6d73] mb-4">
              基准字号 15px / 行高 1.5；将原有的 12 档零散字号收敛为 7 档清晰职责阶梯：
            </p>
            <div className="divide-y divide-[#f4e4ec]">
              {TYPE_SCALE.map((ts) => (
                <div
                  key={ts.token}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[12px] font-semibold text-[#c9758f] w-36 shrink-0">
                      {ts.token}
                    </span>
                    <span
                      style={{ fontSize: ts.size.split('~')[0] }}
                      className="font-bold text-[#524549] num-tabular"
                    >
                      +107738 金 · 小工作台
                    </span>
                  </div>
                  <div className="text-[12px] text-[#7d6d73] sm:text-right">
                    <div>
                      行高 {ts.lineHeight} · 字重 {ts.weight}{' '}
                      {ts.tabular ? '· 等宽数字 tabular-nums' : ''}
                    </div>
                    <div className="text-[#ab9ba3]">{ts.usage}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 尺寸、圆角、阴影与间距节奏 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-[#f4e4ec] p-4">
              <div className="text-[14px] font-bold text-[#524549] mb-2">间距与容器节奏</div>
              <ul className="space-y-1.5 text-[13px] text-[#7d6d73] num-tabular">
                <li>· 页面最大宽：560px 居中，左右 padding 14px</li>
                <li>· 首页四宫格间距：10px (与 58px 金库圆严密咬合)</li>
                <li>· 卡片内边距：14px (360px 窄屏缩至 12px)</li>
                <li>· 列表项垂直间距：10px</li>
                <li>· 表单字段组间距：14px</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-[#f4e4ec] p-4">
              <div className="text-[14px] font-bold text-[#524549] mb-2">圆角分级系统</div>
              <ul className="space-y-1.5 text-[13px] text-[#7d6d73] num-tabular">
                <li>· 一级模块卡 / 汇总卡：18px</li>
                <li>· 列表记录卡 / 门派块：16px</li>
                <li>· 输入框 / 按钮 / 分段外槽：12px</li>
                <li>· 分段内滑块 / 迷你操作按钮：8px~9px</li>
                <li>· 底部弹层顶部：22px 22px 0 0</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-[#f4e4ec] p-4">
              <div className="text-[14px] font-bold text-[#524549] mb-2">阴影分级与描边</div>
              <ul className="space-y-1.5 text-[13px] text-[#7d6d73] num-tabular">
                <li>· 一级卡片：0 8px 24px rgba(203,150,172,.10)</li>
                <li>· 列表微阴影：0 2px 10px rgba(203,150,172,.06)</li>
                <li>· 金库圆暖金光晕：0 6px 20px rgba(217,165,82,.24)</li>
                <li>· 卡片描边：1px solid #f4e4ec</li>
                <li>· 待我审批高亮描边：1px solid rgba(201,138,90,.45)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          TAB 3: B. 组件规格 (每个组件一张卡片 + 全状态说明)
         ================================================================= */}
      {activeSpecTab === 'components' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#f4e4ec] p-5 shadow-xs">
            <h2 className="text-[18px] font-bold text-[#524549] mb-1">
              B. 核心组件规格书（含尺寸、内边距、字号与全部状态）
            </h2>
            <p className="text-[13px] text-[#7d6d73] mb-4">
              覆盖全部 16 类组件，每个组件均可直接在左侧模拟器中真实点击验证：
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: '1. 首页模块卡 (.bento-card + 挖洞遮罩)',
                  usedIn: '4.2 工作台 (首页)',
                  spec: '圆角 18px · 内边距 14px · 描边 1px #f4e4ec · 阴影 --shadow-card',
                  anatomy:
                    '上半区：44×44px 圆角13px色块 + 40px水彩猫 + 15px模块名 + 11px待批统计；下半区：11px说明 + 21px Bold等宽主角数字。内角采用 radial-gradient(circle 35px) 挖出 1/4 圆弧。',
                  states:
                    '默认 / 按下 scale(0.985) / 右上角待批红点角标 (min-w 20px, h 20px, #cb7d95) / 打工卡右上嵌 h-7 圆底「角色」按钮。',
                },
                {
                  name: '2. 中心小金库圆 (.vault-orb-center)',
                  usedIn: '4.2 工作台中心交点 / 4.8 小金库页放大版(116px)',
                  spec: '首页直径 58×58px · 描边 2px #ecd3a2 · 阴影 --shadow-vault',
                  anatomy:
                    '底层 #fffcf5 + 动态高度水位层 (.vault-wave-fill，渐变 #ebc275 → #d9a552) + 居中 13px Bold 百分比 + 10px「金库」字样。',
                  states:
                    '0% 空水位 / 1~99% 动态水位 / 100% 满水位 / 按下 translate(-50%,-50%) scale(0.93)。',
                },
                {
                  name: '3. 记录条目卡 (请假/消费/打工/娱乐 4种变体)',
                  usedIn: '4.3 请假 / 4.4 消费 / 4.5 打工 / 4.6 娱乐',
                  spec: '圆角 16px · 内边距 14px · 间距 10px',
                  anatomy:
                    '头行（主标题/门派角色 + 右上角 20~21px 主角大数或状态徽章）→ 中间（备注或收·分·支·代 #faf3f6 浅底拆解条）→ 底行（时间戳/审批落款 + 操作按钮组）。',
                  states:
                    '普通已结态 (#ffffff) / 待我审批高亮态 (底 #fffdf9 + 描边 #c98a5a/45% + 显示通过/驳回按钮) / 本人待批态 (显示「等其他伙伴审批」无审批按钮) / 按下 scale(0.99)。',
                },
                {
                  name: '4. 零横滚 6 列统计表 (.stat-table)',
                  usedIn: '4.5 打工按人统计表 / 4.7 角色管理门派表',
                  spec: 'table-layout: fixed · width: 100% · overflow-x: hidden',
                  anatomy:
                    '6 列固定分配：名字列左对齐 20%~24% 截断保护；其余 5 列右对齐 tabular-nums。0 统一渲染为「—」，纯收入列带 + / - 号且绿(#4e8c77)/橙(#c98a5a)着色。',
                  states:
                    '412px 宽字号 11.5px~12px / 360px 窄屏或超大数(+107738)整表自动缩字号至 9.5px~10px / 奇数行 #faf3f6 斑马纹 / 底部合计行 1.5px 顶描边加粗 / 角色表行点按高亮。',
                },
                {
                  name: '5. 状态徽章与门派标签系统',
                  usedIn: '全站审批列表 / 最近动态 / 打工与角色管理',
                  spec: '高 20px~22px · 左右内边距 8px · 字号 11px~12px SemiBold',
                  anatomy:
                    '状态三重编码：① 待我审批（暖琥珀底 #fdf3eb + 描边 + 文字）；② ✓ 已通过（浅绿底 #edf7f4 + #5aa892）；③ × 已驳回（浅豆沙底 #faeff3 + #cb7d95）。门派标采用 [秀/歌/毒/花/药] 专属 soft 底色与 rail 描边。',
                  states: '静态展示，严禁与交互式筛选按钮混淆。',
                },
                {
                  name: '6. 全局托管分段控件 (.seg) 与筛选胶囊',
                  usedIn: '4.3~4.6 顶部筛选栏 / 底部表单类型与「谁记的」选择',
                  spec: '外槽圆角 12px~14px · 内边距 4px · 底色 #faf3f6 · 描边 #f4e4ec',
                  anatomy:
                    '激活项：白底 #ffffff + 模块强调色文字 SemiBold + 微阴影；未激活项：透明底 + #7d6d73 文字。',
                  states: '默认 / 激活 / 包含动态成员列表自动换行（当前人追加「（我）」后缀）。',
                },
                {
                  name: '7. 表单控件（输入框 / 多行文本 / 下拉 / 动态增删栏）',
                  usedIn: '4.1 进门页 / 所有记一笔弹层 / 4.7 角色新增',
                  spec: '单行高 40px~44px · 圆角 12px · 默认底 #fffafc (--brand-ghost)',
                  anatomy:
                    '上方 12px SemiBold 字段名 + 必填星号 (* #c9758f)；打工表单支持「＋分红 / ＋代付」点按展开，栏内自带红色「删除」收起按钮。',
                  states:
                    '默认 (#f4e4ec 描边) / 聚焦 (#ffffff 底 + #f2a3bd 描边) / 错误校验 (#faeff3 底 + #cb7d95 描边 + 底部 12px 报错文案) / 提交禁用态 (opacity 0.6)。',
                },
                {
                  name: '8. 可叠底部弹层与确认框 (Stackable Sheets)',
                  usedIn: '4.10 详情弹层 / 4.11 表单弹层 / 4.12 确认框',
                  spec: '最大高 88vh · 顶部圆角 22px · 遮罩 rgba(82,69,73,.34) · 层级 = 60 + 2n',
                  anatomy:
                    '第 1 层弹层 (z=60/62) 打开时，点选角色或点击删除直接在其上方叠出第 2 层弹层 (z=64/66)，关闭第 2 层后无缝回到第 1 层，绝不丢失已填表单内容。',
                  states: '滑入展开 / 多层叠加 / 危险操作确认框（红底 #cb7d95 确认按钮）。',
                },
              ].map((comp) => (
                <div
                  key={comp.name}
                  className="p-4 rounded-[16px] bg-[#fffbfd] border border-[#f4e4ec] space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-bold text-[#524549]">{comp.name}</span>
                    <span className="text-[11px] text-[#c9758f] font-medium shrink-0">
                      {comp.usedIn}
                    </span>
                  </div>
                  <div className="text-[12px] font-mono text-[#7d6d73] bg-[#faf3f6] px-2.5 py-1 rounded-lg">
                    {comp.spec}
                  </div>
                  <p className="text-[12.5px] text-[#524549] leading-relaxed">
                    <strong className="text-[#7d6d73]">结构：</strong>
                    {comp.anatomy}
                  </p>
                  <p className="text-[12px] text-[#7d6d73] leading-relaxed">
                    <strong>全状态：</strong>
                    {comp.states}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          TAB 4: C & D. 逐屏高保真规格 (412px vs 360px) + 6 态状态矩阵
         ================================================================= */}
      {activeSpecTab === 'screens' && (
        <div className="space-y-6">
          {/* D. 6 态状态矩阵一键联调面板 */}
          <div className="bg-white rounded-2xl border border-[#f4e4ec] p-5 shadow-xs">
            <h2 className="text-[18px] font-bold text-[#524549] mb-1">
              D. 全站 6 态状态矩阵（点击立即切换左侧真机预览状态）
            </h2>
            <p className="text-[13px] text-[#7d6d73] mb-4">
              每一屏均已完整实现正常、空态、加载、离线、长文本与超大数（+107738 金）、360px 极限窄屏收敛：
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                {
                  mode: 'normal' as SimStateMode,
                  width: 412 as const,
                  title: '1. 正常态 (412px 主流宽)',
                  desc: '标准数据填充，展示三级字号层级与多成员交互',
                },
                {
                  mode: 'empty' as SimStateMode,
                  width: 412 as const,
                  title: '2. 空状态 (9猫插画+行动引导)',
                  desc: '走路猫/纸箱猫/吃鱼猫/毛线球猫/睡觉猫 + 主行动按钮',
                },
                {
                  mode: 'loading' as SimStateMode,
                  width: 412 as const,
                  title: '3. 加载态 (正在打开…)',
                  desc: '跨境首屏同步呼吸骨架屏，零布局跳动',
                },
                {
                  mode: 'offline' as SimStateMode,
                  width: 412 as const,
                  title: '4. 离线态 (香港节点抖动条)',
                  desc: '歪头猫离线提示横幅 + 本地缓存只读保护 + 重连按钮',
                },
                {
                  mode: 'stress' as SimStateMode,
                  width: 412 as const,
                  title: '5. 超长文本 & +107738 金',
                  desc: '8字昵称「欧阳春晓咕噜喵喵」+ 3行备注 + 真数不缩写',
                },
                {
                  mode: 'stress' as SimStateMode,
                  width: 360 as const,
                  title: '6. 360px 极限窄屏 + 超大数',
                  desc: '验证 6 列表格自动缩字号至 10px、绝不产生横向滚动条',
                },
              ].map((st, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectSimState(st.mode);
                    onSelectViewport(st.width);
                  }}
                  className="p-3 rounded-[14px] bg-[#fffbfd] hover:bg-[#fdeef4]/40 border border-[#f4e4ec] text-left transition-colors"
                >
                  <div className="text-[13px] font-bold text-[#c9758f]">{st.title}</div>
                  <div className="text-[11.5px] text-[#7d6d73] mt-1">{st.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* C. 9 屏逐屏规格与 360px 收敛策略 */}
          <div className="bg-white rounded-2xl border border-[#f4e4ec] p-5 shadow-xs">
            <h2 className="text-[18px] font-bold text-[#524549] mb-3">
              C. 9 屏逐屏结构规格与 412px → 360px 收敛规则
            </h2>
            <div className="space-y-3">
              {SCREEN_META.map((sc) => (
                <div
                  key={sc.id}
                  className="p-3.5 rounded-[14px] bg-[#fffbfd] border border-[#f4e4ec] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-[#524549]">{sc.label}</span>
                      <span className="text-[12px] text-[#7d6d73]">{sc.desc}</span>
                    </div>
                    <div className="text-[12px] text-[#ab9ba3]">
                      <strong className="text-[#7d6d73]">360px 窄屏收敛规则：</strong>
                      {sc.id === 'home' &&
                        '四宫格保持 2×2 与 58px 中心金库圆不变；卡片内主数字由 21px 自适应为 17px~19px，副信息单行省略。'}
                      {sc.id === 'work' &&
                        '按人统计 6 列表格字号从 11.5px 自动缩至 10px，单元格左右内边距缩至 3px，名字列固定 20% 宽截断，纯收入完整显示 +107738。'}
                      {sc.id === 'roles' &&
                        '门派块内 6 列表格（名字/装分/收入/支出/分红/纯收入）整表字号缩至 10px，绝不横向滚动。'}
                      {sc.id === 'vault' &&
                        '顶部 116px 圆罐保持居中，自动/手动存/手动取拆解行字号缩至 11px 等宽排列。'}
                      {!['home', 'work', 'roles', 'vault'].includes(sc.id) &&
                        '容器维持左右 14px 安全边距，长昵称限制 max-width 截断，3 行长事由自然折行不撑破卡片。'}
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectScreen(sc.id)}
                    className="px-3 py-1.5 rounded-[9px] bg-[#fdeef4] text-[#c9758f] text-[12px] font-semibold shrink-0 self-start sm:self-center"
                  >
                    切换至此屏
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          TAB 5: E. 动效说明 & F. 图标与 9 只水彩猫雪碧图规则
         ================================================================= */}
      {activeSpecTab === 'motion' && (
        <div className="space-y-6">
          {/* F1. 9 只水彩猫雪碧图资产表 */}
          <div className="bg-white rounded-2xl border border-[#f4e4ec] p-5 shadow-xs">
            <h2 className="text-[18px] font-bold text-[#524549] mb-1">
              F1. 9 只水彩猫插画雪碧图体系（单张 166KB WebP · 零新增图片请求）
            </h2>
            <p className="text-[13px] text-[#7d6d73] mb-4">
              全站仅加载 1 张 3×3 网格雪碧图，通过 `background-size: 300% 300%` 与以下坐标定位到各屏模块卡、空态、进门页与情绪节点：
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(CAT_SPRITE_META) as CatSpriteId[]).map((catId) => {
                const meta = CAT_SPRITE_META[catId];
                return (
                  <div
                    key={catId}
                    className="p-3.5 rounded-[16px] bg-[#fffbfd] border border-[#f4e4ec] flex items-center gap-3"
                  >
                    <div
                      style={{ backgroundColor: meta.softHex }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-black/5"
                    >
                      <WatercolorCat id={catId} size={56} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-bold text-[#524549]">
                          #{meta.index} {meta.name}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#faf3f6] text-[#7d6d73]">
                          {meta.spritePos}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-[#c9758f] font-medium mt-0.5">
                        {meta.usage}
                      </div>
                      <div className="text-[11px] text-[#ab9ba3] mt-0.5 truncate">{meta.mood}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* F2. 15 个线性 SVG 图标展示 */}
          <div className="bg-white rounded-2xl border border-[#f4e4ec] p-5 shadow-xs">
            <h2 className="text-[18px] font-bold text-[#524549] mb-1">
              F2. 全站 15 个线性 SVG 图标规范（24×24 · stroke 1.7 · currentColor）
            </h2>
            <p className="text-[13px] text-[#7d6d73] mb-4">
              内联 SVG 零网络请求，颜色自动继承父级文本色：
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
              {(
                [
                  ['leave', '请假日历', '最近动态/顶栏'],
                  ['expense', '消费卡包', '最近动态/消费'],
                  ['work', '打工公文包', '最近动态/打工'],
                  ['play', '娱乐手柄', '最近动态/娱乐'],
                  ['vault', '金库钱币', '小金库入口'],
                  ['roles', '角色名册', '打工卡右上/顶栏'],
                  ['settings', '设置齿轮', '首页顶栏右上'],
                  ['plus', '新增记账', '右下56px浮动圆'],
                  ['back', '返回箭头', '二级页顶栏左'],
                  ['check', '审批通过', '通过按钮/徽章'],
                  ['close', '关闭/驳回', '弹层右上/驳回'],
                  ['edit', '编辑记录', '详情/角色行'],
                  ['trash', '删除记录', '手动存取/详情'],
                  ['copy', '复制文本', '设置页家庭码'],
                  ['sync', '同步状态', '离线重试/关于'],
                ] as [LinearIconId, string, string][]
              ).map(([id, label, pos]) => (
                <div
                  key={id}
                  className="p-2.5 rounded-[12px] bg-[#fffbfd] border border-[#f4e4ec] flex items-center gap-2.5"
                >
                  <div className="w-9 h-9 rounded-[10px] bg-[#fdeef4] text-[#c9758f] flex items-center justify-center shrink-0">
                    <LinearIcon name={id} size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold text-[#524549] truncate">{label}</div>
                    <div className="text-[10.5px] text-[#ab9ba3] truncate">{pos}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* E. 轻量动效规范表 */}
          <div className="bg-white rounded-2xl border border-[#f4e4ec] p-5 shadow-xs">
            <h2 className="text-[18px] font-bold text-[#524549] mb-2">
              E. 轻量动效规范（全部 ≤ 200ms · 仅用 transform/opacity · 兼容老 WebView）
            </h2>
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[#f4e4ec] text-[#7d6d73] bg-[#faf3f6]">
                  <th className="py-2 px-3 text-left">触发场景</th>
                  <th className="py-2 px-3 text-left">CSS 属性变化</th>
                  <th className="py-2 px-3 text-left">时长与缓动曲线</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4e4ec]/70">
                <tr>
                  <td className="py-2 px-3 font-medium">1. 页面切换进场</td>
                  <td className="py-2 px-3 font-mono text-[12px]">
                    opacity: 0→1, translateY(4px→0)
                  </td>
                  <td className="py-2 px-3 num-tabular">170ms cubic-bezier(0.16, 1, 0.3, 1)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">2. 模块卡 / 列表项按下</td>
                  <td className="py-2 px-3 font-mono text-[12px]">
                    transform: scale(0.985) + 浅粉底高亮
                  </td>
                  <td className="py-2 px-3 num-tabular">140ms cubic-bezier(0.16, 1, 0.3, 1)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">3. 底部可叠弹层开合</td>
                  <td className="py-2 px-3 font-mono text-[12px]">
                    面板 translateY(100%→0)，遮罩 opacity 0→1
                  </td>
                  <td className="py-2 px-3 num-tabular">200ms cubic-bezier(0.16, 1, 0.3, 1)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">4. 小金库圆水位涨落</td>
                  <td className="py-2 px-3 font-mono text-[12px]">
                    水位高度百分比过渡 + 水平微浪平移
                  </td>
                  <td className="py-2 px-3 num-tabular">280ms ease-out (波浪 5s loop)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================
          TAB 6: 可直接落地的单文件 CSS 代码导出
         ================================================================= */}
      {activeSpecTab === 'code' && (
        <div className="bg-white rounded-2xl border border-[#f4e4ec] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[18px] font-bold text-[#524549]">
                可直接替换进单文件 Bundle 的核心 CSS 代码
              </h2>
              <p className="text-[13px] text-[#7d6d73]">
                严格兼容 Android WebView (Chrome 55+)，内置四宫格内角挖洞数学公式、6列自适应表格与可叠弹层样式
              </p>
            </div>
            <button
              onClick={() => handleCopy(PRODUCTION_CSS_SNIPPET, 'css')}
              className="px-4 py-2 rounded-[10px] bg-[#c9758f] text-white text-[13px] font-semibold flex items-center gap-1.5"
            >
              <LinearIcon name="copy" size={15} />
              <span>{copiedKey === 'css' ? '已复制 CSS 代码' : '一键复制 CSS'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-[14px] bg-[#2b2326] text-[#fdeef4] text-[12px] font-mono overflow-x-auto leading-relaxed">
            {PRODUCTION_CSS_SNIPPET}
          </pre>
        </div>
      )}
    </div>
  );
};
