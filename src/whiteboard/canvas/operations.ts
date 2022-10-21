import { decodeColor, decodePoint, encodeColor, encodePoint, Point } from './serdes'

import FloodFill from 'q-floodfill'

type CircleOperation = [
  type: 'CI',
  settings: [strokeColor: number, strokeWidth: number, fill: 0 | 1, fillColor: number],
  origin: number,
  radius: number
]
type PathOperation = [type: 'P', settings: [color: number, strokeWidth: number], ...params: number[]]
type ClearOperation = [type: 'C']
type FloodFillOperation = [type: 'FF', position: number, color: number]
type TextOperation = [type: 'T', settings: [color: number, font: string], position: number, text: string]
type RectOperation = [
  type: 'R',
  settings: [strokeColor: number, strokeWidth: number, fill: 0 | 1, fillColor: number],
  a: number,
  b: number
]

export type Operation =
  | PathOperation
  | ClearOperation
  | FloodFillOperation
  | CircleOperation
  | TextOperation
  | RectOperation

export const ops = {
  path: (color: `#${string}`, stroke: number, points: Point[]): PathOperation => [
    'P',
    [encodeColor(color), stroke],
    ...points.map(encodePoint),
  ],
  floodFill: (color: `#${string}`, origin: Point): FloodFillOperation => [
    'FF',
    encodePoint(origin),
    encodeColor(color),
  ],
  circle: (
    origin: Point,
    radius: number,
    strokeColor: `#${string}`,
    strokeWidth: number,
    fillColor?: `#${string}`
  ): CircleOperation => [
    'CI',
    [encodeColor(strokeColor), strokeWidth, fillColor ? 1 : 0, fillColor ? encodeColor(fillColor) : 0],
    encodePoint(origin),
    radius,
  ],
  text: (text: string, position: Point, color: `#${string}`, font?: string): TextOperation => [
    'T',
    [encodeColor(color), font ?? 'serif'],
    encodePoint(position),
    text,
  ],
  rectangle: (
    a: Point,
    b: Point,
    strokeColor: `#${string}`,
    strokeWidth: number,
    fillColor?: `#${string}`
  ): RectOperation => [
    'R',
    [encodeColor(strokeColor), strokeWidth, fillColor ? 1 : 0, fillColor ? encodeColor(fillColor) : 0],
    encodePoint(a),
    encodePoint(b),
  ],
}

export function applyOperation(ctx: CanvasRenderingContext2D, operation: Operation) {
  switch (operation[0]) {
    case 'P': {
      const [, settings, ...params] = operation

      const first = decodePoint(params[0])
      ctx.beginPath()

      ctx.moveTo(first.x, first.y)

      for (const pointData of params.slice(1)) {
        const point = decodePoint(pointData)
        ctx.lineTo(point.x, point.y)
      }

      ctx.strokeStyle = decodeColor(settings[0])
      ctx.lineWidth = settings[1]
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
      break
    }
    case 'CI': {
      const [, [strokeColor, strokeWidth, fill, fillColor], iorigin, radius] = operation
      const origin = decodePoint(iorigin)

      ctx.beginPath()
      ctx.arc(origin.x, origin.y, radius, 0, 2 * Math.PI)
      ctx.strokeStyle = decodeColor(strokeColor)
      ctx.lineWidth = strokeWidth
      ctx.stroke()

      if (fill) {
        ctx.fillStyle = decodeColor(fillColor)
        ctx.fill()
      }

      break
    }
    case 'C':
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      break
    case 'R':
      const [, [strokeColor, strokeWidth, fill, fillColor], ia, ib] = operation
      const a = decodePoint(ia)
      const b = decodePoint(ib)

      ctx.beginPath()
      ctx.rect(a.x, a.y, b.x - a.x, b.y - a.y)
      ctx.strokeStyle = decodeColor(strokeColor)
      ctx.lineWidth = strokeWidth
      ctx.stroke()

      if (fill) {
        ctx.fillStyle = decodeColor(fillColor)
        ctx.fill()
      }

      break
    case 'FF': {
      const [, position, color] = operation

      const data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)

      const ff = new FloodFill(data)
      const origin = decodePoint(position)
      ff.fill(decodeColor(color), origin.x, origin.y, 100)

      ctx.putImageData(ff.imageData, 0, 0)
      break
    }
    case 'T': {
      const [, [color, font], position, text] = operation

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      ctx.font = font
      ctx.fillStyle = decodeColor(color)
      const pos = decodePoint(position)
      ctx.fillText(text, pos.x, pos.y)

      break
    }
  }
}
