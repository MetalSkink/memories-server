import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async(req, res) => {
    try {
        const postsMessages = await PostMessage.find();
        res.status(200).json(postsMessages);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}

export const createPost = async(req, res) => {
  const post = req.body;

  const newPost = new PostMessage(post);

  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({
      message: error.message
    });
  }

}

export const updatePost = async(req, res) => {
  const {id: _id} = req.params;
  const post = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).send("Invalid ID");

  try {
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }
}

export const deletePost =  async(req, res) => {
  const {id} = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid ID");

  try {
    await PostMessage.findByIdAndDelete(id);
    res.status(200).json({
      message: "Post deleted"
    });
  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }
}

export const likePost = async(req, res) => {
  const {id} = req.params;
  
  try {
    const post = await PostMessage.findById(id);
    const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, {new: true});
  
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }

}