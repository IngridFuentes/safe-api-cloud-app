import { form, emailInput, passwordInput, errorDisplay } from './dom.js';
declare const grecaptcha: any;

form.addEventListener('submit', async function (event) {
  console.log('Form submitted');
  event.preventDefault();
  errorDisplay.textContent = '';
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const token = await new Promise<string>((resolve) => {
      grecaptcha.enterprise.ready(async () => {
        const t = await grecaptcha.enterprise.execute('6LdDY10tAAAAAFCL-Qle4IaO0yLfasiu9Mq8GRNp', { action: 'LOGIN' });
        resolve(t);
      });
    });

    const response = await fetch('https://getappchecktoken-394733787995.us-central1.run.app/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, recaptchaToken: token })
    });

    const data = await response.json();
    // console.log('Response from server:', data);

    if (response.ok) {
      localStorage.setItem('uid', data.localId); //using local storage to store the uid and idToken for later use and bc backend is handling auth.
      localStorage.setItem('idToken', data.idToken);
      console.log('User signed in successfully');
      window.location.href = '/onboarding.html';
    } else {
      errorDisplay.textContent = 'Invalid email or password.';
      console.error(data);
    }
  } catch (error) {
    errorDisplay.textContent = 'Invalid email or password.';
    console.error(error);
  }
});