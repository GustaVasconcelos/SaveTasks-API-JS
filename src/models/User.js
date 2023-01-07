import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    usuario:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        unique: true
    },
    senha:{
        type:String,
        require:true
    },
    tasks:{
        type:Array
    }
    
},{
    timestamps:true
})

userSchema.pre("save", async function (next){
    if(!this.isModified("senha")){
        return next()
    }

    this.senha = await bcrypt.hash(this.senha, 10)
    next()
})

userSchema.methods.isCorrectPassword = function (password, callback ){
    bcrypt.compare(password,this.senha,function(err,same){
        if(err){
            callback(err);
        }else{
            callback(err, same);
        }
    })
}

const usuarios = mongoose.model("Usuarios", userSchema)

export default usuarios