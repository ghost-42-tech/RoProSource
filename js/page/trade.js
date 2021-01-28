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

function fetchItems(idList) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/tradeBackend.php?ids=" + idList.join(",")}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function fetchFlag(userId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/fetchFlag.php?id=" + userId},
			function(data) {
				resolve(data)
			}
		)
	})
}

function fetchFlagsBatch(userIds) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/fetchFlags.php?ids=" + userIds.join(",")},
			function(data) {
				resolve(data)
			}
		)
	})
}

function doDeclineBots() {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "DeclineBots"}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function flagTrader(userId, reqType) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/flagTrader.php?id=" + userId + "&reqType=" + reqType}, 
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

function getIdFromCard(item) {
	url = item.getElementsByClassName("item-card-caption")[0].getElementsByTagName("a")[0].href
	id = url.split("/catalog/")[1].split("/")[0]
	return id
}

function getIdFromTradeCard(item) {
	return item.getElementsByClassName('thumbnail-2d-container')[0].getAttribute("thumbnail-target-id")
}
async function getJSON() {
	itemList = []
	itemCards = document.getElementsByClassName("item-card-container")
	for (i = 0; i < itemCards.length; i++) {
		item = itemCards[i]
		itemList.push(getIdFromCard(item))
	}
	tradeItem = document.getElementsByClassName("trade-request-item ng-scope")
	for (i = 0; i < tradeItem.length; i++) {
		item = tradeItem[i]
		if (item.getElementsByClassName('thumbnail-2d-container')[0] != undefined) {
			itemList.push(getIdFromTradeCard(item))
		}
	}
	itemJSON = await fetchItems(itemList)
	return itemJSON
}

function itemOwnershipHistory(item) {
	uaid = stripTags(item.getAttribute("data-userassetid"))
	thumbnailContainer = item.getElementsByClassName("item-card-thumb-container")[0]
	historyTooltip = document.createElement("div")
	historyTooltip.innerHTML = '<a target="_blank" href="https://www.rolimons.com/uaid/'+uaid+'"><span style="transform:scale(0.8);left:4px;top:4px;bottom:initial;left:initial;" class="limited-icon-container tooltip-pastnames" data-toggle="tooltip" title="" data-original-title="Ownership History"> <span class="icon-pastname"></span> </span></a>'
	historySpan = historyTooltip.childNodes[0]
	historyTooltip.remove()
	thumbnailContainer.insertBefore(historySpan, thumbnailContainer.childNodes[1])
}

function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.abs(num) > 999999 ? Math.sign(num)*((Math.abs(num)/1000000).toFixed(1)) + 'm' : Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}

