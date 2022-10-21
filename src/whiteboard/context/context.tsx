import React, { ReactNode, RefObject, createContext, useCallback, useMemo, useState, useRef, useEffect } from 'react'
import { calculateOffset } from '../canvas/events'
import { applyOperation, Operation } from '../canvas/operations'

import { Component, ComponentEvents } from '../Component'

export type WhiteboardContext = {
  properties: Record<string, any>
  setProperty(property: string, value: any): void

  registerComponent(id: string, component: Component): void
  draw(operation: Operation): void
  commit(operation: Operation, skipComponents?: boolean): void
  flush(): void
  download(): void
}

export const context = createContext<WhiteboardContext>({
  properties: {},
  setProperty() {},
  registerComponent() {},
  draw() {},
  commit() {},
  flush() {},
  download() {},
})

export type WhiteboardProviderProps = {
  children: ReactNode
  localCanvas: RefObject<HTMLCanvasElement>
  remoteCanvas: RefObject<HTMLCanvasElement>

  width?: number
  height?: number
}

export function WhiteboardProvider({
  children,
  localCanvas,
  remoteCanvas,
  width = 600,
  height = 400,
}: WhiteboardProviderProps) {
  /// Canvas
  const lctx = useRef<CanvasRenderingContext2D | null>(null)
  const rctx = useRef<CanvasRenderingContext2D | null>(null)

  /// Drawing loop
  const rafId = useRef<number | null>(null)
  const rafTimestamp = useRef<number>(0)

  const operationBuffer = useRef<Operation[]>([])

  const flush = useCallback(() => {
    if (rctx.current) {
      for (const operation of operationBuffer.current) {
        applyOperation(rctx.current, operation)
      }

      operationBuffer.current = []
    }
  }, [operationBuffer, rctx])

  const commit = useCallback(
    (operation: Operation, skipComponents?: boolean) => {
      operationBuffer.current.push(operation)

      // DO NETWORKING
      if (!skipComponents) {
        for (const component of components.current.values()) {
          component.onCommit?.(operation)
        }
      }

      if (operationBuffer.current.length > 100 || operation[0] === 'FF' || operation[0] === 'C') {
        flush()
      }
    },
    [operationBuffer, flush]
  )

  const draw = useCallback(
    (operation: Operation) => {
      if (lctx.current) {
        applyOperation(lctx.current, operation)
      }
    },
    [lctx]
  )

  const download = useCallback(() => {
    flush()

    if (rctx.current) {
      const image = rctx.current.canvas.toDataURL('image/png')
      const aDownloadLink = document.createElement('a')
      aDownloadLink.download = 'canvas_image.png'
      aDownloadLink.href = image
      aDownloadLink.download = `${new Date().toISOString()}.png`
      aDownloadLink.click()
    }
  }, [rctx, flush])

  /// Components
  const components = useRef<Map<string, Component>>(new Map())
  const [properties, setProperties] = useState<Record<string, any>>({})

  const setProperty = useCallback(
    (property: string, value: any) => {
      setProperties((properties) => {
        return { ...properties, [property]: value }
      })
    },
    [setProperties]
  )

  const registerComponent = useCallback((id: string, component: Component) => {
    if (!components.current.has(id)) {
      component.onInit?.({ properties, setProperty })
    }

    components.current.set(id, component)
  }, [])

  /// Assembly
  const value = useMemo(
    () => ({
      properties,
      setProperty,
      registerComponent,
      flush,
      commit,
      draw,
      download,
    }),
    [properties, setProperty, registerComponent, flush, commit, draw]
  )

  useEffect(() => {
    function loop(time: number) {
      rafId.current = requestAnimationFrame(loop)

      const delta = time - rafTimestamp.current
      rafTimestamp.current = time

      if (lctx.current) {
        lctx.current.clearRect(0, 0, lctx.current.canvas.width, lctx.current.canvas.height)

        for (const operation of operationBuffer.current) {
          applyOperation(lctx.current, operation)
        }

        for (const component of components.current.values()) {
          component.onDraw?.(delta, value)
        }
      }
    }

    loop(0)

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [value, lctx])

  useEffect(() => {
    if (localCanvas.current && remoteCanvas.current) {
      lctx.current = localCanvas.current.getContext('2d')
      rctx.current = remoteCanvas.current.getContext('2d')

      flush()

      const dt = rctx.current!.getImageData(0, 0, rctx.current!.canvas.width, rctx.current!.canvas.height)

      localCanvas.current.width = remoteCanvas.current.width = width
      localCanvas.current.height = remoteCanvas.current.height = height

      rctx.current!.putImageData(dt, 0, 0)

      // bind events
    }
  }, [localCanvas, remoteCanvas, width, height, flush])

  /// Event handling
  const triggerMouseComponentEvent = useCallback(
    (type: ComponentEvents, event: MouseEvent) => {
      if (localCanvas.current) {
        const point = calculateOffset(event, localCanvas.current)

        for (const component of components.current.values()) {
          component[`on${type}`]?.(point, value)
        }
      }
    },
    [localCanvas, value]
  )

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      triggerMouseComponentEvent('MouseDown', event)
    },
    [triggerMouseComponentEvent]
  )

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      triggerMouseComponentEvent('MouseUp', event)
    },
    [triggerMouseComponentEvent]
  )

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      triggerMouseComponentEvent('MouseMove', event)
    },
    [triggerMouseComponentEvent]
  )

  const handleMouseEnter = useCallback(
    (event: MouseEvent) => {
      triggerMouseComponentEvent('MouseEnter', event)
    },
    [triggerMouseComponentEvent]
  )

  const handleMouseLeave = useCallback(
    (event: MouseEvent) => {
      triggerMouseComponentEvent('MouseLeave', event)
    },
    [triggerMouseComponentEvent]
  )

  useEffect(() => {
    if (!localCanvas.current) {
      return
    }

    localCanvas.current.addEventListener('mousemove', handleMouseMove)
    localCanvas.current.addEventListener('mousedown', handleMouseDown)
    localCanvas.current.addEventListener('mouseup', handleMouseUp)
    localCanvas.current.addEventListener('mouseenter', handleMouseEnter)
    localCanvas.current.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      if (!localCanvas.current) {
        return
      }

      localCanvas.current.removeEventListener('mousemove', handleMouseMove)
      localCanvas.current.removeEventListener('mousedown', handleMouseDown)
      localCanvas.current.removeEventListener('mouseup', handleMouseUp)
      localCanvas.current.removeEventListener('mouseenter', handleMouseEnter)
      localCanvas.current.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [localCanvas, handleMouseMove, handleMouseDown, handleMouseUp, handleMouseEnter, handleMouseLeave])

  return <context.Provider value={value}>{children}</context.Provider>
}
