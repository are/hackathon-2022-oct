export type Point = { x: number; y: number }

export function encodePoint(point: Point) {
  let x = point.x
  let y = point.y
  let result = 0

  for (let i = 0; i < 16; i++) {
    result |= (x & (1 << i)) << i
    result |= (y & (1 << i)) << (i + 1)
  }

  return result
}

export function decodePoint(value: number): Point {
  let x = 0
  let y = 0

  for (let i = 0; i < 32; i += 2) {
    x |= (value & (1 << i)) >>> (i / 2)
    y |= (value & (1 << (i + 1))) >>> (i / 2 + 1)
  }

  return { x: x, y: y }
}

export function encodeColor(color: `#${string}`) {
  return parseInt(color.substring(1), 16)
}

export function decodeColor(value: number) {
  return `#${value.toString(16).padStart(6, '0')}`
}
