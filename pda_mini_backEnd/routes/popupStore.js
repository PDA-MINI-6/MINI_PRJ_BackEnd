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
  PopupStore.updateOne({ id: req.params.Id }, { $inc: { liked: 1 } }).then(
    (result) => {
      res.send(result);
    }
  );
});

router.patch("/:Id/unlike", (req, res, next) => {
  PopupStore.updateOne({ id: req.params.Id }, { $inc: { liked: -1 } }).then(
    (result) => {
      res.send(result);
    }
  );
});

module.exports = router;
