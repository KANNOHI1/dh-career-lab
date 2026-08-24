// 診断本体。data/*.js から導出のみする。数値をここに直書きしない。
// 回答は fetch/XHR に載せない・localStorage に保存しない・URL に載せない。

const A = {};                                   // 回答
const $ = (s, r) => (r || document).querySelector(s);

const REGIONS = ['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'];
const FIELDS = ['一般','矯正','インプラント','口腔外科','小児','歯周治療','予防・メインテナンス','訪問','審美'];

// この設問が変わると同じステップ内の表示が変わる（条件付き表示・上限3件の付け外し）
const REDRAW_ON = ['certs', 'taught', 'fields', 'priority'];

const hasAnes = () => (A.certs || []).some(c => c.indexOf('麻酔') >= 0);

const STEPS = [
  {
    title: '今の働き方', note: '選択するだけです。30秒ほど。',
    qs: [
      { id:'workplace', t:'今の勤務先は？', type:'radio',
        opts:['一般歯科','矯正歯科','口腔外科・病院','訪問診療','企業','教育機関','行政・公衆衛生','離職中'] },
      { id:'employment', t:'雇用形態は？', type:'radio',
        opts:['常勤','パート・非常勤','フリーランス','離職中'] },
      { id:'daysPerWeek', t:'週に何日働いていますか？', type:'number', unit:'日', range:[1, 6] },
      { id:'income', t:'今の年収は？', type:'radio',
        hint:'ざっくりで大丈夫です。答えたくなければ選ばなくて構いません。',
        opts:['〜250万','250〜350万','350〜450万','450〜550万','550万〜','答えたくない'] },
      { id:'region', t:'お住まいの地域は？', type:'select', opts:REGIONS },
    ],
  },
  {
    title: '経験の内訳', note: 'ここが一番大事なところです。1分ほど。',
    qs: [
      { id:'years', t:'歯科衛生士として働いた年数は？', type:'number', unit:'年', range:[0, 20],
        hint:'ブランクを除いた実働の年数' },
      { id:'breakYears', t:'ブランクはありましたか？ 何年くらい？', type:'number', unit:'年', range:[0, 8],
        hint:'なければ 0' },
      { id:'fields', t:'通った診療領域は？', type:'checkbox', opts:FIELDS, hint:'当てはまるものすべて' },
      { id:'fieldYears', t:'それぞれ何年くらいですか？', type:'fieldYears',
        hint:'「かじった」のか「主戦場だった」のかを分けたいだけです。おおよそで構いません。' },
      { id:'certs', t:'持っている認定・専門資格は？', type:'checkbox',
        hint:'当てはまるものすべて。なければ空欄で',
        // 歯科衛生士の中核業務に近い順に並べる。
        // 当初は保有者数の多い順としていたが、ホワイトニングコーディネーターの
        // 保有者数は学会が公表しておらず、出回っている数値も矛盾していた（2026-08-24 検証）。
        // 数の根拠は使わない。台帳: research/sources.md 第3章・検証ログ
        opts:['歯周病の認定','ホワイトニングコーディネーター','インプラントの認定','矯正の認定','麻酔系の認定（認定麻酔衛生士など）','その他'] },
      { id:'certOther', t:'その他の資格があれば', type:'text',
        showIf:() => (A.certs || []).includes('その他') },
      { id:'certUse', t:'その資格、実務で使っていますか？', type:'radio',
        opts:['よく使う','たまに使う','ほぼ使わない'], showIf:() => (A.certs || []).length > 0 },
      // 「認定麻酔衛生士」と呼ばれる資格は制度が2つあり、保有者数が桁違いに違う。
      // 発行元さえ分かれば判別できるので、取得プロセスは聞かない。
      { id:'anesIssuer', t:'その麻酔の認定は、どこが発行したものですか？', type:'radio',
        hint:'認定証に書かれている団体名です。分からなければ「わからない」で構いません。',
        opts:['日本歯科麻酔学会','日本歯科医学振興機構（JDA）','わからない'], showIf:hasAnes },
      { id:'handedness', t:'利き手は？', type:'radio', opts:['右','左','両方'] },
    ],
  },
  {
    title: 'これまでにあったこと', note: '自己評価ではなく、実際にあったかどうかだけ答えてください。40秒ほど。',
    qs: [
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
        opts:['今のまま安定','専門を深める','教える・伝える側にまわる','独立する','職種を変える','わからない'],
        hint:'「わからない」で構いません。むしろそこから考えるための質問です。' },
    ],
  },
  {
    title: '工夫していること', note: 'ここは任意です。書かなくても結果は全部読めます。',
    qs: [
      { id:'freeHead', type:'head', t:'',
        hint:'ここに書いたことが、そのまま「人に教えられること」の材料になります。箇条書きでも、途中で切れていても大丈夫です。文章にする必要はありません。思いついた順にどうぞ。' },
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

// ---------- 保存 ----------
// この端末の中だけ。外へは出さない（fetch も XHR も使わない）。
// スキーマを変えたら KEY の版番号を上げる。古い保存は読まずに捨てる。
const SAVE_KEY = 'dh-career-lab/v1';

function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ answers: A, step: cur }));
  } catch (e) {
    // プライベートブラウズや容量超過で書けないことがある。保存できなくても診断は続けられる
  }
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    return d && d.answers && Object.keys(d.answers).length ? d : null;
  } catch (e) {
    return null;
  }
}

