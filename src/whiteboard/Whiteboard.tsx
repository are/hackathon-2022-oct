import React, { forwardRef, ReactNode, useRef } from 'react'
import { styled } from 'goober'

import { WhiteboardProvider } from './context'

const Container = styled('div')`
  position: relative;
`

const ComponentsContainer = styled('div')`
  position: absolute;
  display: flex;
  z-index: 1;

  padding: 10px 30px;
  border-radius: 50px;

  background-color: #e9e9e9;
  margin: 10px;

  justify-content: center;
  align-items: center;
`

const Canvas = styled('canvas', forwardRef)`
  position: absolute;
  top: 0;
  left: 0;
  /* image-rendering: pixelated; */
  /* image-rendering: crisp-edges; */
`

export type WhiteboardProps = {
  children: ReactNode

  width: number
  height: number
}

export function Whiteboard({ children, width, height }: WhiteboardProps) {
  const localCanvas = useRef<HTMLCanvasElement>(null)
  const remoteCanvas = useRef<HTMLCanvasElement>(null)

  return (
    <WhiteboardProvider localCanvas={localCanvas} remoteCanvas={remoteCanvas} width={width} height={height}>
      <Container>
        <Canvas ref={remoteCanvas} />
        <Canvas ref={localCanvas} />

        <ComponentsContainer>{children}</ComponentsContainer>
      </Container>
    </WhiteboardProvider>
  )
}
