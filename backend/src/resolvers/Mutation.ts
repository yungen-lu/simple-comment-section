// const bcrypt = require('bcryptjs');
import { POST_LINK } from '../constants';
// const { POST_LINK } = require('../constants');
// const jwt = require('jsonwebtoken');
// const { APP_SECRET, getUserId } = require('../utils');
// async function signup(parent, args, context, info) {
//   const password = await bcrypt.hash(args.password, 10);
//
//   const user = await context.prisma.user.create({
//     data: { ...args, password },
//   });
//
//   const token = jwt.sign({ userId: user.id }, APP_SECRET);
//
//   return {
//     token,
//     user,
//   };
// }
//
// async function login(parent, args, context, info) {
//   const user = await context.prisma.user.findUnique({
//     where: { email: args.email },
//   });
//   if (!user) {
//     throw new Error('No such user found');
//   }
//
//   const valid = await bcrypt.compare(args.password, user.password);
//   if (!valid) {
//     throw new Error('Invalid password');
//   }
//
//   const token = jwt.sign({ userId: user.id }, APP_SECRET);
//   return {
//     token,
//     user,
//   };
// }

export async function post(parent: any, args: any, context: any, info: any) {
  const userId = context.userId;
  if (!userId) {
    throw new Error('unvalid user');
  }
  const newLink = await context.prisma.post.create({
    data: {
      content: args.content,
      postedBy: { connect: { id: userId } },
    },
  });
  context.pubsub.publish(POST_LINK, newLink);
  return newLink;
}
