const mongoose=require("mongoose");
const Schema = mongoose.Schema
const {user}= require("./user")
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/inotebook");
}
const noteschema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    title: {
        type: String,
        required: [true,"The title should not be empty"],
        minLength:[2,"The title is too short"],
        trim:true,
    },
    description: {
        type: String,
        required: [true,"The description should not be empty"],
        minLength:[3,"The description is too short"],
        trim:true,
    },
    date: {
        type: Date,
        required:true,
        default:Date.now
    }
})
const note = mongoose.model("note", noteschema)
module.exports={note}