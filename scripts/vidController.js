// Your use of the YouTube API must comply with the Terms of Service:
// https://developers.google.com/youtube/terms

var vids;

var vidModal = new Modal('vidModal');

var chatPanel = document.getElementById('chatPanel');
var vidPanel = document.getElementById('vidPanel');

var vidContainer = document.getElementById('videoContainer');
var videoTable = document.getElementById('videoList');
var searchInput = document.getElementById('searchInput');

var prevVideoPageButton = document.getElementById('prevVideoPageButton');
var nextVideoPageButton = document.getElementById('nextVideoPageButton');

var queueContainer = document.getElementById('queueContainer');
var queueTable = document.getElementById('queueTable');

var nowPlayingTimeElement = document.getElementById('nowPlayingTime');

// var apiKeys = [ "AIzaSyBMRoihfh_Rok4t-JKKTgAZUhamlMnB8lE",
//                 "AIzaSyBI35tGWD8opzDyu4OrD68-_s5avRtg1yU",
//                 "AIzaSyD4e6cxbJxN7-316V41k87YPth5JtZIfo8"];

var apiKeys = [ "AIzaSyBMRoihfh_Rok4t-bucnk",
                "bunk2-_s5avRtg1yU",
                "AIzaSyBMRoihfh_Rok4t-JKKTgAZUhamlMnB8lE",
                "AIzaSyBI35tGWD8opzDyu4OrD68-_s5avRtg1yU",
                "AIzaSyD4e6cxbJxN7-316V41k87YPth5JtZIfo8",
                "AIzaSyD4e6cxbJxN7-bucnk123"];

var keyInds;
var currKeyInd;
var currQuery;
var currPageToken;
var isSearching = false;

var titleQueue = [];
var thumbnailQueue = [];
var usernameQueue = [];

var nextPageToken;
var prevPageToken;

var didStartVote = false;

prevVideoPageButton.disabled = true;
nextVideoPageButton.disabled = true;

function getTitleString(title, isLive) {
    if(isLive) {
        title = '<font color=\"red\">&#9679</font> ' + title;
    }
    return title;
}

function createVidRow(vidData, row) {
    var thumbnail = document.createElement('img');
    thumbnail.src = vidData.snippet.thumbnails.default.url;
    thumbnail.width = vidData.snippet.thumbnails.default.width;
    thumbnail.height = vidData.snippet.thumbnails.default.height;

    var isLive = (vidData.snippet.liveBroadcastContent != 'none') ? 1 : 0;

    var thumbnailCell = row.insertCell(0);
    thumbnailCell.appendChild(thumbnail);

    var title = getTitleString(vidData.snippet.title, isLive);
    var titleCell = row.insertCell(1);
    titleCell.innerHTML = title;

    row.classList.add('clickable');
    row.addEventListener('click', function() {
        gameInstance.SendMessage('Laptop', 'AddVidTitle', title);
        gameInstance.SendMessage('Laptop', 'AddVidURL', 'https://www.youtube.com/watch?v=' + vidData.id.videoId);
        gameInstance.SendMessage('Laptop', 'AddVidIsLive', isLive);
        console.log('adding vid ' + title + ' islive? ' + isLive);
        gameInstance.SendMessage('Laptop', 'AddVidThumbnail', vidData.snippet.thumbnails.default.url);
        openTab({currentTarget: document.getElementById('queueTabButton')}, 'queueTab');
    });
}

function createQueueRow(title, thumbnailURL, row, index) {
    var thumbnail = document.createElement('img');
    thumbnail.src = thumbnailURL;

    var thumbnailCell = row.insertCell(0);
    thumbnailCell.appendChild(thumbnail);

    var titleCell = row.insertCell(1);
    titleCell.innerHTML = title;

    // -1 index means we don't have permission to remove
    // so don't add x button
    if(index == -1) {
        return;
    }

    var xButton = document.createElement('button');
    xButton.onclick = function(){
        gameInstance.SendMessage('Laptop', 'RemoveVidRequest', index);
        gameInstance.SendMessage('Laptop', 'RemoveVidTitle', title);
    };
    xButton.innerHTML = 'x';
    var xCell = row.insertCell(2);
    xCell.appendChild(xButton);
}

function displayTime(time, duration) {
    var percentage;
    if(duration == 0) {
        percentage = 0;
    } else {
        percentage = time / duration;
    }

    var progressbar = '|'
    for(var i = 0; i < percentage * 10; i++) {
        progressbar += 'x';
    }
    for(var i = 0; i < 10 - percentage * 10; i++) {
        progressbar += '-';
    }
    progressbar += '|';
    nowPlayingTimeElement.innerHTML = progressbar + " elapsed: " + getTimeString(time) + " duration: " + getTimeString(duration);
}

