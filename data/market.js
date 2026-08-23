// 市場の母数。希少性の分母はすべてここから取る。
// 出典は research/sources.md に台帳化済み。取得日 2026-08-23。
const MARKET = {
  // --- 就業者数（厚生労働省「令和6年衛生行政報告例」2024年末時点）---
  employedHygienists: 149579,
  employedHygienistsPrev: 145183,          // 令和4年末
  licensedTotal: 321241,                   // 免許登録者総数
  latentHygienists: 171662,                // 推定値（登録 − 就業）
  employmentRate: 0.466,                   // 就業割合
  source: 'https://www.jdha.or.jp/aboutdh/shugyo.html',
  sourceSecondary: 'https://www.whitecross.co.jp/articles/view/3937',
  fetchedAt: '2026-08-23',

  // --- 就業先の内訳 ---
  workplaceBreakdown: {
    clinic: { count: 135499, ratio: 0.906 },
    other:  { count: 14080,  ratio: 0.094 },
    // 「診療所以外」の内訳（病院・訪問・企業・行政）は公表されていない
    otherDetail: null,                     // TODO: データなし
  },

  // 歯科衛生士学校・養成所の就業者は前回調査から激減している。
  // 教育トラックの需要根拠として最重要の数字。
  educationInstitutionChange: {
    deltaCount: -645,
    deltaRatio: -0.365,
    note: '令和4年末 → 令和6年末。教育現場の人材不足を示す',
    source: 'https://www.jdha.or.jp/aboutdh/shugyo.html',
  },

  // --- 年齢構成 ---
  averageAge: 36.5,                        // 常勤。令和4年 賃金構造基本統計調査
  ageDistribution: {
    under25: null,                         // TODO: 正確な値は未取得（横ばい傾向の記述のみ）
    forties: 0.257,
    fiftiesAndOver: 0.284,
  },
  ageDistributionSource: 'https://www.guppy.jp/dh/og/dh-knowledge-27/',

  // --- 左利き ---
  leftHandedRateGeneral: 0.10,             // 一般人口 約10〜12%。下限を採用
  leftHandedRateRangeMax: 0.12,
  leftHandedHygienistsEstimate: 14958,     // 推定値（149,579 × 10%）。※歯科職固有の統計は存在しない
  leftHandedRateDental: null,              // TODO: 歯科医療従事者に限定した統計は存在しない
  leftHandedSource: 'https://www.whitecross.co.jp/articles/view/3804',
  // 教育現場の構造的課題。専門学校校長へのヒアリング記事。
  leftHandedEducationGap: '左利きの学生に左手で教えられる教員が存在せず、右手での実習を強制している',
  leftHandedMaterialsExist: false,         // 左利き向けの体系的な日本語教材はほぼ存在しない

  // --- 存在しないデータ（推測で埋めない）---
  unavailable: [
    '経験年数の分布',
    '常勤／非常勤の比率・平均勤務日数',
    '離職率・復職率・平均ブランク年数',
    '年間の新規免許取得者数',
    '診療科目別（矯正・インプラント等）の従事者数',
    '複数領域を経験している歯科衛生士の割合',
    '出産・育児後の復職者数と割合',
  ],
};
