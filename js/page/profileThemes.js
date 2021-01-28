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



profileThemeBoxHTML = `<div class="section-content"><button id="saveTheme" type="button" class="btn-fixed-width-lg btn-growth-lg" style="background-color:#0084dd;border:0px;font-size:18px;padding:5px;float:right;">Remove Theme</button><p id="themeResponseText"></p><div style="width:100%;float:left;margin-top:10px;"><h3 style="margin-bottom:-10px;">RoPro Profile Themes</h3><h7 style="font-size:14px;margin-top:-10px;">Other RoPro users will see your theme when they visit your profile.</h7><br><br></div><div style="min-height:150px" id="profileThemeCardBox"></div><br><div style="width:100%;float:left;margin-top:10px;"><h3 style="margin-bottom:-10px;">Animated Themes</h3><h7 style="font-size:14px;margin-top:-10px;">Animated themes are available for subscribers only.</h7><br><br><div style="min-height:110px;" id="animatedThemeCardBox"></div></div><div style="width:100%;float:left;margin-top:10px;"><h3 style="margin-bottom:-10px;">Custom Themes</h3><h7 style="font-size:14px;margin-top:-10px;">To submit a custom theme for approval, join the RoPro discord server: <a href="https://ropro.io/discord" target="_blank">https://ropro.io/discord</a> </h7><a href="https://ropro.io/discord" target="_blank"><img src="https://ropro.io/images/discordicon.png" style="width:30px;"></a><br><div style="min-height:150px;" id="customThemeCardBox"></div></div></div>`

var ropro_themes = null

function fetchThemes() {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/themesJSON.php"}, 
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

function saveTheme(userID, themeName, remove) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/saveTheme.php?userid=" + userID + "&themename=" + themeName}, 
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

function getStorage(key) {
	return new Promise(resolve => {
		chrome.storage.sync.get(key, function (obj) {
			resolve(obj[key])
		})
	})
}

function stripTags(s) {
	if (typeof s == "undefined") {
		return s
	}
	return s.replace(/(<([^>]+)>)/gi, "").replace(/</g, "").replace(/>/g, "").replace(/'/g, "").replace(/"/g, "");
 }

function addCard(theme) {
	profileThemeCardHTML = `<div themejson='${encodeURI(JSON.stringify(theme))}' style="display:inline-block;width:50px;height:50px;margin:2px;margin-left:5px;margin-right:5px;margin-bottom:5px;" class="thumbnail-2d-container background-selector"><a style="position:relative;">
<img class="item-card-thumb-container" style="width:100%;height:100%;" src="https://ropro.io/themes/low_quality/${stripTags(theme['name'])}">
<img src="https://ropro.io/images/empty.png" class="background-checkmark-image active" style="pointer-events:none;transform:scale(0.4);overflow:visible;width:164px;height:126px;position:absolute;right:-57px;top:-52px;">
</a></div>`
	div = document.createElement('div')
	div.innerHTML += profileThemeCardHTML
	if ('animated' in theme) {
		profileThemeCardBox = document.getElementById('animatedThemeCardBox')
	} else if ('custom' in theme) {
		profileThemeCardBox = document.getElementById('customThemeCardBox')
	} else {
		profileThemeCardBox = document.getElementById('profileThemeCardBox')
	}
	profileThemeCardBox.appendChild(div)
	$(div).click(function(){
		theme = JSON.parse(decodeURI(this.getElementsByClassName('thumbnail-2d-container')[0].getAttribute('themejson')))
		console.log(theme)
		addTheme(theme)
	})
}

function doThemeResponse(response){
	responseElement = document.getElementById('themeResponseText')
	if (response == "ERROR: NOT SUBSCRIBED") {
		responseElement.innerHTML = 'Error: Animated themes are only available for subscribers. <a style="display:inline-block;" class="btn-primary-md ng-binding" target="_blank" href="https://ropro.io/">Upgrade</a>'
	} else if(response == "SUCCESSFULLY REMOVED") {
		responseElement.innerHTML = 'Successfully removed profile theme. Other users will not see a theme on your profile!'
	} else if(response == "SUCCESS") {
		responseElement.innerHTML = 'Successfully updated profile theme. Other users will be able to see your theme now!'
	} else {
		responseElement.innerHTML = 'Error: Unknown error, please try again later.'
	}
}

function addThemeBox() {
	profileContainer = document.getElementsByClassName('profile-container')[0]
	profileHeader = profileContainer.getElementsByClassName('profile-header')[0]
	div = document.createElement('div')
	div.setAttribute('id', 'profileThemesSelectorBox')
	div.innerHTML += profileThemeBoxHTML
	profileContainer.childNodes[0].insertBefore(div, profileHeader.nextElementSibling)
	document.getElementById('saveTheme').addEventListener("click", async function(){
		if (this.innerHTML == "Save Theme") {
			responseElement = document.getElementById('themeResponseText').innerHTML = ""
			backgroundImage = document.getElementById('container-main').style.backgroundImage
			themeName = backgroundImage.split("themes/")[1].replace('")', "")
			console.log(themeName)
			userID = await getStorage("rpUserID")
			response = await saveTheme(userID, themeName)
			doThemeResponse(response)
			this.innerHTML = "Remove Theme"
		} else {
			userID = await getStorage("rpUserID")
			response = await saveTheme(userID, "remove")
			doThemeResponse(response)
			document.getElementById('container-main').style.backgroundImage = ""
			document.getElementById('container-main').style.backgroundColor = ""
		}
	})
}

function addTheme(theme) {
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
	document.getElementById('saveTheme').innerHTML = "Save Theme"
}

async function loadThemes() {
	themesJSON = await fetchThemes()
	ropro_themes = JSON.parse(themesJSON)
	addThemeBox()
	for (i = 0; i < ropro_themes.length; i++){
		theme = ropro_themes[i]
		addCard(theme)
	}
}

function addOpenThemesButton(){
	div = document.createElement('div')
	div.innerHTML += '<a id="openThemes" style="margin-left:10px;display:inline-block;" class="btn-primary-md ng-binding">Change Profile Theme</a>'
	document.getElementsByClassName('header-title')[0].appendChild(div)
	document.getElementById('openThemes').addEventListener('click', function(){
		if (this.innerHTML == "Change Profile Theme") {
			loadThemes()
			this.innerHTML = "Close Profile Themes"
		} else {
			this.innerHTML = "Change Profile Theme"
			document.getElementById('profileThemesSelectorBox').remove()
		}
	})
}

function getIdFromURL(url) {
	return parseInt(url.split("users/")[1].split("/profile")[0])
}

async function themesMain(){
	myUserID = await getStorage("rpUserID")
	pageID = getIdFromURL(location.href)
	if (myUserID == pageID && await fetchSetting('profileThemes')) {
		addOpenThemesButton()
	}
}

themesMain()