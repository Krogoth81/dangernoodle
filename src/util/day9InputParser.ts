import {Dir, Knot} from '../types'

export const parseDay9Input = (input: string, amountOfKnots = 10) => {
  const data = input.split('\n').filter((txt) => !!txt)
  let tails: Array<Knot> = Array.from({length: amountOfKnots}, () => ({x: 0, y: 0}))

  const steps: Array<Array<Knot>> = []

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  const minMaxObject = {x: 0, y: 0}
  const getMinMax = (dir: Dir, amt: number) => {
    for (let i = 0; i < amt; i++) {
      if (dir === 'D') minMaxObject.y++
      else if (dir === 'U') minMaxObject.y--
      else if (dir === 'R') minMaxObject.x++
      else minMaxObject.x--

      if (minMaxObject.x < minX) minX = minMaxObject.x
      if (minMaxObject.x > maxX) maxX = minMaxObject.x
      if (minMaxObject.y < minY) minY = minMaxObject.y
      if (minMaxObject.y > maxY) maxY = minMaxObject.y
    }
  }

  const move = (dir: Dir, amt: number) => {
    for (let i = 0; i < amt; i++) {
      const head = tails[0]
      if (dir === 'D') {
        head.y++
      } else if (dir === 'U') {
        head.y--
      } else if (dir === 'R') {
        head.x++
      } else {
        head.x--
      }
      if (head.x < minX) {
        minX = head.x
      }
      if (head.x > maxX) {
        maxX = head.x
      }
      if (head.y < minY) {
        minY = head.y
      }
      if (head.y > maxY) {
        maxY = head.y
      }

      for (let i = 1; i < tails.length; i++) {
        const parent = tails[i - 1]
        const current = tails[i]
        if (parent.y > current.y + 1) {
          current.y++
          if (parent.x > current.x) {
            current.x++
          } else if (parent.x < current.x) {
            current.x--
          }
        } else if (parent.y < current.y - 1) {
          current.y--
          if (parent.x > current.x) {
            current.x++
          } else if (parent.x < current.x) {
            current.x--
          }
        } else if (parent.x > current.x + 1) {
          current.x++
          if (parent.y > current.y) {
            current.y++
          } else if (parent.y < current.y) {
            current.y--
          }
        } else if (parent.x < current.x - 1) {
          current.x--
          if (parent.y > current.y) {
            current.y++
          } else if (parent.y < current.y) {
            current.y--
          }
        } else {
          break
        }
      }
      steps.push(JSON.parse(JSON.stringify(tails)))
    }
  }

  for (const line of data) {
    const [dir, amt] = line.split(' ')
    if (!['U', 'D', 'L', 'R'].includes(dir) || isNaN(Number(amt))) {
      return null
    }
    getMinMax(dir as Dir, Number(amt))
  }

  const xOffset = Math.abs(minX)
  const yOffset = Math.abs(minY)
  const width = xOffset + maxX
  const height = yOffset + maxY

  tails = tails.map((tail) => ({
    x: tail.x + xOffset,
    y: tail.y + yOffset,
  }))

  for (const line of data) {
    const [dir, amt] = line.split(' ')
    move(dir as Dir, Number(amt))
  }

  return {width, height, steps}
}
