function allUsers(parent, args, context, info) {
  return context.prisma.user.findMany();
}
function postById(parent, args, context, info) {
  return context.prisma.post.findUnique({
    where: { id: args.id || undefined },
  });
}
async function feed(parent, args, context, info) {
  const userId = context.userId;
  if (!userId) {
    throw new Error('No Auth');
  }
  const posts = await context.prisma.post.findMany({
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
  });
  return posts;
}
module.exports = {
  allUsers,
  postById,
  feed,
};
