// 診療領域ごとの需要の方向。app.js の FIELDS（設問の選択肢）と id を対応させる。
//
// **一次統計だけで構成する。** 業界メディア・求人媒体・市場調査会社の数字は使わない。
// 自費診療（インプラント・審美・自費矯正）は公的統計に存在しないため direction: 'unknown'。
// 「わからない」を「小さい」や「大きい」に読み替えない。
//
// 使っている一次統計:
//   A 厚生労働省「令和6年 社会医療診療行為別統計」（令和6年8月審査分・対 令和5年6月審査分）
//     https://www.mhlw.go.jp/toukei/saikin/hw/sinryo/tyosa24/
//     ※令和6年度の診療報酬改定で集計月が6月審査分→8月審査分に変わったため、
//       前回との比較には留意が必要と厚労省自身が注記している。断定的に読まない。
//   B 厚生労働省「令和4年 歯科疾患実態調査」 https://www.mhlw.go.jp/content/10804000/001112405.pdf
//   C 厚生労働省「令和6年 歯科疾患実態調査（結果の概要）」 https://www.mhlw.go.jp/stf/newpage_59190.html
//   D 国立社会保障・人口問題研究所「日本の将来推計人口（令和5年推計）」出生中位・死亡中位
//     https://www.ipss.go.jp/pp-zenkoku/j/zenkoku2023/pp2023_gaiyou.pdf

const SRC_SHINRYO = 'https://www.mhlw.go.jp/toukei/saikin/hw/sinryo/tyosa24/';
const SRC_SHIKKAN_R4 = 'https://www.mhlw.go.jp/content/10804000/001112405.pdf';
const SRC_SHIKKAN_R6 = 'https://www.mhlw.go.jp/stf/newpage_59190.html';
const SRC_JINKO = 'https://www.ipss.go.jp/pp-zenkoku/j/zenkoku2023/pp2023_gaiyou.pdf';

// 統計の読み方についての注意。画面にも出す。
const FIELD_CAVEAT = {
  shinryoNote: '診療報酬改定で集計月が変わったため、前回との比較には留意が必要と厚生労働省が注記しています。1年分の増減だけで方向を決めつけないでください。',
  jihiNote: '自費でおこなう診療（インプラント・ホワイトニング・自費の矯正）は公的統計に出てきません。市場が小さいという意味ではなく、公的に数えられていないという意味です。',
  source: SRC_SHINRYO,
};

