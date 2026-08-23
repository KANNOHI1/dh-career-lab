// 診断本体。data/*.js から導出のみする。数値をここに直書きしない。
// 回答は fetch/XHR に載せない・localStorage に保存しない・URL に載せない。

const A = {};                                   // 回答
const $ = (s, r) => (r || document).querySelector(s);

const REGIONS = ['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'];
const FIELDS = ['一般','矯正','インプラント','口腔外科','小児','歯周治療','予防・メインテナンス','訪問','審美'];
const YN = ['はい','いいえ','覚えていない'];

const hasAnes = () => (A.certs || []).some(c => c.indexOf('麻酔') >= 0);

const STEPS = [
  {
    title: '今の働き方', note: '選択するだけです。30秒ほど。',
    qs: [
      { id:'workplace', t:'今の勤務先は？', type:'radio',
        opts:['一般歯科','矯正歯科','口腔外科・病院','訪問診療','企業','教育機関','行政・公衆衛生','離職中'] },
      { id:'employment', t:'雇用形態は？', type:'radio',
        opts:['常勤','パート・非常勤','フリーランス','離職中'] },
      { id:'daysPerWeek', t:'週に何日働いていますか？', type:'number', unit:'日', range:[1, 7] },
      { id:'income', t:'今の年収は？', type:'radio',
        hint:'ざっくりで大丈夫です。答えたくなければ選ばなくて構いません。',
        opts:['〜250万','250〜350万','350〜450万','450〜550万','550万〜','答えたくない'] },
      { id:'region', t:'お住まいの地域は？', type:'select', opts:REGIONS },
    ],
  },
  {
    title: '経験の内訳', note: 'ここが一番大事なところです。1分ほど。',
    qs: [
      { id:'years', t:'歯科衛生士として働いた年数は？', type:'number', unit:'年', range:[0, 40],
        hint:'ブランクを除いた実働の年数' },
      { id:'breakYears', t:'ブランクはありましたか？ 何年くらい？', type:'number', unit:'年', range:[0, 20],
        hint:'なければ 0' },
      { id:'fields', t:'通った診療領域は？', type:'checkbox', opts:FIELDS, hint:'当てはまるものすべて' },
      { id:'fieldYears', t:'それぞれ何年くらいですか？', type:'fieldYears',
        hint:'「かじった」のか「主戦場だった」のかを分けたいだけです。おおよそで構いません。' },
      { id:'certs', t:'持っている認定・専門資格は？', type:'checkbox',
        hint:'当てはまるものすべて。なければ空欄で',
        opts:['麻酔系の認定（認定麻酔衛生士など）','歯周病の認定','インプラントの認定','矯正の認定','ホワイトニングコーディネーター','その他'] },
      { id:'certOther', t:'その他の資格があれば', type:'text',
        showIf:() => (A.certs || []).includes('その他') },
      { id:'certUse', t:'その資格、実務で使っていますか？', type:'radio',
        opts:['よく使う','たまに使う','ほぼ使わない'], showIf:() => (A.certs || []).length > 0 },
      { id:'handedness', t:'利き手は？', type:'radio', opts:['右','左','両方'] },
    ],
  },
  {
    title: '確認したいこと', note: '同じ名前の資格が複数あるため、取り方をうかがいます。',
    qs: [
      { id:'anesHead', type:'head', t:'麻酔の認定について',
        hint:'「認定麻酔衛生士」と呼ばれる資格は制度が2つあり、取り方が違います。覚えている範囲で構いません。',
        showIf:hasAnes },
      { id:'anesCases', t:'取るとき、症例の報告書を提出しましたか？', hint:'数十件単位のもの',
        type:'radio', opts:YN, showIf:hasAnes },
      { id:'anesOral', t:'口頭試問（面接形式の試験）はありましたか？', type:'radio', opts:YN, showIf:hasAnes },
      { id:'anesBls', t:'BLS（一次救命処置）のコース修了は必要でしたか？', type:'radio', opts:YN, showIf:hasAnes },
      { id:'anesOneDay', t:'講習は1日で終わりましたか？', type:'radio', opts:YN, showIf:hasAnes },
      { id:'anesSociety', t:'学会への入会が必要でしたか？', type:'radio', opts:YN, showIf:hasAnes },

      { id:'roleHead', type:'head', t:'これまでにあったこと',
        hint:'自己評価ではなく、実際にあったかどうかだけ答えてください。' },
      { id:'taught',    t:'新人・後輩の教育を任されたことは？', type:'radio', opts:['ある','ない'] },
      { id:'taughtN',   t:'何人くらい？', type:'number', unit:'人', range:[1, 30], showIf:() => A.taught === 'ある' },
      { id:'represent', t:'学会・展示会・セミナーに医院の代表として行ったことは？', type:'radio', opts:['ある','ない'] },
      { id:'consulted', t:'院長や同僚から相談される側になることは？', type:'radio', opts:['よくある','ときどきある','ない'] },
      { id:'requested', t:'患者さんから指名されることは？', type:'radio', opts:['よくある','ときどきある','ない'] },
      { id:'chooseKit', t:'器材・材料の選定に関わったことは？', type:'radio', opts:['ある','ない'] },
      { id:'introduced',t:'新しい技術・材料を医院に最初に導入したことは？', type:'radio', opts:['ある','ない'] },
    ],
  },
  {
    title: '望む方向と制約', note: '出せる選択肢を絞るために使います。40秒ほど。',
    qs: [
      { id:'priority', t:'大事な順に、上位3つを選んでください', type:'checkbox', max:3,
        hint:'4つ目を選ぶと、いちばん先に選んだものが外れます。',
        opts:['収入','時間の自由','専門性','自分の裁量','安定'] },
      { id:'constraints', t:'動かせない条件はありますか？', type:'checkbox',
        opts:['転居できない','夜間は無理','週◯日以上は無理','学費に上限がある','特になし'] },
      { id:'teachInterest', t:'人に教えることに興味はありますか？', type:'radio',
        opts:['すごくある','少しある','わからない','ない'] },
      { id:'future', t:'3年後、どうなっていたいですか？', type:'radio',
        opts:['今のまま安定','専門を深める','教える側になる','独立する','職種を変える','わからない'],
        hint:'「わからない」で構いません。むしろそこから考えるための質問です。' },
    ],
  },
  {
    title: '工夫していること', note: 'ここは任意です。書かなくても結果は全部読めます。',
    qs: [
      { id:'freeHead', type:'head', t:'',
        hint:'ここに書いたことが、そのまま「人に教えられること」の材料になります。うまく言えなくて大丈夫です。' },
      { id:'leftHand', t:'左利きで困った場面と、どう対処したか', type:'textarea',
        hint:'器具、ポジション、ミラーの角度、ユニットの配置など。思いつく範囲で。',
        showIf:() => A.handedness === '左' },
      { id:'comeback', t:'ブランクから戻るとき、一番きつかったことと、どう戻したか', type:'textarea',
        showIf:() => Number(A.breakYears) > 0 },
      { id:'explain', t:'後輩や患者さんに説明するとき、自分なりに工夫していること', type:'textarea' },
      { id:'basis', t:'「これが言えたら人に教えられる」と思うものは何ですか？', type:'textarea',
        hint:'いま足りないと感じているものを、そのまま書いてください。' },
    ],
  },
];

