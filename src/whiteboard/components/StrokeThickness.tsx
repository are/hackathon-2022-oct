import React, { ChangeEvent, useCallback, useState } from 'react'
import { ops } from '../canvas/operations'
import { Point } from '../canvas/serdes'
import { useWhiteboard } from '../context'

export function StrokeThickness() {
  const [pos, setPos] = useState<Point>({ x: 0, y: 0 })

  const { properties, setProperty } = useWhiteboard(
    {
      name: 'StrokeThickness',
      onInit({ setProperty }) {
        setProperty('strokewidth', 5)
      },

      onMouseMove(point) {
        setPos(point)
      },

      onDraw(delta, { draw }) {
        if (properties.mode === 'line' || properties.mode === 'freehand') {
          const sw = properties.strokewidth / 2

          draw(ops.circle(pos, sw, '#999999', 1))
        }
      },
    },
    [pos, setPos]
  )

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setProperty('strokewidth', parseInt(event.target.value))
    },
    [setProperty]
  )

  return (
    <input
      type="range"
      min={1}
      max={50}
      onChange={onChange}
      value={properties.strokewidth ?? 5}
      style={{ marginLeft: 20, marginRight: 10 }}
    />
  )
}
