import React, { useCallback, useState } from 'react'
import { IoIosSquareOutline, IoIosSquare } from 'react-icons/io'
import { ops } from '../canvas/operations'
import { Point } from '../canvas/serdes'

import { useWhiteboard } from '../context'
import { Button } from '../styles'

export function RectangleTool() {
  const [startingPoint, setStartingPoint] = useState<Point | null>(null)
  const [endPoint, setEndPoint] = useState<Point | null>(null)
  const [fillMode, setFillMode] = useState(false)

  const { properties, setProperty } = useWhiteboard(
    {
      name: 'RectangleTool',
      onMouseMove(point) {
        if (properties.mode === 'rect' && startingPoint !== null) {
          setEndPoint(point)
        }
      },

      onMouseDown(point, { properties }) {
        if (properties.mode === 'rect') {
          setStartingPoint(point)
        }
      },

      onMouseUp(point, { properties, commit }) {
        if (properties.mode === 'rect') {
          if (startingPoint !== null && endPoint !== null) {
            commit(
              ops.rectangle(
                startingPoint,
                endPoint,
                properties.color,
                properties.strokewidth,
                fillMode ? properties.color : undefined
              )
            )
          }

          setStartingPoint(null)
          setEndPoint(null)
        }
      },

      onMouseLeave(point, context) {
        if (properties.mode === 'rect' && startingPoint !== null) {
          setStartingPoint(null)
          setEndPoint(null)
        }
      },

      onDraw(delta, { draw, properties }) {
        if (properties.mode === 'rect' && startingPoint !== null && endPoint !== null) {
          draw(
            ops.rectangle(
              startingPoint,
              endPoint,
              properties.color,
              properties.strokewidth,
              fillMode ? properties.color : undefined
            )
          )
        }
      },
    },
    [setStartingPoint, startingPoint, setEndPoint, endPoint, fillMode]
  )

  const onClick = useCallback(() => {
    if (properties.mode !== 'rect') {
      setProperty('mode', 'rect')
    } else {
      setFillMode((e) => !e)
    }
  }, [properties])

  return (
    <Button onClick={onClick} active={properties.mode === 'rect' ? 1 : 0}>
      {fillMode ? <IoIosSquare size={22} /> : <IoIosSquareOutline size={22} />}
    </Button>
  )
}
