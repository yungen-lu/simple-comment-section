export function allUsers(parent: any, args: any, context: any, info: any) {
  return context.prisma.user.findMany();
}
export function postById(parent: any, args: any, context: any, info: any) {
  return context.prisma.post.findUnique({
    where: { id: args.id || undefined },
  });
}
export async function feed(parent: any, args: any, context: any, info: any) {
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
