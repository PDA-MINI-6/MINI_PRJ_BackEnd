const express = require("express");
const Place = require("../models/Place");
const Comment = require("../models/Comment");

const router = express.Router();

router.get("/", (req, res, next) => {
  Place.find().then((result) => {
    res.send(result);
  });
});

router.get("/:Id", (req, res, next) => {
  Place.findOne({ id: req.params.Id })
    .populate("Comments")
    .then((result) => {
      console.log(result);
      res.send(result);
    });
});

router.patch("/:Id/like", (req, res, next) => {
  Place.findOneAndUpdate(
    { id: req.params.Id },
    { $inc: { liked: 1 } },
    { new: true } // 이 옵션은 업데이트 후의 문서를 반환하도록 합니다.
  )
    .then((updatedPlace) => {
      if (!updatedPlace) {
        return res.status(404).send({ message: "Place not found" });
      }
      res.send({ liked: updatedPlace.liked });
    })
    .catch();
});

router.patch("/:Id/unLike", (req, res, next) => {
  Place.findOneAndUpdate(
    { id: req.params.Id },
    { $inc: { liked: -1 } },
    { new: true } // 이 옵션은 업데이트 후의 문서를 반환하도록 합니다.
  )
    .then((updatedPlace) => {
      if (!updatedPlace) {
        return res.status(404).send({ message: "Place not found" });
      }
      res.send({ liked: updatedPlace.liked });
    })
    .catch();
});

router.post("/:Id/comment", (req, res, next) => {
  const { Id } = req.params;
  const { author, content, password } = req.body;

  const newComment = new Comment({
    author,
    content,
    password,
    PopupStore: Id,
  });

  newComment
    .save()
    .then(() => {
      return Comment.find({ PopupStore: Id });
    })
    .then((comments) => {
      res.status(201).send(comments);
    })
    .catch(next);
});

router.delete("/:Id/comment/:commentId", (req, res, next) => {
  const { Id, commentId } = req.params;
  const { password } = req.body; // 클라이언트로부터 비밀번호를 받음

  Comment.findOne({ _id: commentId, PopupStore: Id })
    .then((comment) => {
      if (!comment) {
        return res.status(404).send({
          message: "Comment not found or does not belong to this Place",
        });
      }

      // 비밀번호 확인
      if (comment.password !== password) {
        return res.status(403).send({ message: "Incorrect password" });
      }

      // 비밀번호가 맞으면 댓글 삭제
      return Comment.findOneAndDelete({ _id: commentId, PopupStore: Id });
    })
    .then((deletedComment) => {
      if (!deletedComment) {
        return res
          .status(404)
          .send({ message: "Comment not found or already deleted" });
      }

      // 댓글 삭제 후 댓글 목록 반환
      return Comment.find({ PopupStore: Id }).sort({ createdAt: -1 }); // 최신 댓글이 위로 오도록 정렬
    })
    .then((comments) => {
      res.send({ message: "Comment deleted successfully", comments });
    })
    .catch(next);
});

module.exports = router;
