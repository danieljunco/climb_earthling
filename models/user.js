var mongoose                =   require("mongoose"),
    passportLocalMongoose   =   require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: String,
    name: String,
    email: String,
    alias: {
        type: String,
        default: "Alias"
    },
    city: String,
    country: String,
    phone: Number,
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);