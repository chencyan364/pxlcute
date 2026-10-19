export type ApprovalStatus = 'wait' | 'pass' | 'reject';

export type SectKey = 'xiu' | 'ge' | 'du' | 'hua' | 'yao';

export interface SectMeta {
  key: SectKey;
  short: string;
  fullName: string;
  color: string;
  softBg: string;
  rail: string;
}

export const SECT_MAP: Record<SectKey, SectMeta> = {
  xiu: {
    key: 'xiu',
    short: '秀',
    fullName: '七秀',
    color: '#c2677f',
    softBg: '#fcedf1',
    rail: '#ebb8c6',
  },
  ge: {
    key: 'ge',
    short: '歌',
    fullName: '长歌',
    color: '#4f8d86',
    softBg: '#ecf6f5',
    rail: '#a8d4cf',
  },
  du: {
    key: 'du',
    short: '毒',
    fullName: '五毒',
    color: '#5f5aae',
    softBg: '#efeff9',
    rail: '#b7b4e2',
  },
  hua: {
    key: 'hua',
    short: 'hua',
    fullName: '万花',
    color: '#6f4a8a',
    softBg: '#f3eef7',
    rail: '#c3add4',
  },
  yao: {
    key: 'yao',
    short: '药',
    fullName: '药宗',
    color: '#6d8b47',
    softBg: '#f2f6ec',
    rail: '#bdd0a3',
  },
};

export const SECT_SHORT_LABEL: Record<SectKey, string> = {
  xiu: '秀',
  ge: '歌',
  du: '毒',
  hua: '花',
  yao: '药',
};

export interface LeaveRecord {
  id: string;
  type: '外出' | '聚餐' | '其他';
  status: ApprovalStatus;
  owner: string;
  date: string;
  timeText: string;
  reason: string;
  approver?: string;
  approvedAt?: string;
}

export interface ExpenseRecord {
  id: string;
  amount: number; // 人民币元，保留两位小数
  category: '外观' | '其他';
  merchant: string;
  status: ApprovalStatus;
  owner: string;
  date: string;
  timeText: string;
  note: string;
  approver?: string;
  approvedAt?: string;
}

export interface RoleRecord {
  id: string;
  name: string;
  sect: SectKey;
  score: number; // 装分
}

export interface WorkRecord {
  id: string;
  owner: string;
  roleId: string;
  roleName: string;
  sect: SectKey;
  income: number;
  expense: number;
  bonus: number;
  advance: number;
  drops: ('精简' | '玄晶')[];
  date: string;
  timeText: string;
  period: 'week' | 'month' | 'older';
  note: string;
}

export interface PlayRecord {
  id: string;
  game: '三角洲' | '剑三' | '其他';
  hours: number;
  owner: string;
  date: string;
  timeText: string;
  period: 'week' | 'month' | 'older';
  note: string;
}

export interface ManualVaultRecord {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  owner: string;
  date: string;
  note: string;
}

export const INITIAL_MEMBERS = ['小明', '阿璃', '团子', '沈舟'];

export const INITIAL_ROLES: RoleRecord[] = [
  { id: 'r1', name: '云裳小扇', sect: 'xiu', score: 268500 },
  { id: 'r2', name: '冰心碎月', sect: 'xiu', score: 274200 },
  { id: 'r3', name: '莫问青衫', sect: 'ge', score: 279100 },
  { id: 'r4', name: '相知鹿鸣', sect: 'ge', score: 261000 },
  { id: 'r5', name: '补天银蝶', sect: 'du', score: 271800 },
  { id: 'r6', name: '离经花间', sect: 'hua', score: 282400 },
  { id: 'r7', name: '灵素白芷', sect: 'yao', score: 266900 },
];

export const INITIAL_LEAVES: LeaveRecord[] = [
  {
    id: 'lv-1',
    type: '聚餐',
    status: 'wait',
    owner: '阿璃',
    date: '10-19',
    timeText: '今天 18:20',
    reason: '周六晚和大学室友去吃潮汕牛肉火锅，大概十点半回宿舍语音',
  },
  {
    id: 'lv-2',
    type: '外出',
    status: 'wait',
    owner: '小明',
    date: '10-20',
    timeText: '今天 14:05',
    reason: '下午去趟牙科诊所复查洗牙，晚饭前赶回来打本',
  },
  {
    id: 'lv-3',
    type: '外出',
    status: 'pass',
    owner: '团子',
    date: '10-16',
    timeText: '3天前',
    reason: '去漫展领场馆限定周边，晚上八点上线',
    approver: '小明',
    approvedAt: '10-16 11:30',
  },
  {
    id: 'lv-4',
    type: '其他',
    status: 'pass',
    owner: '沈舟',
    date: '10-12',
    timeText: '上周',
    reason: '家里宽带光猫升级换线，停网半天',
    approver: '阿璃',
    approvedAt: '10-12 09:45',
  },
  {
    id: 'lv-5',
    type: '聚餐',
    status: 'reject',
    owner: '团子',
    date: '10-09',
    timeText: '10天前',
    reason: '临时想去吃夜宵烧烤但当晚约好了开荒团',
    approver: '阿璃',
    approvedAt: '10-09 19:10',
  },
];

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'ex-1',
    amount: 288.0,
    category: '外观',
    merchant: '万宝楼·西山居',
    status: 'wait',
    owner: '阿璃',
    date: '10-19',
    timeText: '今天 19:12',
    note: '七秀新出的复刻白发盒子，蹲了好久终于降价啦',
  },
  {
    id: 'ex-2',
    amount: 45.0,
    category: '其他',
    merchant: '喜茶 GO 小程序',
    status: 'pass',
    owner: '小明',
    date: '10-17',
    timeText: '前天',
    note: '开荒打通全通本，请大家喝多肉葡萄两杯',
    approver: '阿璃',
    approvedAt: '10-17 22:18',
  },
  {
    id: 'ex-3',
    amount: 680.0,
    category: '外观',
    merchant: '咸鱼代售',
    status: 'reject',
    owner: '团子',
    date: '10-14',
    timeText: '5天前',
    note: '溢价太高的狐金披风，大家劝我冷静下个月再看',
    approver: '小明',
    approvedAt: '10-14 21:05',
  },
];

