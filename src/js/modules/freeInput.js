export function renderFreeInput(q, answersGrid, onAnswer) {
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
    onAnswer(q.evaluate(val), val);
  });

  answersGrid.appendChild(input);
  answersGrid.appendChild(submitBtn);
}