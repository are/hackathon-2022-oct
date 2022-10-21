import React, { useCallback, useState } from 'react'
import { MdOutlineEmojiEmotions } from 'react-icons/md'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { ops } from '../canvas/operations'

import { useWhiteboard } from '../context'
import { Button } from '../styles'
import { Point } from '../canvas/serdes'

export function EmojiStampTool() {
  const [isOpen, setOpen] = useState(false)
  const [pos, setPos] = useState<Point>({ x: 0, y: 0 })
  const [currentEmoji, setEmoji] = useState<any>(null)

  const { properties, setProperty } = useWhiteboard(
    {
      name: 'EmojiStampTool',
      onMouseDown(point, { properties, commit, flush }) {
        if (properties.mode === 'emojistamp' && currentEmoji) {
          commit(ops.text(currentEmoji.native, point, `#000000`, `${properties.strokewidth * 3}px serif`))
          flush()
        }
      },
      onMouseMove(point) {
        if (properties.mode === 'emojistamp') {
          setPos(point)
        }
      },
      onDraw(delta, { draw }) {
        if (properties.mode === 'emojistamp' && currentEmoji) {
          draw(ops.text(currentEmoji.native, pos, `#000000`, `${properties.strokewidth * 3}px serif`))
        }
      },
    },
    [currentEmoji, pos, setPos]
  )

  const onClick = useCallback(() => {
    if (properties.mode !== 'emojistamp') {
      setProperty('mode', 'emojistamp')
      setOpen(true)
    } else {
      setOpen(true)
    }
  }, [properties])

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Button onClick={onClick} active={properties.mode === 'emojistamp' ? 1 : 0}>
        <MdOutlineEmojiEmotions size={22} />
      </Button>
      <div style={{ position: 'absolute', display: isOpen ? 'block' : 'none', top: 50, left: 50, zIndex: 10 }}>
        <Picker
          data={data}
          onEmojiSelect={(ev) => {
            setEmoji(ev)
            setOpen(false)
          }}
          onClickOutside={() => isOpen && setOpen(false)}
          previewEmoji={currentEmoji?.id}
          previewPosition="top"
        />
      </div>
    </div>
  )
}
