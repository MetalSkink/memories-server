import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async(req, res) => {
  const {page} = req.query;

  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT;  // get the startin gindex of evey page
    const total = await PostMessage.countDocuments(); // get the total number of posts
    const postsMessages = await PostMessage.find().sort({_id: -1}).limit(LIMIT).skip(startIndex);
    res.status(200).json({
      data: postsMessages,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({
        message: error.message
    });
  }
}
export const getPost = async(req, res) => {
  const {id} = req.params;

  try {
    const post = await PostMessage.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({
        message: error.message
    });
  }
}

export const getPostsBySearch = async(req, res) => {
  const {searchQuery, tags} = req.query;

  try {
    const title = new RegExp(searchQuery, 'i');
    const posts = await PostMessage.find({
      $or: [{title}, {tags: {$in: tags.split(',')}}]
    });
    res.status(200).json({data: posts});
  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }
}

export const createPost = async(req, res) => {
  const post = req.body;

  const newPost = new PostMessage({...post, creator: req.userId});

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

  if (!req.userId) {
    return res.status(404).json({
      message: 'Unauthenticated'
    });
  }
  
  try {
    const post = await PostMessage.findById(id);
    
    const index = post.likeCount.findIndex(id => id === String(req.userId));

    if (index === -1) {
      post.likeCount.push(req.userId);
    } else {
      post.likeCount.splice(index, 1);
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true});
  
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }

}