// ---------- レンダリング ----------
let cur = 0;

function render(keepScroll) {
  const y = keepScroll ? window.scrollY : 0;
  const prog = $('#progress');
  prog.innerHTML = STEPS.map((_, i) =>
    '<span class="' + (i <= cur ? 'done' : '') + '"></span>').join('') +
    '<span class="' + (cur >= STEPS.length ? 'done' : '') + '"></span>';

  const host = $('#steps');
  host.innerHTML = '';
  if (cur >= STEPS.length) { host.appendChild(result()); window.scrollTo(0, y); return; }

  const st = STEPS[cur];
  const el = document.createElement('div');
  el.className = 'step active';
  el.innerHTML = '<div class="step-head"><div class="n">STEP ' + (cur + 1) + ' / ' + STEPS.length +
    '</div><h2>' + st.title + '</h2><p class="note">' + st.note + '</p></div>';

  st.qs.forEach(q => { if (!q.showIf || q.showIf()) el.appendChild(field(q)); });

  const nav = document.createElement('div');
  nav.className = 'nav';
  if (cur > 0) nav.innerHTML = '<button class="ghost" id="back">戻る</button>';
  nav.innerHTML += '<button id="next">' + (cur === STEPS.length - 1 ? '結果を見る' : '次へ') + '</button>';
  el.appendChild(nav);
  host.appendChild(el);

  if ($('#back')) $('#back').onclick = () => { cur--; render(); };
  $('#next').onclick = () => { cur++; render(); };
  window.scrollTo(0, y);
}

