// @ts-ignore
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
// @ts-ignore
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app-check.js';
// @ts-ignore
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';
import { firebaseConfig } from './frontend/src/firebase-config.js';
// 1. Start up the Firebase app with config
const app = initializeApp(firebaseConfig);
// 2. Turn on App Check, using reCAPTCHA Enterprise to prove
//    requests are coming from a real site, not a bot or script
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider('6Lew2S0tAAAAANLRloQihRT1G9daCUf9ohDbS4Ka'),
    isTokenAutoRefreshEnabled: true,
});
// 3. Set up Auth so we can sign users in
export const auth = getAuth(app);
