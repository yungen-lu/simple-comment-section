const { DataTimeResolver } = require('graphql-scalars')

function DateTime(parent, args, context) {
    return DataTimeResolver
  }
  
  module.exports = {
    DateTime,
  }