function formatItem(item, id, json, inWindow) {
	if (item.getAttribute("class").indexOf("loaded") == -1) {
		item.setAttribute("class", stripTags(item.getAttribute("class")) + " loaded")
		thumbnailContainer = item.getElementsByClassName("item-card-thumb-container")[0]
		robuxNode = item.getElementsByClassName("item-card-price")[0]
		if (inWindow) {
			robuxNode.setAttribute("style", "margin-top:-5px;margin-bottom:4px;")
		}
		valueNode = robuxNode.cloneNode(true)
		logoSpan = valueNode.getElementsByTagName("span")[0]
		valueSpan = valueNode.getElementsByTagName("span")[1]
		logoSpan.setAttribute("style", "background-image:url(https://ropro.io/images/ropro_icon_small.png);background-position:1px 0px;background-size:80%;")
		linkSpan = logoSpan.cloneNode(true)
		linkSpan.setAttribute("style", "background-image:none;background-position:1px 0px;background-size:80%;")
		linkSpan.innerHTML += '<a target = "_blank" href = "https://www.rolimons.com/item/' + id + '"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" width="1em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path class="linkpath" d="M10.586 13.414a1 1 0 0 1-1.414 1.414 5 5 0 0 1 0-7.07l3.535-3.536a5 5 0 0 1 7.071 7.071l-1.485 1.486a7.017 7.017 0 0 0-.405-2.424l.476-.476a3 3 0 1 0-4.243-4.243l-3.535 3.536a3 3 0 0 0 0 4.242zm2.828-4.242a1 1 0 0 1 1.414 0 5 5 0 0 1 0 7.07l-3.535 3.536a5 5 0 0 1-7.071-7.07l1.485-1.486c-.008.82.127 1.641.405 2.423l-.476.476a3 3 0 1 0 4.243 4.243l3.535-3.536a3 3 0 0 0 0-4.242 1 1 0 0 1 0-1.414z" fill="#fff"></path></svg></a>'
		if (tradeItemValue) {
			robuxNode.parentNode.appendChild(valueNode)
		}
		if (embeddedRolimonsItemLink) {
			valueNode.appendChild(linkSpan)
		}
		$(".linkpath").css("fill", $('body').css("color"))
		value = addCommas(parseInt(json[16]))
		demand = parseInt(json[17])
		if (json[16] == null) {
			value = stripTags(robuxNode.getElementsByTagName("span")[1].innerHTML)
		}
		if (json[17] == null) {
			demand = 1.001
		} else {
			demand++
		}
		if (json[20] != null && underOverRAP) {
			div = document.createElement('div')
			div.style.display = "inline-block"
			console.log(json[20])
			if (json[20] >= 0) {
				positiveHTML = `<span class="icon icon-robux-16x16" style="background-image:url(https://ropro.io/images/up_arrow.png);background-position:1px 2px;background-size:80%;width:12px;margin-left:-3px;margin-bottom:-1px;"><div style="color:#6ED102;vertical-align:middle;margin-bottom:7px;margin-left:11px;font-size:11px;display:inline-block;"><b>${kFormatter(parseInt(json[20]))}</b></div></span>`
				div.setAttribute("title", "Over RAP: +" + parseInt(json[20]))
				div.innerHTML += positiveHTML
			} else {
				negativeHTML = `<span class="icon icon-robux-16x16" style="background-image:url(https://ropro.io/images/down_arrow.png);background-position:1px 2px;background-size:80%;width:12px;margin-left:-3px;margin-bottom:-1px;"><div style="color:#CC0700;vertical-align:middle;margin-bottom:7px;margin-left:11px;font-size:11px;display:inline-block;"><b>${kFormatter(parseInt(json[20])).toString().replace("-","")}</b></div></span>`
				div.setAttribute("title", "Under RAP: " + parseInt(json[20]))
				div.innerHTML += negativeHTML
			}
			robuxNode.appendChild(div)
		}
		demandEquivalence = {"1.001":"Not Assigned", "0":"Projected", "1":"Terrible", "2":"Low", "3":"Normal", "4":"High", "5":"Amazing"}
		demandTooltip = document.createElement("span")
		demandTooltip.setAttribute("style", "left:initial; right:8px;")
		demandTooltip.setAttribute("class", "demand-tooltip limited-icon-container ng-isolate-scope")
		demandTooltip.setAttribute("uib-tooltip", "Demand: " + demandEquivalence[demand.toString()])
		demandTooltip.setAttribute("title", "Demand: " + demandEquivalence[demand.toString()])
		demandTooltip.setAttribute("tooltip-placement", "right")
		demandTooltip.setAttribute("tooltip-append-to-body", "true")
		demandTooltip.setAttribute("limited-icon", "")
		demandTooltip.setAttribute("layout-options", "userAsset.layoutOptions")
		demandTooltip.innerHTML = '<div class="demand-tooltip-text" style="padding:3px;font-size:12px;font-weight:500;color:hsla(0,0%,100%,.7);"> ' + demand.toFixed(1) + ' </div><span class="limited-number-container ng-hide" ng-show="layoutOptions.isUnique"> <span class="font-caption-header">#</span> <span class="font-caption-header text-subheader limited-number ng-binding ng-hide" ng-show="layoutOptions.isLimitedNumberShown" ng-bind="layoutOptions.limitedNumber"></span> </span>'
		if (tradeItemDemand) {
			thumbnailContainer.insertBefore(demandTooltip, thumbnailContainer.childNodes[1])
		}
		item.setAttribute("value", stripTags(value.replace(",","").replace(",","").replace(",","").replace(",","")))
		if (ownerHistory) {
			itemOwnershipHistory(item)
		}
		if (demand == 1.001) {
			demand = 1
		}
		item.setAttribute("demand", demand)
		valueSpan.innerHTML = stripTags(value);
		if (json[19] == 1) {
			setTimeout(function() {
				if (tradePageProjectedWarning) {
					projectedDisplay(item.getElementsByClassName('item-card-thumb-container')[0])
				}
			}, 500)
		}
	}
}

