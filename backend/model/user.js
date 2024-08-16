const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {note}=require("./note")
const passportLocalMongoose = require("passport-local-mongoose");
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/inotebook");
}
let userschema = new Schema({
    name: {
        type: String,
        required: [true, "The name should not be empty"],
        minLength: [2, "The name is too short"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "The email should not be empty"],
        unique: [true, "The Email already exist"],
        trim: true,
    },
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref:'note'
        }
    ]
})
userschema.plugin(passportLocalMongoose, { usernameField: "email" });
let User = mongoose.model("User", userschema)

module.exports={User}