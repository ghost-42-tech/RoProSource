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


chrome.runtime.onMessage.addListener(function(request,sender,sendResponse)
{
	if(request.greeting === "GetURL")
	{
		if (request.url.includes("ropro.io")) {
			$.post(request.url, function(data) {
				sendResponse(data);
			}).fail(function() {
				sendResponse("ERROR")
			})
		} else {
			$.get(request.url, function(data) {
				sendResponse(data);
			}).fail(function() {
				sendResponse("ERROR")
			})
		}
	}else if(request.greeting === "PostURL") {
		$.ajax({
			url: request.url,
			type: "POST",
			data: request.jsonData,
			success: function(data) {
				sendResponse(data);
			}
		})
	}else if(request.greeting === "PostValidatedURL") {
		$.ajax({
			url: request.url,
			type: "POST",
			headers: {"X-CSRF-TOKEN": myToken},
			contentType: 'application/json',
			data: request.jsonData,
			success: function(data) {
				if (!("errors" in data)) {
					sendResponse(data);
				} else {
					sendResponse(null)
				}
			}
		})
	}else if(request.greeting === "GetUserID") {
		$.get('https://www.roblox.com/mobileapi/userinfo', function(data,error,res) {
			sendResponse(data['UserID'])
		})
	}else if(request.greeting === "GetUsername") {
		async function getUsername(){
			username = await getStorage("rpUsername")
			sendResponse(username)
		}
		getUsername()
	}else if(request.greeting === "GetUserInventory") {
			async function getInventory(){
				inventory = await loadInventory(request.userID)
				sendResponse(inventory)
			}
			getInventory()
	}else if(request.greeting === "GetUserServer") {
			async function getServer(){
				server = await serverSearch(request.username, request.gameID)
				sendResponse(server)
			}
			getServer()
	}else if(request.greeting === "GetMaxPlayerIndex") {
			async function getIndex(){
				index = await maxPlayerCount(request.gameID, request.count)
				sendResponse(index)
			}
			getIndex()
	}else if(request.greeting === "GetLowPingServers") {
			async function getServerList(){
				serverList = await lowPingServers(request.gameID, request.startIndex, request.maxServers)
				sendResponse(serverList)
			}
			getServerList()
	}else if(request.greeting === "GetSetting") {
		async function getSettings(){
			setting = await loadSettings(request.setting)
			sendResponse(setting)
		}
		getSettings()
	}else if(request.greeting === "GetSettingValidity") {
		async function getSettingValidity(){
			valid = await loadSettingValidity(request.setting)
			sendResponse(valid)
		}
		getSettingValidity()
	}else if(request.greeting === "SyncSettings") {
		syncSettings()
		setTimeout(function(){
			sendResponse("sync")
		}, 500)
	}else if(request.greeting === "OpenOptions") {
		chrome.tabs.create({url: chrome.extension.getURL('options.html')})
	}else if (request.greeting === "GetSubscription") {
		async function doGetSubscription() {
			subscription = await getStorage("rpSubscription")
			sendResponse(subscription)
		}
		doGetSubscription()
	}else if (request.greeting === "DeclineBots") {
		async function doDeclineBots() {
			tradesDeclined = await declineBots()
			sendResponse(tradesDeclined)
		}
		doDeclineBots()
	}

	return true;
})

var disabledFeatures = "";

$.get("https://ropro.io/api/disabledFeatures.php", function(data) {
		disabledFeatures = data
})

function getStorage(key) {
	return new Promise(resolve => {
		chrome.storage.sync.get(key, function (obj) {
			resolve(obj[key])
		})
	})
}

function setStorage(key, value) {
	return new Promise(resolve => {
		chrome.storage.sync.set({[key]: value}, function(){
			resolve()
		})
	})
}

var defaultSettings = {buyButton: true,comments: true,dealCalculations: "rap",dealNotifier: true,embeddedRolimonsItemLink: true,embeddedRolimonsUserLink: true,fastestServersSort: true,gameLikeRatioFilter: true,gameTwitter: true,genreFilters: true,groupDiscord: true,groupRank: true,groupTwitter: true,itemPageValueDemand: true,linkedDiscord: true,liveLikeDislikeFavoriteCounters: true,livePlayers: true,liveVisits: true,moreGameFilters: true,notificationThreshold: 30,ownerHistory: true,profileThemes: true,profileValue: true,projectedWarningItemPage: true,quickItemSearch: true,quickTradeResellers: true, hideSerials: true,quickUserSearch: true,randomGame: true,reputation: true,reputationVote: true,sandbox: true,sandboxOutfits: true,serverSizeSort: true, singleSessionMode: false,tradeDemandRatingCalculator: true,tradeItemDemand: true,tradeItemValue: true,tradeNotifier: true,tradeOffersPage: true,tradeOffersSection: true,tradeOffersValueCalculator: true,tradePageProjectedWarning: true,tradePreviews: true,tradeProtection: true,tradeValueCalculator: true,valueThreshold: 0,hideTradeBots:true,autoDeclineTradeBots:true,hideDeclinedNotifications:false,hideOutboundNotifications:false,tradeBotDefender:true,quickDecline:true,quickCancel:true,roproIcon:true, underOverRAP:true};

