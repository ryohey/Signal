import React, { FC, useEffect, useCallback } from "react"
import { NoteCoordTransform } from "common/transform"
import { useObserver } from "mobx-react"
import { withSize } from "react-sizeme"
import { PianoRoll } from "components/PianoRoll/PianoRoll"
import { useTheme } from "main/hooks/useTheme"
import { useStores } from "main/hooks/useStores"
import { ISize } from "common/geometry"

export interface PianoRollWrapperProps {
  size: ISize
}

const PianoRollWrapper: FC<PianoRollWrapperProps> = ({ size }) => {
  const { rootStore } = useStores()
  const {
    endTick,
    isPlaying,
    playerPosition,
    scaleX,
    scrollLeft,
    scrollTop,
    autoScroll,
    s,
  } = useObserver(() => ({
    endTick: rootStore.song.endOfSong,
    isPlaying: rootStore.services.player.isPlaying,
    playerPosition: rootStore.playerStore.position,
    s: rootStore.pianoRollStore,
    scaleX: rootStore.pianoRollStore.scaleX,
    scrollLeft: rootStore.pianoRollStore.scrollLeft,
    scrollTop: rootStore.pianoRollStore.scrollTop,
    autoScroll: rootStore.pianoRollStore.autoScroll,
  }))

  const theme = useTheme()
  const transform = new NoteCoordTransform(0.1 * scaleX, theme.keyHeight, 127)

  useEffect(() => {
    // keep scroll position to cursor
    if (autoScroll && isPlaying) {
      const x = transform.getX(playerPosition)
      const screenX = x - scrollLeft
      if (screenX > size.width * 0.7 || screenX < 0) {
        s.scrollLeft = x
      }
    }
  }, [autoScroll, isPlaying, scaleX, scrollLeft, playerPosition])

  const setScrollLeft = useCallback((v) => (s.scrollLeft = v), [scrollLeft])
  const setScrollTop = useCallback((v) => (s.scrollTop = v), [scrollTop])
  const onClickScaleUp = useCallback(() => (s.scaleX = scaleX + 0.1), [scaleX])
  const onClickScaleDown = useCallback(
    () => (s.scaleX = Math.max(0.05, scaleX - 0.1)),
    [scaleX]
  )
  const onClickScaleReset = useCallback(() => (s.scaleX = 1), [scaleX])

  return (
    <PianoRoll
      size={size}
      endTick={endTick}
      scrollLeft={scrollLeft}
      setScrollLeft={setScrollLeft}
      transform={transform}
      scrollTop={scrollTop}
      setScrollTop={setScrollTop}
      onClickScaleUp={onClickScaleUp}
      onClickScaleDown={onClickScaleDown}
      onClickScaleReset={onClickScaleReset}
    />
  )
}

export default withSize({ monitorHeight: true })(PianoRollWrapper)
