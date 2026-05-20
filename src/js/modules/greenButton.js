const EXTRA_PHRASES = [
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

export function renderGreenButton(q, answersGrid, onAnswer) {
  let presses = 0;
  let phase = 'green';

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
        label.textContent = EXTRA_PHRASES[0];
      }
    } else if (phase === 'begging') {
      presses++;
      if (presses < 20) {
        label.textContent = EXTRA_PHRASES[presses];
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
          onAnswer(q.pts.correct, 'si è fermato');
        });
        answersGrid.appendChild(stopBtn);
      }
    } else if (phase === 'red') {
      phase = 'done';
      onAnswer(q.pts.wrong, 'ha premuto il bottone rosso');
    }
  });
}