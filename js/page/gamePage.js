/**

RoPro (https://ropro.io) v1.1

RoPro was wholly designed and coded by:
                               
,------.  ,--. ,-----.,------. 
|  .-.  \ |  |'  .--./|  .---' 
|  |  \  :|  ||  |    |  `--,  
|  '--'  /|  |'  '--'\|  `---. 
`-------' `--' `-----'`------' 
                            
Contact me with inquiries (job offers welcome) at:

Discord - Dice#1000
Email - dice@ropro.io
Phone - ‪(650) 318-1631‬

Write RoPro:

Dice Systems LLC
1629 K. Street N.W.
Suite 300
Washington, DC
20006-1631

RoPro Terms of Service:
https://ropro.io/terms

RoPro Privacy Policy:
https://ropro.io/privacy-policy

© 2020 Dice Systems LLC
**/


searchBarHTML = `<div id="searchServerMain" style="margin-top:5px;margin-bottom:25px;height:45px;position:relative;">
					<div style="float:left;width:400px;margin-left:5px;margin-bottom:10px;" class="input-group">
					<form><input autofocus="" id="searchServer" class="form-control input-field" type="text" placeholder="Enter Exact Username..." maxlength="120" autocomplete="off" value="">
					<div style="font-size:12px;color:red;" id="serverSearchError"></div>
					<div style="font-size:12px;color:green;" id="serverSearchSuccess"></div>
					</form>
					<div class="input-group-btn"><button style="margin:0px;margin-left:2px;" class="input-addon-btn" type="submit">
					<span class="icon-nav-search"></span>
					</button></div></div>
					<span id="searchServerButton" style="padding:10px;margin-bottom:10px;float-left;" class="btn-secondary-md btn-more rbx-private-server-create-button">Search</span>
					</div>`

var pageIndex = 0;
var customServerList = null;
var globalGameId = 0;
var hasFastServers = false;

function fetchMaxPlayerIndex(gameID, maxPlayers) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetMaxPlayerIndex", gameID: gameID, count: maxPlayers}, 
			function(data) {
				resolve(data)
		})
	})
}

function fetchLowPingServers(gameID, startIndex, maxServers) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetLowPingServers", gameID: gameID, startIndex: startIndex, maxServers: maxServers}, 
			function(data) {
				resolve(data)
		})
	})
}

function fetchServerSearch(username, gameID) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetUserServer", username: username, gameID: gameID}, 
			function(data) {
				resolve(data)
		})
	})
}

function fetchServerPage(gameID, index) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://www.roblox.com/games/getgameinstancesjson?placeId=" + gameID + "&startIndex=" + index},
			function(data) {
				resolve(data)
		})
	})
}

function fetchSocialLinks(universeId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://games.roblox.com/v1/games/"+universeId+"/social-links/list"}, 
			function(data) {
				resolve(data)
		})
	})
}

function fetchDiscordID(discordUrl) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/getDiscordID.php?link=" + discordUrl}, 
			function(data) {
				resolve(data)
		})
	})
}


function fetchGameInfo(universeId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://games.roblox.com/v1/games?universeIds=" + universeId}, 
			function(data) {
				resolve(data)
		})
	})
}

function fetchVotes(universeId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://games.roblox.com/v1/games/votes?universeIds=" + universeId}, 
			function(data) {
				resolve(data)
		})
	})
}

function fetchFavorites(universeId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://games.roblox.com/v1/games/" + universeId + "/favorites/count"}, 
			function(data) {
				resolve(data)
		})
	})
}

function fetchSetting(setting) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetSetting", setting: setting}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function addCommas(nStr){
	nStr += '';
	var x = nStr.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

