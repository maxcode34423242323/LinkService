const {Router} = require('express');
const Link = require('../models/Link')
const router = Router()

router.get('/:code', async (req,res) => {
    try{
        console.log(req)
        const link = await Link.findOne({ code: req.params.code}) //с помощью params получаем code
        if (link){
            link.clicks++;
            await link.save()
            return res.redirect(link.from)
        }
        res.status(404).json({message: 'ССылка не найдена'})
    
    } catch (e){
        res.status(500).json({message: 'Что-то пошло не так на авторизации'});
    }
})



module.exports = router