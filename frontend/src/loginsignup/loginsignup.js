import axios from 'axios';
import Cookies from 'js-cookie';
import './style.css';
const login_VAR = 'Login';
const signup_VAR = 'Sign up';
const welcome_LOGIN = 'Login to your account';
const welcome_SIGNUP = 'Sign up to use the app';
const form = document.querySelector('#FORM');
const button = document.querySelector('#BUTTON');
const emailInput = document.querySelector('#email-address');
const checkBox = document.querySelector('#remember_me');
const password = document.querySelector('#password');
const change = document.querySelector('#change');
const welcomeText = document.querySelector('#welcometext');

form.addEventListener('submit', (e) => {
  const STATE = getState();
  if (STATE === 1) {
    sendLoginReq(e);
  }
  if (STATE === 0) {
    sendSignupReq(e);
  }
});
function sendLoginReq(e) {
  e.preventDefault();
  console.log('sending');
  const postObj = {
    email: emailInput.value,
    password: password.value,
    rememberme: checkBox.checked,
  };
  axios
    .post('/login', postObj)
    .then((e) => {
      console.log(e.data);
      console.log('HI');
      Cookies.set('id', e.data.id, { expires: 1 });
      window.location = e.data.url;
    })
    .catch((err) => {
      console.log(err);
    });
}
function sendSignupReq(e) {
  e.preventDefault();
  const user = document.querySelector('#username');
  console.log('sending');
  const postObj = {
    user: user.value,
    email: emailInput.value,
    password: password.value,
    rememberme: checkBox.checked,
  };
  axios
    .post('/signup', postObj)
    .then((e) => {
      console.log('HI');
      Cookies.set('id', e.data.id, { expires: 1 });
      window.location = e.data.url;
    })
    .catch((err) => {
      console.log(err);
    });
}
change.addEventListener('click', (e) => {
  e.preventDefault();
  let STATE = getState();
  if (STATE === 1) {
    changeToSignup();
  } else if (STATE === 0) {
    changeToLogin();
  } else {
    console.error('ERR');
  }
});
function changeToSignup() {
  const copytarget = document.querySelector('#copytarget');
  const newDiv = copytarget.cloneNode(true);
  newDiv.childNodes[3].id = 'username';
  newDiv.childNodes[3].name = 'username';
  newDiv.childNodes[3].type = 'text';
  newDiv.childNodes[3].autocomplete = 'name';
  newDiv.childNodes[3].placeholder = 'username';
  newDiv.childNodes[3].value = '';

  newDiv.childNodes[3].classList.remove('rounded-t-md');
  copytarget.after(newDiv);
  button.innerText = signup_VAR;
  welcomeText.innerText = welcome_SIGNUP;
  change.innerText = 'Login';
}
function changeToLogin() {
  const rmDiv = document.querySelector('#username');
  if (rmDiv) {
    rmDiv.remove();
  }
  button.innerText = login_VAR;
  welcomeText.innerText = welcome_LOGIN;
  change.innerText = 'Signup';
}
function getState() {
  if (button.innerText === login_VAR) {
    return 1;
  } else if (button.innerText === signup_VAR) {
    return 0;
  } else {
    console.error('ERR__state');
  }
}
