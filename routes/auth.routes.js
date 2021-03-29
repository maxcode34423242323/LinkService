const {Router} = require('express');
const User = require('../models/user');
const config = require('config');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs'); //для хеширования пароля
const router = Router();
const jwt = require('jsonwebtoken');

// /api/auth/register
router.post(
    '/register', 
    [
        check('email', 'Некорректный емейл').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов')
        .isLength({min: 6})
    ],
    async (req, res)=> { //получаем пост с фронта
    try{
        
        const errors = validationResult(req);//validate form
        if (!errors.isEmpty()){ //если есть ошибки
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            });
        }
        const {email, password} = req.body;
        const candidate = await User.findOne({email});
        if (candidate){
           return res.status(400).json({message: 'Такой пользователь уже существует'});
        }
        //хэшируем пароль
        const hashedPassword = await bcrypt.hash(password, 12);
        //новый юзер
        const user = new User({email, password: hashedPassword});
        // сохраняем ногого юзера
        await user.save();
        //отдаем ответ на клиент
        res.status(201).json({message: 'Пользователь создан'});

    } catch (e){
        res.status(500).json({message: 'Что-то пошло не так reguster'});
    }
});
// /api/auth/login
router.post('/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
    try{
        const errors = validationResult(req);//validate form
        if (!errors.isEmpty()){ //если есть ошибки
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при входе в систему'
            });
        }
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({message: 'Пользователь не найден'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch){
            return res.status(400).json({message: 'Неверный пароль попробуйте снова'});
        }
        const token = jwt.sign( //создали токен для авторизации
            {userId: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        );
        res.json({token, userId: user.id});
        


    } catch (e){
        res.status(500).json({message: 'Что-то пошло не так авторизации'});
    }
});




module.exports = router;