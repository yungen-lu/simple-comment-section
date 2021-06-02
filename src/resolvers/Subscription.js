function newLinkSubscribe(parent, args, context, info) {
  if (!context.userId) {
    throw new Error('no auth');
  }
  return context.pubsub.asyncIterator('NEW_LINK');
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => {
    // console.log(payload);
    return payload;
  },
};

module.exports = {
  newLink,
};
