const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose").default;
const schema3=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    history:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"History",
    }]
});
schema3.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",schema3);