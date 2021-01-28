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


genreDropdownHTML = `<div id = "genreDropdown" style="overflow:visible;margin-top:-5px;margin-left:10px;float:left;width:150px;" class="input-group-btn group-dropdown">
<button type="button" class="input-dropdown-btn" data-toggle="dropdown" aria-expanded="false"> 
<span id="genreLabel" class="rbx-selection-label ng-binding" ng-bind="layout.selectedTab.label">All</span> 
<span class="icon-down-16x16"></span></button>
<ul style="max-height:1000px;" id="genreOptions" data-toggle="dropdown-menu" class="dropdown-menu" role="menu"> 
</ul></div>`

customDropdownHTML = `<div id = "customDropdown" style="overflow:visible;margin-top:-5px;margin-left:10px;float:left;width:200px;" class="input-group-btn group-dropdown">
<button type="button" class="input-dropdown-btn" data-toggle="dropdown" aria-expanded="false"> 
<span id="customLabel" class="rbx-selection-label ng-binding" ng-bind="layout.selectedTab.label">More Filters</span> 
<span class="icon-down-16x16"></span></button>
<ul style="max-height:1000px;" id="customOptions" data-toggle="dropdown-menu" class="dropdown-menu" role="menu"> 
</ul></div>`

likeRatioSliderHTML = `<div style="float:left;width:300px;margin-left:10px;">
<span style="float:left;" class="icon-dislike selected"></span>
<input id="likeRatio" oninput="this.nextElementSibling.nextElementSibling.value = this.value + '%'" value="50" max="100" min="1" type="range" style="float:left;width:150px;">
<span class="icon-like selected"></span>
<output style="margin-left:5px;">50%</output>
</div>`

var allGames = {}
var gameBatch = []
var universeBatch = []
var currentGames = []
var genres = ["All", "Building", "Horror", "Town and City", "Military", "Comedy", "Medieval", "Adventure", "Sci-Fi", "Naval", "FPS", "RPG", "Sports", "Fighting", "Western", "Skatepark"]
var genreFilter = null
var customFilter = null
var filters = ["More Filters", "Single-player", "Gear Allowed", "Paid Access", "New Games", "Classic Games", "Recently Updated", "Updated Today", "Under 1m Visits", "R15 Enabled", "Open Source"]

function fetchGenres(universes) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://games.roblox.com/v1/games?universeIds=" + universes.join(",")}, 
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

function singlePlayerSort(universe) {
	gameData = allGames[universe][1]
	return gameData.maxPlayers == 1
}

function gearAllowedSort(universe) {
	gameData = allGames[universe][1]
	return gameData.allowedGearCategories.length > 0
}

function paidAccessSort(universe) {
	gameData = allGames[universe][1]
	return gameData.price != null
}

function newGamesSort(universe) {
	gameData = allGames[universe][1]
	dateCreated = new Date(gameData.created).getTime()
	compareDate = new Date()
	compareDate.setMonth(compareDate.getMonth() - 6)
	timeElapsed = compareDate - dateCreated
	return timeElapsed <= 0
}

function classicGamesSort(universe) {
	gameData = allGames[universe][1]
	dateCreated = new Date(gameData.created).getTime()
	compareDate = new Date()
	compareDate.setFullYear(compareDate.getFullYear() - 5)
	timeElapsed = compareDate - dateCreated
	return timeElapsed > 0
}

function recentlyUpdatedSort(universe) {
	gameData = allGames[universe][1]
	dateUpdated = new Date(gameData.updated).getTime()
	compareDate = new Date()
	compareDate.setDate(compareDate.getDate() - 5)
	timeElapsed = compareDate - dateUpdated
	return timeElapsed <= 0
}

function updatedTodaySort(universe) {
	gameData = allGames[universe][1]
	dateUpdated = new Date(gameData.updated).getTime()
	compareDate = new Date()
	compareDate.setDate(compareDate.getDate() - 1)
	timeElapsed = compareDate - dateUpdated
	return timeElapsed <= 0
}

function underOneMillionVisitsSort(universe) {
	gameData = allGames[universe][1]
	return gameData.visits < 1000000
}

function rFifteenEnabledSort(universe) {
	gameData = allGames[universe][1]
	return (gameData.universeAvatarType == "MorphToR15" || gameData.universeAvatarType == "PlayerChoice")
}

function openSourceSort(universe) {
	gameData = allGames[universe][1]
	return gameData.studioAccessToApisAllowed
}


function filterGame(universeId) {
	if (universeId in allGames) {
		switch(customFilter) {
			case "Single-player":
				return singlePlayerSort(universe)
			case "Gear Allowed":
				return gearAllowedSort(universe)
			case "Paid Access":
				return paidAccessSort(universe)
			case "New Games":
				return newGamesSort(universe)
			case "Classic Games":
				return classicGamesSort(universe)
			case "Recently Updated":
				return recentlyUpdatedSort(universe)
			case "Updated Today":
				return updatedTodaySort(universe)
			case "Under 1m Visits":
				return underOneMillionVisitsSort(universe)
			case "R15 Enabled":
				return rFifteenEnabledSort(universe)
			case "Open Source":
				return openSourceSort(universe)
			default:
				return true
		}
	}
}

