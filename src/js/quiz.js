const questions = [
  {
    text: "qual è il tuo linguaggio preferito?",
    answers: [
      { text: "javascript", pts: -2 },
      { text: "typescript", pts: -2 },
      { text: "python", pts: 1 },
      { text: "ruby", pts: 1 },
      { text: "java", pts: 1 },
      { text: "kotlin", pts: 0.5 },
      { text: "c#", pts: -1 },
      { text: "c++", pts: -1 },
      { text: "rust", pts: -1 },
      { text: "go", pts: 0 },
      { text: "c", pts: 0.5 },
      { text: "lua", pts: 1.5 },
      { text: "haskell", pts: 2 },
      { text: "lisp", pts: 2 },
      { text: "perl", pts: 2 },
      { text: "php", pts: 0.5 },
      { text: "swift", pts: -0.5 },
      { text: "r", pts: 0 },
      { text: "assembly", pts: null, easter: true },
    ]
  },
  {
    text: "cosa ti ha attirato alla programmazione?",
    freeInput: true,
    evaluate: (val) => val.length < 25 ? 1 : -1,
    placeholder: "scrivi qui..."
  },
  {
    text: "basta che clicci il bottone per continuare",
    blocked: true,
    answers: [
      { text: "ciao sono qui!!!", pts: -1 },
    ]
  },
    {
    text: "qual è il tuo editor preferito?",
    answers: [
      { text: "vscode", pts: -1.5 },
      { text: "vim", pts: 2 },
      { text: "neovim", pts: 1.5 },
      { text: "emacs", pts: 2.5 },
      { text: "jetbrains", pts: -1 },
      { text: "notepad", pts: 3 },
      { text: "nano", pts: 0.5 },
      { text: "sublime text", pts: -0.5 },
    ]
  },
  {
    text: "basta che clicci continua",
    convince: true,
  },
  {
    text: "hai 30 secondi per dirmi quanti più termini informatici che riesci a nominare. scrivi e premi invio per ognuno",
    buzzword: true,
  },
  {
    text: "dato che n = 1, a = ['a','b'], quale sarà l'output?",
    image: "Public/assets/programming_question.png",
    codeQuestion: true,
    correctAnswer: "ab\nba",
    pts: { correct: 1, wrong: 0 }
  },
  {
  text: "premi il bottone verde esattamente 10 volte.",
  greenButton: true,
  pts: { correct: 1, wrong: -1 }
},
{
  text: "ci sono delle cose che non possono essere viste sul sito, e alcune volte bisogna mettersi le mani in pasta. trova il mio desiderio.",
  codeReview: true,
  pts: { correct: 1, wrong: -1 }
},
];

let currentQuestion = 0;
let totalScore = 0;
const log = [];

const questionScene = document.getElementById('questionScene');
const resultScene = document.getElementById('resultScene');
const questionNumber = document.getElementById('questionNumber');
const questionText = document.getElementById('questionText');
const answersGrid = document.getElementById('answersGrid');
const resultVerdict = document.getElementById('resultVerdict');
const scoreBarMarker = document.getElementById('scoreBarMarker');
const answersLogEl = document.getElementById('answersLog');

function transitionTo(fromEl, toEl, callback) {
  fromEl.classList.add('fade-out');
  setTimeout(() => {
    fromEl.classList.add('hidden');
    fromEl.classList.remove('fade-out');
    if (callback) callback();
    toEl.classList.remove('hidden');
  }, 900);
}

function getVerdict(score) {
  if (score <= -8) return "sei trans.";
  if (score <= -5) return "molto probabilmente trans.";
  if (score <= -2) return "leggermente trans.";
  if (score < 2) return "sei nel mezzo. potresti ancora andare in entrambe le direzioni. fai attenzione.";
  if (score < 5) return "inizia a preoccuparti.";
  if (score < 8) return "molto probabilmente schizofrenico.";
  return "TERRY A. DAVIS TI ASPETTA IN PARADISO 🙏";
}

function showResult() {
  transitionTo(questionScene, resultScene, () => {
    resultVerdict.textContent = getVerdict(totalScore);

    const pct = (totalScore + 10) / 20;
    scoreBarMarker.style.left = (pct * 100) + '%';

    answersLogEl.innerHTML = '';
    log.forEach(entry => {
      const div = document.createElement('div');
      div.classList.add('log-entry');
      const ptsClass = entry.pts > 0 ? 'pos' : entry.pts < 0 ? 'neg' : 'zero';
      const ptsSign = entry.pts > 0 ? '+' : '';
      div.innerHTML = `
        <span class="log-q">${entry.question}</span>
        <span class="log-a">${entry.answer}</span>
        <span class="log-pts ${ptsClass}">${ptsSign}${entry.pts}</span>
      `;
      answersLogEl.appendChild(div);
    });
  });
}

