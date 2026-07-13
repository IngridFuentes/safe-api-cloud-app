import { form, emailInput, passwordInput, errorDisplay } from './dom.js';

form.addEventListener('submit', async function (event) {
  console.log('Form submitted');
  event.preventDefault();
  errorDisplay.textContent = '';
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const response = await fetch('https://getappchecktoken-394733787995.us-central1.run.app/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('User signed in successfully');
      window.location.href = '/dashboard.html';
    } else {
      errorDisplay.textContent = 'Invalid email or password.';
      console.error(data);
    }
  } catch (error) {
    errorDisplay.textContent = 'Invalid email or password.';
    console.error(error);
  }
});