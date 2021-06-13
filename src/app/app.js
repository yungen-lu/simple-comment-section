import './style.css';

import { gql } from '@apollo/client/core';
import { ConnectTo } from '../qraphql/app';
import Cookies from 'js-cookie';
// const button = document.querySelector('#Button');
// button.addEventListener('click', signUp);
const textButton = document.querySelector('#textButton');
textButton.addEventListener('click', textInputFunc);
const userid = Cookies.get('id');
function textInputFunc(e) {
  // e.preventDefault();
  const textInput = document.querySelector('#textInput');
  const INPUT = gql`
    mutation post($content: String!) {
      post(content: $content) {
        id
      }
    }
  `;
  test.httpMutate(INPUT, { content: textInput.value });
}
function signUp(e) {
  e.preventDefault();
  console.log('start');
  const SUB = gql`
    subscription {
      newLink {
        id
        content
        postedBy {
          name
        }
      }
    }
  `;
  test.wsQuery(SUB).then((e) => {
    e.subscribe({
      next(e) {
        console.log(e);
      },
    });
  });
}
const test = new ConnectTo('localhost', '4000', '/graphql');
const DATA = gql`
  query {
    feed(orderBy: { createdAt: asc }) {
      content
      postedBy {
        name
        id
      }
      createdAt
    }
  }
`;
const template_r = document.querySelector('#template-r');
const template_l = document.querySelector('#template-l');
const target = document.querySelector('#target');
test.httpQuery(DATA).then((e) => {
  console.log(e);
  inserNewDiv(e);
});
function inserNewDiv(e) {
  e.data.feed.forEach((el) => {
    if (userid == el.postedBy.id) {
      const newDiv = template_r.content.cloneNode(true);
      newDiv.querySelector('p').innerText = el.content;
      newDiv.querySelector('#userName-r').innerText = el.postedBy.name;
      const dateObj = new Date(el.createdAt);
      newDiv.querySelector('#time-r').innerText = dateObj.toLocaleTimeString();
      target.appendChild(newDiv);
    } else {
      const newDiv = template_l.content.cloneNode(true);
      newDiv.querySelector('p').innerText = el.content;
      newDiv.querySelector('#userName-l').innerText = el.postedBy.name;
      const dateObj = new Date(el.createdAt);
      newDiv.querySelector('#time-l').innerText = dateObj.toLocaleTimeString();
      target.appendChild(newDiv);
    }
  });
}
// let newNode = document.createElement('div');
// newNode.classList.add('app');
// newNode.classList.add('myself');
// newNode.innerText = el.content;
// container.appendChild(newNode);
