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

const PlaceSchema = new mongoose.Schema({
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
    type: String,
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

PlaceSchema.virtual("Comments", {
  ref: "Comment",
  localField: "id",
  foreignField: "PopupStore",
});
PlaceSchema.set("toObject", { virtuals: true });
PlaceSchema.set("toJSON", { virtuals: true });
const Place = mongoose.model("Place", PlaceSchema);
module.exports = Place;
