import React, { ReactElement, useCallback, useRef, useState } from 'react'
import useCanvasContextRef from '../hooks/useCanvasContextRef'
import useCanvasMousedown from '../hooks/useCanvasMousedown'
import useCanvasMousemove from '../hooks/useCanvasMousemove'
import useCanvasMouseup from '../hooks/useCanvasMouseup'
import useCursor from '../hooks/useCursor'
import useHistory from '../hooks/useHistory'
import useOperation from '../hooks/useOperation'
import ScreenshotsButton from '../ScreenshotsButton'
import ScreenshotsSizeColor from '../ScreenshotsSizeColor'
import { HistoryAction } from '../types'

export interface Ellipse {
  size: number
  color: string
  x1: number
  y1: number
  x2: number
  y2: number
}

function draw (ctx: CanvasRenderingContext2D, { size, color, x1, y1, x2, y2 }: Ellipse) {
  ctx.lineCap = 'butt'
  ctx.lineJoin = 'miter'
  ctx.lineWidth = size
  ctx.strokeStyle = color

  if (x1 > x2) {
    [x1, x2] = [x2, x1]
  }
  if (y1 > y2) {
    [y1, y2] = [y2, y1]
  }

  const x = (x1 + x2) / 2
  const y = (y1 + y2) / 2
  const rx = (x2 - x1) / 2
  const ry = (y2 - y1) / 2
  const k = 0.5522848
  // 水平控制点偏移量
  const ox = rx * k
  // 垂直控制点偏移量
  const oy = ry * k
  // 从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
  ctx.beginPath()
  ctx.moveTo(x - rx, y)
  ctx.bezierCurveTo(x - rx, y - oy, x - ox, y - ry, x, y - ry)
  ctx.bezierCurveTo(x + ox, y - ry, x + rx, y - oy, x + rx, y)
  ctx.bezierCurveTo(x + rx, y + oy, x + ox, y + ry, x, y + ry)
  ctx.bezierCurveTo(x - ox, y + ry, x - rx, y + oy, x - rx, y)
  ctx.closePath()
  ctx.stroke()
}

export default function EllipseButton (): ReactElement {
  const [history, historyDispatcher] = useHistory()
  const [operation, operationDispatcher] = useOperation()
  const [, cursorDispatcher] = useCursor()
  const canvasContextRef = useCanvasContextRef()
  const [size, setSize] = useState(3)
  const [color, setColor] = useState('#ee5126')
  const ellipseRef = useRef<HistoryAction<Ellipse> | null>(null)

  const checked = operation === 'EllipseButton'

  const onClick = useCallback(() => {
    operationDispatcher.set('EllipseButton')
    cursorDispatcher.set('crosshair')
  }, [operationDispatcher, cursorDispatcher])

  const onMousedown = useCallback(
    (e: MouseEvent) => {
      if (!checked || !canvasContextRef.current || ellipseRef.current) {
        return
      }

      const { left, top } = canvasContextRef.current.canvas.getBoundingClientRect()
      const x = e.clientX - left
      const y = e.clientY - top
      ellipseRef.current = {
        data: {
          size,
          color,
          x1: x,
          y1: y,
          x2: x,
          y2: y
        },
        draw
      }
      historyDispatcher.push(ellipseRef.current)
    },
    [checked, size, color, canvasContextRef, historyDispatcher]
  )

  const onMousemove = useCallback(
    (e: MouseEvent) => {
      if (!checked || !canvasContextRef.current || !ellipseRef.current) {
        return
      }
      const { left, top } = canvasContextRef.current.canvas.getBoundingClientRect()
      const ellipseData = ellipseRef.current.data
      ellipseData.x2 = e.clientX - left
      ellipseData.y2 = e.clientY - top

      historyDispatcher.set(history)
    },
    [checked, canvasContextRef, history, historyDispatcher]
  )

  const onMouseup = useCallback(() => {
    if (!checked) {
      return
    }

    if (ellipseRef.current) {
      ellipseRef.current = null
    }
  }, [checked])

  useCanvasMousedown(onMousedown)
  useCanvasMousemove(onMousemove)
  useCanvasMouseup(onMouseup)

  return (
    <ScreenshotsButton
      title='椭圆'
      icon='icon-ellipse'
      checked={checked}
      onClick={onClick}
      option={<ScreenshotsSizeColor size={size} color={color} onSizeChange={setSize} onColorChange={setColor} />}
    />
  )
}