async function loadServerPage(gameID, index){
	if (customServerList == null) {
		serverPage = await fetchServerPage(gameID, index)
	} else {
		if (index < customServerList.length) {
			serverPage = {"Collection": customServerList.slice(index, Math.min(index + 10, customServerList.length))}
		} else {
			serverPage = {"Collection": []}
		}
	}
	serversHTML = ""
	for (i = 0; i < serverPage.Collection.length; i++) {
		server = serverPage.Collection[i]
		gameId = server.Guid
		placeId = server.PlaceId
		playerCount = server.CurrentPlayers.length + " out of " + server.Capacity + " max"
		playersHTML = ""
		additionalInfoDiv = ""
		if (customServerList != null) {
			additionalInfoDiv = `<div class="text-info rbx-game-status rbx-game-server-status" style="margin-top:5px;font-size:13px;">Server Ping: ${server.Ping} ms</div>`
		}
		for (j = 0; j < server.CurrentPlayers.length; j++) {
			player = server.CurrentPlayers[j]
			thumbnail = player.Thumbnail.Url
			playerHTML = `<span class="special-span avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img class="avatar-card-image" src="${thumbnail}"></a></span>`
			playersHTML += playerHTML
		}
		serversHTML += `<li class="stack-row rbx-game-server-item"><div class="section-header">
						<div class="link-menu rbx-game-server-menu"></div></div>
						<div class="section-left rbx-game-server-details">
							<div class="text-info rbx-game-status rbx-game-server-status">${playerCount}</div>
							${additionalInfoDiv}
							<div class="rbx-game-server-alert hidden"><span class="icon-remove"></span></div>
							<a class="btn-full-width btn-control-xs rbx-game-server-join" href="#" data-placeid="2202352383" onclick='Roblox.GameLauncher.joinGameInstance(${placeId}, "${gameId}")'>Join</a></div>
						<div class="section-right rbx-game-server-players">${playersHTML}</div></li>`
	}
	pageIndex = index
	document.getElementById('maxPlayersLoadingBar').style.display = "none"
	$('#rbx-game-server-item-container').html(serversHTML)
	$('.rbx-running-games-footer').html(`<button type="button" id="loadMoreButton" class="btn-control-sm btn-full-width rbx-running-games-load-more">Load More</button>`)
	$('#loadMoreButton').click(function(){
		loadServerPage(gameID, pageIndex+10)
	})
}

function createServerElement(server) {
	gameId = server.Guid
	placeId = server.PlaceId
	playerCount = server.CurrentPlayers.length + " out of " + server.Capacity + " max"
	li = document.createElement("li")
	li.setAttribute("id", "serverSearchResult")
	li.setAttribute("class", "stack-row rbx-game-server-item")
	li.setAttribute("style", "margin-bottom:30px;")
	li.setAttribute("data-gameid",gameId.toString())
	playersHTML = ""
	for (i = 0; i < server.CurrentPlayers.length; i++) {
		player = server.CurrentPlayers[i]
		thumbnail = player.Thumbnail.Url
		if (thumbnail == server.thumbnailToFind) {
			specialStyleSpan = "z-index:100000;"
			specialStyleImg = "transform:scale(1.5);"
			specialId = 'id="myGlower"'
		} else {
			specialStyleImg = ""
			specialStyleSpan = ""
			specialId = ''
		}
		playerHTML = `<span style="${specialStyleSpan}" class="special-span avatar avatar-headshot-sm player-avatar"><a class="avatar-card-link"><img ${specialId} style="${specialStyleImg}" class="avatar-card-image" src="${thumbnail}"></a></span>`
		playersHTML += playerHTML
	}
	serverHTML = `<div class="section-header">
					<div class="link-menu rbx-game-server-menu"></div></div>
					<div class="section-left rbx-game-server-details">
						<div class="text-info rbx-game-status rbx-game-server-status">${playerCount}</div>
						<div class="rbx-game-server-alert hidden"><span class="icon-remove"></span></div>
						<a class="btn-full-width btn-control-xs rbx-game-server-join" href="#" data-placeid="2202352383" onclick='Roblox.GameLauncher.joinGameInstance(${placeId}, "${gameId}")'>Join</a></div>
					<div class="section-right rbx-game-server-players">${playersHTML}</div>`
	li.innerHTML = serverHTML
	document.getElementById('rbx-game-server-item-container').insertBefore(li, document.getElementById('rbx-game-server-item-container').childNodes[0])
	$(function() {
		var glower = $('#myGlower');
		setInterval(function() {  
			glower.toggleClass('active');
		}, 1000);
	})
}

