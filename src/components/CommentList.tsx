import { createStore } from "solid-js/store"
import { createSignal, Show, For, createEffect } from "solid-js"
import CommentItem from "./CommentItem"

import { CommentItemProps } from "./CommentItem"

import createComment, { findPostByTitle } from "~/utils/createComment"
import { Post } from "@prisma/client"

export const user = {
  id: "d22446a9-fa56-44e0-843c-2d0ac376a942",
  name: "Jazzy Pants",
  avatar_url:
    "https://images.freeimages.com/images/large-previews/9f0/roland-1058749.jpg",
}

const CommentList = (props: { comments: CommentItemProps[]; post: Post }) => {
  const [text, setText] = createSignal("")
  const [error, setError] = createSignal("")

  createEffect(() => {
    if (text()) setError("")
  })

  const { comments } = props

  const onSubmit = (e: Event) => {
    e.preventDefault()
    if (!text()) {
      setError("Please enter a comment")
      return
    }

    const comment = createComment({
      message: text(),
      post: props.post,
      user,
    })

    console.log("comment", comment)
  }

  return (
    <>
      <div class="flex w-full max-w-3xl items-center justify-start flex-col gap-2 py-1">
        <form
          onSubmit={onSubmit}
          class="flex w-full items-center justify-center flex-col gap-2"
        >
          <textarea
            value={text()}
            onInput={(e: Event) =>
              setText((e.target as HTMLInputElement).value)
            }
            class="border w-full border-gray-300 rounded-md bg-slate-600 text-slate-200"
          />
          {error() && (
            <div class="text-red-300 animate-pulse bold self-center text-center text-4xl p-2 w-fit bg-red-700 rounded-xl">
              {error()}
            </div>
          )}
          <button class="p-2 bg-purple-500" type="submit">
            Add Comment
          </button>
        </form>
        <Show
          when={comments.length > 0}
          fallback={
            <h3 class="text-gray-400">
              There are no comments yet. Be the first!
            </h3>
          }
        >
          <h2 class="text-2xl text-center">Comments</h2>
          <ul class="p-2 w-full max-w-4xl">
            <For each={comments}>
              {(item) => {
                return (
                  !item.parentId && (
                    <li class="m-2 p-2 mb-0 pb-0 border-t border-gray-300">
                      <CommentItem comment={item} post={props.post} />
                    </li>
                  )
                )
              }}
            </For>
          </ul>
        </Show>
      </div>
    </>
  )
}

export default CommentList
