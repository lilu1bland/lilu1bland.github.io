const NEGATIVE_WORDS = [
  'voglio il 6 a fine anno',
];

export function renderCodeReview(q, answersGrid, onAnswer) {
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
    const isSingleWord = val.split(/\s+/).length === 1;

    // ho cambiato la domanda, originalmente era un review sul codice ma lo ho cambiata

    const isNegative = NEGATIVE_WORDS.some(w => val.includes(w));
    const pts = (isSingleWord && isNegative) ? q.pts.correct : q.pts.wrong;
    onAnswer(pts, input.value.trim());
  });

  answersGrid.appendChild(input);
  answersGrid.appendChild(submitBtn);
}