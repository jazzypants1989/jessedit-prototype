import { Title } from "solid-start"
import server$ from "solid-start/server"

const secret = server$(async () => {
  return process.env.secret?.slice(0, 3)
})

const superSecret = await secret()

console.log("superSecret", superSecret)

export default function Home() {
  return (
    <main>
      <Title>Hello World</Title>
      <h1>The first three letters of the secret are {superSecret}</h1>
      <p>
        Visit{" "}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{" "}
        to learn how to build SolidStart apps.
      </p>
    </main>
  )
}
