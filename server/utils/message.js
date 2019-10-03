const moment =require('moment');

const genarateMessage=(from,text)=>{
    return {
        from,
        text,
        createAt:moment().valueOf()
    }
}
const genarateMessageLocation=(from,latitude,longitude)=>{
    return{
        from,
        url:`https://www.google.com/maps?q=${latitude},${longitude}`,
        createAt:new Date().getTime()
    }
}
module.exports={
    genarateMessage,genarateMessageLocation
}