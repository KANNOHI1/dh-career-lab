// 地域による差。全国平均だけ見ていても、住んでいる場所で市場の形はちがう。
// いまデータを持っているのは北海道と東京都の2つだけ。他県を選んだ人には
// 「この2つは地域差の例」として見せる（全国値だけを自分の数字として扱う）。
//
// 一次統計のみ:
//   国立社会保障・人口問題研究所「日本の地域別将来推計人口（令和5年推計）」
//     結果表3-3（65歳以上人口割合）／結果表3-4（75歳以上人口割合）
//     https://www.ipss.go.jp/pp-shicyoson/j/shicyoson23/t-page.asp
//   厚生労働省「令和6年 医師・歯科医師・薬剤師統計」（人口10万対歯科医師数）
//     https://www.mhlw.go.jp/toukei/saikin/hw/ishi/24/dl/R06_1gaikyo.pdf

const SRC_CHIIKI = 'https://www.ipss.go.jp/pp-shicyoson/j/shicyoson23/t-page.asp';
const SRC_ISHI_PREF = 'https://www.mhlw.go.jp/toukei/saikin/hw/ishi/24/dl/R06_1gaikyo.pdf';

// 注: app.js に都道府県名リストの REGIONS があるため、こちらは REGION_DATA とする
const REGION_DATA = {
  years: [2020, 2030, 2040, 2050],

  areas: [
    {
      name: '北海道',
      aged65: [32.1, 35.3, 39.7, 42.6],
      aged75: [16.4, 22.0, 23.8, 27.2],
      dentistsPer100k: null,        // TODO: 図表からの数値が未取得。東京・全国のみ確定
      newGradJobRatio: 18.3,        // 就職者に対する求人人数倍率（令和7年度）
      outflowRatio: 0.099,          // 県外へ就職した割合。県外からの入学は 0.9%
      note: '2050年には5人に2人が65歳以上になります。訪問が必要になる75歳以上の割合は、2030年に 22.0%。' +
            'ただし新卒の求人倍率は 18.3 倍で全国（23.1倍）より低く、卒業生の 9.9% が道外へ出ています。',
    },
    {
      name: '東京都',
      aged65: [22.7, 23.6, 27.3, 29.6],
      aged75: [12.1, 13.5, 14.0, 17.5],
      dentistsPer100k: 116.9,       // 全国で最も多い
      newGradJobRatio: 25.7,        // 関東/甲信越地区の値（都道府県別の公表なし）
      newGradJobRatioNote: '関東/甲信越地区の値。都道府県ごとの公表はない',
      note: '高齢化は全国の中では遅い一方、人口10万人あたりの歯科医師数は 116.9 で全国最多。医院どうしの競争はきびしい側です。',
    },
  ],

  newGradJobRatioNational: 23.1,
  newGradSource: 'https://www.kokuhoken.or.jp/zen-eiky/publicity/file/report_2026.pdf',

  national: {
    dentistsPer100k: 81.0,
    dentistsPer100kPrev: 81.6,
    lowest: '青森県・島根県 55.3',
    highest: '東京都 116.9',
    source: SRC_ISHI_PREF,
  },

  reading: {
    title: '同じ仕事でも、地域で見え方が変わる',
    body: '北海道の高齢化は東京より10年以上早く進みます。訪問や高齢者の口腔ケアの必要性は、' +
          '全国平均より先に来ます。一方で新卒の求人倍率は 18.3 倍と全国（23.1倍）より低く、' +
          '需要が先に来るからといって働き口が多いわけではありません。' +
          '東京は歯科医師の密度が全国でいちばん高く、医院どうしの競争という意味ではきびしい場所です。',
  },

  source: SRC_CHIIKI,
  fetchedAt: '2026-08-24',
};
