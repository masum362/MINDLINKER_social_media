import Posts from "../model/postSchema.js";
import Users from "../model/userSchema.js";
import Comments from "../model/commentSchema.js";

const createPost = async (req, res, next) => {
  try {
    const { userId } = req.body.user;

    const { description, image } = req.body;

    console.log({description, image})

    if (!description) {
      next("Please provide a description");
      return;
    }
    const post = await Posts.create({
      userId,
      description,
      image,
    });

    res.status(200).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};

const getPosts = async (req, res, next) => {
  console.log("calling")
  try {
    const { userId } = req.body.user;

    const { search } = req.body;

    console.log(search)

    const user = await Users.findById(userId);
    const friends = user?.friends?.toString().split(",") ?? [];
    friends.push(userId);


    const searchPostQuery = {
      $or: [{ description: { $regex: search, $options: "i" } }],
    };

    const posts = await Posts.find(search ? searchPostQuery : {})
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 });

    const friendsPosts = posts?.filter((post) => {
      return friends.includes(post?.userId?._id.toString());
    });

    const othersPost = posts?.filter((post) => {
      return !friends.includes(post?.userId?._id.toString());
    });

    let postsRes = null;

    if (friendsPosts?.length > 0) {
      postsRes = search ? friendsPosts : [...friendsPosts, ...othersPost];
    } else {
      postsRes = posts;
    }

    res.status(200).json({
      success: true,
      message: " successfully",
      data: postsRes,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};

const getSinglePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Posts.findById(id).populate({
      path: "userId",
      select: "firstName lastName locaiton profileUrl  -password",
    });

    res.status(200).json({
      success: true,
      message: " successfully",
      data: post,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};

const getUserPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log({id})

    const post = await Posts.find({ userId: id })
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl  -password",
      })
      .sort({ _id: -1 });

    res.status(200).json({
      success: true,
      message: " successfully",
      data: post,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};

const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const postComments = await Comments.find({ postId })
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl location -password",
      })
      .populate({
        path: "replies.userId",
        select: "firstName lastName location profileUrl -password",
      }).sort('-createdAt')
    res.status(200).json({
      success: true,
      message: " successfully",
      data: postComments,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};

const likePost = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;

    const post = await Posts.findById(id);

    if (post) {
      const index = post.likes.findIndex((pid) => pid === String(userId));

      if (index === -1) {
        post.likes.push(userId);
      } else {
        post.likes = post.likes.filter((pid) => pid !== String(userId));
      }

      const updatePost = await Posts.findByIdAndUpdate(id, post, { new: true });

      res.status(200).json({
        success: true,
        message: "Successfully",
        data: updatePost,
      });
    } else {
      next("something went wrong!");
      return;
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error.message });
  }
};

const likePostComment = async (req, res, next) => {
  const { userId } = req.body.user;
  const { id, rid } = req.params;

  try {
    if (rid === undefined || rid === null || rid === "false") {
      const comment = await Comments.findById(id);

      const index = comment.likes.findIndex((el) => el === String(userId));

      if (index === -1) {
        comment.likes.push(userId);
      } else {
        comment.likes = comment.likes.filter((el) => el !== String(userId));
      }

      const updated = await Comments.findByIdAndUpdate(id, comment, {
        new: true,
      });

      res.status(200).json({
        success: true,
        message: "Successfully",
        data: updated,
      });
    } else {
      const replyComments = await Comments.findOne(
        { _id: id },
        {
          replies: {
            $elemMatch: {
              _id: rid,
            },
          },
        }
      );

      console.log(replyComments.replies[0])

      if (replyComments) {
        const index = replyComments.replies[0].likes.findIndex(
          (i) => i === String(userId)
        );

        if (index === -1) {
          replyComments.replies[0].likes.push(userId);
        } else {
          replyComments.replies[0] = replyComments.replies[0].likes.filter(
            (el) => el !== String(userId)
          );
        }

        const query = { _id: id, "replies._id": rid };

        const updated = {
          $set: {
            "replies.$.likes": replyComments.replies[0].likes,
          },
        };

        const result = await Comments.updateOne(query, updated, {
          new: true,
        });

        res.status(200).json({
          success: true,
          message: "Successfully",
          data: result,
        });
      } else {
        next("something went wrong!");
        return;
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error.message });
  }
};

const commentPost = async (req, res, next) => {
  try {
    const { comment, from } = req.body;
    const { userId } = req.body.user;
    const { id } = req.params;

    if (comment === null) {
      return res.status(404).json({ message: "Comment is required." });
    }

    const newComment = new Comments({ comment, from, userId, postId: id });

    await newComment.save();

    //updating the post with the comments id
    const post = await Posts.findById(id);

    post.comments.push(newComment._id);

    const updatedPost = await Posts.findByIdAndUpdate(id, post, {
      new: true,
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

const replyComments = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { comment, replyAt, from } = req.body;
    const { id } = req.params;

    if (comment === null || comment === undefined || comment === "") {
      next("Comment is required!");
      return;
    } else {

      console.log(id,comment)

      const commentInfo = await Comments.findById(id);

      commentInfo.replies.push({
        comment,
        replyAt,
        from,
        userId,
        created_At: Date.now(),
      });

      await commentInfo.save();

      res.status(200).json(commentInfo)
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

const deletePost = async (req, res , next) => {
  try {
    const {id} = req.params;
    const {userId} = req.body.user;

    console.log({id})

    const result = await Posts.findByIdAndDelete(id);
console.log(result)
    res.status(200).json({success:true, message:"Successfully deleted"})
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};



export {
  createPost,
  getPosts,
  getSinglePost,
  getUserPost,
  getComments,
  likePost,
  likePostComment,
  commentPost,
  deletePost,
  replyComments
};
