export function renderCodeQuestion(q, answersGrid, onAnswer) {
  const img = document.createElement('img');
  img.src = q.image;
  img.style.cssText = 'display:block;margin:0 auto 20px;max-width:100%;border-radius:10px;';

  const input = document.createElement('textarea');
  input.placeholder = "scrivi l'output qui...";
  input.classList.add('answer-btn');
  input.style.cssText = 'width:100%;text-align:left;resize:vertical;min-height:80px;font-family:monospace;';

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'conferma';
  submitBtn.classList.add('answer-btn');
  submitBtn.style.background = 'var(--yellow)';

  submitBtn.addEventListener('click', () => {
    const val = input.value.trim();
    if (!val) return;
    const pts = val === q.correctAnswer.trim() ? q.pts.correct : q.pts.wrong;
    onAnswer(pts, val);
  });

  answersGrid.appendChild(img);
  answersGrid.appendChild(input);
  answersGrid.appendChild(submitBtn);
}