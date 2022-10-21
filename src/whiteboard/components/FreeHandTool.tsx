import React, { useCallback, useState } from 'react'
import simplify from 'simplify-js'
import { ops } from '../canvas/operations'
import { Point } from '../canvas/serdes'
import { TbBrush } from 'react-icons/tb'

import { useWhiteboard } from '../context'
import { Button } from '../styles'

export function FreeHandTool() {
  const [isDown, setDown] = useState(false)
  const [points, setPoints] = useState<Point[]>([])

  const { properties, setProperty } = useWhiteboard(
    {
      name: 'FreeHandTool',
      onInit({ setProperty }) {
        setProperty('mode', 'freehand')
      },

      onMouseMove(point) {
        if (properties.mode === 'freehand' && isDown) {
          setPoints((p) => [...p, point])
        }
      },

      onMouseDown(point, { properties }) {
        if (properties.mode === 'freehand') {
          setDown(true)
          setPoints([point])
        }
      },

      onMouseUp(point, { properties, commit }) {
        if (properties.mode === 'freehand' && isDown) {
          setDown(false)
          const spoints = simplify([...points, point], 1)
          commit(ops.path(properties.color, properties.strokewidth, spoints))
          setPoints([])
        }
      },

      onMouseLeave(point, { commit, properties }) {
        if (properties.mode === 'freehand' && isDown) {
          setDown(false)
          const spoints = simplify([...points, point], 1)
          commit(ops.path(properties.color, properties.strokewidth, spoints))
          setPoints([])
        }
      },

      onDraw(delta, { draw, properties }) {
        if (properties.mode === 'freehand') {
          draw(ops.path(properties.color, properties.strokewidth, points))
        }
      },
    },
    [isDown, setDown, points, setPoints]
  )

  const onClick = useCallback(() => {
    if (properties.mode !== 'freehand') {
      setProperty('mode', 'freehand')
    }
  }, [properties])

  return (
    <Button onClick={onClick} active={properties.mode === 'freehand' ? 1 : 0}>
      <TbBrush size={22} />
    </Button>
  )
}
