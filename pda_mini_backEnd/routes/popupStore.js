const express = require("express");
const PopupStore = require("../models/PopUpStore");
const Comment = require("../models/Comment");

const router = express.Router();

router.get("/", (req, res, next) => {
  PopupStore.find().then((result) => {
    res.send(result);
  });
});

router.get("/:Id", (req, res, next) => {
  PopupStore.findOne({ id: req.params.Id })
    .populate("Comments")
    .then((result) => {
      console.log(result);
      res.send(result);
    });
});

router.patch("/:Id/like", (req, res, next) => {
  PopupStore.findOneAndUpdate(
    { id: req.params.Id },
    { $inc: { liked: 1 } },
    { new: true } // 이 옵션은 업데이트 후의 문서를 반환하도록 합니다.
  )
    .then((updatedPopupStore) => {
      if (!updatedPopupStore) {
        return res.status(404).send({ message: "PopupStore not found" });
      }
      res.send({ liked: updatedPopupStore.liked });
    })
    .catch();
});

router.patch("/:Id/unLike", (req, res, next) => {
  PopupStore.findOneAndUpdate(
    { id: req.params.Id },
    { $inc: { liked: -1 } },
    { new: true } // 이 옵션은 업데이트 후의 문서를 반환하도록 합니다.
  )
    .then((updatedPopupStore) => {
      if (!updatedPopupStore) {
        return res.status(404).send({ message: "PopupStore not found" });
      }
      res.send({ liked: updatedPopupStore.liked });
    })
    .catch();
});

router.post("/:Id/comment", (req, res, next) => {
  const { Id } = req.params;
  const { author, content } = req.body;

  const newComment = new Comment({
    author,
    content,
    PopupStore: Id,
  });

  newComment.save()
    .then((comment) => {
      return Comment.find({ PopupStore: Id });
    })
    .then((comments) => {
      res.status(201).send(comments);
    })
    .catch(next);
});

router.delete("/:Id/comment/:commentId", (req, res, next) => {
  const { Id, commentId } = req.params;

  Comment.findOneAndDelete({ _id: commentId, PopupStore: Id })
    .then((deletedComment) => {
      if (!deletedComment) {
        return res.status(404).send({ message: "Comment not found or does not belong to this PopupStore" });
      }

      return Comment.find({ PopupStore: Id });
    })
    .then((comments) => {
      res.send({ message: "Comment deleted successfully", comments });
    })
    .catch(next);
});

module.exports = router;
