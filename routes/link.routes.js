const {Router} = require('express');
const config = require('config')
const Link = require('../models/Link')
const auth = require('../middleware/auth.middleware')
const shortid = require('shortid')
const router = Router()

router.post('/generate', auth, async (req, res)=>{
    try{
        const baseUrl = config.get('baseUrl')
        const {from} = req.body
        const code = shortid.generate() //уникальный код
        const existing = await Link.findOne( {from} ) //ищем в базе
        if (existing) {
            return res.json({ link: existing }) //елси есть в базе, то отправляем на клиент
        }
        const to = baseUrl + '/t/' + code

        const link = new Link({
            code, to, from, owner: req.user.userId
        })
        await link.save()

        res.status(201).json({link})

    } catch (e){
        res.status(500).json({message: 'Что-то пошло не так авторизации'});
    }
})
router.get('/', auth, async (req, res)=>{
    try{
        const links = await Link.find({ owner: req.user.userId }) 
        res.json(links)
    } catch (e){
        res.status(500).json({message: 'Что-то пошло не так на авторизации'});
    }
})
router.get('/:id', auth, async (req, res)=>{
    try{
        const link = await Link.findById(req.params.id)
        res.json(link)

    } catch (e){
        res.status(500).json({message: 'Что-то пошло не так авторизации'});
    }
})


module.exports = router