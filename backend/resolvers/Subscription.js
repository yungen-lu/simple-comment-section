const { POST_LINK } = require('../constants');
function newLinkSubscribe(parent, args, context, info) {
  console.log('|||', context.userId);
  const userId = context.userId;
  if (!userId) {
    throw new Error('no auth');
  }
  return context.pubsub.asyncIterator(POST_LINK);
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => {
    return payload;
  },
};

module.exports = {
  newLink,
};
