const express = require("express");
const jwt = require("jsonwebtoken")

const { exists } = require("../models/posts.js");
const router = express.Router();

const authMiddleware = require("../middlewares/auth-middleware.js")
const db = require("../models")
const Posts = db.Posts
const Users = db.Users

// 게시글 전체 조회
router.get('/posts', async (req, res) => {
    Posts.findAll({
        attributes: ['postId', 'content'],
        include: [{
            model: Users,
            attributes: ['nickname']
        }]
    })
    .then( post =>
        res.status(200).send(post)
    )
    .catch(
        error => {
            res.status(400).send(error)
    })
})

// 게시글 상세 조회
router.get("/posts/:postId", (req, res) => {
    const { postId } = req.params // When /posts/1 is called, returns '1'

    Posts.findAll({
        where: {postId},
        attributes: ['postId', 'content'],
        include: [{
            model: Users,
            attributes: ['nickname']
        }]
    })
    .then( post =>
        res.status(200).send(post)
    )
    .catch(
        error => {
            res.status(400).send(error)
    })
})

// 게시글 작성 -------------------- NEEDS PROPER ERROR HANDLING
router.post("/posts", authMiddleware, async (req, res) => {
    // Get data in body
    const { content, password } = req.body;

    const {user} = res.locals
    const userId = user.dataValues.userId

    // Create post
    try {
        const post = await Posts.create({ userId, content, password })
        res.status(201).json(post)
    } catch (error) {
        res.status(400).send(error)
    }
});

// 게시글 수정
router.put("/posts/:postId", async (req, res) => {
    const { postId } = req.params
    const editPost = req.body.content
    const password = req.body.password

    const existsPosts = await Posts.findAll({ where: {postId: Number(postId), password: password }});

    console.log(existsPosts)
    
    if (existsPosts.length != 0) {
        // ------------- Return 값 이상함 -----------------
        Posts.update({content: editPost},
            {
                where: {postId: Number(postId)},
                attributes: ['postId', 'content'],
                include: [{
                    model: Users,
                    attributes: ['nickname']
                }]
            })
        .then(post => res.status(200).send({success: true}))
        .catch(error => res.status(400).send(error))
    } else {
        res.status(400).json({ success: false, errorMessage: "postId가 존재하지 않거나 패스워드가 틀렸습니다."});
    }
})

// 게시글 삭제
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params
    const password = req.body.password
   
    const existsPost = await Posts.findAll({ where: {postId: Number(postId), password: password}});

    if (existsPost.length != 0) {
        await Posts.destroy({where: {postId: Number(postId), password: password}})
        res.status(200).send({success: true})
    } else {
        res.json({ success: false, errorMessage: "postId 존재하지 않거나 패스워드가 틀렸습니다."});
    }
})

// Exports router to app.js
module.exports = router;