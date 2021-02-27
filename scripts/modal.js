
function Modal (modalId) {
	var self = this;

	var modal = document.getElementById(modalId);
	var draggablePanel = getChildByClassName(modal, 'draggable-panel');
	var dragArea = getChildByClassName(draggablePanel, 'modal-drag-area');
	var closeButton = getChildByClassName(dragArea, 'modal-close-button');

	var x, y;
	var startX = 0, startY = 0;

	self.open = function (leftPos, topPos) {
		modal.style.display = 'block';
		draggablePanel.style.left = leftPos + 'px';
		draggablePanel.style.top = topPos + 'px';
		x = leftPos;
		y = topPos;
	}

	self.close = function () {
		modal.style.display = 'none';
	}

	self.mdd = function (event) {
	    // Prevent default dragging of selected content
	    event.preventDefault();
	    startX = event.pageX - x;
	    startY = event.pageY - y;
	    document.addEventListener('mousemove', self.mousemove);
	    document.addEventListener('mouseup', self.mouseup);
	};

	self.mousemove = function (event) {
	    y = event.pageY - startY;
	    x = event.pageX - startX;
	    draggablePanel.style.left = x + 'px';
	    draggablePanel.style.top = y + 'px';
	}

	self.mouseup = function () {
	    document.removeEventListener('mousemove', self.mousemove);
	    document.removeEventListener('mouseup', self.mouseup);
	}

	dragArea.onmousedown = self.mdd;
}

function getChildByClassName(element, name) {
	for (var i = 0; i < element.childNodes.length; i++) {
		if (element.childNodes[i].className == name) {
			return element.childNodes[i];
		}        
	}
}