function formatTradeItem(item, id, json, inWindow) {
	if (item.getAttribute("class").indexOf("loaded") == -1) {
		item.setAttribute("class", item.getAttribute("class") + " loaded")
		robuxNode = item.getElementsByClassName('item-value')[0]
		logoSpan = robuxNode.childNodes[0].cloneNode(true)
		valueSpan = robuxNode.childNodes[1].cloneNode(true)
		logoSpan.setAttribute("style", "margin-left:5px; background-image:url(https://ropro.io/images/ropro_icon_small.png);background-position:3px 2px;background-size:80%;")
		linkSpan = logoSpan.cloneNode(true)
		linkSpan.setAttribute("style", "background-image:none;background-position:1px 0px;background-size:80%;")
		linkSpan.innerHTML += '<a style="margin-left:5px;" target = "_blank" href = "https://www.rolimons.com/item/' + id + '"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" width="1em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path class="linkpath" d="M10.586 13.414a1 1 0 0 1-1.414 1.414 5 5 0 0 1 0-7.07l3.535-3.536a5 5 0 0 1 7.071 7.071l-1.485 1.486a7.017 7.017 0 0 0-.405-2.424l.476-.476a3 3 0 1 0-4.243-4.243l-3.535 3.536a3 3 0 0 0 0 4.242zm2.828-4.242a1 1 0 0 1 1.414 0 5 5 0 0 1 0 7.07l-3.535 3.536a5 5 0 0 1-7.071-7.07l1.485-1.486c-.008.82.127 1.641.405 2.423l-.476.476a3 3 0 1 0 4.243 4.243l3.535-3.536a3 3 0 0 0 0-4.242 1 1 0 0 1 0-1.414z" fill="#fff"></path></svg></a>'
		value = addCommas(parseInt(json[16]))
		demand = parseInt(json[17])
		if (json[16] == null) {
			value = stripTags(robuxNode.getElementsByTagName("span")[1].innerHTML)
		}
		if (json[17] == null) {
			demand = 1.001
		} else {
			demand++
		}
		item.setAttribute("value", stripTags(value.replace(",","").replace(",","").replace(",","").replace(",","")))
		item.setAttribute("demand", demand)
		valueSpan.innerHTML = stripTags(value);
		robuxNode.appendChild(logoSpan)
		robuxNode.appendChild(valueSpan)
		if (embeddedRolimonsItemLink) {
			robuxNode.appendChild(linkSpan)
		}
		$(".linkpath").css("fill", $('body').css("color"))
		if (json[19] == 1) {
			setTimeout(function() {
				if (tradePageProjectedWarning) {
					projectedDisplay(item.getElementsByClassName('item-card-thumb-container')[0])
				}
			}, 500)
		}
	}
}

async function formatTrades(items) {
	if (items.getAttribute("class").indexOf("tradesloaded") == -1) {
		items.setAttribute("class", stripTags(items.getAttribute("class")) + " tradesloaded")
		itemCards = items.getElementsByClassName("item-card-container")
		totalTradeValue = 0
		totalTradeDemand = 0
		itemCount = 0
		robuxLine = items.getElementsByClassName('robux-line')[1]
		for (i = 0; i < itemCards.length; i++) {
			item = itemCards[i]
			value = parseInt(item.getAttribute("value"))
			demand = parseInt(item.getAttribute("demand"))
			totalTradeValue += value
			totalTradeDemand += demand*value
			itemCount++
		}
		totalTradeDemand = (totalTradeDemand / (totalTradeValue)).toFixed(1)
		if (tradeValueCalculator) {
			totalValue = '<div style="margin-top:-10px;" class="robux-line"> <span class="text-lead ng-binding" ng-bind="\'Label.TotalValue\' | translate">RoPro Rolimons Value:</span> <span class="robux-line-amount"> <span style="background-image:url(https://ropro.io/images/ropro_icon_small.png);background-position:1px 0px;background-size:80%;" class="icon-robux-16x16"></span><span class="text-robux-lg robux-line-value ng-binding">' + addCommas(totalTradeValue) + '</span> </span> </div>'
		} else {
			totalValue = ''
		}
		if (tradeDemandRatingCalculator) {
			totalDemand = '<div style = "margin-top:-10px;" class="robux-line"> <span class="text-lead ng-binding" ng-bind="\'Label.TotalValue\' | translate">RoPro Demand Rating:</span> <span class="robux-line-amount"> <span style="background-image:url(https://ropro.io/images/ropro_icon_small.png);background-position:1px 0px;background-size:80%;" class="icon-robux-16x16"></span><span class="text-robux-lg robux-line-value ng-binding">' + addCommas(totalTradeDemand) + '/5.0</span> </span> </div>'
		} else {
			totalDemand = ''
		}
		robuxLine.parentNode.innerHTML += totalValue + totalDemand
	}
}

