function emailValidate(email){
    if(!email.includes('@')){ 
        return false
    }
   return true
}

function passwordValidate(password){
    if(password.length<8){
        return false
    }else{
        return true
    }
}
module.exports = {emailValidate,passwordValidate}