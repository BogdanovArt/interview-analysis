module.exports = function(mongoose) {
  const Schema = mongoose.Schema;

  const UserSchema = {
    first_name: String,
    last_name: String,
    created: { type: Date, default: Date.now() },
  }

  const User = new Schema(UserSchema);

  return {
    User,
    UserSchema
  }
}

