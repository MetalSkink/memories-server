import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    title: String,
    message: String,
    creatorName: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likeCount: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    versionKey: false,
  }
);

const PostMessage = mongoose.model("PostMessage", postSchema);

export default PostMessage;
