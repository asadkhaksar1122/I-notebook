function islogin(req,res,next) {
    if (req.user) {
        next()
    }
    else {
        res.json({"login":false})
    }
}
module.exports={islogin}