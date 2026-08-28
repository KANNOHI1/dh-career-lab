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
    group: 'outside',
    field: null,
    requires: { years: 1, on: 'total', note: '臨床経験1〜3年以上（企業により異なる）' },
    actions: [
      { when: '今月', text: '松風・ナカニシ・モリタ・Ivoclar Vivadent の採用ページを開き、歯科衛生士資格を要件にした職種がいま出ているかを見る。', url: 'https://shofu-recruit.jp/' },
      { when: '半年〜1年', text: '募集が出ていなければ時期を控えて待つ。ナカニシのセミナー運営職は勤務地が東京、週末中心に月2〜3回の出張がある。土日祝の出勤と出張を受けられるかを先に決めておく。', url: 'https://www.nakanishi-inc-recruitment.jp/mid-career/sales/' },
      { when: '1〜3年', text: '条件の合う求人が出た年に応募する。普通自動車免許と PC スキルが要件に入る。年間休日は 120〜127 日で、医院勤務とは働き方そのものが変わる。', url: null },
    ],
    firstStep: '松風・ナカニシ・モリタ・Ivoclar Vivadent の採用ページを開く。歯科衛生士資格を要件にした職種があることは確認済み。募集が出ているかは時期による。',
    name: '企業内歯科衛生士（メーカー・材料商社）',
    short: '企業内',
    summary: 'メーカーの学術・企画営業として、製品セミナーや導入支援を担当する。デンタルショーで登壇しているのはこの人たち。',
    verdict: 'recommend',
    reality: '募集要件は臨床経験 1〜3 年以上。登壇者は長い臨床歴で選ばれているのではなく、入社してから社内で訓練されている。',
    entryRequirements: [
      '臨床経験 1〜3 年以上（企業により異なる）',
      '普通自動車免許（モリタ）・PC スキル',
      '土日祝の出勤と国内出張（ナカニシは週末中心に月2〜3回・1泊）',
      '勤務地が限られる職種がある（ナカニシのセミナー運営職は東京）',
    ],
    blocker: null,
    income: {
      text: '年収 370〜676 万円（各社の求人提示額）',
      examples: [
        { org: '松風（企画営業）', value: '年収 425〜676 万円 / 賞与年2回 計5.548ヶ月・2023年度実績 / 年間休日 127 日', source: 'https://shofu-recruit.jp/recruit/' },
        { org: 'Ivoclar Vivadent', value: '年収 500〜650 万円 / 年間休日 120 日以上', source: null },
        // 2026-08-24 公式の採用サイトで確認できた（前回はドメインを間違えていた）。
      // 「歯科医療従事者向けのセミナー運営・サポート」= 歯科衛生士の資格保有者（3年以上）が応募条件。
      // ただし公式は「年俸制」としか書いておらず、金額は出ていない。金額は求人媒体の値。
      { org: 'ナカニシ（公式）', value: 'セミナー運営・サポート職。歯科衛生士の資格保有者（3年以上の経験）。勤務地は東京。年俸制・年間休日123日・週休2日（土日）・昇給年1回・賞与年1回', source: 'https://www.nakanishi-inc-recruitment.jp/mid-career/sales/' },
      { org: 'ナカニシ（金額は求人媒体の掲載値）', value: '予定年収 370〜550 万円', source: 'https://doda.jp/DodaFront/View/JobSearchDetail/j_jid__3015504594/' },
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
    group: 'outside',
    field: null,
    actions: [
      { when: '今月', text: 'お住まいの自治体の職員採用ページを開き、歯科衛生士枠の募集時期と年齢の上限を控える。', url: null },
      { when: '半年〜1年', text: '志望先の試験が教養試験か SPI かを確認して、その形式で準備する。教養試験を廃止して SPI に切り替える自治体が増えている。', url: null },
      { when: '枠が出た年', text: '受験する。枠が毎年出るとは限らない。年齢上限は自治体でばらつきがあり、経験者採用で 55 歳・59 歳まで受けられる例がある。', url: null },
    ],
    firstStep: '通える範囲の自治体の採用情報を見て、歯科衛生士枠の募集時期と年齢の上限を控えておく。枠が毎年出るとは限らないので、出たときに動けるようにしておく。',
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
      text: '自治体によって年齢の上限がまったく違う',
      examples: [
        // 2026-08-24 新発田市の年収は削除した。北海道在住の人に新潟県の市の給与を出しても意味がない。
      // 年齢制限の例としてだけ残す。地域ごとの賃金は都道府県別の一次データが取れていない。
      { org: '新発田市', value: '年齢制限なしで募集した例がある（42歳の応募例）', source: 'https://koumu-in.jp/cat/forties', ageLimit: null },
        { org: '佐倉市', value: '経験者採用は保育士・歯科衛生士のみ 55 歳まで受験可（令和7年度末時点）', source: 'https://www.city.sakura.lg.jp/soshiki/jinjika/boshujoho/backnumber/20777.html', ageLimit: 55 },
        { org: '東京特別区', value: 'I類 22〜31歳 / 経験者採用は最大 59 歳以下', source: 'https://www.union.tokyo23city.lg.jp/jinji/jinjiiinkaitop/saiyoshiken/gaiyo.html', ageLimit: 59 },
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
    group: 'clinical',
    field: '訪問',
    actions: [
      { when: '今月', text: '通える範囲で訪問診療をしている医院・法人の求人を見る。運転できるかどうかで条件が大きく変わる。', url: null },
      { when: '半年〜1年', text: '訪問に移ったら、日本歯科衛生士会の認定（在宅療養指導・口腔機能管理）の要件を確認する。実務3年以上と研修単位。', url: 'https://www.jdha.or.jp/learning/ninteidh.html' },
      { when: '2〜3年', text: '単位をそろえて認定を申請する。民間の訪問研修（受講料 22,000〜35,000円）もあるが、こちらは学会・職能団体の認定ではない。', url: null },
    ],
    firstStep: '訪問診療をしている医院・法人の求人を見る。運転できるかどうかで条件が変わる。',
    name: '訪問歯科診療',
    short: '訪問',
    summary: '通院できない高齢者や障害のある方の自宅・施設に出向いて、口腔ケアと機能管理をおこなう。',
    verdict: 'conditional',
    reality: '特別な資格がなくても始められる。認定は後から取る。どちらの制度も実務・在籍 3 年以上が要件。',
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
    group: 'outside',
    field: null,
    actions: [
      { when: '今月', text: 'いま通っている領域の学会をひとつ選び、認定歯科衛生士の要件ページを開く。実務3年以上を要件にしているものが多い。', url: null },
      { when: '1〜3年', text: 'その学会の認定を取る。教える側に立っている人は、まず学会認定から入っている。', url: null },
      { when: '3年〜', text: '学会発表・口演を重ねる。商業誌に書く人、大学院に進む人もいる。順番はここまで来てからでいい。', url: null },
    ],
    firstStep: 'いま通っている領域の学会をひとつ選んで、認定歯科衛生士の要件を調べる。実務3年以上を要件にしているものが多い。',
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
    group: 'outside',
    field: null,
    requires: { years: 5, on: 'total', note: '対人援助業務の通算5年以上（別に従事日数900日以上の要件がある）' },
    actions: [
      { when: '今月', text: '従事日数が900日を超えているか、勤務先の在籍証明でたどれるかを確認する。', url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000054119.html' },
      { when: '次の試験 10月', text: '介護支援専門員実務研修受講試験に申し込む。試験は年1回、受験手数料は約 12,400円。申込の時期は都道府県ごとに違う。', url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000054119.html' },
      { when: '合格の半年後', text: '実務研修 87時間以上（期間の目安6ヶ月以上）を修了する。ここを終えて初めてケアマネとして働ける。', url: null },
    ],
    firstStep: '介護支援専門員実務研修受講試験の受験資格を、自分の従事日数で確認する（通算5年以上かつ900日以上）。',
    name: 'ケアマネジャー（介護支援専門員）',
    short: 'ケアマネ',
    summary: '介護保険のケアプランを立てる仕事。訪問・高齢者の領域から地続きで広がる。',
    verdict: 'conditional',
    reality: '歯科衛生士は受験できる職種に入る。実務 5 年以上かつ従事日数 900 日以上。' +
             '第28回（令和7年度）は 50,601 人が受けて 12,961 人が合格、合格率 25.6%。' +
             '平成30年度に受験資格が厳しくなり、受験者は 13 万人台から 4.9 万人へ一気に減りました。',
    entryRequirements: [
      '対人援助業務の実務 通算 5 年以上 かつ 従事日数 900 日以上',
      '介護支援専門員実務研修受講試験に合格',
      '実務研修 87 時間以上（期間の目安 6ヶ月以上）',
      '受験手数料 約 12,400 円',
    ],
    blocker: null,
    income: null,
    incomeNote: '歯科衛生士がこの資格を取った後の年収データは見つかっていない。',
    // 合格率・受験者数の推移は reality が持つ。ここは「引き換えに失うもの・負うもの」だけ
    tradeoffs: ['歯科の手技からは離れる'],
    fitFor: ['安定'],
    cautions: {},
    requiredCertificationIds: [],
    // 2026-08-24 合格率の出典を記事から厚生労働省の実施状況へ差し替え
    source: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000187425_00013.html',
    sourceRequirements: 'https://www.miraicare.jp/column/care-manager-eligibility/',
    sourceRequirementsNote: '受験資格の条文そのものは介護保険法施行規則。厚労省サイト上で要件を一枚にまとめたページを見つけられず、記事を出典のまま残している',
    fetchedAt: '2026-08-23',
    confirmed: true,
  },

  {
    id: 'education',
    group: 'outside',
    field: null,
    requires: { years: 4, on: 'total', note: '歯科衛生士免許取得後4年以上の業務従事経験' },
    actions: [
      { when: '今月', text: '通える範囲の歯科衛生士養成校の求人を見る。専任教員講習会の申込は教育施設が出すので、採用されるほうが先。', url: null },
      { when: '採用後', text: '専任教員講習会 I〜V を受ける。1講習 25,000円・5日間連続の集合研修。', url: null },
    ],
    firstStep: '個人で始められる一歩はない。講習会の申込は教育施設が出す。',
    name: '歯科衛生士学校の専任教員',
    short: '養成校教員',
    summary: '養成校で歯科衛生士を育てる。要件が法令で決まっている数少ない道。',
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
    // 2026-08-24 出典を同窓会報から協議会の一次調査へ差し替え、最新（令和8年度）に更新。
    // 全国歯科衛生士教育協議会「歯科衛生士教育に関する現状調査」加盟185校・回収率100%。
    marketShrink: {
      years: [
        { year: 2021, label: '令和3年度', fillRate: 0.912, underfilledRatio: 0.483 },
        { year: 2023, label: '令和5年度', fillRate: 0.848, underfilledRatio: 0.680 },
        { year: 2024, label: '令和6年度', fillRate: 0.795, underfilledRatio: 0.731 },
        { year: 2025, label: '令和7年度', fillRate: 0.843, underfilledRatio: 0.643 },
        { year: 2026, label: '令和8年度', fillRate: 0.799, underfilledRatio: 0.745 },
      ],
      latest: { capacity: 9856, entrants: 7876, delta: -537, applicantRatio: 0.95 },
      note: '令和8年度は入学定員 9,856 名に対して入学者 7,876 名。前年より 537 名減りました。' +
            '定員に満たない養成校は 74.5% で、調査が始まって以来いちばん高い割合です。' +
            '志願者は定員の 0.95 倍で、1 倍を割っています。',
      teachers: {
        total: 1326, hygienists: 1050, dentists: 168, others: 108,
        certifiedRatio: 0.346, certifiedCount: 363,
        studentsPerHygienistTeacher: 22.5,
        note: '専任教員 1,326 名のうち歯科衛生士は 1,050 名。そのうち専任教員認定歯科衛生士は 363 名（34.6%）。',
      },
      source: 'https://www.kokuhoken.or.jp/zen-eiky/publicity/file/report_2026.pdf',
      capacitySource: 'https://www.kokuhoken.or.jp/zen-eiky/publicity/file/report_2026.pdf',
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

  // ---- 臨床の中で専門を深める道 ----
  // 分野（data/fields.js）と field で対応させる。市場の動きとセットで読ませるため。
  // 認定を取っても収入がどう変わるかを示す公的データは存在しない。そこは正直に書く。
  {
    id: 'clinic-perio',
    name: '歯周治療を専門にする',
    short: '歯周',
    group: 'clinical',
    field: '歯周治療',
    summary: 'いまの職場を離れずに、歯周病の診断・治療・メインテナンスを深める。',
    verdict: 'recommend',
    reality: '歯科衛生士の本業がそのまま伸びている領域です。学会の認定は平成17年からあり、令和6年8月までに 1,431 名。就業している歯科衛生士の 1% 弱にあたります。',
    entryRequirements: [
      '日本歯周病学会の会員になる（正会員・準会員どちらでも可）',
      '症例をそろえて提出する（様式1〜8・全顎エックス線写真）',
      '書類審査のあとケースプレゼンテーション試験',
      '登録料 22,000円。申請は年2回（6月・10〜11月）',
    ],
    blocker: null,
    income: null,
    incomeNote: 'この認定を取ると収入がいくら上がるか、という公的なデータはありません。資格手当の有無は医院ごとに決まります。',
    tradeoffs: ['症例をそろえるのに年単位かかる', '5年ごとの更新が要る', '学会の年会費がかかる'],
    fitFor: ['専門性'],
    cautions: {
      '転居できない': 'いまの職場のまま進められます。学会の試験と学術大会への参加で移動は必要です。',
    },
    requiredCertificationIds: ['perio-jsp'],
    source: 'https://www.perio.jp/member/certification/hygienist/',
    fetchedAt: '2026-08-24',
    confirmed: true,
    actions: [
      { when: '今月', text: '学会の「申請資格チェックシート」を開いて、いまの自分に何が足りないかを確認する。', url: 'https://www.perio.jp/member/certification/hygienist/application_new.shtml' },
      { when: '半年〜1年', text: '日本歯周病学会に入会し（正会員・準会員どちらでも可）、担当している患者さんの症例を様式1〜8にそって記録し始める。全顎エックス線写真が要る。', url: 'https://www.perio.jp/admisson/' },
      { when: '次の申請 6月 か 10〜11月', text: '症例をそろえて申請する。登録料 22,000円。書類審査のあとケースプレゼンテーション試験。', url: 'https://www.perio.jp/member/certification/hygienist/application_new.shtml' },
    ],
    firstStep: '日本歯周病学会の認定歯科衛生士のページで、申請資格チェックシートを開く。いまの自分に何が足りないかがその場で分かる。',
  },
  {
    id: 'clinic-ortho',
    name: '矯正を専門にする',
    short: '矯正',
    group: 'clinical',
    field: '矯正',
    summary: '矯正歯科の専門医療機関で、装置の管理と患者の口腔衛生管理を担う。',
    verdict: 'recommend',
    reality: '矯正を経験した人の割合は、年齢が下がるほど高くなります。10〜14歳の女性では 28.9%。歯科医師全体が減るなかで、矯正を専門にする歯科医師だけが増えています。',
    entryRequirements: [
      '矯正歯科の専門医療機関か、矯正も行う医院で働く',
      '認定を取るなら、日本成人矯正歯科学会の会員であること',
      '学会が認める矯正歯科専門医療機関等で原則常勤 3年以上の継続した矯正歯科臨床',
      '学会等への参加',
    ],
    blocker: null,
    income: null,
    incomeNote: '矯正の多くは自費のため、診療報酬の統計に出てきません。担当者の収入を示す公的データもありません。',
    // 難易度・要件は entryRequirements と actions が持つ。ここは「引き換えに失うもの・負うもの」だけ
    tradeoffs: ['職場が矯正をやっていないと経験が積めない'],
    fitFor: ['専門性'],
    cautions: {
      '転居できない': '矯正専門の医院が通える範囲にあるかどうかで決まります。',
    },
    requiredCertificationIds: ['ortho-jaao-2'],
    source: 'https://www.jaao.jp/index.php/doctor-and-co-dental/doctor_eiseishi_02/',
    fetchedAt: '2026-08-24',
    confirmed: true,
    requires: { years: 3, on: 'field', note: '学会が認める矯正歯科専門医療機関等で常勤3年以上の継続した矯正歯科臨床' },
    actions: [
      { when: '今月', text: 'いまの職場で矯正をどれくらい扱っているか数える。学会が認める矯正歯科専門医療機関等での臨床でないと、年数に入らない。', url: null },
      { when: '半年〜1年', text: '日本成人矯正歯科学会に入会し、学会・研修会に参加する。会員であることと学会等への参加が要件に入っている。', url: 'https://www.jaao.jp/index.php/doctor-and-co-dental/doctor_nyuukai/' },
      { when: '3年〜', text: '常勤3年の矯正臨床がそろったら、認定矯正歯科衛生士（2級）を申請する。累計でも約140名と狭い門。', url: 'https://www.jaao.jp/index.php/doctor-and-co-dental/doctor_eiseishi_02/' },
    ],
    firstStep: 'いまの職場で矯正をどれくらい扱っているか数えてみる。認定の要件は「常勤3年以上の継続した矯正歯科臨床」なので、そこが起点になる。',
  },
  {
    id: 'clinic-implant',
    name: 'インプラントを専門にする',
    short: 'インプラント',
    group: 'clinical',
    field: 'インプラント',
    summary: '手術の介助と、埋入後のメインテナンスを担当する。',
    verdict: 'conditional',
    reality: 'インプラント手術をしている歯科診療所は全国の 35.2%。3軒に1軒です。ただし1施設あたりの実施は月 1.5 件で、日常的に数をこなす仕事ではありません。',
    entryRequirements: [
      '日本口腔インプラント学会の正会員歴 2年以上',
      'インプラント治療の介助またはメインテナンスに携わっていること',
      'インプラント専門歯科衛生士試験の合格',
    ],
    blocker: null,
    income: null,
    incomeNote: '自費のため、市場規模も担当者の収入も公的統計に出てきません。',
    tradeoffs: ['職場がインプラントをやっていないと要件を満たせない', '実施件数は1施設あたり月1.5件と多くない'],
    fitFor: ['専門性'],
    cautions: {},
    requiredCertificationIds: ['implant-jsoi'],
    source: 'https://www.shika-implant.org/certification/hygienist/',
    fetchedAt: '2026-08-24',
    confirmed: true,
    actions: [
      { when: '今月', text: 'いまの職場がインプラントをやっているか、年に何件あるかを確認する。全国平均は1施設あたり月1.5件。介助かメインテナンスに携わっていることが要件になる。', url: null },
      { when: '半年〜1年', text: '日本口腔インプラント学会に入会する。申請できるのは正会員歴2年以上なので、入会した日が起点になる。', url: 'https://www.shika-implant.org/certification/hygienist/' },
      { when: '2年〜', text: '正会員歴2年を満たしたら、インプラント専門歯科衛生士試験を受ける。', url: 'https://www.shika-implant.org/certification/hygienist/' },
    ],
    firstStep: 'いまの職場がインプラントをやっているかを確認する。やっていなければ、まず学会に入って正会員歴を積むところから（要件は会員歴2年以上）。',
  },
  {
    id: 'clinic-pedo',
    name: '小児を専門にする',
    short: '小児',
    group: 'clinical',
    field: '小児',
    summary: '子どもの歯を診る。予防指導と食生活・栄養の指導が中心になる。',
    verdict: 'conditional',
    reality: '虫歯そのものが消えかけています。5〜9歳で虫歯を持つ子は30年で 36.3% から 2.5% へ。子どもの数も減り続けます。削る仕事は確実に減りますが、予防と食生活の指導は残ります。仕事の中身が入れかわる領域です。',
    entryRequirements: [
      '小児歯科をやっている医院で働く',
      '認定を取るなら、日本小児歯科学会に症例資料を提出（口腔内写真・PCR などの数値記録）',
      'う蝕予防だけでなく食生活指導・栄養指導も審査の対象',
    ],
    blocker: null,
    income: null,
    incomeNote: '小児歯科の担当者の収入を示す公的データはありません。',
    tradeoffs: ['市場そのものが縮んでいる', '治療から指導へ仕事の中身が変わる', '子どもの人口は2070年に約半分になる見通し'],
    fitFor: ['専門性'],
    cautions: {},
    requiredCertificationIds: ['pedo-jspd'],
    source: 'https://www.jspd.or.jp/dentist_system/about/',
    fetchedAt: '2026-08-24',
    confirmed: true,
    actions: [
      { when: '今月', text: '日本小児歯科学会の認定制度のページで、審査の中身を読む。口腔内写真と PCR などの数値記録が要る。', url: 'https://www.jspd.or.jp/dentist_system/about/' },
      { when: '半年〜1年', text: '担当した子どもの口腔内写真と数値記録を残し始める。う蝕予防だけでなく、食生活指導・栄養指導も審査の対象。', url: null },
      { when: '2〜3年', text: '症例資料をそろえて申請する。ただし削る仕事は減っていく領域。予防と食生活の指導に軸を移せるかを見ながら進める。', url: 'https://www.jspd.or.jp/dentist_system/about/' },
    ],
    firstStep: '縮んでいく市場だと分かったうえで選ぶかどうか。まず日本小児歯科学会の認定歯科衛生士制度のページを読んで、審査の中身を見る。',
  },
  {
    id: 'clinic-prevention',
    name: '予防とメインテナンスを深める',
    short: '予防',
    group: 'clinical',
    field: '予防・メインテナンス',
    summary: 'いまやっている仕事の延長。守るために通う人を担当し続ける。',
    verdict: 'recommend',
    reality: '歯科検診を受ける人が初めて6割を超え、80歳で20本以上の歯が残っている人も2年で1割ふえました。治療に来る人ではなく、守るために通う人がふえています。転職も資格も要らない、いちばん確実な道です。',
    entryRequirements: [
      '特別な資格は要らない。いまの仕事の延長',
      '深めるなら日本歯科衛生士会の認定（生活習慣病予防・糖尿病予防指導など6分野）',
      'その場合は専門研修 2コース・30単位以上 + 業務経験3年以上（うち実務1年以上）',
    ],
    blocker: null,
    income: null,
    incomeNote: '予防を深めたことで収入がどう変わるかを示す公的データはありません。',
    tradeoffs: ['職場が予防に力を入れていないと評価されにくい', '目に見える成果が出るまで時間がかかる'],
    fitFor: ['専門性', '安定'],
    cautions: {
      '転居できない': 'いまの職場のまま進められます。',
    },
    requiredCertificationIds: ['jdha-ninteidh'],
    source: 'https://www.jdha.or.jp/learning/ninteidh.html',
    fetchedAt: '2026-08-24',
    confirmed: true,
    requires: { years: 3, on: 'total', note: '歯科衛生士の業務経験3年以上（うちその分野の実務1年以上）' },
    actions: [
      { when: '今月', text: '日本歯科衛生士会の認定6分野から、自分の実務にいちばん近いものを1つ選ぶ。', url: 'https://www.jdha.or.jp/learning/ninteidh.html' },
      { when: '半年〜1年', text: '生涯研修制度の専門研修を受け始める。2コース・30単位以上が要件。実習をともなう研修では歯科衛生士賠償責任保険への加入が要る。', url: 'https://www.jdha.or.jp/learning/' },
      { when: '1〜2年', text: '30単位がそろったら認定を申請する。転職も職場を変えることも要らない道。', url: 'https://www.jdha.or.jp/learning/ninteidh.html' },
    ],
    firstStep: '日本歯科衛生士会の認定歯科衛生士のページで、6分野のうち自分の実務に近いものを1つ選ぶ。要件は業務経験3年以上とその分野の実務1年以上。',
  },

  // ---- 公表データが存在せず、画面に出さないもの ----
  // 一般臨床（いまの働き方そのもの）・病院口腔外科・フリーランスは、
  // 移行要件も収入も一次情報が取れていない。推測で埋めない。
  {
    id: 'hospital-oral-surgery', name: '病院歯科・口腔外科', short: '病院', group: 'clinical',
    field: '口腔外科', summary: null,
    entryRequirements: [], requiredCertificationIds: ['anesthesia-jdsa'], income: null,
    fitFor: [], tradeoffs: [], source: null, fetchedAt: null, confirmed: false,
  },
  {
    id: 'freelance', name: 'フリーランス・業務委託', short: 'フリー', group: 'outside',
    field: null, summary: null,
    entryRequirements: [], requiredCertificationIds: [], income: null,
    fitFor: [], tradeoffs: [], source: null, fetchedAt: null, confirmed: false,
  },
];
