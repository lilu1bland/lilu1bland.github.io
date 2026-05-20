export function renderConvince(q, answersGrid, onAnswer) {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'position:relative;width:100%;display:flex;flex-direction:column;gap:16px;align-items:center;';

  const continueBtn = document.createElement('button');
  continueBtn.id = 'convinceBtn';
  continueBtn.textContent = 'continua';
  continueBtn.classList.add('answer-btn');
  continueBtn.style.cssText = 'font-size:1.3rem;padding:18px 48px;opacity:0;cursor:not-allowed;position:relative;';

  const hint = document.createElement('p');
  hint.textContent = 'devi convincermi. sai dove trovarmi.';

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
      continueBtn.addEventListener('click', () => onAnswer(1, "(ha rimosso l'overlay a forza)"));
    } else if (!document.body.contains(continueBtn)) {
      convinceObserver.disconnect();
      const btn = document.createElement('button');
      btn.textContent = 'continua (hai distrutto tutto, di nuovo)';
      btn.classList.add('answer-btn');
      btn.style.background = 'var(--pink)';
      btn.addEventListener('click', () => onAnswer(1, '(ha distrutto tutto)'));
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
            continueBtn.addEventListener('click', () => onAnswer(-1, '(ha convinto il sistema)'));
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
}