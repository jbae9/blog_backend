const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth-middleware.js")
const db = require("../models")
const Comments = db.Comments
const Users = db.Users

// 해당되는 게시물의 댓글 불러오기
router.get('/posts/:postId/comments', (req,res) => {
    const {postId} = req.params

    Comments.findAll({ 
        where: {postId},
        attributes: ['commentId', 'postId', 'content'],
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

// 해당되는 게시물에 댓글 작성
router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
    const {postId} = req.params
    // Get data in body
    const { content, password } = req.body;

    const {user} = res.locals
    const userId = user.dataValues.userId

    // Create comment
    try {
        const comment = await Comments.create({ userId, postId, content, password })
        res.status(201).json(comment)
    } catch (error) {
        res.status(400).send(error)
    }
});

// 댓글 수정
router.put("/posts/comments/:commentId", async (req, res) => {
    const { commentId } = req.params
    const editPost = req.body.content
    const password = req.body.password

    const existsComments = await Comments.findAll({ where: {commentId: Number(commentId), password: password }});

    if (existsComments.length != 0) {
        Comments.update({content: editPost},
            {
                where: {commentId: Number(commentId)},
                attributes: ['postId','commentId', 'content'],
                include: [{
                    model: Users,
                    attributes: ['nickname']
                }]
            })
        .then(post => res.status(200).send(post))
        .catch(error => res.status(400).send(error))
        
    } else {
        res.status(400).json({ success: false, errorMessage: "commentId가 존재하지 않거나 패스워드가 틀렸습니다."});
    }
})

// 댓글 삭제
router.delete("/posts/comments/:commentId", async (req, res) => {
    const { commentId } = req.params
    const {password} = req.body

    const existsPosts = await Comments.findAll({ where: {commentId: Number(commentId), password: password} });
    
    if (existsPosts.length != 0) {
        await Comments.destroy({where: {commentId: Number(commentId), password: password}})
        res.status(200).send({success: true})
    } else {
        res.json({ success: false, errorMessage: "commentId가 존재하지 않거나 패스워드가 틀렸습니다."});
    }
})

// Exports router to app.js
module.exports = router;