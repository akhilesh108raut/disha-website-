// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }

  // Service capability accordion: one open at a time
  var capItems = Array.prototype.slice.call(document.querySelectorAll('.cap-item'));
  if (capItems.length) {
    var closeCapItem = function (item) {
      var btn = item.querySelector('.cap-summary');
      var panel = item.querySelector('.cap-panel');
      btn.setAttribute('aria-expanded', 'false');
      panel.style.maxHeight = null;
      item.classList.remove('open');
    };
    var openCapItem = function (item) {
      var btn = item.querySelector('.cap-summary');
      var panel = item.querySelector('.cap-panel');
      btn.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';
      item.classList.add('open');
    };
    capItems.forEach(function (item) {
      item.querySelector('.cap-summary').addEventListener('click', function () {
        var wasOpen = item.classList.contains('open');
        capItems.forEach(closeCapItem);
        if (!wasOpen) openCapItem(item);
      });
    });
    var capResizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(capResizeTimer);
      capResizeTimer = setTimeout(function () {
        var openItem = document.querySelector('.cap-item.open');
        if (openItem) {
          var panel = openItem.querySelector('.cap-panel');
          panel.style.maxHeight = 'none';
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      }, 120);
    });
  }

  // Contact form validation
  const form = document.getElementById('contact-form');
  if (form) {
    const successPanel = document.getElementById('form-success');

    const validators = {
      name: (v) => v.trim().length > 1,
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: (v) => v.trim().length > 9,
    };

    function setFieldState(field, valid) {
      const wrapper = field.closest('.field');
      if (!wrapper) return;
      wrapper.classList.toggle('invalid', !valid);
    }

    Object.keys(validators).forEach((name) => {
      const field = form.elements[name];
      if (field) {
        field.addEventListener('blur', () => setFieldState(field, validators[name](field.value)));
        field.addEventListener('input', () => {
          if (field.closest('.field').classList.contains('invalid')) {
            setFieldState(field, validators[name](field.value));
          }
        });
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;
      Object.keys(validators).forEach((name) => {
        const field = form.elements[name];
        if (field) {
          const valid = validators[name](field.value);
          setFieldState(field, valid);
          if (!valid) allValid = false;
        }
      });

      if (!allValid) {
        const firstInvalid = form.querySelector('.field.invalid input, .field.invalid textarea');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // No backend wired up yet — open a pre-filled email as a working fallback.
      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const company = form.elements.company ? form.elements.company.value.trim() : '';
      const message = form.elements.message.value.trim();
      const subject = encodeURIComponent(`Data Audit Inquiry — ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\n${message}`
      );

      form.style.display = 'none';
      if (successPanel) successPanel.style.display = 'block';

      window.location.href = `mailto:hello@dishaai.com?subject=${subject}&body=${body}`;
    });
  }
});