// 数値のプルダウン。スマホで数字キーボードを出さずに選べるようにする。
// 上限は「N年以上」として頭打ちを表現する。
function numberSelect(range, unit, value, onPick) {
  const [min, max] = range;
  const sel = document.createElement('select');
  sel.className = 'num';
  let html = '<option value="">選択</option>';
  for (let i = min; i <= max; i++) {
    const label = i + unit + (i === max ? '以上' : '');
    html += '<option value="' + i + '"' + (value === i ? ' selected' : '') + '>' + label + '</option>';
  }
  sel.innerHTML = html;
  sel.onchange = () => { onPick(sel.value === '' ? null : Number(sel.value)); };
  return sel;
}

function field(q) {
  const d = document.createElement('div');
  d.className = 'q';
  if (q.type === 'head') {
    d.innerHTML = (q.t ? '<h3>' + q.t + '</h3>' : '') + (q.hint ? '<p class="hint">' + q.hint + '</p>' : '');
    return d;
  }
  d.innerHTML = '<div class="qt">' + q.t + '</div>' + (q.hint ? '<p class="hint">' + q.hint + '</p>' : '');
  const box = document.createElement('div');

  if (q.type === 'radio' || q.type === 'checkbox') {
    box.className = 'opts';
    q.opts.forEach(o => {
      const lb = document.createElement('label');
      const inp = document.createElement('input');
      inp.type = q.type; inp.name = q.id; inp.value = o;
      if (q.type === 'radio') inp.checked = A[q.id] === o;
      else inp.checked = (A[q.id] || []).includes(o);
      inp.onchange = () => {
        if (q.type === 'radio') {
          A[q.id] = o;
        } else {
          const now = A[q.id] || [];
          A[q.id] = inp.checked ? now.concat([o]) : now.filter(x => x !== o);
          if (q.max && A[q.id].length > q.max) A[q.id] = A[q.id].slice(-q.max);
        }
        // 同じステップ内の表示に影響するものだけ再描画する（スクロール位置は保持）
        // priority は上限3件で古い選択が外れるため、チェック状態を合わせ直す必要がある
        if (['certs', 'taught', 'fields', 'priority'].includes(q.id)) render(true);
      };
      lb.appendChild(inp);
      lb.appendChild(document.createTextNode(o));
      box.appendChild(lb);
    });
  } else if (q.type === 'number') {
    box.appendChild(numberSelect(q.range || [0, 30], q.unit || '', A[q.id],
      v => { A[q.id] = v; }));
  } else if (q.type === 'select') {
    const sel = document.createElement('select');
    sel.innerHTML = '<option value="">選択してください</option>' +
      q.opts.map(o => '<option' + (A[q.id] === o ? ' selected' : '') + '>' + o + '</option>').join('');
    sel.onchange = () => { A[q.id] = sel.value || null; };
    box.appendChild(sel);
  } else if (q.type === 'text') {
    const inp = document.createElement('input');
    inp.type = 'text'; inp.style.width = '100%'; inp.value = A[q.id] || '';
    inp.oninput = () => { A[q.id] = inp.value; };
    box.appendChild(inp);
  } else if (q.type === 'textarea') {
    const ta = document.createElement('textarea');
    ta.value = A[q.id] || '';
    ta.oninput = () => { A[q.id] = ta.value; };
    box.appendChild(ta);
  } else if (q.type === 'fieldYears') {
    box.className = 'subq';
    const sel = A.fields || [];
    A.fieldYears = A.fieldYears || {};
    if (!sel.length) {
      box.innerHTML = '<span class="hint">上で領域を選ぶと、ここに入力欄が出ます。</span>';
    }
    sel.forEach(f => {
      const row = document.createElement('div');
      row.innerHTML = '<span class="lb">' + f + '</span>';
      row.appendChild(numberSelect([0, 30], '年', A.fieldYears[f], v => { A.fieldYears[f] = v; }));
      box.appendChild(row);
    });
  }
  d.appendChild(box);
  return d;
}

