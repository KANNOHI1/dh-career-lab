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
      title: '個人の医院が減り、法人が増えている',
      body: 'この1年で開設 1,363・廃止 1,748。廃止のほうが多い。' +
            '開設者別にみると個人が 855 減り、医療法人が 376 増えました。' +
            '医院の数は減りながら、法人がまとめて運営する形にうつっています。',
    },
  ],

  caveat: '施設が減ることは、働き口が減ることと同じではありません。1施設あたりの歯科衛生士数は増えています。ただしこの割り算は当サイトの計算で、公的な統計値ではありません。',
  fetchedAt: '2026-08-24',
};
