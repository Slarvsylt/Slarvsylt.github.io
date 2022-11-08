/**
@author jesper
@title  Text renderer
@desc   Rendering text to the canvas
*/


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

// Globals have module scope
const pattern = 'Jesper  <3  Yoko═|+:. '

// This is the main loop.
// Character coordinates are passed in coord {x, y, index}.
// The function must return a single character or, alternatively, an object:
// {char, color, background, weight}.
export function main(coord, context, cursor, buffer) {
	const t = context.time * 0.001
	const x = coord.x
	const y = coord.y
	const o = Math.sin(y * Math.cos(t) * 0.2 + x * 0.04 + t) * 20
	const i = Math.round(Math.abs(x + y + o)) % pattern.length
	return {
		char   : pattern[i],
		fontWeight : '100', // or 'light', 'bold', '400'
	}
}