const FIELDS_DEMAND = [
  {
    id: '予防・メインテナンス',
    direction: 'up',
    headline: '通う人そのものが増えている',
    body: '歯科検診を受ける人の割合が初めて6割を超えました。80歳で20本以上の歯が残っている人も、2年で1割ふえています。治療のために来る人ではなく、守るために通う人がふえている。',
    evidence: [
      { label: '過去1年に歯科検診を受けた人', value: '58.0%（令和4年）→ 63.8%（令和6年）', source: SRC_SHIKKAN_R6 },
      { label: '8020達成者（80歳で20本以上）', value: '51.6%（令和4年）→ 61.5%（令和6年）', source: SRC_SHIKKAN_R6 },
      { label: '医学管理等の1日当たり点数', value: '+1.8%', source: SRC_SHINRYO },
    ],
  },
  {
    id: '歯周治療',
    direction: 'up',
    headline: '診療行為の中で伸びが大きい',
    body: '歯周治療が含まれる「処置」と、歯周基本検査が含まれる「検査」は、歯科の診療行為の中でも伸びが大きい区分です。高齢になっても歯が残るようになったぶん、その歯を支える組織を診る仕事がふえています。',
    evidence: [
      { label: '処置（歯周治療を含む区分）の1日当たり点数', value: '+9.0%（構成割合 20.9%）', source: SRC_SHINRYO },
      { label: '検査（歯周基本検査を含む区分）', value: '+7.5%（構成割合 7.9%）', source: SRC_SHINRYO },
      { label: '65〜74歳でう歯を持つ人', value: '76.9%（平成5年）→ 96.6%（令和4年）。歯が残るから増える', source: SRC_SHIKKAN_R4 },
    ],
  },
  {
    id: '訪問',
    direction: 'up',
    headline: '高齢者が増え、その高齢者に歯が残っている',
    body: '65歳以上の割合は2038年に3人に1人になります。しかも昔と違って高齢者に歯が残っている。85歳以上でう歯を持つ人は30年で倍以上になりました。通えなくなった人の口をみる仕事は、これから増える側にあります。',
    evidence: [
      { label: '65歳以上が総人口に占める割合', value: '28.6%（2020年）→ 33.9%（2038年）→ 38.7%（2070年）', source: SRC_JINKO },
      { label: '85歳以上でう歯を持つ人', value: '39.4%（平成5年）→ 83.8%（令和4年）', source: SRC_SHIKKAN_R4 },
      { label: '在宅医療の1日当たり点数', value: '+2.1%（構成割合 3.3%）', source: SRC_SHINRYO },
    ],
    caution: '65歳以上の人口そのものは2043年ごろがピークで、その後は減ります。増え続けるのは「割合」です。',
  },
  {
    id: '口腔外科',
    direction: 'up',
    headline: '手術と麻酔がともに伸びている',
    body: '手術の点数が伸び、麻酔は歯科の診療行為の中でいちばん高い伸び率でした。ただし麻酔は全体に占める割合が小さく、金額の規模としては大きくありません。',
    evidence: [
      { label: '手術の1日当たり点数', value: '+4.8%（構成割合 2.6%）', source: SRC_SHINRYO },
      { label: '麻酔の1日当たり点数', value: '+15.2%（歯科の診療行為で最大の伸び率）', source: SRC_SHINRYO },
    ],
    caution: '麻酔は伸び率が大きい一方で、1日当たり 3.8 点と規模そのものは小さい区分です。',
  },
  {
    id: '矯正',
    direction: 'up',
    headline: '保険でみる矯正は伸びている。自費は統計に出ない',
    body: '保険が使える矯正（顎変形症など）の点数は伸びています。ただし矯正の多くは自費で、そちらは公的統計に出てきません。「矯正の市場が伸びているか」を公的な数字で答えられるのは保険の部分だけです。',
    evidence: [
      { label: '歯科矯正の1日当たり点数', value: '+10.4%', source: SRC_SHINRYO },
    ],
    caution: '自費の矯正は公的統計に存在しません。ここに出ている伸びは保険適用分だけの話です。',
  },
  {
    id: '一般',
    direction: 'flat',
    headline: '金額はいちばん大きいが、伸びていない',
    body: '削って詰める・かぶせる・入れ歯を入れるという仕事は、歯科の点数の約3割を占めていていちばん大きい。ただし前回と比べるとわずかに減っています。歯科の中心ではあるが、伸びしろがある場所ではありません。',
    evidence: [
      { label: '歯冠修復及び欠損補綴の1日当たり点数', value: '−0.3%（構成割合 29.9%・全区分で最大）', source: SRC_SHINRYO },
      { label: '初・再診', value: '+2.7%（構成割合 12.3%）', source: SRC_SHINRYO },
    ],
  },
  {
    id: '小児',
    direction: 'down',
    headline: '虫歯そのものが消えかけている',
    body: '5〜9歳で虫歯を持つ子の割合は、30年で 36.3% から 2.5% になりました。子どもの数も減り続けます。削る仕事は減りますが、フッ化物や食習慣の指導は残ります。仕事の中身が変わる領域です。',
    evidence: [
      { label: '5〜9歳でう歯を持つ子', value: '36.3%（平成5年）→ 2.5%（令和4年）', source: SRC_SHIKKAN_R4 },
      { label: '15〜24歳の1人平均DMF歯数', value: '9.0本（平成5年）→ 2.5本（令和4年）', source: SRC_SHIKKAN_R4 },
      { label: '0〜14歳の人口', value: '1,503万人（2020年）→ 797万人（2070年）', source: SRC_JINKO },
    ],
  },
  {
    id: 'インプラント',
    direction: 'unknown',
    headline: '公的な数字が存在しない',
    body: 'インプラントはほとんどが自費で、保険の統計に出てきません。市場規模を示す公的なデータは見つかっていません。ここは数字で語れない領域です。',
    evidence: [],
    caution: '数字がないことは、市場が小さいことを意味しません。公的に数えられていないだけです。',
  },
  {
    id: '審美',
    direction: 'unknown',
    headline: '公的な数字が存在しない',
    body: 'ホワイトニングをはじめとする審美の診療は自費です。インプラントと同じく、公的統計に出てきません。',
    evidence: [],
    caution: '数字がないことは、市場が小さいことを意味しません。公的に数えられていないだけです。',
  },
];

const DIRECTION_LABEL = {
  up: 'ふえている',
  flat: '横ばい',
  down: 'へっている',
  unknown: '公的な数字がない',
};
