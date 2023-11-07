// @refresh reload
import { Suspense, lazy } from "solid-js"
import {
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start"
import "./root.css"
export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>Jesse is a sexy boy.</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <nav class="bg-slate-700 text-slate-300 flex justify-center gap-5">
              <A class="mr-2" activeClass="text-slate-100 bold" href="/" end>
                Index
              </A>
              <A activeClass="text-slate-100 bold" href="/comments">
                Comments
              </A>
              <A activeClass="text-slate-100 bold" href="/about">
                About
              </A>
            </nav>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  )
}
