// db instance
const getConnetion=require("../database/connect").getConnetion


const router=require("express").Router()


router.post("/getRandomTopic",async (req, res, next)=>{
    try{
        const query=`
        select * from topics;
        ;
        `;
        console.log("here")
        const [rows,fields]=await getConnetion().execute(query);
        console.log(rows)
        const randomTopic=rows[parseInt(rows.length*Math.random())]
        res.status(200).json({status:true, randomTopic})
    }catch(err){
        console.log(err)
        res.json({status:false, msg:"server side error while getting Random topics"})
    }
})


module.exports=router;