// 診断本体。data/*.js から導出のみする。数値をここに直書きしない。
// 回答は fetch/XHR に載せない・localStorage に保存しない・URL に載せない。

const A = {};                                   // 回答
const $ = (s, r) => (r || document).querySelector(s);

const REGIONS = ['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'];
// 年代。ageForLimit は「年齢の上限に引っかかるか」を判定するための代表値。
// その年代でいちばん上の年齢を使う（上限を超えないことを確実にするため）。
const AGE_BANDS = [
  { label: '20代', band: '25-29', ageForLimit: 29 },
  { label: '30代', band: '30-34', ageForLimit: 39 },
  { label: '40代前半', band: '40-44', ageForLimit: 44 },
  { label: '40代後半', band: '45-49', ageForLimit: 49 },
  { label: '50代', band: '50-54', ageForLimit: 59 },
  { label: '60代以上', band: null, ageForLimit: 69 },
];

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
      // 年代を聞くのは 2 つの理由から。行政の採用に年齢の上限があること、
      // 年収の統計が年齢階級別になっていること。答えなくても結果は全部読める。
      { id:'ageBand', t:'年代は？', type:'radio',
        hint:'自治体の採用に年齢の上限があるため、当てはまるかどうかの判定に使います。',
        opts:AGE_BANDS.map(b => b.label) },
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

// 折りたたむセクションの箱。見出しだけで開くかどうか決められるよう、要約を1行付ける。
function foldSection(title, summary, buildNodes) {
  const d = document.createElement('details');
  d.className = 'sect';
  d.innerHTML = '<summary><span class="st">' + title + '</span>' +
    '<span class="cap">' + summary + '</span></summary>';
  const body = document.createElement('div');
  body.className = 'sect-body';
  buildNodes().forEach(n => { if (n) body.appendChild(n); });
  d.appendChild(body);
  return d;
}

