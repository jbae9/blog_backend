const express = require("express");
const { exists } = require("../schemas/posts.js");
const router = express.Router();

const Posts = require("../schemas/posts.js");

// 게시글 전체 조회
router.get('/posts', async (req, res) => {
    Posts.find({},
        function(err, result){
            if (err) res.status(400).send(err);
            else res.send(result);
        }).select('postId author title content date')

    // Send status 200 (success) and send the JSON data goods
    // res.json({ results })
})

// 게시글 상세 조회
router.get("/posts/:postId", (req, res) => {
    const { postId } = req.params // When /posts/1 is called, returns '1'

    Posts.find({ postId: postId },
        function (err, post) {
            if (err) return res.status(400).send(err);
            // Return response
            res.status(200).json(post)
        }).select('postId author title content date')
})

// 게시글 작성 -------------------- NEEDS PROPER ERROR HANDLING
router.post("/posts", async (req, res) => {
    // Get data in body
    const { postId, title, author, content, password } = req.body;

    // Finds goods corresponding to goodsId
    // Finish executing this code before moving on with 'await'
    const posts = await Posts.find({ postId });

    // If goods.length is bigger than 0, it is true
    // aka run this if statement if there is a good corresponding to the goodsId
    if (posts.length) {
        return res.status(400).json({ success: false, errorMessage: "이미 있는 feedId입니다." });
    }

    // Create a good if there is no good corresponding to the goodsId
    Posts.create({ postId, title, author, content, password },
        function(err, post){
            if (err) return res.status(400).send(err);
            res.status(200).json(post)
        });

    // res.json({ posts: createdPosts });
});

// 게시글 수정
router.put("/posts/:postId", async (req, res) => {
    const { postId } = req.params
    const editPost = req.body.content

    const existsPosts = await Posts.find({ postId: Number(postId) });

    if (existsPosts.length) {
        Posts.updateOne({ postId: Number(postId) }, {$set: {content:editPost}},
        function(err, post){
            if(err) res.status(400).send(err);
            else res.send(post);
        });
        // 
    } else {
        res.json({ success: false, errorMessage: "feedId가 존재하지 않습니다."});
    }
})

// 게시글 삭제
router.delete("/posts/:postId", async (req, res) => {
    const { postId } = req.params
    const password = req.body.password

    const existsPosts = await Posts.find({ postId: Number(postId), password: password });
    if (existsPosts.length) {
        Posts.deleteOne({ postId: Number(postId), password: password }, 
        function(err,post){
            if(err) res.status(400).send(err);
            else res.send(post);
        })
    } else {
        res.json({ success: false, errorMessage: "feedId 존재하지 않거나 패스워드가 틀렸습니다."});
    }
})

// Exports router to app.js
module.exports = router;