async function initializeSettings() {
	return new Promise(resolve => {
		async function checkSettings() {
			initialSettings = await getStorage('rpSettings')
			if (typeof initialSettings === "undefined") {
				await setStorage("rpSettings", defaultSettings)
				resolve()
			} else {
				changed = false
				for (key in Object.keys(defaultSettings)) {
					settingKey = Object.keys(defaultSettings)[key]
					if (!(settingKey in initialSettings)) {
						initialSettings[settingKey] = defaultSettings[settingKey]
						changed = true
					}
				}
				if (changed) {
					console.log("SETTINGS UPDATED")
					await setStorage("rpSettings", initialSettings)
				}
			}
		}
		checkSettings()
	})
}
initializeSettings()

async function maxPlayerCount(gameID, count) {
	if(await loadSettings("serverSizeSort")) {
		return new Promise(resolve => {
			$.get("https://www.roblox.com/games/getgameinstancesjson?placeId=" + gameID + "&startIndex=0", function(data){
				var i = 0;
				var j = data.TotalCollectionSize;
				var done = false;
				var closest = 9999;
				var closestIndex = 0;
				var lastIndex = -1;
				for (k = 0; k < data.Collection.length; k++) {
					if (data.Collection[k].CurrentPlayers.length <= count) {
						resolve(k)
					}
				}
				function getServer(index) { //Binary search algorithm to search servers by max player count - O(log(n))
					if (index == lastIndex) {
						resolve(closestIndex)
					} else {
						lastIndex = index
						$.get("https://www.roblox.com/games/getgameinstancesjson?placeId=" + gameID + "&startIndex=" + index, function(data){
							min = 9999
							if (data.Collection.length > 0) {
								for (k = 0; k < data.Collection.length; k++) {
									collection = data.Collection[k]
									if (Math.abs((collection.CurrentPlayers.length - count)) < closest) {
										closest = Math.abs((collection.CurrentPlayers.length - count))
										closestIndex = index + k + 1
									}
									if (collection.CurrentPlayers.length == count) {
										resolve(index + k)
										done = true
									} else {
										min = Math.min(collection.CurrentPlayers.length, min)
									}
								}
							}
							if (done == false) {
								if (min == 9999 || min < count) { //Gotta check larger servers
									j = index
									if (j - 1 > i) {
										getServer(Math.floor((j + i) / 2) + 1)
									} else {
										resolve(closestIndex)
									}
								} else { //Gotta check smaller servers
									i = index
									if (i + 1 < j) {
										getServer(Math.floor((j + i) / 2) - 1)
									} else {
										resolve(closestIndex)
									}
								}
							}
						})
					}
				}
				getServer(Math.floor((j + i) / 2))
			})
		})
	} else {
		return 0
	}
}

async function lowPingServers(gameID, startIndex, maxServers) {
	if(await loadSettings("fastestServersSort")) {
		return new Promise(resolve => {
				var serverArray = []
				function quicksortServer(array) { //Quicksort implementation for sorting servers by ping - O(n*log(n))
				
					function partition(low, high) {
						var pivot = array[low];
						var i = low;
						var j = high;
						var temp;
						while (i < j) {
							do {
								i++;
							} while(i < array.length && array[i].Ping <= pivot.Ping);
							do {
								j--;
							} while(j >= 0 && array[j].Ping > pivot.Ping);
							if (i < j) { //Swap the two values if i hasn't yet passed j
								temp = array[i];
								array[i] = array[j];
								array[j] = temp;
							}
						}
						temp = array[low]; //i has passed j, swap to get new pivot
						array[low] = array[j];
						array[j] = temp;
						return j; //new pivot
					}
					
					function quicksort(low, high) {
						if (low < high) {
							var j = partition(low, high);
							quicksort(low, j);
							quicksort(j + 1, high);
						}
					}
					
					quicksort(0, array.length - 1);
					
				}
				
				function getServer(gameIndex) {
					return new Promise(resolve => {
						$.get("https://www.roblox.com/games/getgameinstancesjson?placeId=" + gameID + "&startIndex=" + gameIndex, function(data){
							for (j = 0; j < data.Collection.length; j++) {
								if (data.Collection[j].Ping > 0) {
									serverArray.push(data.Collection[j]);
								}
							}
							resolve();
						});
					});
				}
				var promises = [];
				for (i = startIndex; i < startIndex + maxServers; i = i + 10) { //Check first 100 servers after startIndex
					promises.push(getServer(i));
				}
				Promise.all(promises).then((values) => {
					quicksortServer(serverArray);
					serverArray.pop();
					console.log("FOUND " + serverArray.length + " SERVERS");
					for (i = 0; i < Math.min(serverArray.length, 10); i++) {
						console.log("SERVER #" + (i + 1) + " WITH " + serverArray[i].Ping + " PING: " + serverArray[i].Guid);
					}
					resolve(serverArray);
				})
		})
	} else {
		return []
	}
}

