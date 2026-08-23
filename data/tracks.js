// キャリアトラック定義。台帳: research/sources.md（第11〜18章）
//
// confirmed: true のトラックだけを結果画面に出す。
// false のものは「調べている最中」ではなく「公表データが存在しない」。画面には出さない。
//
// income.examples は相場ではなく実例。求人1件の提示額であることが分かる書き方をする。
// verdict: 'recommend'（要件と数値が揃っている）/ 'conditional'（条件つき）/
//          'not-recommended'（調べた結果、勧めない）
const TRACKS = [
  {
    id: 'corporate',
    name: '企業内歯科衛生士（メーカー・材料商社）',
    short: '企業内',
    summary: 'メーカーの学術・企画営業として、製品セミナーや導入支援を担当する。デンタルショーで登壇しているのはこの人たち。',
    verdict: 'recommend',
    reality: '募集要件は臨床経験 1〜3 年以上。登壇者は長い臨床歴で選ばれているのではなく、入社してから社内で訓練されている。',
    entryRequirements: [
      '臨床経験 1〜3 年以上（企業により異なる）',
      '普通自動車免許（モリタ）・PC スキル',
      '土日祝の出勤と国内出張（ナカニシは週末中心に月2〜3回・1泊）',
    ],
    blocker: null,
    income: {
      text: '年収 370〜676 万円（各社の求人提示額）',
      examples: [
        { org: '松風（企画営業）', value: '年収 425〜676 万円 / 賞与年2回 計5.548ヶ月・2023年度実績 / 年間休日 127 日', source: 'https://shofu-recruit.jp/recruit/' },
        { org: 'Ivoclar Vivadent', value: '年収 500〜650 万円 / 年間休日 120 日以上', source: null },
        { org: 'ナカニシ', value: '予定年収 370〜550 万円（年俸制）', source: 'https://doda.jp/DodaFront/View/JobSearchDetail/j_jid__3015504594/' },
        { org: 'モリタ', value: '月給 244,000〜350,000 円 + 賞与年2回（実績 5.1〜5.4ヶ月）', source: 'https://recruit.morita.com/recruit/mid.php' },
      ],
    },
    tradeoffs: ['臨床の手を動かす仕事から離れる', '出張・土日出勤がある', '転勤の可能性がある'],
    fitFor: ['収入', '安定', '専門性'],
    cautions: {
      '転居できない': '全国転勤や出張のある求人が多い。勤務地を固定できるかは企業ごとに確認が要る。',
    },
    requiredCertificationIds: [],
    source: 'https://www.r-agent.com/viewjob/jk425d0a03d339f1bf/',
    fetchedAt: '2026-08-23',
    confirmed: true,
  },

  {
    id: 'public-health',
    name: '行政・公衆衛生（自治体職員）',
    short: '行政',
    summary: '市区町村や保健所の職員として、乳幼児健診・介護予防・歯科保健事業を担当する。',
    verdict: 'recommend',
    reality: '年齢の上限は自治体でまったく違う。40歳未満の枠もあれば、年齢制限なしの自治体もある。佐倉市は経験者採用で保育士と歯科衛生士に限り 55 歳まで受験できる。',
    entryRequirements: [
      '自治体ごとの採用試験（教養試験を廃止して SPI に切り替える自治体が増えている）',
      '歯科衛生士免許',
    ],
    blocker: null,
    income: {
      text: '例: 新発田市 31〜40歳の平均 492 万円',
      examples: [
        { org: '新発田市', value: '30歳まで 391 万円 / 31〜40歳 492 万円。年齢制限なし（42歳の応募例あり）', source: 'https://public-connect.jp/job/15728' },
        { org: '佐倉市', value: '経験者採用は保育士・歯科衛生士のみ 55 歳まで受験可（令和7年度末時点）', source: 'https://www.city.sakura.lg.jp/soshiki/jinjika/boshujoho/backnumber/20777.html' },
        { org: '東京特別区', value: 'I類 22〜31歳 / 経験者採用は最大 59 歳以下', source: 'https://www.union.tokyo23city.lg.jp/jinji/jinjiiinkaitop/saiyoshiken/gaiyo.html' },
      ],
    },
    tradeoffs: ['募集は自治体ごとの単発で、常時開いてはいない', '臨床の頻度は下がる'],
    fitFor: ['安定', '収入'],
    cautions: {
      '転居できない': '通える範囲の自治体が募集を出すかどうかで決まる。ここは自分では動かせない。',
    },
    requiredCertificationIds: [],
    source: 'https://koumu-in.jp/cat/dental-hygienist/tokyo',
    fetchedAt: '2026-08-23',
    confirmed: true,
  },

  {
    id: 'home-visit',
    name: '訪問歯科診療',
    short: '訪問',
    summary: '通院できない高齢者や障害のある方の自宅・施設に出向いて、口腔ケアと機能管理をおこなう。',
    verdict: 'conditional',
    reality: '特別な資格がなくても始められる。認定は後から取る形になっていて、どちらの制度も実務・在籍 3 年以上が要件。',
    entryRequirements: [
      '資格要件なし。訪問診療をしている医院・法人に移ることが入口',
      '運転できることを前提にした求人が多い',
      '認定歯科衛生士（在宅療養指導・口腔機能管理／日本歯科衛生士会）は実務 3 年以上 + 研修単位',
      '認定訪問歯科衛生士（日本訪問歯科協会）は協会在籍 3 年以上 + 研修 100pt 以上',
    ],
    blocker: null,
    income: {
      text: '常勤 月給 27〜40 万円以上 / 非常勤 時給 1,700〜2,500 円',
      examples: [
        { org: '求人媒体の掲載レンジ', value: '常勤 月給 27〜40 万円以上。非常勤は時給 1,700〜2,500 円（運転可否で変わる）', source: 'https://job-medley.com/' },
        { org: '民間の訪問研修', value: '受講料 22,000〜35,000 円', source: 'https://www.dentalsupport.co.jp/info/20260120/' },
      ],
    },
    tradeoffs: ['移動時間が長い', 'ユニットのない環境での手技になる', '医療的な状態が重い方を扱う'],
    fitFor: ['専門性', '収入'],
    cautions: {
      '転居できない': '訪問は地域密着なので、むしろ転居しない働き方と相性がいい。',
    },
    requiredCertificationIds: [],
    source: 'https://www.houmonshika.org/certified/',
    fetchedAt: '2026-08-23',
    confirmed: true,
  },

  {
    id: 'instructor',
    name: '指導する側に回る（学会認定 + 発表・執筆）',
    short: '指導',
    summary: '臨床を続けながら、セミナー講師・学会発表・商業誌の執筆に手を伸ばしていく道。',
    verdict: 'recommend',
    reality: '実際に指導する側にいる人の経歴を並べると、共通しているのは年数ではなかった。学会認定を意図的に積み増していること、発表と執筆を続けていること。この 2 つだった。',
    entryRequirements: [
      '学会（民間資格ではなく）の認定歯科衛生士を取る',
      '学会発表・口演を重ねる',
      '商業誌への執筆',
      '大学院に進む人もいる',
    ],
    blocker: null,
    income: null,   // 公表データが存在しない。収入で語るトラックではない
    incomeNote: '講師・執筆の収入について公表されている統計はない。これは収入を上げるための道ではなく、名前が残る道。',
    examples: [
      { name: '佐藤 由美', path: '1994 免許 → 2005 歯周病学会 認定（11年目） → 2010 臨床歯周病学会 → 2014 顎咬合学会 → 2019 顕微鏡歯科学会', source: 'https://mdh-studygroup.com/author/sato-yumi/' },
      { name: '内田 佳代', path: '2000 卒 → 2018 早稲田大学院 修士 → 現・東京科学大 助教', source: 'https://researchmap.jp/kayo_uchida' },
      { name: '宮本 さくら', path: '日本歯周病学会 認定歯科衛生士 / PEC インストラクター', source: 'https://www.dhbloss.com/profile-1' },
    ],
    tradeoffs: ['臨床の外側の時間を使う', '成果が出るまでに年単位かかる'],
    fitFor: ['専門性', '自分の裁量'],
    cautions: {
      '学費に上限がある': '大学院は必須ではない。学会認定と発表だけでも道はつながっている。',
    },
    requiredCertificationIds: [],
    source: 'https://mdh-studygroup.com/author/sato-yumi/',
    fetchedAt: '2026-08-23',
    confirmed: true,
  },

  {
    id: 'care-manager',
    name: 'ケアマネジャー（介護支援専門員）',
    short: 'ケアマネ',
    summary: '介護保険のケアプランを立てる仕事。訪問・高齢者の領域から地続きで広がる。',
    verdict: 'conditional',
    reality: '歯科衛生士は受験できる職種に入る。実務 5 年以上かつ従事日数 900 日以上。合格率は年度で振れていて、令和7年度は 25.6%。',
    entryRequirements: [
      '対人援助業務の実務 通算 5 年以上 かつ 従事日数 900 日以上',
      '介護支援専門員実務研修受講試験に合格',
      '実務研修 87 時間以上（期間の目安 6ヶ月以上）',
      '受験手数料 約 12,400 円',
    ],
    blocker: null,
    income: null,
    incomeNote: '歯科衛生士がこの資格を取った後の年収データは見つかっていない。',
    tradeoffs: ['歯科の手技からは離れる', '合格率は令和6年度 32.1% → 令和7年度 25.6% と下がっている'],
    fitFor: ['安定'],
    cautions: {},
    requiredCertificationIds: [],
    source: 'https://www.miraicare.jp/column/care-manager-eligibility/',
    fetchedAt: '2026-08-23',
    confirmed: true,
  },

  {
    id: 'education',
    name: '歯科衛生士学校の専任教員',
    short: '養成校教員',
    summary: '養成校で歯科衛生士を育てる。要件が法令で決まっている数少ないトラック。',
    verdict: 'not-recommended',
    // 「要件を満たしている」で終わらせない。調べた結果は逆だった。
    reality: '要件のうち経験年数は満たせる。ただし入口が閉じている。専任教員講習会は教育施設を通してしか申し込めず、責任者が申込書を書く。つまり講習を取って教員になるのではなく、教員になってから講習を受ける。順序が逆で、個人の自己投資では入れない。',
    entryRequirements: [
      '歯科衛生士免許取得後 4 年以上の業務従事経験',
      '専任教員講習会 I〜V の受講・修了（1 講習 25,000 円・5 日間連続の集合研修）',
    ],
    blocker: '専任教員講習会は個人で申し込めない（教育施設を通じて申込書を整え、責任者が記入する）',
    income: {
      text: '年収 300〜800 万円。求人の多くは 350〜450 万円',
      examples: [
        { org: '滋慶学園', value: '年収 350〜450 万円', source: 'https://hrmos.co/pages/jikei/jobs/0703805' },
        { org: '新宿医療専門学校', value: '年収 400〜800 万円（実務4年以上・年間休日 120 日）', source: 'https://www.ssjs.ac.jp/news/news-16369/' },
        { org: '学校法人清水財団', value: '基本給21万 + 職務手当2〜15万 + 賞与3.5ヶ月（年収換算 約356〜558万円）', source: 'https://www.shimizu-gakuen.jp/saiyo/' },
      ],
    },
    // 学校そのものが縮んでいる
    marketShrink: {
      years: [
        { year: 2020, capacity: 9326, entrants: 8012, underfilledRatio: 0.458 },
        { year: 2022, capacity: 9609, entrants: 8547, underfilledRatio: 0.543 },
        { year: 2024, capacity: 10069, entrants: 8007, underfilledRatio: 0.730 },
      ],
      note: '定員を約 700 人増やしたのに、入学者は 2020 年を下回った。2024 年度は 134 校が定員割れ。',
      source: 'https://tdc-alumni.jp/2024/10/31/dosokai/honbu/kantougen/2024_10/',
      capacitySource: 'https://www.kokuhoken.or.jp/zen-eiky/publicity/file/report_2020.pdf',
      closures: ['池見札幌（2020 閉校）', '東京都歯科医師会附属（2021 募集停止）', '日本大学松戸歯学部附属（2025-03 閉校）', '長崎歯科衛生士専門学校（2025年度 募集停止）'],
    },
    tradeoffs: ['臨床の最前線から離れる', '学校の数そのものが減っている', '収入が上がる保証がない（全国平均とほぼ同水準）'],
    fitFor: [],
    cautions: {},
    requiredCertificationIds: ['teacher-certified'],
    source: 'https://www.kokuhoken.or.jp/zen-eiky/info/plan.html',
    fetchedAt: '2026-08-23',
    confirmed: true,
  },

  // ---- 以下は公表データが存在しないトラック。画面には出さない ----
  // 診療領域別（矯正・インプラント・一般・口腔外科）の従事者数・年収・移行要件は
  // 3 回の調査すべてで「公的統計に存在しない」と確認済み。フリーランスも出典のある
  // 年収データが取れていない（求人媒体の記載はすべて出典なし）。
  // 推測で埋めない。
  {
    id: 'clinic-general', name: '一般歯科クリニック（臨床）', summary: null,
    entryRequirements: [], requiredCertificationIds: [], income: null,
    fitFor: [], tradeoffs: [], source: null, fetchedAt: null, confirmed: false,
  },
  {
    id: 'clinic-ortho', name: '矯正歯科', summary: null,
    entryRequirements: [], requiredCertificationIds: ['ortho-jaao-2'], income: null,
    fitFor: [], tradeoffs: [], source: null, fetchedAt: null, confirmed: false,
  },
  {
    id: 'clinic-implant', name: 'インプラント・自費中心', summary: null,
    entryRequirements: [], requiredCertificationIds: ['implant-jsoi'], income: null,
    fitFor: [], tradeoffs: [], source: null, fetchedAt: null, confirmed: false,
  },
  {
    id: 'hospital-oral-surgery', name: '病院歯科・口腔外科', summary: null,
    entryRequirements: [], requiredCertificationIds: ['anesthesia-jdsa'], income: null,
    fitFor: [], tradeoffs: [], source: null, fetchedAt: null, confirmed: false,
  },
  {
    id: 'freelance', name: 'フリーランス・業務委託', summary: null,
    entryRequirements: [], requiredCertificationIds: [], income: null,
    fitFor: [], tradeoffs: [], source: null, fetchedAt: null, confirmed: false,
  },
];