function result() {
  const w = document.createElement('div');
  w.className = 'step active';
  w.innerHTML = '<div class="step-head"><div class="n">RESULT</div>' +
    '<h2>いま持っているもの</h2>' +
    '<p class="note">自己評価ではなく、答えていただいた事実と公的統計だけで並べています。</p></div>';

  const M = MARKET, S = SALARY;
  const facts = otherPeopleFacts();
  const ranked = rankedTracks();

  // ================= 第1段: あなたはいまここ =================
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
    // 教える側に興味がないと答えた人に、教員を「すすめない」と伝えても情報にならない
    const careAboutTeaching = A.teachInterest !== 'ない' || A.future === '教える・伝える側にまわる';
    if (nope.length && careAboutTeaching) {
      h += '<p style="margin:.6rem 0 .2rem"><strong>調べた結果、すすめないもの</strong></p>' +
        '<ul class="plain">' + nope.map(t => '<li>' + t.name + '</li>').join('') + '</ul>';
    }
    w.appendChild(card('card flag', h));
  }

  const fmap = fieldMap();
  if (fmap) w.appendChild(fmap);

  // いちばん上の選択肢を、今月・半年・数年の順に開く
  const firstTop = top[0];
  if (firstTop && firstTop.actions) {
    w.appendChild(card('card flag',
      '<span class="tag">ここから何をするか</span>' +
      '<span class="tname">' + firstTop.name + '</span>' +
      planLead(firstTop) + actionPlan(firstTop) +
      '<span class="cap">ほかの選択肢とその根拠は、この下に出しています。</span>'));
  }

  // ================= 第2段: この先の選択肢 =================
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

  // 「いまの仕事を続けたまま深める」と「外に出る」を分ける。
  // 混ぜると、転職しない選択肢が見えなくなる。
  // 各群で上位2つだけ出し、残りは「ほかを見る」の中へ入れる。
  const groups = [
    { key: 'clinical', title: '臨床を続けたまま深める', note: '職場を変えずに進める道です。' },
    { key: 'outside', title: '臨床の外に出る', note: '働く場所そのものを変える道です。' },
  ];
  const SHOW_PER_GROUP = 2;
  groups.forEach(g => {
    const list = ranked.filter(t => (t.group || 'outside') === g.key);
    if (!list.length) return;
    const gh = document.createElement('p');
    gh.className = 'grouphead';
    gh.innerHTML = '<strong>' + g.title + '</strong>　<span class="cap">' + g.note + '</span>';
    w.appendChild(gh);
    list.slice(0, SHOW_PER_GROUP).forEach((t, i) => w.appendChild(trackCard(t, i)));
    const rest = list.slice(SHOW_PER_GROUP);
    if (rest.length) {
      w.appendChild(foldSection(
        'ほかの' + rest.length + 'つを見る',
        rest.map(t => t.short || t.name).join('・'),
        () => rest.map((t, i) => trackCard(t, i + SHOW_PER_GROUP))));
    }
  });

  // ================= 第3段: 数字の裏側 =================
  const h2 = document.createElement('h3');
  h2.textContent = '数字の裏側';
  w.appendChild(h2);
  const lead2 = document.createElement('p');
  lead2.className = 'hint';
  lead2.textContent = 'ここから下は、上の判断のもとにした統計です。気になるところだけ開いてください。';
  w.appendChild(lead2);

  w.appendChild(foldSection('あなたの棚卸し', '年数・領域・資格・まわりからの扱い', () => {
    const out = [];

    out.push(card('card',
      '<span class="cap">全国で働いている歯科衛生士</span>' +
      '<span class="big">' + M.employedHygienists.toLocaleString() + ' 人</span>' +
      '<span class="cap">このうち ' + pct(M.workplaceBreakdown.clinic.ratio) + ' が診療所勤務。' +
      '50代以上が ' + pct(M.ageDistribution.fiftiesAndOver) + ' を占めていて、' +
      M.fiftiesTrend + '。</span>' +
      '<p class="src">出典: 厚生労働省 令和6年 衛生行政報告例 / ' + M.source + '</p>'));

    if (A.years) {
      out.push(card('card',
        '<span class="cap">あなたの実働年数</span>' +
        '<span class="big">' + A.years + ' 年</span>' +
        '<span class="cap">歯科衛生士の平均年齢は ' + M.averageAge + ' 歳。40代が ' +
        pct(M.ageDistribution.forties) + '、50代以上が ' + pct(M.ageDistribution.fiftiesAndOver) +
        ' を占めます。</span>' +
        '<p class="src">出典: 令和4年 賃金構造基本統計調査 ほか</p>'));
    }

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
      out.push(card('card', html));
    }

    const an = anesthesia();
    if (an && an.sure) {
      const c = CERTIFICATIONS.find(x => x.id === an.id);
      let html = '<span class="tag">保有資格</span>' +
        '<span class="cap">' + c.name + '<br>' + c.issuer + '</span>';
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
      out.push(card('card', html));
    } else if (an) {
      const a = CERTIFICATIONS.find(x => x.id === 'anesthesia-jdsa');
      const b = CERTIFICATIONS.find(x => x.id === 'anesthesia-jda');
      out.push(card('unknown',
        '<strong>麻酔の認定は、どちらの制度か特定できませんでした。</strong><br>' +
        '同じ「認定麻酔衛生士」と呼ばれる資格が2つあり、保有者数が大きく違います。<br><br>' +
        '・' + a.issuer + '：<strong>' + a.holders + ' 名</strong>（' + pct(a.holderRatio) + '）<br>' +
        '・' + b.issuer + '：累計 ' + b.holders.toLocaleString() + ' 名（歯科医師を含む）<br><br>' +
        'お手元の認定証に書かれている発行元を見ると分かります。' +
        '前者は症例報告と口頭試問がある学会認定で、後者は1日の講習で取れる民間認定です。' +
        '同じ名前でも中身が違います。'));
    }

    if ((A.certs || []).length) {
      out.push(card('unknown',
        CERTIFICATION_CAVEAT.implication +
        '<p class="src">出典: ' + CERTIFICATION_CAVEAT.source + '</p>'));
    }

    if (facts.length) {
      out.push(card('card flag',
        '<span class="tag">まわりからの扱い</span>' +
        '<span class="big">' + facts.length + ' 件</span>' +
        '<span class="cap">これはあなたの自己評価ではなく、<strong>他の人があなたをどう扱ったか</strong>の記録です。</span>' +
        '<ul class="plain">' + facts.map(f => '<li>' + f + '</li>').join('') + '</ul>' +
        '<span class="cap">資格や年数は「持っている」ことしか示しません。' +
        'この欄は「まわりが実際に頼った」という、別の種類の事実です。</span>'));
    }

    if (A.handedness === '左') {
      out.push(card('card flag',
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

    if (A.income && A.income !== '答えたくない') {
      const me = A.ageBand ? AGE_BANDS.find(b => b.label === A.ageBand) : null;
      const mine = me && me.band ? S.byAgeBand.find(b => b.band === me.band) : null;
      const peak = S.byAgeBand.reduce((a, b) => (b.annualYen > a.annualYen ? b : a));
      out.push(card('card',
        '<span class="cap">年収の全国データ（常勤）</span>' +
        '<span class="big">' + (mine ? mine.band + '歳 ' + man(mine.annualYen)
                                     : peak.band + '歳 ' + man(peak.annualYen)) + '</span>' +
        '<span class="cap">' +
        (mine ? 'あなたと同じ年代の平均です。' +
                (mine.band === peak.band ? 'ここが全年齢でいちばん高い階級です。'
                                         : '全年齢でいちばん高いのは ' + peak.band + '歳の ' + man(peak.annualYen) + '。')
              : '全年齢でいちばん高い階級です。') +
        '全体平均は ' + man(S.national.annualYen) + '。あなたの回答は「' + A.income + '」でした。</span>' +
        '<p class="src">' + S.curveCaveat + '<br>出典: ' + S.sourceName + ' / ' + S.source + '</p>'));
    }
    return out;
  }));

  w.appendChild(foldSection('分野ごとの動き',
    '9つの診療領域が伸びているか縮んでいるか', () => [fieldSection()]));

  w.appendChild(foldSection('働く場所の数',
    '診療所と歯科医師は減り、歯科衛生士は増えている', () => [supplySection()]));

  w.appendChild(foldSection('地域による差',
    '北海道と東京で、高齢化も給与も違う', () => [regionSection()]));

  // ================= 自由記述 =================
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

// ---------- 分野マップ ----------
// 自分が通ってきた領域を、市場の方向の上に置く。
// 「自分の経験が伸びる場所に乗っているか」を最初に見せるための図。
// 合成指標（総合力・偏差値のようなもの）は作らない。軸はどちらも実データ。
const MAP_X = { down: 1, unknown: 2, flat: 3, up: 4 };
const MAP_X_LABEL = ['へっている', '数字なし', '横ばい', 'ふえている'];
// 図の中では長い分野名が入りきらない。図の中だけ短くする
const MAP_SHORT = { '予防・メインテナンス': '予防', 'インプラント': 'インプラ' };

function fieldMap() {
  const mine = (A.fields || []).filter(f => FIELDS_DEMAND.some(d => d.id === f));
  if (!mine.length) return null;                 // 領域を選んでいなければ図は出さない

  const fy = A.fieldYears || {};
  const maxYears = Math.max(5, ...mine.map(f => fy[f] || 0));

  // ビューボックス。スマホ幅でも読めるよう横長にしすぎない
  const W = 320, H = 260;
  const padL = 34, padR = 14, padT = 16, padB = 44;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const xAt = d => padL + (MAP_X[d] - 0.5) * (plotW / 4);
  const yAt = y => padT + plotH - (Math.min(y || 0, maxYears) / maxYears) * plotH;

  let g = '';

  // 縦の目盛り（経験年数）
  [0, Math.round(maxYears / 2), maxYears].forEach(v => {
    const y = yAt(v);
    g += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y +
         '" stroke="var(--line)" stroke-width="1"/>' +
         '<text x="' + (padL - 6) + '" y="' + (y + 4) + '" text-anchor="end" ' +
         'font-size="9" fill="var(--muted)">' + v + '年</text>';
  });

  // 横の区切りとラベル
  MAP_X_LABEL.forEach((lab, i) => {
    const cx = padL + (i + 0.5) * (plotW / 4);
    g += '<text x="' + cx + '" y="' + (H - padB + 16) + '" text-anchor="middle" ' +
         'font-size="9" fill="var(--muted)">' + lab + '</text>';
    if (i > 0) {
      const bx = padL + i * (plotW / 4);
      g += '<line x1="' + bx + '" y1="' + padT + '" x2="' + bx + '" y2="' + (padT + plotH) +
           '" stroke="var(--line)" stroke-width="1" stroke-dasharray="2 3"/>';
    }
  });

  // 通っていない分野を薄く置く（全体の中での位置が分かるように）
  FIELDS_DEMAND.filter(d => mine.indexOf(d.id) < 0).forEach(d => {
    const cx = xAt(d.direction);
    g += '<circle cx="' + cx + '" cy="' + (padT + plotH - 6) + '" r="3" fill="var(--line)"/>';
  });

  // 自分が通った領域
  // 点の中に番号だけ置き、名前は図の下に凡例として出す。
  // 図の中に名前を書くと、同じ位置に来たときに必ず重なって読めなくなる。
  const placed = [];
  const legend = [];
  mine.forEach((f, i) => {
    const d = FIELDS_DEMAND.find(x => x.id === f);
    const yrs = fy[f] || 0;
    let cx = xAt(d.direction), cy = yAt(yrs);
    while (placed.some(p => Math.abs(p.x - cx) < 20 && Math.abs(p.y - cy) < 16)) { cx += 21; }
    placed.push({ x: cx, y: cy });
    const color = d.direction === 'down' ? 'var(--warn)' : 'var(--accent)';
    g += '<circle cx="' + cx + '" cy="' + cy + '" r="10" fill="' + color + '" fill-opacity="0.9"/>' +
         '<text x="' + cx + '" y="' + (cy + 3.5) + '" text-anchor="middle" font-size="10" ' +
         'font-weight="700" fill="var(--bg)">' + (i + 1) + '</text>';
    legend.push({ n: i + 1, name: f, yrs: yrs, dir: d.direction });
  });

  const box = document.createElement('div');
  const h = document.createElement('h3');
  h.textContent = 'いまの立ち位置';
  box.appendChild(h);

  const lead = document.createElement('p');
  lead.className = 'hint';
  lead.textContent = '横は市場がどっちに動いているか、縦はあなたがその領域にいた年数です。' +
    '薄い点は、通っていない分野の位置です。';
  box.appendChild(lead);

  const wrap = document.createElement('div');
  wrap.className = 'fieldmap';
  wrap.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" ' +
    'aria-label="通ってきた領域を市場の方向と経験年数で並べた図">' + g + '</svg>' +
    '<ul class="maplegend">' + legend.map(l =>
      '<li><span class="n' + (l.dir === 'down' ? ' down' : '') + '">' + l.n + '</span>' +
      l.name + (l.yrs ? ' ' + l.yrs + '年' : '') +
      '<span class="cap">（' + DIRECTION_LABEL[l.dir] + '）</span></li>').join('') + '</ul>';
  box.appendChild(wrap);

  // 図だけでは読み取れないので、言葉でも言う
  const ups = mine.filter(f => {
    const d = FIELDS_DEMAND.find(x => x.id === f); return d && d.direction === 'up';
  });
  const downs = mine.filter(f => {
    const d = FIELDS_DEMAND.find(x => x.id === f); return d && d.direction === 'down';
  });
  const lines = [];
  if (ups.length) lines.push('<strong>' + ups.join('・') + '</strong> は、いま伸びている側にあります。');
  if (downs.length) lines.push('<strong>' + downs.join('・') + '</strong> は縮んでいる側です。積んだ経験が消えるわけではありませんが、同じ形のままでは先が細くなります。');
  if (!ups.length && !downs.length) lines.push('通ってきた領域は、いまのところ大きく動いていない場所です。');
  box.appendChild(card('card', lines.join('<br>') +
    '<span class="cap">この判断のもとになった数字は、下の「分野ごとの動き」に出しています。</span>'));

  return box;
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

    // 市場を見せたら、その市場で戦う方法まで出す
    const linked = TRACKS.filter(t => t.confirmed && t.field === f.id);
    if (linked.length) {
      html += '<p class="step1"><strong>この分野を深めるには</strong><br>' +
        linked.map(t => t.name + '<br><span class="cap">' +
          (t.entryRequirements[0] || '') + '</span>').join('<br>') +
        '<br><span class="cap">くわしくは下の「この先の選択肢」に出しています。</span></p>';
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
    FIELD_CAVEAT.revisionNote + '<br><br>' +
    FIELD_CAVEAT.shinryoNote + '<br><br>' + FIELD_CAVEAT.jihiNote));

  return box;
}

// ---------- 働く場所の数 ----------
// 需要が伸びても働き口が増えるとは限らない。供給側も並べる。
function supplySection() {
  const S = SUPPLY;
  const box = document.createElement('div');

  const h = document.createElement('h3');
  h.textContent = '働く場所の数';
  box.appendChild(h);

  box.appendChild(card('card flag',
    '<span class="tag">この2年の動き</span>' +
    '<ul class="plain">' +
    '<li>歯科診療所 <strong>' + S.clinics.count.toLocaleString() + ' 施設</strong>' +
      '（' + S.clinics.delta + '）</li>' +
    '<li>歯科医師 <strong>' + S.dentists.count.toLocaleString() + ' 人</strong>' +
      '（' + Math.round(S.dentists.deltaRatio * 1000) / 10 + '%）</li>' +
    '<li>歯科衛生士 <strong>' + S.hygienists.count.toLocaleString() + ' 人</strong>' +
      '（+' + Math.round(S.hygienists.deltaRatio * 1000) / 10 + '%）</li>' +
    '</ul>' +
    '<span class="cap">1 施設あたりの歯科衛生士は ' +
    S.perClinic.prev.toFixed(2) + ' 人 → ' + S.perClinic.now.toFixed(2) + ' 人。' +
    '（' + S.perClinic.note + '）</span>' +
    '<p class="src">出典: ' + S.clinics.source + '<br>' + S.dentists.source + '<br>' + S.hygienists.source + '</p>'));

  const N = S.newGrad;
  box.appendChild(card('card',
    '<span class="cap">養成校を出た人の求人倍率（令和7年度）</span>' +
    '<span class="big">' + N.ratioPerEmployed + ' 倍</span>' +
    '<span class="cap">卒業 ' + N.graduates.toLocaleString() + ' 名に対して求人 ' +
    N.jobOpenings.toLocaleString() + ' 名分。就職率は ' + pct(N.employmentRate) + '。</span>' +
    '<ul class="plain">' + N.trend.map(x => '<li>' + x.label + '　' + x.v + ' 倍</li>').join('') + '</ul>' +
    '<span class="cap">' + N.note + '</span>' +
    '<p class="src">出典: ' + N.source + '</p>'));

  // 頭数だけで「多い / 少ない」を語らない
  const WL = S.workload;
  box.appendChild(card('card flag',
    '<span class="tag">働く量のちがい</span>' +
    '<span class="tname">同じ 1 人でも、働く時間が違う</span>' +
    '<ul class="plain">' +
    '<li>' + WL.fullTime.label + '：月 <strong>' + WL.fullTime.monthlyHours + ' 時間</strong>' +
      '（平均 ' + WL.fullTime.age + ' 歳・' + WL.fullTime.workers.toLocaleString() + ' 人）</li>' +
    '<li>' + WL.partTime.label + '：月 <strong>' + WL.partTime.monthlyHours + ' 時間</strong>' +
      '（' + WL.partTime.daysPerMonth + ' 日 × ' + WL.partTime.hoursPerDay + ' 時間／平均 ' +
      WL.partTime.age + ' 歳・' + WL.partTime.workers.toLocaleString() + ' 人）</li>' +
    '</ul>' +
    '<p style="margin:.6rem 0 0">' + WL.conclusion + '</p>' +
    '<span class="cap">' + WL.ratioNote + '</span>' +
    '<p class="blk">' + WL.caveat + '</p>' +
    '<p class="src">出典: ' + WL.fullTime.source + '<br>' + WL.partTime.source + '</p>'));

  S.readings.forEach(r => {
    box.appendChild(card('card',
      '<span class="tname">' + r.title + '</span>' +
      '<p style="margin:.5rem 0 0">' + r.body + '</p>'));
  });

  box.appendChild(card('unknown', S.caveat));
  return box;
}

// ---------- 地域による差 ----------
function regionSection() {
  const R = REGION_DATA;
  const box = document.createElement('div');

  const h = document.createElement('h3');
  h.textContent = '地域による差';
  box.appendChild(h);

  const mine = R.areas.find(a => a.name === A.region);
  const lead = document.createElement('p');
  lead.className = 'hint';
  lead.innerHTML = mine
    ? '<strong>' + mine.name + '</strong>と東京都を並べています。'
    : '北海道と東京都のデータだけを持っています。あなたの地域の数字ではありませんが、' +
      '地域でどれくらい差が出るかの例として見てください。';
  box.appendChild(lead);

  R.areas.forEach(a => {
    const isMine = mine && a.name === mine.name;
    let html = (isMine ? '<span class="tag mine">あなたの地域</span>' : '') +
      '<span class="tname">' + a.name + '</span>' +
      '<span class="cap">65歳以上が総人口に占める割合</span>' +
      '<ul class="plain">' +
      R.years.map((y, i) => '<li>' + y + '年：<strong>' + a.aged65[i] + '%</strong>' +
        '（うち75歳以上 ' + a.aged75[i] + '%）</li>').join('') +
      '</ul>';

    // 人口あたりの数。全国と並べないと多いか少ないか分からない
    if (a.hygienistsPer100k) {
      html += '<span class="cap">人口10万人あたり（全国と比べて）</span>' +
        '<ul class="plain">' +
        '<li>歯科衛生士 <strong>' + a.hygienistsPer100k + '</strong>（全国 ' + R.nationalDH.per100k + '）</li>' +
        '<li>歯科診療所 <strong>' + a.clinicsPer100k + '</strong>（全国 ' + R.nationalClinics.per100k + '）</li>' +
        (a.dentistsPer100k ? '<li>歯科医師 <strong>' + a.dentistsPer100k + '</strong>（全国 ' + R.national.dentistsPer100k + '）</li>' : '') +
        '<li>新卒の求人倍率 <strong>' + a.newGradJobRatio + ' 倍</strong>（全国 ' + R.newGradJobRatioNational + ' 倍）' +
        (a.newGradJobRatioNote ? '<span class="cap">※' + a.newGradJobRatioNote + '</span>' : '') + '</li>' +
        '</ul>' +
        '<span class="cap">歯科衛生士の数は令和2年、診療所と歯科医師は令和6年の調査です。</span>';

      // 歯科医師の実数（人口10万対の指標が無い統計なので、率は作らず実数のまま）
      if (a.dentists) {
        html += '<span class="cap">医療施設で働く歯科医師の数（' + a.dentistsYear + '）</span>' +
          '<ul class="plain"><li><strong>' + a.dentists.toLocaleString() + ' 人</strong>' +
          '（全国 ' + R.nationalDentists.count.toLocaleString() + ' 人）</li></ul>';
      }
    }

    // 常勤で働いた場合の給与。地域差がいちばん出るところ
    if (a.wage) {
      const N = R.nationalWage;
      // 千円単位 → 万円。(千円 × 12 + 賞与千円) ÷ 10 = 万円
      const yr = w => Math.round((w.monthlyThousandYen * 12 + w.bonusThousandYen) / 10);
      html += '<span class="cap">常勤で働いた場合（' + N.year + '・歯科衛生士）</span>' +
        '<ul class="plain">' +
        '<li>きまって支給される給与 <strong>' + a.wage.monthlyThousandYen + ' 千円/月</strong>' +
          '（全国 ' + N.monthlyThousandYen + '）</li>' +
        '<li>年間賞与 <strong>' + a.wage.bonusThousandYen + ' 千円</strong>（全国 ' + N.bonusThousandYen + '）</li>' +
        '<li>所定内の労働時間 ' + a.wage.hours + ' 時間/月・残業 ' + a.wage.overtime + ' 時間（全国 ' +
          N.hours + ' / ' + N.overtime + '）</li>' +
        '<li>平均年齢 ' + a.wage.age + ' 歳・勤続 ' + a.wage.tenure + ' 年（全国 ' + N.age + ' / ' + N.tenure + '）</li>' +
        '</ul>' +
        '<span class="cap">年収に直すとおよそ <strong>' + yr(a.wage) + ' 万円</strong>' +
        '（全国 ' + yr(N) + ' 万円）。給与×12 + 賞与で当サイトが計算しました。' +
        'このページの別のところに出ている ' + man(SALARY.national.annualYen) +
        ' は同じ調査の別の集計で、対象のとり方が違うため一致しません。</span>';
    }

    html += '<p style="margin:.6rem 0 0">' + a.note + '</p>';
    box.appendChild(card(isMine ? 'card flag' : 'card', html));
  });

  box.appendChild(card('card',
    '<span class="tname">' + R.reading.title + '</span>' +
    '<p style="margin:.5rem 0 0">' + R.reading.body + '</p>' +
    '<span class="cap">人口10万人あたりの歯科医師数は全国 ' + R.national.dentistsPer100k +
    '。いちばん多いのが ' + R.national.highest + '、少ないのが ' + R.national.lowest + '。</span>' +
    '<p class="src">出典: ' + R.source + '<br>' + R.national.source + '</p>'));

  return box;
}

// ---------- この先の選択肢 ----------
// 並べ替えの根拠は「大事な順」と、これまでの回答の事実だけ。
// 調べた結果すすめないと分かったものは、隠さず最後に置く。
function trackScore(t) {
  let s = 0;
  (A.priority || []).forEach(p => { if (t.fitFor.indexOf(p) >= 0) s += 2; });
  // 通ってきた領域は、そのまま深められる。いちばん近い選択肢として上に出す
  if (t.field && (A.fields || []).indexOf(t.field) >= 0) s += 4;
  // 縮んでいる分野は、通っていても上位に置かない
  if (t.field) {
    const f = FIELDS_DEMAND.find(x => x.id === t.field);
    if (f && f.direction === 'down') s -= 3;
  }
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

// ---------- ここから何をするか ----------
// 要件を「年数」として持っているものは、答えてもらった年数と突き合わせる。
// 15年やってきた人に「まず3年経験を積みましょう」と出さないため。
function yearsVerdict(t) {
  if (!t.requires) return '';
  const r = t.requires;
  const have = r.on === 'field' ? ((A.fieldYears || {})[t.field] || 0) : A.years;
  if (have == null) return r.note + ' が要件です。';
  const label = r.on === 'field' ? t.field + ' ' + have + ' 年' : '実務 ' + have + ' 年';
  return have >= r.years
    ? label + '。' + r.note + '。<strong>ここはもう終わっています。</strong>'
    : label + '。' + r.note + 'なので、あと ' + (r.years - have) + ' 年です。';
}

// 見出しは呼ぶ側で出す（第1段はタグ、選択肢カードは小見出し）
function actionPlan(t) {
  if (!t.actions || !t.actions.length) return '';
  let h = '';
  const v = yearsVerdict(t);
  if (v) h += '<p class="planyear">' + v + '</p>';
  h += '<ol class="plan">' + t.actions.map(a =>
    '<li><span class="when">' + a.when + '</span>' + a.text +
    (a.url ? '<a class="planlink" href="' + a.url + '" target="_blank" rel="noopener">公式ページを開く</a>' : '') +
    '</li>').join('') + '</ol>';
  return h;
}

// 答えてもらった内容と行動をつなぐ。第1段でだけ出す。
function planLead(t) {
  const bits = [];
  if (A.future) bits.push('3年後に「' + A.future + '」とお答えでした。そこへ向かうと、こうなります。');
  if (t.field && (A.fields || []).indexOf(t.field) < 0) {
    bits.push('いまの職場で' + t.field + 'を扱っていないなら、最初の一歩は認定ではなく職場に確認することです。');
  }
  return bits.length ? '<p class="planlead">' + bits.join(' ') + '</p>' : '';
}

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
    html += '<p style="margin:.8rem 0 0"><strong>定員に満たない養成校の割合</strong><br>' +
      y.map(r => (r.label || r.year) + ' ' + Math.round(r.underfilledRatio * 1000) / 10 + '%').join('<br>') + '</p>' +
      '<span class="cap">' + t.marketShrink.note + '</span>' +
      '<span class="cap">閉校・募集停止: ' + t.marketShrink.closures.join(' / ') + '</span>' +
      (t.marketShrink.teachers ? '<span class="cap">' + t.marketShrink.teachers.note + '</span>' : '');
    addSrc(t.marketShrink.source); addSrc(t.marketShrink.capacitySource);
  }

  // 年齢の上限がある選択肢は、答えてもらった年代で当てはまるかを出す
  if (t.id === 'public-health' && A.ageBand && t.income) {
    const me = AGE_BANDS.find(b => b.label === A.ageBand);
    const judged = t.income.examples.filter(e => e.ageLimit !== undefined);
    if (me && judged.length) {
      html += '<p style="margin:.9rem 0 .2rem"><strong>' + A.ageBand + 'のあなたが受けられるか</strong></p>' +
        '<ul class="plain">' + judged.map(e => {
          const ok = e.ageLimit === null || me.ageForLimit <= e.ageLimit;
          return '<li>' + e.org + '：<strong>' + (ok ? '対象に入る' : '上限を超えている') + '</strong></li>';
        }).join('') + '</ul>' +
        '<span class="cap">年代の上のほうの年齢で判定しています。募集ごとに条件が変わるので、' +
        '実際の募集要項で確かめてください。</span>';
    }
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

  // 動かせない条件に触れるものだけ出す
  const hit = (A.constraints || []).filter(c => t.cautions && t.cautions[c]);
  if (hit.length) {
    html += '<p style="margin:.9rem 0 .2rem"><strong>選んだ条件との関係</strong></p>' +
      '<ul class="plain">' + hit.map(c => '<li>' + c + '：' + t.cautions[c] + '</li>').join('') + '</ul>';
  }

  html += '<p style="margin:.9rem 0 .2rem"><strong>引き換えになるもの</strong></p>' +
    '<ul class="plain">' + t.tradeoffs.map(r => '<li>' + r + '</li>').join('') + '</ul>';

  // 読んで終わりにしない。今月・半年・数年の順に置く。
  if (t.actions && t.actions.length) {
    html += '<p style="margin:.9rem 0 .2rem"><strong>ここから何をするか</strong></p>' + actionPlan(t);
  } else if (t.firstStep) {
    html += '<p class="step1"><strong>最初の一歩</strong><br>' + t.firstStep + '</p>';
  }

  addSrc(t.source);
  html += '<p class="src">出典: ' + srcs.join('<br>') + '</p>';

  // 全部を開いたままにすると縦に長くなりすぎて読まれない。各群の先頭だけ開く。
  const d = document.createElement('details');
  d.className = 'card' + (t.verdict === 'not-recommended' ? '' : ' flag');
  d.open = idx < 1;
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
      (t.marketShrink ? [t.marketShrink.source, t.marketShrink.capacitySource] : []),
      (t.actions ? t.actions.map(a => a.url) : [])
    ).forEach(u => { if (u) srcs.add(u); });
  });
  FIELDS_DEMAND.forEach(f => f.evidence.forEach(e => { if (e.source) srcs.add(e.source); }));
  [SUPPLY.clinics.source, SUPPLY.dentists.source, SUPPLY.hygienists.source, SUPPLY.newGrad.source,
   REGION_DATA.newGradSource,
   REGION_DATA.source, REGION_DATA.national.source,
   REGION_DATA.nationalDH.source, REGION_DATA.nationalClinics.source,
   REGION_DATA.nationalWage.source, REGION_DATA.nationalDentists.source, SUPPLY.workload.fullTime.source, SUPPLY.workload.partTime.source].forEach(u => { if (u) srcs.add(u); });
  [MARKET.source, MARKET.sourceSecondary, MARKET.leftHandedSource, MARKET.ageDistributionSource, MARKET.ageDistributionSourceSecondary,
   SALARY.source, SALARY.byRegionSource, CERTIFICATION_CAVEAT.source].forEach(s => { if (s) srcs.add(s); });
  $('#srccount').textContent = srcs.size;
})();

initLanding();
