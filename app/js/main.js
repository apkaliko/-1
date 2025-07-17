const nav     = document.querySelector('.section-nav');
const rail    = nav.querySelector('.section-nav__rail');
const thumb   = nav.querySelector('#sectionThumb');
const controls = [...nav.querySelectorAll('[data-target]')];
let scrollingTo = null;
function moveThumb(el){
  const rectItem = el.getBoundingClientRect();
  const rectRail = rail.getBoundingClientRect();
  const top = rectItem.top - rectRail.top + rectItem.height/2 - thumb.offsetHeight/2;
  thumb.style.top = `${top}px`;
}
function activate(idx, smooth = true){
  const el     = controls[idx];
  const target = document.querySelector(el.dataset.target);
  if (!target) return;
  if (smooth) scrollingTo = target.id;
  target.scrollIntoView({behavior: smooth ? 'smooth' : 'auto'});
  controls.forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  moveThumb(el);
}
controls.forEach((ctrl, idx) => ctrl.addEventListener('click', () => activate(idx)));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (scrollingTo) {
      if (entry.isIntersecting && entry.target.id === scrollingTo) {
        scrollingTo = null;
      } 
      return;
    }
    if (entry.isIntersecting) {
      const idx = controls.findIndex(c => c.dataset.target === `#${entry.target.id}`);
      if (idx !== -1) activate(idx, false);
    }
  });
}, {threshold: 0.6});
controls.forEach(c => {
  const sec = document.querySelector(c.dataset.target);
  if (sec) observer.observe(sec);
});
window.addEventListener('load', () => moveThumb(controls[0]));
