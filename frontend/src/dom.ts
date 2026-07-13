function getElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element with id "${id}" not found`);
  return el as T;
}

export const form = getElement<HTMLFormElement>('loginForm');
export const emailInput = getElement<HTMLInputElement>('email');
export const passwordInput = getElement<HTMLInputElement>('password');
export const errorDisplay = getElement<HTMLParagraphElement>('error');