import server$ from "solid-start/server"
import db from "./db"
import { Like } from "@prisma/client"

// const createPost = server$(async (post) => {
//   const { title, body, user } = post
//   console.log("title", title) // title New Comment
//   console.log("body", body) //   body Body of the comment
//   console.log("userId", user.id) // userId 1
//   const newPost = await db.post.create({
//     data: {
//       title,
//       body,
//       userId: user.id.toString(),
//     },
//   })
//   return newPost
// })

const createComment = server$(async (comment) => {
  const { message, user, post } = comment
  const newComment = await db.comment.create({
    data: {
      message,
      userId: user.id.toString(),
      postId: post.id.toString(),
    },
  })
  return newComment
})

export const createNestedComment = server$(async (comment) => {
  const { message, user, post, parent } = comment
  console.log("body", message) // body Body of the comment
  console.log("userId", user.id) // userId 1
  console.log("postId", post.id) // postId 1
  console.log("parentId", parent.id) // parentId 1
  const newComment = await db.comment.create({
    data: {
      message,
      userId: user.id.toString(),
      postId: post.id.toString(),
      parentId: parent.id.toString(),
    },
  })
  return newComment
})

export const findPostByTitle = server$(async (title) => {
  return db.post.findFirst({
    where: {
      title,
    },
    include: {
      user: true,
      comments: {
        include: {
          user: true,
          likes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })
})

export const likeComment = server$(async (comment) => {
  const { id, user } = comment
  console.log("id", id) // id 1
  console.log("userId", user.id) // userId 1
  const newLike = await db.like.create({
    data: {
      userId: user.id.toString(),
      commentId: id.toString(),
    },
  })
  console.log("newLike", newLike)
  return newLike
})

export const likePost = server$(async (post) => {
  const { id, user } = post
  const newLike = await db.like.create({
    data: {
      userId: user.id.toString(),
      postId: id.toString(),
    },
  })
  console.log("newLike", newLike)
  return newLike
})

export const unlikeComment = server$(async (comment) => {
  const { likes } = comment
  const like = likes.find((like: Like) => like.userId === comment.user.id)
  const deletedLike = await db.like.delete({
    where: {
      id: like.id.toString(),
    },
  })
  return deletedLike
})

export const unlikePost = server$(async (post) => {
  const { likes } = post
  const like = likes.find((like: Like) => like.userId === post.user.id)
  const deletedLike = await db.like.delete({
    where: {
      id: like.id.toString(),
    },
  })
  return deletedLike
})

export const updateComment = server$(async (comment) => {
  const { id, message } = comment
  const updatedComment = await db.comment.update({
    where: {
      id: id.toString(),
    },
    data: {
      message,
    },
  })
  return updatedComment
})

export const deleteComment = server$(async (comment) => {
  const { id } = comment
  const deletedComment = await db.comment.delete({
    where: {
      id: id.toString(),
    },
  })
  return deletedComment
})

export default createComment
