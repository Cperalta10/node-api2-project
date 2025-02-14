// implement your posts router here
const express = require("express");
const postModel = require("./posts-model");
const router = express.Router();

// 1 GET /api/posts |Returns **an array of all the post objects** contained in the database
router.get("/", (req, res) => {
  postModel
    .find()
    .then((posts) => {
      if (posts == null) {
        res.status(404).json({ message: "does not exist" });
      } else {
        res.json(posts);
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "The post information could not be retrieved",
      });
    });
});

// 2 GET /api/posts/:id |Returns **the post object with the specified id**
router.get("/:id", (req, res) => {
  postModel
    .findById(req.params.id)
    .then((post) => {
      if (post == null) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        res.json(post);
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "The post information could not be retrieved",
      });
    });
});

// 3 POST /api/posts |Creates a post using the information sent inside the request body and returns **the newly created post object**
router.post("/", (req, res) => {
  if (req.body.title == null || req.body.contents == null) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
    return;
  }
  postModel
    .insert(req.body)
    .then(({ id }) => {
      return postModel.findById(id);
    })
    .then((post) => {
      console.log(post);
      res.status(201).json(post);
    })
    .catch((err) => {
      res.status(500).json({
        message: "There was an error while saving the post to the database",
      });
    });
});

// 4 PUT /api/posts/:id |Updates the post with the specified id using data from the request body and **returns the modified document**, not the original
router.put("/:id", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    postModel
      .update(req.params.id, req.body)
      .then((result) => {
        if (!result) {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist" });
          return;
        }
        return postModel.findById(req.params.id);
      })
      .then((post) => {
        res.json(post);
      })
      .catch((err) => {
        res.status(500).json({
          message: "The post information could not be modified",
        });
      });
  }
});

// 5 DELETE /api/posts/:id |Removes the post with the specified id and returns the **deleted post object**
router.delete("/:id", (req, res) => {
  postModel.findById(req.params.id).then((post) => {
    console.log(post);
    if (!post) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      res.json(post);
      return postModel.remove(post.id);
    }
  });
});

// 6 GET /api/posts/:id/comments |Returns an **array of all the comment objects** associated with the post with the specified id
router.get("/:id/comments", (req, res) => {
  postModel.findById(req.params.id).then((post) => {
    console.log(post);
    if (!post) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      postModel.findPostComments(post.id).then((comments) => {
        res.json(comments);
      });
    }
  });
});

module.exports = router;