function formatTradesWindow(items) {
		itemCards = items.getElementsByClassName("trade-request-item")
		totalTradeValue = 0
		totalTradeDemand = 0
		itemCount = 0
		robuxLine = items.getElementsByClassName('robux-line')[1]
		if (items.getElementsByClassName('thumbnail-2d-container')[0] != undefined) {
			for (i = 0; i < itemCards.length; i++) {
				item = itemCards[i]
				if (item.getElementsByClassName('thumbnail-2d-container')[0] != undefined) {
					value = parseInt(item.getAttribute("value"))
					demand = parseInt(item.getAttribute("demand"))
					totalTradeValue += value
					totalTradeDemand += demand*value
					itemCount++
				}
			}
			totalTradeDemand = (totalTradeDemand / (totalTradeValue)).toFixed(1)
		}
		robux = parseInt(items.getElementsByClassName('robux-line-value')[0].innerHTML.replace(",","").replace(",","").replace(",",""))
		totalTradeValue += Math.round(robux / 0.7)
		robuxLine.getElementsByClassName('robux-line-amount')[0].setAttribute("style", "height:0px;")
		if (items.getElementsByClassName('rolimons-value')[0] == undefined && items.getElementsByClassName('rolimons-demand')[0] == undefined) {
			if (tradeValueCalculator) {
				rolimonsLine = robuxLine.cloneNode(true)
				rolimonsLine.setAttribute("style", "margin-top:-5px")
				rolimonsLine.innerHTML = '<span style="margin-top:-5px;" class="rolimons-value text-lead ng-binding">RoPro Rolimons Value:</span> <span class="robux-line-amount"> <span style="background-image:url(https://ropro.io/images/ropro_icon_small.png);background-position:1px 0px;background-size:80%;" class="icon-robux-16x16"></span><span class="text-robux-lg rolimons-line-value robux-line-value ng-binding">' + addCommas(totalTradeValue) + '</span> </span>'
				robuxLine.parentNode.appendChild(rolimonsLine)
			}
			if (tradeDemandRatingCalculator) {
				rolimonsLine = robuxLine.cloneNode(true)
				rolimonsLine.setAttribute("style", "margin-top:-5px")
				rolimonsLine.innerHTML = '<span style="margin-top:-5px;" class="rolimons-demand text-lead ng-binding">Demand Rating:</span> <span class="robux-line-amount"> <span style="background-image:url(https://ropro.io/images/ropro_icon_small.png);background-position:1px 0px;background-size:80%;" class="icon-robux-16x16"></span><span class="text-robux-lg rolimons-line-demand robux-line-value ng-binding">' + addCommas(totalTradeDemand) + '/5.0</span> </span>'
				robuxLine.parentNode.appendChild(rolimonsLine)
			}
		} else {
			if (tradeValueCalculator) {
				items.getElementsByClassName('rolimons-line-value')[0].innerHTML = addCommas(totalTradeValue);
			}
			if (tradeDemandRatingCalculator) {
				items.getElementsByClassName('rolimons-line-demand')[0].innerHTML = totalTradeDemand + "/5.0";
			}
		}
}

function projectedDisplay(assetThumbnail) {
	if (typeof assetThumbnail != "undefined") {
		projectedHTML = `<span style="background: intial;background-color:initial;top:-2px;left:-2px;bottom:initial;" class="limited-icon-container ng-isolate-scope" uib-tooltip="Demand: Normal" title="Projected Item" tooltip-placement="top" tooltip-append-to-body="true" limited-icon="" layout-options="userAsset.layoutOptions"><img width="110" src="https://ropro.io/images/projected_icon.png"></span>`
		assetThumbnail.innerHTML += projectedHTML
	}
}

async function checkTrade() {
	itemJSON = await getJSON()
	itemCards = document.getElementsByClassName("item-card-container")
	for (i = 0; i < itemCards.length; i++) {
		item = itemCards[i]
		id = getIdFromCard(item)
		json = itemJSON[parseInt(id)]
		if (json == undefined) {
			json = "[\"NOT FOUND\",0,0,0,0,0,0,0,0,0,0,0,0,0,0,\"NOT FOUND\",0,0,0,null,null,null,0]"
			json[16] = 0
		}
		formatItem(item, id, JSON.parse(json), false)
	}
	formatTrades(document.getElementsByClassName('trade-list-detail-offer')[0])
	formatTrades(document.getElementsByClassName('trade-list-detail-offer')[1])
}

async function checkTradeWindow() {
	itemJSON = await getJSON()
	divJSON = document.createElement("div")
	divJSON.setAttribute("style", "display:none;")
	divJSON.setAttribute("class", "divJSON")
	divJSON.innerHTML = JSON.stringify(itemJSON)
	document.getElementsByTagName('body')[0].appendChild(divJSON)
	itemCards = document.getElementsByClassName("item-card-container")
	for (i = 0; i < itemCards.length; i++) {
		item = itemCards[i]
		id = getIdFromCard(item)
		json = itemJSON[parseInt(id)]
		if (json == undefined) {
			json = "[\"NOT FOUND\",0,0,0,0,0,0,0,0,0,0,0,0,0,0,\"NOT FOUND\",0,0,0,null,null,null,0]"
			json[16] = 0
			return
		}
		formatItem(item, id, JSON.parse(json), true)
	}
}

