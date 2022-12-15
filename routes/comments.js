const express = require("express");
const router = express.Router();

const Comments = require("../schemas/comments.js");

// 해당되는 게시물의 댓글 불러오기
router.get('/comments/:postId', (req,res) => {
    const {postId} = req.params

    Comments.find({ postId: postId },
        function (err, post) {
            if (err) return res.status(400).send(err);
            // Return response
            res.status(200).json(post)
        }).select('commentId author title content date').sort({date: 'desc'})
})

// 해당되는 게시물에 댓글 작성
router.post("/comments/:postId", async (req, res) => {
    const {postId} = req.params
    // Get data in body
    const { commentId, author, content, password } = req.body;

    // Finds goods corresponding to goodsId
    // Finish executing this code before moving on with 'await'
    const comments = await Comments.find({ commentId });

    // If goods.length is bigger than 0, it is true
    // aka run this if statement if there is a good corresponding to the goodsId
    if (comments.length) {
        return res.status(400).json({ success: false, errorMessage: "이미 있는 commentId입니다." });
    }

    // Create a good if there is no good corresponding to the goodsId
    Comments.create({ postId, commentId, author, content, password },
        function(err, post){
            if (err) return res.status(400).send(err.message);
            else res.status(201).json(post)
        });
});

// 댓글 수정
router.put("/comments/:commentId", async (req, res) => {
    const { commentId } = req.params
    const editPost = req.body.content
    const password = req.body.password

    const existsComments = await Comments.find({ commentId: Number(commentId), password: password });

    if (existsComments.length) {
        Comments.updateOne({ commentId: Number(commentId) }, {$set: {content:editPost}},
        function(err, post){
            if(err) res.status(400).send(err.message);
            else res.send(post);
        });
    } else {
        res.json({ success: false, errorMessage: "commentId가 존재하지 않거나 패스워드가 틀렸습니다."});
    }
})

// 댓글 삭제
router.delete("/comments/:commentId", async (req, res) => {
    const { commentId } = req.params
    const password = req.body.password

    const existsPosts = await Comments.find({ commentId: Number(commentId), password: password });
    if (existsPosts.length) {
        Comments.deleteOne({ commentId: Number(commentId), password: password }, 
        function(err,post){
            if(err) res.status(400).send(err.message);
            else res.send(post);
        })
    } else {
        res.json({ success: false, errorMessage: "commentId가 존재하지 않거나 패스워드가 틀렸습니다."});
    }
})

// Exports router to app.js
module.exports = router;