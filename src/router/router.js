const express = require('express')
const { route } = require('express/lib/application')
const res = require('express/lib/response')
const router = express.Router()
const userController = require('../controller/userContoller')
const auth = require('../middleware/middleware')
const productController = require('../controller/productController')


// user Api
router.post('/register' ,userController.registration)

router.post('/login' , userController.loginUser)

router.get('/user/:userId/profile' ,auth.authentication ,userController.getUser )

router.put('/user/:userId/profile',auth.authentication,userController.updateUser)

// product Api
router.post('/products' , productController.createProduct)

router.get('/products' , productController.getByFilter)

router.get('/products/:productId', productController.getproduct)

router.put('/products/:productId' , productController.productUpdate)

router.delete('/products/:productId' , productController.deleteProduct)



module.exports = router