function forget() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* 消せなくても実害はない */ }
}

// ---------- 導入ページ ----------
function fillLanding() {
  const M = MARKET, S = SALARY;
  const b45 = S.byAgeBand.find(b => b.band === '45-49');
  const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };

  const nTracks = TRACKS.filter(t => t.confirmed).length;
  set('#l-employed', M.employedHygienists.toLocaleString());
  set('#l-clinic', pct(M.workplaceBreakdown.clinic.ratio));
  set('#l-fifties', pct(M.ageDistribution.fiftiesAndOver));
  set('#l-b45', man(b45.annualYen));
  set('#l-tracks', nTracks);
  set('#l-src', $('#srccount').textContent);
}

function revealOnScroll() {
  const items = [...document.querySelectorAll('[data-r]')];
  // ここまで来た＝JS が動いている。隠してよい
  document.documentElement.classList.add('js');

  // 隠した直後に .shown を付けると、隠れた状態が確定する前なので transition が走らず
  // opacity 0 のまま止まる（本文が読めなくなる）。ここで一度レイアウトを確定させる。
  void document.body.offsetHeight;

  // IntersectionObserver は、勢いよくスクロールして通り過ぎた要素を取りこぼすことがある。
  // 隠れたまま残ると本文が読めないので、位置を直接見る。要素は数個なので負荷にならない。
  const check = () => {
    const h = window.innerHeight;
    items.forEach(el => {
      if (el.classList.contains('shown')) return;
      if (el.getBoundingClientRect().top < h * 0.88) el.classList.add('shown');
    });
  };
  check();
  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('resize', check);
}

let savingWired = false;

function startSurvey(fromStep) {
  if (!savingWired) {
    // 子のハンドラが A を書き換えてから、ここへバブリングしてくる
    $('#steps').addEventListener('input', save);
    $('#steps').addEventListener('change', save);
    savingWired = true;
  }
  cur = fromStep || 0;
  $('#landing').hidden = true;
  $('#progress').hidden = false;
  $('#steps').hidden = false;
  render();
  window.scrollTo(0, 0);
}

function backToLanding() {
  $('#landing').hidden = false;
  $('#progress').hidden = true;
  $('#steps').hidden = true;
  window.scrollTo(0, 0);
}