function getTimeString(seconds) {
    var hr = Math.floor(seconds / 3600);
    var min = Math.floor((seconds - hr * 3600) / 60);
    var sec = Math.floor((seconds - hr * 3600 - min * 60));
    var hrStr = (hr < 10) ? '0' + hr : hr;
    var minStr = (min < 10) ? '0' + min : min;
    var secStr = (sec < 10) ? '0' + sec : sec;
    return hrStr + ":" + minStr + ":" + secStr;
}

// Helper function to display JavaScript value on HTML page.
function showResponse(response) {
    var oldTBody = videoTable.firstChild;
    var newTBody = document.createElement('tbody');
    videoTable.replaceChild(newTBody, oldTBody);
    vids = response;
    for(var i = 0; i < response.items.length; i++) {
        var newRow = newTBody.insertRow(-1);
        createVidRow(response.items[i], newRow);
    }

    prevPageToken = response.prevPageToken;
    nextPageToken = response.nextPageToken;

    if(nextPageToken) {
        nextVideoPageButton.disabled = false;
    } else {
        nextVideoPageButton.disabled = true;
    }
    if(prevPageToken) {
        prevVideoPageButton.disabled = false;
    } else {
        prevVideoPageButton.disabled = true;
    }

    vidContainer.scrollTop = 0;
}

function displayQueue() {
    var oldTBody = queueTable.firstChild;
    var newTBody = document.createElement('tbody');
    queueTable.replaceChild(newTBody, oldTBody);

    for(var i = 0; i < titleQueue.length; i++) {
        var newRow = newTBody.insertRow(-1);
        var index = -1;
        if(usernameQueue[i] == m_username) {
            index = i;
        }

        createQueueRow(titleQueue[i], thumbnailQueue[i], newRow, index);
    }
}

function initVidQueue(titles, thumbnails, usernames) {
    titleQueue = titles;
    thumbnailQueue = thumbnails;
    usernameQueue = usernames;
    displayQueue();
}

function setIsLocked(locked) {
    if(locked == "True") {
        console.log("locking");
        disableSkipVote();
    } else {
        console.log("unlocking");
        resetVote();
    }
}

function addToVidQueue(title, thumbnail, username) {
    if(titleQueue) {
        titleQueue.push(title);
        thumbnailQueue.push(thumbnail);
        usernameQueue.push(username);
        displayQueue();
    }
}

function popFromVidQueue() {
    if(titleQueue) {
        titleQueue.shift();
        thumbnailQueue.shift();
        usernameQueue.shift();
        displayQueue();
    }
}

function removeFromQueue(queueInd) {
    titleQueue.splice(queueInd, 1);
    thumbnailQueue.splice(queueInd, 1);
    usernameQueue.splice(queueInd, 1);
    displayQueue();
}

function updateNowPlaying(title,thumbnail,username,isLive){
    document.getElementById("nowPlayingTitle").innerHTML = getTitleString(title, isLive == "True");
    document.getElementById("nowPlayingThumbnail").src = thumbnail;
    document.getElementById("nowPlayingUsername").innerHTML= "Added by "+ username;
    resetVote();
}

function requestStartSkipVote() {
    gameInstance.SendMessage('Laptop', 'RequestStartVote');
    gameInstance.SendMessage('Laptop', 'RequestDownVote');
    didStartVote = true;
}

function requestUpVoteSkip() {
    gameInstance.SendMessage('Laptop', 'RequestUpVote');
    document.getElementById("upVoteButton").disabled = true;
    document.getElementById("downVoteButton").disabled = false;
}

function requestDownVoteSkip() {
    gameInstance.SendMessage('Laptop', 'RequestDownVote');
    document.getElementById("upVoteButton").disabled = false;
    document.getElementById("downVoteButton").disabled = true;
}

function startSkipVote(upVotes, downVotes) {
    document.getElementById("voteToSkipButton").disabled = true;
    document.getElementById("upVoteButton").disabled = false;
    document.getElementById("downVoteButton").disabled = false;
    document.getElementById("upVoteCount").innerHTML = upVotes;
    document.getElementById("downVoteCount").innerHTML = downVotes;

    // if we started the vote then we already down voted
    if (didStartVote) {
        document.getElementById("downVoteButton").disabled = true;
        didStartVote = false;
    }
}

function disableSkipVote() {
    document.getElementById("voteToSkipButton").disabled = true;
    document.getElementById("upVoteButton").disabled = true;
    document.getElementById("downVoteButton").disabled = true;
}

