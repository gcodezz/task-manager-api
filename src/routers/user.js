const express = require('express')
const User = require('../models/user')
const { sendWelcomeEmail } = require('../emails/account')
const { sendDeleteEmail } = require('../emails/account')
//const { forgetPassword } = require('../emails/account')
const key = require('generate-key')
//const { newsletter } = require('../emails/account')
const sharp = require('sharp')
const auth = require('../middleware/auth')
//const authPassword = require('../middleware/passwordReset')
//const jwt = require('jsonwebtoken')
const multer = require('multer')
const router = new express.Router()

router.post('/users', async(req, res) => {
    const user = new User(req.body)
    try{
        const token = await user.generateAuthToken()
        await sendWelcomeEmail(user.name, user.email)
        await user.save()
        res.status(201).send({user, token})
    } catch(e){
        res.status(404).send(e)
    }
})

router.get('/users', async (req, res) => {
    try{
        const users = await User.find({})
        users.forEach((user) => {
           //newsletter(user.name, user.email)
        })
        if(!users){
            return res.status(204).send('No users found')
        }

        res.status(200).send(users)
    } catch (e){
        res.status(400).send()
    }
})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send("Couldn't connect")
    }
})


router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !==  req.token
        })
        await req.user.save()

        res.send('You\'ve been logged out successfully')
    }catch(e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send("Successfully logged out of all account!")
    }catch(e){
        res.status(500).send()
    }
})

router.post('/fpassword', async(req, res) => {
    const user = await User.findOne({email: req.body.email})

    try{
        if(!user){
            throw new Error()
        }

        user.resetPasswordToken = key.generateKey(20)
        user.resetPasswordExpires = Date.now() + 3600000
        await user.save()
        res.status(200).send(user)
    }catch(e){
        res.status(401).send('Couldn\'t find account')
    }
})

router.get('/reset/:token', async(req, res) => {

    try{
        const user = await User.findOne({
            resetPasswordToken: req.params.token, 
            resetPasswordExpires: { $gt: Date.now() }
        })
        if (!user){
            throw new Error()
        }
        res.status(200).send(user)
    } catch(e){
        res.status(401).send('Password reset token is invalid or has expired.')
    }
   
})

router.post('/reset/:token', async(req, res) => {
    //console.log(token)
    try{
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        })

        if (!user){
            throw new Error()
        }

        if(req.body.password === req.body.confirm){
            user.password = req.body.confirm
            user.resetPasswordToken = undefined
            user.resetPasswordExpires = undefined

            await user.save()
            res.status(200).send('Password changed sucessfully!')
        }
        else{
            res.status(409).send('password doesn\'t match')
        }
    } catch(e){
        res.status(400).send('User doesn\'t exist or password reset token has expired' )
    }

})

router.get('/users/me', auth, async(req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ["name", "age", "email", "password"]
    const valid = updates.every((update) => allowUpdates.includes(update))
    
    if(!valid){
        return res.status(400).send({error: 'Invalid updates'})
    }

    try{
        const user = req.user
        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save()
        res.send(user)
    }catch (e){
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async(req, res) => {
    
    try{
        const user = await req.user.remove()
        sendDeleteEmail(user.name, user.email)
        res.status(200).send('Data deleted from database!')
    }catch(e){
        return res.status(500).send()
    }
})

const upload = multer({
    //dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)){
            return cb(new Error('Please upload an image!'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //const buffer = await sharp(req.file.buffer).resize(250, 250).png().toBuffer()
    const image = req.file.buffer
    sharp(image).rotate().resize(200, 200).toBuffer().then( data => {
        req.user.avatar = data
        req.user.save()
    }).catch( err => { 
        throw new Error(err)
    });
    //req.user.avatar = buffer
    //await req.user.save()
    res.status(200).send('Picture uploadedd successfully')
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send('Files successfully deleted!')
})

router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e){
        res.status(404).send()
    }
})
module.exports = router