async function checkTradeWindowOffers() {
	divJSONs = document.getElementsByClassName('divJSON')
	if (divJSONs.length != 0){
		itemJSON = {}
		for (i = 0; i < divJSONs.length; i++) {
			divJSON = JSON.parse(divJSONs[i].innerHTML)
			//itemJSON = itemJSON.concat(divJSON)
			Object.keys(divJSON).forEach(function(id, json) {
				itemJSON[id] = divJSON[id]
			})
		}
		if (Object.keys(itemJSON).length > 0) {
			itemCards = document.getElementsByClassName("trade-request-item")
			itemFound = false
			for (i = 0; i < itemCards.length; i++) {
				item = itemCards[i]
				if (item.getElementsByClassName('thumbnail-2d-container')[0] != undefined) {
					id = getIdFromTradeCard(item)
					json = itemJSON[parseInt(id)]
					if (json == undefined) {
						json = "[\"NOT FOUND\",0,0,0,0,0,0,0,0,0,0,0,0,0,0,\"NOT FOUND\",0,0,0,null,null,null,0]"
						json[16] = 0
					}
					formatTradeItem(item, id, JSON.parse(json), true)
				}
			}
			formatTradesWindow(document.getElementsByClassName('trade-request-window-offer')[0])
			formatTradesWindow(document.getElementsByClassName('trade-request-window-offer')[1])
		}
		formatTradesWindow(document.getElementsByClassName('trade-request-window-offer')[0])
		formatTradesWindow(document.getElementsByClassName('trade-request-window-offer')[1])
	}else{
		setTimeout(checkTradeWindowOffers, 100)
	}
}

async function addTradeDetails(tradeRowDetails) {
	if (embeddedRolimonsUserLink) {
		tradeUserLink = tradeRowDetails.getElementsByClassName('avatar-card-link')[0].href
		tradeUserID = stripTags(tradeUserLink.split("/users/")[1].split("/profile")[0])
		div = document.createElement("div")
		div.style.display = "inline-block";
		div.style.marginLeft = "3px";
		div.style.paddingTop = "1px";
		rolimonsUserLinkHTML = `<span class="icon icon-robux-16x16 rolimons-user-link" style="background-image:none;background-position:1px 0px;background-size:80%;"><a target="_blank" href="https://www.rolimons.com/player/${tradeUserID}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" width="1em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path class="linkpath" d="M10.586 13.414a1 1 0 0 1-1.414 1.414 5 5 0 0 1 0-7.07l3.535-3.536a5 5 0 0 1 7.071 7.071l-1.485 1.486a7.017 7.017 0 0 0-.405-2.424l.476-.476a3 3 0 1 0-4.243-4.243l-3.535 3.536a3 3 0 0 0 0 4.242zm2.828-4.242a1 1 0 0 1 1.414 0 5 5 0 0 1 0 7.07l-3.535 3.536a5 5 0 0 1-7.071-7.07l1.485-1.486c-.008.82.127 1.641.405 2.423l-.476.476a3 3 0 1 0 4.243 4.243l3.535-3.536a3 3 0 0 0 0-4.242 1 1 0 0 1 0-1.414z" fill="#fff" style="fill: rgb(255, 255, 255);"></path></svg></a></span>`
		div.innerHTML += rolimonsUserLinkHTML
		tradeUserElement = tradeRowDetails.getElementsByClassName('text-lead ng-binding')[0]
		tradeUserElement.appendChild(div)
	}
	tradeRowDetails.classList.add("rolimons-user-link-added")
	if (quickDecline && $('.rbx-selection-label:contains("Inbound")').length > 0) {
		hint = tradeRowDetails.getElementsByClassName('text-date-hint ng-binding')[0]
		if (hint.innerHTML == "Open") {
			div = document.createElement("a")
			div.display = "inline-block"
			div.innerHTML = " | <a>Decline</a>"
			hint.appendChild(div)
			console.log("add")
			div.getElementsByTagName('a')[0].addEventListener("click", function(){
				setTimeout(function(){
					decline = $(".btn-control-md:contains('Decline'):not('.ng-hide')")
					decline.click()
					document.getElementById('modal-action-button').click()
				}, 200)
			})
		}
	}
	if (quickCancel && $('.rbx-selection-label:contains("Outbound")').length > 0) {
		hint = tradeRowDetails.getElementsByClassName('text-date-hint ng-binding')[0]
		if (hint.innerHTML == "Open") {
			div = document.createElement("a")
			div.display = "inline-block"
			div.innerHTML = " | <a>Cancel</a>"
			hint.appendChild(div)
			console.log("add")
			div.getElementsByTagName('a')[0].addEventListener("click", function(){
				setTimeout(function(){
					decline = $(".btn-control-md:contains('Decline'):not('.ng-hide')")
					decline.click()
					document.getElementById('modal-action-button').click()
				}, 200)
			})
		}
	}
}

async function addBatchTradeDetails(tradeRows) {
	if (tradeBotDefender) {
		userIds = []
		tradeRowArray = []
		for (i = 0; i < tradeRows.length; i++) {
			tradeRow = tradeRows[i]
			tradeUserLink = tradeRow.getElementsByClassName('avatar-card-link')[0].href
			tradeUserID = tradeUserLink.split("/users/")[1].split("/profile")[0]
			tradeRowArray.push([tradeUserID, tradeRow])
			userIds.push(tradeUserID)
		}
		tradeFlags = await fetchFlagsBatch(userIds)
		tradeFlags = JSON.parse(tradeFlags)
		for (i = 0; i < tradeFlags.length; i++) {
			function addFlag(i) {
				setTimeout(function() {
					for (j = 0; j < tradeRowArray.length; j++) {
						if (tradeRowArray[j][0] == tradeFlags[i]) {
							thumbnail = tradeRowArray[j][1].getElementsByClassName('thumbnail-2d-container')[0].getElementsByTagName('img')[0]
							thumbnail.setAttribute("old-src", stripTags(thumbnail.src))
							thumbnail.src = "https://ropro.io/images/robot.png"
						}
					}
				}, 200)
			}
			addFlag(i)
		}
	}
}

