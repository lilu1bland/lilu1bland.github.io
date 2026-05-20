export function renderDefault(q, answersGrid, onAnswer, onEaster) {
  q.answers.forEach(ans => {
    const btn = document.createElement('button');
    btn.textContent = ans.text;
    btn.classList.add('answer-btn');

    btn.addEventListener('click', () => {
      if (ans.easter) {
        onEaster(ans.text);
        return;
      }
      onAnswer(ans.pts, ans.text);
    });

    answersGrid.appendChild(btn);
  });
}