// ---------- 結果 ----------
const pct = n => (n * 100).toFixed(2).replace(/\.?0+$/, '') + '%';
const man = y => (y / 10000).toFixed(0) + '万円';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// 麻酔認定の判別。断定できないときは断定しない。
function anesthesia() {
  if (!hasAnes()) return null;
  if (A.anesCases === 'はい') return { id:'anesthesia-jdsa', sure:true };
  const soc = [A.anesOral, A.anesBls, A.anesSociety].filter(v => v === 'はい').length;
  if (soc >= 2) return { id:'anesthesia-jdsa', sure:true };
  if (A.anesOneDay === 'はい' && A.anesCases === 'いいえ') return { id:'anesthesia-jda', sure:true };
  return { id:null, sure:false };
}

function card(cls, html) {
  const d = document.createElement('div');
  d.className = cls; d.innerHTML = html; return d;
}

function result() {
  const w = document.createElement('div');
  w.className = 'step active';
  w.innerHTML = '<div class="step-head"><div class="n">RESULT</div>' +
    '<h2>いま持っているもの</h2>' +
    '<p class="note">自己評価ではなく、答えていただいた事実と公的統計だけで並べています。</p></div>';

  const M = MARKET, S = SALARY;

  // 1. 母数
  w.appendChild(card('card',
    '<span class="cap">全国で働いている歯科衛生士</span>' +
    '<span class="big">' + M.employedHygienists.toLocaleString() + ' 人</span>' +
    '<span class="cap">このうち ' + pct(M.workplaceBreakdown.clinic.ratio) + ' が診療所勤務。' +
    'さらに免許を持ちながら働いていない人が ' + M.latentHygienists.toLocaleString() + ' 人います' +
    '（就業率 ' + pct(M.employmentRate) + '）。</span>' +
    '<p class="src">出典: 厚生労働省 令和6年 衛生行政報告例 / ' + M.source + '</p>'));

  // 2. 経験年数
  if (A.years) {
    w.appendChild(card('card',
      '<span class="cap">あなたの実働年数</span>' +
      '<span class="big">' + A.years + ' 年</span>' +
      '<span class="cap">歯科衛生士の平均年齢は ' + M.averageAge + ' 歳、40代が ' +
      pct(M.ageDistribution.forties) + '、50代以上が ' + pct(M.ageDistribution.fiftiesAndOver) +
      ' を占めます。経験年数そのものの分布は公表されていないため、「上位◯%」という数字は出せません。</span>' +
      '<p class="src">出典: 令和4年 賃金構造基本統計調査 ほか</p>'));
  }

  // 3. 領域の深さ（希少性は数値で主張しない）
  const fy = A.fieldYears || {};
  const deep = (A.fields || []).filter(f => fy[f] >= 3);
  if ((A.fields || []).length) {
    let html = '<span class="cap">通ってきた領域</span>' +
      '<span class="big">' + A.fields.length + ' 領域</span>' +
      '<ul class="plain">' +
      A.fields.map(f => '<li>' + f + (fy[f] ? '（' + fy[f] + '年）' : '') + '</li>').join('') + '</ul>';
    if (deep.length >= 2) {
      html += '<span class="cap"><strong>' + deep.join('・') + '</strong> は3年以上。' +
        'かじった経験ではなく、主戦場として通った領域です。</span>';
    }
    html += '<p class="src">診療科目別に歯科衛生士が何人いるかという統計は公表されていません。' +
      'そのため「この組み合わせは全国◯人」といった数字は出しません。' +
      '出せるのは、実際に何年ずつ通ったかという事実だけです。</p>';
    w.appendChild(card('card', html));
  }

  // 4. 資格
  const an = anesthesia();
  if (an && an.sure) {
    const c = CERTIFICATIONS.find(x => x.id === an.id);
    let html = '<span class="tag">保有資格</span>' +
      '<span class="cap">' + c.name + '<br>' + c.issuer + '</span>';
    // 希少性の根拠として使える資格かどうかで、書き方をはっきり分ける。
    // 数字が実態と食い違うと、読んだ本人が一番先に気づく。
    if (c.usableAsRarity && c.holderRatio) {
      html += '<span class="big">全国 ' + c.holders.toLocaleString() + ' 名</span>' +
        '<span class="cap">働いている歯科衛生士 ' + M.employedHygienists.toLocaleString() +
        ' 人に対して <strong>' + pct(c.holderRatio) + '</strong>。およそ ' +
        Math.round(1 / c.holderRatio).toLocaleString() + ' 人に 1 人です。</span>';
    } else {
      html += '<p style="margin:.5rem 0 0">' + c.realityNote + '</p>' +
        '<span class="cap"><strong>だからこれは、珍しさを示すものではありません。</strong>' +
        'ただし残る事実はあります。実際に麻酔を任せる体制のある医院で働いていて、' +
        'それを日常的に使っているということです。' +
        '制度としてできることと、現場で実際に任されることは別です。</span>';
    }
    html += '<p class="src">出典: ' + c.source +
      (c.realitySource ? '<br>実態: ' + c.realitySource : '') + '</p>';
    w.appendChild(card('card', html));
  } else if (an) {
    const a = CERTIFICATIONS.find(x => x.id === 'anesthesia-jdsa');
    const b = CERTIFICATIONS.find(x => x.id === 'anesthesia-jda');
    w.appendChild(card('unknown',
      '<strong>麻酔の認定は、どちらの制度か特定できませんでした。</strong><br>' +
      '同じ「認定麻酔衛生士」と呼ばれる資格が2つあり、保有者数が大きく違います。<br><br>' +
      '・' + a.issuer + '：<strong>' + a.holders + ' 名</strong>（' + pct(a.holderRatio) + '）<br>' +
      '・' + b.issuer + '：累計 ' + b.holders.toLocaleString() + ' 名以上（歯科医師を含む）<br><br>' +
      'お手元の認定証に書かれている発行元を見ると分かります。' +
      'どちらであっても、働いている歯科衛生士全体から見れば少数派であることは変わりません。'));
  }

  if ((A.certs || []).length) {
    w.appendChild(card('unknown',
      '<strong>ただし、資格そのものにできることの限界も書いておきます。</strong><br>' +
      CERTIFICATION_CAVEAT.implication +
      '<p class="src">出典: ' + CERTIFICATION_CAVEAT.source + '</p>'));
  }

  // 5. 他者からの扱い
  const facts = [];
  if (A.taught === 'ある') facts.push('新人・後輩の教育を任された' + (A.taughtN ? '（' + A.taughtN + '人）' : ''));
  if (A.represent === 'ある') facts.push('医院の代表として学会・展示会に行った');
  if (A.consulted && A.consulted !== 'ない') facts.push('院長や同僚から相談される（' + A.consulted + '）');
  if (A.requested && A.requested !== 'ない') facts.push('患者さんから指名される（' + A.requested + '）');
  if (A.chooseKit === 'ある') facts.push('器材・材料の選定に関わった');
  if (A.introduced === 'ある') facts.push('新しい技術・材料を最初に導入した');
  if (facts.length) {
    w.appendChild(card('card flag',
      '<span class="tag">まわりからの扱い</span>' +
      '<span class="big">' + facts.length + ' 件</span>' +
      '<span class="cap">これはあなたの自己評価ではなく、<strong>他の人があなたをどう扱ったか</strong>の記録です。</span>' +
      '<ul class="plain">' + facts.map(f => '<li>' + f + '</li>').join('') + '</ul>' +
      '<span class="cap">資格や年数は「持っている」ことしか示しません。' +
      'この欄は「まわりが実際に頼った」という、別の種類の事実です。</span>'));
  }

  // 6. 左利き
  if (A.handedness === '左') {
    w.appendChild(card('card flag',
      '<span class="tag">左利き</span>' +
      '<span class="big">推定 ' + M.leftHandedHygienistsEstimate.toLocaleString() + ' 人</span>' +
      '<span class="cap">一般人口の左利き率（約 ' + pct(M.leftHandedRateGeneral) + '）から推定した、' +
      '全国の左利き歯科衛生士のおおよその人数です。歯科職に限定した統計は存在しません。</span>' +
      '<p style="margin:.8rem 0 0"><strong>教育現場にはこういう状態があります。</strong><br>' +
      '「' + M.leftHandedEducationGap + '」<br>' +
      '左利き向けのポジショニングやスケーラー操作を体系化した日本語の教材は、ほぼ見当たりません。</p>' +
      '<span class="cap">あなたが不利だと感じてきたことは、' +
      '<strong>教えられる人がいない領域を自分で解決してきた</strong>ということでもあります。</span>' +
      '<p class="src">出典: ' + M.leftHandedSource + '</p>'));
  }

  // 7. 年収
  if (A.income && A.income !== '答えたくない') {
    const b40 = S.byAgeBand.find(b => b.band === '40-44');
    const b45 = S.byAgeBand.find(b => b.band === '45-49');
    w.appendChild(card('card',
      '<span class="cap">年収の全国データ（常勤）</span>' +
      '<span class="big">40〜44歳 ' + man(b40.annualYen) + ' → 45〜49歳 ' + man(b45.annualYen) + '</span>' +
      '<span class="cap">全体平均は ' + man(S.national.annualYen) + '。' +
      '45〜49歳が全年齢でもっとも高くなります。あなたの回答は「' + A.income + '」でした。</span>' +
      '<p class="src">' + S.curveCaveat + '<br>出典: ' + S.sourceName + ' / ' + S.source + '</p>'));
  }

  // 8. 教育トラック（要件充足の事実のみ。勧めない）
  const edu = TRACKS.find(t => t.id === 'education');
  if (A.years >= 4) {
    w.appendChild(card('card',
      '<span class="tag">要件を満たしているもの</span>' +
      '<span class="cap">' + edu.name + '</span>' +
      '<span class="big">実務 ' + A.years + ' 年 / 必要 4 年</span>' +
      '<span class="cap">法令上の要件は「免許取得後4年以上の業務従事経験」と' +
      '「専任教員講習会 I〜V の修了」です。経験年数の条件は、すでに満たしています。</span>' +
      '<ul class="plain">' + edu.entryRequirements.map(r => '<li>' + r + '</li>').join('') + '</ul>' +
      '<p class="src"><strong>ただし、この道を勧めるにはまだ材料が足りません。</strong> ' +
      '養成校で働く人は2年で ' + Math.abs(M.educationInstitutionChange.deltaCount) + ' 人（' +
      Math.abs(Math.round(M.educationInstitutionChange.deltaRatio * 100)) + '%）減っています。' +
      'それが人手不足なのか、学校自体が減っているのかを確認できていません。' +
      '専任教員の年収も講習会の費用も、公表データを見つけられていません。調査中です。<br>' +
      '出典: ' + edu.source + '</p>'));
  }

  // 9. まだ出せないもの
  const notReady = TRACKS.filter(t => !t.confirmed).map(t => t.name);
  w.appendChild(card('unknown',
    '<strong>まだ出せないもの</strong><br>' +
    '次のキャリアの選択肢については、移行に必要な条件も年収も、信頼できる出典を確認できていません。' +
    '推測で書くと判断を誤らせるので、空欄のままにしています。' +
    '<ul class="plain">' + notReady.map(n => '<li>' + n + '</li>').join('') + '</ul>' +
    '調査ができ次第、この画面に追加します。'));

  // 10. 書いてくれた工夫
  const notes = [
    ['左利きでの工夫', A.leftHand],
    ['ブランクからの戻り方', A.comeback],
    ['説明するときの工夫', A.explain],
    ['「これが言えたら教えられる」と思うもの', A.basis],
  ].filter(x => x[1] && x[1].trim());
  if (notes.length) {
    w.appendChild(card('card',
      '<span class="tag">あなたが書いたこと</span>' +
      notes.map(n => '<p style="margin:.6rem 0"><strong>' + n[0] + '</strong><br>' +
        esc(n[1]).replace(/\n/g, '<br>') + '</p>').join('') +
      '<span class="cap">ここに書かれたことが、そのまま「人に教えられること」の中身になります。' +
      '資格や年数と違って、これは他の人が持っていないものです。</span>'));
  }

  // コピー用
  const dump = document.createElement('div');
  dump.innerHTML = '<h3>回答の控え</h3>' +
    '<p class="hint">必要なら下のテキストをコピーして使ってください。送るかどうかは自由です。</p>';
  const ta = document.createElement('textarea');
  ta.className = 'copy'; ta.readOnly = true; ta.value = dumpText();
  dump.appendChild(ta);
  w.appendChild(dump);

  const nav = document.createElement('div');
  nav.className = 'nav';
  const back = document.createElement('button');
  back.className = 'ghost'; back.textContent = '戻って直す';
  back.onclick = () => { cur = STEPS.length - 1; render(); };
  nav.appendChild(back);
  w.appendChild(nav);
  return w;
}

