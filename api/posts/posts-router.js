const router = require("express").Router();
const Posts = require("./posts-model");

// GET /api/posts
router.get("/", (req, res) => {
  console.log("GET /api/posts");
  Posts.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Gönderiler alınamadı",
      });
    });
});

// GET /api/posts/:id
router.get("/:id", (req, res) => {
  console.log("GET /api/posts/:id");
  Posts.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "Belirtilen ID'li gönderi bulunamadı",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Gönderi bilgisi alınamadı",
      });
    });
});

// POST /api/posts
router.post("/", async (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Lütfen gönderi için bir title ve contens sağlayın" });
  } else {
    try {
      let { id } = await Posts.insert({ title, contents });
      let insertedPost = await Posts.findById(id);
      res.status(201).json(insertedPost);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
    }
  }
});

//PUT /api/posts/:id
router.put("/:id", async (req, res) => {
  try {
    let idPost = await Posts.findById(req.params.id);
    if (!idPost) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      let { title, contents } = req.body;
      if (!title || !contents) {
        res
          .status(400)
          .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
      } else {
        let updatePostid = await Posts.update(req.params.id, req.body);
        let updatedPost = await Posts.findById(updatePostid);
        res.status(200).json(updatedPost);
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
  }
});

//DELETE /api/posts/:id
router.delete("/:id", async (req, res) => {
  try {
    let deletePost = await Posts.findById(req.params.id);
    if (!deletePost) {
      res.status(404).json({ message: "Belirtilen ID li gönderi bulunamadı" });
    } else {
      await Posts.remove(req.params.id);
      res.status(200).json(deletePost);
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

//GET /api/posts/:id/comments
router.get("/:id/comments", async (req, res) => {
  try {
    let commentsPost = await Posts.findById(req.params.id);
    if (!commentsPost) {
      res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
    } else {
      let comments = await Posts.findPostComments(req.params.id);
      res.status(200).json(comments);
    }
  } catch (error) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});

module.exports = router;
