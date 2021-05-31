import { gql } from '@apollo/client/core';
import { ConnectTo } from '../qraphql/app';

const loginForm = document.querySelector('#loginForm');
loginForm.addEventListener('submit', signUp);
function signUp(e) {
  e.preventDefault();
  const email = document.querySelector('#email');
  const password = document.querySelector('#password');

  const parsedQuery = gql`
    mutation login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          id
        }
      }
    }
  `;
  test
    .httpMutate(parsedQuery, {
      email: email.value,
      password: password.value,
    })
    .then((e) => {
      console.log(e);
    })
    .catch((e) => {
      console.error(e);
    //   alert('Email used by somebody,enter a different email');
    });
}
const test = new ConnectTo('localhost', '4000', '/graphql');