function toggleSerials() {
	serialContainers = document.getElementsByClassName('limited-number-container')
	for (i = 0; i < serialContainers.length; i++) {
		serialContainer = serialContainers[i]
		serials = serialContainer.getElementsByTagName('span');
		for (j = 0; j < serials.length; j++) {
			serials[j].classList.toggle("text-blur")
		}
	}
}

function addHideButton(tradeTitle) {
	div = document.createElement("div")
	div.classList.add("inactive")
	div.style.display = "inline-block";
	hideHTML = '<img class="hide-button" style="width:20px;margin-top:-3px;cursor:pointer;" title="Hide Serials (for screenshots)" src="https://ropro.io/images/serials_on.png">'
	div.innerHTML += hideHTML
	if (tradeTitle.parentNode.parentNode.getElementsByClassName('text-label ng-binding')[0].classList.contains("ng-hide")) {
		tradeTitle.parentNode.parentNode.getElementsByClassName('text-label ng-binding')[0].innerHTML = "Hide Serials: "
		tradeTitle.parentNode.parentNode.getElementsByClassName('text-label ng-binding')[0].classList.remove("ng-hide")
	}
	tradeTitle.parentNode.parentNode.getElementsByClassName('text-label ng-binding')[0].appendChild(div)
	tradeTitle.classList.add("hide-button-inserted")
	console.log("add")
	div.addEventListener("click", function() {
		if (this.classList.contains("inactive")) {
			this.classList.remove("inactive")
			this.getElementsByTagName('img')[0].src = "https://ropro.io/images/serials_off.png"
			toggleSerials()
		} else {
			this.classList.add("inactive")
			this.getElementsByTagName('img')[0].src = "https://ropro.io/images/serials_on.png"
			toggleSerials()	
		}
	})
}

async function addTradeFlag(tradeTitle) {
	tradeTitle.classList.add("trade-flag-inserted")
	if (tradeTitle.getElementsByClassName('trade-flag').length == 0) {
		if ($('.light-theme').length > 0) {
			theme = "lightmode"
		} else {
			theme = "darkmode"
		}
		username = stripTags(tradeTitle.innerHTML.split(" ")[tradeTitle.innerHTML.split(" ").length - 1])
		row = $(".trade-row-container:contains('"+username+"')")
		if (row.length > 0) {
			userID = parseInt(row.get(0).getElementsByClassName('thumbnail-2d-container')[0].getAttribute("thumbnail-target-id"))
			flag = await fetchFlag(userID)
			div = document.createElement("div")
			div.style.display = "inline-block";
			div.style.position = "relative";
			div.classList.add("trade-flag-div")
			if (flag == "0") {
				flagHTML = '<img src="https://ropro.io/images/trade_flag_inactive_' + theme + '2.png" class="trade-flag" style="margin-top:-10px;margin-left:10px;width:30px;cursor:pointer;"><div class="trade-flag-info input-group input-field" style="border-radius:10px;z-index:1000;position:absolute;top:-10px;left:50px;">Flag as Trade Bot</div>'
			} else {
				flagHTML = '<img src="https://ropro.io/images/trade_flag_active_' + theme + '2.png" class="active trade-flag" style="margin-top:-10px;margin-left:10px;width:30px;cursor:pointer;"><div class="trade-flag-info input-group input-field" style="border-radius:10px;z-index:1000;position:absolute;top:-10px;left:50px;">User Flagged as Bot</div>'
			}
			div.innerHTML += flagHTML
			tradeTitle.appendChild(div)
			console.log("add")
			div.getElementsByTagName('img')[0].addEventListener("click", function() {
				if (this.classList.contains("active")) {
					row = $(".trade-row-container:contains('"+username+"')")
					for (i = 0; i < row.length; i++) {
						thumbnail = row.get(i).getElementsByClassName('thumbnail-2d-container')[0].getElementsByTagName('img')[0]
						thumbnail.src = thumbnail.getAttribute("old-src")
					}
					this.classList.remove("active")
					this.src = "https://ropro.io/images/trade_flag_inactive_" + theme + "2.png"
					this.parentNode.getElementsByTagName('div')[0].innerHTML = "Flag as Trade Bot"
					flagTrader(userID, "remove")
				} else {
					row = $(".trade-row-container:contains('"+username+"')")
					for (i = 0; i < row.length; i++) {
						thumbnail = row.get(i).getElementsByClassName('thumbnail-2d-container')[0].getElementsByTagName('img')[0]
						thumbnail.setAttribute("old-src", stripTags(thumbnail.src))
						thumbnail.src = "https://ropro.io/images/robot.png"
					}
					this.classList.add("active")
					this.src = "https://ropro.io/images/trade_flag_active_" + theme + "2.png"
					this.parentNode.getElementsByTagName('div')[0].innerHTML = "User Flagged as Bot"
					flagTrader(userID, "add")
				}
			})
		}
	}
}

