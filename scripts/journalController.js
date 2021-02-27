
function JournalController() {
	var self = this;

	var journalModal = new Modal('journalModal');
	var journalEntryPanel = document.getElementById('journalEntryPanel');
	var journalWritingPanel = document.getElementById('journalWritingPanel');
	var journalInput = document.getElementById('journalInput');
	var submitButton = document.getElementById('journalSubmitButton');

	var nextPageButton = document.getElementById('nextJournalPageButton');
	var prevPageButton = document.getElementById('prevJournalPageButton');

	var pages = {};
	var currentPage;
	var numEntries;

	self.open = function(num) {
		numEntries = num;
		currentPage = num-1;
		showEntryPage();
		openPage(currentPage);
		prevPageButton.disabled = currentPage <= 0;
		nextPageButton.disabled = false;

	    journalModal.open(300,200);
	}

	self.close = function() {
		journalModal.close();
    	chatInput.focus();
	}
	

	self.loadEntryCallback = function (ind, date, username, text) {
		pages[ind] = {date: date, username: username, text: text};
		if(ind == currentPage) {
			renderPage(ind);
		}
		//renderPage(pages.length-1);
	}

	self.nextPage = function() {
		if(currentPage < numEntries) {
			currentPage++;

			// go to writing page
			if(currentPage == numEntries) {
				nextPageButton.disabled = true;
				showWritingPage();
			} else {
				openPage(currentPage);
			}

			prevPageButton.disabled = false;
		}
	}

	self.prevPage = function() {
		if(currentPage > 0) {
			// we were on the writing page
			if(currentPage == numEntries) {
				showEntryPage();
			}

			currentPage--;
			openPage(currentPage);

			if(currentPage == 0) {
				prevPageButton.disabled = true;
			}
			nextPageButton.disabled = false;
		}
	}

	self.submit = function () {
		gameInstance.SendMessage('Journal', 'SubmitEntry', journalInput.value);
		journalInput.value = "";
	}

	function openPage(ind) {
		if(pages[ind] == undefined) {
			gameInstance.SendMessage('Journal', 'LoadEntry', ind);
		} else {
			renderPage(ind);
		}
	}

	function showEntryPage() {
		journalWritingPanel.style.display = 'none';
		journalEntryPanel.style.display = 'block';
		submitButton.style.display = 'none';
	}

	function showWritingPage() {
		journalWritingPanel.style.display = 'block';
		journalEntryPanel.style.display = 'none';
		submitButton.style.display = 'block';
	}

	function renderPage(ind) {
		var page = pages[ind];
		var txt = page.date + "\n" + page.text + "\n\n" + page.username;

		txt = removeTags(txt);
		txt = txt.replace(newLineRegex, '</br>');

		journalEntryPanel.innerHTML = txt;
	}
}

var journalController = new JournalController();

function openJournalUI(numEntries) {
	journalController.open(numEntries);
}

function closeJournalUI() {
   journalController.close();
}

function loadEntryCallback(ind, date, username, text) {
	journalController.loadEntryCallback(ind, date, username, text);
}

//loadEntryCallback("020293", "manny", "ok here it is");
//openJournalUI(1);