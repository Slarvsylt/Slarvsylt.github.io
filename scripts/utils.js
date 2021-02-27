
function pingServer() {
	gameInstance.SendMessage('ClientSession', 'PingServer');
}

function disconnectFromServer() {
	gameInstance.SendMessage('ClientSession', 'Disconnect');
}

function setLogLevelAll() {
	gameInstance.SendMessage('GameState', 'LogAll');
}

function setLogLevelWarning() {
	gameInstance.SendMessage('GameState', 'LogWarning');
}

function setLogLevelError() {
	gameInstance.SendMessage('GameState', 'LogError');
}

function setLogLevelNone() {
	gameInstance.SendMessage('GameState', 'DisableAll');
}

function setLogLevelOneFrame() {
	gameInstance.SendMessage('GameState', 'LogOneFrame');
}

function logMemoryStats() {
	gameInstance.SendMessage('GameState', 'LogMemoryStats');
}