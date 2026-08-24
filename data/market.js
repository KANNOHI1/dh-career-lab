// 市場の母数。希少性の分母はすべてここから取る。
// 出典は research/sources.md に台帳化済み。取得日 2026-08-23。
const MARKET = {
  // --- 就業者数（厚生労働省「令和6年衛生行政報告例」2024年末時点）---
  employedHygienists: 149579,
  employedHygienistsPrev: 145183,          // 令和4年末
  // 2026-08-24 検証: 免許登録者総数 321,241 の一次資料を確認できなかった。
  // 衛生行政報告例は「就業者」しか扱っていない。出典は二次情報 1 本のみ。
  // さらに歯科衛生士免許は死亡・引退で抹消されない累積値のため、
  // 「登録 − 就業」を潜在有資格者と呼ぶのは誤り（物故者・引退者を含む）。
  // 画面では使わない。台帳との突き合わせのためだけに残す。
  licensedTotal: 321241,                   // 未検証。二次情報のみ
  latentHygienists: 171662,                // 推定値（登録 − 就業）。使用禁止
  employmentRate: 0.466,                   // 上記から算出。使用禁止
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
    forties: 0.257,                        // 二次情報のみ
    fiftiesAndOver: 0.284,                 // 2026-08-24 一次側で確認済み
  },
  // 50代以上 28.4% は日本歯科衛生士会（厚労省 令和6年衛生行政報告例より作成）で確認。
  // 平成24年度以降ふえ続けている。40代 25.7% は二次情報のみで未検証。
  ageDistributionSource: 'https://www.jdha.or.jp/aboutdh/shugyo.html',
  ageDistributionSourceSecondary: 'https://www.guppy.jp/dh/og/dh-knowledge-27/',
  fiftiesTrend: '平成24年度以降ふえ続けている',

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
