// キャリアトラック定義。移行要件が一次情報で確認できたものだけ確定扱いにする。
// 未調査の項目は null のまま。台帳: research/sources.md
const TRACKS = [
  {
    id: 'education',
    name: '歯科衛生士学校の専任教員',
    summary: '養成校で歯科衛生士を育てる。要件が法令で明示されている唯一のトラック',
    // 厚労省 歯科衛生士学校養成所指定規則に基づく
    entryRequirements: [
      '歯科衛生士免許取得後 4 年以上の業務従事経験',
      '歯科衛生士専任教員講習会 I〜V の受講・修了（専任教員認定歯科衛生士）',
    ],
    requiredCertificationIds: ['teacher-certified'],
    incomeRangeId: null,                  // TODO: 専任教員の年収データが存在しない
    demandTrend: 'increasing',
    demandEvidence: '養成所就業者が令和4年末→令和6年末で 645人（36.5%）減少',
    demandSource: 'https://www.jdha.or.jp/aboutdh/shugyo.html',
    fitFor: ['specialization', 'stability'],
    tradeoffs: ['臨床の最前線から離れる', '臨床スキルの維持が難しくなる'],
    source: 'https://www.mhlw.go.jp/web/t_doc?dataId=00ta6593&dataType=1&pageNo=1',
    fetchedAt: '2026-08-23',
    confirmed: true,
  },

  // ---- 以下は未調査。要件・年収・求人量のいずれも一次情報を取れていない ----
  // 推測で埋めない。診断では「調査中」と正直に表示する。
  {
    id: 'clinic-general',
    name: '一般歯科クリニック（臨床）',
    summary: null,
    entryRequirements: [], requiredCertificationIds: [],
    incomeRangeId: null, demandTrend: null, fitFor: [], tradeoffs: [],
    source: null, fetchedAt: null, confirmed: false,
  },
  {
    id: 'clinic-ortho',
    name: '矯正歯科',
    summary: null,
    entryRequirements: [], requiredCertificationIds: ['ortho-jaao-2'],
    incomeRangeId: null, demandTrend: null, fitFor: [], tradeoffs: [],
    source: null, fetchedAt: null, confirmed: false,
  },
  {
    id: 'clinic-implant',
    name: 'インプラント・自費中心',
    summary: null,
    entryRequirements: [], requiredCertificationIds: ['implant-jsoi'],
    incomeRangeId: null, demandTrend: null, fitFor: [], tradeoffs: [],
    source: null, fetchedAt: null, confirmed: false,
  },
  {
    id: 'hospital-oral-surgery',
    name: '病院歯科・口腔外科',
    summary: null,
    entryRequirements: [], requiredCertificationIds: ['anesthesia-jdsa'],
    incomeRangeId: null, demandTrend: null, fitFor: [], tradeoffs: [],
    source: null, fetchedAt: null, confirmed: false,
  },
  {
    id: 'home-visit',
    name: '訪問歯科診療',
    summary: null,
    entryRequirements: [], requiredCertificationIds: [],
    incomeRangeId: null, demandTrend: null, fitFor: [], tradeoffs: [],
    source: null, fetchedAt: null, confirmed: false,
  },
  {
    id: 'corporate',
    name: '企業内歯科衛生士（メーカー・商社）',
    // 2026-08-23 北海道デンタルショーで実在を確認（NSK 所属 DH が製品セミナーに登壇）。
    // 実在は確かだが、求人数・年収・採用規模は未調査。RESEARCH_BRIEF に追加章として再調査する。
    summary: null,
    entryRequirements: [], requiredCertificationIds: [],
    incomeRangeId: null, demandTrend: null, fitFor: [], tradeoffs: [],
    source: null, fetchedAt: null, confirmed: false,
  },
  {
    id: 'public-health',
    name: '行政・公衆衛生',
    summary: null,
    entryRequirements: [], requiredCertificationIds: [],
    incomeRangeId: null, demandTrend: null, fitFor: [], tradeoffs: [],
    source: null, fetchedAt: null, confirmed: false,
  },
  {
    id: 'freelance',
    name: 'フリーランス・業務委託',
    summary: null,
    entryRequirements: [], requiredCertificationIds: [],
    incomeRangeId: null, demandTrend: null, fitFor: [], tradeoffs: [],
    source: null, fetchedAt: null, confirmed: false,
  },
];
