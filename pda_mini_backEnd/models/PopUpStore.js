const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const PopupStoreSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  subtitle: {
    type: String,
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  location: {
    type: LocationSchema,
    required: true,
  },

  images: {
    type: [String],
  },

  tags: {
    type: [String],
  },

  liked: {
    type: Number,
    default: 0,
  },
});

PopupStoreSchema.virtual("Comments", {
  ref: "Comment",
  localField: "id",
  foreignField: "PopupStore",
});
PopupStoreSchema.set("toObject", { virtuals: true });
PopupStoreSchema.set("toJSON", { virtuals: true });
const PopupStore = mongoose.model("PopupStore", PopupStoreSchema);
module.exports = PopupStore;
