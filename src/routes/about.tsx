import { createSignal, For, Show } from "solid-js"

function AutoComplete({ names }: { names: string[] }) {
  const [name, setName] = createSignal("")
  const [suggestions, setSuggestions] = createSignal<string[]>(names)
  const [showSuggestions, setShowSuggestions] = createSignal(false)

  const onInput = (e: Event): void => {
    const target = e.currentTarget as HTMLInputElement
    const value = target.value
    setName(value)
    setSuggestions(
      names.filter((name) => name.toLowerCase().includes(value.toLowerCase()))
    )
    setShowSuggestions(true)
  }

  const onClick = (e: Event): void => {
    const target = e.currentTarget as HTMLInputElement
    const value = target.innerText
    setName(value)
    setShowSuggestions(false)
  }

  return (
    <div class="flex flex-col gap-2">
      <label>Name</label>
      <input
        type="text"
        value={name()}
        onInput={onInput}
        class="border border-gray-300 rounded-md"
      />
      <Show when={showSuggestions()}>
        <ul class="border border-gray-300 rounded-md">
          <For each={suggestions()}>
            {(item) => (
              <li onClick={onClick} class="p-2 hover:bg-gray-300">
                {item}
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  )
}

export default function About() {
  const names = ["John", "Jane", "Jack", "Jill", "Jenny", "Jen"]
  return (
    <main class="bg-slate-700 text-slate-900 flex flex-col min-h-screen m-auto items-center justify-center gap-10">
      <h1>Comments</h1>
      <AutoComplete names={names} />
    </main>
  )
}