function dumpText() {
  const lines = [];
  STEPS.forEach(st => {
    const body = [];
    st.qs.forEach(q => {
      if (q.type === 'head') return;
      let v = A[q.id];
      if (q.type === 'fieldYears') {
        const fy = A.fieldYears || {};
        const keys = (A.fields || []).filter(k => fy[k] != null);
        v = keys.map(k => k + ' ' + fy[k] + '年').join(' / ');
      }
      if (Array.isArray(v)) v = v.join('、');
      if (v === undefined || v === null || v === '') return;
      body.push('・' + q.t + ' → ' + v);
    });
    if (body.length) { lines.push('■ ' + st.title); lines.push.apply(lines, body); lines.push(''); }
  });
  return lines.join('\n');
}

// 出典件数（フッター）
(function () {
  const srcs = new Set();
  CERTIFICATIONS.forEach(c => { if (c.source) srcs.add(c.source); });
  TRACKS.forEach(t => { if (t.source) srcs.add(t.source); });
  [MARKET.source, MARKET.sourceSecondary, MARKET.leftHandedSource, MARKET.ageDistributionSource,
   SALARY.source, SALARY.byRegionSource, CERTIFICATION_CAVEAT.source].forEach(s => { if (s) srcs.add(s); });
  $('#srccount').textContent = srcs.size;
})();

render();
