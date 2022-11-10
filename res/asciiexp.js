/**
@author jesper
@title  Text renderer
@desc   Rendering text to the canvas
*/

import * as v2 from '/src/modules/vec2.js'
import * as v3 from '/src/modules/vec3.js'

const pointer = {
	x        : 0,
	y        : 0,
	pressed  : false,
	px       : 0,
	py       : 0,
	ppressed : false,
}

// Pointer: store previous state
pointer.px = pointer.x
pointer.py = pointer.y
pointer.ppressed = pointer.pressed

document.body.addEventListener('pointermove', e => {
	const rect = document.body.getBoundingClientRect()
	pointer.x = e.clientX - rect.left
	pointer.y = e.clientY - rect.top
	//console.log(pointer.x + " , " + pointer.y)
	//eventQueue.push('pointerMove')
})

document.body.addEventListener('pointerdown', e => {
	pointer.pressed = true
	console.log("click!")
	//eventQueue.push('pointerDown')
})

document.body.addEventListener('pointerup', e => {
	pointer.pressed = false
	console.log("clack!")
	//eventQueue.push('pointerUp')
})

window.setInterval(() => {
   // loop()
}, 1000 / 60);

// '█8AOuoi=-;:,.'
const pattern = '█8#Ouoi=-;:,.'

// This is the main loop.
// Character coordinates are passed in coord {x, y, index}.
// The function must return a single character or, alternatively, an object:
// {char, color, background, weight}.
export function main(coord, context, cursor, buffer) {

	const res = v2.vec2(context.cols, context.rows)

	const t = context.time * 0.001
	const x = coord.x
	const y = coord.y

	const xy = 	v2.vec2(2*x,2*y)
	const l = v2.add(v2.neg(res),xy)
	const px = l.x/res.y
	const py = l.y/res.y
	const a = Math.atan(px,py)
	const r = Math.pow(Math.pow(px*px,1.5) + Math.pow(py*py,1), 1/6)
	const u = 1/r + 0.2*t
	const f = Math.cos(12*u) * Math.cos(9*a)
	var col = 0.3 + Math.sin(3.1415*f * 1.5)
	col *= r
	//const i = Math.round(col) % pattern.length
	//console.log(i)
	const o = Math.sin(y * Math.sin(t) * 0.2 + x * 0.04 + t) 
	const i = Math.round(Math.abs(col + o)) % pattern.length
	return {
		char   : pattern[i],
		color   : 'blue',
		fontWeight : 'light', // or 'light', 'bold', '400'
	}
}
