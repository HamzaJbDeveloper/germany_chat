const bcrypt=require("bcrypt")

const hashPassword =async function(password){
    try{
        const hashedPassword=await bcrypt.hash(password, 10)
        return hashedPassword
    }catch(err){
        console.log("error while hashing password")
    }
}

const comparePassword = async function (password,hashedPassword){

    try{
        const isValid=await bcrypt.compare(password, hashedPassword)
        return isValid
    }catch(err){
        console.log("error while comparing passwords")
    }
}

module.exports={
    hashPassword:hashPassword,
    comparePassword:comparePassword
}