async function serverSearch(username, gameID) {
	return new Promise(resolve => {
		$.get('https://api.roblox.com/users/get-by-username?username=' + username, function(data) {
			if (typeof data.Id == 'undefined') {
				resolve("User Does Not Exist!")
			}
			userID = data.Id
			console.log(userID)
			$.get('https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds='+userID+'&size=48x48&format=Png&isCircular=false', function(data) {
				imageUrl = data.data[0].imageUrl
				console.log(imageUrl)
				var totalSize = 999999
				function getServer(index) {
					if (index*10 > totalSize) {
						resolve("Not Found!")
					} else {
						setTimeout(function() {
							getServer(index + 1)
						}, 10)
					}
					console.log(index)
					$.get("https://www.roblox.com/games/getgameinstancesjson?placeId=" + gameID + "&startIndex=" + (index * 10), function(data) {
						for (i = 0; i < data.Collection.length; i++) {
							players = data.Collection[i].CurrentPlayers
							for (j = 0; j < players.length; j++) {
								player = players[j]
								if (player.Thumbnail.Url == imageUrl) {
									console.log("FOUND PLAYER")
									data.Collection[i].thumbnailToFind = player.Thumbnail.Url
									totalSize = -1
									resolve(data.Collection[i])
								}
							}
							if (totalSize == 999999) {
								totalSize = data.TotalCollectionSize
							}
						}
					})
				}
				getServer(0)
			})
		})
	})
}

async function getPage(userID, assetType, cursor) {
	return new Promise(resolve => {
		$.get('https://inventory.roblox.com/v1/users/' + userID + '/assets/collectibles?cursor=' + cursor + '&sortOrder=Desc&limit=100&assetType=' + assetType, function(data) {
			resolve(data)
		})
	})
}

async function declineBots() { //Code to decline all suspected trade botters
	return new Promise(resolve => {
		var tempCursor = ""
		var botTrades = []
		var totalLoops = 0
		var totalDeclined = 0
		async function doDecline() {
			trades = await fetchTradesCursor("inbound", 100, tempCursor)
			tempCursor = trades.nextPageCursor
			tradeIds = []
			userIds = []
			for (i = 0; i < trades.data.length; i++) {
				tradeIds.push([trades.data[i].user.id, trades.data[i].id])
				userIds.push(trades.data[i].user.id)
			}
			if (userIds.length > 0) {
				flags = await fetchFlagsBatch(userIds)
				flags = JSON.parse(flags)
				for (i = 0; i < tradeIds.length; i++) {
					try{
						if (flags.includes(tradeIds[i][0].toString())) {
							botTrades.push(tradeIds[i][1])
						}
					} catch (e) {
						console.log(e)
					}
				}
			}
			if (totalLoops < 20 && tempCursor != null) {
				setTimeout(function(){
					doDecline()
					totalLoops += 1
				}, 100)
			} else {
				if (botTrades.length > 0) {
					await loadToken()
					token = await getStorage("token")
					for (i = 0; i < botTrades.length; i++) {
						console.log(i, botTrades.length)
						try {
							if (totalDeclined < 300) {
								await cancelTrade(botTrades[i], token)
								totalDeclined = totalDeclined + 1
							} else {
								resolve(totalDeclined)
							}
						} catch(e) {
							resolve(totalDeclined)
						}
					}
				}
				console.log("Declined " + botTrades.length + " trades!")
				resolve(botTrades.length)
			}
		}
		doDecline()
	})
}

async function fetchFlagsBatch(userIds) {
	return new Promise(resolve => {
		$.post("https://ropro.io/api/fetchFlags.php?ids=" + userIds.join(","), function(data){ 
			resolve(data)
		})
	})
}

function createNotification(notificationId, options) {
	return new Promise(resolve => {
		chrome.notifications.create(notificationId, options, function() {
			resolve()
		})
	})	
}

async function loadInventory(userID) {
	myInventory = {}
	assetType = null
	async function handleAsset(cursor) {
		response = await getPage(userID, assetType, cursor)
		for (j = 0; j < response.data.length; j++) {
			item = response.data[j]
			if (item['assetId'] in myInventory) {
				myInventory[item['assetId']]['quantity']++
			} else {
				myInventory[item['assetId']] = item
				myInventory[item['assetId']]['quantity'] = 1
			}
		}
		if (response.nextPageCursor != null) {
			await handleAsset(response.nextPageCursor)
		}
	}
	await handleAsset("")
	total = 0
	for (item in myInventory) {
	  total += myInventory[item]['quantity']
	}
	console.log("Inventory loaded. Total items: " + total)
	return myInventory
}

function fetchTrades(tradesType, limit) {
	return new Promise(resolve => {
		$.get("https://trades.roblox.com/v1/trades/" + tradesType + "?cursor=&limit=" + limit + "&sortOrder=Desc", function(data) {
			resolve(data)
		})
	})
}

function fetchTradesCursor(tradesType, limit, cursor) {
	return new Promise(resolve => {
		$.get("https://trades.roblox.com/v1/trades/" + tradesType + "?cursor=" + cursor + "&limit=" + limit + "&sortOrder=Desc", function(data) {
			resolve(data)
		})
	})
}

function fetchTrade(tradeId) {
	return new Promise(resolve => {
		$.get("https://trades.roblox.com/v1/trades/" + tradeId, function(data) {
			resolve(data)
		})
	})
}

function fetchValues(trades) {
	return new Promise(resolve => {
		$.ajax({
			url:'https://ropro.io/api/tradeProtectionBackend.php',
			type:'POST',
			data: trades,
			success: function(data) {
				resolve(data)
			}
		})
	})
}

