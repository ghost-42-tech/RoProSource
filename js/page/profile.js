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



function fetchValue(userID) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/profileBackend.php?userid=" + userID}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function fetchInfo(userID, myId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/getUserInfo.php?userid=" + userID + "&myid=" + myId}, 
			function(data) {
				resolve(data)
			}
		)
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

function getUserId() {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetUserID"}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

async function postReputation(type) {
	userID = await getUserId()
	return new Promise(resolve => {
		json = {reqType: type, myUser: userID, theirUser: getIdFromURL(location.href)}
		chrome.runtime.sendMessage({greeting: "PostURL", url:"https://ropro.io/api/postReputation.php", jsonData: json}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

async function getInfo(userID, myId) {
	response = await fetchInfo(userID, myId)
	return response
}

async function getJSON(userID) {
	response = await fetchValue(userID)
	json = JSON.parse(response)
	return json
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

function getIdFromURL(url) {
	return parseInt(url.split("users/")[1].split("/profile")[0])
}

function addThemeMain(theme) {
	console.log(theme)
	themeName = theme['name']
	if ('repeat' in theme){
		repeat = theme['repeat']
	} else {
		repeat = "repeat"
	}
	if ('width' in theme) {
		width = theme['width']
	} else {
		width = "100%"
	}
	if ('color' in theme) {
		color = theme['color']
	} else {
		color = ""
	}
	mainContainer = document.getElementById('container-main')
	profileContainer = document.getElementsByClassName('profile-container')[0]
	profileContainer.style.padding = "20px"
	profileContainer.style.paddingTop = "10px"
	mainContainer.style.backgroundImage = `url(https://ropro.io/themes/${themeName})`
	mainContainer.style.backgroundSize = width
	mainContainer.style.backgroundColor = color
	mainContainer.style.backgroundRepeat = repeat
	mainContainer.style.borderRadius = "20px"
	mainContainer.style.padding = "20px"
}

async function addLink(userID) {
	header = document.getElementsByClassName('header-title')[0]
	if (header != undefined && await fetchSetting("embeddedRolimonsUserLink")) {
		div = document.createElement('div')
		div.innerHTML = '<a style="margin-left:0px;margin-top:5px;" target = "_blank" href = "https://www.rolimons.com/player/' + userID + '"><svg id = "roliLink" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" width="2em" height="2em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path class="linkpath" d="M10.586 13.414a1 1 0 0 1-1.414 1.414 5 5 0 0 1 0-7.07l3.535-3.536a5 5 0 0 1 7.071 7.071l-1.485 1.486a7.017 7.017 0 0 0-.405-2.424l.476-.476a3 3 0 1 0-4.243-4.243l-3.535 3.536a3 3 0 0 0 0 4.242zm2.828-4.242a1 1 0 0 1 1.414 0 5 5 0 0 1 0 7.07l-3.535 3.536a5 5 0 0 1-7.071-7.07l1.485-1.486c-.008.82.127 1.641.405 2.423l-.476.476a3 3 0 1 0 4.243 4.243l3.535-3.536a3 3 0 0 0 0-4.242 1 1 0 0 1 0-1.414z" fill="#fff"></path></svg></a>'
		header.appendChild(div)
		$(".linkpath").css("fill", $('body').css("color"))
	}
}
function stripTags(s) {
	if (typeof s == "undefined") {
		return s
	}
	return s.replace(/(<([^>]+)>)/gi, "").replace(/</g, "").replace(/>/g, "").replace(/'/g, "").replace(/"/g, "");
 }
function addValue(value, userID) {
	reputationDiv = document.getElementById('reputationDiv')
	caption = document.getElementsByClassName('header-caption')[0]
	margin = 145
	size = "15px"
	icon = "value_icon_small"
	maxSize = 70
	console.log(value.toString())
	if (value.toString().length > 6) {
		icon = "value_icon"
		maxSize = 130
		margin = 140
	} else if (value.toString().length > 3) {
		icon = "value_icon_medium"
		maxSize = 80
		margin = 88
	} else {
		icon = "value_icon_small"
		maxSize = 50
		margin = 57
	}
	prefix = "R$ "
	if (value == "private") {
		prefix = ""
		value = "Private Inventory"
		maxSize = 120
	}
	valueHTML = `<a id="valueLink" target="_blank" href="https://rolimons.com/player/${userID}"><img style="margin-right:5px;" src="https://ropro.io/images/${icon}.png" height="24px"><h5 id="valueAmount" style="text-align:right;color:#E8E8E8;line-height:0px;padding:0px;font-size:${size};vertical-align:center!important;position:absolute;margin-left:-${margin}px;margin-top:13px;display:initial!important;">${prefix}${addCommas(value)}</h5></a>`
	reputationDiv = document.getElementById("reputationDiv")
	reputationDiv.innerHTML = valueHTML + reputationDiv.innerHTML
	reputationDiv.setAttribute("style", "margin-bottom:6px;visibility:hidden;")
	count = 1
	while ($("#valueAmount").get(0).clientWidth > maxSize && count < 14) {
		$("#valueAmount").css("font-size", 15 - count + "px")
		count++
	}
	
}

function addDiscord(discord) {
	caption = document.getElementsByClassName('header-caption')[0]
	margin = 145
	size = "15px"
	discordHTML = `<a id="discordLink" href="discord://"><img style="margin-right:5px;" src="https://ropro.io/images/discord_bar.png" height="24px"><h5 id="discordName" style="text-align:right;color:#E8E8E8;line-height:0px;padding:0px;font-size:${size};vertical-align:center!important;position:absolute;margin-left:-${margin}px;margin-top:13px;display:initial!important;">${stripTags(discord)}</h5></a>`
	reputationDiv = document.getElementById("reputationDiv")
	reputationDiv.innerHTML = discordHTML + reputationDiv.innerHTML
	reputationDiv.setAttribute("style", "margin-bottom:6px;visibility:hidden;text-align:center;")
	caption.insertBefore(reputationDiv, caption.childNodes[2])
	count = 1
	while ($("#discordName").get(0).clientWidth > 135 && count < 14) {
		$("#discordName").css("font-size", 15 - count + "px")
		count++
	}
	
}

function swapImage(elem) {
	if (elem.getAttribute("src") == "https://ropro.io/images/like1.png") {
		elem.setAttribute("src", "https://ropro.io/images/like2.png")
	} else {
		elem.setAttribute("src", "https://ropro.io/images/like1.png")
	}
}

sendingPost = false

function changeReputation() {
	if (!sendingPost) {
		sendingPost = true
		type = "add"
		likeButton = document.getElementById('likeButton')
		likeImage = document.getElementsByClassName('rolilike')[0]
		repValue = parseInt(document.getElementById('repValue').innerHTML.replace("Reputation: ", ""))
		if (likeButton.getAttribute("liked") == "true") {
			likeImage.setAttribute("src", "https://ropro.io/images/like1.png")
			likeButton.setAttribute("liked", "false")
			type = "remove"
			document.getElementById('repValue').innerHTML = "Reputation: " + (repValue - 1)
		} else {
			likeImage.setAttribute("src", "https://ropro.io/images/like2.png")
			likeButton.setAttribute("liked", "true")
			type = "add"
			document.getElementById('repValue').innerHTML = "Reputation: " + (repValue + 1)
		}
		postReputation(type)
		setTimeout(function() {
			sendingPost = false
		}, 500)
	}
}

async function addReputation(reputation, liked, isMe) {
	margin = 135
	size = 15
	if (reputation.toString().length > 2) {
		size = 14
	}
	reputationHTML = `<img src="https://ropro.io/images/blank_icon_black.png" height="24px"><h5 id="repValue" style="color:#E8E8E8;line-height:0px;padding:0px;font-size:${size}px;vertical-align:center!important;position:absolute;margin-left:-${margin}px;margin-top:13px;display:initial!important;">Reputation: ${reputation}</h5>`
	reputationDiv.innerHTML += reputationHTML
	if (liked) {
		likeImage = "https://ropro.io/images/like2.png"
	} else {
		likeImage = "https://ropro.io/images/like1.png"
	}
	addReputationHTML = `<a liked=${liked} id="likeButton"><img class="rolilike" style="margin-left:5px;" src="${likeImage}" width="23"></a>`
	reputationDiv = document.getElementById("reputationDiv")
	if (await fetchSetting("reputationVote")) {
		reputationDiv.innerHTML += addReputationHTML
	}
	reputationDiv.setAttribute("style", "margin-bottom:6px;visibility:hidden;")
	setTimeout(function() {
		reputationDiv.setAttribute("style", "margin-bottom:6px;visibility:initial;")
		loading = document.getElementById('loadingBar')
		if (loading != null) {
			loading.remove()
		}
	}, 500)
}

async function mainProfile() {
	if (location.href.includes("/profile")) {
		userID = getIdFromURL(location.href)
		if (userID != undefined && userID != 0) {
			addLink(userID)
			caption = document.getElementsByClassName('header-caption')[0]
			reputationDiv = document.createElement('div')
			reputationDiv.setAttribute("id", "reputationDiv")
			reputationDiv.setAttribute("style", "margin-bottom:30px;visibility:hidden!important;")
			reputationDiv.innerHTML += '<span id="loadingBar" style="transform: scale(0.8);visibility:initial!important;margin:0px;margin-bottom:26px;width:100px;height:25px;position:absolute;left:0px;" class="spinner spinner-default"></span>'
			setTimeout(function() {
				loading = document.getElementById('loadingBar')
				if (loading != null) {
					loading.remove()
				}
				reputationDiv.setAttribute("style", "margin-bottom:6px;visibility:initial;")
			}, 6000)
			caption.insertBefore(reputationDiv, caption.childNodes[2])
			json = await getJSON(userID)
			if (await fetchSetting("profileValue")) {
				userValue = json['value']
				addValue(userValue, userID)
			}
			myId = await getUserId()
			info = await getInfo(userID, myId)
			if (await fetchSetting("reputation")) {
				addReputation(info.reputation, info.liked, myId == userID)
			}
			if (info.theme != null && await fetchSetting("profileThemes")) {
				addThemeMain(JSON.parse(info.theme))
			}
			if (info.discord.length > 0 && await fetchSetting("linkedDiscord")) {
				addDiscord(info.discord)
			}
			if (await fetchSetting("reputationVote")) {
				likeButton = document.getElementById('likeButton')
				if (likeButton != null) {
					likeButton.addEventListener("click", function(){
						changeReputation()
					})
				}
			}
			setTimeout(function(){
				loading = document.getElementById('loadingBar')
					if (loading != null) {
						loading.remove()
					}
				reputationDiv.setAttribute("style", "margin-bottom:6px;visibility:initial;")
			}, 500)
			discordLink = document.getElementById('discordLink')
			if (discordLink != null) {
				discordLink.addEventListener("click", function(){
					discordValue = document.getElementById('discordName').innerHTML
					input = document.createElement("input")
					input.value = discordValue
					document.body.appendChild(input)
					input.select();
					input.setSelectionRange(0, 99999); /*For mobile devices*/
					document.execCommand("copy");
					document.body.removeChild(input)
					oldSize = $("#discordName").css("font-size")
					$("#discordName").css("font-size", "12px")
					document.getElementById('discordName').innerHTML = "Copied to clipboard."
					setTimeout(function(){
						document.getElementById('discordName').innerHTML = stripTags(discordValue)
						$("#discordName").css("font-size", oldSize)
					}, 500)
				})
			}
		}
	}
}

mainProfile()