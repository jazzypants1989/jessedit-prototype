import { createEffect } from "solid-js"
import { createStore } from "solid-js/store"
import CommentList from "../components/CommentList"

import server$ from "solid-start/server"
import db from "../utils/db"

const commentFields = {
  id: true,
  message: true,
  parentId: true,
  createdAt: true,
  user: true,
  likes: true,
}

const getPost = server$(async () => {
  const post = await db.post.findFirst({
    where: {
      title: "Okay, I'll admit it. Everything is falling apart.",
    },
    include: {
      user: true,
      comments: {
        select: {
          ...commentFields,
          children: {
            select: {
              ...commentFields,
              children: {
                select: {
                  ...commentFields,
                  children: {
                    select: {
                      ...commentFields,
                      children: {
                        select: {
                          ...commentFields,
                          children: {
                            select: {
                              ...commentFields,
                              children: {
                                select: {
                                  ...commentFields,
                                  children: {
                                    select: {
                                      ...commentFields,
                                      children: {
                                        select: {
                                          ...commentFields,
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  return post
})

const post = await getPost()

export default function Comments() {
  const [comments, setComments] = createStore(post?.comments || [])

  return (
    <main class="bg-slate-700 text-slate-200 w-full flex flex-col min-h-screen m-auto items-center justify-center gap-10">
      <div class="flex flex-col gap-2">
        <div class="font-bold">{post?.user.name}</div>
        <img
          src={post?.user.avatar_url}
          class="object-cover rounded-full w-20 h-20"
        />
        <h3>{post?.title}</h3>
        <div class="bg-slate-600 text-slate-200 p-2 rounded-md">
          {post?.body}
        </div>
      </div>
      <h1>Comments</h1>
      <CommentList comments={comments} />
    </main>
  )
}
