import React, { ChangeEvent, useCallback } from 'react'
import { useWhiteboard } from '../context'
import { Button } from '../styles'

const colors = [
  '#0074D9',
  '#7FDBFF',
  '#39CCCC',
  '#B10DC9',
  '#F012BE',
  '#85144b',
  '#FF4136',
  '#FF851B',
  '#FFDC00',
  '#3D9970',
  '#2ECC40',
  '#01FF70',
  '#111111',
  '#AAAAAA',
  '#DDDDDD',
  '#FFFFFF',
]

export function ColorPicker() {
  const { properties, setProperty } = useWhiteboard(
    {
      name: 'ColorPicker',
      onInit({ setProperty }) {
        setProperty('color', '#000000')
      },
    },
    []
  )

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setProperty('color', event.target.value)
    },
    [setProperty]
  )

  return (
    <div style={{ display: 'inline-block', paddingTop: 3 }}>
      {colors.map((color) => (
        <Button
          key={color}
          onClick={() => setProperty('color', color)}
          active={properties.color === color ? 1 : 0}
          background={color}
          size={32}
        />
      ))}
    </div>
  )
}
