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


var cursor = ""
var tradeType = "inbound"
var loaded = false
var currentlyLoading = false
var tradeValues = {}
var tradeBarHeight = 0
var tradesArray = []
var myUsername = ""

function fetchTrades(tradesType) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://trades.roblox.com/v1/trades/" + tradesType + "?cursor=" + cursor + "&limit=100&sortOrder=Desc"}, 
			function(data) {
				for (i = 0; i < data.data.length; i++) {
					tradesArray.push(data.data[i])
				}
				cursor = data.nextPageCursor
				resolve(data)
			}
		)
	})
}

function fetchUsername() {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetUsername"}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function fetchTrade(tradeId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://trades.roblox.com/v1/trades/" + tradeId}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function fetchValues(trades) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "PostURL", url:"https://ropro.io/api/tradePreviewBackend.php", jsonData: trades}, 
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

function getValueHTML(theirValue, ourValue) {
	if (theirValue > ourValue) {
		color = "rgba(31, 255, 0, 0.2)"
	} else if (theirValue == ourValue) {
		color = "rgba(255, 255, 0, 0.2)"
	} else {
		color = "rgba(255, 0, 0, 0.2)"
	}
	ourValue = stripTags(addCommas(ourValue))
	theirValue = stripTags(addCommas(theirValue))
	valueHTML = `<span style="margin-top: 25px;background-color:${color};padding-left:5px;padding-right:5px;" class="font-caption-body text-date-hint text trade-sent-date ng-binding" ng-bind="trade.created | date:'shortDate'"><span class="icon icon-robux-16x16" style="background-image:url(https://ropro.io/images/ropro_icon_small.png);background-position:1px 0px;background-size:80%;"></span>${ourValue}<hr style="padding:0px;margin:0px"><span class="icon icon-robux-16x16" style="background-image:url(https://ropro.io/images/ropro_icon_small.png);background-position:1px 0px;background-size:80%;"></span>${theirValue}</span>`
	return valueHTML
}


async function loadTradePreviews(tradesType) {
	waitForLoad(async function() {
		for (tradeid in tradeValues) {
			values = tradeValues[tradeid]
			tradeRows = document.getElementsByClassName(tradeid)
			if (tradeRows.length > 0) {
				tradeRow = tradeRows[0]
				if (tradeRow.getElementsByClassName('icon icon-robux-16x16').length == 0) {
					value0 = values[0][Object.keys(values[0])[0]]
					value1 = values[0][Object.keys(values[0])[1]]
					div = document.createElement("div")
					div.innerHTML += getValueHTML(value0, value1)
					tradeRow.getElementsByClassName('trade-row-details')[0].getElementsByTagName('div')[0].appendChild(div)
				}
			}
		}
	})
}

async function loadTrades() {
	removeDict = {}
	for (i = 0; i < tradesArray.length; i++) {
		tradeRows = $(".trade-row:not(.trade-id)").find(".text-lead:contains('" + stripTags(tradesArray[i]['user']['displayName']) + "')")
		tradeRow = tradeRows.get(0)
		if (typeof tradeRow != "undefined") {
			tradeRow = tradeRow.parentNode.parentNode.parentNode.parentNode
			tradeRow.classList.add("trade-id")
			tradeRow.classList.add(tradesArray[i]['id'])
			tradeRow.classList.add(tradesArray[i]['user']['displayName'])
			tradeRow.setAttribute("tradeid", stripTags(tradesArray[i]['id'].toString()))
			removeDict[i] = true
		}
	}
	for (i = tradesArray.length - 1; i >= 0; i--) {
		if (i in removeDict) {
			tradesArray.splice(i, 1)
		}
	}
	if (tradesArray.length < 50 && cursor != null && currentlyLoading == false) {
		currentlyLoading = true
		await fetchTrades(tradeType)
		currentlyLoading = false
	}
}

async function getTrades() {
	tradeRows = $(".trade-row.trade-id:not(.loaded)")
	if (tradeRows.length > 0) {
		trades = []
		for (i = 0; i < tradeRows.length; i++) {
			tradeRow = tradeRows[i]
			tradeRow.classList.add("loaded")
			if (tradeRow.hasAttribute("tradeid")) {
				trade = fetchTrade(tradeRow.getAttribute("tradeid"))
				trades.push(trade)
			}
		}
		Promise.all(trades).then(async (values) => {
			trades = {data:[]}
			trades.data = values
			tradeValues = await fetchValues(trades)
			for (key in tradeValues) {
				tradeRow = document.getElementsByClassName(key.toString())[0]
				trade = tradeValues[key]
				if (Object.keys(trade[0])[0] != myUsername) {
					value0 = trade[0][Object.keys(trade[0])[0]]
					value1 = trade[0][Object.keys(trade[0])[1]]
				} else {
					value0 = trade[0][Object.keys(trade[0])[1]]
					value1 = trade[0][Object.keys(trade[0])[0]]
				}
				if (typeof trade != 'undefined') {
					valueDiv = document.createElement("div")
					valueDiv.innerHTML += getValueHTML(value0, value1)
					tradeRow.getElementsByClassName('trade-row-details')[0].getElementsByTagName('div')[0].appendChild(valueDiv)
				}
			}
		})
	}
}

function addListeners() {
	document.getElementById('tab-Inbound').getElementsByTagName('a')[0].addEventListener("click", function(){
		cursor = ""
		tradeType = "inbound"
		tradeValues = {}
		currentlyLoading = false
		tradesArray = []
		loadTrades()
		getTrades()
	});

	document.getElementById('tab-Outbound').getElementsByTagName('a')[0].addEventListener("click", function(){
		cursor = ""
		tradeType = "outbound"
		tradeValues = {}
		currentlyLoading = false
		tradesArray = []
		loadTrades()
		getTrades()
	});

	document.getElementById('tab-Completed').getElementsByTagName('a')[0].addEventListener("click", function(){
		cursor = ""
		tradeType = "completed"
		tradeValues = {}
		currentlyLoading = false
		tradesArray = []
		loadTrades()
		getTrades()
	});

	document.getElementById('tab-Inactive').getElementsByTagName('a')[0].addEventListener("click", function(){
		cursor = ""
		tradeType = "inactive"
		tradeValues = {}
		currentlyLoading = false
		tradesArray = []
		loadTrades()
		getTrades()
	});
}

async function doMain() {
	if (await fetchSetting("tradePreviews")) {
		unloaded = false
		addListeners()
		setTimeout(function() {
			tradeBarHeight = document.getElementsByClassName('simplebar-content')[1].scrollHeight
			tradeTypeOld = tradeType
			setInterval(async function() {
				if (typeof document.getElementsByClassName('simplebar-content')[1] != "undefined") {
					loadTrades()
					getTrades()
					tradeBarHeight = document.getElementsByClassName('simplebar-content')[1].scrollHeight
					tradeTypeOld = tradeType
					if (unloaded == true) {
						addListeners()
						unloaded = false
					}
				} else {
					tradesArray = []
					tradeValues = {}
					cursor = ""
					unloaded = true
				}
			}, 200)
		}, 100)
		myUsername = await fetchUsername()
	}
}
doMain()
