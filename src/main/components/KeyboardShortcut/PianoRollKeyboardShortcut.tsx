import { FC, useEffect } from "react"
import {
  copySelection,
  deleteSelection,
  duplicateSelection,
  pasteSelection,
  resetSelection,
  selectNextNote,
  selectPreviousNote,
  transposeSelection,
} from "../../actions"
import { useStores } from "../../hooks/useStores"

const isFocusable = (e: EventTarget) =>
  e instanceof HTMLAnchorElement ||
  e instanceof HTMLAreaElement ||
  e instanceof HTMLInputElement ||
  e instanceof HTMLSelectElement ||
  e instanceof HTMLTextAreaElement ||
  e instanceof HTMLButtonElement ||
  e instanceof HTMLIFrameElement

const SCROLL_DELTA = 24

export const PianoRollKeyboardShortcut: FC = () => {
  const rootStore = useStores()

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.target !== null && isFocusable(e.target)) {
        return
      }
      switch (e.code) {
        case "Escape": {
          resetSelection(rootStore)()
          break
        }
        case "KeyD": {
          if (e.ctrlKey || e.metaKey) {
            duplicateSelection(rootStore)()
          }
          break
        }
        case "Delete":
        case "Backspace": {
          deleteSelection(rootStore)()
          break
        }
        case "Digit1": {
          rootStore.pianoRollStore.mouseMode = "pencil"
          break
        }
        case "Digit2": {
          rootStore.pianoRollStore.mouseMode = "selection"
          break
        }
        case "ArrowUp": {
          if (e.ctrlKey || e.metaKey) {
            rootStore.pianoRollStore.scrollBy(0, SCROLL_DELTA)
          } else {
            transposeSelection(rootStore)(e.shiftKey ? 12 : 1)
          }
          break
        }
        case "ArrowDown": {
          if (e.ctrlKey || e.metaKey) {
            rootStore.pianoRollStore.scrollBy(0, -SCROLL_DELTA)
          } else {
            transposeSelection(rootStore)(e.shiftKey ? -12 : -1)
          }
          break
        }
        case "ArrowRight":
          if (e.ctrlKey || e.metaKey) {
            rootStore.pianoRollStore.scrollBy(-SCROLL_DELTA, 0)
          } else if (rootStore.pianoRollStore.mouseMode == "pencil") {
            selectNextNote(rootStore)()
          }
          break
        case "ArrowLeft":
          if (e.ctrlKey || e.metaKey) {
            rootStore.pianoRollStore.scrollBy(SCROLL_DELTA, 0)
          } else if (rootStore.pianoRollStore.mouseMode == "pencil") {
            selectPreviousNote(rootStore)()
          }
          break
        default:
          // do not call preventDefault
          return
      }
      e.preventDefault()
    }

    window.addEventListener("keydown", listener)

    document.oncut = () => {
      copySelection(rootStore)()
      deleteSelection(rootStore)()
    }
    document.oncopy = () => {
      copySelection(rootStore)()
    }
    document.onpaste = () => {
      pasteSelection(rootStore)()
    }
    return () => {
      window.removeEventListener("keydown", listener)

      document.onkeydown = null
      document.oncut = null
      document.oncopy = null
      document.onpaste = null
    }
  }, [rootStore])

  return <></>
}
