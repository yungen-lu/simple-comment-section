export function postedBy(parent: any, args: any, context: any) {
  return context.prisma.post
    .findUnique({ where: { id: parent.id } })
    .postedBy();
}
