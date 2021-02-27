
var faviconBlueHREF = "TemplateData/favicon.ico";
var faviconRedHREF = "TemplateData/faviconRed.ico";

var chatInput = document.getElementById('chatInput');
var chatBox = document.getElementById("chatBox");
var cliBox = document.getElementById("cliBox");
var chatPanel = document.getElementById('chatPanel');
var gameContainer = document.getElementById("gameContainer");
var favicon = document.getElementById('favicon');

var chatButton = document.getElementById('chatButton');
var playerButton = document.getElementById('playerButton');
var chatTab = document.getElementById('chatTab');
var playerTab = document.getElementById('playerTab');

var urlRegexString = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s\n]{2,}|www\.[^\s]+\.[^\s]{2,})/g;
var urlRegex = new RegExp(urlRegexString);
var newLineRegexString = '\n';
var newLineRegex = new RegExp(newLineRegexString, 'g');

var gameCanvas;

var wasdEnabled = false;

var kbDisabled;

var globalChat = "";
var chatZones;
var currentZoneInd;
var isInLocalChat;

var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

var tagOrComment = new RegExp(
    '<(?:'
    // Comment body.
    + '!--(?:(?:-*[^->])*--+|-?)'
    // Special "raw text" elements whose content should be elided.
    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
    // Regular name
    + '|/?[a-z]'
    + tagBody
    + ')>',
    'gi');

function removeTags(html) {
  var oldHtml;
  do {
    oldHtml = html;
    html = html.replace(tagOrComment, '');
  } while (html !== oldHtml);
  return html.replace(/</g, '&lt;');
}

var windowIsActive = true;
window.onfocus = function () { 
	windowIsActive = true; 
	stopFlashFavicon();
}; 

window.onblur = function () { 
	windowIsActive = false;
}; 

var m_username;

function onSubmit(msg) {
	if(!kbDisabled) {
		return;
	}

	gameInstance.SendMessage('ChatClient', 'SubmitMessage', msg);
}

function initChatZones(numZones) {
	chatZones = [];
	for(var i = 0; i < numZones; i++) {
		chatZones.push("");
	}
}

function setChatZone(zoneInd) {
	currentZoneInd = zoneInd;

	if(isInLocalChat) {
		chatBox.innerHTML = chatZones[zoneInd];
		scrollToBottom();
	}
}

function showGlobalChat() {
	isInLocalChat = false;
	chatBox.innerHTML = globalChat;
	scrollToBottom();
}

function showLocalChat() {
	isInLocalChat = true;
	chatBox.innerHTML = chatZones[currentZoneInd];
	scrollToBottom();
}

function login(username, password) {
	gameInstance.SendMessage('ClientSession', 'RequestLogin', username + " " + password);
}

function enableUnityKeyboardInput() {
	kbDisabled = false;
	gameContainer.focus();
}

function disableUnityKeyboardInput() {
	kbDisabled = true;
	chatInput.focus();
}

function createUser(username, password) {
	gameInstance.SendMessage('ClientSession', 'RequestCreateUser', username + " " + password);
}

function sendChatMsg(msg) {
	gameInstance.SendMessage('ChatClient', 'SendChatMessage', msg);
}

function openCLI() {
	cliBox.style.display = 'block';
	chatBox.style.display = 'none';
}

function closeCLI() {
	cliBox.style.display = 'none';
	cliBox.innerHTML = "";
	chatBox.style.display = 'block';
}