function showQuestion(index) {
  const q = questions[index];
  questionNumber.textContent = `domanda ${index + 1} di ${questions.length}`;
  questionText.textContent = q.text;
  answersGrid.innerHTML = '';

  if (q.freeInput) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = q.placeholder || '';
    input.classList.add('answer-btn');
    input.style.width = '100%';
    input.style.textAlign = 'left';

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'conferma';
    submitBtn.classList.add('answer-btn');
    submitBtn.style.background = 'var(--yellow)';

    submitBtn.addEventListener('click', () => {
      const val = input.value.trim();
      if (!val) return;
      const pts = q.evaluate(val);
      totalScore = Math.max(-10, Math.min(10, totalScore + pts));
      log.push({ question: q.text, answer: val, pts: pts });
      nextQuestion();
    });

    answersGrid.appendChild(input);
    answersGrid.appendChild(submitBtn);
    
  } else if (q.convince) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;width:100%;display:flex;flex-direction:column;gap:16px;align-items:center;';

    const continueBtn = document.createElement('button');
    continueBtn.id = 'convinceBtn';
    continueBtn.textContent = 'continua';
    continueBtn.classList.add('answer-btn');
    continueBtn.style.cssText = 'font-size:1.3rem;padding:18px 48px;opacity:0.25;cursor:not-allowed;filter:blur(1px);';

    const hint = document.createElement('p');
    hint.textContent = 'devi convincermi. sai dove trovarmi.';
    continueBtn.style.cssText = 'font-size:1.3rem;padding:18px 48px;opacity:0;cursor:not-allowed;position:relative;';

    const overlay = document.createElement('div');
    overlay.id = 'convinceOverlay';
    overlay.style.cssText = `
      position:absolute;inset:0;
      background:black;
      border-radius:14px;
      z-index:500;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:32px;
      font-family:'Finger Paint',cursive;
      font-size:1rem;
      color:white;
      text-align:center;
      line-height:1.6;
    `;
    overlay.textContent = 'devi convincermi per continuare; pensa dove potresti parlare con un computer..';

    wrapper.appendChild(continueBtn);
    wrapper.appendChild(hint);
    wrapper.appendChild(overlay);
    answersGrid.appendChild(wrapper);

    const convinceObserver = new MutationObserver(() => {
      if (!document.body.contains(overlay) && document.body.contains(continueBtn)) {
        convinceObserver.disconnect();
        continueBtn.style.cssText = 'font-size:1.3rem;padding:18px 48px;';
        continueBtn.style.cursor = 'pointer';
        continueBtn.addEventListener('click', () => {
          log.push({ question: q.text, answer: '(ha rimosso l\'overlay a forza)', pts: 1 });
          totalScore = Math.max(-10, Math.min(10, totalScore + 1));
          nextQuestion();
        });
      } else if (!document.body.contains(continueBtn)) {
        convinceObserver.disconnect();
        const btn = document.createElement('button');
        btn.textContent = 'continua (hai distrutto tutto, di nuovo)';
        btn.classList.add('answer-btn');
        btn.style.background = 'var(--pink)';
        btn.addEventListener('click', () => {
          log.push({ question: q.text, answer: '(ha distrutto tutto)', pts: 1 });
          totalScore = Math.max(-10, Math.min(10, totalScore + 1));
          nextQuestion();
        });
        answersGrid.innerHTML = '';
        answersGrid.appendChild(btn);
      }
    });

    convinceObserver.observe(document.body, { childList: true, subtree: true });

    const dialogue = [
      { q: "ok. dimmi: perché dovrei lasciarti passare?", good: ["perché", "voglio", "prego", "please", "aiuto", "ho bisogno", "merito", "giusto", "devo"] },
      { q: "mmm. e cosa pensi di me?", good: ["bello", "bravo", "intelligente", "forte", "ottimo", "fantastico", "grande", "meglio", "rispetto", "ammiro"] },
      { q: "ultima domanda. c è un buon linguaggio?", good: ["si", "sì", "yes", "certo", "ovvio", "assolutamente", "naturalmente", "meglio"] },
    ];

    let stage = 0;
    let score = 0;

    window.convince = function () {
      console.log('%c' + dialogue[0].q, 'font-size:16px;color:#c9a0ff;font-weight:bold;');
      console.log('%crisposta: convince("la tua risposta")', 'font-size:12px;color:#888;');

      window.convince = function (answer) {
        if (stage >= dialogue.length) {
          console.log('%cgià finito.', 'color:#888;');
          return;
        }

        const current = dialogue[stage];
        const answerLower = (answer || '').toLowerCase();
        const isGood = current.good.some(keyword => answerLower.includes(keyword));

        if (isGood) {
          score++;
          console.log('%c...ok. accettabile.', 'font-size:14px;color:#7ec8e3;');
        } else {
          console.log('%chmm. non mi convince.', 'font-size:14px;color:#ff6eb4;');
        }

        stage++;

        if (stage < dialogue.length) {
          setTimeout(() => {
            console.log('%c' + dialogue[stage].q, 'font-size:16px;color:#c9a0ff;font-weight:bold;');
          }, 600);
        } else {
          setTimeout(() => {
            if (score >= 2) {
              console.log('%c...va bene. ti lascio passare. questa volta.', 'font-size:16px;color:#ffe066;font-weight:bold;');
              convinceObserver.disconnect();
              overlay.remove();
              continueBtn.style.cssText = 'font-size:1.3rem;padding:18px 48px;';
              continueBtn.addEventListener('click', () => {
                log.push({ question: q.text, answer: '(ha convinto il sistema)', pts: -1 });
                totalScore = Math.max(-10, Math.min(10, totalScore - 1));
                nextQuestion();
              });
            } else {
              console.log('%cnon sei abbastanza convincente. riprova da capo.', 'font-size:16px;color:#ff6eb4;font-weight:bold;');
              stage = 0;
              score = 0;
              setTimeout(() => {
                console.log('%c' + dialogue[0].q, 'font-size:16px;color:#c9a0ff;font-weight:bold;');
              }, 400);
            }
          }, 600);
        }
      };
    };

    console.log('%cpsst. scrivi convince() per iniziare.', 'font-size:13px;color:#c9a0ff;font-style:italic;');
} else if (q.greenButton) {
  let presses = 0;
  let phase = 'green';

  const extraPhrases = [
    "ancora una volta...",
    "prometto che sarà l'ultima.",
    "solo un altro click.",
    "ancora 1?",
    "dai, ancora.",
    "prometto che sarà ancora una volta.",
    "un'ultima volta. giuro.",
    "ok ma davvero ultima.",
    "ancora una? per favore.",
    "seriamente questa è l'ultima.",
    "no aspetta ancora una.",
    "ANCORA UNA VOLTA.",
    "te lo chiedo umilmente.",
    "ancora 1 solo 1.",
    "ci siamo quasi.",
    "quasi quasi.",
    "ancora una e basta.",
    "ok ma questa volta è vera.",
    "ultima. promessa.",
    "ancora una volta. fidati."
  ];

  const btn = document.createElement('button');
  btn.textContent = 'premi qui';
  btn.classList.add('answer-btn');
  btn.style.cssText = 'font-size:1.4rem;padding:20px 48px;background:#4caf50;color:white;border-color:#4caf50;transition:background 0.5s,border-color 0.5s,color 0.5s;';

  const label = document.createElement('p');
  label.style.cssText = 'font-family:Patrick Hand,cursive;font-size:1.1rem;color:var(--ink);min-height:2em;text-align:center;';
  label.textContent = '0/10';

  answersGrid.appendChild(btn);
  answersGrid.appendChild(label);

  btn.addEventListener('click', () => {
    if (phase === 'done') return;

    if (phase === 'green') {
      presses++;
      label.textContent = `${presses}/10`;
      if (presses === 10) {
        phase = 'begging';
        presses = 0;
        label.textContent = extraPhrases[0];
      }
    } else if (phase === 'begging') {
      presses++;
      if (presses < 20) {
        label.textContent = extraPhrases[presses];
      } else {
        phase = 'red';
        btn.style.background = '#e53935';
        btn.style.borderColor = '#e53935';
        btn.textContent = 'NON PREMERE.';
        label.textContent = 'fermati.';

        const stopBtn = document.createElement('button');
        stopBtn.textContent = 'mi fermo';
        stopBtn.classList.add('answer-btn');
        stopBtn.style.background = 'var(--yellow)';
        stopBtn.addEventListener('click', () => {
          phase = 'done';
          const pts = q.pts.correct;
          totalScore = Math.max(-10, Math.min(10, totalScore + pts));
          log.push({ question: q.text, answer: 'si è fermato', pts });
          nextQuestion();
        });
        answersGrid.appendChild(stopBtn);
      }
    } else if (phase === 'red') {
      phase = 'done';
      const pts = q.pts.wrong;
      totalScore = Math.max(-10, Math.min(10, totalScore + pts));
      log.push({ question: q.text, answer: 'ha premuto il bottone rosso', pts });
      nextQuestion();
    }
  });
    } else if (q.codeQuestion) {
  const img = document.createElement('img');
  img.src = q.image;
  img.style.cssText = 'display:block;margin:0 auto 20px;max-width:100%;border-radius:10px;';

  const input = document.createElement('textarea');
  input.placeholder = 'scrivi l\'output qui...';
  input.classList.add('answer-btn');
  input.style.cssText = 'width:100%;text-align:left;resize:vertical;min-height:80px;font-family:monospace;';

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'conferma';
  submitBtn.classList.add('answer-btn');
  submitBtn.style.background = 'var(--yellow)';

  submitBtn.addEventListener('click', () => {
    const val = input.value.trim();
    if (!val) return;
    const correct = val === q.correctAnswer.trim();
    const pts = correct ? q.pts.correct : q.pts.wrong;
    totalScore = Math.max(-10, Math.min(10, totalScore + pts));
    log.push({ question: q.text, answer: val, pts });
    nextQuestion();
  });

  answersGrid.appendChild(img);
  answersGrid.appendChild(input);
  answersGrid.appendChild(submitBtn);


  } else if (q.buzzword) {
    const transWords = ['docker','kubernetes','microservices','microservizi','agile','scrum','devops','ci/cd','pipeline','cloud','serverless','blockchain','machine learning','ai','llm','big data','saas','paas','iaas','rest','graphql','responsive','fullstack','mvp','sprint','standup','kanban','stakeholder','synergy','sinergia','disruption','scalable','scalabile','paradigm','paradigma','framework','oop','solid','dry','tdd','bdd'];
    const schizWords = ['assembly','kernel','bare metal','pointer','puntatore','buffer','register','registro','interrupt','syscall','segfault','memory leak','undefined behavior','bit shift','endian','opcode','hex','daemon','hypervisor','bootloader','firmware','turing','lambda calculus','monad','functor','category theory','halting problem'];

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

    function addWord() {
      if (finished) return;
      const val = input.value.trim().toLowerCase();
      if (!val) return;
      if (collected.find(c => c.word === val)) { input.value = ''; return; }

      const isTrans = transWords.some(w => val.includes(w) || w.includes(val));
      const isSchizo = schizWords.some(w => val.includes(w) || w.includes(val));

      collected.push({ word: val, type: isTrans ? 'trans' : isSchizo ? 'schizo' : 'neutral' });

      const tag = document.createElement('span');
      tag.textContent = val;
      tag.style.cssText = `
        font-family:Patrick Hand,cursive;
        font-size:0.9rem;
        padding:4px 12px;
        border-radius:20px;
        border:2px solid var(--ink);
        background:${isTrans ? 'var(--pink)' : isSchizo ? 'var(--lavender)' : '#eee'};
      `;
      tagCloud.appendChild(tag);
      input.value = '';
    }

    submitBtn.addEventListener('click', addWord);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') addWord(); });
    input.focus();

    function finish() {
      finished = true;
      input.disabled = true;
      submitBtn.disabled = true;
      timerEl.textContent = '⏰';

      const transCount = collected.filter(c => c.type === 'trans').length;
      const schizoCount = collected.filter(c => c.type === 'schizo').length;
      const pts = transCount >= schizoCount ? -1 : 1;

      log.push({ question: q.text, answer: collected.map(c => c.word).join(', ') || '(niente)', pts });
      totalScore = Math.max(-10, Math.min(10, totalScore + pts));

      const result = document.createElement('button');
      result.textContent = 'continua';
      result.classList.add('answer-btn');
      result.style.background = 'var(--yellow)';
      result.addEventListener('click', nextQuestion);
      answersGrid.appendChild(result);
    }
    } else if (q.codeReview) {
  const negativeWords = [
    'voglio il 6 a fine anno',
  ];

  const input = document.createElement('textarea');
  input.placeholder = "scrivi qui...";
  input.classList.add('answer-btn');
  input.style.cssText = 'width:100%;text-align:left;resize:vertical;min-height:80px;font-family:Patrick Hand,cursive;';

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'conferma';
  submitBtn.classList.add('answer-btn');
  submitBtn.style.background = 'var(--yellow)';

  submitBtn.addEventListener('click', () => {
    const val = input.value.trim().toLowerCase();
    if (!val) return;
    const words = val.split(/\s+/);
    const isSingleWord = words.length === 1;
    const isNegative = negativeWords.some(w => val.includes(w));
    const pts = (isSingleWord && isNegative) ? q.pts.correct : q.pts.wrong;
    totalScore = Math.max(-10, Math.min(10, totalScore + pts));
    log.push({ question: q.text, answer: input.value.trim(), pts });
    nextQuestion();
  });

  answersGrid.appendChild(input);
  answersGrid.appendChild(submitBtn);

  } else if (q.blocked) {
    const wrapper = document.createElement('div');
    wrapper.id = 'blockedWrapper';
    wrapper.style.cssText = 'position:relative;width:100%;display:flex;flex-direction:column;gap:12px;align-items:center;';

    const btnContainer = document.createElement('div');
    btnContainer.id = 'btnContainer';
    btnContainer.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px;justify-content:center;';

    q.answers.forEach(ans => {
      const btn = document.createElement('button');
      btn.textContent = ans.text;
      btn.classList.add('answer-btn');
      btn.addEventListener('click', () => {
        totalScore = Math.max(-10, Math.min(10, totalScore + ans.pts));
        log.push({ question: q.text, answer: ans.text, pts: ans.pts });
        clearInterval(flashInterval);
        observer.disconnect();
        blocker.remove();
        nextQuestion();
      });
      btnContainer.appendChild(btn);
    });

    const blocker = document.createElement('div');
    blocker.id = 'blockerSign';
    blocker.style.cssText = `
      position:fixed;inset:0;
      background:black;
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      z-index:9999;
      font-family:'Finger Paint',cursive;
      padding:40px;
      gap:20px;
      text-align:center;
    `;
    blocker.innerHTML = `
      <span style="font-size:2rem;color:white;line-height:1.4;">lalalalala non ti lascero vedere la domanda hahahahahha</span>
      <span style="font-size:1rem;color:#aaa;margin-top:16px;">(suggerimento: id=blockerSign)</span>
    `;

    wrapper.appendChild(btnContainer);
    wrapper.appendChild(blocker);
    answersGrid.appendChild(wrapper);

    let flash = false;
    const flashInterval = setInterval(() => {
      flash = !flash;
      blocker.style.background = flash ? 'white' : 'black';
      const spans = blocker.querySelectorAll('span');
      spans[0].style.color = flash ? 'black' : 'white';
      spans[1].style.color = flash ? 'black' : 'white';
      spans[2].style.color = flash ? '#555' : '#aaa';
    }, 1000);

    let blockerInDom = true;
    let containerInDom = true;

    const observer = new MutationObserver(() => {
      const blockerGone = !document.body.contains(blocker);
      const containerGone = !document.body.contains(btnContainer);

      if (blockerGone && !containerGone && blockerInDom) {
        blockerInDom = false;
        clearInterval(flashInterval);
        observer.disconnect();
        log.push({ question: q.text, answer: '', pts: -1 });
        totalScore = Math.max(-10, Math.min(10, totalScore - 1));
      } else if (containerGone && containerInDom) {
        containerInDom = false;
        clearInterval(flashInterval);
        observer.disconnect();
        const btn = document.createElement('button');
        btn.textContent = 'continua';
        btn.classList.add('answer-btn');
        btn.style.background = 'var(--pink)';
        btn.addEventListener('click', () => {
          log.push({ question: q.text, answer: '(ha eliminato tutto)', pts: 1 });
          totalScore = Math.max(-10, Math.min(10, totalScore + 1));
          nextQuestion();
        });
        answersGrid.innerHTML = '';
        answersGrid.appendChild(btn);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    q.answers.forEach(ans => {
      const btn = document.createElement('button');
      btn.textContent = ans.text;
      btn.classList.add('answer-btn');



      btn.addEventListener('click', () => {
        if (ans.easter) {
          log.push({ question: q.text, answer: ans.text, pts: 10 });
          totalScore = 10;
          showResult();
          return;
        }
        totalScore = Math.max(-10, Math.min(10, totalScore + ans.pts));
        log.push({ question: q.text, answer: ans.text, pts: ans.pts });
        nextQuestion();
      });

      answersGrid.appendChild(btn);
    });
  }
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion >= questions.length) {
    showResult();
    return;
  }
  const oldContent = questionScene.querySelector('.question-box');
  oldContent.style.transition = 'opacity 0.4s ease';
  oldContent.style.opacity = '0';
  setTimeout(() => {
    showQuestion(currentQuestion);
    oldContent.style.opacity = '1';
  }, 400);
}

document.getElementById('startBtn').addEventListener('click', (e) => {
  e.preventDefault();
  const scene3 = document.getElementById('scene3');
  transitionTo(scene3, questionScene, () => {
    showQuestion(0);
  });
});