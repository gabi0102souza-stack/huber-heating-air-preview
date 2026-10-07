'use strict';
(() => {
  const form = document.querySelector('#service-form');
  const service = document.querySelector('#service-needed');
  const requestType = document.querySelector('#request-type');
  const phone = document.querySelector('#customer-phone');
  const customerName = document.querySelector('#customer-name');
  const result = document.querySelector('#draft-result');
  const status = document.querySelector('#draft-status');
  const draftLink = document.querySelector('#email-draft-link');
  if (!form) return;
  document.querySelector('#request-fields').disabled = false;
  const clearDraft = () => {
    result.hidden = true;
    draftLink.href = 'mailto:jameshuber56@yahoo.com';
    status.textContent = '';
  };
  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      service.value = link.dataset.service;
      requestType.value = link.dataset.intent === 'estimate' ? 'estimate' : 'service';
      clearDraft();
    });
  });
  form.addEventListener('input', () => {
    phone.setCustomValidity('');
    customerName.setCustomValidity('');
    clearDraft();
  });
  form.addEventListener('change', clearDraft);
  form.addEventListener('submit', event => {
    event.preventDefault();
    customerName.setCustomValidity(customerName.value.trim() ? '' : 'Please enter your name.');
    const digits = phone.value.replace(/\D/g, '');
    phone.setCustomValidity(digits.length >= 7 && digits.length <= 15 ? '' : 'Please enter a phone number with 7 to 15 digits.');
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = `Huber ${requestType.value === 'estimate' ? 'estimate' : 'service'} request: ${service.value}`;
    const body = [
      'Hello Huber Heating & Air Conditioning,', '',
      `Name: ${String(data.get('name')).trim()}`,
      `Phone: ${String(data.get('phone')).trim()}`,
      `Email: ${String(data.get('email')).trim() || 'Not provided'}`,
      `Service needed: ${data.get('service')}`, '',
      'Message:', String(data.get('message')).trim() || 'Please contact me to discuss this request.', '',
      'This draft was prepared using an independent website concept. Please confirm availability and any appointment directly.'
    ].join('\r\n');
    draftLink.href = `mailto:jameshuber56@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    result.hidden = false;
    status.textContent = 'Your email draft is ready. Open your email app, review the details and send it. Nothing has been sent yet.';
    draftLink.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  });
})();