function createMaxPlayers(maxPlayers) {
	dropdown = ""
	for (i = maxPlayers; i > 0; i--) {
		if (i == 1) {
			playerString = "Player"
		} else {
			playerString = "Players"
		}
		dropdown += `<li class="dropdown-custom-item" id="${i}"> <a style="font-size:13px;">${i} ${playerString}</a></li>`
	}
	fastServersButton = `<button style="height:38px;display:inline-block;margin-left:-160px;" type="button" id="fastServersButton" class="input-dropdown-btn category-options ng-scope"> 
			<span style="font-size:13px;" class="text-overflow rbx-selection-label ng-binding dropdown-button-text"> <a style="font-size:13px;">Fastest Servers</a></span>
			<span style="margin-right:-10px;margin-top:-1px;transform:scale(0.8);" class="icon-nav-my-feed"></span></button>`
	hasFastServers = true
	if (hasFastServers) {
		loadMargin = "310px"
	} else {
		loadMargin = "160px"
	}
	div = document.createElement("div")
	maxPlayersHTML = `<div style="float:right;width:150px;margin-top:-40px;" class="input-group-btn">
			<span id="maxPlayersLoadingBar" style="margin-right: ${loadMargin}; float: right; display: none; transform: scale(0.8); width: 100px; height: 25px; visibility: initial !important;" class="spinner spinner-default"></span>
            ${fastServersButton}
			<button style="height:38px;display:inline-block;" type="button" id="maxPlayerButton" class="input-dropdown-btn category-options ng-scope"> 
			<span style="font-size:13px;" class="text-overflow rbx-selection-label ng-binding dropdown-button-text">Max Players</span> <span class="icon-down-16x16"></span> </button> 
            <ul page="0" style="width:150px;" id="maxPlayerDropdown" class="max-player-dropdown dropdown_menu dropdown_menu-4 dropdown-menu">
				${dropdown}
            </ul>
         </div>`
	div.innerHTML = maxPlayersHTML
	return div
}

function addMaxPlayers(maxPlayers) {
	serverContainer = document.getElementById('rbx-running-games')
	maxPlayersDiv = createMaxPlayers(maxPlayers)
	serverContainer.insertBefore(maxPlayersDiv, serverContainer.childNodes[1])
	async function checkSettings() {
		if (await fetchSetting("serverSizeSort") == false) {
			document.getElementById('maxPlayerButton').style.display = "none"
		}
		if (await fetchSetting("fastestServersSort") == false) {
			document.getElementById('fastServersButton').style.display = "none"
		}
	}
	checkSettings()
	$("#maxPlayerButton").click(function(){
		$(this.parentNode).find("#maxPlayerDropdown").toggleClass("active")
	})
	$("#fastServersButton").click(async function(){
		document.getElementById('maxPlayersLoadingBar').style.display = "inline-block"
		document.getElementById('maxPlayersLoadingBar').style.marginRight = "310px"
		customServerList = await fetchLowPingServers(globalGameId, pageIndex, 1000)
		loadServerPage(globalGameId, 0)
	})
	$(".dropdown-custom-item").click(async function(){
		maxPlayerSelection = parseInt(this.id)
		$("#maxPlayerButton").find('.dropdown-button-text').html(this.innerHTML)
		$("#maxPlayerDropdown").toggleClass("active")
		gameID = window.location.href.split("games/")[1].split("/")[0]
		document.getElementById('maxPlayersLoadingBar').style.display = "inline-block"
		index = await fetchMaxPlayerIndex(gameID, maxPlayerSelection)
		if (index != "NONE") {
			customServerList = null
			loadServerPage(gameID, index)
		} else {
			$("#maxPlayerButton").find('.dropdown-button-text').html("Error: None Found")
		}
	})
}

