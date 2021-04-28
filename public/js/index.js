/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
// VALUES

//DELEGATION
if (mapBox) {
  const locations = JSON.parse(
    document.querySelector('#map').dataset.locations
  );
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', userDataForm.querySelector('#name').value);
    form.append('email', userDataForm.querySelector('#email').value);
    form.append('photo', userDataForm.querySelector('#photo').files[0]);

    console.log(form);
    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.querySelector('.btn--save-password');
    btn.textContent = 'Updating...';

    const passwordCurrent = userPasswordForm.querySelector('#password-current')
      .value;
    const password = userPasswordForm.querySelector('#password').value;
    const passwordConfirm = userPasswordForm.querySelector('#password-confirm')
      .value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    btn.textContent = 'Save password';
    passwordCurrent.value = '';
    password.value = '';
    passwordConfirm.value = '';
  });
}
