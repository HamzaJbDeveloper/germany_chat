const translate = require('translate-google')

const route = require("express").Router()


// translation service
route.post("/translation", async (req, res, next)=>{
    const { text } = req.body;
    console.log(text)

    try {
      const translatedText = await translate(text, { to: 'ar' });
      res.json({ result:translatedText,status:true });
    } catch (error) {
      res.status(200).json({ status: false });
    }
    
})



module.exports=route;
