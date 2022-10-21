import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { setup } from 'goober'

import { Whiteboard } from './whiteboard/Whiteboard'
import { LineTool } from './whiteboard/components/LineTool'
import { ColorPicker } from './whiteboard/components/ColorPicker'
import { FloodFillTool } from './whiteboard/components/FloodFillTool'
import { FreeHandTool } from './whiteboard/components/FreeHandTool'
import { StrokeThickness } from './whiteboard/components/StrokeThickness'
import { PubNubSync } from './whiteboard/components/PubNubSync'
import { EmojiStampTool } from './whiteboard/components/EmojiStampTool'
import { RectangleTool } from './whiteboard/components/RectangleTool'
import { DownloadImage } from './whiteboard/components/DownloadImage'

setup(React.createElement)

const root = createRoot(document.getElementById('output')!)

function App() {
  const [[width, height], setDimensions] = useState<[number, number]>([window.innerWidth, window.innerHeight])

  useEffect(() => {
    function resize() {
      setDimensions([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <Whiteboard width={width} height={height}>
      <ColorPicker />
      <StrokeThickness />
      <FreeHandTool />
      <LineTool />
      <RectangleTool />
      <EmojiStampTool />
      <FloodFillTool />
      <DownloadImage />
      <PubNubSync />
    </Whiteboard>
  )
}

root.render(<App />)
