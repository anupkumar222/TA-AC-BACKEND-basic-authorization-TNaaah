module.exports = {
    isSameUser: function(req, userId){
        if(req.session.userId == userId){
            return true;
        }else{
            return false;
        }
    } 
}