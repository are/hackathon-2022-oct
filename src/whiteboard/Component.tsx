import { Operation } from './canvas/operations'
import { Point } from './canvas/serdes'
import { WhiteboardContext } from './context'

export type ComponentEvents = 'MouseMove' | 'MouseUp' | 'MouseDown' | 'MouseEnter' | 'MouseLeave'

export type Component = {
  name: string

  onInit?(context: Pick<WhiteboardContext, 'properties' | 'setProperty'>): void

  onDraw?(delta: number, context: WhiteboardContext): void
  onCommit?(operation: Operation): void

  onMouseMove?(point: Point, context: WhiteboardContext): void
  onMouseUp?(point: Point, context: WhiteboardContext): void
  onMouseDown?(point: Point, context: WhiteboardContext): void
  onMouseEnter?(point: Point, context: WhiteboardContext): void
  onMouseLeave?(point: Point, context: WhiteboardContext): void
}
