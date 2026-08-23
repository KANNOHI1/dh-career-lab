// 年収レンジ。出典 URL 必須。取得日 2026-08-23。台帳: research/sources.md
// 出典のない数値は null。カーブの解釈を断定しない（下記 curveCaveat 参照）。
const SALARY = {
  source: 'https://www.e-stat.go.jp/dbview?sid=0003426315',
  sourceName: '厚生労働省「令和5年 賃金構造基本統計調査」',
  surveyYear: 2023,
  population: '全国の常勤歯科衛生士',
  fetchedAt: '2026-08-23',

  national: {
    annualYen: 4043200,
    monthlyYen: 296200,
    bonusYen: 453000,
  },

  // 年齢階級別の平均年収（円）
  byAgeBand: [
    { band: '20-24', annualYen: 3277900 },
    { band: '25-29', annualYen: 3832300 },
    { band: '30-34', annualYen: 4161800 },
    { band: '35-39', annualYen: 3821900 },
    { band: '40-44', annualYen: 3976100 },   // 対象者の現在位置
    { band: '45-49', annualYen: 5233400 },   // 全体のピーク
    { band: '50-54', annualYen: 4544200 },
  ],

  // カーブの形について。35-39 で下降し 45-49 で急上昇する。
  // 時短勤務等の影響と説明されることがあるが、その因果を裏づける出典を確認できていない。
  // 診断では「こう動いている」という事実のみ提示し、理由を断定しない。
  curveCaveat: '35-39歳の下降と45-49歳の急上昇の要因を示す一次資料は未確認。理由を断定しない',

  // 都道府県別。調査年不詳の推計値のため参考値として扱う。
  byRegionReference: [
    { region: '東京都',   annualYen: 4300000 },
    { region: '大阪府',   annualYen: 4000000 },
    { region: '愛知県',   annualYen: 3800000 },
    { region: '北海道',   annualYen: 3500000 },
  ],
  byRegionSource: 'https://imaa.or.jp/column/2025/07/3891',
  byRegionCaveat: '調査年不詳・賃金構造基本統計に基づく推計。参考値',

  // 求人票に現れた資格手当の実例。個別事例であり相場ではない。
  allowanceExamples: [
    { label: '麻酔系認定の資格手当', monthlyYen: [20000, 50000],
      source: 'https://shika-incho-zukan.com/column/hygienist-anesthesia/' },
    { label: '引越し補助（新生活応援手当）', oneTimeYen: 100000,
      source: 'https://www.webqua.jp/dh/search/94020' },
  ],
  allowanceCaveat: '個別求人の記載。「相場」として提示しない',

  // 出典のあるデータが存在しない項目。推測で埋めない。
  unavailable: [
    '就業先別（診療所／病院／訪問／企業／教育／行政）の年収差',
    '常勤／非常勤の年収・時給差',
    '勤続年数別・企業規模別の年収',
    '管理職・教育担当の年収レンジ',
    '企業（メーカー）所属歯科衛生士の年収レンジ',
    'フリーランス／業務委託の収入実態',
    '歯科衛生士学校 専任教員の年収レンジ',
    'ブランク後復職時の年収への影響',
  ],
};
