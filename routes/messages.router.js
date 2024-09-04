// db instance
const getConnetion=require("../database/connect").getConnetion

const router=require("express").Router()



router.get("/get/:senderId/:recieverId",async (req, res, next)=>{
    try {
        const {senderId, recieverId}=req.params
        const query=`
        select sender_users.id as senderId, reciever_users.id as recieverId , content from messages
        JOIN  users   sender_users  on messages.sender_id=sender_users.id
        JOIN users  reciever_users on messages.reciever_id=reciever_users.id
        WHERE (sender_users.id=? AND reciever_users.id=?) OR (sender_users.id=? AND reciever_users.id=?)
        ORDER BY messages.id DESC
        ;
        `;
        const [rows,fields]=await getConnetion().execute(query,[senderId, recieverId, recieverId, senderId]);
        res.json({status:true, messages:rows})
    } catch (error) {
        console.log(error)
        res.json({status:false, messages:"error while getting messages "})
    }
})

router.post("/send",async (req, res, next)=>{
    try {
        const {content, senderId, recieverId}=req.body;
        const query=`
        INSERT INTO messages (sender_id, reciever_id, content) VALUES (?,?,?) ;
        `
        const [rows, fields]=await getConnetion().execute(query,[senderId,recieverId, content])
        if(rows.insertId)return res.json({status:true, message:"new message has been added !"})
    } catch (error) {
        console.log(error)
        res.json({status:false, messages:"error while sending message"})
    }
})


module.exports=router;