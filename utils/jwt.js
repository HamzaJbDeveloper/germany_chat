const jsonWebToken=require("jsonwebtoken");
const secretCode="aaazzeerrrtttyy"


const signJWT= function(payload){
    const token=jsonWebToken.sign(payload,secretCode)
    return token
}

const verifyJWT= function(token){
    const isVerified=jsonWebToken.verify(token,secretCode)
    return isVerified;
}


module.exports={
    signJWT:signJWT,
    verifyJWT:verifyJWT
}