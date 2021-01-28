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


function fetchSetting(setting) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetSetting", setting: setting}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function fetchSubscription(setting) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetSubscription", setting: setting}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function openOptions() {
	chrome.runtime.sendMessage({greeting: "OpenOptions"})
}

async function insertMenuItems() {
	if (await fetchSetting('roproIcon') && document.getElementsByClassName('nav navbar-right rbx-navbar-icon-group').length > 0) {
		subscription = await fetchSubscription()
		if (subscription.includes("free")) {
			subscriptionPrefix = "free"
		} else if (subscription.includes("standard")) {
			subscriptionPrefix = "standard"
		} else if (subscription.includes("pro")) {
			subscriptionPrefix = "pro"
		} else if (subscription.includes("ultra")) {
			subscriptionPrefix = "ultra"
		} else {
			subscriptionPrefix = "free"
		}
		li3 = document.createElement('li')
		li3.style.marginLeft = "6px"
		li3.innerHTML = '<img class="ropro-icon" style="margin-top:6px;margin-left:0px;width:30px;" src="https://ropro.io/images/' + subscriptionPrefix + '_icon_shadow.png">'
		document.getElementsByClassName('nav navbar-right rbx-navbar-icon-group')[0].insertBefore(li3, document.getElementsByClassName('nav navbar-right rbx-navbar-icon-group')[0].childNodes[0])
		li3.addEventListener('click', function() {
			openOptions()
		})
	}
	li = document.createElement('li')
	newButtonHTML = '<a class="sandbox-icon dynamic-overflow-container text-nav" href="/offers" id="nav-inventory"><div><span class="new-menu-icon icon-nav-trade"></span></div><span class="font-header-2 dynamic-ellipsis-item">Trade Offers</span></a>'
	li.innerHTML += newButtonHTML
	li2 = document.createElement('li')
	newButtonHTML = '<a class="offers-icon dynamic-overflow-container text-nav" href="/sandbox" id="nav-inventory"><div><span class="new-menu-icon icon-nav-charactercustomizer"></span></div><span class="font-header-2 dynamic-ellipsis-item">Sandbox</span></a>'
	li2.innerHTML += newButtonHTML
	menu = document.getElementsByClassName('left-col-list')[0]
	if (await fetchSetting('tradeOffersPage')) {
		menu.insertBefore(li, menu.childNodes[7])
	}
	if (await fetchSetting('sandbox')) {
		menu.insertBefore(li2, menu.childNodes[5])
	}
	for (i = 0; i < document.getElementsByClassName('left-col-list')[0].getElementsByTagName('li').length; i++) {
		listItem = document.getElementsByClassName('left-col-list')[0].getElementsByTagName('li')[i]
		listItem.style.display = "block"
	}
}

insertMenuItems()