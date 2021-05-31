function postedBy(parent, args, context) {
    return context.prisma.post.findUnique({ where: { id: parent.id } }).postedBy()
  }
  
  module.exports = {
    postedBy,
  }