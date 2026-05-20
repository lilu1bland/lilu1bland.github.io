const scenes = [
  document.getElementById('scene1'),
  document.getElementById('scene2'),
  document.getElementById('scene3'),
];

let current = 0;

scenes[0].classList.add('hidden');
setTimeout(() => scenes[0].classList.remove('hidden'), 50);

function showNext() {
  if (current >= scenes.length - 1) return;

  scenes[current].classList.add('fade-out');

  setTimeout(() => {
    scenes[current].classList.add('hidden');
    current++;
    scenes[current].classList.remove('hidden');
  }, 900);
}

setTimeout(() => showNext(), 6000);
setTimeout(() => showNext(), 12000);