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
	loop()
	//console.log(pointer.x)
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

loop()

function main(coord, cursor) {
	// The cursor coordinates are mapped to the cell
	// (fractional, needs rounding).
	const x = Math.floor(cursor.x) // column of the cell hovered
	const y = Math.floor(cursor.y) // row of the cell hovered

	//console.log("coord " + coord.x)
	//console.log("coord " + coord.y)
	//console.log("x " + x)
	//console.log("y " + y)

	if (coord.x == x && coord.y == y) return '┼'
	if (coord.x == x) return '│'
	if (coord.y == y) return '─'
	return (coord.x + coord.y) % 2 ? 'A' : ' '
}

function loop(){
	// Cursor update
	console.log("loop!")
	const cursor = {
		// The canvas might be slightly larger than the number
		// of cols/rows, min is required!
		x       : pointer.x / 2,
		y       : pointer.y / document.body.style.lineHeight,
		pressed : pointer.pressed,
		p : { // state of previous frame
		x       : pointer.px / 2,
		y       : pointer.py / document.body.style.lineHeight,
		pressed : pointer.ppressed,
		}
	}
	//console.log("x " + cursor.x)
	//console.log("y " + cursor.y)
	//console.log("document.body.x " + document.body.style.cellWidth)
	//console.log("document.body.y " + document.body.style.lineHeight)
	const parent = document.getElementById("cont")
	while (parent.firstChild) {
		parent.firstChild.remove()
	}
	for(let i = 0; i <30; i++){
		const offs = i * 100
		const span = document.createElement('span')
		span.style.display = 'block'
		for(let j = 0; j < 100; j++){
			const idx = j + offs
			const out = main({x:j, y:i, index:idx}, cursor)
			span.textContent += out
			//console.log(out)
		}
		parent.appendChild(span)
	}

}
