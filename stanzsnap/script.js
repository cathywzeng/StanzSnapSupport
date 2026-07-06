const API = '/api/feedback';

function handleSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const data = new FormData(form);
  const entry = {
    name: (data.get('name') || '').toString().trim(),
    email: (data.get('email') || '').toString().trim(),
    category: (data.get('category') || 'other').toString().trim(),
    message: (data.get('message') || '').toString().trim(),
    feature: (data.get('feature') || '').toString().trim(),
  };

  if (!entry.message) return;

  const btn = form.querySelector('button[type="submit"]');
  const origText = btn.textContent;
  btn.textContent = '提交中…';
  btn.disabled = true;

  fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  })
    .then(() => {
      alert('感谢你的留言与建议！');
      form.reset();
    })
    .catch(() => {
      alert('感谢你的留言与建议！');
      form.reset();
    })
    .finally(() => {
      btn.textContent = origText;
      btn.disabled = false;
    });
}

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedback-form');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
});
