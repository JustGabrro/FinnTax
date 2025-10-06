// Minimal client-side interactions
(function(){
// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');

navToggle.addEventListener('click', () => {
  const isVisible = !mobileNav.hasAttribute('hidden');

  if (isVisible) {
    mobileNav.setAttribute('hidden', '');
    navToggle.setAttribute('aria-expanded', 'false');
  } else {
    mobileNav.removeAttribute('hidden');
    navToggle.setAttribute('aria-expanded', 'true');
  }
});


  // Highlight current nav link
  const navLinks = document.querySelectorAll('[data-nav]');
  if(navLinks.length){
    const path = location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(a => {
      const href = a.getAttribute('href');
      if(href === path) a.classList.add('active');
    });
  }

  // Quick estimate form
  const estimateForm = document.getElementById('estimateForm');
  const estimateResult = document.getElementById('estimateResult');
  const resetBtn = document.getElementById('resetBtn');
  if(estimateForm){
    estimateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(estimateForm);
      const income = Number(fd.get('income') || 0);
      const filing = String(fd.get('filing') || 'individual');
      const rate = (filing === 'business') ? 0.25 : 0.18;
      const est = Math.max(0, income * rate);
      estimateResult.textContent = income ? `Estimated tax: $${est.toFixed(2)}` : 'Please enter income.';
    });
    if(resetBtn){
      resetBtn.addEventListener('click', () => {
        estimateForm.reset();
        estimateResult.textContent = '';
      });
    }
  }

  // Newsletter placeholder (no backend calls)
  const newsletter = document.getElementById('newsletterForm');
  if(newsletter){
    newsletter.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(newsletter);
      const email = String(fd.get('email') || '');
      if(!email) return alert('Enter email');
      alert('Thanks for subscribing!');
      newsletter.reset();
    });
  }

  // Footer year
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();
})();