async function declineBots() {
	document.getElementById('decliningBots').style.display = "block"
	tradesDeclined = await doDeclineBots()
	oldHTML = document.getElementById('decliningBots').innerHTML
	document.getElementById('decliningBots').innerHTML = "Declined " + tradesDeclined + " bot trades."
	document.getElementById('decliningBots').style.marginTop = "-18px";
	document.getElementById('tab-Inbound').getElementsByTagName('a')[0].click()
	setTimeout(function(){
		document.getElementById('decliningBots').style.display = "none"
		document.getElementById('decliningBots').style.marginTop = "-23px";
		document.getElementById('decliningBots').innerHTML = oldHTML
	}, 2000)
}

var tradeValueCalculator = false;
var tradeDemandRatingCalculator = false;
var tradeItemValue = false;
var tradeItemDemand = false;
var tradePageProjectedWarning = false;
var embeddedRolimonsItemLink = false;
var ownerHistory = false;
var quickDecline = false;
var quickCancel = false;
var tradeBotDefender = false;
var embeddedValueChart = true;
var underOverRAP = false;

window.onload = async function() {
	if (location.href.includes("/trade")) {
		if (parent.location.hash == "#outbound") {
			document.getElementById('tab-Outbound').getElementsByTagName('a')[0].click()
			parent.location.hash = ""
		} else if (parent.location.hash == "#completed") {
			document.getElementById('tab-Completed').getElementsByTagName('a')[0].click()
			parent.location.hash = ""
		} else if (parent.location.hash == "#inactive") {
			document.getElementById('tab-Inactive').getElementsByTagName('a')[0].click()
			parent.location.hash = ""
		}
		document.getElementsByClassName('content')[0].setAttribute('style', 'margin-bottom:300px;')
		values = ["0", "0"]
		tradeValueCalculator = await fetchSetting("tradeValueCalculator");
		tradeDemandRatingCalculator = await fetchSetting("tradeDemandRatingCalculator");
		tradeItemValue = await fetchSetting("tradeItemValue");
		tradeItemDemand = await fetchSetting("tradeItemDemand");
		tradePageProjectedWarning = await fetchSetting("tradePageProjectedWarning");
		embeddedRolimonsItemLink = await fetchSetting("embeddedRolimonsItemLink");
		embeddedRolimonsUserLink = await fetchSetting("embeddedRolimonsUserLink");
		ownerHistory = await fetchSetting("ownerHistory");
		hideSerials = await fetchSetting("hideSerials");
		quickDecline = await fetchSetting("quickDecline");
		quickCancel = await fetchSetting("quickCancel");
		tradeBotDefender = await fetchSetting("tradeBotDefender");
		underOverRAP = await fetchSetting("underOverRAP");
		if (embeddedValueChart) {
			headers = document.getElementsByClassName('trades-header')
			if (headers.length > 0) {
				links = headers[0].getElementsByClassName('text-link text-secondary ng-binding')
				if (links.length > 0) {
					link = links[0]
					link.removeAttribute('href')
					link.innerHTML = "<a target='_blank' href='https://www.rolimons.com/raprequirements'>RAP Requirements Chart</a>"
					//img = document.createElement('img')
					//img.setAttribute("style", "width:600px;z-index:10000;position:absolute;left:0px;top:20px;")
					//img.setAttribute("src", "https://ropro.io/images/value_chart.png")
					//img.style.display = "none";
					if (tradeBotDefender) {
						div = document.createElement("div");
						div.innerHTML += '<a id="decliningBots" style="display:none; position: relative; float:right;font-size:15px;margin-top:-23px;"><img style="width:30px;margin-right:5px;margin-bottom:3px;" src="https://ropro.io/images/ropro_icon_animated.gif">Declining all bots...</a>'
						headers[0].appendChild(div)
						li = document.createElement("li")
						li.setAttribute("style", "background-color:#CF2525;color:white;")
						li.innerHTML = '<a> <span class="ng-binding">Decline all Bots</span> </a>'
						headers[0].getElementsByClassName('dropdown-menu')[0].appendChild(li)
						li.addEventListener("click", function(){
							declineBots()
						})
					}
				}
			}
		}
		setInterval(function() {
			offerHeader = document.getElementsByClassName('trade-list-detail-offer-header')[0]
			if (offerHeader != undefined) {
				if (offerHeader.getAttribute("class").indexOf("checked") == -1) {
					offerHeader.setAttribute("class", stripTags(offerHeader.getAttribute("class")) + " checked")
					if (tradeValueCalculator || tradeDemandRatingCalculator || tradeItemValue || tradeItemDemand) {
						checkTrade()
					}
				}
			}
			tradeWindow = document.getElementsByClassName('trade-request-window')[0]
			if (tradeWindow != undefined) {
				inventoryPanel = document.getElementsByClassName('trade-inventory-panel')[0]
				if (inventoryPanel != undefined) {
					cardContainer = inventoryPanel.getElementsByClassName('item-card-container')[0]
					if (cardContainer != undefined && cardContainer.getAttribute("class").indexOf("checked") == -1) {
						cardContainer.setAttribute("class", stripTags(cardContainer.getAttribute("class")) + " checked")
						if (tradeValueCalculator || tradeDemandRatingCalculator || tradeItemValue || tradeItemDemand) {
							checkTradeWindow()
						}
					}
				}
				inventoryPanel = document.getElementsByClassName('trade-inventory-panel')[1]
				if (inventoryPanel != undefined) {
					cardContainer = inventoryPanel.getElementsByClassName('item-card-container')[0]
					if (cardContainer != undefined && cardContainer.getAttribute("class").indexOf("checked") == -1) {
						cardContainer.setAttribute("class", stripTags(cardContainer.getAttribute("class")) + " checked")
						if (tradeValueCalculator || tradeDemandRatingCalculator || tradeItemValue || tradeItemDemand) {
							checkTradeWindow()
						}
					}
				}
			}
			tradeWindowOffers = document.getElementsByClassName('trade-request-window-offers')[0]
			if (tradeWindowOffers != undefined) {
				cardContainer = document.getElementsByClassName('trade-request-item')[0]
				if (cardContainer != undefined && cardContainer.getAttribute("class").indexOf("checked") == -1) {
					cardContainer.setAttribute("class", stripTags(cardContainer.getAttribute("class")) + " checked")
					if (tradeValueCalculator || tradeDemandRatingCalculator || tradeItemValue || tradeItemDemand) {
						checkTradeWindowOffers()
					}
				} else {
					if (cardContainer != undefined) {
						myRobux = stripTags(document.getElementsByClassName('trade-request-window-offer')[0].getElementsByClassName('robux-line-value')[0].innerHTML)
						theirRobux = stripTags(document.getElementsByClassName('trade-request-window-offer')[1].getElementsByClassName('robux-line-value')[0].innerHTML)
						if (myRobux != values[0] || theirRobux != values[1]) {
							values[0] = myRobux
							values[1] = theirRobux
							if (tradeValueCalculator || tradeDemandRatingCalculator || tradeItemValue || tradeItemDemand) {
								checkTradeWindowOffers()
							}
						}
					}
				}
			}
			if (tradeBotDefender) {
				tradeTitle = $(".trades-header-nowrap .paired-name:not('.ng-hide'):not('.trade-flag-inserted')")
				added = false
				for (i = 0; i < tradeTitle.length; i++) {
					if (!tradeTitle.get(i).parentNode.parentNode.classList.contains('trade-request-window')) {
						addTradeFlag(tradeTitle.get(i))
						added = true
					}
				}
			}
			if (hideSerials) {
				tradeTitle = $(".trades-header-nowrap .paired-name:not('.ng-hide'):not('.hide-button-inserted')")
				for (i = 0; i < tradeTitle.length; i++) {
					if (!tradeTitle.get(i).parentNode.parentNode.classList.contains('trade-request-window')) {
						addHideButton(tradeTitle.get(i))
					}
				}
				$(".trade-row-container").click(function(){
					hideButtonImage = $('.hide-button')
					if (hideButtonImage.length > 0) {
						hideButtonImage.get(0).src = "https://ropro.io/images/serials_on.png"
						hideButtonImage.get(0).parentNode.classList.add("inactive")
					}
				})
			}
			tradeRowDetails = $(".trade-row-details:not(.rolimons-user-link-added)")
			if (tradeRowDetails.length > 0) {
				tradeRows = []
				for (i = 0; i < tradeRowDetails.length; i++) {
					addTradeDetails(tradeRowDetails.get(i))
					tradeRows.push(tradeRowDetails.get(i))
				}
				addBatchTradeDetails(tradeRows)
				$(".trade-row-container:not('.click-detection')").click(function(){
					tradeTitle = $(".trades-header-nowrap .paired-name.trade-flag-inserted:not('.ng-hide')")
					for (i = 0; i < tradeTitle.length; i++) {
						if (!tradeTitle.get(i).parentNode.parentNode.classList.contains('trade-request-window')) {
							console.log(tradeTitle.get(i))
							tradeTitle.get(i).classList.remove("trade-flag-inserted")
						}
					}
				})
				$(".trade-row-container:not('.click-detection')").addClass("click-detection")
			}
		}, 100)
	}
}