async function liveCounters() {
	async function loadCounters() {
		universeId = document.getElementById('game-detail-meta-data').getAttribute('data-universe-id')
		votes = await fetchVotes(universeId)
		favoritesData = await fetchFavorites(universeId)
		votes = votes.data[0]
		upvotes = document.getElementById('vote-up-text')
		downvotes = document.getElementById('vote-down-text')
		favorites = document.getElementsByClassName('game-favorite-count')[0]
		if (upvotes != null) {
			upvotes.style.fontSize = "11px"
			upvotes.innerHTML = addCommas(votes.upVotes)
		}
		if (downvotes != null) {
			downvotes.style.fontSize = "11px"
			downvotes.innerHTML = addCommas(votes.downVotes)
		}
		if (favorites != null) {
			favorites.innerHTML = addCommas(favoritesData.favoritesCount)
		}
	}
	if (await fetchSetting("liveLikeDislikeFavoriteCounters")) {
		setTimeout(function() {
			loadCounters()
		}, 1000)
		setInterval(function() {
			loadCounters()
		}, 10000)
	}
}

var timerArray = [];

function animateValue(obj, start, end, duration) {
    if (start === end) return;
    var range = end - start;
    var current = start;
    var increment = end > start? Math.ceil(Math.abs(end-start)/500) : -1 * Math.ceil(Math.abs(end-start)/500);
    var stepTime = Math.abs(Math.floor(duration / (range/Math.abs(increment))));
    timer = setInterval(function() {
		if (start == currentVisits || start == currentPlayers) {
			current += increment;
			obj.innerHTML = addCommas(current);
			if ((increment >= 0 && current >= end) || (increment < 0 && current <= end)) {
				clearInterval(timer);
				obj.innerHTML = addCommas(end);
				obj.setAttribute("title", obj.innerHTML)
			}
		}
	}, stepTime);
	timerArray.push([obj, timer])
}

async function livePlaying() {
	liveVisits = await fetchSetting("liveVisits");
	livePlaying = await fetchSetting("livePlayers");
	if (liveVisits || livePlaying) {
		async function loadPlaying() {
			if (liveVisits || livePlaying) {
				universeId = document.getElementById('game-detail-meta-data').getAttribute('data-universe-id')
				gameInfo = await fetchGameInfo(universeId)
				playing = gameInfo.data[0].playing
				visits = gameInfo.data[0].visits
				playingObj = document.getElementsByClassName('game-stat')[0].getElementsByTagName('p')[1]
				visitsObj = document.getElementById('game-visit-count')
				oldPlaying = parseInt(playingObj.innerHTML.replace(",","").replace(",","").replace(",",""))
				oldVisits = parseInt(visitsObj.getAttribute('title').replace(",","").replace(",","").replace(",","").replace(",",""))
				if (livePlaying) {
					playingObj.innerHTML = addCommas(oldPlaying)
				}
				if (liveVisits) {
					visitsObj.innerHTML = addCommas(oldVisits)
				}
				if (livePlaying) {
					for (i = 0; i < timerArray.length; i++) {
						if (timerArray[i][0] == playingObj) {
							clearInterval(timerArray[i][1])
						}
					}
					animateValue(playingObj, oldPlaying, playing, 5000);
					currentPlayers = oldPlaying;
				}
				if (oldVisits <= visits && liveVisits) {
					for (i = 0; i < timerArray.length; i++) {
						if (timerArray[i][0] == visitsObj) {
							clearInterval(timerArray[i][1])
						}
					}
					timerArray = []
					animateValue(visitsObj, oldVisits, visits, 10000);
					currentVisits = oldVisits;
				}
			}
		}
		setTimeout(loadPlaying, 1000)
		setInterval(loadPlaying, 20000)
	}
}

