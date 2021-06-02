function newLinkSubscribe(parent, args, context, info) {
  // if (!context.req.session.mycookie) {
  //   throw new Error('userId is uncorrect');
  //   return null;
  // }
  // console.log(context);
  // if (!context.userId) {
  //   throw new Error('userId');
  // }
  if (!context.userId) {
    throw new Error('no auth');
  }
  return context.pubsub.asyncIterator('NEW_LINK');
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => {
    console.log(payload);
    return payload;
  },
};
// const newLink = {
//   subscribe: (parent, args, context, info) => {
//     return newLinkSubscribe(parent, args, context, info);
//   },
//   resolve: (payload) => {
//     return payload;
//   },
// };

module.exports = {
  newLink,
};
