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