function filterCustom() {
	for (universe in allGames) {
		game = allGames[universe]
		for (i = 0; i < game[0].length; i++) {
			gameCard = game[0][i]
			if (gameCard.getElementsByClassName('info-label vote-percentage-label').length > 0) {
				showGame = filterGame(universe)
				if (showGame == false) {
					gameCard.style.display = "none"
				} else {
					if (currentGames == null || currentGames.includes(gameCard)) {
						gameCard.style.display = "inline-block"
					}
				}
			} else {
				if (customFilter != null) {
					gameCard.style.display = "none"
				}
			}
		}
	}
}

function createGenres() {
	genreOptionsList = document.getElementById('genreOptions')
	for (i = 0; i < genres.length; i++) {
		genre = genres[i]
		li = document.createElement('li')
		li.innerHTML += `
				<a genre="${genre}" class="genreChoice">
					<span ng-bind="tab.label" class="ng-binding">${genre}</span>
				</a>`
		if (genreOptionsList.getElementsByTagName('li').length < genres.length) {
			genreOptionsList.appendChild(li)
			genreChoice = li.getElementsByClassName('genreChoice')[0]
			genreChoice.addEventListener("click", function() {
				genre = this.getAttribute("genre")
				document.getElementById('genreLabel').innerHTML = genre
				if (genre == "All") {
					genre = null
				}
				genreFilter = genre
				filterGenres()
			})
		}
	}
}

function createCustom() {
	customOptionsList = document.getElementById('customOptions')
	for (i = 0; i < filters.length; i++) {
		custom = filters[i]
		li = document.createElement('li')
		li.innerHTML += `
				<a custom="${custom}" class="customChoice">
					<span ng-bind="tab.label" class="ng-binding">${custom}</span>
				</a>`
		if (customOptionsList.getElementsByTagName('li').length < filters.length) {
			customOptionsList.appendChild(li)
			customChoice = li.getElementsByClassName('customChoice')[0]
			customChoice.addEventListener("click", function() {
				custom = this.getAttribute("custom")
				document.getElementById('customLabel').innerHTML = custom
				if (custom == "More Filters") {
					custom = null
				}
				customFilter = custom
				filterCustom()
			})
		}
	}
}

function filterGenres() {
	if (genreFilter != null) {
		currentGames = []
		for (universe in allGames) {
			game = allGames[universe]
			for (i = 0; i < game[0].length; i++) {
				gameCard = game[0][i]
				gameDetail = game[1]
				if (gameCard.getElementsByClassName('game-card-native-ad').length > 0 || typeof gameDetail.genre == "undefined" || gameDetail.genre != genreFilter) {
					gameCard.style.display = "none"
				} else {
					gameCard.style.display = "inline-block"
					currentGames.push(gameCard)
				}
			}
		}
	} else {
		currentGames = null
		for (universe in allGames) {
			game = allGames[universe]
			for (i = 0; i < game[0].length; i++) {
				gameCard = game[0][i]
				gameCard.style.display = "inline-block"
			}
		}
	}
}

function filterLikeRatio(ratio) {
	ratio = parseInt(ratio)
	for (universe in allGames) {
		game = allGames[universe]
		for (i = 0; i < game[0].length; i++) {
			gameCard = game[0][i]
			if (gameCard.getElementsByClassName('info-label vote-percentage-label').length > 0) {
				gameRatio = parseInt(gameCard.getElementsByClassName('info-label vote-percentage-label')[0].innerHTML.replace("%", ""))
				if (gameRatio < ratio) {
					gameCard.style.display = "none"
				} else {
					if (currentGames == null || currentGames.includes(gameCard)) {
						gameCard.style.display = "inline-block"
					}
				}
			} else {
				if (ratio != 50) {
					gameCard.style.display = "none"
				}
			}
		}
	}
}

async function doBatch() {
	universeBatch = []
	gameBatch = []
	cards = $(".game-card.game-tile:not('.checked')")
	for (i = 0; i < Math.min(cards.length, 100); i++) {
		card = cards.get(i)
		gameBatch.push(card)
		card.setAttribute("checked", true)
		card.classList.add("checked")
	}
	for (i = 0; i < gameBatch.length; i++) {
		gameCard = gameBatch[i]
		universeId = gameCard.getElementsByClassName('game-card-link')[0].getAttribute('id')
		if (!(universeId in allGames)) {
			allGames[universeId] = [[gameCard]]
		} else {
			allGames[universeId][0].push(gameCard)
		}
		universeBatch.push(universeId)
	}
	if (universeBatch.length > 0) {
		gameDetails = await fetchGenres(universeBatch)
		gameDetails = gameDetails.data
		for (i = 0; i < gameDetails.length; i++) {
			gameDetail = gameDetails[i]
			allGames[gameDetail.id.toString()].push(gameDetail)
		}
		filterGenres()
		filterLikeRatio(document.getElementById("likeRatio").value)
		if (customFilter != null) {
			filterCustom(customFilter)
		}
	}
}

