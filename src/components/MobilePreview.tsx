import React, { useState } from 'react';
import {
  ApprovalStatus,
  calcWorkNet,
  ExpenseRecord,
  INITIAL_EXPENSES,
  INITIAL_LEAVES,
  INITIAL_MANUAL_VAULT,
  INITIAL_MEMBERS,
  INITIAL_PLAYS,
  INITIAL_ROLES,
  INITIAL_WORKS,
  LeaveRecord,
  ManualVaultRecord,
  PlayRecord,
  RoleRecord,
  SECT_MAP,
  SECT_SHORT_LABEL,
  SectKey,
  WorkRecord,
} from '../data/mockAppState';
import {
  LinearIcon,
  WarmSunnyHouseIllustration,
  WatercolorCat,
} from './WatercolorCats';

export type ScreenId =
  | 'gate'
  | 'home'
  | 'leave'
  | 'expense'
  | 'work'
  | 'play'
  | 'roles'
  | 'vault'
  | 'settings';

export type SimStateMode = 'normal' | 'empty' | 'loading' | 'offline' | 'stress';

export const SCREEN_META: { id: ScreenId; label: string; short: string; desc: string }[] = [
  { id: 'gate', label: '4.1 进门页', short: '进门页', desc: '免密首次建档 / 6位家庭码选人 / 365天免登录' },
  { id: 'home', label: '4.2 工作台 (首页)', short: '工作台', desc: '晴天小屋横幅 + 四宫格挖洞遮罩 + 58px金库圆 + 近期要留意' },
  { id: 'leave', label: '4.3 请假审批', short: '请假', desc: '4态胶囊筛选 + 异人审批防自批 + 记一笔请假' },
  { id: 'expense', label: '4.4 消费审批', short: '消费', desc: '金额主角化 + 外观/其他分类 + 异人审批' },
  { id: 'work', label: '4.5 打工账本', short: '打工', desc: '动态成员6列自适应表 + 净赚大字列表 + 叠层角色选择' },
  { id: 'play', label: '4.6 娱乐时长', short: '娱乐', desc: '14小时阈值变色预警 + 游戏时长记录' },
  { id: 'roles', label: '4.7 角色管理', short: '角色管理', desc: '5大门派色分块 + 6列零横滚表格 + 行点按编辑' },
  { id: 'vault', label: '4.8 小金库', short: '小金库', desc: '水位圆罐 + 净赚≥阈值全额自动入库 + 手动存取' },
  { id: 'settings', label: '4.9 设置', short: '设置', desc: '当前身份切换 + 家庭码复制修改 + 备份恢复' },
];

interface MobilePreviewProps {
  activeScreen: ScreenId;
  onSelectScreen: (s: ScreenId) => void;
  viewportWidth: 412 | 360;
  simState: SimStateMode;
  showAnnotations: boolean;
}

