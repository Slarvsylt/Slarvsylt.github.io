
var playerTableBody = document.getElementById('playerTableBody');

var usernameList = [];
var roleList = [];
var donatorList = [];

var modSymbol = "<font color=\"white\">&#x2655</font> ";
var donatorSymbol = "<font color=\"yellow\">&#x263E;</font> ";

function addPlayerToList(username, roleString, donatorLevel) {
	var role = (roleString == "True") ? true : false;
	usernameList.push(username);
	roleList.push(role);
	donatorList.push(donatorLevel);

	createPlayerRow(username, role, donatorLevel, playerTableBody);
}

function removePlayerFromList(username) {
	var index = usernameList.indexOf(username);
	if (index > -1) {
    	usernameList.splice(index, 1);
    	roleList.splice(index, 1);
    	donatorList.splice(index, 1);

    	playerTableBody.removeChild(playerTableBody.childNodes[index]);  
	}
}

function clearPlayerList() {
	usernameList = [];
	roleList = [];
	donatorList = [];
	resetPlayerListView();
}

function resetPlayerListView() {
	var oldTBody = playerTableBody;
    var newTBody = document.createElement('tbody');
    oldTBody.parentElement.replaceChild(newTBody, oldTBody);
    playerTableBody = newTBody;

	for(var i = 0; i < usernameList.length; i++) {
		createPlayerRow(usernameList[i], roleList[i], donatorList[i], newTBody);
	}
}

function getNameString(username, withColon) {
	var ind = usernameList.indexOf(username);
	var role = roleList[ind];
	var donatorLevel = donatorList[ind];

	var nameString;
	if(donatorLevel == 0) {
		nameString = username;
	} else if (donatorLevel > 0) {
		nameString = donatorSymbol + username;
	} 
	// else if(donatorLevel == 2) {
	// 	nameString = "<font color=\"green\">✰</font>" + username;
	// } else if(donatorLevel == 3) {
	// 	nameString = "<font color=\"yellow\">✰</font>" + username;
	// }

	if(withColon) {
		nameString += ":";
	}

	var nameColor;
	if(role) {
		nameString = modSymbol + nameString;
		nameColor = "yellow";
		
	} else {
		nameColor = "aqua";
	}

	return "<font color=\"" + nameColor + "\">" + nameString + "</font>";
}

function getNPCNameString(name, color) {
	return "<font color=\"" + color + "\">" + name + ":</font>"; 
}

function createPlayerRow(username, role, donatorLevel, tbody) {
	var tr = document.createElement("tr");
	var nameCol = document.createElement("td");

	var nameString = getNameString(username);
	nameCol.innerHTML += nameString;
	//var nameNode = document.createTextNode(nameString);

	nameCol.classList.add('pointerhover');
    nameCol.addEventListener('click', function() {
    	chatInput.value += "@" + username;
    	onChatButtonClick();
    });

	//nameCol.appendChild(nameNode);
	tr.appendChild(nameCol);

	tbody.appendChild(tr);

	// cant mute a mod
	if(role) {
		return;
	}

	var muteCol = document.createElement("td");
	var muteNode = document.createTextNode("mute");
	muteCol.style.textAlign = "right";
	muteCol.appendChild(muteNode);

	var unmuteCol = document.createElement("td");
	var unmuteNode = document.createTextNode("unmute");
	unmuteCol.style.textAlign = "right";
	unmuteCol.appendChild(unmuteNode);
	unmuteCol.style.display = "none";

	
	muteCol.classList.add('pointerhover');
    muteCol.addEventListener('click', function() {
    	unmuteCol.style.display = "table-cell";
    	muteCol.style.display = "none";
    	chatInput.focus();

    	gameInstance.SendMessage('ChatClient', 'CallMutePlayer', username);
    });
    
	unmuteCol.classList.add('pointerhover');
    unmuteCol.addEventListener('click', function() {
    	unmuteCol.style.display = "none";
    	muteCol.style.display = "table-cell";
    	chatInput.focus();

    	gameInstance.SendMessage('ChatClient', 'CallUnmutePlayer', username);
    });

    tr.appendChild(muteCol);
    tr.appendChild(unmuteCol);
	
}