function initLanding() {
  fillLanding();
  revealOnScroll();
  $('#start-top').onclick = () => startSurvey(0);
  $('#start-bottom').onclick = () => startSurvey(0);

  const saved = loadSaved();
  if (!saved) return;

  // 前回の回答があるときだけ出す
  $('#resume-box').hidden = false;
  $('#resume').onclick = () => {
    Object.assign(A, saved.answers);
    startSurvey(saved.step);
  };
  $('#forget').onclick = () => {
    forget();
    Object.keys(A).forEach(k => delete A[k]);
    $('#resume-box').hidden = true;
  };
}

// ---------- レンダリング ----------
let cur = 0;

function render(keepScroll) {
  const y = keepScroll ? window.scrollY : 0;
  save();
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
  nav.innerHTML = '<button class="ghost" id="back">戻る</button>';
  nav.innerHTML += '<button id="next">' + (cur === STEPS.length - 1 ? '結果を見る' : '次へ') + '</button>';
  el.appendChild(nav);
  host.appendChild(el);

  $('#back').onclick = () => {
    if (cur === 0) { backToLanding(); return; }
    cur--; render();
  };
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

      // ラジオは仕様上、一度選ぶと解除できない。誤タップを戻せないと
      // 「答えたくない項目は空欄のまま」が守れないので、押し直しで解除する。
      // click は change より先に走り、選択済みを押した時は change が発火しない。
      // よって click の時点の A[q.id] は「押す前の値」になる。
      if (q.type === 'radio') {
        const clear = () => {
          inp.checked = false;
          A[q.id] = null;
          save();
          if (REDRAW_ON.includes(q.id)) render(true);
        };
        inp.onclick = () => {
          if (A[q.id] !== o) return;          // これから選ばれる。change に任せる
          clear();
        };
        // 選択済みのラジオで Space を押してもブラウザは click を出さないので、拾い直す
        inp.onkeydown = (e) => {
          if (e.key !== ' ' || A[q.id] !== o) return;
          e.preventDefault();
          clear();
        };
      }

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
        if (REDRAW_ON.includes(q.id)) render(true);
      };
      lb.appendChild(inp);
      lb.appendChild(document.createTextNode(o));
      box.appendChild(lb);
    });
  } else if (q.type === 'number') {
    box.appendChild(numberSelect(q.range || [0, 25], q.unit || '', A[q.id],
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
      row.appendChild(numberSelect([0, 25], '年', A.fieldYears[f], v => { A.fieldYears[f] = v; }));
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
  if (A.anesIssuer === '日本歯科麻酔学会') return { id:'anesthesia-jdsa', sure:true };
  if (A.anesIssuer === '日本歯科医学振興機構（JDA）') return { id:'anesthesia-jda', sure:true };
  return { id:null, sure:false };
}

function card(cls, html) {
  const d = document.createElement('div');
  d.className = cls; d.innerHTML = html; return d;
}

// 「他の人が実際にどう扱ったか」の記録。自己評価ではないので、冒頭の要約にも使う。
function otherPeopleFacts() {
  const f = [];
  if (A.taught === 'ある') f.push('新人・後輩の教育を任された' + (A.taughtN ? '（' + A.taughtN + '人）' : ''));
  if (A.represent === 'ある') f.push('医院の代表として学会・展示会に行った');
  if (A.consulted && A.consulted !== 'ない') f.push('院長や同僚から相談される（' + A.consulted + '）');
  if (A.requested && A.requested !== 'ない') f.push('患者さんから指名される（' + A.requested + '）');
  if (A.chooseKit === 'ある') f.push('器材・材料の選定に関わった');
  if (A.introduced === 'ある') f.push('新しい技術・材料を最初に導入した');
  return f;
}

function result() {
  const w = document.createElement('div');
  w.className = 'step active';
  w.innerHTML = '<div class="step-head"><div class="n">RESULT</div>' +
    '<h2>いま持っているもの</h2>' +
    '<p class="note">自己評価ではなく、答えていただいた事実と公的統計だけで並べています。</p></div>';

  const M = MARKET, S = SALARY;
  const facts = otherPeopleFacts();

  // 0. 先に結論を出す。画面が長いので、上から順に読まなくても要点が分かるようにする。
  const ranked = rankedTracks();
  const top = ranked.filter(t => t.verdict !== 'not-recommended').slice(0, 2);
  const nope = ranked.filter(t => t.verdict === 'not-recommended');
  const bits = [];
  if (A.years) bits.push('実務 <strong>' + A.years + ' 年</strong>');
  if ((A.fields || []).length) bits.push('通ってきた領域 <strong>' + A.fields.length + ' つ</strong>');
  if (facts.length) bits.push('まわりが実際に頼った記録 <strong>' + facts.length + ' 件</strong>');
  if (bits.length || top.length) {
    let h = '<span class="tag">まとめ</span>';
    if (bits.length) h += '<p style="margin:.2rem 0 .8rem">' + bits.join(' / ') + '</p>';
    if (top.length) {
      h += '<p style="margin:.6rem 0 .2rem"><strong>いま条件が合っているもの</strong></p>' +
        '<ul class="plain">' + top.map(t => '<li>' + t.name + '</li>').join('') + '</ul>';
    }
    // 教える側に興味がないと答えた人に、教員を「すすめない」と伝えても情報にならない。
    // カード自体は下に残すので、まとめからだけ外す。
    const careAboutTeaching = A.teachInterest !== 'ない' || A.future === '教える・伝える側にまわる';
    if (nope.length && careAboutTeaching) {
      h += '<p style="margin:.6rem 0 .2rem"><strong>調べた結果、すすめないもの</strong></p>' +
        '<ul class="plain">' + nope.map(t => '<li>' + t.name + '</li>').join('') + '</ul>';
    }
    w.appendChild(card('card flag', h));
  }

  // 1. 母数
  w.appendChild(card('card',
    '<span class="cap">全国で働いている歯科衛生士</span>' +
    '<span class="big">' + M.employedHygienists.toLocaleString() + ' 人</span>' +
    '<span class="cap">このうち ' + pct(M.workplaceBreakdown.clinic.ratio) + ' が診療所勤務。' +
    '50代以上が ' + pct(M.ageDistribution.fiftiesAndOver) + ' を占めていて、' +
    M.fiftiesTrend + '。</span>' +
    '<p class="src">出典: 厚生労働省 令和6年 衛生行政報告例 / ' + M.source + '</p>'));

  // 2. 経験年数
  if (A.years) {
    w.appendChild(card('card',
      '<span class="cap">あなたの実働年数</span>' +
      '<span class="big">' + A.years + ' 年</span>' +
      '<span class="cap">歯科衛生士の平均年齢は ' + M.averageAge + ' 歳。40代が ' +
      pct(M.ageDistribution.forties) + '、50代以上が ' + pct(M.ageDistribution.fiftiesAndOver) +
      ' を占めます。</span>' +
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
      html += '<span class="cap">実際に麻酔を任せる体制のある医院で働いていて、' +
        'それを日常的に使っている。<strong>制度としてできることと、' +
        '現場で任されることは別です。</strong></span>';
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
      '・' + b.issuer + '：累計 ' + b.holders.toLocaleString() + ' 名（歯科医師を含む）<br><br>' +
      'お手元の認定証に書かれている発行元を見ると分かります。' +
      '前者は症例報告と口頭試問がある学会認定で、後者は1日の講習で取れる民間認定です。' +
      '同じ名前でも中身が違います。'));
  }

  if ((A.certs || []).length) {
    w.appendChild(card('unknown',
      CERTIFICATION_CAVEAT.implication +
      '<p class="src">出典: ' + CERTIFICATION_CAVEAT.source + '</p>'));
  }

  // 5. 他者からの扱い
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

  // 8. 分野ごとの動き（市場の側から見た材料）
  w.appendChild(fieldSection());

  // 9. この先の選択肢
  const h = document.createElement('h3');
  h.textContent = 'この先の選択肢';
  w.appendChild(h);
  const lead = document.createElement('p');
  lead.className = 'hint';
  lead.innerHTML = '要件と収入を確認できたものだけを出しています。' +
    '「大事な順」に選んでいただいた ' +
    ((A.priority || []).length ? '<strong>' + A.priority.join('・') + '</strong>' : 'もの') +
    ' と照らして並べています。';
  w.appendChild(lead);
  rankedTracks().forEach((t, i) => w.appendChild(trackCard(t, i)));

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

  const nav = document.createElement('div');
  nav.className = 'nav';
  const back = document.createElement('button');
  back.className = 'ghost'; back.textContent = '戻って直す';
  back.onclick = () => { cur = STEPS.length - 1; render(); };
  nav.appendChild(back);
  w.appendChild(nav);

  // 回答はこの端末に残る。消す手段を本人の手元に置いておく
  const wipe = document.createElement('p');
  wipe.innerHTML = '<span class="cap">回答はこの端末の中だけに残っています。' +
    '次に開いたとき、続きから見られます。</span>';
  const btn = document.createElement('button');
  btn.className = 'linkbtn'; btn.type = 'button'; btn.textContent = 'この端末から回答を消す';
  btn.onclick = () => {
    forget();
    Object.keys(A).forEach(k => delete A[k]);
    backToLanding();
    $('#resume-box').hidden = true;
  };
  wipe.appendChild(document.createElement('br'));
  wipe.appendChild(btn);
  w.appendChild(wipe);
  return w;
}

// ---------- 分野ごとの動き ----------
// 自分が通った領域だけでなく全分野を出す。
// 「市場がこっちへ動くなら自分もそっちへ」という判断ができるようにするため。
const DIRECTION_ORDER = { up: 0, flat: 1, unknown: 2, down: 3 };

function fieldSection() {
  const mine = A.fields || [];
  const box = document.createElement('div');

  const h = document.createElement('h3');
  h.textContent = '分野ごとの動き';
  box.appendChild(h);

  const lead = document.createElement('p');
  lead.className = 'hint';
  lead.innerHTML = '厚生労働省の統計だけで、どの分野が伸びていてどの分野が縮んでいるかを並べています。' +
    (mine.length ? '<strong>あなたが通ってきた領域</strong>には印をつけています。' : '');
  box.appendChild(lead);

  const sorted = FIELDS_DEMAND.slice().sort((a, b) => {
    // 自分が通った領域を先に、そのあとは伸びている順
    const am = mine.indexOf(a.id) >= 0 ? 0 : 1;
    const bm = mine.indexOf(b.id) >= 0 ? 0 : 1;
    if (am !== bm) return am - bm;
    return DIRECTION_ORDER[a.direction] - DIRECTION_ORDER[b.direction];
  });

  sorted.forEach((f, i) => {
    const isMine = mine.indexOf(f.id) >= 0;
    const srcs = [];
    let html = '<span class="tag dir-' + f.direction + '">' + DIRECTION_LABEL[f.direction] + '</span>' +
      (isMine ? '<span class="tag mine">通ってきた領域</span>' : '') +
      '<span class="tname">' + f.id + '</span>' +
      '<span class="cap">' + f.headline + '</span>' +
      '<p style="margin:.8rem 0 0">' + f.body + '</p>';

    if (f.evidence.length) {
      html += '<ul class="plain">' + f.evidence.map(e => {
        if (e.source && srcs.indexOf(e.source) < 0) srcs.push(e.source);
        return '<li>' + e.label + '：<strong>' + e.value + '</strong></li>';
      }).join('') + '</ul>';
    }
    if (f.caution) {
      html += '<p class="blk">' + f.caution + '</p>';
    }
    if (srcs.length) {
      html += '<p class="src">出典: ' + srcs.join('<br>') + '</p>';
    }

    const d = document.createElement('details');
    d.className = 'card' + (isMine ? ' flag' : '');
    d.open = i < 2;
    d.innerHTML = '<summary>' + html.slice(0, html.indexOf('<p style=')) + '</summary>' +
      html.slice(html.indexOf('<p style='));
    box.appendChild(d);
  });

  box.appendChild(card('unknown',
    FIELD_CAVEAT.shinryoNote + '<br><br>' + FIELD_CAVEAT.jihiNote));

  return box;
}

// ---------- この先の選択肢 ----------
// 並べ替えの根拠は「大事な順」と、これまでの回答の事実だけ。
// 調べた結果すすめないと分かったものは、隠さず最後に置く。
function trackScore(t) {
  let s = 0;
  (A.priority || []).forEach(p => { if (t.fitFor.indexOf(p) >= 0) s += 2; });
  if (t.id === 'instructor') {
    if (A.teachInterest === 'すごくある') s += 4;
    else if (A.teachInterest === '少しある') s += 2;
    if (A.future === '専門を深める' || A.future === '教える・伝える側にまわる') s += 2;
    if (A.taught === 'ある') s += 2;
  }
  if (t.id === 'corporate') {
    if (A.represent === 'ある') s += 2;
    if (A.introduced === 'ある' || A.chooseKit === 'ある') s += 1;
    if (A.future === '職種を変える') s += 2;
  }
  if (t.id === 'public-health' && (A.future === '今のまま安定' || A.future === '職種を変える')) s += 1;
  if ((t.id === 'home-visit' || t.id === 'care-manager') && (A.fields || []).indexOf('訪問') >= 0) s += 3;
  if (t.id === 'care-manager' && Number(A.years) < 5) s -= 3;   // 受験要件に届かない
  return s;
}

function rankedTracks() {
  return TRACKS.filter(t => t.confirmed).sort((a, b) => {
    const an = a.verdict === 'not-recommended', bn = b.verdict === 'not-recommended';
    if (an !== bn) return an ? 1 : -1;
    return trackScore(b) - trackScore(a);
  });
}

const VERDICT_LABEL = {
  'recommend': '条件が合う',
  'conditional': '条件つき',
  'not-recommended': '調べた結果、すすめない',
};

function trackCard(t, idx) {
  const srcs = [];
  const addSrc = u => { if (u && srcs.indexOf(u) < 0) srcs.push(u); };

  const head = '<span class="tag">' + VERDICT_LABEL[t.verdict] + '</span>' +
    '<span class="tname">' + t.name + '</span>' +
    '<span class="cap">' + t.summary + '</span>';

  let html = '<p style="margin:.8rem 0 0">' + t.reality + '</p>';

  if (t.blocker) {
    html += '<p class="blk">' + t.blocker + '</p>';
  }

  // 養成校が縮んでいる事実は、数字で出す
  if (t.marketShrink) {
    const y = t.marketShrink.years;
    html += '<p style="margin:.8rem 0 0"><strong>養成校の定員割れ</strong><br>' +
      y.map(r => r.year + '年 ' + Math.round(r.underfilledRatio * 100) + '%').join(' → ') + '</p>' +
      '<span class="cap">' + t.marketShrink.note + '</span>' +
      '<span class="cap">閉校・募集停止: ' + t.marketShrink.closures.join(' / ') + '</span>';
    addSrc(t.marketShrink.source); addSrc(t.marketShrink.capacitySource);
  }

  // 収入
  if (t.income) {
    html += '<p style="margin:.9rem 0 .2rem"><strong>収入</strong><br>' + t.income.text + '</p>' +
      '<ul class="plain">' + t.income.examples.map(e => {
        addSrc(e.source);
        return '<li>' + e.org + '：' + e.value + (e.source ? '' : '（出典が確認できていないため参考）') + '</li>';
      }).join('') + '</ul>' +
      '<span class="cap">いずれも個別の求人に出ていた金額です。相場ではありません。' +
      '全国の平均は ' + man(SALARY.national.annualYen) + '。</span>';
  } else if (t.incomeNote) {
    html += '<p style="margin:.9rem 0 0"><strong>収入</strong><br>' + t.incomeNote + '</p>';
  }

  // 実際に進んだ人の経歴
  if (t.examples) {
    html += '<p style="margin:.9rem 0 .2rem"><strong>実際に進んだ人</strong></p>' +
      '<ul class="plain">' + t.examples.map(e => {
        addSrc(e.source);
        return '<li>' + e.name + '：' + e.path + '</li>';
      }).join('') + '</ul>';
  }

  // 入るために必要なもの
  html += '<p style="margin:.9rem 0 .2rem"><strong>入るために必要なもの</strong></p>' +
    '<ul class="plain">' + t.entryRequirements.map(r => '<li>' + r + '</li>').join('') + '</ul>';

  // 年数の要件を満たしているかは、答えた年数から出す
  if (t.id === 'education' && A.years >= 4) {
    html += '<span class="cap">実務 ' + A.years + ' 年で、法令上の 4 年は満たしています。' +
      '足りていないのは年数ではありませんでした。</span>';
  }
  if (t.id === 'corporate' && A.years >= 3) {
    html += '<span class="cap">実務 ' + A.years + ' 年。どの企業の募集要件も超えています。</span>';
  }
  if (t.id === 'care-manager' && A.years != null) {
    html += '<span class="cap">実務 ' + A.years + ' 年。' +
      (A.years >= 5 ? '受験要件の 5 年は満たしています。' : '受験要件は 5 年以上です。') + '</span>';
  }

  // 動かせない条件に触れるものだけ出す
  const hit = (A.constraints || []).filter(c => t.cautions && t.cautions[c]);
  if (hit.length) {
    html += '<p style="margin:.9rem 0 .2rem"><strong>選んだ条件との関係</strong></p>' +
      '<ul class="plain">' + hit.map(c => '<li>' + c + '：' + t.cautions[c] + '</li>').join('') + '</ul>';
  }

  html += '<p style="margin:.9rem 0 .2rem"><strong>引き換えになるもの</strong></p>' +
    '<ul class="plain">' + t.tradeoffs.map(r => '<li>' + r + '</li>').join('') + '</ul>';

  // 読んで終わりにしない。今日できることを1行だけ置く。
  if (t.firstStep) {
    html += '<p class="step1"><strong>最初の一歩</strong><br>' + t.firstStep + '</p>';
  }

  addSrc(t.source);
  html += '<p class="src">出典: ' + srcs.join('<br>') + '</p>';

  // 全部を開いたままにすると縦に長くなりすぎて読まれない。上位2件だけ開く。
  const d = document.createElement('details');
  d.className = 'card' + (t.verdict === 'not-recommended' ? '' : ' flag');
  d.open = idx < 2;
  d.innerHTML = '<summary>' + head + '</summary>' + html;
  return d;
}

// 出典件数（フッター）
(function () {
  const srcs = new Set();
  CERTIFICATIONS.forEach(c => { if (c.source) srcs.add(c.source); });
  TRACKS.forEach(t => {
    // 求人の実例・経歴・市場データの出典も数える。画面に出しているものは全部数える。
    [t.source].concat(
      (t.income ? t.income.examples.map(e => e.source) : []),
      (t.examples ? t.examples.map(e => e.source) : []),
      (t.marketShrink ? [t.marketShrink.source, t.marketShrink.capacitySource] : [])
    ).forEach(u => { if (u) srcs.add(u); });
  });
  FIELDS_DEMAND.forEach(f => f.evidence.forEach(e => { if (e.source) srcs.add(e.source); }));
  [MARKET.source, MARKET.sourceSecondary, MARKET.leftHandedSource, MARKET.ageDistributionSource, MARKET.ageDistributionSourceSecondary,
   SALARY.source, SALARY.byRegionSource, CERTIFICATION_CAVEAT.source].forEach(s => { if (s) srcs.add(s); });
  $('#srccount').textContent = srcs.size;
})();

initLanding();
