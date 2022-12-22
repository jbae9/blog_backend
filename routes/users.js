const express = require("express")
const router = express.Router();
const jwt = require("jsonwebtoken")

const db = require("../models")
const Users = db.Users

const authMiddleware = require("../middlewares/auth-middleware.js")
const authSignup = require("../middlewares/validate-signUp")

// 회원가입
router.post("/signup", authSignup, async (req, res) => {
    const { nickname, password, confirmPassword } = req.body

    // 1. 패스워드와 패스워드 검증 값이 일치하는가
    if (password !== confirmPassword) {
        res.status(400).send({ errorMessage: "패스워드가 일치하지 않습니다" })
        // res.status continues code and must be returned to stop the code
        return
    }

    // 패스워드에 닉네임과 같은 값이 있는가
    if(password.includes(nickname)){
        res.status(400).send({errorMessage: '패스워드 안에 닉네임이 포함할 수 없습니다.'})
        return
    }

    // nickname에 해당하는 사용자가 있는가
    const existUser = await Users.findAll({where: {nickname: nickname}})
    if (existUser.length) {
        res.status(400).send({ errorMessage: '이미 가입된 닉네임이 있습니다' })
        return;
    }

    // DB에 데이터 삽입
    try {
        const user = await Users.create({ nickname:nickname, password:password })

        // Status 201 refers to created
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
    
})

// 로그인
// POST로 구현하는 이유:
// 1. GET은 데이터를 URL에 표현해야해서 보안에 취약함
// 2. 인증 정보를 생성해서
router.post("/login", async (req, res) => {
    const { nickname, password } = req.body

    const user = await Users.findOne({ where: {nickname, password} })

    if (user === null) {
        res.status(400).send({ errorMessage: '닉네임 또는 패스워드가 틀렸습니다' })
        return
    }

    // Create a token
    const accessToken = jwt.sign({userId: user.dataValues.userId}, "secretKey",{expiresIn: '1d'})

    // Send Access Token in cookie
    res.cookie('accessToken', accessToken)
    res.status(200).send({success: true})
})

// Call auth-middleware.js
router.get("/users/me", authMiddleware, async(req,res) => {
    const {user} = res.locals
    
    res.status(200).send({user})
})

module.exports = router;
