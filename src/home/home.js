// import { gql } from '@apollo/client/core';
// import { ConnectTo } from '../qraphql/app';
import axios from 'axios';
const homeForm = document.querySelector('#homeForm');
const checkBox = document.querySelector('#check');
const inputs = document.querySelector('#inputs');
const changebutton = document.querySelector('#change');
const title = document.querySelector('.form-home-heading');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const homebutton = document.querySelector('#homeButton');

homeForm.addEventListener('submit', (e) => {
  const STATE = getState(title);
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
    email: email.value,
    password: password.value,
    rememberme: checkBox.checked,
  };
  axios
    .post('/login', postObj)
    .then((e) => {
      console.dir(e);
      console.log('HI');
      // window.location.href = 'app';
      window.location = e.request.responseURL;
    })
    .catch((err) => {
      console.log(err);
    });
}
function sendSignupReq(e) {
  e.preventDefault();
  const user = document.querySelector('#user');
  console.log('sending');
  const postObj = {
    user: user.value,
    email: email.value,
    password: password.value,
    rememberme: checkBox.checked,
  };
  axios
    .post('/signup', postObj)
    .then(() => {
      console.log('HI');
    })
    .catch((err) => {
      console.log(err);
    });
}

changebutton.addEventListener('click', (e) => {
  e.preventDefault();
  let STATE = getState(title);
  if (STATE === 1) {
    changeToSignup();
  } else if (STATE === 0) {
    changeToLogin();
  } else {
    console.error('ERR');
  }
});
function changeToSignup() {
  let newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.id = 'user';
  newInput.name = 'user';
  newInput.placeholder = 'username';
  newInput.className = 'form-home-input';
  newInput.classList.add('fadein');
  inputs.appendChild(newInput);
  // const title = document.querySelector('.form-home-heading');
  title.classList.add('fadeout');
  setTimeout(() => {
    title.innerText = 'Signup';
    changebutton.innerText = 'Login';
    title.classList.remove('fadeout');
    title.classList.add('fadein');
  }, 500);
  homebutton.innerText = 'Signup';
}
function changeToLogin() {
  let newInput = document.querySelector('#user');
  newInput.classList.remove('fadein');
  newInput.classList.add('fadeout');
  newInput.remove();
  // const title = document.querySelector('.form-home-heading');
  setTimeout(() => {
    title.innerText = 'Login';
    changebutton.innerText = 'Signup';
  }, 500);
  homebutton.innerText = 'Login';
}
function getState(e) {
  if (e.innerText === 'Login') {
    return 1;
  } else if (e.innerText === 'Signup') {
    return 0;
  } else {
    console.error('ERR');
  }
}
// function signUp(e) {
//   e.preventDefault();
//   const email = document.querySelector('#email');
//   const password = document.querySelector('#password');
//
//   const parsedQuery = gql`
//     mutation home($email: String!, $password: String!) {
//       home(email: $email, password: $password) {
//         token
//         user {
//           id
//         }
//       }
//     }
//   `;
//   test
//     .httpMutate(parsedQuery, {
//       email: email.value,
//       password: password.value,
//     })
//     .then((e) => {
//       console.log(e);
//     })
//     .catch((e) => {
//       console.error(e);
//       //   alert('Email used by somebody,enter a different email');
//     });
// }
// const test = new ConnectTo('localhost', '4000', '/graphql');
