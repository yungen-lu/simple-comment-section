// const axios = require('axios');
import axios from 'axios';
// import { gql } from '@apollo/client/core';
// import { ConnectTo } from '../qraphql/app';
const signUpButton = document.querySelector('#signUpButton');
const loginForm = document.querySelector('#signupForm');
const user = document.querySelector('#user');
const email = document.querySelector('#email');
const password = document.querySelector('#password');

loginForm.addEventListener('submit', sendb1Req);
function sendb1Req(e) {
  e.preventDefault();
  console.log('sending');
  const postObj = {
    user: user.value,
    email: email.value,
    password: password.value,
  };
  axios
    .post('/signup1', postObj)
    .then(() => {
      console.log('HI');
    })
    .catch((err) => {
      console.log(err);
    });
}

// function signUp(e) {
//   e.preventDefault();
//   const email = document.querySelector('#email');
//   const user = document.querySelector('#user');
//   const password = document.querySelector('#password');
//
//   const parsedQuery = gql`
//     mutation signup($user: String!, $email: String!, $password: String!) {
//       signup(name: $user, email: $email, password: $password) {
//         token
//         user {
//           id
//         }
//       }
//     }
//   `;
//   test
//     .httpMutate(parsedQuery, {
//       user: user.value,
//       email: email.value,
//       password: password.value,
//     })
//     .then((e) => {
//       console.log(e);
//     })
//     .catch((e) => {
//       console.error(e);
//       alert('Email used by somebody,enter a different email');
//     });
// }
// const DATA = gql`
//   query {
//     feed(orderBy: { createdAt: asc }) {
//       content
//     }
//   }
// `;
// const DATA2 = gql`
//   subscription {
//     newLink {
//       id
//       content
//       postedBy {
//         name
//       }
//     }
//   }
// `;
// const test = new ConnectTo('localhost', '4000', '/graphql');
// // test.wsQuery(DATA2);