export const INITIAL_WORKS: WorkRecord[] = [
  {
    id: 'wk-1',
    owner: '小明',
    roleId: 'r3',
    roleName: '莫问青衫',
    sect: 'ge',
    income: 120000,
    expense: 15000,
    bonus: 5238,
    advance: 2500,
    drops: ['玄晶', '精简'],
    date: '10-19',
    timeText: '今天 21:40',
    period: 'week',
    note: '25人英雄冷龙峰全通，闪了大铁玄晶分了高额工资！',
  },
  {
    id: 'wk-2',
    owner: '阿璃',
    roleId: 'r1',
    roleName: '云裳小扇',
    sect: 'xiu',
    income: 58000,
    expense: 4500,
    bonus: 2000,
    advance: 0,
    drops: ['精简'],
    date: '10-18',
    timeText: '昨天 22:15',
    period: 'week',
    note: '25人英雄冷龙峰速刷团，出了内功精简护手',
  },
  {
    id: 'wk-3',
    owner: '团子',
    roleId: 'r5',
    roleName: '补天银蝶',
    sect: 'du',
    income: 32000,
    expense: 48000,
    bonus: 0,
    advance: 1500,
    drops: [],
    date: '10-17',
    timeText: '前天 20:50',
    period: 'week',
    note: '拍了一件毕业散件暗器，小亏一笔下周补回来',
  },
  {
    id: 'wk-4',
    owner: '沈舟',
    roleId: 'r6',
    roleName: '离经花间',
    sect: 'hua',
    income: 64000,
    expense: 6000,
    bonus: 3500,
    advance: 0,
    drops: ['精简'],
    date: '10-11',
    timeText: '10-11',
    period: 'month',
    note: '周常十人连打带老板，补贴很稳',
  },
];

export const INITIAL_PLAYS: PlayRecord[] = [
  {
    id: 'pl-1',
    game: '三角洲',
    hours: 3.5,
    owner: '小明',
    date: '10-19',
    timeText: '今天 23:10',
    period: 'week',
    note: '和沈舟组排烽火地带摸金，撤离成功三次',
  },
  {
    id: 'pl-2',
    game: '剑三',
    hours: 4.5,
    owner: '阿璃',
    date: '10-18',
    timeText: '昨天 22:30',
    period: 'week',
    note: '清完两车25人周常加家园种花',
  },
  {
    id: 'pl-3',
    game: '三角洲',
    hours: 3.0,
    owner: '沈舟',
    date: '10-17',
    timeText: '前天 21:00',
    period: 'week',
    note: '全面战场模式刷枪械配件等级',
  },
  {
    id: 'pl-4',
    game: '其他',
    hours: 2.0,
    owner: '团子',
    date: '10-16',
    timeText: '3天前',
    period: 'week',
    note: '双人成行联机通关第五章',
  },
];

export const INITIAL_MANUAL_VAULT: ManualVaultRecord[] = [
  {
    id: 'mv-1',
    type: 'deposit',
    amount: 950000,
    owner: '小明',
    date: '10-10',
    note: '赛季初卖掉囤积的五行石，先放进小金库备战新爹',
  },
  {
    id: 'mv-2',
    type: 'deposit',
    amount: 120000,
    owner: '阿璃',
    date: '10-15',
    note: '挖宝出的里飞沙马驹卖掉入库',
  },
  {
    id: 'mv-3',
    type: 'withdraw',
    amount: 46738,
    owner: '团子',
    date: '10-16',
    note: '借用零头凑整买精炼剥离石头',
  },
];

export function calcWorkNet(w: Pick<WorkRecord, 'income' | 'expense' | 'bonus' | 'advance'>): number {
  return w.income + w.bonus - w.expense - w.advance;
}