function recieveChatMsg(username, playerColor, msg, color, atPlayer, zoneInd, isNPC) {
	msg = removeTags(msg);
	username = removeTags(username);
	
	var newChatLine = "";

	// global message tag
	if(zoneInd == -1) {
		newChatLine += "<font color=\"grey\">[global]</font> ";
	}

	if(isNPC) {
		newChatLine += getNPCNameString(username, playerColor) + " ";
	} else if(username) {
		//username:
		newChatLine += getNameString(username, true) + " ";
	}

	//@username
	if(atPlayer) {
		if(!windowIsActive) {
			flashFavicon();
		} else {
			flashFaviconOnce();
		}
	}

	//url regex
	var urlMatches = msg.match(urlRegex);
	if(urlMatches) {
		for(var i = 0; i < urlMatches.length; i++) {
			var url = urlMatches[i];
			if(url.indexOf("http://") < 0 && url.indexOf("https://") < 0) {
				url = "http://" + url;
			}
			var matchInd = msg.indexOf(urlMatches[i]);
			var hyperlinkOpen = "<a href=\"" + url + "\" target=\"_blank\">";
			var hyperlinkClose = "</a>";

			msg = msg.substr(0, matchInd) + hyperlinkOpen 
			+ msg.substr(matchInd, urlMatches[i].length) + hyperlinkClose 
			+ msg.substr(matchInd + urlMatches[i].length);
		}
	}

	//new lines
	msg = msg.replace(newLineRegex, '</br>');

	//msg color
	newChatLine += "<font color=\"" + color + "\">"+msg+"</font></br>";


	globalChat += newChatLine;
	// global chat message (or all chats)
	if(zoneInd < 0) {
		for(var i = 0; i < chatZones.length; i++) {
			chatZones[i] += newChatLine;
		}
		//updateChatBox(newChatLine);
	// all chats
	} else {
		chatZones[zoneInd] += newChatLine;
		// if(zoneInd == currentZoneInd) {
		// 	updateChatBox(newChatLine);
		// }
	}

	if(!isInLocalChat || (isInLocalChat && zoneInd == currentZoneInd) || zoneInd < 0) {
		updateChatBox(newChatLine);
	}
	
}

function updateChatBox(newChatLine) {
	var wasAtBottom = isAtBottom(chatBox);
	chatBox.innerHTML += newChatLine;
	
	if(wasAtBottom) {
		scrollToBottom();
	}
}

function writeToCLI(msg, color) {
	msg = removeTags(msg);
	
	var newChatLine = "";

	//new lines
	msg = msg.replace(newLineRegex, '</br>');

	//msg color
	newChatLine += "<font color=\"" + color + "\">"+msg+"</font>";

	cliBox.innerHTML += newChatLine;
	cliBox.scrollTop = cliBox.scrollHeight;
}

function isAtBottom(box) {
	// subtract 200 so you don't have to be exactly at the bottom to scroll down
	return box.scrollTop + box.parentNode.clientHeight >= box.scrollHeight - 200;
}

function scrollToBottom() {
	chatBox.scrollTop = chatBox.scrollHeight;
}

var isFaviconRed = false;
var faviconFlashInterval;
function flashFavicon() {
	switchFavicon();
	faviconFlashInterval = setInterval(switchFavicon, 1000);
}

function flashFaviconOnce() {
	switchFavicon();
	setTimeout(switchFavicon, 1000);
}

function switchFavicon() {
	if(isFaviconRed) {
		isFaviconRed = false;
		favicon.href = faviconBlueHREF;
	} else {
		isFaviconRed = true;
		favicon.href = faviconRedHREF;
	}
}

function stopFlashFavicon() {
	if(faviconFlashInterval) {
		clearInterval(faviconFlashInterval);
	}
	isFaviconRed = false;
	favicon.href = faviconBlueHREF;
}

function setUsername(username) {	
	m_username = username;
}

var pointerLocked = false;

function enableWASD() {
	wasdEnabled = true;
	chatInput.onkeydown = submitChat;
	//gameContainer.onkeydown = tabFromGamePanel;
	gameContainer.onclick = (pointerLocked) ? tryLockPointer : null;
	gameContainer.onkeydown = camControlDown;
	gameContainer.onkeyup = camControlUp;
	document.onkeydown = null;
	document.onkeyup = null;

	gameInstance.SendMessage('GameCamera', 'RotateAllStop');
}

function disableWASD() {
	wasdEnabled = false;
	gameContainer.onclick = focusChatCallback;
	document.onkeydown = camControlDown;
	document.onkeyup = camControlUp;
	gameContainer.onkeydown = null;
	gameContainer.onkeyup = null;

	gameInstance.SendMessage('GameCamera', 'RotateAllStop');
}

function enablePointerLock() {
	pointerLocked = true;
	gameContainer.focus();
	gameContainer.onclick = tryLockPointer;
	tryLockPointer();
}

function disablePointerLock() {
	pointerLocked = false;
	gameContainer.onclick = (wasdEnabled) ? null : focusChatCallback;
	document.exitPointerLock = document.exitPointerLock    ||
                           document.mozExitPointerLock;

	// Attempt to unlock
	document.exitPointerLock();
}

function tryLockPointer() {
	if(!gameCanvas) {
		gameCanvas = document.getElementById("#canvas");
	}
	gameCanvas.requestPointerLock = gameCanvas.requestPointerLock ||
                            gameCanvas.mozRequestPointerLock;
	gameCanvas.requestPointerLock();
}

