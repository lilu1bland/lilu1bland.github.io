const TRANS_WORDS = ['docker','kubernetes','microservices','microservizi','agile','scrum','devops','ci/cd','pipeline','cloud','serverless','blockchain','machine learning','ai','llm','big data','saas','paas','iaas','rest','graphql','responsive','fullstack','mvp','sprint','standup','kanban','stakeholder','synergy','sinergia','disruption','scalable','scalabile','paradigm','paradigma','framework','oop','solid','dry','tdd','bdd'];
const SCHIZO_WORDS = ['assembly','kernel','bare metal','pointer','puntatore','buffer','register','registro','interrupt','syscall','segfault','memory leak','undefined behavior','bit shift','endian','opcode','hex','daemon','hypervisor','bootloader','firmware','turing','lambda calculus','monad','functor','category theory','halting problem'];

export function renderBuzzword(q, answersGrid, onAnswer) {
  let collected = [];
  let timeLeft = 30;
  let finished = false;

  const timerEl = document.createElement('div');
  timerEl.style.cssText = 'font-family:Finger Paint,cursive;font-size:2.5rem;color:var(--ink);';
  timerEl.textContent = '30';

  const inputRow = document.createElement('div');
  inputRow.style.cssText = 'display:flex;gap:10px;width:100%;max-width:500px;';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'scrivi un buzzword...';
  input.classList.add('answer-btn');
  input.style.cssText = 'flex:1;text-align:left;';

  const submitBtn = document.createElement('button');
  submitBtn.textContent = '→';
  submitBtn.classList.add('answer-btn');
  submitBtn.style.background = 'var(--yellow)';

  const tagCloud = document.createElement('div');
  tagCloud.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:600px;';

  inputRow.appendChild(input);
  inputRow.appendChild(submitBtn);
  answersGrid.appendChild(timerEl);
  answersGrid.appendChild(inputRow);
  answersGrid.appendChild(tagCloud);

  const ticker = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 5) timerEl.style.color = 'var(--pink)';
    if (timeLeft <= 0) {
      clearInterval(ticker);
      finish();
    }
  }, 1000);

  function classifyWord(val) {
    if (TRANS_WORDS.some(w => val.includes(w) || w.includes(val))) return 'trans';
    if (SCHIZO_WORDS.some(w => val.includes(w) || w.includes(val))) return 'schizo';
    return 'neutral';
  }

  function addWord() {
    if (finished) return;
    const val = input.value.trim().toLowerCase();
    if (!val || collected.find(c => c.word === val)) { input.value = ''; return; }

    const type = classifyWord(val);
    collected.push({ word: val, type });

    const tag = document.createElement('span');
    tag.textContent = val;
    tag.style.cssText = `
      font-family:Patrick Hand,cursive;
      font-size:0.9rem;
      padding:4px 12px;
      border-radius:20px;
      border:2px solid var(--ink);
      background:${type === 'trans' ? 'var(--pink)' : type === 'schizo' ? 'var(--lavender)' : '#eee'};
    `;
    tagCloud.appendChild(tag);
    input.value = '';
  }

  function finish() {
    finished = true;
    input.disabled = true;
    submitBtn.disabled = true;
    timerEl.textContent = '⏰';

    const transCount = collected.filter(c => c.type === 'trans').length;
    const schizoCount = collected.filter(c => c.type === 'schizo').length;
    const pts = transCount >= schizoCount ? -1 : 1;

    const result = document.createElement('button');
    result.textContent = 'continua';
    result.classList.add('answer-btn');
    result.style.background = 'var(--yellow)';
    result.addEventListener('click', () => onAnswer(pts, collected.map(c => c.word).join(', ') || '(niente)'));
    answersGrid.appendChild(result);
  }

  submitBtn.addEventListener('click', addWord);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') addWord(); });
  input.focus();
}