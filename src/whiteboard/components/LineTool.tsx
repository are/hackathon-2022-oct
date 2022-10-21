import React, { useCallback, useState } from 'react'
import { TbLine } from 'react-icons/tb'
import { ops } from '../canvas/operations'
import { Point } from '../canvas/serdes'

import { useWhiteboard } from '../context'
import { Button } from '../styles'

export function LineTool() {
  const [startingPoint, setStartingPoint] = useState<Point | null>(null)
  const [endPoint, setEndPoint] = useState<Point | null>(null)

  const { properties, setProperty } = useWhiteboard(
    {
      name: 'LineTool',
      onMouseMove(point) {
        if (properties.mode === 'line' && startingPoint !== null) {
          setEndPoint(point)
        }
      },

      onMouseDown(point, { properties }) {
        if (properties.mode === 'line') {
          setStartingPoint(point)
        }
      },

      onMouseUp(point, { properties, commit }) {
        if (properties.mode === 'line') {
          if (startingPoint !== null && endPoint !== null) {
            commit(ops.path(properties.color, properties.strokewidth, [startingPoint, endPoint]))
          }

          setStartingPoint(null)
          setEndPoint(null)
        }
      },

      onMouseLeave(point, context) {
        if (properties.mode === 'line' && startingPoint !== null) {
          setStartingPoint(null)
          setEndPoint(null)
        }
      },

      onDraw(delta, { draw, properties }) {
        if (properties.mode === 'line' && startingPoint !== null && endPoint !== null) {
          draw(ops.path(properties.color, properties.strokewidth, [startingPoint, endPoint]))
        }
      },
    },
    [setStartingPoint, startingPoint, setEndPoint, endPoint]
  )

  const onClick = useCallback(() => {
    if (properties.mode !== 'line') {
      setProperty('mode', 'line')
    }
  }, [properties])

  return (
    <Button onClick={onClick} active={properties.mode === 'line' ? 1 : 0}>
      <TbLine size={22} />
    </Button>
  )
}
