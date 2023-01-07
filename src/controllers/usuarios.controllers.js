import Usuario from "../models/User.js"
import jwt from 'jsonwebtoken'
export default{
    index(req,res){
        res.json({message:"Deploy feito com sucesso"})
    },
    async create(req,res){
        const {usuario,email,senha,senhaConfirm} = req.body
        if(senha.length < 5){
            return res.status(200).json({message:"A senha deve ter no minimo 5 caracteres"})
        }
        if(senha !== senhaConfirm){
            return res.status(200).json({message:"As senhas são diferentes"})
        }

        let data = {}

        let user = await Usuario.findOne({email})

        if(!user){
            data = {usuario,email,senha}

            user = await Usuario.create(data)

            return res.status(201).json(user)
        }else{
            return res.status(200).json({message:"E-mail já está sendo utilizado"})
        }
    },
    async getUsers(req,res){

        const users = await Usuario.find()

        if(users.length === 0){
            return res.status(200).json({message:"Nenhum usuário encontrado"})
        }

        res.status(200).json(users)
    },
    async addTask(req,res){
        
        const{_id,tarefa} = req.body

        const idtarefa = Math.floor(Date.now() * Math.random()).toString()

        const user = await Usuario.findByIdAndUpdate({_id},{$push:{tasks:{id:idtarefa,tarefa:tarefa}}},{new:true})

        if(!user){
            return res.status(400).json({message:"Erro ao adicionar tarefa"})
        }

        res.status(200).json({message:"Tarefa adicionada com sucesso!"})
    },
    async removeTask(req,res){
        const {_id,id} = req.body

        const user = await Usuario.findByIdAndUpdate({_id:_id},{$pull:{tasks:{id:id}}},{new:true})

        if(!user){
            return res.status(400).json({message:"Erro ao deletar tarefa"})
        }

        res.status(200).json({message:"Tarefa deletada com sucesso!!"})
    },
    async login(req,res){
        const {email,senha} = req.body
        Usuario.findOne({email},(err,user) =>{
            if(err){
                console.log(err)
                res.status(200).json({message:"Erro no servidor"})
            }else if(!user){
                res.status(200).json({status:2,message:"E-mail ou senha incorreta"})
            }else{
                user.isCorrectPassword(senha, async function (err,same){
                    if(err){
                        res.status(200).json({message:'Erro no servidor'})
                    }else if(!same){
                        res.status(200).json({status:2,message:"E-mail ou senha incorreta"})
                    }else{
                        const payload = {email}
                        const token = jwt.sign(payload,process.env.SECRET_JWT,{expiresIn:86400})
        
                        res.cookie("token",token,{httpOnly:true})
                        res.status(200).json({status:1,auth:true,token:token,id_client:user._id,username:user.usuario})
                    }
                })

            }
        })
    }, async checktoken(req,res){

        const token = req.body.token || req.query.token || req.cookies.token || req.headers['x-access-token'];
        
        req.token = token

        if(!token){
            res.json({status:401, message:"token inválido"})
        }else{
            jwt.verify(token,process.env.SECRET_JWT, (err,decoded) =>{
                if(err){
                    res.json({status:401, message:"token inválido"})
                }else{
                    req.email = decoded.email

                    res.json({status:200})
                }
            })
        }
    }, async destroytoken(req,res){
        
        const token = req.headers.token

        if(token){
            res.cookie('token',null,{httpOnly:true})
        }else{
            res.status(401).json({message:"Logout não autorizado"})
        }

        res.send("Sessão finalizada com sucesso")
    },
    async getUserById(req,res){
        const id = req.headers.id

        const user = await Usuario.findById({_id:id})

        if(!user){
            return res.status(400).json({message:"Usuário não existe"})
        }

        res.status(200).json(user)
    },
}