function registerKBListeners() {
	disableWASD();
}

function onChatButtonClick() {
	chatButton.disabled = true;
	playerButton.disabled = false;

	chatPanel.style.backgroundImage = "url('TemplateData/chatTextures/chatBorder.png')";

	chatTab.style.display = 'inline-block';
	playerTab.style.display = 'none';
	scrollToBottom();
	chatInput.focus();
}

function onPlayerButtonClick() {
	playerButton.disabled = true;
	chatButton.disabled = false;

	chatPanel.style.backgroundImage = "url('TemplateData/chatTextures/playersBorder.png')";
	
	chatTab.style.display = 'none';
	playerTab.style.display = 'inline-block';
	chatInput.focus();
}

var focusChatCallback = function() {
	chatInput.focus();
};

var tabFromGamePanel = function(event) {
	//tab
	if (event.which == 9) {
		chatInput.focus();
	}
};

var submitChat = function(event) {
	if (event.which == 13 && document.activeElement === chatInput) { 
		onSubmit(chatInput.value); 
		chatInput.value = "";
		return false; 
	}
};

var camControlDown = function(event) {
//enter
	if (event.which == 13 && document.activeElement === chatInput) { 
		onSubmit(chatInput.value); 
		chatInput.value = "";
		return false; 
	} else if(event.which == 9 && wasdEnabled) {
		gameContainer.focus();
		//if we are holding meta key, don't allow event
	} else if(!event.metaKey) {
    	//left
    	if (event.which == 37 || (wasdEnabled && event.which == 65)) {
    		gameInstance.SendMessage('GameCamera', 'RotateLeftStart');
    		return false; 
    	//right
    	} else if (event.which == 39 || (wasdEnabled && event.which == 68)) {
    		gameInstance.SendMessage('GameCamera', 'RotateRightStart');
    		return false; 
    	//up
    	} else if (event.which == 38 || (wasdEnabled && event.which == 87)) {
    		gameInstance.SendMessage('GameCamera', 'RotateUpStart');
    		return false; 
    	//down
    	} else if (event.which == 40 || (wasdEnabled && event.which == 83)) {
    		gameInstance.SendMessage('GameCamera', 'RotateDownStart');
    		return false; 
    	}
    } else if(event.which == 91) {
    	//if we are pressing the meta key, cancel all rotations because we will lose a key up event
    	gameInstance.SendMessage('GameCamera', 'RotateAllStop');
    }
};

var camControlUp = function(event) {
	//left
	 if (event.which == 37 || (wasdEnabled && event.which == 65)) {
	 	gameInstance.SendMessage('GameCamera', 'RotateLeftStop');
	 	return false; 
	//right
	} else if (event.which == 39 || (wasdEnabled && event.which == 68)) {
		gameInstance.SendMessage('GameCamera', 'RotateRightStop');
		return false; 
	//up
	} else if (event.which == 38 || (wasdEnabled && event.which == 87)) {
		gameInstance.SendMessage('GameCamera', 'RotateUpStop');
		return false; 
	//down
	} else if (event.which == 40 || (wasdEnabled && event.which == 83)) {
		gameInstance.SendMessage('GameCamera', 'RotateDownStop');
		return false; 
	} 
};



//start off showing chat tab
onChatButtonClick();

/*function hackWebGLKeyboard ()
 {
     var webGLInput = chatInput;
     for (var i in JSEvents.eventHandlers)
     {
         var event = JSEvents.eventHandlers[i];
         if (event.eventTypeString == 'keydown' || event.eventTypeString == 'keypress' || event.eventTypeString == 'keyup')
         {
             webGLInput.addEventListener(event.eventTypeString, event.eventListenerFunc, event.useCapture);
             window.removeEventListener(event.eventTypeString, event.eventListenerFunc, event.useCapture);
         }
     }

     var event = new MouseEvent('click', {
    'view': window,
    'bubbles': true,
    'cancelable': true
  });
  var cb = document.querySelector('input[type=submit][name=btnK]'); 
  var canceled = !cb.dispatchEvent(event);
 }*/

 /*chatInput.onkeypress = function forwardKey (e) {
 	var evt = document.createEvent("KeyboardEvent");
  evt.initKeyboardEvent("keypress", true, true, window,
                    0, 0, 0, 0,
                    0, e.keyCode);
  var canceled = !gameCanvas.dispatchEvent(evt);
 	//chatInput.dispatchEvent(e);
 	//return true;
 }*/