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


function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
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

function stripTags(s) {
	if (typeof s == "undefined") {
		return s
	}
	return s.replace(/(<([^>]+)>)/gi, "").replace(/</g, "").replace(/>/g, "").replace(/'/g, "").replace(/"/g, "");
 }

async function quicksearchMain() {
	if (document.getElementById('navbar-universal-search') != null) {
		dropdown = document.getElementById('navbar-universal-search').getElementsByClassName('dropdown-menu')[0]
		listItem = document.createElement('li')
		listItem.setAttribute("class", "navbar-search-option rbx-clickable-li")
		searchHTML = '<a id="userSearch" class="navbar-search-anchor" href=""></a></li>'
		listItem.innerHTML += searchHTML
		userSearchAdded = false
		if (await fetchSetting("quickUserSearch")) {
			userSearchAdded = true
			insertAfter(listItem, dropdown.childNodes[4])
		}
		listItem = document.createElement('li')
		listItem.setAttribute("class", "navbar-search-option rbx-clickable-li")
		searchHTML = '<a id="itemSearch" class="navbar-search-anchor" href=""></a></li>'
		listItem.innerHTML += searchHTML
		itemSearchAdded = false
		if (await fetchSetting("quickItemSearch")) {
			itemSearchAdded = true
			if (userSearchAdded) {
				dropdown = document.getElementById('navbar-universal-search').getElementsByClassName('dropdown-menu')[0]
				insertAfter(listItem, dropdown.childNodes[5])
			} else {
				dropdown = document.getElementById('navbar-universal-search').getElementsByClassName('dropdown-menu')[0]
				insertAfter(listItem, dropdown.childNodes[4])
			}
		}
		itemSearch = document.getElementById('itemSearch')
		$("#navbar-search-input").on('input', function(){
			console.log($("#navbar-search-input").val())
			query = stripTags($("#navbar-search-input").val())
			if (userSearchAdded) {
				userSearch.innerHTML = `User Search "${query}" with RoPro`
				userSearch.setAttribute("href", "https://ropro.io/userSearch.php?q=" + query)
			}
			if (itemSearchAdded) {
				itemSearch.innerHTML = `Item Search "${query}" with RoPro`
				itemSearch.setAttribute("href", "https://ropro.io/itemSearch.php?q=" + query)
			}
		})
	}
}

quicksearchMain()