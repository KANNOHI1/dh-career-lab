// 認定・専門資格の体系。各認定団体の公式情報を正とする。
// 保有者数と割合は research/sources.md の台帳に対応。取得日 2026-08-23。
// 割合 = 公表保有者数 ÷ 就業歯科衛生士 149,579。分母定義が学会側と一致する保証はないため概算。
const CERTIFICATIONS = [
  // ---- 麻酔系: 同名で呼ばれる別制度が 2 つある。保有者数が 40 倍以上違う ----
  {
    id: 'anesthesia-jdsa',
    name: '認定歯科衛生士（歯科麻酔）',
    issuer: '一般社団法人 日本歯科麻酔学会 (JDSA)',
    holders: 214,
    holdersAsOf: '2025-08',
    holderRatio: 0.0014,                  // 約 0.14%
    requirements: [
      '学会入会後1年以上・実務経験5年以上',
      '20症例の症例一覧表および症例報告書の提出（入会後・遡って3年以内）',
      'AHA または日本救急医学会認定の BLS コース修了',
      '学会認定医の指導',
      '筆記試験および口頭試問の合格',
    ],
    durationMonths: null,                 // TODO: 標準取得期間の公表なし
    costYen: 20000,                       // 申請 10,000 + 登録 10,000（別途 学会年会費）
    costNote: '学会年会費は別途。金額未取得',
    renewal: '5年ごと・更新料 10,000円・20単位以上（うち学会総会/学術集会出席 10単位以上必須）',
    unlocksTracks: ['hospital-oral-surgery', 'education'],
    incomeImpact: null,                   // 出典のある相場データなし。求人個別事例のみ
    source: 'https://jdsa.jp/info/history.html',
    sourceRule: 'https://jdsa.jp/media-download/258/4c0fc79dd172078b/PDF/',
    fetchedAt: '2026-08-23',
    usableAsRarity: true,
    realityNote: null,
  },
  {
    id: 'anesthesia-jda',
    name: '臨床歯科麻酔認定歯科衛生士',
    issuer: '一般社団法人 日本歯科医学振興機構 (JDA)',
    // 2026-08-24 発行元の公式サイトで更新（99回・受講総数 11,203名）。
    // 第1弾の 9,000名（二次情報）から差し替えた。
    holders: 11203,                       // 累計受講者。歯科医師を含むため DH 単独の人数は不明
    holdersAsOf: '2026-08-24',
    holdersNote: '累計受講者数（講習会99回）。歯科医師を含む。歯科衛生士単独の保有者数は非公表',
    holderRatio: null,                    // 累計かつ職種混在のため算出しない
    requirements: [
      '実務経験3年以上（免許取得後2年以上）',
      '1日の講習の受講',
      '筆記試験の合格',
      '歯科医師の推薦',
    ],
    durationMonths: 1,                    // 1日講習 + 試験
    costYen: 40000,                       // 講習・試験 28,000 + 登録 12,000
    // 台帳で「5年ごと / 3年ごと」と割れていたが、発行元の公式で 3 年と確定（2026-08-24）
    renewal: '3年ごと（継続講習2つ以上の受講 + 更新料 10,000円）',
    unlocksTracks: ['clinic-general', 'clinic-implant'],
    incomeImpact: null,
    source: 'https://www.japan-da.com/system',
    sourceSecondary: 'https://oned.jp/career/articles/6851be64-bc6c-4b18-a71e-aa94e224b1e8',
    fetchedAt: '2026-08-24',
    // 発行元自身が公式サイトで明言している（2026-08-24 確認）:
    //   「『臨床歯科麻酔認定歯科衛生士』の認定があれば麻酔ができるということではありません」
    //   「独自の審査基準のもと任意で認定するものであり、国家資格や公的資格とは性質の違うもの」
    issuerDisclaimer: '認定があれば麻酔ができるということではない。国家資格・公的資格とは性質が違う',
    // 希少性の根拠には使わない。現場の実態がそれを支持しないため。
    // 保有者の証言（2026-08-23 聞き取り）:
    //   「衛生士は法律上本来みんな出来る。今までそこまでやることじゃなかったが、
    //     最近そういう流れになってきて、セミナーを受けて認定されれば正式にできるから
    //     周りも増えている。うちの衛生士はみんなできる」
    // 1日講習で取得でき、保有者が増加中。医院単位で全員保有のケースがある。
    usableAsRarity: false,
    realityNote: '1日の講習で取得でき、保有者は増加中。法律上は資格がなくても' +
                 '歯科医師の指示・監督下で実施できるため、資格そのものが権限を増やすわけではない。' +
                 '医院によっては在籍する歯科衛生士が全員保有している。',
    realitySource: '保有者本人からの聞き取り（2026-08-23）',
  },

  // ---- 領域別の学会認定 ----
  {
    id: 'perio-jsp',
    name: '認定歯科衛生士（歯周病）',
    issuer: '特定非営利活動法人 日本歯周病学会',
    // 2026-08-24 学会公式で更新。制度は平成17年発足、令和6年8月1日までに 1,431名。
    holders: 1431,
    holdersAsOf: '2024-08-01',
    holderRatio: 0.0096,                  // 1,431 ÷ 就業DH 149,579。当サイトの計算
    requirements: [
      '日本歯周病学会の会員であること（正会員・準会員いずれも可）',
      '症例の提出（様式1〜8・症例テンプレート・全顎エックス線写真）',
      '書類審査の通過',
      'ケースプレゼンテーション試験の合格',
    ],
    applicationWindow: '年2回（6月・10〜11月）',
    durationMonths: null,                 // 申請から認定までの標準期間の公表なし
    costYen: 22000,                       // 登録料（税込）。別途 学会年会費・申請料
    costNote: '登録料 22,000円（税込）。ほかに学会の年会費と申請料がかかる',
    renewal: '5年ごと',
    unlocksTracks: ['clinic-perio'],
    incomeImpact: null,                   // この認定で収入がどう変わるかを示す公的データはない

    source: 'https://www.perio.jp/member/certification/hygienist/',
    sourceApplication: 'https://www.perio.jp/member/certification/hygienist/application_new.shtml',
    fetchedAt: '2026-08-23',
  },
  {
    id: 'implant-jsoi',
    name: 'インプラント専門歯科衛生士',
    issuer: '公益社団法人 日本口腔インプラント学会',
    holders: 1167,
    holderRatio: 0.0078,
    // 2026-08-24 学会公式で要件を確認
    requirements: [
      '日本口腔インプラント学会の正会員歴 2年以上',
      'インプラント治療の介助またはメインテナンスに携わっていること',
      'インプラント専門歯科衛生士試験の合格',
    ],
    durationMonths: null,
    costYen: 11000,                       // 試験審査料
    costNote: '試験審査料 11,000円（税込）。ほかに学会の年会費。※金額は二次情報での確認にとどまる',
    costVerified: false,                  // 学会公式ページ上で金額を直接確認できていない
    renewal: null,                         // TODO: 更新規程は規程PDF内。未取得
    unlocksTracks: ['clinic-implant'],
    incomeImpact: null,
    source: 'https://www.shika-implant.org/certification/hygienist/',
    fetchedAt: '2026-08-24',
  },
  {
    id: 'ortho-jaao-2',
    name: '認定矯正歯科衛生士（2級）',
    issuer: '日本成人矯正歯科学会',
    // 2026-08-24 学会公式で確認。「これまでに約140名の方が取得されました」＝**累計取得者**。
    // 更新制度があるため、いま有効な認定者はこれより少ない可能性がある。
    holders: 140,                         // 累計取得者（約140名）
    holdersNote: '累計の取得者数。現在有効な認定者数ではない',
    holderRatio: 0.0009,                  // 累計 ÷ 就業DH。概算
    requirements: [
      '日本の歯科衛生士免許',
      '本学会の会員であること',
      '学会が認める矯正歯科専門医療機関等で原則常勤3年以上の継続した矯正歯科臨床',
      '本学会の学会等に参加していること',
    ],
    durationMonths: null,
    costYen: null,
    renewal: '更新制度あり（申請受付 1月1日〜6月30日）',
    unlocksTracks: ['clinic-ortho'],
    incomeImpact: null,
    source: 'https://www.jaao.jp/index.php/doctor-and-co-dental/doctor_eiseishi_02/',
    fetchedAt: '2026-08-24',
  },
  {
    id: 'whitening-jdshinbi',
    name: 'ホワイトニングコーディネーター',
    issuer: '一般社団法人 日本歯科審美学会',
    // 2026-08-24 検証: 保有者数を確定できなかったため null にした。
    //  - 学会公式（下記 source）に認定者数の記載がない
    //  - 従来の出典 1,452名（2021年8月末）は歯科医院のブログが出典
    //  - 別途「2013年3月末 4,791名」という数字もあり、桁が合わない
    //  - 公式の講習会日程は年5回・定員合計 1,270名。この規模で累計1,452名はあり得ない
    // 数値は出さない。資格の存在と受験資格だけを扱う。
    holders: null,                        // 公表されていない
    holdersNote: '学会が認定者数を公表していない。出回っている数値は相互に矛盾する',
    holderRatio: null,
    requirements: [
      '歯科衛生士のみ受講・受験可',
      '学会主催の講習会の受講と認定試験の合格',
    ],
    durationMonths: null,
    costYen: 8000,                        // 認定講習会参加費 + 受験料
    renewal: '更新あり（新規向け講習会は更新対象外）',
    unlocksTracks: [],
    incomeImpact: null,
    source: 'https://www.jdshinbi.net/academic/whitening/',
    fetchedAt: '2026-08-24',
  },

  // ---- 日本歯科衛生士会の認定歯科衛生士（認定分野A）----
  // 2026-08-24 https://www.jdha.or.jp/learning/ninteidh.html で確認。
  // 6分野あり、共通の受講者基準が決まっている。分野ごとの保有者数は公表されていない。
  {
    id: 'jdha-ninteidh',
    name: '認定歯科衛生士（認定分野A・6分野）',
    issuer: '公益社団法人 日本歯科衛生士会',
    fields6: [
      '生活習慣病予防（特定保健指導・食生活改善指導担当者研修）',
      '摂食嚥下リハビリテーション',
      '在宅療養指導・口腔機能管理',
      '糖尿病予防指導（徳島大学歯学部協力）',
      '医科歯科連携・口腔機能管理（東京歯科大学委託）',
      '歯科医療安全管理（広島大学歯学部委託）',
    ],
    holders: null,                        // 分野別の保有者数は公表されていない
    holdersNote: '分野ごとの認定者数は公表されていない',
    holderRatio: null,
    requirements: [
      '生涯研修制度の専門研修を 2コース・30単位以上（または指定研修で30単位）修了',
      '歯科衛生士の業務経験 3年以上（うち各認定分野の実務経験 1年以上）',
      '実習・演習をともなう認定研修では歯科衛生士賠償責任保険への加入',
    ],
    durationMonths: null,
    costYen: null,                        // TODO: 研修費用は分野・開催回ごとに異なり一覧の公表なし
    renewal: null,                        // TODO: 更新規程は未取得
    unlocksTracks: ['home-visit', 'clinic-perio'],
    incomeImpact: null,
    source: 'https://www.jdha.or.jp/learning/ninteidh.html',
    fetchedAt: '2026-08-24',
  },
  {
    id: 'pedo-jspd',
    name: '認定歯科衛生士（小児歯科）',
    issuer: '一般社団法人 日本小児歯科学会',
    // 2007年に制度開始。学会が技術・知識を審査して認定する。
    holders: null,                        // TODO: 認定者数の公表を確認できていない（名簿は五十音別で掲載）
    holderRatio: null,
    requirements: [
      '症例資料の作成と提出（口腔内写真・PCR などの数値記録）',
      'う蝕予防の指導だけでなく、食生活指導・栄養指導も審査の対象',
    ],
    durationMonths: null,
    costYen: null,                        // TODO
    renewal: '更新申請あり',
    unlocksTracks: ['clinic-pedo'],
    incomeImpact: null,
    source: 'https://www.jspd.or.jp/dentist_system/about/',
    fetchedAt: '2026-08-24',
  },

  // ---- 教育トラックの必須資格 ----
  {
    id: 'teacher-certified',
    name: '専任教員認定歯科衛生士',
    issuer: '（歯科衛生士学校養成所指定規則に基づく講習会実施団体）',
    holders: null,                        // TODO: 保有者数の公表なし
    holderRatio: null,
    requirements: [
      '歯科衛生士免許取得後 4 年以上の業務従事経験',
      '歯科衛生士専任教員講習会 I〜V の受講・修了',
    ],
    durationMonths: null,                 // TODO: 講習会の開催頻度・所要期間は未取得
    costYen: null,                        // TODO
    renewal: null,
    unlocksTracks: ['education'],
    incomeImpact: null,
    source: 'https://www.mhlw.go.jp/web/t_doc?dataId=00ta6593&dataType=1&pageNo=1',
    sourceSecondary: 'https://www.personalassist.co.jp/blog_6/dental-hygienist-teacher/',
    fetchedAt: '2026-08-23',
  },
];

// 資格の限界。診断で率直に提示する材料。
const CERTIFICATION_CAVEAT = {
  legalScope: '歯科衛生士法第2条の「診療の補助」に基づき、歯科医師の具体的指示・監督下であれば' +
              '資格の有無を問わず浸潤麻酔・表面麻酔は適法。伝達麻酔・全身麻酔は不可。',
  implication: 'これらの認定は業務独占を与えるものではなく、技能の対外的な証明として機能する。' +
               '院長が許可しなければ実施できないという構造的制約がある。',
  source: 'https://dental-fitness.co.jp/column/dental-hygienist-anesthesia/',
  fetchedAt: '2026-08-23',
};
