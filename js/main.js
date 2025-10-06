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

  // ---- Appointment Date Constraints (Contact Page) ----
  const appointmentDate = document.getElementById('date');
  if(appointmentDate){
    const today = new Date();
    const pad = n => String(n).padStart(2,'0');
    const fmt = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

    const minStr = fmt(today);
    const maxDate = new Date(today);
    maxDate.setFullYear(maxDate.getFullYear() + 1); // limit to one year ahead
    const maxStr = fmt(maxDate);

    appointmentDate.min = minStr;
    appointmentDate.max = maxStr;

    function clampDate(){
      if(!appointmentDate.value) return;
      // Raw string YYYY-MM-DD
      const v = appointmentDate.value;
      // Basic format guard
      if(!/^\d{4}-\d{2}-\d{2}$/.test(v)) { appointmentDate.value = minStr; return; }
      const year = Number(v.slice(0,4));
      const currentYear = today.getFullYear();
      const nextYear = currentYear + 1;
      if(year < currentYear) {
        appointmentDate.value = minStr; return;
      }
      if(year > nextYear) {
        appointmentDate.value = maxStr; return;
      }
      // Fine-grained compare for full date bounds
      if(v < minStr) appointmentDate.value = minStr;
      else if(v > maxStr) appointmentDate.value = maxStr;
    }
    ['change','input','blur','keyup'].forEach(evt => appointmentDate.addEventListener(evt, clampDate));
    // In case browser restores an outdated cached value
    clampDate();
  }

  // ---- Custom Appointment Picker (current + next year only) ----
  const picker = document.getElementById('appointmentPicker');
  const yearSel = document.getElementById('dateYear');
  const monthSel = document.getElementById('dateMonth');
  const daySel = document.getElementById('dateDay');
  if(picker && yearSel && monthSel && daySel){
    const today = new Date();
    const currentYear = today.getFullYear();
    const nextYear = currentYear + 1;
    const hiddenInput = document.getElementById('date'); // hidden ISO date field
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    function pad(n){ return String(n).padStart(2,'0'); }
    function daysInMonth(y,m){ return new Date(y, m+1, 0).getDate(); }

    function populateYears(){
      yearSel.innerHTML = '';
      [currentYear, nextYear].forEach(y => {
        const opt = document.createElement('option');
        opt.value = y; opt.textContent = y; yearSel.appendChild(opt);
      });
    }
    function populateMonths(){
      monthSel.innerHTML = '';
      const selectedYear = Number(yearSel.value);
      const startMonth = (selectedYear === currentYear) ? today.getMonth() : 0;
      for(let m = startMonth; m < 12; m++){
        const opt = document.createElement('option');
        opt.value = m; opt.textContent = monthNames[m];
        monthSel.appendChild(opt);
      }
    }
    function populateDays(){
      daySel.innerHTML = '';
      const y = Number(yearSel.value);
      const m = Number(monthSel.value);
      const total = daysInMonth(y,m);
      const startDay = (y === currentYear && m === today.getMonth()) ? today.getDate() : 1;
      for(let d = startDay; d <= total; d++){
        const opt = document.createElement('option');
        opt.value = d; opt.textContent = d;
        daySel.appendChild(opt);
      }
    }
    function syncHidden(){
      if(!hiddenInput) return;
      const y = yearSel.value;
      const m = pad(Number(monthSel.value)+1);
      const d = pad(Number(daySel.value));
      hiddenInput.value = `${y}-${m}-${d}`;
    }
    function ensureValidAfterYearChange(){
      const selectedYear = Number(yearSel.value);
      const monthBase = Number(monthSel.value);
      // If switching from future year to current, ensure month not before current month
      if(selectedYear === currentYear && monthBase < today.getMonth()){
        populateMonths();
      }
    }

    // Initialize
    populateYears();
    populateMonths();
    populateDays();
    syncHidden();

    yearSel.addEventListener('change', () => {
      populateMonths();
      populateDays();
      ensureValidAfterYearChange();
      syncHidden();
    });
    monthSel.addEventListener('change', () => { populateDays(); syncHidden(); });
    daySel.addEventListener('change', syncHidden);
  }
})();
