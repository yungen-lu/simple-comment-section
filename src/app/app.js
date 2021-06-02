import { gql } from '@apollo/client/core';
import { ConnectTo } from '../qraphql/app';

const button = document.querySelector('#Button');
button.addEventListener('click', signUp);
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
      }
    }
  }
`;
test.httpQuery(DATA).then((e) => {
  console.log(e);
  const container = document.querySelector('#container');
  e.data.feed.forEach((el) => {
    console.log(el.content);
    let newNode = document.createElement('div');
    newNode.classList.add('app');
    newNode.classList.add('myself');
    newNode.innerText = el.content;
    container.appendChild(newNode);
  });
  // for (const feed in e.data.feed) {
  // let newNode = document.createElement('div');
  // newNode.classList.add("app")
  // newNode.classList.add("myself")
  // console.log(feed.content);
  // newNode.innerText=feed.content;
  // container.appendChild(newNode)
  // }
});
