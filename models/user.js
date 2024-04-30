import mongoose from "mongoose";

(async ()=>{
    try {
       await mongoose.connect(`mongodb+srv://Riddle:<password>@cluster0.qr5vrpz.mongodb.net/userLoginAuth`).then(
        console.log(`mongoose has been successsfully connected to the database`)
       )
    } catch (error) {
        throw error
    }
})()

const userSchema=mongoose.Schema({
    username:String,
    email:String,
    password:String,
    age:Number
})

export default mongoose.model('user',userSchema)