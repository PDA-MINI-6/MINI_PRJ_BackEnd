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

module.exports = router;