function upVoteSkip(switchedVote) {
    var upVoteCount = document.getElementById("upVoteCount");
    var count = parseInt(upVoteCount.innerHTML);
    upVoteCount.innerHTML = ++count;

    if(switchedVote == "True") {
        var downVoteCount = document.getElementById("downVoteCount");
        count = parseInt(downVoteCount.innerHTML);
        downVoteCount.innerHTML = --count;
    }
}

function downVoteSkip(switchedVote) {
    var downVoteCount = document.getElementById("downVoteCount");
    var count = parseInt(downVoteCount.innerHTML);
    downVoteCount.innerHTML = ++count;

    if(switchedVote == "True") {
        var upVoteCount = document.getElementById("upVoteCount");
        count = parseInt(upVoteCount.innerHTML);
        upVoteCount.innerHTML = --count;
    }
}

function resetVote() {
    document.getElementById("voteToSkipButton").disabled = false;
    document.getElementById("upVoteButton").disabled = true;
    document.getElementById("downVoteButton").disabled = true;
    document.getElementById("upVoteCount").innerHTML = '0';
    document.getElementById("downVoteCount").innerHTML = '0';
}

// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

// Called automatically when YouTube API interface is loaded (see line 9).
function onYouTubeApiLoad() {
    // This API key is intended for use only in this lesson.
    // See http://goo.gl/PdPA1 to get a key for your own applications.
    // gapi.client.setApiKey('AIzaSyCR5In4DZaTP6IEZQ0r1JceuvluJRzQNLE');
}

function onSubmitSearch() {
    if(isSearching) {
        console.log("already searching...");
        return;
    }

    isSearching = true;
    search(searchInput.value);
}

function search(query, pageToken) {
    if(!keyInds) {
        keyInds = [];
        console.log("Initializing keyinds");
        for(var i = 0; i < apiKeys.length; i++) {
            keyInds.push(i);
        }

        currKeyInd = keyInds[Math.floor(Math.random() * keyInds.length)];
        gapi.client.setApiKey(apiKeys[currKeyInd]);
    }

    currQuery = query;
    currPageToken = pageToken;
    // Use the JavaScript client library to create a search.list() API call.
    var request = gapi.client.youtube.search.list({
        part: ['snippet','fileDetails'],
        type: 'video',
        q: query,
        maxResults: 25,
        pageToken: pageToken
        
    });
    
    // Send the request to the API server,
    // and invoke onSearchRepsonse() with the response.
    request.execute(onSearchResponse);
}

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
    if(response.error) {
        console.log("got error: " + response.error);
        var index = keyInds.indexOf(currKeyInd);
        if (index > -1) {
          keyInds.splice(index, 1);
        } else {
            console.log("could not find index of " + currKeyInd);
            return;
        }
        if(keyInds.length > 0) {
            var ind = Math.floor(Math.random() * keyInds.length);
            currKeyInd = keyInds[ind];
            gapi.client.setApiKey(apiKeys[currKeyInd]);
            console.log("trying key: " + apiKeys[currKeyInd]);
            search(currQuery, currPageToken);
            return;
        }
        else {
            console.log("out of keys!!");
            return;
        }
    }

    isSearching = false;
    showResponse(response);
}

function nextPage() {
    if(isSearching) {
        console.log("already searching...");
        return;
    }

    isSearching = true;
    search(currQuery, nextPageToken);
}

function prevPage() {
    if(isSearching) {
        console.log("already searching...");
        return;
    }

    isSearching = true;
    search(currQuery, prevPageToken);
}

function showChatPanel() {
    chatPanel.style.display = 'inline-block';
    vidPanel.style.display = 'none';
}

function showVidPanel() {
    chatPanel.style.display = 'none';
    vidPanel.style.display = 'inline-block';
}

function openVideoUI() {
    displayQueue();
    openTab({currentTarget: document.getElementById('nowPlayingTabButton')}, 'nowPlayingTab');
    vidModal.open(100,200);
}

function closeVideoUI() {
    vidModal.close();
    chatInput.focus();
    gameInstance.SendMessage('DressUpCanvas', 'ClearHTMLFrame', 'VideoUI');
}

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function showNothingPlaying() {
    document.getElementById("nowPlayingTitle").innerHTML="Nothing playing";
    document.getElementById("nowPlayingThumbnail").src = "TemplateData/wiztvLogo.png";
    document.getElementById("nowPlayingUsername").innerHTML= "";
    document.getElementById("voteToSkipButton").disabled = true;
    displayTime(0,0);
}

showNothingPlaying();


