const User = require("../model/User");
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const userController = {};

userController.createUser = async(req, res) => {
    try {
        const {email, name, password} = req.body;

        const user = await User.findOne({email});

        if(user){
            throw new Error('이미 가입이 된 회원입니다! 💦');
        } else{
            if(!email){
                throw new Error('이메일을 입력해주세요! 💦');
            }   
            if(!name){
                throw new Error('이름을 입력해주세요! 💦');
            }         
            if(!password){
                throw new Error('비밀번호를 입력해주세요! 💦')
            }

            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, salt);

            const newUser = new User({email, name, password: hash});
            await newUser.save();
            res.status(200).json({status: 'success'});
        }
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

userController.loginWithEmail = async(req, res) => {
    try {
        const {email, password} = req.body;

        if(!email){
            throw new Error('이메일을 입력해주세요! 💦');
        }
        if(!password){
            throw new Error('비밀번호를 입력해주세요! 💦')
        }

        const user = await User.findOne({email}, '-createdAt -updatedAt -__v');

        if(user){
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch){
                const token = user.generateToken();
                return res.status(200).json({status: 'success', user, token});
            }
        }

        throw new Error('이메일 또는 비밀번호가 일치하지 않습니다! 💦');
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

userController.getUser = async(req, res) => {
    try {
        const user = await User.findById(req.userId, '-createdAt -updatedAt -__v');
        if(user){
            res.status(200).json({status: 'success', user});
        } else{
            throw new Error('can not find user');
        }
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

module.exports = userController;