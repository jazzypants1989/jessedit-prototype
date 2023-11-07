import { createStore } from "solid-js/store"
import { createSignal, createEffect, Show, For } from "solid-js"
import { user } from "./CommentList"
import EditForm from "./EditForm"

import {
  createNestedComment,
  likeComment,
  unlikeComment,
  deleteComment,
} from "~/utils/createComment"

import { Comment, User, Like, Post } from "@prisma/client"

export interface CommentItemProps extends Comment {
  user: User
  likes: Like[]
  children?: CommentItemProps[]
}

interface PostWithComments extends Post {
  comments: CommentItemProps[]
}

function userLikedComment(comment: CommentItemProps) {
  const hasLiked = comment.likes?.some((like) => like.userId === user.id)
  return hasLiked
}

function commentHasBeenEdited(comment: CommentItemProps) {
  if (!comment.updatedAt) return false
  const createdAt = new Date(comment.createdAt)
  const updatedAt = new Date(comment.updatedAt)
  return createdAt.getTime() !== updatedAt.getTime()
}

const CommentItem = (props: {
  comment: CommentItemProps
  post: PostWithComments
}) => {
  const [comment, setComment] = createStore(props.comment)
  const [text, setText] = createSignal("")
  const [error, setError] = createSignal("")
  const [showReply, setShowReply] = createSignal(false)
  const [showEdit, setShowEdit] = createSignal(false)
  const [showChildren, setShowChildren] = createSignal(false)

  console.log(props.post)
  const post = props.post
  function lookForChildren(comment: CommentItemProps) {
    const comments = post?.comments
    const children = comments?.filter((c: Comment) => c.parentId === comment.id)
    return children
  }

  createEffect(() => {
    const children = lookForChildren(comment)
    if (children) {
      setComment((comment: any) => {
        return {
          ...comment,
          children,
        }
      })
    }
  })

  createEffect(() => {
    if (showEdit()) {
      setShowReply(false)
    }
  })

  createEffect(() => {
    if (showReply()) {
      setShowEdit(false)
    }
  })

  createEffect(() => {
    if (text()) {
      setError("")
    }
  })

  const commentDate = new Date(comment.createdAt)

  const onSubmit = (e: Event) => {
    e.preventDefault()
    if (!text()) {
      setError("Please enter a comment")
      return
    }

    const nestedComment = createNestedComment({
      message: text(),
      post,
      user,
      parent: comment,
    })

    console.log("nestedComment", nestedComment)

    setComment((comment: any) => {
      const newComment = {
        id: Math.random().toString(36).substring(7),
        user,
        message: text(),
        parent: comment.id,
        children: [],
        createdAt: new Date().toISOString(),
      }
      return {
        ...comment,
        children: [...(comment.children || []), newComment],
      }
    })

    setText("")
  }

  const onLike = (comment: CommentItemProps) => {
    if (userLikedComment(comment)) {
      console.log("unlike")
      try {
        unlikeComment(comment)
        setComment((comment: any) => {
          return {
            ...comment,
            likes: comment.likes.filter(
              (like: Like) => like.userId !== user.id
            ),
          }
        })
      } catch (e) {
        console.log(e)
      }
    } else {
      try {
        likeComment(comment)
      } catch (e) {
        console.log(e)
      }
      console.log("like")
      setComment((comment: any) => {
        return {
          ...comment,
          likes: [
            ...comment.likes,
            {
              id: Math.random().toString(36).substring(7),
              userId: user.id,
              commentId: comment.id,
            },
          ],
        }
      })
    }
  }

  const onDelete = (comment: CommentItemProps) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      console.log(
        "IT HAS BEEN CANCELLED. I GOTCHA BRO. DON'T WORRY. IT'S ALL GOOD."
      )
      return
    }
    try {
      deleteComment(comment)
      setComment((comment: any) => {
        return {
          ...comment,
          children: comment.children.filter(
            (c: CommentItemProps) => c.id !== comment.id
          ),
        }
      })
      console.log("deleted")
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div
      id={comment.id}
      class="flex flex-col gap-2 pl-2 border-b border-gray-300 m-2 p-2 border-dashed w-full"
    >
      <div class="flex items-center gap-2 px-2 md:flex-row flex-col">
        <img
          src={comment.user?.avatar_url || "https://picsum.photos/200"}
          class="w-12 h-12 rounded-full object-cover md:w-24 md:h-24"
        />
        <div class="font-bold">{comment.user.name}</div>
      </div>
      <div class="bg-slate-600 text-slate-200 p-2 rounded-md whitespace-pre-wrap">
        {comment.message}
      </div>
      <Show when={commentHasBeenEdited(comment)}>
        <div class="text-gray-200 text-sm italic">
          This comment was edited on{" "}
          {new Date(comment.updatedAt).toLocaleString()}.
        </div>
      </Show>
      <div class="text-gray-400">{commentDate.toLocaleString()}</div>
      <div class="flex flex-wrap items-center justify-center bg-slate-600 text-slate-200 p-2 rounded-md text-lg md:text-2xl">
        <Show
          when={userLikedComment(comment)}
          fallback={
            <button
              onClick={() => onLike(comment)}
              class="bg-slate-600 text-slate-200 pl-2 rounded-md w-fit"
            >
              ❤
            </button>
          }
        >
          <button
            onClick={() => onLike(comment)}
            class="bg-slate-600 text-slate-200 pl-2 rounded-md w-fit"
          >
            💖
          </button>
        </Show>
        <Show when={comment.likes}>
          <h4
            class="text-gray-400 pr-2
          "
          >
            {comment.likes?.length}
          </h4>
        </Show>
        <a
          href={`#${comment.id}`}
          class="flex justify-start bg-slate-600 text-slate-200 p-2 rounded-md w-fit"
        >
          🔗
        </a>
        <Show when={comment.user?.id === user.id}>
          <button
            onClick={() => setShowEdit((showEdit) => !showEdit)}
            class="flex justify-start bg-slate-600 text-slate-200 p-2 rounded-md w-fit"
          >
            📝
          </button>
        </Show>
        <Show when={comment.user?.id === user.id}>
          <button
            onclick={() => onDelete(comment)}
            class="flex justify-start bg-slate-600 text-slate-200 p-2 rounded-md w-fit"
          >
            🗑️
          </button>
        </Show>
        <button
          onClick={() => setShowReply((showReply) => !showReply)}
          class="flex justify-start bg-slate-600 text-purple-400 p-2 rounded-md w-fit"
        >
          {showReply() ? "Close 🔺" : "Reply 🔻"}
        </button>
      </div>
      <Show when={showEdit()}>
        <EditForm comment={comment} />
      </Show>
      <Show when={showReply()}>
        <form
          class="flex items-start justify-center flex-col gap-2"
          onSubmit={onSubmit}
        >
          <textarea
            value={text()}
            onInput={(e: Event) =>
              setText((e.target as HTMLInputElement).value)
            }
            class="border w-full border-gray-300 rounded-md bg-slate-600 text-slate-200 p-1"
          />
          <button
            class="p-2 self-end font-bold bg-purple-500 text-slate-200 rounded-md text-xl hover:bg-purple-800 hover:text-purple-300"
            type="submit"
          >
            Reply
          </button>
        </form>
      </Show>
      <Show when={error()}>
        <div class="text-red-300 animate-bounce bold self-center text-center text-4xl p-2 w-fit bg-red-700 rounded-md">
          {error()}
        </div>
      </Show>
      {comment.children && comment.children.length > 0 && (
        <>
          <button
            onClick={() => setShowChildren((showChildren) => !showChildren)}
            class="flex justify-start bg-slate-600 text-slate-200 p-2 rounded-md w-fit"
          >
            <Show when={!showChildren()} fallback="Hide Replies">
              Show{" "}
              {comment.children.length > 1
                ? `${comment.children.length} Replies`
                : `Reply`}
            </Show>
          </button>
          <Show when={showChildren()}>
            <ul class="border-l border-gray-300 pl-2 md:pl-4 border-dashed">
              <For each={comment.children}>
                {(item) => <CommentItem comment={item} post={post} />}
              </For>
            </ul>
          </Show>
        </>
      )}
    </div>
  )
}

export default CommentItem
