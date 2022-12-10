import {
  Box,
  Button,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react'
import * as React from 'react'
import {ParsedInputData} from '../types'

interface Props {
  input: ParsedInputData
  onExit: () => void
}

export const AnimateDangerNoodle = ({input, onExit}: Props) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const requestIdRef = React.useRef<number>(0)
  const [done, setDone] = React.useState(false)
  const [fps, setFps] = React.useState(30)
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null)
  const lastRef = React.useRef(new Date().getTime())
  const tickRef = React.useRef(0)

  const restart = () => {
    tickRef.current = 0
    setDone(false)
    requestAnimationFrame(tick)
  }

  const renderFrame = () => {
    if (!ctx) {
      return
    }
    const knots = input.steps[tickRef.current]
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    imageData.data.forEach((_, i) => {
      imageData.data[i] = i % 4 === 0 ? 255 : 0
    })

    const setPixel = (x: number, y: number, col: {r: number; g: number; b: number; a?: number}) => {
      const pos = y * (ctx.canvas.width * 4) + x * 4
      imageData.data[pos] = col.r
      imageData.data[pos + 1] = col.g
      imageData.data[pos + 2] = col.b
      imageData.data[pos + 3] = col.a ?? 255
    }

    for (let i = 0; i < knots.length; i++) {
      const knot = knots[i]
      setPixel(knot.x, knot.y, {
        r: i === 0 ? 255 : 0,
        g: i === 0 ? 0 : 255,
        b: i === 0 ? 0 : 0,
      })
    }
    ctx.putImageData(imageData, 0, 0)
    if (new Date().getTime() - lastRef.current > 1000 / fps) {
      if (tickRef.current < input.steps.length) {
        tickRef.current++
        lastRef.current = new Date().getTime()
      }
    }
    if (tickRef.current >= input.steps.length) {
      setDone(true)
    }
  }

  const tick = () => {
    if (!canvasRef.current) {
      return
    }
    if (!ctx) {
      setCtx(canvasRef.current.getContext('2d'))
    }
    if (!done) {
      renderFrame()
      requestIdRef.current = requestAnimationFrame(tick)
    }
  }

  React.useEffect(() => {
    requestIdRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(requestIdRef.current)
    }
  }, [canvasRef.current, fps])

  return (
    <Box display="flex" flexDirection="column" alignItems="center" rowGap={5}>
      <Box
        background="black"
        display="flex"
        flexDirection="column"
        alignItems="center"
        width={800}
        height={800}
      >
        <canvas
          ref={canvasRef}
          width={input.width}
          height={input.height}
          style={{width: '100%', height: '100%'}}
        />
      </Box>
      <Text alignSelf="center">FPS: {fps}</Text>
      <Slider min={1} max={255} value={fps} onChange={(nr) => setFps(nr)}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Box display="flex" columnGap={10}>
        <Button colorScheme="teal" onClick={onExit}>
          Back
        </Button>
        <Button colorScheme="purple" onClick={restart}>
          Restart
        </Button>
      </Box>
    </Box>
  )
}
