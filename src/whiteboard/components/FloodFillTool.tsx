import React, { useCallback, useState } from 'react'
import { TbBucket } from 'react-icons/tb'
import { ops } from '../canvas/operations'
import { Point } from '../canvas/serdes'

import { useWhiteboard } from '../context'
import { Button } from '../styles'

export function FloodFillTool() {
  const { properties, setProperty } = useWhiteboard(
    {
      name: 'FloodFillTool',
      onMouseDown(point, { properties, commit, flush }) {
        if (properties.mode === 'floodfill') {
          flush()
          commit(ops.floodFill(properties.color, point))
        }
      },
    },
    []
  )

  const onClick = useCallback(() => {
    if (properties.mode !== 'floodfill') {
      setProperty('mode', 'floodfill')
    }
  }, [properties])

  return (
    <Button onClick={onClick} active={properties.mode === 'floodfill' ? 1 : 0}>
      <TbBucket size={22} />
    </Button>
  )
}
