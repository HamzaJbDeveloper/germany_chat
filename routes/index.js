// auth router
const authRouter=require("./auth.router")

// messages router
const messagesRouter=require("./messages.router")

//users router
const usersRouter=require("./users.router")

// random chat router
const randomChatRouter=require("./RandomChat")

// topics router
const topicsRouter=require("./topics.router")

// translation router
const translationRouter=require("./translation.route")

const router=require("express").Router()


router.use("/auth",authRouter)
router.use("/messages",messagesRouter)
router.use("/users",usersRouter)
router.use("/random_chat",randomChatRouter)
router.use("/topics",topicsRouter)
router.use("/translation",translationRouter)

module.exports=router;