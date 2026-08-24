// 働く場所の側の数字。需要が伸びても働き口が増えるとは限らないため、供給側も見る。
//
// 一次統計のみ:
//   厚生労働省「令和6年 医療施設（動態）調査・病院報告の概況」
//     https://www.mhlw.go.jp/toukei/saikin/hw/iryosd/24/dl/02sisetu06.pdf
//   厚生労働省「令和6年 医師・歯科医師・薬剤師統計の概況」
//     https://www.mhlw.go.jp/toukei/saikin/hw/ishi/24/dl/R06_1gaikyo.pdf
//   厚生労働省「令和6年 衛生行政報告例」（歯科衛生士。MARKET と同じ出典）
//     https://www.jdha.or.jp/aboutdh/shugyo.html

const SRC_SHISETSU = 'https://www.mhlw.go.jp/toukei/saikin/hw/iryosd/24/dl/02sisetu06.pdf';
const SRC_SHIKAISHI = 'https://www.mhlw.go.jp/toukei/saikin/hw/ishi/24/dl/R06_1gaikyo.pdf';
const SRC_DH = 'https://www.jdha.or.jp/aboutdh/shugyo.html';
//   一般社団法人 全国歯科衛生士教育協議会「歯科衛生士教育に関する現状調査」（令和8年6月）
//   加盟185校・回収率100%。第1弾で「求人倍率23.3倍は一専門学校の調査」として棄却したが、
//   協議会の全国調査で 23.1 倍と裏づけが取れたので採用する。
const SRC_KYOGIKAI = 'https://www.kokuhoken.or.jp/zen-eiky/publicity/file/report_2026.pdf';
//   厚生労働省「令和5年 賃金構造基本統計調査」e-Stat API 経由（職種: 歯科衛生士）
//   一般労働者 統計表 0004007961 / 短時間労働者 統計表 0004008680
const SRC_CHINGIN = 'https://www.e-stat.go.jp/dbview?sid=0004007961';
const SRC_CHINGIN_PT = 'https://www.e-stat.go.jp/dbview?sid=0004008680';

