function posts(parent, args, context) {
  return context.prisma.user.findUnique({ where: { id: parent.id } }).posts();
}

module.exports = {
  posts,
};