function getPageLeft(el) {
    var rect = el.getBoundingClientRect();
    var docEl = document.documentElement;
    return rect.left + (window.pageXOffset || docEl.scrollLeft || 0)
}

function getPageTop(el) {
    var rect = el.getBoundingClientRect();
    var docEl = document.documentElement;
    return rect.top + (window.pageYOffset || docEl.scrollTop || 0)
}

var mainGamesPage = false

document.getElementsByTagName('body')[0].style.minHeight="1000px"

setInterval(function(){
	//if (window.location.href.includes("sortName")) {
		if (document.getElementById("genreDropdown") == null) { //First page load
			containers = document.getElementsByClassName('games-list-container is-windows')
			if (containers.length > 0) {
				link = containers[0].childNodes[0]
				if (link.tagName == "A") {
					mainGamesPage = true
				}
			}
			async function addDropdowns() {
				firstHeader = $('.container-header.games-filter-changer h3').get(0)
				if (typeof firstHeader == "undefined") {
					firstHeader = document.getElementsByClassName('search-result-header')[0].getElementsByClassName('text-emphasis font-bold search-query-text')[0]
				}
				contentDiv = document.createElement("div")
				contentDiv.style.position = "static"
				contentDiv.style.float = "left"
				contentDiv.style.left = (getPageLeft(firstHeader) + firstHeader.offsetWidth + 20) + "px"
				contentDiv.style.zIndex = "10000"
				contentDiv.id = "filterDiv"
				contentWindow = document.getElementsByClassName('content')[0]
				contentWindow.insertBefore(contentDiv, contentWindow.childNodes[0])
				h3 = $('.container-header.games-filter-changer')
				if (mainGamesPage && h3.length > 0) {
					h3.get(0).parentNode.insertBefore(document.createElement("br"), h3.get(0))
					h3.get(0).parentNode.insertBefore(document.createElement("br"), h3.get(0))
				} else if ($('.search-result-header').length > 0) {
					$('.search-result-header').get(0).parentNode.insertBefore(document.createElement("br"), $('.search-result-header').get(0))
					$('.search-result-header').get(0).parentNode.insertBefore(document.createElement("br"), $('.search-result-header').get(0))
				}
				if (await fetchSetting("genreFilters")) {
					if (mainGamesPage) {
						contentDiv.innerHTML += genreDropdownHTML
					} else {
						if (document.getElementsByClassName('search-result-header').length > 0) {
							contentDiv.innerHTML += genreDropdownHTML
						} else {
							document.getElementsByClassName('container-header games-filter-changer')[0].innerHTML += genreDropdownHTML
						}
					}
				} else {
					div = document.createElement("div")
					div.setAttribute("id", "genreDropdown")
					contentDiv.appendChild(div)
				}
				if (await fetchSetting("moreGameFilters")) {
					if (mainGamesPage) {
						contentDiv.innerHTML += customDropdownHTML
					} else {
						if (document.getElementsByClassName('search-result-header').length > 0) {
							contentDiv.innerHTML += customDropdownHTML
						} else {
							document.getElementsByClassName('container-header games-filter-changer')[0].innerHTML += customDropdownHTML
						}
					}
				}
				if (await fetchSetting("gameLikeRatioFilter")) {
					if (mainGamesPage) {
						contentDiv.innerHTML += likeRatioSliderHTML
					} else {
						if (document.getElementsByClassName('search-result-header').length > 0) {
							contentDiv.innerHTML += likeRatioSliderHTML
						} else {
							document.getElementsByClassName('container-header games-filter-changer')[0].innerHTML += likeRatioSliderHTML
						}
					}
					$('input[type="range"]:not("#choicesRatio")').on("change mousemove", function () {
							var val = ($(this).val() - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min'))
							$(this).css('background-image', '-webkit-gradient(linear, left center, right center, color-stop(' + val + ', #14B65A), color-stop(' + val + ', #D76A6B))')
					})
					$('input[type="range"]:not("#choicesRatio")').on("input", function () {
							var val = $(this).val()
							filterLikeRatio(val)
					})
				}
			}
			addDropdowns()
			setTimeout(async function(){
				if (await fetchSetting("genreFilters")) {
					createGenres()
				}
				if (await fetchSetting("moreGameFilters")) {
					createCustom()
				}
			}, 1000)
		}
		doBatch()
	//}
}, 1000)