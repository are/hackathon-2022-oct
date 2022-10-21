export function calculateOffset(event: MouseEvent, canvas: HTMLCanvasElement) {
  const { left, top } = canvas.getBoundingClientRect()
  return { x: event.clientX - left, y: event.clientY - top }
}
