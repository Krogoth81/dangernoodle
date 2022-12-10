export type Dir = 'R' | 'L' | 'U' | 'D'

export interface Knot {
  x: number
  y: number
}

export interface ParsedInputData {
  steps: Array<Array<Knot>>
  width: number
  height: number
}
