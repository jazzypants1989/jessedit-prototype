import { createSignal, For, Show } from "solid-js"

export default function gallery() {
  const [active, setActive] = createSignal<number | null>(null)

  let searchParams: URLSearchParams

  if (typeof window !== "undefined") {
    navigation.addEventListener("navigate", (e) => {
      e.intercept({
        handler() {
          searchParams = new URLSearchParams(window.location.search)
          const activeParam = searchParams.get("active") || null
          if (activeParam) {
            setActive(parseInt(activeParam))
          }
          const navigationState =
            navigation.currentEntry.getState()?.active || null
          if (navigationState === 0 || navigationState !== null) {
            setActive(navigationState)
          }
        },
      })
    })
    searchParams = new URLSearchParams(window.location.search)
    const activeParam = searchParams.get("active") || null
    if (activeParam) {
      setActive(parseInt(activeParam))
    }
    const navigationState = navigation.currentEntry.getState()?.active || null

    if (navigationState === 0 || navigationState !== null) {
      setActive(navigationState)
    }
  }

  const images = [
    "https://placekitten.com/200/200",
    "https://placekitten.com/200/201",
    "https://placekitten.com/200/202",
  ]

  const linkWithParam = (index: number) => {
    const url = new URL(window.location.href)
    url.searchParams.set("active", index.toString())
    return url.href
  }

  const copyLink = () => {
    const link = linkWithParam(active())
    navigator.clipboard.writeText(link)
  }

  return (
    <div class="flex items-center justify-center h-full">
      <Show when={active() !== null}>
        <img
          src={images[active()]}
          class="w-64 h-64"
          onClick={() => {
            setActive(0)
            searchParams.delete("active")
            navigation.navigate("/gallery", {
              state: { active: null },
              history: "push",
            })
            console.log(active())
          }}
        />
        <button onClick={copyLink}>Copy Link</button>
      </Show>
      <For each={images}>
        {(image, index) => (
          <img
            id={"image" + index()}
            src={image}
            class="w-32 h-32"
            onClick={() => {
              setActive(index)
              //   searchParams.set("active", index().toString())
              navigation.navigate("/gallery", {
                state: { active: index() },
                history: "push",
              })
              console.log(active())
            }}
          />
        )}
      </For>
    </div>
  )
}