const SUPPLY = {
  // --- 歯科診療所（令和6年10月1日現在・活動中の施設）---
  clinics: {
    count: 66378,
    prev: 66818,
    delta: -440,
    opened: 1363,          // 令和5年10月〜令和6年9月
    closed: 1748,
    // 開設者別。個人が減って医療法人が増えている
    byOwner: { individual: 48667, individualDelta: -855, corporationDelta: 376 },
    individualRatio: 0.733,
    source: SRC_SHISETSU,
  },

  // --- 歯科医師（令和6年12月31日現在・届出）---
  dentists: {
    count: 103652,
    prev: 105267,
    deltaRatio: -0.015,
    per100k: 83.7,
    inClinics: 88703,
    clinicAverageAge: 55.2,      // 診療所に従事する歯科医師の平均年齢
    clinicAverageAge1982: 47.3,  // 昭和57年。上昇し続けている
    ageBands: {
      under29: 0.059,
      thirties: 0.161,
      forties: 0.196,
      fifties: 0.215,
      sixties: 0.229,            // 最多
      seventiesPlus: 0.139,
    },
    sixtiesPlusRatio: 0.368,     // 60〜69歳 + 70歳以上
    source: SRC_SHIKAISHI,
  },

  // --- 歯科衛生士（比較用。MARKET と同じ数字）---
  hygienists: {
    count: 149579,
    prev: 145183,
    deltaRatio: 0.030,
    source: SRC_DH,
  },

  // 1施設あたりの歯科衛生士数。割り算なので「算出値」と明示して出す
  perClinic: {
    now: 149579 / 66378,
    prev: 145183 / 66818,
    note: '就業歯科衛生士数 ÷ 歯科診療所数。どちらも公表値だが、この割り算自体は当サイトの計算',
  },

  // --- 新人の求人倍率（養成校の卒業生ベース）---
  newGrad: {
    graduates: 7249,
    employed: 6616,
    employmentRate: 0.913,
    jobOpenings: 152550,          // 求人人数
    jobPostings: 83850,           // 求人件数
    ratioPerEmployed: 23.1,       // 就職者に対する求人人数倍率
    ratioPerGraduate: 21.0,
    trend: [
      { label: '平成31年度', v: 20.7 }, { label: '令和2年度', v: 19.4 },
      { label: '令和3年度', v: 22.6 }, { label: '令和4年度', v: 23.3 },
      { label: '令和5年度', v: 21.8 }, { label: '令和6年度', v: 23.7 },
      { label: '令和7年度', v: 23.1 },
    ],
    note: '養成校を出た人 1 人に対して求人が 23.1 人分ある、という意味です。' +
          '新卒の話であって、経験者の転職市場の数字ではありません。',
    source: SRC_KYOGIKAI,
  },

  // --- 常勤とパートで働く量がどれくらい違うか ---
  // 「歯科衛生士が多い」を頭数だけで語ると実態を外す。衛生行政報告例の就業者数は
  // 常勤・非常勤を区別しない頭数なので、稼働量はこちらで見る。
  workload: {
    year: '令和5年',
    fullTime: {
      label: '常勤（一般労働者）',
      workers: 43380,
      age: 37.3,
      tenureYears: 7.6,
      monthlyHours: 164,           // 所定内実労働時間
      overtimeHours: 8,
      bonusThousandYen: 455.5,
      source: SRC_CHINGIN,
    },
    partTime: {
      label: 'パート（短時間労働者）',
      workers: 29960,
      age: 46.9,
      tenureYears: 7.6,
      daysPerMonth: 13.0,
      hoursPerDay: 5.4,
      monthlyHours: 70.2,          // 13.0 × 5.4。当サイトの計算
      hourlyYen: 1703,
      bonusThousandYen: 48.6,
      source: SRC_CHINGIN_PT,
    },
    ratioNote: 'パートの人が働く時間は月 70 時間ほどで、常勤（164時間）の 4 割強です。' +
               '月あたりの時間は「実労働日数 13.0 日 × 1日 5.4 時間」で当サイトが計算しました。',
    caveat: '常勤の人数（統計表0004007961）とパートの人数（統計表0004008680）は、' +
            '同じ調査ですが集計している事業所の条件が同じとは限りません。' +
            '「何対何」と正確な比率を出すのではなく、どちらも相当な人数がいる、という程度に読んでください。',
    conclusion: '就業歯科衛生士 149,579 人という数字は、常勤もパートも同じ 1 人として数えたものです。' +
                'そのうち相当数が月 70 時間前後の働き方をしています。' +
                '「人数が多い地域」を、そのまま「人手が足りている地域」とは読めません。',
  },

  // 画面に出す読み取り。事実の範囲を超えない書き方にする
  readings: [
    {
      title: '歯科医師と診療所は減り、歯科衛生士は増えている',
      body: '歯科医師は 105,267人 → 103,652人（−1.5%）、歯科診療所は 66,818 → 66,378（−440）。' +
            '同じ2年で歯科衛生士は 145,183人 → 149,579人（+3.0%）。逆方向に動いています。',
    },
    {
      title: '診療所の歯科医師は3人に1人以上が60歳をこえている',
      body: '診療所に勤める歯科医師の平均年齢は 55.2歳。昭和57年の 47.3歳から上がり続けています。' +
            '60歳以上が 36.8%、29歳以下は 5.9%。これから引退していく人のほうが多い構成です。',
    },
    {
      title: '働き口そのものは多い',
      body: '養成校の卒業生でみると、就職者 1 人あたり 23.1 人分の求人があります（令和7年度）。' +
            '就職率は 91.3%。施設の数は減っていますが、人が足りていない状態は続いています。',
    },
    {
      title: '個人の医院が減り、法人が増えている',
      body: 'この1年で開設 1,363・廃止 1,748。廃止のほうが多い。' +
            '開設者別にみると個人が 855 減り、医療法人が 376 増えました。' +
            '医院の数は減りながら、法人がまとめて運営する形にうつっています。',
    },
  ],

  caveat: '施設が減ることは、働き口が減ることと同じではありません。1施設あたりの歯科衛生士数は増えています。ただしこの割り算は当サイトの計算で、公的な統計値ではありません。',
  fetchedAt: '2026-08-24',
};
