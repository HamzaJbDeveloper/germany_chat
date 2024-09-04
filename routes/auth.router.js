// db instance
const getConnetion=require("../database/connect").getConnetion


const router=require("express").Router()


router.post("/login",async (req, res, next)=>{
    try{
        const {email, password}=req.body

        const [rows,fields]=await getConnetion().execute("select * from users where email=? ;",[email])
        if(rows.length==0)return res.json({status:false, msg:"no user with that email"})
        const comparePassword=await require("../utils/bcrypt").comparePassword(password,rows[0].password)
        if(!comparePassword)return res.json({status:false, msg:"wrong password"})
        const token =require("../utils/jwt").signJWT(rows[0])
        res.json({status:true, token,userInfo:rows[0]})
    }catch(err){
        console.log(err)
        res.json({status:false, msg:"server error while trying to loggin"})
    }

})

router.post("/register", async (req, res, next)=>{
    try{
        const {first_name, last_name, email, password,level_id, country, city }=req.body
        const newPassword=await require("../utils/bcrypt").hashPassword(password)
        const [rows,fields]=await getConnetion().execute("INSERT INTO users (first_name, last_name, email, password ,level_id, country, city,isAnonymous) VALUES (?,?,?,?,?,?,?,?);",[first_name, last_name, email, newPassword,level_id, country, city, false])
        return res.json({status:true, msg:"new user is added !"})
    }catch(err){
        console.log(err)
        res.json({status:false, msg:"server error while trying to register a user"})
    }
})
router.post("/register/anonymous",async (req, res, next)=>{
    try{
        const {level_id, country, city, }=req.body
        const [rows,fields]=await getConnetion().execute("INSERT INTO users (level_id, country, city,isAnonymous) VALUES (?,?,?,?);",[level_id, country, city, true])
        const token =require("../utils/jwt").signJWT({level_id, id:rows.insertId, country, city})
        return res.json({status:true, token ,userInfo:{level_id, id:rows.insertId, country, city}})
    }catch(err){
        console.log(err)
        res.json({status:false, msg:"server error while trying to register as anonymous"})
    }
})

module.exports=router;