async function addSearchBar(gameID) {
	serverContainer = document.getElementById('rbx-running-games')
	searchBar = document.createElement("div")
	searchBar.innerHTML = searchBarHTML
	serverContainer.insertBefore(searchBar, serverContainer.childNodes[1])
	searchServerButton = document.getElementById('searchServerButton')
	searchServerButton.addEventListener("click", async function() {
		username = document.getElementById("searchServer").value
		if (username.length > 2) {
			prevResults = document.getElementById('serverSearchResult')
			if (prevResults != null) {
				prevResults.remove()
			}
			document.getElementById("serverSearchError").innerHTML = '<span class="spinner spinner-default"></span>'
			document.getElementById("serverSearchSuccess").innerHTML = ""
			server = await fetchServerSearch(username, gameID)
			if (server == "Not Found!") {
				document.getElementById("serverSearchError").innerHTML = "User " + username + " not found in game. Please wait or try again."
			} else if (server == "User Does Not Exist!") {
				document.getElementById("serverSearchError").innerHTML = "User " + username + " doesn't exist!"
			} else { //Found the server
				document.getElementById("serverSearchError").innerHTML = ""
				document.getElementById("serverSearchSuccess").innerHTML = "Found " + username + "!"
				createServerElement(server)
			}
		}
	})
}


function stripTags(s) {
	if (typeof s == "undefined") {
		return s
	}
	return s.replace(/(<([^>]+)>)/gi, "").replace(/</g, "").replace(/>/g, "").replace(/'/g, "").replace(/"/g, "");
 }

async function addEmbeds(sectionContent, universeId) {
	socialLinks = await fetchSocialLinks(universeId)
	socialLinks = socialLinks.data
	console.log(socialLinks)
	for (i = 0; i < socialLinks.length; i++) {
		/* if (socialLinks[i].type == "Discord") {
			console.log(socialLinks[i])
			discordUrl = socialLinks[i].url
			discordID = await fetchDiscordID(discordUrl)
			console.log(discordID)
			if (isNormalInteger(discordID)) {
				div = document.createElement('div')
				discordFrameHTML = `<iframe src="https://discordapp.com/widget?id=${discordID}&amp;theme=dark" width="300" height="500" allowtransparency="true" frameborder="0" style="position:absolute;right:0px;top:710px;" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>`
				div.innerHTML = discordFrameHTML
				sectionContent.appendChild(div)
			}
		} else  */if (socialLinks[i].type == "Twitter" && await fetchSetting("gameTwitter")) {
			twitterUrl = socialLinks[i].url
			twitterProfile = stripTags(twitterUrl.split('twitter.com/')[1])
			div = document.createElement('div')
			twitterFrameHTML = `<iframe src="https://ropro.io/twitterFrame.php?account=${twitterProfile}" width="342" height="100%" allowtransparency="true" frameborder="0" style="position:absolute;right:-250x;top:10px;" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>`
			div.innerHTML = twitterFrameHTML
			sectionContent.appendChild(div)
		}
	}
}

function isNormalInteger(str) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
}

async function checkGamePage() {
	gameSplit = window.location.href.split("games/")[1]
	if (typeof gameSplit != 'undefined') {
		globalGameId = gameSplit.split("/")[0]
		if (isNormalInteger(globalGameId)) { // Valid Game Page
			universeId = document.getElementById('game-detail-meta-data').getAttribute('data-universe-id')
			addEmbeds(document.getElementById('game-detail-page'), universeId)
			gameInfo = await fetchGameInfo(universeId)
			addMaxPlayers(gameInfo.data[0].maxPlayers)
			//addSearchBar(gameId)
			if (await fetchSetting("liveLikeDislikeFavoriteCounters")) {
				liveCounters()
			}
			livePlaying()
		}
	}
}
checkGamePage()