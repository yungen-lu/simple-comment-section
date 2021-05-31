const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');
async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);

  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  //   const { req } = context;
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    // console.log('err');
    throw new Error('No such user found');
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    // console.log('err');
    throw new Error('Invalid password');
  }
//   console.log('finish');
  if (context.req.session.userId) {
    context.req.session = null;
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  try {
    context.req.session.userId = user.id;
    context.req.session.name = user.name;
  } catch {
    // console.log('err');
  }
  //   context.req.session.mycookie = token;
  //   console.log(context.req.session.mycookie)
  //   console.log(context.req.session);
  return {
    token,
    user,
  };
}

async function post(parent, args, context, info) {
  const { userId } = context;
  const newLink = await context.prisma.post.create({
    data: {
      content: args.content,
      postedBy: { connect: { id: userId } },
    },
  });
  context.pubsub.publish('NEW_LINK', newLink);
  return newLink;
}

module.exports = {
  signup,
  login,
  post,
};