export const MobilePreview: React.FC<MobilePreviewProps> = ({
  activeScreen,
  onSelectScreen,
  viewportWidth,
  simState,
  showAnnotations,
}) => {
  // 核心共享状态
  const [members, setMembers] = useState<string[]>(INITIAL_MEMBERS);
  const [currentUser, setCurrentUser] = useState<string>('小明');
  const [familyCode, setFamilyCode] = useState<string>('K7M9P2');
  const [homeMemberFilter, setHomeMemberFilter] = useState<string>('all');

  // 进门页专属模拟状态
  const [gateMode, setGateMode] = useState<'first' | 'returning' | 'error' | 'submitting'>('returning');
  const [gateInputCode, setGateInputCode] = useState<string>('K7M9P2');
  const [gateInputName, setGateInputName] = useState<string>('小明');

  // 模块数据
  const [leaves, setLeaves] = useState<LeaveRecord[]>(INITIAL_LEAVES);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);
  const [works, setWorks] = useState<WorkRecord[]>(INITIAL_WORKS);
  const [plays, setPlays] = useState<PlayRecord[]>(INITIAL_PLAYS);
  const [roles, setRoles] = useState<RoleRecord[]>(INITIAL_ROLES);

  // 小金库配置与手动明细
  const [vaultTarget, setVaultTarget] = useState<number>(4000000);
  const [vaultThreshold, setVaultThreshold] = useState<number>(50000);
  const [manualVaults, setManualVaults] = useState<ManualVaultRecord[]>(INITIAL_MANUAL_VAULT);
  const [vaultZeroDemo, setVaultZeroDemo] = useState<'default' | 'zero' | 'full'>('default');

  // 筛选器状态
  const [leaveFilter, setLeaveFilter] = useState<'all' | ApprovalStatus>('all');
  const [expenseFilter, setExpenseFilter] = useState<'all' | ApprovalStatus>('all');
  const [workPeriod, setWorkPeriod] = useState<'all' | 'week' | 'month'>('all');
  const [playPeriod, setPlayPeriod] = useState<'week' | 'month' | 'all'>('week');

  // 角色管理快速新增
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleSect, setNewRoleSect] = useState<SectKey>('xiu');

  // 3 层可叠底部弹层栈 (物理定律 #3: 层级 = 60 + 2n)
  const [layer1Sheet, setLayer1Sheet] = useState<
    | null
    | { type: 'leave-form' }
    | { type: 'expense-form' }
    | { type: 'work-form' }
    | { type: 'play-form' }
    | { type: 'vault-deposit'; mode: 'deposit' | 'withdraw' }
    | { type: 'vault-config'; field: 'target' | 'threshold' }
    | { type: 'role-edit'; role: RoleRecord }
    | { type: 'record-detail'; module: 'leave' | 'expense' | 'work' | 'play'; item: any }
  >(null);

  const [layer2Sheet, setLayer2Sheet] = useState<
    | null
    | { type: 'role-picker' }
    | {
        type: 'confirm';
        title: string;
        desc: string;
        danger?: boolean;
        onConfirm: () => void;
      }
  >(null);

  // 轻提示 Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2200);
  };

  // 表单状态：请假
  const [leaveFormType, setLeaveFormType] = useState<'外出' | '聚餐' | '其他'>('外出');
  const [leaveFormDate, setLeaveFormDate] = useState('10-21');
  const [leaveFormReason, setLeaveFormReason] = useState('');
  const [leaveFormOwner, setLeaveFormOwner] = useState(currentUser);
  const [leaveFormError, setLeaveFormError] = useState('');

  // 表单状态：消费
  const [expFormAmount, setExpFormAmount] = useState('');
  const [expFormCategory, setExpFormCategory] = useState<'外观' | '其他'>('外观');
  const [expFormMerchant, setExpFormMerchant] = useState('');
  const [expFormNote, setExpFormNote] = useState('');
  const [expFormOwner, setExpFormOwner] = useState(currentUser);
  const [expFormError, setExpFormError] = useState('');

  // 表单状态：打工
  const [wkFormRoleId, setWkFormRoleId] = useState(roles[0]?.id || 'r1');
  const [wkFormIncome, setWkFormIncome] = useState('68000');
  const [wkFormExpense, setWkFormExpense] = useState('4000');
  const [wkFormShowBonus, setWkFormShowBonus] = useState(false);
  const [wkFormBonus, setWkFormBonus] = useState('0');
  const [wkFormShowAdvance, setWkFormShowAdvance] = useState(false);
  const [wkFormAdvance, setWkFormAdvance] = useState('0');
  const [wkFormDrops, setWkFormDrops] = useState<('精简' | '玄晶')[]>([]);
  const [wkFormNote, setWkFormNote] = useState('');
  const [wkFormOwner, setWkFormOwner] = useState(currentUser);

  // 表单状态：娱乐
  const [plFormGame, setPlFormGame] = useState<'三角洲' | '剑三' | '其他'>('三角洲');
  const [plFormDate, setPlFormDate] = useState('10-19');
  const [plFormHours, setPlFormHours] = useState('2.5');
  const [plFormNote, setPlFormNote] = useState('');
  const [plFormOwner, setPlFormOwner] = useState(currentUser);

  // 表单状态：小金库手动存取 & 配置
  const [vaultFormAmount, setVaultFormAmount] = useState('100000');
  const [vaultFormNote, setVaultFormNote] = useState('');
  const [vaultConfigVal, setVaultConfigVal] = useState('');

  // 表单状态：角色编辑
  const [editRoleName, setEditRoleName] = useState('');
  const [editRoleSect, setEditRoleSect] = useState<SectKey>('xiu');
  const [editRoleScore, setEditRoleScore] = useState('');

  // 极端长文本与超大数压力测试模式数据覆盖 (状态矩阵 D)
  const displayMembers =
    simState === 'stress'
      ? ['小明', '阿璃', '团子', '沈舟', '欧阳春晓咕噜喵喵']
      : members;

  const displayLeaves: LeaveRecord[] =
    simState === 'empty'
      ? []
      : simState === 'stress'
      ? [
          {
            id: 'stress-lv-1',
            type: '聚餐',
            status: 'wait',
            owner: '欧阳春晓咕噜喵喵',
            date: '10-19',
            timeText: '今天 19:35',
            reason:
              '这是一段用于测试3行极限折行与排版稳定性的超长请假事由：周末高中同学结婚加上外地室友来玩，要去临江门吃三层铜锅涮羊肉，如果十一点前没赶回来就不用等我打十人本啦！',
          },
          ...leaves,
        ]
      : leaves;

  const displayExpenses: ExpenseRecord[] =
    simState === 'empty'
      ? []
      : simState === 'stress'
      ? [
          {
            id: 'stress-ex-1',
            amount: 12888.5,
            category: '外观',
            merchant: '万宝楼·跨服限定大礼盒代付中心',
            status: 'wait',
            owner: '欧阳春晓咕噜喵喵',
            date: '10-19',
            timeText: '今天 20:05',
            note: '超长备注三行压力测试：合买了一套绝版初代六红加狐金礼盒，约好分期三个月从打工工资里慢慢扣回，请各位团长大人高抬贵手放行审批！',
          },
          ...expenses,
        ]
      : expenses;

  const displayWorks: WorkRecord[] =
    simState === 'empty'
      ? []
      : simState === 'stress'
      ? [
          {
            id: 'stress-wk-1',
            owner: '欧阳春晓咕噜喵喵',
            roleId: 'r3',
            roleName: '莫问青衫长歌行',
            sect: 'ge',
            income: 120000,
            expense: 15000,
            bonus: 5238,
            advance: 2500,
            drops: ['玄晶', '精简'],
            date: '10-19',
            timeText: '今天 22:00',
            period: 'week',
            note: '压力测试真数不缩写：单车闪大铁玄晶分红后净赚恰好 +107738 金！绝不缩写成 10.7万，完整展示每一位数字且窄屏不横向滚动。',
          },
          ...works,
        ]
      : works;

  const displayPlays: PlayRecord[] =
    simState === 'empty'
      ? []
      : simState === 'stress'
      ? [
          {
            id: 'stress-pl-1',
            game: '三角洲',
            hours: 8.5,
            owner: '欧阳春晓咕噜喵喵',
            date: '10-19',
            timeText: '今天 23:40',
            period: 'week',
            note: '周末连肝八个半小时航天基地绝密行动，本周累计时长直接突破 14 小时触发琥珀色防沉迷护眼提醒！',
          },
          ...plays,
        ]
      : plays;

  const displayRoles: RoleRecord[] =
    simState === 'empty'
      ? []
      : simState === 'stress'
      ? [
          { id: 'sr-1', name: '欧阳春晓咕噜喵', sect: 'xiu', score: 298800 },
          ...roles,
        ]
      : roles;

  // 计算首页汇总指标
  const pendingLeavesCount = displayLeaves.filter((l) => l.status === 'wait').length;
  const pendingLeavesForMe = displayLeaves.filter(
    (l) => l.status === 'wait' && l.owner !== currentUser
  ).length;
  const passedLeavesCount = displayLeaves.filter((l) => l.status === 'pass').length;

  const pendingExpensesCount = displayExpenses.filter((e) => e.status === 'wait').length;
  const pendingExpensesForMe = displayExpenses.filter(
    (e) => e.status === 'wait' && e.owner !== currentUser
  ).length;
  const passedExpensesSum = displayExpenses
    .filter((e) => e.status === 'pass')
    .reduce((acc, cur) => acc + cur.amount, 0);

  const totalPendingForMe = pendingLeavesForMe + pendingExpensesForMe;

  const monthWorks = displayWorks.filter((w) => w.period === 'week' || w.period === 'month');
  const monthWorkNet = monthWorks.reduce((acc, w) => acc + calcWorkNet(w), 0);

  const weekPlays = displayPlays.filter((p) => p.period === 'week');
  const weekPlayHours = weekPlays.reduce((acc, p) => acc + p.hours, 0);

  // 小金库口径计算 (物理定律 #9: 自动入库 = 打工净赚 >= 阈值那笔的全额；不影响任何其他页面数字)
  const autoVaultRecords = displayWorks.filter((w) => calcWorkNet(w) >= vaultThreshold);
  const autoVaultSum = autoVaultRecords.reduce((acc, w) => acc + calcWorkNet(w), 0);
  const manualDepositSum =
    simState === 'empty'
      ? 0
      : manualVaults.filter((m) => m.type === 'deposit').reduce((acc, m) => acc + m.amount, 0);
  const manualWithdrawSum =
    simState === 'empty'
      ? 0
      : manualVaults.filter((m) => m.type === 'withdraw').reduce((acc, m) => acc + m.amount, 0);

  const rawVaultTotal = Math.max(0, autoVaultSum + manualDepositSum - manualWithdrawSum);
  const effectiveVaultTotal =
    vaultZeroDemo === 'zero' || simState === 'empty'
      ? 0
      : vaultZeroDemo === 'full'
      ? vaultTarget
      : rawVaultTotal;

  const vaultPercent =
    vaultTarget > 0 ? Math.min(100, Math.round((effectiveVaultTotal / vaultTarget) * 100)) : 0;

  // 格式化带正负号的不缩写数字 (物理定律 #6: 数值不缩写，0显示 —)
  const formatGoldCell = (val: number, showSign = false) => {
    if (val === 0) return '—';
    if (showSign) return val > 0 ? `+${val}` : `${val}`;
    return `${val}`;
  };

  // 处理请假/消费审批 (物理定律 #10: 绝不能自己批自己)
  const handleApproveLeave = (id: string, nextStatus: 'pass' | 'reject') => {
    setLeaves((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
              approver: currentUser,
              approvedAt: '刚刚',
            }
          : item
      )
    );
    triggerToast(nextStatus === 'pass' ? '已放行该条请假' : '已驳回该条请假');
  };

  const handleApproveExpense = (id: string, nextStatus: 'pass' | 'reject') => {
    setExpenses((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
              approver: currentUser,
              approvedAt: '刚刚',
            }
          : item
      )
    );
    triggerToast(nextStatus === 'pass' ? '已批准该笔消费' : '已驳回该笔消费');
  };

  const isNarrow = viewportWidth === 360;

  // 获取当前成员单字头像（复刻参考图右上角圆底单字「爸」->「明/璃/团/舟」）
  const avatarChar = currentUser.slice(-1);

  return (
    <div className="flex flex-col items-center">
      {/* 手机外壳容器 (采用参考图 #F5F2EB 暖亚麻米灰纸底) */}
      <div
        style={{ width: `${viewportWidth}px` }}
        className="relative bg-[#f5f2eb] text-[#3d3831] rounded-[34px] border-[6px] border-[#332e28] shadow-2xl overflow-hidden transition-all duration-200 flex flex-col min-h-[770px] max-h-[830px]"
      >
        {/* 顶部安卓状态栏 (24px) */}
        <div className="h-6 px-4 bg-[#f5f2eb] flex items-center justify-between text-[11px] text-[#7a7165] select-none shrink-0">
          <span className="num-tabular font-semibold">22:37</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#999083]">{viewportWidth}px</span>
            <span>5G</span>
            <span className="px-1.5 py-0.2 rounded bg-[#d8d2c5] text-[#3d3831] font-bold text-[10px]">
              96
            </span>
          </div>
        </div>

        {/* 吸顶顶栏 (复刻参考图顶栏：左侧砖红小屋图标 + 标题副标题，右侧铃铛 + 雾蓝单字头像圆) */}
        {activeScreen !== 'gate' && (
          <header className="sticky top-0 z-20 h-[58px] px-[14px] bg-[#f5f2eb]/95 backdrop-blur-md border-b border-[#e5dfd3] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              {activeScreen === 'home' ? (
                <div className="w-[38px] h-[38px] rounded-[11px] bg-[#9e473c] flex items-center justify-center shadow-xs shrink-0">
                  {/* 奶油白小房子图标 */}
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 11.5L12 4.5L20 11.5V19.5C20 20.05 19.55 20.5 19 20.5H5C4.45 20.5 4 20.05 4 19.5V11.5Z"
                      fill="#fbf6eb"
                    />
                    <rect x="9.5" y="13" width="5" height="7.5" rx="1" fill="#9e473c" />
                  </svg>
                </div>
              ) : (
                <button
                  onClick={() => onSelectScreen('home')}
                  className="w-9 h-9 -ml-1 rounded-full bg-[#ebe6dc] flex items-center justify-center text-[#3d3831] active:scale-95 transition-transform"
                  aria-label="返回工作台"
                >
                  <LinearIcon name="back" size={20} />
                </button>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h1 className="text-[16px] font-bold text-[#3d3831] truncate leading-tight">
                    {activeScreen === 'home' && '我们的小工作台'}
                    {activeScreen === 'leave' && '请假审批'}
                    {activeScreen === 'expense' && '消费审批'}
                    {activeScreen === 'work' && '打工账本'}
                    {activeScreen === 'play' && '娱乐时长'}
                    {activeScreen === 'roles' && '角色管理'}
                    {activeScreen === 'vault' && '小金库'}
                    {activeScreen === 'settings' && '设置与家庭码'}
                  </h1>
                  {activeScreen === 'home' && (
                    <span className="text-[12px] text-[#8c8274]">⌄</span>
                  )}
                </div>
                <p className="text-[11px] text-[#8c8274] truncate leading-tight mt-0.5">
                  {activeScreen === 'home'
                    ? `同日 · 把日子过在一起`
                    : `${currentUser} 视角 · 共 ${displayMembers.length} 位伙伴共享`}
                </p>
              </div>
            </div>

            {/* 顶栏右侧：复刻参考图「铃铛 + 雾蓝圆底单字头像」 */}
            <div className="flex items-center gap-2.5 shrink-0">
              {activeScreen === 'work' && (
                <button
                  onClick={() => onSelectScreen('roles')}
                  className="h-8 px-2.5 rounded-full bg-[#dce3d3] text-[#4e5b3e] border border-[#bfc9b2] text-[12px] font-semibold flex items-center gap-1 active:scale-95"
                >
                  <LinearIcon name="roles" size={14} />
                  <span>角色</span>
                </button>
              )}

              {/* 待办提醒铃铛 */}
              <button
                onClick={() =>
                  totalPendingForMe > 0
                    ? onSelectScreen(pendingLeavesForMe > 0 ? 'leave' : 'expense')
                    : onSelectScreen('settings')
                }
                title="待办审批与设置"
                className="relative w-8 h-8 rounded-full flex items-center justify-center text-[#5c5449] hover:bg-[#ebe6dc] active:scale-95"
              >
                <LinearIcon name={activeScreen === 'home' ? 'bell' : 'settings'} size={19} />
                {totalPendingForMe > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#9e473c] text-[#fcfbf7] text-[10px] font-bold flex items-center justify-center num-tabular">
                    {totalPendingForMe}
                  </span>
                )}
              </button>

              {/* 圆形单字成员头像 (点击直接切换当前成员视角，测试防自批规则) */}
              <button
                onClick={() => {
                  const idx = displayMembers.indexOf(currentUser);
                  const next = displayMembers[(idx + 1) % displayMembers.length];
                  setCurrentUser(next);
                  triggerToast(`已切换当前身份为：${next}`);
                }}
                title={`当前身份：${currentUser}（点击切换成员视角）`}
                className="w-[34px] h-[34px] rounded-full bg-[#d9e1e6] border border-[#c5d0d6] text-[#42525c] text-[13px] font-bold flex items-center justify-center active:scale-95 transition-transform"
              >
                {avatarChar}
              </button>
            </div>
          </header>
        )}

        {/* 离线提示条 */}
        {simState === 'offline' && (
          <div className="px-[14px] py-2 bg-[#f6eadb] border-b border-[#d8b892] flex items-center justify-between text-[12px] text-[#8c5828] shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <WatercolorCat id="tilt" size={24} />
              <span className="truncate font-medium">
                香港节点连接抖动 (RTT &gt; 2.2s)，当前为离线缓存模式
              </span>
            </div>
            <button
              onClick={() => triggerToast('正在尝试重连香港服务器…')}
              className="px-2 py-0.5 rounded bg-[#fcfbf7] text-[#9e473c] font-semibold border border-[#d8b892] shrink-0"
            >
              重试
            </button>
          </div>
        )}

        {/* 尺规标注提示条 */}
        {showAnnotations && (
          <div className="px-3 py-1 bg-[#3d3831] text-[#f5f2eb] text-[11px] flex items-center justify-between shrink-0">
            <span>暖纸本风格：底 #F5F2EB · 暖沙卡 #EFE6D5 · 象牙卡 #FCFBF7</span>
            <span className="num-tabular text-[#dce3d3]">宋体标题 + 等宽数字</span>
          </div>
        )}

        {/* 主体可滚动视口 (padding 左右固定 14px) */}
        <div
          className="flex-1 overflow-y-auto px-[14px] pt-3 pb-20 relative page-enter"
          key={`${activeScreen}-${simState}`}
        >
          {/* 全局加载态 */}
          {simState === 'loading' ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#efe6d5] flex items-center justify-center mb-3 animate-pulse">
                <WatercolorCat id="wave" size={52} />
              </div>
              <p className="text-[15px] font-medium text-[#3d3831]">正在打开…</p>
              <p className="text-[12px] text-[#999083] mt-1">正在从香港服务器同步小团体账本</p>
              <div className="w-full mt-6 space-y-2.5">
                <div className="h-28 rounded-[20px] bg-[#ebe6dc] border border-[#e5dfd3] animate-pulse" />
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="h-28 rounded-[20px] bg-[#ebe6dc] border border-[#e5dfd3] animate-pulse" />
                  <div className="h-28 rounded-[20px] bg-[#ebe6dc] border border-[#e5dfd3] animate-pulse" />
                </div>
                <div className="h-24 rounded-[20px] bg-[#ebe6dc] border border-[#e5dfd3] animate-pulse" />
              </div>
            </div>
          ) : (
            <>
              {/* =========================================================
                  4.1 进门页 (Gate Screen - 暖感亚麻纸本风)
                 ========================================================= */}
              {activeScreen === 'gate' && (
                <div className="pt-3 pb-6 flex flex-col min-h-full justify-between">
                  {/* 顶部进门状态切换器 */}
                  <div className="mb-3 p-1 bg-[#ebe6dc] rounded-xl border border-[#dfd8ca] grid grid-cols-4 gap-1 text-[11px]">
                    {[
                      { k: 'first', l: '首次(无码)' },
                      { k: 'returning', l: '换机(有码)' },
                      { k: 'error', l: '校验错误' },
                      { k: 'submitting', l: '提交中' },
                    ].map((st) => (
                      <button
                        key={st.k}
                        onClick={() => setGateMode(st.k as any)}
                        className={`py-1.5 rounded-lg font-medium transition-colors ${
                          gateMode === st.k
                            ? 'bg-[#fcfbf7] text-[#526040] font-semibold shadow-xs'
                            : 'text-[#6e665b]'
                        }`}
                      >
                        {st.l}
                      </button>
                    ))}
                  </div>

                  {/* 顶部暖沙绘本横幅 + 打招呼猫 */}
                  <div className="warm-hero-banner p-4 text-center flex flex-col items-center">
                    <div className="w-20 h-20 rounded-[22px] bg-[#fcfbf7]/85 border border-[#dfd2ba] flex items-center justify-center shadow-xs">
                      <WatercolorCat id="wave" size={74} />
                    </div>
                    <h2 className="font-editorial-serif text-[23px] font-bold text-[#3d3831] mt-3">
                      我们的小工作台
                    </h2>
                    <p className="text-[13px] text-[#7a6f5f] mt-1">
                      {gateMode === 'first'
                        ? '第一次用，给自己起个名字就能进'
                        : '填一下家庭码，选你是谁 · 把日子过在一起'}
                    </p>
                  </div>

                  {/* 进门表单卡片 */}
                  <div className="mt-3.5 bg-[#fcfbf7] rounded-[20px] border border-[#e5dfd3] p-4 shadow-xs space-y-4">
                    {gateMode !== 'first' && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[13px] font-semibold text-[#3d3831]">
                            家庭码 <span className="text-[#9e473c]">*</span>
                          </label>
                          <span className="text-[11px] text-[#999083]">6 位字母或数字</span>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          value={gateMode === 'error' ? '000000' : gateInputCode}
                          onChange={(e) => setGateInputCode(e.target.value.toUpperCase())}
                          placeholder="例如 K7M9P2"
                          className={`w-full h-11 px-3.5 rounded-[12px] bg-[#f7f4ed] border text-[17px] font-mono tracking-[0.25em] uppercase text-[#3d3831] focus:outline-none focus:bg-white ${
                            gateMode === 'error'
                              ? 'border-[#a85248] bg-[#f4e3e1]/50'
                              : 'border-[#dfd8ca] focus:border-[#6f7d5c]'
                          }`}
                        />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[13px] font-semibold text-[#3d3831]">
                          我是谁 <span className="text-[#9e473c]">*</span>
                        </label>
                        <span className="text-[11px] text-[#999083] num-tabular">
                          {gateInputName.length}/12 字
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={12}
                        value={gateInputName}
                        onChange={(e) => setGateInputName(e.target.value)}
                        placeholder="输入你的昵称（12字内）"
                        className="w-full h-11 px-3.5 rounded-[12px] bg-[#f7f4ed] border border-[#dfd8ca] text-[15px] text-[#3d3831] focus:outline-none focus:bg-white focus:border-[#6f7d5c]"
                      />

                      {/* 复刻参考图胶囊样式：「已有哪些人」 */}
                      {gateMode !== 'first' && (
                        <div className="mt-3">
                          <div className="text-[12px] text-[#999083] mb-1.5">
                            已有哪些伙伴（点一下直接选）：
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {displayMembers.map((m) => {
                              const active = gateInputName === m;
                              return (
                                <button
                                  key={m}
                                  type="button"
                                  onClick={() => setGateInputName(m)}
                                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border flex items-center gap-1.5 transition-colors ${
                                    active
                                      ? 'bg-[#dce3d3] border-[#bfc9b2] text-[#4e5b3e] font-semibold'
                                      : 'bg-[#fcfbf7] border-[#e2ddd2] text-[#5c5549]'
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      active ? 'bg-[#526040]' : 'bg-[#6b7d8c]'
                                    }`}
                                  />
                                  <span>{m}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {gateMode === 'error' && (
                      <div className="px-3 py-2 rounded-[10px] bg-[#f4e3e1] border border-[#a85248]/35 text-[12px] text-[#8c3b32]">
                        家庭码 000000 不对哦，跟伙伴确认一下 6 位码吧
                      </div>
                    )}

                    <button
                      disabled={gateMode === 'submitting'}
                      onClick={() => {
                        if (gateInputName.trim()) {
                          if (!members.includes(gateInputName.trim())) {
                            setMembers((prev) => [...prev, gateInputName.trim()]);
                          }
                          setCurrentUser(gateInputName.trim());
                        }
                        onSelectScreen('home');
                        triggerToast(`欢迎回家，${gateInputName || currentUser}`);
                      }}
                      className="w-full h-11 rounded-[12px] bg-[#6f7d5c] hover:bg-[#5e6b4c] text-[#fcfbf7] text-[15px] font-semibold shadow-xs active:scale-[0.99] transition-transform disabled:opacity-60"
                    >
                      {gateMode === 'submitting'
                        ? '正在进入…'
                        : gateMode === 'first'
                        ? '开始用'
                        : '进入小工作台'}
                    </button>
                  </div>

                  <div className="mt-5 text-center space-y-1 text-[12px] text-[#999083]">
                    <p>不用记密码 · 选一次 365 天免登录</p>
                    <p>换手机或清缓存后再来填一次家庭码即可</p>
                  </div>
                </div>
              )}

              {/* =========================================================
                  4.2 工作台首页 (Home Screen - 1:1 复刻参考图气质与结构)
                 ========================================================= */}
              {activeScreen === 'home' && (
                <div className="space-y-3.5">
                  {/* 1. 顶部暖沙绘本问候卡 (1:1 复刻参考图「平凡的一天，也有小小的晴天。」+ 右侧晴天小屋插画) */}
                  <div className="warm-hero-banner p-4 min-h-[132px] flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] text-[#7d6f5d] relative z-10">
                      <div className="flex items-center gap-1.5 font-medium">
                        <LinearIcon name="leaf" size={13} className="text-[#6f7d5c]" />
                        <span>小工作台 · 把日子过在一起</span>
                      </div>
                      <span className="tracking-[0.14em] text-[10px] text-[#b0a28e] font-semibold">
                        TOGETHER
                      </span>
                    </div>

                    <div className="my-2 relative z-10 max-w-[62%]">
                      <div className="font-editorial-serif text-[21px] text-[#433b32] leading-[1.35] tracking-tight">
                        <div>平凡的一天，</div>
                        <div>也有小小的晴天。</div>
                      </div>
                      <p className="text-[12px] text-[#807362] mt-1.5">
                        {totalPendingForMe > 0
                          ? `${currentUser}，今天有 ${totalPendingForMe} 件事等你商量审批。`
                          : `${currentUser}，今天的账本与安排，大家慢慢商量。`}
                      </p>
                    </div>

                    {/* 右下角晴天小屋 + 暖阳插画 */}
                    <div className="absolute -right-1 -bottom-1.5 z-0">
                      <WarmSunnyHouseIllustration />
                    </div>
                  </div>

                  {/* 2. 四宫格 (2×2) + 3. 中心金库圆 (58px 压交点，四张卡内角 1/4 圆弧挖洞遮罩) */}
                  <div className="bg-[#fcfbf7] rounded-[22px] border border-[#e5dfd3] p-3 shadow-xs">
                    {/* 卡片抬头：复刻参考图日历卡顶栏「2026年10月 ⌄  < 今天 >」 */}
                    <div className="flex items-center justify-between px-1 pb-2.5 mb-2.5 border-b border-[#ebe6dc]">
                      <div className="flex items-center gap-1 text-[14px] font-semibold text-[#3d3831] num-tabular">
                        <span>2026年10月</span>
                        <span className="text-[#999083] text-[12px]">⌄</span>
                      </div>
                      <div className="flex items-center gap-3 text-[12px] text-[#6e665b]">
                        <span>共 {displayMembers.length} 位伙伴</span>
                        <span className="text-[#d5cec0]">|</span>
                        <button
                          onClick={() => onSelectScreen('vault')}
                          className="text-[#966922] font-semibold"
                        >
                          金库 {vaultPercent}%
                        </button>
                      </div>
                    </div>

                    <div className="bento-grid-2x2">
                      {/* 左上：请假卡 */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelectScreen('leave')}
                        className="bento-card bento-tl !bg-[#f7f4ed] !border-[#e6dfd2]"
                      >
                        {pendingLeavesForMe > 0 && (
                          <span className="absolute top-2.5 right-2.5 min-w-[20px] h-5 px-1.5 rounded-full bg-[#9e473c] text-[#fcfbf7] text-[11px] font-bold flex items-center justify-center num-tabular">
                            {pendingLeavesForMe}
                          </span>
                        )}
                        <div className="flex items-center gap-2.5">
                          <div className="w-[42px] h-[42px] rounded-[13px] bg-[#efe5df] flex items-center justify-center shrink-0">
                            <WatercolorCat id="walk" size={38} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[15px] font-bold text-[#3d3831]">请假</div>
                            <div className="text-[11px] text-[#8c8274] num-tabular truncate">
                              待批 {pendingLeavesCount} · 共 {displayLeaves.length}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-[#e5dfd3] pr-4">
                          <div className="text-[11px] text-[#6e665b]">本月已通过</div>
                          <div className="text-[20px] font-bold text-[#9e473c] num-tabular leading-tight mt-0.5">
                            {passedLeavesCount} <span className="text-[12px] font-medium">次</span>
                          </div>
                        </div>
                      </div>

                      {/* 右上：消费卡 */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelectScreen('expense')}
                        className="bento-card bento-tr !bg-[#f7f4ed] !border-[#e6dfd2]"
                      >
                        {pendingExpensesForMe > 0 && (
                          <span className="absolute top-2.5 right-2.5 min-w-[20px] h-5 px-1.5 rounded-full bg-[#9e473c] text-[#fcfbf7] text-[11px] font-bold flex items-center justify-center num-tabular">
                            {pendingExpensesForMe}
                          </span>
                        )}
                        <div className="flex items-center gap-2.5">
                          <div className="w-[42px] h-[42px] rounded-[13px] bg-[#f2e6dc] flex items-center justify-center shrink-0">
                            <WatercolorCat id="box" size={38} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[15px] font-bold text-[#3d3831]">消费</div>
                            <div className="text-[11px] text-[#8c8274] num-tabular truncate">
                              待批 {pendingExpensesCount} · 共 {displayExpenses.length}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-[#e5dfd3] pl-3">
                          <div className="text-[11px] text-[#6e665b]">本月已通过</div>
                          <div className="text-[20px] font-bold text-[#b87638] num-tabular leading-tight mt-0.5 truncate">
                            ¥{passedExpensesSum.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* 左下：打工卡 (定律 #1: div[role=button] 内部嵌圆底「角色管理」按钮) */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelectScreen('work')}
                        className="bento-card bento-bl !bg-[#f7f4ed] !border-[#e6dfd2]"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectScreen('roles');
                          }}
                          title="角色管理"
                          className="absolute top-2.5 right-2.5 h-7 px-2 rounded-full bg-[#dce3d3] hover:bg-[#cfd9c4] text-[#4e5b3e] border border-[#bfc9b2] text-[11px] font-semibold flex items-center gap-1 active:scale-95 transition-transform z-10"
                        >
                          <LinearIcon name="roles" size={13} />
                          <span>角色</span>
                        </button>

                        <div className="flex items-center gap-2.5">
                          <div className="w-[42px] h-[42px] rounded-[13px] bg-[#e3e9dc] flex items-center justify-center shrink-0">
                            <WatercolorCat id="fish" size={38} />
                          </div>
                          <div className="min-w-0 pr-10">
                            <div className="text-[15px] font-bold text-[#3d3831]">打工</div>
                            <div className="text-[11px] text-[#8c8274] num-tabular truncate">
                              本月 {monthWorks.length} 笔 · 共 {displayWorks.length}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-[#e5dfd3]">
                          <div className="text-[11px] text-[#6e665b]">本月净赚</div>
                          <div
                            className={`${
                              isNarrow ? 'text-[17px]' : 'text-[19px]'
                            } font-bold num-tabular leading-tight mt-0.5 ${
                              monthWorkNet >= 0 ? 'text-[#526040]' : 'text-[#b87638]'
                            }`}
                          >
                            {monthWorkNet >= 0 ? `+${monthWorkNet}` : monthWorkNet}{' '}
                            <span className="text-[12px] font-medium">金</span>
                          </div>
                        </div>
                      </div>

                      {/* 右下：娱乐卡 */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelectScreen('play')}
                        className="bento-card bento-br !bg-[#f7f4ed] !border-[#e6dfd2]"
                      >
                        <div className="flex items-center gap-2.5 pl-2">
                          <div className="w-[42px] h-[42px] rounded-[13px] bg-[#e3e8ec] flex items-center justify-center shrink-0">
                            <WatercolorCat id="yarn" size={38} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[15px] font-bold text-[#3d3831]">娱乐</div>
                            <div className="text-[11px] text-[#8c8274] num-tabular truncate">
                              本周 {weekPlays.length} 次 · 共 {displayPlays.length}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-[#e5dfd3]">
                          <div className="text-[11px] text-[#6e665b]">
                            本周时长{' '}
                            {weekPlayHours > 14 && <span className="text-[#b87638]">(超标)</span>}
                          </div>
                          <div
                            className={`text-[20px] font-bold num-tabular leading-tight mt-0.5 ${
                              weekPlayHours > 14 ? 'text-[#b87638]' : 'text-[#495a68]'
                            }`}
                          >
                            {weekPlayHours} <span className="text-[12px] font-medium">小时</span>
                          </div>
                        </div>
                      </div>

                      {/* 3. 压在四宫格交点中心的 58px 小金库圆水位球 */}
                      <button
                        type="button"
                        onClick={() => onSelectScreen('vault')}
                        aria-label="打开小金库"
                        className="vault-orb-center"
                      >
                        <div
                          className="vault-wave-fill"
                          style={{ height: `${Math.max(12, vaultPercent)}%` }}
                        />
                        <span className="relative z-10 text-[13px] font-bold text-[#5c4216] num-tabular leading-none">
                          {vaultPercent}%
                        </span>
                        <span className="relative z-10 text-[10px] font-semibold text-[#755520] leading-none mt-0.5">
                          金库
                        </span>
                      </button>
                    </div>

                    {/* 卡片底注：复刻参考图「按开始时间排列 · 点模块看看大家的安排」 */}
                    <div className="mt-2.5 pt-2 border-t border-[#ebe6dc] flex items-center justify-between text-[11px] text-[#999083] px-1">
                      <span>按最新变动排列</span>
                      <span>点卡片进入对应账本与审批</span>
                    </div>
                  </div>

                  {/* 4. 成员胶囊筛选条 (1:1 复刻参考图「全家 | • 乐乐 | • 爸爸」鼠尾草绿与圆点胶囊) */}
                  <div className="flex items-center gap-2 overflow-x-auto py-0.5">
                    <button
                      onClick={() => setHomeMemberFilter('all')}
                      className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-colors shrink-0 ${
                        homeMemberFilter === 'all'
                          ? 'bg-[#dce3d3] border-[#bfc9b2] text-[#4a573b] font-semibold'
                          : 'bg-[#fcfbf7] border-[#e2ddd2] text-[#5c5549]'
                      }`}
                    >
                      全团
                    </button>
                    {displayMembers.map((m, idx) => {
                      const active = homeMemberFilter === m;
                      const dotColors = ['#6f7d5c', '#6b7d8c', '#9e473c', '#b87638'];
                      return (
                        <button
                          key={m}
                          onClick={() => setHomeMemberFilter(m)}
                          className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border flex items-center gap-1.5 transition-colors shrink-0 ${
                            active
                              ? 'bg-[#dce3d3] border-[#bfc9b2] text-[#4a573b] font-semibold'
                              : 'bg-[#fcfbf7] border-[#e2ddd2] text-[#5c5549]'
                          }`}
                        >
                          <span
                            style={{ backgroundColor: dotColors[idx % dotColors.length] }}
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                          />
                          <span>{m}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 5. 「近期要留意 / 最近动态」暖麦色卡片 (1:1 复刻参考图底部卡片样式) */}
                  <div className="warm-notice-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13.5px] font-semibold text-[#6e6456]">
                        近期要留意 · 最近动态
                      </span>
                      <button
                        onClick={() => onSelectScreen('leave')}
                        className="text-[12.5px] font-semibold text-[#9e473c]"
                      >
                        查看待批 ({totalPendingForMe})
                      </button>
                    </div>

                    {simState === 'empty' ? (
                      <div className="py-6 text-center text-[13px] text-[#8c8274]">
                        还没有动态，点上方模块记第一笔吧
                      </div>
                    ) : (
                      <div className="divide-y divide-[#dfd6c3]">
                        {[
                          {
                            id: 'f1',
                            icon: 'leave' as const,
                            owner: '阿璃',
                            title: `10月19日 · 阿璃 · 聚餐：周六晚潮汕牛肉火锅`,
                            sub: `请假待审批 · 今天 18:20 提交`,
                            targetScreen: 'leave' as ScreenId,
                          },
                          {
                            id: 'f2',
                            icon: 'expense' as const,
                            owner: '阿璃',
                            title: `10月19日 · 万宝楼 · 外观：七秀复刻白发 ¥288.00`,
                            sub: `消费待审批 · 等待伙伴放行`,
                            targetScreen: 'expense' as ScreenId,
                          },
                          {
                            id: 'f3',
                            icon: 'work' as const,
                            owner: displayWorks[0]?.owner || '小明',
                            title: `10月19日 · 莫问青衫 · 净赚 +107738 金`,
                            sub: `打工账本 · 达标已全额计入小金库`,
                            targetScreen: 'work' as ScreenId,
                          },
                          {
                            id: 'f4',
                            icon: 'pin' as const,
                            owner: '小明',
                            title: `10月20日 · 小明 · 外出：下午牙科诊所复查洗牙`,
                            sub: `请假待审批 · 晚饭前赶回打本`,
                            targetScreen: 'leave' as ScreenId,
                          },
                          {
                            id: 'f5',
                            icon: 'play' as const,
                            owner: '小明',
                            title: `10月19日 · 三角洲 · 组排烽火地带 3.5 小时`,
                            sub: `娱乐时长 · 本周累计 ${weekPlayHours} 小时`,
                            targetScreen: 'play' as ScreenId,
                          },
                        ]
                          .filter(
                            (r) => homeMemberFilter === 'all' || r.owner === homeMemberFilter
                          )
                          .map((row) => (
                            <button
                              key={row.id}
                              onClick={() => onSelectScreen(row.targetScreen)}
                              className="w-full py-2.5 flex items-center justify-between gap-2.5 text-left group"
                            >
                              <div className="flex items-start gap-2.5 min-w-0">
                                <div className="mt-1 text-[#7a6f5f] shrink-0">
                                  <LinearIcon name={row.icon} size={17} />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-[14px] font-semibold text-[#3d3831] truncate num-tabular">
                                    {row.title}
                                  </div>
                                  <div className="text-[12px] text-[#857968] mt-0.5 truncate">
                                    {row.sub}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[#998d7c] text-[16px] shrink-0">›</span>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* 底部同步说明行 */}
                  <div className="text-center py-1 text-[11px] text-[#999083]">
                    数据存在你自己的香港服务器上 · 自动同步
                  </div>
                </div>
              )}

              {/* =========================================================
                  4.3 请假 (Leave Screen)
                 ========================================================= */}
              {activeScreen === 'leave' && (
                <div className="space-y-3">
                  {/* 顶部 4 个鼠尾草风筛选胶囊 */}
                  <div className="grid grid-cols-4 gap-1.5 bg-[#ebe6dc] p-1 rounded-[14px] border border-[#dfd8ca]">
                    {[
                      { k: 'all', l: '全部', c: displayLeaves.length },
                      {
                        k: 'wait',
                        l: '待审批',
                        c: displayLeaves.filter((i) => i.status === 'wait').length,
                      },
                      {
                        k: 'pass',
                        l: '已通过',
                        c: displayLeaves.filter((i) => i.status === 'pass').length,
                      },
                      {
                        k: 'reject',
                        l: '已驳回',
                        c: displayLeaves.filter((i) => i.status === 'reject').length,
                      },
                    ].map((tab) => {
                      const active = leaveFilter === tab.k;
                      return (
                        <button
                          key={tab.k}
                          onClick={() => setLeaveFilter(tab.k as any)}
                          className={`py-1.5 rounded-[10px] text-[12px] font-medium transition-colors num-tabular ${
                            active
                              ? 'bg-[#fcfbf7] text-[#526040] font-semibold shadow-xs'
                              : 'text-[#6e665b]'
                          }`}
                        >
                          {tab.l} {tab.c}
                        </button>
                      );
                    })}
                  </div>

                  {displayLeaves.filter((l) => leaveFilter === 'all' || l.status === leaveFilter)
                    .length === 0 ? (
                    <div className="bg-[#fcfbf7] rounded-[20px] border border-[#e5dfd3] py-12 px-4 flex flex-col items-center text-center">
                      <WatercolorCat id="walk" size={92} />
                      <p className="text-[14px] font-semibold text-[#3d3831] mt-3">
                        还没有请假记录，点右下角 ＋ 记一笔
                      </p>
                      <p className="text-[12px] text-[#999083] mt-1">
                        外出、聚餐跟伙伴打个招呼，一家人慢慢商量
                      </p>
                      <button
                        onClick={() => {
                          setLeaveFormOwner(currentUser);
                          setLayer1Sheet({ type: 'leave-form' });
                        }}
                        className="mt-4 px-4 py-2 rounded-full bg-[#dce3d3] text-[#4e5b3e] text-[13px] font-semibold active:scale-95"
                      >
                        ＋ 记一笔请假
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {displayLeaves
                        .filter((l) => leaveFilter === 'all' || l.status === leaveFilter)
                        .map((item) => {
                          const isOtherPending =
                            item.status === 'wait' && item.owner !== currentUser;
                          return (
                            <div
                              key={item.id}
                              className={`rounded-[18px] border p-3.5 shadow-xs record-card-press ${
                                isOtherPending
                                  ? 'bg-[#f5eedf] border-[#d4be98]'
                                  : 'bg-[#fcfbf7] border-[#e5dfd3]'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-[16px] font-bold text-[#3d3831]">
                                    {item.type}
                                  </span>
                                  <span className="text-[12px] text-[#6e665b] font-medium">
                                    · {item.owner}
                                  </span>
                                  <span className="text-[12px] text-[#999083] num-tabular">
                                    · {item.date}
                                  </span>
                                </div>

                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                                    item.status === 'wait'
                                      ? 'bg-[#f6eadb] text-[#b87638] border border-[#b87638]/30'
                                      : item.status === 'pass'
                                      ? 'bg-[#dce3d3] text-[#4e5b3e]'
                                      : 'bg-[#f4e3e1] text-[#a85248]'
                                  }`}
                                >
                                  {item.status === 'wait'
                                    ? isOtherPending
                                      ? '待我审批'
                                      : '待审批'
                                    : item.status === 'pass'
                                    ? '✓ 已通过'
                                    : '× 已驳回'}
                                </span>
                              </div>

                              <p className="mt-2 text-[14px] text-[#3d3831] leading-relaxed">
                                {item.reason}
                              </p>

                              <div className="mt-3 pt-2.5 border-t border-[#e5dfd3] flex items-center justify-between gap-2">
                                <div className="text-[11px] text-[#999083] num-tabular truncate">
                                  {item.status === 'wait' ? (
                                    item.owner === currentUser ? (
                                      <span className="text-[#b87638]">
                                        本人提交 · 等其他伙伴审批
                                      </span>
                                    ) : (
                                      <span>提交于 {item.timeText}</span>
                                    )
                                  ) : (
                                    <span>
                                      由 {item.approver} 于 {item.approvedAt} 审批
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {isOtherPending && (
                                    <>
                                      <button
                                        onClick={() => handleApproveLeave(item.id, 'reject')}
                                        className="h-7 px-2.5 rounded-[8px] bg-[#f4e3e1] text-[#a85248] text-[12px] font-semibold active:scale-95"
                                      >
                                        驳回
                                      </button>
                                      <button
                                        onClick={() => handleApproveLeave(item.id, 'pass')}
                                        className="h-7 px-3 rounded-[8px] bg-[#6f7d5c] text-[#fcfbf7] text-[12px] font-semibold active:scale-95"
                                      >
                                        通过
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() =>
                                      setLayer1Sheet({
                                        type: 'record-detail',
                                        module: 'leave',
                                        item,
                                      })
                                    }
                                    className="h-7 px-2.5 rounded-[8px] bg-[#ebe6dc] text-[#6e665b] text-[12px] font-medium"
                                  >
                                    详情
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================
                  4.4 消费 (Expense Screen)
                 ========================================================= */}
              {activeScreen === 'expense' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-1.5 bg-[#ebe6dc] p-1 rounded-[14px] border border-[#dfd8ca]">
                    {[
                      { k: 'all', l: '全部', c: displayExpenses.length },
                      {
                        k: 'wait',
                        l: '待审批',
                        c: displayExpenses.filter((i) => i.status === 'wait').length,
                      },
                      {
                        k: 'pass',
                        l: '已通过',
                        c: displayExpenses.filter((i) => i.status === 'pass').length,
                      },
                      {
                        k: 'reject',
                        l: '已驳回',
                        c: displayExpenses.filter((i) => i.status === 'reject').length,
                      },
                    ].map((tab) => {
                      const active = expenseFilter === tab.k;
                      return (
                        <button
                          key={tab.k}
                          onClick={() => setExpenseFilter(tab.k as any)}
                          className={`py-1.5 rounded-[10px] text-[12px] font-medium transition-colors num-tabular ${
                            active
                              ? 'bg-[#fcfbf7] text-[#9e473c] font-semibold shadow-xs'
                              : 'text-[#6e665b]'
                          }`}
                        >
                          {tab.l} {tab.c}
                        </button>
                      );
                    })}
                  </div>

                  {displayExpenses.filter(
                    (e) => expenseFilter === 'all' || e.status === expenseFilter
                  ).length === 0 ? (
                    <div className="bg-[#fcfbf7] rounded-[20px] border border-[#e5dfd3] py-12 px-4 flex flex-col items-center text-center">
                      <WatercolorCat id="box" size={92} />
                      <p className="text-[14px] font-semibold text-[#3d3831] mt-3">
                        还没有消费记录，点右下角 ＋ 记一笔
                      </p>
                      <button
                        onClick={() => {
                          setExpFormOwner(currentUser);
                          setLayer1Sheet({ type: 'expense-form' });
                        }}
                        className="mt-4 px-4 py-2 rounded-full bg-[#f3e3df] text-[#9e473c] text-[13px] font-semibold active:scale-95"
                      >
                        ＋ 记一笔消费
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {displayExpenses
                        .filter((e) => expenseFilter === 'all' || e.status === expenseFilter)
                        .map((item) => {
                          const isOtherPending =
                            item.status === 'wait' && item.owner !== currentUser;
                          return (
                            <div
                              key={item.id}
                              className={`rounded-[18px] border p-3.5 shadow-xs record-card-press ${
                                isOtherPending
                                  ? 'bg-[#f5eedf] border-[#d4be98]'
                                  : 'bg-[#fcfbf7] border-[#e5dfd3]'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-1.5 py-0.5 rounded bg-[#efe6d5] text-[#9e543d] text-[11px] font-semibold shrink-0">
                                      {item.category}
                                    </span>
                                    <span className="text-[15px] font-bold text-[#3d3831] truncate">
                                      {item.merchant}
                                    </span>
                                  </div>
                                  <div className="text-[12px] text-[#6e665b] mt-0.5 num-tabular">
                                    {item.owner} · {item.date} · {item.timeText}
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <div className="text-[20px] font-bold text-[#3d3831] num-tabular leading-tight">
                                    ¥{item.amount.toFixed(2)}
                                  </div>
                                  <span
                                    className={`inline-block mt-0.5 px-2 py-0.2 rounded-full text-[11px] font-semibold ${
                                      item.status === 'wait'
                                        ? 'bg-[#f6eadb] text-[#b87638]'
                                        : item.status === 'pass'
                                        ? 'bg-[#dce3d3] text-[#4e5b3e]'
                                        : 'bg-[#f4e3e1] text-[#a85248]'
                                    }`}
                                  >
                                    {item.status === 'wait'
                                      ? isOtherPending
                                        ? '待我批'
                                        : '待审批'
                                      : item.status === 'pass'
                                      ? '✓ 已通过'
                                      : '× 已驳回'}
                                  </span>
                                </div>
                              </div>

                              <p className="mt-2 text-[14px] text-[#3d3831] leading-relaxed">
                                {item.note}
                              </p>

                              <div className="mt-3 pt-2.5 border-t border-[#e5dfd3] flex items-center justify-between gap-2">
                                <span className="text-[11px] text-[#999083] truncate">
                                  {item.status === 'wait'
                                    ? item.owner === currentUser
                                      ? '本人提交 · 等其他伙伴审批'
                                      : '等待伙伴确认放行'
                                    : `由 ${item.approver} 于 ${item.approvedAt} 审批`}
                                </span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {isOtherPending && (
                                    <>
                                      <button
                                        onClick={() => handleApproveExpense(item.id, 'reject')}
                                        className="h-7 px-2.5 rounded-[8px] bg-[#f4e3e1] text-[#a85248] text-[12px] font-semibold"
                                      >
                                        驳回
                                      </button>
                                      <button
                                        onClick={() => handleApproveExpense(item.id, 'pass')}
                                        className="h-7 px-3 rounded-[8px] bg-[#6f7d5c] text-[#fcfbf7] text-[12px] font-semibold"
                                      >
                                        通过
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() =>
                                      setLayer1Sheet({
                                        type: 'record-detail',
                                        module: 'expense',
                                        item,
                                      })
                                    }
                                    className="h-7 px-2.5 rounded-[8px] bg-[#ebe6dc] text-[#6e665b] text-[12px] font-medium"
                                  >
                                    详情
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================
                  4.5 打工账本 (Work Ledger Screen)
                 ========================================================= */}
              {activeScreen === 'work' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-1.5 bg-[#ebe6dc] p-1 rounded-[14px] border border-[#dfd8ca]">
                    {[
                      { k: 'all', l: '累计' },
                      { k: 'week', l: '本周' },
                      { k: 'month', l: '本月' },
                    ].map((tab) => (
                      <button
                        key={tab.k}
                        onClick={() => setWorkPeriod(tab.k as any)}
                        className={`py-1.5 rounded-[10px] text-[12px] font-medium transition-colors ${
                          workPeriod === tab.k
                            ? 'bg-[#fcfbf7] text-[#526040] font-semibold shadow-xs'
                            : 'text-[#6e665b]'
                        }`}
                      >
                        {tab.l}
                      </button>
                    ))}
                  </div>

                  {/* 按人分行的统计表 (一人一行自动生成 + 合计行，数字绝不缩写，0显示—，窄屏自动缩字号) */}
                  {(() => {
                    const filteredWorks = displayWorks.filter((w) =>
                      workPeriod === 'all'
                        ? true
                        : workPeriod === 'week'
                        ? w.period === 'week'
                        : w.period === 'week' || w.period === 'month'
                    );

                    const memberRows = displayMembers.map((m) => {
                      const mine = filteredWorks.filter((w) => w.owner === m);
                      const income = mine.reduce((a, b) => a + b.income, 0);
                      const expense = mine.reduce((a, b) => a + b.expense, 0);
                      const bonus = mine.reduce((a, b) => a + b.bonus, 0);
                      const advance = mine.reduce((a, b) => a + b.advance, 0);
                      const net = income + bonus - expense - advance;
                      return { name: m, income, expense, bonus, advance, net };
                    });

                    const totalIncome = memberRows.reduce((a, b) => a + b.income, 0);
                    const totalExpense = memberRows.reduce((a, b) => a + b.expense, 0);
                    const totalBonus = memberRows.reduce((a, b) => a + b.bonus, 0);
                    const totalAdvance = memberRows.reduce((a, b) => a + b.advance, 0);
                    const totalNet = totalIncome + totalBonus - totalExpense - totalAdvance;

                    return (
                      <div className="bg-[#fcfbf7] rounded-[20px] border border-[#e5dfd3] overflow-hidden shadow-xs">
                        <div className="px-3.5 py-2.5 bg-[#efe6d5]/70 border-b border-[#e5dfd3] flex items-center justify-between">
                          <div>
                            <span className="text-[12px] text-[#5c5449] font-semibold">
                              按人统计 ({displayMembers.length}人自动分行)
                            </span>
                            <div className="text-[11px] text-[#8c8274]">
                              真数不缩写 · 0 显示「—」 · 零横向滚动
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[11px] text-[#6e665b]">全团纯收入</div>
                            <div
                              className={`text-[18px] font-bold num-tabular ${
                                totalNet >= 0 ? 'text-[#526040]' : 'text-[#b87638]'
                              }`}
                            >
                              {formatGoldCell(totalNet, true)} 金
                            </div>
                          </div>
                        </div>

                        <table
                          className={`w-full border-collapse table-fixed num-tabular ${
                            isNarrow || simState === 'stress' ? 'text-[10px]' : 'text-[11.5px]'
                          }`}
                        >
                          <thead>
                            <tr className="border-b border-[#e5dfd3] text-[#999083] font-medium bg-[#f7f4ed]">
                              <th className="py-2 pl-2.5 pr-1 text-left w-[20%] truncate">名字</th>
                              <th className="py-2 px-1 text-right">收入</th>
                              <th className="py-2 px-1 text-right">支出</th>
                              <th className="py-2 px-1 text-right">分红</th>
                              <th className="py-2 px-1 text-right">代付</th>
                              <th className="py-2 pl-1 pr-2.5 text-right w-[22%]">纯收入</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e5dfd3]/60">
                            {memberRows.map((r, idx) => (
                              <tr
                                key={r.name}
                                className={idx % 2 === 1 ? 'bg-[#f5f2eb]/70' : 'bg-[#fcfbf7]'}
                              >
                                <td className="py-2 pl-2.5 pr-1 font-semibold text-[#3d3831] truncate">
                                  {r.name}
                                </td>
                                <td className="py-2 px-1 text-right text-[#3d3831]">
                                  {formatGoldCell(r.income)}
                                </td>
                                <td className="py-2 px-1 text-right text-[#6e665b]">
                                  {formatGoldCell(r.expense)}
                                </td>
                                <td className="py-2 px-1 text-right text-[#6e665b]">
                                  {formatGoldCell(r.bonus)}
                                </td>
                                <td className="py-2 px-1 text-right text-[#6e665b]">
                                  {formatGoldCell(r.advance)}
                                </td>
                                <td
                                  className={`py-2 pl-1 pr-2.5 text-right font-bold ${
                                    r.net > 0
                                      ? 'text-[#526040]'
                                      : r.net < 0
                                      ? 'text-[#b87638]'
                                      : 'text-[#999083]'
                                  }`}
                                >
                                  {formatGoldCell(r.net, true)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t-[1.5px] border-[#d6cdbd] bg-[#efe6d5]/45 font-semibold">
                              <td className="py-2 pl-2.5 pr-1 text-[#3d3831]">合计</td>
                              <td className="py-2 px-1 text-right text-[#3d3831]">
                                {formatGoldCell(totalIncome)}
                              </td>
                              <td className="py-2 px-1 text-right text-[#6e665b]">
                                {formatGoldCell(totalExpense)}
                              </td>
                              <td className="py-2 px-1 text-right text-[#6e665b]">
                                {formatGoldCell(totalBonus)}
                              </td>
                              <td className="py-2 px-1 text-right text-[#6e665b]">
                                {formatGoldCell(totalAdvance)}
                              </td>
                              <td
                                className={`py-2 pl-1 pr-2.5 text-right font-bold ${
                                  totalNet >= 0 ? 'text-[#526040]' : 'text-[#b87638]'
                                }`}
                              >
                                {formatGoldCell(totalNet, true)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    );
                  })()}

                  {displayWorks.length === 0 ? (
                    <div className="bg-[#fcfbf7] rounded-[20px] border border-[#e5dfd3] py-12 px-4 flex flex-col items-center text-center">
                      <WatercolorCat id="fish" size={92} />
                      <p className="text-[14px] font-semibold text-[#3d3831] mt-3">
                        还没有打工记录，点右下角 ＋ 记一笔
                      </p>
                      <button
                        onClick={() => {
                          setWkFormOwner(currentUser);
                          setLayer1Sheet({ type: 'work-form' });
                        }}
                        className="mt-4 px-4 py-2 rounded-full bg-[#dce3d3] text-[#4e5b3e] text-[13px] font-semibold"
                      >
                        ＋ 记一笔打工
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {displayWorks.map((w) => {
                        const net = calcWorkNet(w);
                        const sectInfo = SECT_MAP[w.sect];
                        const isAutoVault = net >= vaultThreshold;
                        return (
                          <div
                            key={w.id}
                            className="bg-[#fcfbf7] rounded-[18px] border border-[#e5dfd3] p-3.5 shadow-xs record-card-press"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex items-center flex-wrap gap-1.5">
                                  <span
                                    style={{
                                      backgroundColor: sectInfo.softBg,
                                      color: sectInfo.color,
                                      borderColor: sectInfo.rail,
                                    }}
                                    className="px-2 py-0.5 rounded-[7px] border text-[12px] font-semibold shrink-0"
                                  >
                                    {SECT_SHORT_LABEL[w.sect]} · {w.roleName}
                                  </span>

                                  {w.drops.map((d) => (
                                    <span
                                      key={d}
                                      className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                                        d === '玄晶'
                                          ? 'bg-[#f5ebd6] text-[#966922]'
                                          : 'bg-[#e3e8ec] text-[#495a68]'
                                      }`}
                                    >
                                      {d}
                                    </span>
                                  ))}
                                </div>

                                <div className="text-[12px] text-[#6e665b] mt-1 num-tabular">
                                  {w.owner} · {w.timeText}
                                  {isAutoVault && (
                                    <span className="ml-1.5 text-[#966922] font-medium">
                                      · 已全额入小金库
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div
                                className={`text-[21px] font-bold num-tabular shrink-0 ${
                                  net >= 0 ? 'text-[#526040]' : 'text-[#b87638]'
                                }`}
                              >
                                {net >= 0 ? `+${net}` : net}{' '}
                                <span className="text-[12px] font-medium">金</span>
                              </div>
                            </div>

                            <div className="mt-2.5 px-2.5 py-1.5 rounded-[10px] bg-[#f5f2eb] flex items-center justify-between text-[12px] text-[#6e665b] num-tabular">
                              <span>收 {formatGoldCell(w.income)}</span>
                              <span>·</span>
                              <span>分 {formatGoldCell(w.bonus)}</span>
                              <span>·</span>
                              <span>支 {formatGoldCell(w.expense)}</span>
                              <span>·</span>
                              <span>代 {formatGoldCell(w.advance)}</span>
                            </div>

                            <div className="mt-2.5 flex items-center justify-between gap-2">
                              <p className="text-[13px] text-[#3d3831] truncate">
                                {w.note || '无备注'}
                              </p>
                              <button
                                onClick={() =>
                                  setLayer1Sheet({
                                    type: 'record-detail',
                                    module: 'work',
                                    item: w,
                                  })
                                }
                                className="h-7 px-2.5 rounded-[8px] bg-[#ebe6dc] text-[#6e665b] text-[12px] font-medium shrink-0"
                              >
                                详情
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================
                  4.6 娱乐时长 (Entertainment Screen)
                 ========================================================= */}
              {activeScreen === 'play' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-1.5 bg-[#ebe6dc] p-1 rounded-[14px] border border-[#dfd8ca]">
                    {[
                      { k: 'week', l: '本周' },
                      { k: 'month', l: '本月' },
                      { k: 'all', l: '累计' },
                    ].map((tab) => (
                      <button
                        key={tab.k}
                        onClick={() => setPlayPeriod(tab.k as any)}
                        className={`py-1.5 rounded-[10px] text-[12px] font-medium transition-colors ${
                          playPeriod === tab.k
                            ? 'bg-[#fcfbf7] text-[#495a68] font-semibold shadow-xs'
                            : 'text-[#6e665b]'
                        }`}
                      >
                        {tab.l}
                      </button>
                    ))}
                  </div>

                  {(() => {
                    const totalH = displayPlays.reduce((a, b) => a + b.hours, 0);
                    const count = displayPlays.length;
                    const avg = count > 0 ? (totalH / count).toFixed(1) : '0';
                    const isOverLimit = totalH > 14;
                    return (
                      <div
                        className={`rounded-[20px] border p-4 transition-colors ${
                          isOverLimit
                            ? 'bg-[#f6eadb] border-[#d4b083]'
                            : 'bg-[#fcfbf7] border-[#e5dfd3]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[12px] font-medium text-[#6e665b]">
                              {playPeriod === 'week' ? '本周累计娱乐' : '本期累计娱乐'}（阈值 14h）
                            </div>
                            <div
                              className={`text-[25px] font-bold num-tabular mt-0.5 ${
                                isOverLimit ? 'text-[#b87638]' : 'text-[#495a68]'
                              }`}
                            >
                              {totalH} <span className="text-[13px] font-medium">小时</span>
                            </div>
                          </div>
                          <div className="text-right num-tabular">
                            <div className="text-[13px] text-[#3d3831] font-semibold">
                              共 {count} 次
                            </div>
                            <div className="text-[12px] text-[#6e665b] mt-0.5">
                              平均 {avg} 小时/次
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 h-2 rounded-full bg-[#ebe6dc] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-200 ${
                              isOverLimit ? 'bg-[#b87638]' : 'bg-[#6b7d8c]'
                            }`}
                            style={{ width: `${Math.min(100, Math.round((totalH / 14) * 100))}%` }}
                          />
                        </div>
                        {isOverLimit && (
                          <div className="mt-2 text-[12px] text-[#8c5828] font-medium">
                            已超过每周 14 小时约定阈值，注意休息护眼哦！
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {displayPlays.length === 0 ? (
                    <div className="bg-[#fcfbf7] rounded-[20px] border border-[#e5dfd3] py-12 px-4 flex flex-col items-center text-center">
                      <WatercolorCat id="yarn" size={92} />
                      <p className="text-[14px] font-semibold text-[#3d3831] mt-3">
                        还没有娱乐记录，点右下角 ＋ 记一笔
                      </p>
                      <button
                        onClick={() => {
                          setPlFormOwner(currentUser);
                          setLayer1Sheet({ type: 'play-form' });
                        }}
                        className="mt-4 px-4 py-2 rounded-full bg-[#e3e8ec] text-[#495a68] text-[13px] font-semibold"
                      >
                        ＋ 记一笔娱乐
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {displayPlays.map((p) => (
                        <div
                          key={p.id}
                          onClick={() =>
                            setLayer1Sheet({ type: 'record-detail', module: 'play', item: p })
                          }
                          className="bg-[#fcfbf7] rounded-[18px] border border-[#e5dfd3] p-3.5 shadow-xs record-card-press cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[16px] font-bold text-[#3d3831]">
                                {p.game}
                              </span>
                              <div className="text-[12px] text-[#6e665b] mt-0.5 num-tabular">
                                {p.owner} · {p.date} · {p.timeText}
                              </div>
                            </div>
                            <div className="text-[21px] font-bold text-[#495a68] num-tabular">
                              {p.hours} <span className="text-[12px] font-medium">小时</span>
                            </div>
                          </div>
                          {p.note && (
                            <p className="mt-2 text-[13px] text-[#3d3831] leading-relaxed">
                              {p.note}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================
                  4.7 角色管理 (Role Management Screen)
                 ========================================================= */}
              {activeScreen === 'roles' && (
                <div className="space-y-3">
                  <div className="bg-[#fcfbf7] rounded-[18px] border border-[#e5dfd3] p-2.5 shadow-xs flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="输入新角色名…"
                      className="flex-1 min-w-0 h-9 px-2.5 rounded-[10px] bg-[#f7f4ed] border border-[#dfd8ca] text-[13px] text-[#3d3831] focus:outline-none focus:border-[#6f7d5c]"
                    />
                    <select
                      value={newRoleSect}
                      onChange={(e) => setNewRoleSect(e.target.value as SectKey)}
                      className="h-9 px-2 rounded-[10px] bg-[#ebe6dc] border border-[#dfd8ca] text-[12px] font-semibold text-[#3d3831]"
                    >
                      <option value="xiu">七秀</option>
                      <option value="ge">长歌</option>
                      <option value="du">五毒</option>
                      <option value="hua">万花</option>
                      <option value="yao">药宗</option>
                    </select>
                    <button
                      onClick={() => {
                        if (!newRoleName.trim()) {
                          triggerToast('请先输入角色名字');
                          return;
                        }
                        setRoles((prev) => [
                          ...prev,
                          {
                            id: `r-${Date.now()}`,
                            name: newRoleName.trim(),
                            sect: newRoleSect,
                            score: 265000,
                          },
                        ]);
                        setNewRoleName('');
                        triggerToast(`已加入角色：${newRoleName.trim()}`);
                      }}
                      className="h-9 px-3 rounded-[10px] bg-[#6f7d5c] text-[#fcfbf7] text-[13px] font-semibold shrink-0 active:scale-95"
                    >
                      加入
                    </button>
                  </div>

                  {displayRoles.length === 0 ? (
                    <div className="bg-[#fcfbf7] rounded-[20px] border border-[#e5dfd3] py-12 px-4 flex flex-col items-center text-center">
                      <WatercolorCat id="ledger" size={88} />
                      <p className="text-[14px] font-semibold text-[#3d3831] mt-3">还没有角色</p>
                      <p className="text-[12px] text-[#999083] mt-1">
                        在上方输入角色名并选择门派即可加入名册
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(['xiu', 'ge', 'du', 'hua', 'yao'] as SectKey[]).map((sectKey) => {
                        const sectRoles = displayRoles.filter((r) => r.sect === sectKey);
                        if (sectRoles.length === 0) return null;
                        const sectInfo = SECT_MAP[sectKey];

                        return (
                          <div
                            key={sectKey}
                            className="bg-[#fcfbf7] rounded-[18px] border overflow-hidden shadow-xs"
                            style={{ borderColor: sectInfo.rail }}
                          >
                            <div
                              style={{ backgroundColor: sectInfo.softBg }}
                              className="px-3 py-2 flex items-center justify-between border-b"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  style={{ backgroundColor: sectInfo.color }}
                                  className="w-5 h-5 rounded-md text-white text-[11px] font-bold flex items-center justify-center"
                                >
                                  {SECT_SHORT_LABEL[sectKey]}
                                </span>
                                <span
                                  style={{ color: sectInfo.color }}
                                  className="text-[14px] font-bold"
                                >
                                  {sectInfo.fullName}
                                </span>
                              </div>
                              <span
                                style={{ color: sectInfo.color }}
                                className="text-[11px] font-semibold num-tabular"
                              >
                                {sectRoles.length} 个角色 · 点行可编辑
                              </span>
                            </div>

                            <table
                              className={`w-full border-collapse table-fixed num-tabular ${
                                isNarrow || simState === 'stress' ? 'text-[10px]' : 'text-[11.5px]'
                              }`}
                            >
                              <thead>
                                <tr className="border-b border-[#e5dfd3] text-[#999083] bg-[#f7f4ed]">
                                  <th className="py-1.5 pl-2.5 pr-1 text-left w-[24%]">名字</th>
                                  <th className="py-1.5 px-1 text-right">装分</th>
                                  <th className="py-1.5 px-1 text-right">收入</th>
                                  <th className="py-1.5 px-1 text-right">支出</th>
                                  <th className="py-1.5 px-1 text-right">分红</th>
                                  <th className="py-1.5 pl-1 pr-2.5 text-right w-[21%]">纯收入</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#e5dfd3]/60">
                                {sectRoles.map((role) => {
                                  const roleWorks = displayWorks.filter(
                                    (w) => w.roleId === role.id || w.roleName === role.name
                                  );
                                  const inc = roleWorks.reduce((a, b) => a + b.income, 0);
                                  const exp = roleWorks.reduce((a, b) => a + b.expense, 0);
                                  const bon = roleWorks.reduce((a, b) => a + b.bonus, 0);
                                  const adv = roleWorks.reduce((a, b) => a + b.advance, 0);
                                  const net = inc + bon - exp - adv;

                                  return (
                                    <tr
                                      key={role.id}
                                      onClick={() => {
                                        setEditRoleName(role.name);
                                        setEditRoleSect(role.sect);
                                        setEditRoleScore(String(role.score));
                                        setLayer1Sheet({ type: 'role-edit', role });
                                      }}
                                      className="hover:bg-[#f5f2eb] active:bg-[#ebe6dc] cursor-pointer transition-colors"
                                    >
                                      <td className="py-2 pl-2.5 pr-1 font-semibold text-[#3d3831] truncate">
                                        {role.name}
                                      </td>
                                      <td className="py-2 px-1 text-right text-[#6e665b]">
                                        {formatGoldCell(role.score)}
                                      </td>
                                      <td className="py-2 px-1 text-right text-[#3d3831]">
                                        {formatGoldCell(inc)}
                                      </td>
                                      <td className="py-2 px-1 text-right text-[#6e665b]">
                                        {formatGoldCell(exp)}
                                      </td>
                                      <td className="py-2 px-1 text-right text-[#6e665b]">
                                        {formatGoldCell(bon)}
                                      </td>
                                      <td
                                        className={`py-2 pl-1 pr-2.5 text-right font-bold ${
                                          net > 0
                                            ? 'text-[#526040]'
                                            : net < 0
                                            ? 'text-[#b87638]'
                                            : 'text-[#999083]'
                                        }`}
                                      >
                                        {formatGoldCell(net, true)}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================
                  4.8 小金库 (Piggy Bank / Vault Screen)
                 ========================================================= */}
              {activeScreen === 'vault' && (
                <div className="space-y-3.5">
                  <div className="p-1 bg-[#ebe6dc] rounded-xl border border-[#dfd8ca] grid grid-cols-3 gap-1 text-[11px]">
                    {[
                      { k: 'default', l: '当前水位 (28%)' },
                      { k: 'zero', l: '0金态 (睡觉猫)' },
                      { k: 'full', l: '100%满额 (气球猫)' },
                    ].map((m) => (
                      <button
                        key={m.k}
                        onClick={() => setVaultZeroDemo(m.k as any)}
                        className={`py-1 rounded-lg font-medium ${
                          vaultZeroDemo === m.k
                            ? 'bg-[#fcfbf7] text-[#966922] shadow-xs font-semibold'
                            : 'text-[#6e665b]'
                        }`}
                      >
                        {m.l}
                      </button>
                    ))}
                  </div>

                  {/* 顶部大圆罐卡片 */}
                  <div className="warm-hero-banner p-4 flex flex-col items-center text-center">
                    <div className="relative flex items-center justify-center my-1">
                      <div className="w-[116px] h-[116px] rounded-full bg-[#faf5e8] border-[3px] border-[#d8c296] shadow-[0_8px_24px_rgba(184,134,56,0.22)] relative overflow-hidden flex flex-col items-center justify-center">
                        <div
                          className="vault-wave-fill"
                          style={{ height: `${vaultPercent}%` }}
                        />
                        <span className="relative z-10 text-[22px] font-bold text-[#5c4216] num-tabular">
                          {vaultTarget > 0 ? `${vaultPercent}%` : '—'}
                        </span>
                        <span className="relative z-10 text-[11px] font-medium text-[#755520]">
                          小金库水位
                        </span>
                      </div>

                      {(effectiveVaultTotal === 0 || vaultPercent >= 100) && (
                        <div className="ml-3 flex flex-col items-center">
                          <WatercolorCat
                            id={effectiveVaultTotal === 0 ? 'sleep' : 'balloon'}
                            size={76}
                          />
                          <span className="text-[11px] text-[#966922] font-semibold mt-0.5">
                            {effectiveVaultTotal === 0 ? '0金呼呼大睡中' : '目标达成啦！'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-[25px] font-bold text-[#755520] num-tabular leading-tight">
                      {effectiveVaultTotal} <span className="text-[14px] font-semibold">金</span>
                    </div>
                    <div className="text-[12px] text-[#6e665b] mt-1 num-tabular">
                      目标 {vaultTarget} 金 · 还差 {Math.max(0, vaultTarget - effectiveVaultTotal)} 金
                    </div>

                    <div className="mt-3 w-full px-3 py-2 rounded-[12px] bg-[#fcfbf7]/80 border border-[#dfd2ba] text-[12px] text-[#755520] num-tabular flex items-center justify-around">
                      <span>自动 {autoVaultSum}</span>
                      <span>·</span>
                      <span>手动存 {manualDepositSum}</span>
                      <span>·</span>
                      <span>手动取 {manualWithdrawSum}</span>
                    </div>

                    <div className="mt-3.5 w-full grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => {
                          setVaultFormAmount('100000');
                          setVaultFormNote('');
                          setLayer1Sheet({ type: 'vault-deposit', mode: 'deposit' });
                        }}
                        className="h-10 rounded-[12px] bg-[#6f7d5c] text-[#fcfbf7] text-[14px] font-semibold shadow-xs active:scale-95"
                      >
                        ＋ 存一笔
                      </button>
                      <button
                        onClick={() => {
                          setVaultFormAmount('50000');
                          setVaultFormNote('');
                          setLayer1Sheet({ type: 'vault-deposit', mode: 'withdraw' });
                        }}
                        className="h-10 rounded-[12px] bg-[#fcfbf7] text-[#755520] border border-[#d8c296] text-[14px] font-semibold active:scale-95"
                      >
                        － 取一笔
                      </button>
                    </div>
                  </div>

                  {/* 设置两行 */}
                  <div className="bg-[#fcfbf7] rounded-[18px] border border-[#e5dfd3] divide-y divide-[#e5dfd3] overflow-hidden">
                    <button
                      onClick={() => {
                        setVaultConfigVal(String(vaultTarget));
                        setLayer1Sheet({ type: 'vault-config', field: 'target' });
                      }}
                      className="w-full px-3.5 py-3 flex items-center justify-between text-left hover:bg-[#f7f4ed]"
                    >
                      <span className="text-[14px] font-medium text-[#3d3831]">小金库目标</span>
                      <span className="text-[14px] font-semibold text-[#966922] num-tabular">
                        {vaultTarget} 金 →
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setVaultConfigVal(String(vaultThreshold));
                        setLayer1Sheet({ type: 'vault-config', field: 'threshold' });
                      }}
                      className="w-full px-3.5 py-3 flex items-center justify-between text-left hover:bg-[#f7f4ed]"
                    >
                      <div>
                        <div className="text-[14px] font-medium text-[#3d3831]">自动入库阈值</div>
                        <div className="text-[11px] text-[#999083]">
                          打工单笔净赚 ≥ 阈值时，该笔全额自动计入小金库
                        </div>
                      </div>
                      <span className="text-[14px] font-semibold text-[#966922] num-tabular shrink-0">
                        ≥ {vaultThreshold} 金 →
                      </span>
                    </button>
                  </div>

                  {/* 自动入库明细 */}
                  <div className="bg-[#fcfbf7] rounded-[18px] border border-[#e5dfd3] p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[14px] font-semibold text-[#3d3831]">
                        自动入库明细 ({autoVaultRecords.length}笔)
                      </span>
                      <span className="text-[11px] text-[#999083]">净赚 ≥ {vaultThreshold} 全额</span>
                    </div>
                    {autoVaultRecords.length === 0 ? (
                      <div className="py-4 text-center text-[12px] text-[#999083]">
                        暂无达到阈值的打工记录
                      </div>
                    ) : (
                      <div className="divide-y divide-[#e5dfd3]">
                        {autoVaultRecords.map((w) => {
                          const net = calcWorkNet(w);
                          return (
                            <div
                              key={w.id}
                              className="py-2.5 flex items-center justify-between text-[13px]"
                            >
                              <div className="min-w-0">
                                <div className="font-semibold text-[#3d3831] truncate">
                                  {w.roleName} · {w.owner}
                                </div>
                                <div className="text-[11px] text-[#999083] num-tabular">
                                  {w.date} · {w.note}
                                </div>
                              </div>
                              <span className="font-bold text-[#966922] num-tabular shrink-0 ml-2">
                                +{net} 金
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 手动存取明细 */}
                  <div className="bg-[#fcfbf7] rounded-[18px] border border-[#e5dfd3] p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[14px] font-semibold text-[#3d3831]">
                        手动存取明细 ({manualVaults.length}笔)
                      </span>
                      <span className="text-[11px] text-[#999083]">可删除纠错</span>
                    </div>
                    <div className="divide-y divide-[#e5dfd3]">
                      {manualVaults.map((m) => (
                        <div
                          key={m.id}
                          className="py-2.5 flex items-center justify-between gap-2 text-[13px]"
                        >
                          <div className="min-w-0">
                            <div className="font-semibold text-[#3d3831] truncate">
                              {m.type === 'deposit' ? '手动存入' : '手动取出'} · {m.owner}
                            </div>
                            <div className="text-[11px] text-[#999083] truncate">
                              {m.date} · {m.note}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`font-bold num-tabular ${
                                m.type === 'deposit' ? 'text-[#526040]' : 'text-[#b87638]'
                              }`}
                            >
                              {m.type === 'deposit' ? `+${m.amount}` : `-${m.amount}`} 金
                            </span>
                            <button
                              onClick={() =>
                                setLayer2Sheet({
                                  type: 'confirm',
                                  title: '删除这笔手动存取？',
                                  desc: `${m.owner} 的 ${m.amount} 金记录删除后将重新计算小金库水位。`,
                                  danger: true,
                                  onConfirm: () => {
                                    setManualVaults((prev) =>
                                      prev.filter((item) => item.id !== m.id)
                                    );
                                    triggerToast('已删除该条存取记录');
                                  },
                                })
                              }
                              className="w-7 h-7 rounded-lg bg-[#f4e3e1] text-[#a85248] flex items-center justify-center"
                              aria-label="删除"
                            >
                              <LinearIcon name="trash" size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  4.9 设置 (Settings Screen)
                 ========================================================= */}
              {activeScreen === 'settings' && (
                <div className="space-y-3.5">
                  <div className="bg-[#fcfbf7] rounded-[20px] border border-[#e5dfd3] p-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#efe6d5] flex items-center justify-center">
                          <WatercolorCat id="wave" size={44} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[17px] font-bold text-[#3d3831]">
                              {currentUser}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-[#dce3d3] text-[#4e5b3e] text-[11px] font-semibold">
                              创建人/管理员
                            </span>
                          </div>
                          <div className="text-[12px] text-[#999083] mt-0.5">
                            免登录已生效 · 剩余 364 天
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => onSelectScreen('gate')}
                        className="h-8 px-3 rounded-[10px] bg-[#ebe6dc] border border-[#dfd8ca] text-[13px] font-medium text-[#3d3831] active:scale-95"
                      >
                        换人
                      </button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#e5dfd3] flex items-center justify-between">
                      <span className="text-[12px] text-[#6e665b]">
                        当前小团体共 {displayMembers.length} 人：{displayMembers.join('、')}
                      </span>
                      <button
                        onClick={() => {
                          const nextName = `伙伴${members.length + 1}`;
                          setMembers((prev) => [...prev, nextName]);
                          triggerToast(`已新增成员「${nextName}」，打工统计表已自动增行`);
                        }}
                        className="text-[12px] text-[#9e473c] font-semibold shrink-0 ml-2"
                      >
                        ＋模拟加人
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#fcfbf7] rounded-[20px] border border-[#e5dfd3] p-4 shadow-xs">
                    <div className="text-[13px] font-semibold text-[#3d3831]">家庭码</div>
                    <div className="text-[11px] text-[#999083] mt-0.5">
                      新伙伴打开 App 填这个码就能进同一个账本
                    </div>
                    <div className="mt-3 p-3 rounded-[12px] bg-[#f7f4ed] border border-[#dfd8ca] flex items-center justify-between">
                      <span className="text-[22px] font-mono font-bold tracking-[0.22em] text-[#3d3831]">
                        {familyCode}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => triggerToast(`已复制家庭码：${familyCode}`)}
                          className="h-8 px-3 rounded-[9px] bg-[#fcfbf7] border border-[#dfd8ca] text-[12px] font-medium text-[#3d3831] flex items-center gap-1"
                        >
                          <LinearIcon name="copy" size={14} />
                          <span>复制</span>
                        </button>
                        <button
                          onClick={() => {
                            const codes = ['F9H2X8', 'M3C7V5', 'K7M9P2', 'T6B8N4'];
                            const next =
                              codes[(codes.indexOf(familyCode) + 1) % codes.length];
                            setFamilyCode(next);
                            triggerToast(`已更换家庭码为 ${next}`);
                          }}
                          className="h-8 px-2.5 rounded-[9px] bg-[#dce3d3] text-[#4e5b3e] text-[12px] font-semibold"
                        >
                          改一个
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#fcfbf7] rounded-[20px] border border-[#e5dfd3] p-4 shadow-xs space-y-2.5">
                    <div className="text-[13px] font-semibold text-[#3d3831]">数据安全</div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => triggerToast('已导出 JSON 备份文件')}
                        className="h-10 rounded-[12px] bg-[#f7f4ed] border border-[#dfd8ca] text-[13px] font-medium text-[#3d3831] active:scale-95"
                      >
                        导出备份
                      </button>
                      <button
                        onClick={() => triggerToast('已校验并导入最新备份')}
                        className="h-10 rounded-[12px] bg-[#f7f4ed] border border-[#dfd8ca] text-[13px] font-medium text-[#3d3831] active:scale-95"
                      >
                        导入备份
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#fcfbf7] rounded-[20px] border border-[#e5dfd3] p-4 shadow-xs space-y-2 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-[#6e665b]">当前版本</span>
                      <span className="font-medium num-tabular">v2.4.0 (单文件 82KB)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6e665b]">服务器节点</span>
                      <span className="font-mono text-[12px] text-[#3d3831]">
                        http://43.129.77.222 (HK)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6e665b]">同步状态</span>
                      <span className="text-[#526040] font-semibold">实时同步正常 (RTT 240ms)</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 右下角 56px 浮动记一笔按钮 (采用鼠尾草橄榄绿暖质感) */}
        {['leave', 'expense', 'work', 'play'].includes(activeScreen) && (
          <button
            onClick={() => {
              if (activeScreen === 'leave') {
                setLeaveFormOwner(currentUser);
                setLeaveFormError('');
                setLayer1Sheet({ type: 'leave-form' });
              } else if (activeScreen === 'expense') {
                setExpFormOwner(currentUser);
                setExpFormError('');
                setLayer1Sheet({ type: 'expense-form' });
              } else if (activeScreen === 'work') {
                setWkFormOwner(currentUser);
                setLayer1Sheet({ type: 'work-form' });
              } else if (activeScreen === 'play') {
                setPlFormOwner(currentUser);
                setLayer1Sheet({ type: 'play-form' });
              }
            }}
            aria-label="记一笔"
            className="absolute right-4 bottom-5 w-[56px] h-[56px] rounded-full bg-[#6f7d5c] hover:bg-[#5d6a4c] text-[#fcfbf7] shadow-[0_10px_24px_rgba(82,96,64,0.34)] flex items-center justify-center active:scale-90 transition-transform z-20"
          >
            <LinearIcon name="plus" size={26} />
          </button>
        )}

        {/* =================================================================
            4.10 ~ 4.12 三个全局可叠浮层 (物理定律 #3: 层级 = 60 + 2n)
           ================================================================= */}
        {layer1Sheet && (
          <div
            style={{ zIndex: 60 }}
            className="absolute inset-0 bg-[#3d3831]/40 flex flex-col justify-end"
            onClick={() => setLayer1Sheet(null)}
          >
            <div
              style={{ zIndex: 62 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-h-[86%] bg-[#fcfbf7] rounded-t-[22px] border-t border-[#e5dfd3] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="pt-2.5 pb-2 px-4 border-b border-[#e5dfd3] flex items-center justify-between shrink-0">
                <span className="text-[16px] font-bold text-[#3d3831]">
                  {layer1Sheet.type === 'leave-form' && '记一笔请假'}
                  {layer1Sheet.type === 'expense-form' && '记一笔消费'}
                  {layer1Sheet.type === 'work-form' && '记一笔打工'}
                  {layer1Sheet.type === 'play-form' && '记一笔娱乐时长'}
                  {layer1Sheet.type === 'vault-deposit' &&
                    (layer1Sheet.mode === 'deposit' ? '手动存入小金库' : '从小金库手动取出')}
                  {layer1Sheet.type === 'vault-config' &&
                    (layer1Sheet.field === 'target' ? '修改小金库目标' : '修改自动入库阈值')}
                  {layer1Sheet.type === 'role-edit' && `编辑角色 · ${layer1Sheet.role.name}`}
                  {layer1Sheet.type === 'record-detail' && '记录详情'}
                </span>
                <button
                  onClick={() => setLayer1Sheet(null)}
                  className="w-7 h-7 rounded-full bg-[#ebe6dc] text-[#6e665b] flex items-center justify-center"
                >
                  <LinearIcon name="close" size={16} />
                </button>
              </div>

              <div className="p-4 overflow-y-auto space-y-3.5 text-[14px]">
                {/* 请假表单 */}
                {layer1Sheet.type === 'leave-form' && (
                  <>
                    <div>
                      <label className="block text-[12px] font-semibold text-[#6e665b] mb-1.5">
                        请假类型 (.seg 全局托管分段控件)
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#ebe6dc] rounded-[12px]">
                        {(['外出', '聚餐', '其他'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setLeaveFormType(t)}
                            className={`py-1.5 rounded-[9px] text-[13px] font-medium ${
                              leaveFormType === t
                                ? 'bg-[#fcfbf7] text-[#526040] font-semibold shadow-xs'
                                : 'text-[#6e665b]'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-[#6e665b] mb-1">
                        日期 <span className="text-[#9e473c]">*</span>
                      </label>
                      <input
                        type="text"
                        value={leaveFormDate}
                        onChange={(e) => setLeaveFormDate(e.target.value)}
                        className="w-full h-10 px-3 rounded-[12px] bg-[#f7f4ed] border border-[#dfd8ca] text-[#3d3831] num-tabular"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-[#6e665b] mb-1">
                        请假事由 <span className="text-[#9e473c]">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={leaveFormReason}
                        onChange={(e) => {
                          setLeaveFormReason(e.target.value);
                          setLeaveFormError('');
                        }}
                        placeholder="写一下去哪儿、大概几点回来…"
                        className={`w-full p-3 rounded-[12px] bg-[#f7f4ed] border text-[#3d3831] focus:outline-none focus:bg-white ${
                          leaveFormError ? 'border-[#a85248]' : 'border-[#dfd8ca]'
                        }`}
                      />
                      {leaveFormError && (
                        <p className="text-[12px] text-[#a85248] mt-1">{leaveFormError}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-[#6e665b] mb-1.5">
                        谁记的 (.seg 成员分段)
                      </label>
                      <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#ebe6dc] rounded-[12px]">
                        {displayMembers.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setLeaveFormOwner(m)}
                            className={`px-3 py-1 rounded-[8px] text-[12px] font-medium ${
                              leaveFormOwner === m
                                ? 'bg-[#fcfbf7] text-[#526040] font-semibold shadow-xs'
                                : 'text-[#6e665b]'
                            }`}
                          >
                            {m === currentUser ? `${m}（我）` : m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!leaveFormReason.trim()) {
                          setLeaveFormError('请填写请假事由后再提交');
                          return;
                        }
                        setLeaves((prev) => [
                          {
                            id: `lv-${Date.now()}`,
                            type: leaveFormType,
                            status: 'wait',
                            owner: leaveFormOwner,
                            date: leaveFormDate,
                            timeText: '刚刚',
                            reason: leaveFormReason.trim(),
                          },
                          ...prev,
                        ]);
                        setLeaveFormReason('');
                        setLayer1Sheet(null);
                        triggerToast('已提交请假，等待伙伴审批');
                      }}
                      className="w-full h-11 rounded-[12px] bg-[#6f7d5c] text-[#fcfbf7] font-semibold"
                    >
                      提交请假
                    </button>
                  </>
                )}

                {/* 消费表单 */}
                {layer1Sheet.type === 'expense-form' && (
                  <>
                    <div>
                      <label className="block text-[12px] font-semibold text-[#6e665b] mb-1">
                        消费金额 (元) <span className="text-[#9e473c]">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={expFormAmount}
                        onChange={(e) => {
                          setExpFormAmount(e.target.value);
                          setExpFormError('');
                        }}
                        placeholder="0.00"
                        className="w-full h-11 px-3 rounded-[12px] bg-[#f7f4ed] border border-[#dfd8ca] text-[18px] font-bold num-tabular text-[#9e473c]"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-[#6e665b] mb-1.5">
                        分类 (.seg)
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#ebe6dc] rounded-[12px]">
                        {(['外观', '其他'] as const).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setExpFormCategory(c)}
                            className={`py-1.5 rounded-[9px] text-[13px] font-medium ${
                              expFormCategory === c
                                ? 'bg-[#fcfbf7] text-[#9e473c] font-semibold shadow-xs'
                                : 'text-[#6e665b]'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-[#6e665b] mb-1">
                        商家名称 <span className="text-[#9e473c]">*</span>
                      </label>
                      <input
                        type="text"
                        value={expFormMerchant}
                        onChange={(e) => setExpFormMerchant(e.target.value)}
                        placeholder="例如：万宝楼、喜茶、淘宝"
                        className="w-full h-10 px-3 rounded-[12px] bg-[#f7f4ed] border border-[#dfd8ca]"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-[#6e665b] mb-1">
                        备注说明
                      </label>
                      <textarea
                        rows={2}
                        value={expFormNote}
                        onChange={(e) => setExpFormNote(e.target.value)}
                        placeholder="写一下买了什么…"
                        className="w-full p-3 rounded-[12px] bg-[#f7f4ed] border border-[#dfd8ca]"
                      />
                      {expFormError && (
                        <p className="text-[12px] text-[#a85248] mt-1">{expFormError}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-[#6e665b] mb-1.5">
                        谁记的 (.seg)
                      </label>
                      <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#ebe6dc] rounded-[12px]">
                        {displayMembers.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setExpFormOwner(m)}
                            className={`px-3 py-1 rounded-[8px] text-[12px] font-medium ${
                              expFormOwner === m
                                ? 'bg-[#fcfbf7] text-[#9e473c] font-semibold shadow-xs'
                                : 'text-[#6e665b]'
                            }`}
                          >
                            {m === currentUser ? `${m}（我）` : m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const amt = parseFloat(expFormAmount);
                        if (isNaN(amt) || amt <= 0 || !expFormMerchant.trim()) {
                          setExpFormError('请填写大于 0 的金额和商家名称');
                          return;
                        }
                        setExpenses((prev) => [
                          {
                            id: `ex-${Date.now()}`,
                            amount: amt,
                            category: expFormCategory,
                            merchant: expFormMerchant.trim(),
                            status: 'wait',
                            owner: expFormOwner,
                            date: '10-19',
                            timeText: '刚刚',
                            note: expFormNote.trim() || '日常消费报备',
                          },
                          ...prev,
                        ]);
                        setExpFormAmount('');
                        setExpFormMerchant('');
                        setExpFormNote('');
                        setLayer1Sheet(null);
                        triggerToast('已提交消费申请');
                      }}
                      className="w-full h-11 rounded-[12px] bg-[#9e473c] text-[#fcfbf7] font-semibold"
                    >
                      提交消费审批
                    </button>
                  </>
                )}

                {/* 打工记一笔表单 */}
                {layer1Sheet.type === 'work-form' &&
                  (() => {
                    const selectedRole =
                      roles.find((r) => r.id === wkFormRoleId) || roles[0];
                    const sectInfo = SECT_MAP[selectedRole.sect];
                    const liveNet =
                      (Number(wkFormIncome) || 0) +
                      (wkFormShowBonus ? Number(wkFormBonus) || 0 : 0) -
                      (Number(wkFormExpense) || 0) -
                      (wkFormShowAdvance ? Number(wkFormAdvance) || 0 : 0);

                    return (
                      <>
                        <div>
                          <label className="block text-[12px] font-semibold text-[#6e665b] mb-1">
                            出战角色（点击打开第2层叠层角色选择器）
                          </label>
                          <button
                            type="button"
                            onClick={() => setLayer2Sheet({ type: 'role-picker' })}
                            style={{
                              backgroundColor: sectInfo.softBg,
                              borderColor: sectInfo.rail,
                              color: sectInfo.color,
                            }}
                            className="w-full h-11 px-3.5 rounded-[12px] border flex items-center justify-between font-semibold"
                          >
                            <span>
                              [{SECT_SHORT_LABEL[selectedRole.sect]}] {selectedRole.name}（装分{' '}
                              {selectedRole.score}）
                            </span>
                            <span className="text-[12px]">更换角色 →</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[12px] font-semibold text-[#6e665b] mb-1">
                              收入 (金)
                            </label>
                            <input
                              type="number"
                              value={wkFormIncome}
                              onChange={(e) => setWkFormIncome(e.target.value)}
                              className="w-full h-10 px-3 rounded-[12px] bg-[#f7f4ed] border border-[#dfd8ca] num-tabular font-semibold text-[#526040]"
                            />
                          </div>
                          <div>
                            <label className="block text-[12px] font-semibold text-[#6e665b] mb-1">
                              支出 (金)
                            </label>
                            <input
                              type="number"
                              value={wkFormExpense}
                              onChange={(e) => setWkFormExpense(e.target.value)}
                              className="w-full h-10 px-3 rounded-[12px] bg-[#f7f4ed] border border-[#dfd8ca] num-tabular font-semibold text-[#b87638]"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!wkFormShowBonus && (
                            <button
                              type="button"
                              onClick={() => {
                                setWkFormShowBonus(true);
                                setWkFormBonus('2000');
                              }}
                              className="px-3 py-1.5 rounded-full bg-[#ebe6dc] border border-[#dfd8ca] text-[12px] font-medium text-[#6e665b]"
                            >
                              ＋ 分红
                            </button>
                          )}
                          {!wkFormShowAdvance && (
                            <button
                              type="button"
                              onClick={() => {
                                setWkFormShowAdvance(true);
                                setWkFormAdvance('1000');
                              }}
                              className="px-3 py-1.5 rounded-full bg-[#ebe6dc] border border-[#dfd8ca] text-[12px] font-medium text-[#6e665b]"
                            >
                              ＋ 代付
                            </button>
                          )}
                        </div>

                        {wkFormShowBonus && (
                          <div className="p-2.5 rounded-[12px] bg-[#ebe6dc] flex items-center justify-between gap-2">
                            <span className="text-[12px] font-semibold text-[#3d3831] shrink-0">
                              额外分红
                            </span>
                            <input
                              type="number"
                              value={wkFormBonus}
                              onChange={(e) => setWkFormBonus(e.target.value)}
                              className="flex-1 h-8 px-2.5 rounded-[8px] bg-[#fcfbf7] border border-[#dfd8ca] num-tabular text-right"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setWkFormShowBonus(false);
                                setWkFormBonus('0');
                              }}
                              className="text-[12px] text-[#a85248] font-medium shrink-0"
                            >
                              删除
                            </button>
                          </div>
                        )}

                        {wkFormShowAdvance && (
                          <div className="p-2.5 rounded-[12px] bg-[#ebe6dc] flex items-center justify-between gap-2">
                            <span className="text-[12px] font-semibold text-[#3d3831] shrink-0">
                              替人代付
                            </span>
                            <input
                              type="number"
                              value={wkFormAdvance}
                              onChange={(e) => setWkFormAdvance(e.target.value)}
                              className="flex-1 h-8 px-2.5 rounded-[8px] bg-[#fcfbf7] border border-[#dfd8ca] num-tabular text-right"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setWkFormShowAdvance(false);
                                setWkFormAdvance('0');
                              }}
                              className="text-[12px] text-[#a85248] font-medium shrink-0"
                            >
                              删除
                            </button>
                          </div>
                        )}

                        <div>
                          <label className="block text-[12px] font-semibold text-[#6e665b] mb-1.5">
                            特殊掉落标签
                          </label>
                          <div className="flex gap-2">
                            {(['精简', '玄晶'] as const).map((tag) => {
                              const active = wkFormDrops.includes(tag);
                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() =>
                                    setWkFormDrops((prev) =>
                                      prev.includes(tag)
                                        ? prev.filter((i) => i !== tag)
                                        : [...prev, tag]
                                    )
                                  }
                                  className={`px-3.5 py-1.5 rounded-[10px] text-[12px] font-semibold border transition-colors ${
                                    active
                                      ? tag === '玄晶'
                                        ? 'bg-[#f5ebd6] text-[#966922] border-[#c89648]'
                                        : 'bg-[#e3e8ec] text-[#495a68] border-[#6b7d8c]'
                                      : 'bg-[#ebe6dc] text-[#6e665b] border-[#dfd8ca]'
                                  }`}
                                >
                                  {active ? `✓ ${tag}` : tag}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#e5dfd3] flex items-center justify-between">
                          <div>
                            <div className="text-[11px] text-[#6e665b]">实时计算净赚</div>
                            <div
                              className={`text-[20px] font-bold num-tabular ${
                                liveNet >= 0 ? 'text-[#526040]' : 'text-[#b87638]'
                              }`}
                            >
                              {liveNet >= 0 ? `+${liveNet}` : liveNet} 金
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setWorks((prev) => [
                                {
                                  id: `wk-${Date.now()}`,
                                  owner: wkFormOwner,
                                  roleId: selectedRole.id,
                                  roleName: selectedRole.name,
                                  sect: selectedRole.sect,
                                  income: Number(wkFormIncome) || 0,
                                  expense: Number(wkFormExpense) || 0,
                                  bonus: wkFormShowBonus ? Number(wkFormBonus) || 0 : 0,
                                  advance: wkFormShowAdvance ? Number(wkFormAdvance) || 0 : 0,
                                  drops: wkFormDrops,
                                  date: '10-19',
                                  timeText: '刚刚',
                                  period: 'week',
                                  note: wkFormNote.trim() || '25人英雄本工资结算',
                                },
                                ...prev,
                              ]);
                              setLayer1Sheet(null);
                              triggerToast(
                                `已记一笔打工：${liveNet >= 0 ? `+${liveNet}` : liveNet} 金`
                              );
                            }}
                            className="h-11 px-6 rounded-[12px] bg-[#6f7d5c] text-[#fcfbf7] font-semibold"
                          >
                            保存账单
                          </button>
                        </div>
                      </>
                    );
                  })()}

                {/* 娱乐时长表单 */}
                {layer1Sheet.type === 'play-form' && (
                  <>
                    <div>
                      <label className="block text-[12px] font-semibold text-[#6e665b] mb-1.5">
                        游戏项目 (.seg)
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#ebe6dc] rounded-[12px]">
                        {(['三角洲', '剑三', '其他'] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setPlFormGame(g)}
                            className={`py-1.5 rounded-[9px] text-[13px] font-medium ${
                              plFormGame === g
                                ? 'bg-[#fcfbf7] text-[#495a68] font-semibold shadow-xs'
                                : 'text-[#6e665b]'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[12px] font-semibold text-[#6e665b] mb-1">
                          日期
                        </label>
                        <input
                          type="text"
                          value={plFormDate}
                          onChange={(e) => setPlFormDate(e.target.value)}
                          className="w-full h-10 px-3 rounded-[12px] bg-[#f7f4ed] border border-[#dfd8ca] num-tabular"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-[#6e665b] mb-1">
                          时长 (小时)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={plFormHours}
                          onChange={(e) => setPlFormHours(e.target.value)}
                          className="w-full h-10 px-3 rounded-[12px] bg-[#f7f4ed] border border-[#dfd8ca] num-tabular font-bold text-[#495a68]"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setPlays((prev) => [
                          {
                            id: `pl-${Date.now()}`,
                            game: plFormGame,
                            hours: parseFloat(plFormHours) || 1,
                            owner: plFormOwner,
                            date: plFormDate,
                            timeText: '刚刚',
                            period: 'week',
                            note: plFormNote.trim() || '日常娱乐打卡',
                          },
                          ...prev,
                        ]);
                        setLayer1Sheet(null);
                        triggerToast('已记录娱乐时长');
                      }}
                      className="w-full h-11 rounded-[12px] bg-[#6b7d8c] text-[#fcfbf7] font-semibold"
                    >
                      保存记录
                    </button>
                  </>
                )}

                {/* 小金库手动存取弹层 */}
                {layer1Sheet.type === 'vault-deposit' && (
                  <>
                    <div>
                      <label className="block text-[12px] font-semibold text-[#6e665b] mb-1">
                        {layer1Sheet.mode === 'deposit' ? '存入金额 (金)' : '取出金额 (金)'}
                      </label>
                      <input
                        type="number"
                        value={vaultFormAmount}
                        onChange={(e) => setVaultFormAmount(e.target.value)}
                        className="w-full h-11 px-3 rounded-[12px] bg-[#f7f4ed] border border-[#dfd8ca] text-[19px] font-bold num-tabular text-[#966922]"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-[#6e665b] mb-1">
                        备注说明
                      </label>
                      <input
                        type="text"
                        value={vaultFormNote}
                        onChange={(e) => setVaultFormNote(e.target.value)}
                        placeholder="写一下存取原因…"
                        className="w-full h-10 px-3 rounded-[12px] bg-[#f7f4ed] border border-[#dfd8ca]"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const amt = Math.max(1, Number(vaultFormAmount) || 0);
                        setManualVaults((prev) => [
                          {
                            id: `mv-${Date.now()}`,
                            type: layer1Sheet.mode,
                            amount: amt,
                            owner: currentUser,
                            date: '10-19',
                            note:
                              vaultFormNote.trim() ||
                              (layer1Sheet.mode === 'deposit' ? '手动存入金库' : '手动支取使用'),
                          },
                          ...prev,
                        ]);
                        setLayer1Sheet(null);
                        triggerToast(
                          layer1Sheet.mode === 'deposit'
                            ? `已存入 ${amt} 金`
                            : `已取出 ${amt} 金`
                        );
                      }}
                      className="w-full h-11 rounded-[12px] bg-[#6f7d5c] text-[#fcfbf7] font-semibold"
                    >
                      确认{layer1Sheet.mode === 'deposit' ? '存入' : '取出'}
                    </button>
                  </>
                )}

                {/* 小金库目标/阈值设置弹层 */}
                {layer1Sheet.type === 'vault-config' && (
                  <>
                    <div>
                      <label className="block text-[12px] font-semibold text-[#6e665b] mb-1">
                        {layer1Sheet.field === 'target'
                          ? '新目标金额 (金，真数不缩写)'
                          : '单笔自动入库净赚阈值 (金)'}
                      </label>
                      <input
                        type="number"
                        value={vaultConfigVal}
                        onChange={(e) => setVaultConfigVal(e.target.value)}
                        className="w-full h-11 px-3 rounded-[12px] bg-[#f7f4ed] border border-[#dfd8ca] text-[18px] font-bold num-tabular text-[#966922]"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const val = Math.max(1000, Number(vaultConfigVal) || 0);
                        if (layer1Sheet.field === 'target') {
                          setVaultTarget(val);
                          triggerToast(`已更新小金库目标为 ${val} 金`);
                        } else {
                          setVaultThreshold(val);
                          triggerToast(`已更新自动入库阈值为 ${val} 金`);
                        }
                        setLayer1Sheet(null);
                      }}
                      className="w-full h-11 rounded-[12px] bg-[#6f7d5c] text-[#fcfbf7] font-semibold"
                    >
                      保存设置
                    </button>
                  </>
                )}

                {/* 角色编辑弹层 */}
                {layer1Sheet.type === 'role-edit' && (
                  <>
                    <div>
                      <label className="block text-[12px] font-semibold text-[#6e665b] mb-1">
                        角色名字
                      </label>
                      <input
                        type="text"
                        value={editRoleName}
                        onChange={(e) => setEditRoleName(e.target.value)}
                        className="w-full h-10 px-3 rounded-[12px] bg-[#f7f4ed] border border-[#dfd8ca]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[12px] font-semibold text-[#6e665b] mb-1">
                          所属门派
                        </label>
                        <select
                          value={editRoleSect}
                          onChange={(e) => setEditRoleSect(e.target.value as SectKey)}
                          className="w-full h-10 px-3 rounded-[12px] bg-[#f7f4ed] border border-[#dfd8ca]"
                        >
                          <option value="xiu">七秀</option>
                          <option value="ge">长歌</option>
                          <option value="du">五毒</option>
                          <option value="hua">万花</option>
                          <option value="yao">药宗</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-[#6e665b] mb-1">
                          装分
                        </label>
                        <input
                          type="number"
                          value={editRoleScore}
                          onChange={(e) => setEditRoleScore(e.target.value)}
                          className="w-full h-10 px-3 rounded-[12px] bg-[#f7f4ed] border border-[#dfd8ca] num-tabular"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          setLayer2Sheet({
                            type: 'confirm',
                            title: `删除角色「${layer1Sheet.role.name}」？`,
                            desc: '删除后该角色将从角色管理名册中移除（第2层叠层确认框，z-index = 64）。',
                            danger: true,
                            onConfirm: () => {
                              setRoles((prev) =>
                                prev.filter((r) => r.id !== layer1Sheet.role.id)
                              );
                              setLayer1Sheet(null);
                              triggerToast(`已删除角色：${layer1Sheet.role.name}`);
                            },
                          })
                        }
                        className="h-10 rounded-[12px] bg-[#f4e3e1] text-[#a85248] font-semibold"
                      >
                        删除角色
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRoles((prev) =>
                            prev.map((r) =>
                              r.id === layer1Sheet.role.id
                                ? {
                                    ...r,
                                    name: editRoleName.trim() || r.name,
                                    sect: editRoleSect,
                                    score: Number(editRoleScore) || r.score,
                                  }
                                : r
                            )
                          );
                          setLayer1Sheet(null);
                          triggerToast('角色信息已更新');
                        }}
                        className="h-10 rounded-[12px] bg-[#6f7d5c] text-[#fcfbf7] font-semibold"
                      >
                        保存修改
                      </button>
                    </div>
                  </>
                )}

                {/* 通用记录详情弹层 */}
                {layer1Sheet.type === 'record-detail' && (
                  <>
                    <div className="p-3 rounded-[12px] bg-[#f5f2eb] space-y-2 text-[13px]">
                      <div className="flex justify-between">
                        <span className="text-[#6e665b]">记录归属人</span>
                        <span className="font-semibold text-[#3d3831]">
                          {layer1Sheet.item.owner}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6e665b]">记录时间</span>
                        <span className="num-tabular">
                          {layer1Sheet.item.date} {layer1Sheet.item.timeText}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-[#e5dfd3]">
                        <div className="text-[#6e665b] mb-1">完整备注/事由：</div>
                        <div className="text-[#3d3831] font-medium">
                          {layer1Sheet.item.reason || layer1Sheet.item.note || '无'}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-2">
                      <button
                        onClick={() =>
                          setLayer2Sheet({
                            type: 'confirm',
                            title: '确认删除这条记录？',
                            desc: '删除后全团共享账本将同步移除此条目（第2层叠层确认框）。',
                            danger: true,
                            onConfirm: () => {
                              const id = layer1Sheet.item.id;
                              if (layer1Sheet.module === 'leave')
                                setLeaves((p) => p.filter((x) => x.id !== id));
                              if (layer1Sheet.module === 'expense')
                                setExpenses((p) => p.filter((x) => x.id !== id));
                              if (layer1Sheet.module === 'work')
                                setWorks((p) => p.filter((x) => x.id !== id));
                              if (layer1Sheet.module === 'play')
                                setPlays((p) => p.filter((x) => x.id !== id));
                              setLayer1Sheet(null);
                              triggerToast('记录已删除');
                            },
                          })
                        }
                        className="h-10 rounded-[12px] bg-[#f4e3e1] text-[#a85248] font-semibold"
                      >
                        删除记录
                      </button>
                      <button
                        onClick={() => setLayer1Sheet(null)}
                        className="h-10 rounded-[12px] bg-[#ebe6dc] text-[#3d3831] font-semibold"
                      >
                        知道了
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 第 2 层可叠浮层: z-index 64 (遮罩) + 66 (面板) */}
        {layer2Sheet && (
          <div
            style={{ zIndex: 64 }}
            className="absolute inset-0 bg-[#3d3831]/45 flex flex-col justify-end"
            onClick={() => setLayer2Sheet(null)}
          >
            {layer2Sheet.type === 'role-picker' ? (
              <div
                style={{ zIndex: 66 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-h-[75%] bg-[#fcfbf7] rounded-t-[22px] p-4 shadow-2xl overflow-y-auto space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#e5dfd3] pb-2">
                  <div>
                    <div className="text-[15px] font-bold text-[#3d3831]">
                      选择角色（第2层叠层 · z-index: 64）
                    </div>
                    <div className="text-[11px] text-[#999083]">
                      按五大门派分组 · 选中后自动返回下层记账单
                    </div>
                  </div>
                  <button
                    onClick={() => setLayer2Sheet(null)}
                    className="w-7 h-7 rounded-full bg-[#ebe6dc] flex items-center justify-center"
                  >
                    <LinearIcon name="close" size={15} />
                  </button>
                </div>

                {(['xiu', 'ge', 'du', 'hua', 'yao'] as SectKey[]).map((sk) => {
                  const sRoles = roles.filter((r) => r.sect === sk);
                  if (sRoles.length === 0) return null;
                  const sInfo = SECT_MAP[sk];
                  return (
                    <div key={sk} className="space-y-1.5">
                      <div
                        style={{ color: sInfo.color }}
                        className="text-[12px] font-bold flex items-center gap-1.5"
                      >
                        <span>[{SECT_SHORT_LABEL[sk]}]</span>
                        <span>{sInfo.fullName}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {sRoles.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => {
                              setWkFormRoleId(r.id);
                              setLayer2Sheet(null);
                              triggerToast(`已选角色：${r.name}`);
                            }}
                            style={{
                              backgroundColor:
                                wkFormRoleId === r.id ? sInfo.softBg : '#f5f2eb',
                              borderColor:
                                wkFormRoleId === r.id ? sInfo.color : '#e5dfd3',
                            }}
                            className="p-2.5 rounded-[12px] border text-left"
                          >
                            <div className="text-[13px] font-semibold text-[#3d3831] truncate">
                              {r.name}
                            </div>
                            <div className="text-[11px] text-[#6e665b] num-tabular">
                              装分 {r.score}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{ zIndex: 66 }}
                onClick={(e) => e.stopPropagation()}
                className="m-4 mb-8 bg-[#fcfbf7] rounded-[20px] p-4 shadow-2xl border border-[#e5dfd3]"
              >
                <div className="text-[16px] font-bold text-[#3d3831]">{layer2Sheet.title}</div>
                <p className="text-[13px] text-[#6e665b] mt-1.5 leading-relaxed">
                  {layer2Sheet.desc}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setLayer2Sheet(null)}
                    className="h-10 rounded-[12px] bg-[#ebe6dc] text-[#3d3831] text-[14px] font-medium"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      layer2Sheet.onConfirm();
                      setLayer2Sheet(null);
                    }}
                    className={`h-10 rounded-[12px] text-[#fcfbf7] text-[14px] font-semibold ${
                      layer2Sheet.danger ? 'bg-[#a85248]' : 'bg-[#6f7d5c]'
                    }`}
                  >
                    确定删除
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 居中深褐胶囊轻提示 Toast */}
        {toastMsg && (
          <div
            style={{ zIndex: 80 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-[#332e28]/92 text-[#fcfbf7] text-[13px] font-medium shadow-lg whitespace-nowrap pointer-events-none"
          >
            {toastMsg}
          </div>
        )}
      </div>
    </div>
  );
};
