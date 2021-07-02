import { POST_LINK } from '../constants';
function newLinkSubscribe(parent: any, args: any, context: any, info: any) {
  console.log('|||', context.userId);
  const userId = context.userId;
  if (!userId) {
    throw new Error('no auth');
  }
  return context.pubsub.asyncIterator(POST_LINK);
}

export const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload: any) => {
    return payload;
  },
};
