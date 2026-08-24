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
// 2026-08-24 e-Stat の API から都道府県別を取得（統計表 0004048426 / 0004048427 / 0004027006）
const SRC_ESTAT_FACILITY = 'https://www.e-stat.go.jp/dbview?sid=0004048427';   // 令和6年 医療施設調査
const SRC_ESTAT_DH = 'https://www.e-stat.go.jp/dbview?sid=0004027006';         // 令和2年 衛生行政報告例
const SRC_ESTAT_WAGE = 'https://www.e-stat.go.jp/dbview?sid=0004007961';       // 令和5年 賃金構造基本統計調査
// 社会・人口統計体系（統計表 0000010109）。医療施設に従事する歯科医師数の実数。
// この体系に人口10万対の指標はないため、率は自分で作らず実数のまま出す。
const SRC_SSDS = 'https://www.e-stat.go.jp/dbview?sid=0000010109';

// 注: app.js に都道府県名リストの REGIONS があるため、こちらは REGION_DATA とする
const REGION_DATA = {
  years: [2020, 2030, 2040, 2050],

  areas: [
    {
      name: '北海道',
      aged65: [32.1, 35.3, 39.7, 42.6],
      aged75: [16.4, 22.0, 23.8, 27.2],
      dentistsPer100k: null,        // TODO: 図表からの数値が未取得。東京・全国のみ確定
      clinics: 2697,                // 歯科診療所数（令和6年）
      clinicsPer100k: 53.5,         // 人口10万対（全国 53.6 とほぼ同じ）
      hygienists: 6531,             // 就業歯科衛生士数（令和2年）
      hygienistsPer100k: 125.0,     // 人口10万対（全国 113.2 より多い）
      newGradJobRatio: 18.3,        // 就職者に対する求人人数倍率（令和7年度）
      outflowRatio: 0.099,          // 県外へ就職した割合。県外からの入学は 0.9%
      // 令和5年 賃金構造基本統計調査（一般労働者・男女計・歯科衛生士）
      wage: { monthlyThousandYen: 265.9, bonusThousandYen: 324.8, hours: 163, overtime: 8,
              age: 41.2, tenure: 5.9, workers: 870 },
      // 医療施設に従事する歯科医師数（2022年度）。人口10万対は同じ体系に無いので実数のみ
      dentists: 4147, dentistsYear: '2022年度',
      note: '2050年には5人に2人が65歳以上になります。訪問が必要になる75歳以上の割合は、2030年に 22.0%。' +
            'ただし歯科診療所の数は人口あたりで全国並み（53.5 / 全国 53.6）なのに、' +
            '歯科衛生士は人口あたりで全国より多い（125.0 / 全国 113.2）。' +
            '新卒の求人倍率も 18.3 倍と全国（23.1倍）より低く、卒業生の 9.9% が道外へ出ています。' +
            'ただしこの「多い」は頭数の話で、常勤かパートかは区別されていません。' +
            '常勤で働いた場合の給与は全国より低く、平均年齢は高く、勤続年数は短い。',
    },
    {
      name: '東京都',
      aged65: [22.7, 23.6, 27.3, 29.6],
      aged75: [12.1, 13.5, 14.0, 17.5],
      dentistsPer100k: 116.9,       // 全国で最も多い
      clinics: 10607,               // 歯科診療所数（令和6年）
      clinicsPer100k: 74.8,         // 人口10万対（全国の約1.4倍）
      hygienists: 15045,            // 就業歯科衛生士数（令和2年）
      hygienistsPer100k: 107.1,     // 人口10万対（全国 113.2 より少ない）
      newGradJobRatio: 25.7,        // 関東/甲信越地区の値（都道府県別の公表なし）
      newGradJobRatioNote: '関東/甲信越地区の値。都道府県ごとの公表はない',
      wage: { monthlyThousandYen: 352.9, bonusThousandYen: 412.2, hours: 170, overtime: 16,
              age: 40.2, tenure: 8.7, workers: 3980 },
      dentists: 16293, dentistsYear: '2022年度',
      note: '高齢化は全国の中では遅い一方、人口あたりの歯科診療所は 74.8 で全国（53.6）の約1.4倍、' +
            '歯科医師も 116.9 で全国最多。医院は密集しています。' +
            'ところが歯科衛生士は人口あたり 107.1 と全国（113.2）より少ない。' +
            '医院の数に対して働く人が足りていない側です。' +
            '常勤の給与は全国より高い一方、労働時間も残業も全国より長い。',
    },
  ],

  newGradJobRatioNational: 23.1,
  newGradSource: 'https://www.kokuhoken.or.jp/zen-eiky/publicity/file/report_2026.pdf',

  nationalDH: { hygienists: 142760, per100k: 113.2, year: 2020, source: SRC_ESTAT_DH },
  nationalDentists: { count: 101919, year: '2022年度', source: SRC_SSDS },
  nationalWage: { monthlyThousandYen: 291.9, bonusThousandYen: 455.5, hours: 164, overtime: 8,
                  age: 37.3, tenure: 7.6, workers: 43380, year: '令和5年', source: SRC_ESTAT_WAGE },
  nationalClinics: { clinics: 66378, per100k: 53.6, year: 2024, source: SRC_ESTAT_FACILITY },

  national: {
    dentistsPer100k: 81.0,
    dentistsPer100kPrev: 81.6,
    lowest: '青森県・島根県 55.3',
    highest: '東京都 116.9',
    source: SRC_ISHI_PREF,
  },

  reading: {
    title: '同じ仕事でも、地域で見え方が変わる',
    body: '北海道と東京は、形がはっきり違います。' +
          '北海道は高齢化が10年以上早く進む一方、歯科衛生士が人口あたりで全国より多く、' +
          '新卒の求人倍率は全国より低い。ただしこの人数は常勤とパートを区別しない頭数です。' +
          '東京は医院も歯科医師も密集していますが、歯科衛生士は人口あたりで全国より少ない。' +
          '医院の数に対して人が足りていません。' +
          '同じ「歯科衛生士として働く」でも、置かれている条件が違います。',
  },

  source: SRC_CHIIKI,
  fetchedAt: '2026-08-24',
};
