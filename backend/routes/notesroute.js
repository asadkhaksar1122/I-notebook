const express = require("express");
const router = express.Router();
const { note } = require("../model/note");
const { islogin } = require("../middleware/middleware");
const { User } = require("../model/user");
router.get("/", async (req, res) => {
  res.send("Hello World!");
});
router.post("/allnote", async (req, res) => {
  try {
      let { userid } = req.body;
      let allnote = await note.find({ owner: userid });
      res.json(allnote);
  } catch (error) {
    res.json({message:error.message, errorname:error.name})
  }

});
router.post("/newnote",  async (req, res) => {
  try {
    let { title, description,userid } = req.body;
    let newnote = new note({
      title: title,
      description: description,
      owner: userid,
    });
    let savednote = await newnote.save();
    let updateduser= await User.findByIdAndUpdate(userid,{$push:{notes:savednote._id}})
    res.json(savednote);
  } catch (error) {
      console.log(error)
    res.json({ errormessage: error.message, errorname: error.name });
  }
});
router.delete("/note/:id/", async (req, res) => {
  try {
    let { id } = req.params;
    let { userid } = req.body
     let checknote = await note.findById(id);
     if (!checknote.owner.equals(userid)) {
       return res.status(403).json({ message: "You are not the owner of this note" });
     }
    let deletednote = await note.findByIdAndDelete(id);
      console.log(req.user._id)
     let updateduser= await User.findByIdAndUpdate(req.user._id,{$pull:{notes:deletednote._id}})
     res.json(deletednote);
  } catch (error) {
    if (error.name == "CastError") {
      return res.json({
        errormessage: "the invalid id of product",
        errorname: error.name,
      });
    }
    res.json({ errormessage: error.message, errorname: error.name });
  }
});
router.post('/note/:id', async (req, res) => {
  try {
     let { userid } = req.body;
     let { id } = req.params;
     let onenote = await note.findById(id);
     if (!onenote.owner.equals(userid)) {
       return res
         .status(403)
         .json({ message: "You are not the owner of this note " });
     }
     res.json(onenote);
  } catch (error) {
    res.json({errorname:error.name,message:error.message})
  }
 
})
router.put("/note/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let { title, description,userid } = req.body;
    let checknote = await note.findById(id)
    if (!checknote.owner.equals(userid)) {
    return  res.status(403).json({"message":"You are not the owner of this note"})
    }
    let updatednote = await note.findByIdAndUpdate(id, {
      title,
      description,
    });
    res.send(updatednote);
  } catch (error) {
    if (error.name == "") {
    }
    res.json({ errormessage: error.message, errorname: error.name });
  }
});
module.exports = router;
