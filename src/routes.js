import express from 'express'
import usuariosControllers from './controllers/usuarios.controllers.js'

const router = express.Router()

router.get('/', usuariosControllers.getUsers)
router.get('/api/usuario', usuariosControllers.getUserById)
router.post('/api/login', usuariosControllers.login)
router.get('/api/checktoken', usuariosControllers.checktoken)
router.get('/api/destroytoken', usuariosControllers.destroytoken)
router.post('/api/cadastro', usuariosControllers.create)
router.patch('/api/addtarefa', usuariosControllers.addTask)
router.patch('/api/deltarefa', usuariosControllers.removeTask)
export default router