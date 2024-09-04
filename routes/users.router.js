const { getConnetion } = require("../database/connect")

const router=require("express").Router()

router.get("/getAll",async (req, res, next)=>{
    console.log(getConnetion())
    try{
        const [rows,fields]=await getConnetion().execute("select users.id as id, first_name, last_name, email, country, city , name as level from users JOIN level ON users.level_id=level.id;")
        res.json({status:true, usersList:rows})
    }catch(err){
        console.log(err)
        res.json({status:false, msg:"server error while trying to get users List"})
    }

})

router.post("/getUserData",async (req, res, next)=>{
    try {
        const {userId}=req.body;
        console.log(userId)
        const [rows,fields]=await getConnetion().execute("select first_name, last_name, email, country, city , name as level from users LEFT JOIN level ON users.level_id=level.id WHERE users.id=?;",[userId])
        res.status(200).json({status:true, userInfo:rows[0]})
    } catch (error) {
        console.log(error)
    }
})

module.exports=router;
