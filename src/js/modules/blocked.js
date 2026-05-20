export function renderBlocked(q, answersGrid, onAnswer) {
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
      clearInterval(flashInterval);
      observer.disconnect();
      blocker.remove();
      onAnswer(ans.pts, ans.text);
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
      onAnswer(-1, '');
    } else if (containerGone && containerInDom) {
      containerInDom = false;
      clearInterval(flashInterval);
      observer.disconnect();
      const btn = document.createElement('button');
      btn.textContent = 'continua';
      btn.classList.add('answer-btn');
      btn.style.background = 'var(--pink)';
      btn.addEventListener('click', () => onAnswer(1, '(ha eliminato tutto)'));
      answersGrid.innerHTML = '';
      answersGrid.appendChild(btn);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}