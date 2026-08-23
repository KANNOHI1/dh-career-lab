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
  },
  {
    id: 'anesthesia-jda',
    name: '臨床歯科麻酔認定歯科衛生士',
    issuer: '一般社団法人 日本歯科医学振興機構 (JDA)',
    holders: 9000,                        // 累計受講者。歯科医師を含むため DH 単独の人数は不明
    holdersNote: '累計受講者数。歯科医師を含む。歯科衛生士単独の保有者数は不明',
    holderRatio: null,                    // 累計かつ職種混在のため算出しない
    requirements: [
      '実務経験3年以上（免許取得後2年以上）',
      '1日の講習の受講',
      '筆記試験の合格',
      '歯科医師の推薦',
    ],
    durationMonths: 1,                    // 1日講習 + 試験
    costYen: 40000,                       // 講習・試験 28,000 + 登録 12,000
    renewal: '5年ごと',
    unlocksTracks: ['clinic-general', 'clinic-implant'],
    incomeImpact: null,
    source: 'https://oned.jp/career/articles/6851be64-bc6c-4b18-a71e-aa94e224b1e8',
    fetchedAt: '2026-08-23',
  },

  // ---- 領域別の学会認定 ----
  {
    id: 'perio-jsp',
    name: '認定歯科衛生士（歯周病）',
    issuer: '特定非営利活動法人 日本歯周病学会',
    holders: 1356,
    holderRatio: 0.0090,
    requirements: [],                     // TODO: 未調査
    durationMonths: null,
    costYen: null,
    renewal: null,
    unlocksTracks: [],
    incomeImpact: null,
    source: 'https://www.perio.jp/member/certification/hygienist/map.shtml',
    fetchedAt: '2026-08-23',
  },
  {
    id: 'implant-jsoi',
    name: 'インプラント専門歯科衛生士',
    issuer: '公益社団法人 日本口腔インプラント学会',
    holders: 1167,
    holderRatio: 0.0078,
    requirements: [],                     // TODO: 未調査
    durationMonths: null,
    costYen: null,
    renewal: null,
    unlocksTracks: ['clinic-implant'],
    incomeImpact: null,
    source: 'https://jsoi-th.org/syomu.html',
    fetchedAt: '2026-08-23',
  },
  {
    id: 'ortho-jaao-2',
    name: '認定矯正歯科衛生士（2級）',
    issuer: '日本成人矯正歯科学会',
    holders: 140,                         // 約140名
    holderRatio: 0.0009,
    requirements: [],                     // TODO: 未調査
    durationMonths: null,
    costYen: null,
    renewal: null,
    unlocksTracks: ['clinic-ortho'],
    incomeImpact: null,
    source: 'https://oned.jp/career/articles/6471d62c-6ddc-4667-894b-910780b4d8b7',
    fetchedAt: '2026-08-23',
  },
  {
    id: 'whitening-jdshinbi',
    name: 'ホワイトニングコーディネーター',
    issuer: '一般社団法人 日本歯科審美学会',
    holders: 1452,
    holdersAsOf: '2021-08',
    holderRatio: 0.0097,
    requirements: [],
    durationMonths: null,
    costYen: null,
    renewal: '学術大会参加による更新が必要',
    unlocksTracks: [],
    incomeImpact: null,
    source: 'https://www.shimokita-brene-dental.com/blog/',
    fetchedAt: '2026-08-23',
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