function cancelTrade(id, token) {
	return new Promise(resolve => {
		$.ajax({
			url:'https://trades.roblox.com/v1/trades/' + id + '/decline',
			headers: {'X-CSRF-TOKEN':token},
			type:'POST',
			success: function(data) {
				resolve(data)
			},
			error: function(xhr, ajaxOptions, thrownError) {
				resolve("")
			}
		})
	})
}

async function doFreeTrialActivated() {
	chrome.tabs.create({url: "https://ropro.io?installed"})
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

var myToken;

function loadToken() {
	return new Promise(resolve => {
		$.ajax({
			url:'https://roblox.com',
			type:'GET',
			success: function(data) {
				token = data.split("Roblox.XsrfToken.setToken('")[1].split("');")[0]
				restrictSettings = !data.includes('data-isunder13=false')
				myToken = token
				chrome.storage.sync.set({'token': token})
				chrome.storage.sync.set({'restrictSettings': restrictSettings})
				resolve(token)
			}
		})
	})
}

async function fetchSharedSecret() { //Because Roblox offers no public OAuth API (at the time of writing this), RoPro uses a shared secret between the user & server for validation. This shared secret is the Sale ID of their first ever purchase on Roblox.
	return new Promise(resolve => {
		$.ajax({
			url: 'https://www.roblox.com/My/money.aspx/getmytransactions', //Sale IDs are only used because they are secret to the user, we do not store the content of any transactions; just the Sale ID of the first one. Roblox, if you are reading this please consider adding a public OAuth API so I don't have to do something this hacky.
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({transactiontype: "purchase", startindex: 0, exclusivestartindex: 0}),
			dataType: 'json',
			success: function(data) {
				jsonData = JSON.parse(data.d)
				totalCount = parseInt(jsonData.TotalCount)
				if (totalCount == 0) {
					resolve(0)
				} else {
					$.ajax({
						url: 'https://www.roblox.com/My/money.aspx/getmytransactions',
						type: 'POST',
						contentType: 'application/json',
						data: JSON.stringify({transactiontype: "purchase", startindex: totalCount - 1, exclusivestartindex: 0}),
						dataType: 'json',
						success: function(data) {
							jsonData = JSON.parse(data.d)
							jsonData = JSON.parse(jsonData.Data[0])
							saleID = jsonData.Sale_ID
							resolve(saleID)
						}, error: function(xhr, ajaxOptions, thrownError){
							resolve(0)
						}
					})
				}
			}, error: function(xhr, ajaxOptions, thrownError) {
				resolve(0)
			}
		})
	})
}

const SubscriptionManager = () => {
	let subscription = fetchSubscription()
	let date = Date.now()
	function fetchSubscription() {
		return new Promise(resolve => {
			async function doGet(resolve) {
				$.post("https://ropro.io/api/getSubscription.php?key=" + await getStorage("subscriptionKey"), function(data){
					setStorage("rpSubscription", data)
					resolve(data);
				})
			}
			doGet(resolve)
		})
	};
	const resetDate = () => {
		date = Date.now() - 70 * 2 * 1000
	};
	const getSubscription = () => {
		currSubscription = subscription
		if (Date.now() >= date + 65 * 2 * 1000) {
			subscription = fetchSubscription()
			date = Date.now()
		}
		return currSubscription;
	};
	const validateLicense = () => {
		$.get('https://www.roblox.com/mobileapi/userinfo', function(d1,e1,r1) {
			$.get('https://users.roblox.com/v1/users/authenticated', function(d2, e2, r2) {
				$.get(`https://users.roblox.com/v1/users/${d2.id}`, function(d3, e2, r3) {
					async function doValidate() {
						freeTrialActivated = await getStorage("freeTrialActivated")
						sharedSecret = await fetchSharedSecret()
						if (typeof freeTrialActivated != "undefined") {
							freeTrial = ""
						} else {
							freeTrial = "?free_trial=true"
						}
						r3.responseJSON.description = ""
						tempJSON = JSON.parse(r3.responseText)
						tempJSON.description = ""
						r3.responseText = JSON.stringify(tempJSON)
						$.ajax({
							url:'https://ropro.io/api/validateUser.php' + freeTrial,
							type:'POST',
							data: {'verification': `${btoa(JSON.stringify(r1))}.${btoa(JSON.stringify(r2))}.${btoa(JSON.stringify(r3).replace(/[\u0250-\ue007]/g, ''))}`, 'sharedSecret': sharedSecret},
							success: function(data) {
								if (data == "err") {
									console.log("User Validation failed. Please contact support: https://ropro.io/support")
								} else if (data.includes(",")) {
									userID = parseInt(data.split(",")[0]);
									username = data.split(",")[1].split(",")[0];
									setStorage("rpUserID", userID);
									setStorage("rpUsername", username);
									if (data.includes("pro_tier_free_trial_just_activated") && freeTrial.length > 0) {
										setStorage("freeTrialActivated", true)
										doFreeTrialActivated()
									}
								}
							}
						})
					}
					doValidate()
				})
			})
		})
	};
	return {
	  getSubscription,
	  resetDate,
	  validateLicense
	};
  }

const subscriptionManager = SubscriptionManager();

async function syncSettings() {
	subscriptionManager.resetDate()
	subscriptionManager.getSubscription()
}

async function loadSettingValidity(setting) {
	settings = await getStorage('rpSettings')
	restrictSettings = await getStorage('restrictSettings')
	restricted_settings = ["linkedDiscord", "gameTwitter", "groupTwitter", "groupDiscord"]
	standard_settings = ["serverSizeSort", "fastestServersSort", "moreGameFilters", "gameLikeRatioFilter", "quickUserSearch", "liveLikeDislikeFavoriteCounters", "sandboxOutfits", "tradeValueCalculator", "tradeDemandRatingCalculator", "tradeItemValue", "tradeItemDemand", "itemPageValueDemand", "tradePageProjectedWarning", "embeddedRolimonsItemLink", "embeddedRolimonsUserLink", "tradeOffersValueCalculator", "underOverRAP"]
	pro_settings = ["liveVisits", "livePlayers", "tradePreviews", "ownerHistory", "quickItemSearch", "tradeNotifier", "singleSessionMode",  "tradeProtection", "hideTradeBots", "autoDeclineTradeBots", "autoDecline", "declineThreshold", "cancelThreshold", "hideDeclinedNotifications", "hideOutboundNotifications"]
	ultra_settings = ["dealNotifier", "buyButton", "dealCalculations", "notificationThreshold", "valueThreshold", "projectedFilter"]
	subscriptionLevel = await subscriptionManager.getSubscription()
	valid = true
	if (subscriptionLevel == "free_tier") {
		if (standard_settings.includes(setting) || pro_settings.includes(setting) || ultra_settings.includes(setting)) {
			valid = false
		}
	} else if (subscriptionLevel == "standard_tier") {
		if (pro_settings.includes(setting) || ultra_settings.includes(setting)) {
			valid = false
		}
	} else if (subscriptionLevel == "pro_tier") {
		if (ultra_settings.includes(setting)) {
			valid = false
		}
	} else if (subscriptionLevel == "ultra_tier") {
		valid = true
	} else {
		valid = false
	}
	if (restricted_settings.includes(setting) && restrictSettings) {
		valid = false
	}
	if (disabledFeatures.includes(setting)) {
		valid = false
	}
	return new Promise(resolve => {
		resolve(valid)
	})
}

async function loadSettings(setting) {
	settings = await getStorage('rpSettings')
	if (typeof settings === "undefined") {
		await initializeSettings()
		settings = await getStorage('rpSettings')
	}
	restrictSettings = await getStorage('restrictSettings')
	restricted_settings = ["linkedDiscord", "gameTwitter", "groupTwitter", "groupDiscord"]
	standard_settings = ["serverSizeSort", "fastestServersSort", "moreGameFilters", "gameLikeRatioFilter", "quickUserSearch", "liveLikeDislikeFavoriteCounters", "sandboxOutfits", "tradeValueCalculator", "tradeDemandRatingCalculator", "tradeItemValue", "tradeItemDemand", "itemPageValueDemand", "tradePageProjectedWarning", "embeddedRolimonsItemLink", "embeddedRolimonsUserLink", "tradeOffersValueCalculator", "underOverRAP"]
	pro_settings = ["liveVisits", "livePlayers", "tradePreviews", "ownerHistory", "quickItemSearch", "tradeNotifier", "singleSessionMode",  "tradeProtection", "autoDecline", "declineThreshold", "cancelThreshold", "hideDeclinedNotifications"]
	ultra_settings = ["dealNotifier", "buyButton", "dealCalculations", "notificationThreshold", "valueThreshold", "projectedFilter"]
	subscriptionLevel = await subscriptionManager.getSubscription()
	valid = true
	if (subscriptionLevel == "free_tier") {
		if (standard_settings.includes(setting) || pro_settings.includes(setting) || ultra_settings.includes(setting)) {
			valid = false
		}
	} else if (subscriptionLevel == "standard_tier") {
		if (pro_settings.includes(setting) || ultra_settings.includes(setting)) {
			valid = false
		}
	} else if (subscriptionLevel == "pro_tier") {
		if (ultra_settings.includes(setting)) {
			valid = false
		}
	} else if (subscriptionLevel == "ultra_tier") {
		valid = true
	} else {
		valid = false
	}
	if (restricted_settings.includes(setting) && restrictSettings) {
		valid = false
	}
	if (disabledFeatures.includes(setting)) {
		valid = false
	}
	if (typeof settings[setting] === "boolean") {
		settingValue = settings[setting] && valid
	} else {
		settingValue = settings[setting]
	}
	return new Promise(resolve => {
		resolve(settingValue)
	})
}

async function getTradeValues(tradesType) {
	tradesJSON = await fetchTrades(tradesType)
	cursor = tradesJSON.nextPageCursor
	trades = {data: []}
	if (tradesJSON.data.length > 0) {
		for (i = 0; i < 1; i++) {
			offer = tradesJSON.data[i]
			tradeChecked = await getStorage("tradeChecked")
			if (offer.id != tradeChecked) {
				trade = await fetchTrade(offer.id)
				trades.data.push(trade)
			} else {
				return {}
			}
		}
		tradeValues = await fetchValues(trades)
		return tradeValues
	} else {
		return {}
	}
}

var tradesNotified = {};

async function getTrades(initial) {
	if (initial) {
		limit = 100
	} else {
		limit = 10
	}
	sections = [await fetchTrades("inbound", limit), await fetchTrades("outbound", limit), await fetchTrades("completed", limit), await fetchTrades("inactive", limit)]
	tradesList = await getStorage("tradesList")
	if (typeof tradesList == 'undefined' || initial) {
		tradesList = {"inboundTrades":{}, "outboundTrades":{}, "completedTrades":{}, "inactiveTrades":{}}
	}
	storageNames = ["inboundTrades", "outboundTrades", "completedTrades", "inactiveTrades"]
	newTrades = []
	for (i = 0; i < sections.length; i++) {
		section = sections[i]
		store = tradesList[storageNames[i]]
		tradeIds = []
		for (j = 0; j < section.data.length; j++) {
			tradeIds.push(section.data[j]['id'])
		}
		for (j = 0; j < tradeIds.length; j++) {
			tradeId = tradeIds[j]
			if (!(tradeId in store)) {
				tradesList[storageNames[i]][tradeId] = true
				newTrades.push({[tradeId]: storageNames[i]})
			}
		}
	}
	if (newTrades.length > 0) {
		if (!initial) {
			console.log("New trade!")
			await setStorage("tradesList", tradesList)
			if (newTrades.length < 9) {
				notifyTrades(newTrades)
			}
		} else {
			await setStorage("tradesList", tradesList)
		}
	}
}

var notifications = {}

async function notifyTrades(trades) {
	for (i = 0; i < trades.length; i++) {
		trade = trades[i]
		tradeId = Object.keys(trade)[0]
		tradeType = trade[tradeId]
		if (!(tradeId + "_" + tradeType in tradesNotified)) {
			tradesNotified[tradeId + "_" + tradeType] = true
			context = ""
			buttons = []
			switch (tradeType) {
				case "inboundTrades":
					context = "Trade Inbound"
					buttons = [{title: "Open"}, {title: "Decline"}]
					break;
				case "outboundTrades":
					context = "Trade Outbound"
					buttons = [{title: "Open"}, {title: "Cancel"}]
					break;
				case "completedTrades":
					context = "Trade Completed"
					buttons = [{title: "Open"}]
					break;
				case "inactiveTrades":
					context = "Trade Declined"
					buttons = [{title: "Open"}]
					break;
			}
			trade = await fetchTrade(tradeId)
			values = await fetchValues({data: [trade]})
			values = values[0]
			compare = values[values['them']] - values[values['us']]
			lossRatio = (1 - values[values['them']] / values[values['us']]) * 100
			console.log("Trade Loss Ratio: " + lossRatio)
			if (context == "Trade Inbound" && await loadSettings("autoDecline") && lossRatio >= await loadSettings("declineThreshold")) {
				console.log("Declining Trade, Trade Loss Ratio: " + lossRatio)
				cancelTrade(tradeId, await getStorage("token"))
			}
			if (context == "Trade Outbound" && await loadSettings("tradeProtection") && lossRatio >= await loadSettings("cancelThreshold")) {
				console.log("Cancelling Trade, Trade Loss Ratio: " + lossRatio)
				cancelTrade(tradeId, await getStorage("token"))
			}
			if (await loadSettings("tradeNotifier")) {
				compareText = "Win: +"
				if (compare > 0) {
					compareText = "Win: +"
				} else if (compare == 0) {
					compareText = "Equal: +"
				} else if (compare < 0) {
					compareText = "Loss: "
				}
				options = {type: "basic", title: context, iconUrl: values['themicon'], buttons: buttons, priority: 2, message:`Partner: ${values['them']}\nYour Value: ${addCommas(values[values['us']])}\nTheir Value: ${addCommas(values[values['them']])}`, contextMessage: compareText + addCommas(compare) + " Value", eventTime: Date.now()}
				notificationId = Math.floor(Math.random() * 10000000).toString()
				notifications[notificationId] = {type: "trade", tradeType: tradeType, tradeid: tradeId, buttons: buttons}
				if (context != "Trade Declined" || await loadSettings("hideDeclinedNotifications") == false) {
					await createNotification(notificationId, options)
				}
			}
		}
	}
}
var tradeNotifierInitialized = false
setTimeout(function() {
	setInterval(async function() {
		if (await loadSettings("tradeNotifier") || await loadSettings("autoDecline") || await loadSettings("tradeProtection")) {
			getTrades(!tradeNotifierInitialized)
			tradeNotifierInitialized = true
		} else {
			tradeNotifierInitialized = false
		}
	}, 5000)
}, 10000)

async function initialTradesCheck() {
	if (await loadSettings("tradeNotifier") || await loadSettings("autoDecline") || await loadSettings("tradeProtection")) {
		getTrades(true)
	}
}
initialTradesCheck()
setInterval(function(){
	initialTradesCheck()
}, 600000)

async function toggle(feature) {
	features = await getStorage("rpFeatures")
	featureBool = features[feature]
	if (featureBool) {
		features[feature] = false
	} else {
		features[feature] = true
	}
	await setStorage("rpFeatures", features)
}

setInterval(async function(){
	loadToken()
}, 30000)
loadToken()

setInterval(async function(){
	subscriptionManager.validateLicense()
}, 60000)
subscriptionManager.validateLicense()

function connectedNotification(notification) {
	var notificationOptions = {
		type: "basic",
		title: notification.subject,
		message: notification.message,
		iconUrl: "https://ropro.io/images/poweruser_icon.png"
	}
	chrome.notifications.create("", notificationOptions)
}

function generalNotification(notification) {
	console.log(notification)
	var notificationOptions = {
		type: "basic",
		title: notification.subject,
		message: notification.message,
		iconUrl: notification.icon
	}
	chrome.notifications.create("", notificationOptions)
}

function notificationValid(notification) {
	if (dealCalculations == "rap") {
		if (notification.rap >= valueThreshold) {
			return notification.rap_deal >= notificationThreshold
		}
	} else {
		if (notification.value >= valueThreshold) {
			return notification.value_deal >= notificationThreshold
		}
	}
}

async function notificationButtonClicked(notificationId, buttonIndex) { //Deal notification button clicked
	notification = notifications[notificationId]
	console.log(notification)
	if (notification['type'] == 'trade') {
		if (notification['tradeType'] == 'inboundTrades') {
			if (buttonIndex == 0) {
				chrome.tabs.create({ url: "https://www.roblox.com/trades" })
			} else if (buttonIndex == 1) {
				cancelTrade(notification['tradeid'], await getStorage('token'))
			}
		} else if (notification['tradeType'] == 'outboundTrades') {
			if (buttonIndex == 0) {
				chrome.tabs.create({ url: "https://www.roblox.com/trades#outbound" })
			} else if (buttonIndex == 1) {
				cancelTrade(notification['tradeid'], await getStorage('token'))
			}
		} else if (notification['tradeType'] == 'completedTrades') {
			chrome.tabs.create({ url: "https://www.roblox.com/trades#completed" })
		} else if (notification['tradeType'] == 'inactiveTrades') {
			chrome.tabs.create({ url: "https://www.roblox.com/trades#inactive" })
		}
	} else {
		if (buttonIndex == 0 && notification['buyButtons'].length == 2) {
			price = notification['price']
			myToken = await getStorage('token')
			$.get('http://api.roblox.com/marketplace/productinfo?assetId=' + notification['id'], function(data){
				productId = data['ProductId']
				itemName = data['Name']
				$.get('https://economy.roblox.com/v1/assets/' + notification['id'] + '/resellers?cursor=&limit=10', function(data){
					if (data.data[0].price == price) {
						$.ajax({
							url: 'https://economy.roblox.com/v1/purchases/products/' + productId,
							type: 'POST',
							data: {'expectedCurrency': 1, 'expectedPrice': data.data[0].price, 'expectedSellerId': data.data[0].seller.id, 'userAssetId': data.data[0].userAssetId},
							headers: {'X-CSRF-TOKEN': myToken},
							success: function(data) {
								if (data.purchased == false) {
									$.ajax({
										url: "https://thumbnails.roblox.com/v1/assets?assetIds=" + data.assetId + "&size=420x420&format=Png&isCircular=false",
										success:function(result, status, xhr){
											itemIconUrl = result.data[0].imageUrl
											generalNotification({"subject": "Purchase Failed - " + itemName, "message": data.errorMsg, "icon": itemIconUrl})
										}
									})
								} else {
									$.ajax({
										url: "https://thumbnails.roblox.com/v1/assets?assetIds=" + data.assetId + "&size=420x420&format=Png&isCircular=false",
										success:function(result, status, xhr){
											itemIconUrl = result.data[0].imageUrl
											generalNotification({"subject": "Successfully Purchased - " + itemName, "message": "Purchased for R$" + price, "icon": itemIconUrl})
										}
									})
								}
							},
							error: function(data) {
								$.ajax({
									url: "https://thumbnails.roblox.com/v1/assets?assetIds=" + data.assetId + "&size=420x420&format=Png&isCircular=false",
									success:function(result, status, xhr){
										itemIconUrl = result.data[0].imageUrl
										generalNotification({"subject": "Purchase Failed - " + itemName, "message": "Item no longer for sale.", "icon": itemIconUrl})
									}
								})
							}
						})
					} else {
						$.ajax({
							url: "https://thumbnails.roblox.com/v1/assets?assetIds=" + data.assetId + "&size=420x420&format=Png&isCircular=false",
							success:function(result, status, xhr){
								itemIconUrl = result.data[0].imageUrl
								generalNotification({"subject": "Purchase Failed - " + itemName, "message": "Item no longer for sale.", "icon": itemIconUrl})
							}
						})
					}
				})
			})
		} else if (buttonIndex == 1 || (buttonIndex == 0 && notification['buyButtons'].length == 1)) {
			chrome.tabs.create({ url: "https://www.roblox.com/catalog/" + notification['id'] + "/item" })
		}
	}
}

function notificationClicked(notificationId) {
	console.log(notificationId)
	notification = notifications[notificationId]
	console.log(notification)
	if (notification['type'] == 'trade') {
		if (notification['tradeType'] == 'inboundTrades') {
			chrome.tabs.create({ url: "https://www.roblox.com/trades" })
		}
		else if (notification['tradeType'] == 'outboundTrades') {
			chrome.tabs.create({ url: "https://www.roblox.com/trades#outbound" })
		}
		else if (notification['tradeType'] == 'completedTrades') {
			chrome.tabs.create({ url: "https://www.roblox.com/trades#completed" })
		}
		else if (notification['tradeType'] == 'inactiveTrades') {
			chrome.tabs.create({ url: "https://www.roblox.com/trades#inactive" })
		}
	}
	if (notification['type'] == 'deal') {
		chrome.tabs.create({ url: "https://www.roblox.com/catalog/" + notification['id'] + "/item" })
	}
}

var buyButton = true;
var dealCalculations = "rap";
var notificationThreshold = 30;
var valueThreshold = 0;

async function checkDealSettings() {
	buyButton = await loadSettings("buyButton");
	dealCalculations = await loadSettings("dealCalculations");
	notificationThreshold = await loadSettings("notificationThreshold");
	valueThreshold = await loadSettings("valueThreshold");
}

function dealNotification(notification) {
	console.log(notification)
	if (notificationValid(notification)) {
		id = notification.id
		name = notification.name
		rap = notification.rap
		value = notification.value
		price = notification.price
		rap_deal = notification.rap_deal
		value_deal = notification.value_deal
		title = `${name}`
		if (dealCalculations == "rap") {
			message = `Deal:     ${rap_deal}% off RAP\nPrice:    ${addCommas(price)}\nRAP:     ${addCommas(rap)}\nValue:   ${addCommas(value)}`
		} else {
			message = `Deal:     ${value_deal}% off Value\nPrice:    ${addCommas(price)}\nRAP:     ${addCommas(rap)}\nValue:   ${addCommas(value)}`
		}
		$.ajax({
			url: "https://thumbnails.roblox.com/v1/assets?assetIds=" + id + "&size=420x420&format=Png&isCircular=false",
			success:async function(result, status, xhr){
				itemIconUrl = result.data[0].imageUrl
				function checkProjected(id, price, rap, itemIconUrl) {
					$.get("https://economy.roblox.com/v1/assets/" + id + "/resellers?cursor=&limit=10", function(data){ 
						if (data.data.length > 1) {
							if (data.data[0].price == price && data.data[1].price >= rap * 0.9) {
								doNotify(itemIconUrl)
								console.log("Notifying: " + id)
							} else {
								console.log("Projected Filter: " + id)
							}
						} else {
							doNotify(itemIconUrl)
							console.log("Notifying: " + id)
						}
					})
				}
				function doNotify(itemIconUrl) {
					if (buyButton) {
						buyButtons = [{title: "Buy"}, {title: "Open"}]
					} else {
						buyButtons = [{title: "Open"}]
					}
					var notificationOptions = {
						type: "basic",
						title: title,
						message: message,
						contextMessage: `${addCommas(price)} P / ${addCommas(rap)} R / ${addCommas(value)} V`,
						iconUrl: itemIconUrl,
						buttons: buyButtons
					}
					notificationId = Math.floor(Math.random() * 1000000).toString()
					notifications[notificationId] = {type: "deal", id: id, price: price, buyButtons: buyButtons}
					chrome.notifications.create(notificationId, notificationOptions)
				}
				if (await loadSettings("projectedFilter")) {
					checkProjected(id, price, rap, itemIconUrl)
				} else {
					doNotify(itemIconUrl)
					console.log("Notifying: " + id)
				}
			}
		})
	}
}

chrome.notifications.onClicked.addListener(notificationClicked)

chrome.notifications.onButtonClicked.addListener(notificationButtonClicked)

function handleNotification(notification) {
	switch(notification.type) {
		case "connected":
			connectedNotification(notification);
			break;
		case "deal":
			dealNotification(notification);
			break;
	}
}

//WebSocket logic to listen for incoming notifications

var websocket;

async function createWebSocketConnection() {
    if((websocket == null || websocket == undefined) && 'WebSocket' in window && await loadSettings("dealNotifier")){
		subscriptionKey = await getStorage("subscriptionKey");
		userID = await getStorage("rpUserID");
		connect("ws://deals.ropro.io:8880?subscriptionKey=" + subscriptionKey + "&userID=" + userID);
    }
}

//Create a websocket connection to listen for notifications.
function connect(host) {
    if (websocket === undefined) {
        websocket = new WebSocket(host);
		console.log(websocket)
    }

    websocket.onopen = function() {
		console.log("opened")
/*         chrome.storage.local.get(["rpUserID"], function(user) {
            websocket.send(JSON.stringify({userLoginId: user}));
        }); */
    };

    websocket.onmessage = function (event) {
		console.log(event)
		try {
			var notification = JSON.parse(event.data);
			handleNotification(notification)
		} catch(err) {
			console.log("Notification Error.")
		}
    };

    //If the websocket is closed wait 5 seconds then create new connection
    websocket.onclose = function() {
		console.log("CLOSED")
        websocket = undefined;
		setTimeout(function() {
			createWebSocketConnection();
		}, 5000)
    };
};

//Close the websocket connection
function closeWebSocketConnection() {
    if (websocket != null || websocket != undefined) {
        websocket.close();
        websocket = undefined;
    }
}

createWebSocketConnection();
checkDealSettings();
setInterval(async function() {
	subscriptionLevel = await subscriptionManager.getSubscription()
	setStorage("rpSubscription", subscriptionLevel)
	if (await loadSettings("dealNotifier")) {
		checkDealSettings();
		createWebSocketConnection();
	} else {
		closeWebSocketConnection();
	}
	$.get("https://ropro.io/api/disabledFeatures.php", function(data) {
		disabledFeatures = data
	})
}, 30000)