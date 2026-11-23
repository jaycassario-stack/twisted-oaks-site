// Sends the inquiry form without leaving the page, then shows the thank-you page.
// Without JavaScript the form still works: it posts to the form service directly.
(function () {
  var form = document.getElementById('inquiry');
  if (!form) return;
  var status = form.querySelector('.form-status');
  var button = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
      status.className = 'form-status err';
      status.textContent = 'This form is not connected yet. Please email jaycassario@gmail.com.';
      return;
    }
    button.disabled = true;
    button.textContent = 'Sending…';
    status.className = 'form-status';
    status.textContent = '';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error();
        window.location.href = form.getAttribute('data-thanks') || '/';
      })
      .catch(function () {
        button.disabled = false;
        button.textContent = 'Send it over';
        status.className = 'form-status err';
        status.textContent = 'Something went wrong. Please try again, or email jaycassario@gmail.com.';
      });
  });
})();

// "Still deciding on a date" makes the date optional.
(function () {
  var box = document.getElementById('date-not-set');
  var date = document.getElementById('wedding-date');
  if (!box || !date) return;
  function sync() { date.required = !box.checked; date.disabled = box.checked; if (box.checked) date.value = ''; }
  box.addEventListener('change', sync); sync();
})();
