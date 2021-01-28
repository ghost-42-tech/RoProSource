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


var sandboxHTML = `
<div style="margin-top:4px;margin-left:15px;">
	<h1 style="display:inline-block;" class="ng-binding">RoPro Avatar Sandbox <img class="sandbox-icon-big" style="height:60px;margin-bottom:0px;" src="https://ropro.io/images/sandbox_icon.svg"></h1>
	<div id="upgradeCTA" style="margin-top:20px;float:right;display:inline-block;" class="upgrade-cta catalog-header"> <div style="display:inline-block;margin-right:5px;" class="ng-binding">Upgrade to save your outfits!</div>
	<a style="display:inline-block;" class="btn-primary-md ng-binding" target="_blank" href="https://ropro.io#upgrade-standard">Upgrade</a> </div>
	<div style="pointer-events: none;position:relative;display:inline-block;float:left;max-height:610px;" id = "maincontent">
		<div style="pointer-events:initial;position:relative;width:970px;" class="sandbox-frame" id="sandboxFrame">
			<iframe class="sandbox-iframe" style="position:absolute;display:block;width:970px;" id="loaderView" src="https://ropro.io/3dviewer/?load"></iframe>
			<iframe class="sandbox-iframe" style="" id="sandboxView" src="https://ropro.io/3dviewer/?load"></iframe>
			<span id="fullscreenToggle" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.5'" style="opacity:0.5;position:absolute;bottom:10px;right:10px;z-index:100;width:40px;height:37px;" class="sandbox-fullscreen-toggle fullscreen toggle-three-dee btn-control btn-control-small ng-binding"><img id="fullscreenImage" src="https://ropro.io/images/fullscreen_0.png" style="height:20px;margin:-10px;" onclick=""></span>
		</div>
			<div style="float:left;position:relative;width:277px;" id="wearing">
				<h5 style="padding-bottom:0px;" class="ng-binding">Outfit Cost: <span>
					<span id="outfitCostLoading" style="margin:-7px;transform: scale(0.6); width: 100px; height: 25px; visibility: initial !important;" class="spinner spinner-default"></span>
					<div id="outfitCostDiv" style="display:none;">
					<span style="margin-left:-5px;margin-right:-8px;margin-bottom:2px;transform: scale(0.6);" id="nav-robux" class="icon-robux-28x28 roblox-popover-close"></span>
					<span style="font-size:15px;" class="rbx-text-navbar-right text-header" id="outfitCostRobux">
				</span></div></span></h5>
				<h3 style="padding-bottom:0px;" class="ng-binding">Currently Wearing</h3>
				<p style="margin-top:-2px;font-size:13px;" class="ng-binding">Click an item to unequip it.</p>
				<div style="line-height:0px;pointer-events:initial;" id="wearingContainer"></div>
			</div>
			<div style="position:relative;width:277px;" id="backgroundChoice">
				<h3 style="margin-top:5px;float:left;padding-bottom:0px;" class="ng-binding">Background</h3>
				<p style="float:left;margin-top:-2px;font-size:13px;" class="ng-binding">Choose a background below.</p>
				<div style="float:left;pointer-events:initial;" id="backgroundContainer">
				<div><div id="default" style="display:inline-block;width:50px;height:50px;margin:2px;" class="thumbnail-2d-container background-selector"><a style="position:relative;">
				<img class="item-card-thumb-container" style="width:100%;height:100%;" src="https://ropro.io/3dviewer/backgrounds/default_background.png">
				<img src="https://ropro.io/images/checkmark_done.gif" class="background-checkmark-image active" style="pointer-events:none;transform:scale(0.4);overflow:visible;width:164px;height:126px;position:absolute;right:-57px;top:-52px;">
				</a>
				</div></div>
				<div><div id="sky" style="display:inline-block;width:50px;height:50px;margin:2px;" class="thumbnail-2d-container background-selector"><a style="position:relative;">
				<img class="item-card-thumb-container" style="width:100%;height:100%;" src="https://ropro.io/3dviewer/backgrounds/sky_background.png">
				<img src="https://ropro.io/images/empty.png" class="background-checkmark-image active" style="pointer-events:none;transform:scale(0.4);overflow:visible;width:164px;height:126px;position:absolute;right:-57px;top:-52px;">
				</a>
				</div></div>
				<div><div id="crossroads" style="display:inline-block;width:50px;height:50px;margin:2px;" class="thumbnail-2d-container background-selector"><a style="position:relative;">
				<img class="item-card-thumb-container" style="width:100%;height:100%;" src="https://ropro.io/3dviewer/backgrounds/crossroads_background.png">
				<img src="https://ropro.io/images/empty.png" class="background-checkmark-image active" style="pointer-events:none;transform:scale(0.4);overflow:visible;width:164px;height:126px;position:absolute;right:-57px;top:-52px;">
				</a>
				</div></div>
				<div><div id="roblox_hq" style="display:inline-block;width:50px;height:50px;margin:2px;" class="thumbnail-2d-container background-selector"><a style="position:relative;">
				<img class="item-card-thumb-container" style="width:100%;height:100%;" src="https://ropro.io/3dviewer/backgrounds/roblox_hq_background.png">
				<img src="https://ropro.io/images/empty.png" class="background-checkmark-image active" style="pointer-events:none;transform:scale(0.4);overflow:visible;width:164px;height:126px;position:absolute;right:-57px;top:-52px;">
				</a>
				</div></div>
				<div><div id="trade_hangout" style="display:inline-block;width:50px;height:50px;margin:2px;" class="thumbnail-2d-container background-selector"><a style="position:relative;">
				<img class="item-card-thumb-container" style="width:100%;height:100%;" src="https://ropro.io/3dviewer/backgrounds/trade_hangout_background.png">
				<img src="https://ropro.io/images/empty.png" class="background-checkmark-image active" style="pointer-events:none;transform:scale(0.4);overflow:visible;width:164px;height:126px;position:absolute;right:-57px;top:-52px;">
				</a>
				</div></div>
				<div><div id="playground" style="display:inline-block;width:50px;height:50px;margin:2px;" class="thumbnail-2d-container background-selector"><a style="position:relative;">
				<img class="item-card-thumb-container" style="width:100%;height:100%;" src="https://ropro.io/3dviewer/backgrounds/playground_background.png">
				<img src="https://ropro.io/images/empty.png" class="background-checkmark-image active" style="pointer-events:none;transform:scale(0.4);overflow:visible;width:164px;height:126px;position:absolute;right:-57px;top:-52px;">
				</a>
				</div></div>
				<div><div id="shuttle2" style="display:inline-block;width:50px;height:50px;margin:2px;" class="thumbnail-2d-container background-selector"><a style="position:relative;">
				<img class="item-card-thumb-container" style="width:100%;height:100%;" src="https://ropro.io/3dviewer/backgrounds/shuttle2_background.png">
				<img src="https://ropro.io/images/empty.png" class="background-checkmark-image active" style="pointer-events:none;transform:scale(0.4);overflow:visible;width:164px;height:126px;position:absolute;right:-57px;top:-52px;">
				</a>
				</div></div>
				<div><div id="school" style="display:inline-block;width:50px;height:50px;margin:2px;" class="thumbnail-2d-container background-selector"><a style="position:relative;">
				<img class="item-card-thumb-container" style="width:100%;height:100%;" src="https://ropro.io/3dviewer/backgrounds/school_background.png">
				<img src="https://ropro.io/images/empty.png" class="background-checkmark-image active" style="pointer-events:none;transform:scale(0.4);overflow:visible;width:164px;height:126px;position:absolute;right:-57px;top:-52px;">
				</a>
				</div></div>
				<div><div id="oval_office" style="display:inline-block;width:50px;height:50px;margin:2px;" class="thumbnail-2d-container background-selector"><a style="position:relative;">
				<img class="item-card-thumb-container" style="width:100%;height:100%;" src="https://ropro.io/3dviewer/backgrounds/oval_office_background.png">
				<img src="https://ropro.io/images/empty.png" class="background-checkmark-image active" style="pointer-events:none;transform:scale(0.4);overflow:visible;width:164px;height:126px;position:absolute;right:-57px;top:-52px;">
				</a>
				</div></div>
				<div><div id="pirate" style="display:inline-block;width:50px;height:50px;margin:2px;" class="thumbnail-2d-container background-selector"><a style="position:relative;">
				<img class="item-card-thumb-container" style="width:100%;height:100%;" src="https://ropro.io/3dviewer/backgrounds/pirate_background.png">
				<img src="https://ropro.io/images/empty.png" class="background-checkmark-image active" style="pointer-events:none;transform:scale(0.4);overflow:visible;width:164px;height:126px;position:absolute;right:-57px;top:-52px;">
				</a>
				</div></div>
							<div style="margin-top:5px;float:left;position:relative;width:277px;" id="roproOutfits">
				<!--<h3 style="padding-bottom:0px;" class="ng-binding">RoPro Outfits </h3>
				<p style="margin-top:-2px;font-size:13px;" class="ng-binding">Try on pre-made outfits.</p>
				<div style="pointer-events:initial;" id="premadeOutfitContainer"></div>-->
			</div>
			<div style="margin-top:5px;float:left;position:relative;width:277px;height:100px;" id="myOutfits">
				<h3 style="padding-bottom:0px;" class="ng-binding">My Outfits <button id="createOutfitButton" type="button" class="btn-fixed-width-lg btn-growth-lg" style="margin-top:7px;background-color:#0084dd;border:0px;width:60px;font-size:15px;padding:2px;float:right;">Save</button></h3>
				<div style="display:none;" id="outfitNameGroup" class="outfit-input-group">
				<input id="outfitNameInput" style="border-radius:5px;margin-bottom:0px;margin-top:2px;padding-left:10px;" class="form-control input-field outfit-name-input" placeholder="Outfit Name" maxlength="50" ng-keypress="" ng-model="">
				<p style="margin-left:3px;margin-bottom:10px;font-size:12px;" class="ng-binding">Press the enter key to submit outfit name.
				</p></div>
				<p id="outfitSubtitle" style="margin-top:-2px;font-size:13px;" class="ng-binding">Name and save your outfit.</p>
				<div style="pointer-events:initial;line-height:0px;" id="outfitContainer"></div>
			</div>
				</div>
			</div>
	</div>
	<div class="catalog-tabs" style="float:right;" id="catalogcontent">
		<a index="1" style="font-size:13px;" class="catalog-tab active">Limiteds</a>
		<a index="2" style="font-size:13px;" class="catalog-tab">Accessories</a>
		<a index="3" style="font-size:13px;" class="catalog-tab">More</a>
		<a index="4" style="font-size:13px;" class="catalog-tab">UGC</a>
		<a index="5" style="font-size:13px;" class="catalog-tab">Clothing</a>
		<a index="6" style="font-size:13px;" class="catalog-tab">Bundles</a>
	</div>
	<div id="Limiteds">
	</div>
	<div id="Accessories">
	</div>
	<div id="More">
	</div>
	<div id="UGC">
	</div>
	<div id="Clothing">
	</div>
	<div id="Bundles">
	</div>
</div>
`

var wearing = []
var wearingCostDict = {}
var wearingInfoDict = {}
var sorts = {
	"Limiteds":{"Most Popular":"?Category=2&limit=30&Subcategory=2&SortType=1&SortAggregation=5", "All Limiteds":"?category=Collectibles&limit=30&subcategory=Collectibles", "Accessories":"?category=Collectibles&limit=30&subcategory=Accessories", "Faces":"?category=Collectibles&limit=30&subcategory=Faces", "Gear":"?category=Collectibles&limit=30&subcategory=Gear"},
	"Accessories":{"All Accessories":"?category=Accessories&creatorTargetId=1&limit=30&subcategory=Accessories", "Hats": "?category=Accessories&creatorTargetId=1&limit=30&subcategory=Hats", "Hair": "?category=Accessories&creatorTargetId=1&limit=30&subcategory=HairAccessories", "Face":"?category=Accessories&creatorTargetId=1&limit=30&subcategory=FaceAccessories", "Neck":"?category=Accessories&creatorTargetId=1&limit=30&subcategory=NeckAccessories", "Shoulder":"?category=Accessories&creatorTargetId=1&limit=30&subcategory=ShoulderAccessories", "Front":"?category=Accessories&creatorTargetId=1&limit=30&subcategory=FrontAccessories", "Back":"?category=Accessories&creatorTargetId=1&limit=30&subcategory=BackAccessories", "Waist":"?category=Accessories&creatorTargetId=1&limit=30&subcategory=WaistAccessories"},
	"More":{"Faces": "?category=BodyParts&limit=30&subcategory=Faces", "Gear": "?category=Gear&limit=30&subcategory=Gear", "Heads":"?category=BodyParts&limit=30&subcategory=Heads"},
	"UGC":{"All Accessories":"?category=CommunityCreations&limit=30&subcategory=CommunityCreations", "Hats": "?category=CommunityCreations&limit=30&subcategory=Hats", "Hair": "?category=CommunityCreations&limit=30&subcategory=HairAccessories", "Face":"?category=CommunityCreations&limit=30&subcategory=FaceAccessories", "Neck":"?category=CommunityCreations&limit=30&subcategory=NeckAccessories", "Shoulder":"?category=CommunityCreations&limit=30&subcategory=ShoulderAccessories", "Front":"?category=CommunityCreations&limit=30&subcategory=FrontAccessories", "Back":"?category=CommunityCreations&limit=30&subcategory=BackAccessories", "Waist":"?category=CommunityCreations&limit=30&subcategory=WaistAccessories"},
	"Clothing":{"All Clothing":"?category=Clothing&limit=30&subcategory=Clothing", "Shirts":"?category=Clothing&limit=30&subcategory=Shirts", "T-Shirts": "?category=Clothing&limit=30&subcategory=Tshirts", "Pants":"?category=Clothing&limit=30&subcategory=Pants"},
	"Bundles":{"Bundles":"?category=BodyParts&limit=30&subcategory=Bundles"}
	}
var subsort = {
	"Limiteds":["",""],
	"Accessories":["",""],
	"More":["",""],
	"UGC":["",""],
	"Clothing":["",""],
	"Bundles":["",""]
	}
var cursors = {
	"Limiteds":["",""],
	"Accessories":["",""],
	"More":["",""],
	"UGC":["",""],
	"Clothing":["",""],
	"Bundles":["",""]
	}
var currentTab = "Limiteds"
var currentSort = "Most Popular"
var currentPage = null
var activeTab = null
var pageLoading = false
var tabs = {}
var background = "default"

function fetchAssetsView(assetIds) {
	return new Promise(resolve => {
		function getURL(assetIds) {
			chrome.runtime.sendMessage({greeting: "GetURL", url:"https://avatar.roblox.com/v1/try-on/3d?assetIds="+assetIds.join(",")+"&addAccoutrements=false"}, 
				function(data) {
					if (JSON.stringify(assetIds) == JSON.stringify(wearing)) {
						if (data != "ERROR") {
							if (data.final) {
								resolve(data.url)
							} else {
								setTimeout(function(){
									getURL(assetIds)
								}, 3000)
							}
						} else {
							console.log("ERROR")
							setTimeout(function(){
								getURL(assetIds)
							}, 3000)
						}
					} else {
						resolve("CANCELLED")
					}
				})
		}
		getURL([...assetIds])
	})
}

function fetchAssetsView2D(assetIds) {
	return new Promise(resolve => {
		function getURL(assetIds) {
			chrome.runtime.sendMessage({greeting: "GetURL", url:"https://avatar.roblox.com/v1/try-on/2d?assetIds="+assetIds.join(",")+"&width=420&height=420&format=png&addAccoutrements=false"}, 
				function(data) {
					if (data != "ERROR") {
						resolve(data.url)
					} else {
						console.log("ERROR")
						setTimeout(function(){
							getURL(assetIds)
						}, 3000)
					}
				})
		}
		getURL(assetIds)
	})
}

function fetchCurrentlyWearing(userId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://avatar.roblox.com/v1/users/"+userId+"/avatar"}, 
			function(data) {
					resolve(data)
			})
	})
}

function fetchBundleDetails(bundleId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://catalog.roblox.com/v1/bundles/details?bundleIds=" + bundleId}, 
			function(data) {
					resolve(data)
			})
	})
}

function fetchBundleDetailsBulk(bundleIds) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://catalog.roblox.com/v1/bundles/details?bundleIds=" + bundleIds.join(",")}, 
			function(data) {
					resolve(data)
			})
	})
}

function fetchOutfitDetails(outfitId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://avatar.roblox.com/v1/outfits/" + outfitId + "/details"}, 
			function(data) {
					resolve(data)
			})
	})
}

function fetchPage(sort, keyword, cursor) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://catalog.roblox.com/v1/search/items" + sort + "&cursor=" + cursor + "&keyword=" + keyword + "&includeNotForSale=true"}, 
			function(data) {
					resolve(data)
			})
	})
}

function createNewOutfit(outfitAssets, outfitName, outfitThumbnail, userId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/createOutfit.php?userid=" + userId + "&outfitAssets=" + outfitAssets.join(",") + "&outfitName=" + outfitName + "&outfitThumbnail=" + outfitThumbnail}, 
			function(data) {
					resolve(data)
			})
	})
}

function updateThumbnail(userID, outfitAssets, newThumbnail) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/updateOutfitThumbnail.php?userid=" + userID + "&outfitAssets=" + outfitAssets.join(",") + "&outfitThumbnail=" + newThumbnail}, 
			function(data) {
					resolve(data)
			})
	})
}

function deleteOutfit(userID, outfitAssets) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/deleteOutfit.php?userid=" + userID + "&outfitAssets=" + outfitAssets.join(",")}, 
			function(data) {
					resolve(data)
			})
	})
}

function fetchDetails(items) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "PostValidatedURL", url:"https://catalog.roblox.com/v1/catalog/items/details", jsonData: JSON.stringify(items)}, 
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

function fetchOutfits(userID) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/loadOutfits.php?userid=" + userID}, 
			function(data) {
					resolve(data)
			})
	})
}

function fetchAssetDetails(assetId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://api.roblox.com/marketplace/productinfo?assetId=" + assetId}, 
			function(data) {
					resolve(data)
			})
	})
}

function fetchLimitedSellers(assetId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://economy.roblox.com/v1/assets/" + assetId + "/resellers?cursor=&limit=10"}, 
			function(data) {
					resolve(data)
			})
	})
}

function getStorage(key) {
	return new Promise(resolve => {
		chrome.storage.sync.get(key, function (obj) {
			resolve(obj[key])
		})
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

function totalOutfitCost() {
	total = 0
	offsale = 0
	for (key in wearingCostDict) {
		if (wearingCostDict[key] != null) {
			total += wearingCostDict[key]
		} else {
			offsale += 1
		}
	}
	return [total, offsale]
}

function stripTags(s) {
	if (typeof s == "undefined") {
		return s
	}
	return s.replace(/(<([^>]+)>)/gi, "").replace(/</g, "").replace(/>/g, "").replace(/'/g, "").replace(/"/g, "");
 }

async function calculateCost(assetId) {
	document.getElementById("outfitCostLoading").style.display = "inline-block"
	document.getElementById("outfitCostDiv").style.display = "none"
	if (assetId != -1) {
		assetDetails = await fetchAssetDetails(assetId)
		$(".wearing-" + assetId).html(stripTags(assetDetails.Name))
		wearingInfoDict[assetId] = stripTags(assetDetails.Name)
		if (assetDetails.IsLimited || assetDetails.IsLimitedUnique) {
			limitedSellers = await fetchLimitedSellers(assetId)
			if (limitedSellers.data.length > 0) {
				wearingCostDict[assetId] = limitedSellers.data[0].price
				$(".wearing-robux-" + assetId).html(addCommas(limitedSellers.data[0].price))
			} else {
				wearingCostDict[assetId] = null
				$(".wearing-robux-" + assetId).html("Offsale")
			}
		} else {
			if (assetDetails.PriceInRobux != null) {
				wearingCostDict[assetId] = assetDetails.PriceInRobux
				$(".wearing-robux-" + assetId).html(addCommas(assetDetails.PriceInRobux))
			} else {
				wearingCostDict[assetId] = null
				$(".wearing-robux-" + assetId).html("Offsale")
			}
		}
	}
	cost = totalOutfitCost()
	if (cost[1] == 0) {
		costString = addCommas(cost[0])
	} else {
		costString = addCommas(cost[0]) + "<b style='font-size:10px;'> + " + cost[1] + " offsale</b>"
	}
	document.getElementById("outfitCostRobux").innerHTML = costString
	document.getElementById("outfitCostLoading").style.display = "none"
	document.getElementById("outfitCostDiv").style.display = "inline-block"
}

function addOutfit(userID, assets, name, thumbnail) {
	outfitHTML = `<div class="outfit-delete" style="z-index:10000;position:absolute;top:-8px;right:-8px;white-space:nowrap;"><a><img style="z-index:10000;height:15px;" src="https://ropro.io/images/close_button.png"></a></div>
				<div class="outfit-name input-group input-field">${stripTags(name)}</div>
				<div assets='${JSON.stringify(assets)}' outfit-name="${stripTags(name)}" style="display:inline-block;width:50px;height:50px;margin:2px;" class="thumbnail-2d-container outfit-selector"><a style="position:relative;">
				<img class="item-card-thumb-container" style="width:100%;height:100%;" src="${stripTags(thumbnail)}">
				</a>
				</div>`
	div = document.createElement('div')
	div.setAttribute('class', 'outfit-div')
	div.setAttribute('style', 'display:inline-block;width:50px;height:50px;position:relative;margin:2px;')
	div.innerHTML = outfitHTML
	document.getElementById('outfitContainer').insertBefore(div, document.getElementById('outfitContainer').childNodes[0])
	div.getElementsByClassName('outfit-delete')[0].addEventListener('click', function() {
		this.parentNode.remove();
		deleteOutfit(userID, assets);
	});
	div.getElementsByClassName('outfit-selector')[0].addEventListener('click', function() {
		for (i = 0; i < wearing.length; i++) {
			delete wearingCostDict[wearing[i]]
		}
		calculateCost(-1)
		wearing = []
		addItemBulk(assets)
	})
	if (thumbnail == "https://t2.rbxcdn.com/ffc3cf81492f26555592d46357f0658e" || thumbnail == "") {
		updateOutfitThumbnail(userID, div, assets);
	}
	return div
}

async function updateOutfitThumbnail(userID, div, outfitAssets) {
	setTimeout(async function() {
		url = await fetchAssetsView2D(outfitAssets)
		url = stripTags(url)
		if (url == 'https://t2.rbxcdn.com/ffc3cf81492f26555592d46357f0658e') {
			updateOutfitThumbnail(userID, div, outfitAssets)
		} else {
			div.getElementsByTagName('img')[1].setAttribute('src', url);
			await updateThumbnail(userID, outfitAssets, url);
		}
	}, 5000)
}

async function createOutfit(name) {
	outfitAssets = [...wearing]
	url = await fetchAssetsView2D(outfitAssets)
	userId = await getUserId()
	createOutfitReq = await createNewOutfit(outfitAssets, stripTags(name), url, userId)
	if (createOutfitReq == "1") {
		div = addOutfit(userId, outfitAssets, stripTags(name), url)
		updateOutfitThumbnail(userId, div, outfitAssets)
		document.getElementById('outfitSubtitle').innerHTML = "Successfully created outfit."
		document.getElementById('outfitNameGroup').style.display = "none"
		document.getElementById('createOutfitButton').innerHTML = "Save"
		document.getElementById('outfitSubtitle').style.display = "block"
		document.getElementById('outfitNameInput').value = ""
	} else {
		document.getElementById('outfitSubtitle').innerHTML = "Error: You already have this outfit."
		document.getElementById('outfitNameGroup').style.display = "none"
		document.getElementById('createOutfitButton').innerHTML = "Save"
		document.getElementById('outfitSubtitle').style.display = "block"
		document.getElementById('outfitNameInput').value = ""
	}
}



function createItem(name, assetId, price, limited, limitedU, itemType, thumbnail) {
	li = document.createElement('li')
	li.style.height = "200px"
	li.style.width = "126px"
	li.style.marginLeft = "5px"
	li.style.marginRight = "5px"
	li.style.display = "inline-block"
	if (wearing.includes(assetId)) {
		active = "active"
		src = "https://ropro.io/images/checkmark_done.gif"
	} else {
		active = ""
		src = "https://ropro.io/images/checkmark_start.png"
	}
	if (thumbnail.length == 0) {
		thumbnail = `https://www.roblox.com/asset-thumbnail/image?assetId=${assetId}&width=420&height=420&format=png`
	}
	if (itemType == "Bundle") {
		subdirectory = "bundles"
	} else {
		subdirectory = "catalog"
	}
	itemHTML = `<div style="float:left;margin-left:1px;margin-right:1px;"><div class="item-card-container remove-panel"><div class="item-card-link">
	<a class="item-card-thumb-container">
	<thumbnail-2d id=${assetId} type="${itemType}" style="overflow:visible;height:126px;width:126px;position:relative;" class="item-card-thumb-container item-card-thumb ng-isolate-scope ${active} ${assetId}">
	<span class="thumbnail-2d-container">
	<img class="item-card-image" style="height:126px;width:126px;position:absolute;" src="${stripTags(thumbnail)}"></span>
	<img style="pointer-events:none;transform:scale(0.4);overflow:visible;width:164px;height:126px;position:absolute;right:-50px;top:-35px;" class="checkmark-image ${active}" src="${src}">
	</thumbnail-2d> </a> </div> <div class="item-card-caption"> <div class="item-card-equipped ng-hide"> <div class="item-card-equipped-label"></div>
	<span class="icon-check-selection"></span> </div>
	<a href="https://www.roblox.com/${subdirectory}/${assetId}/item" class="item-card-name-link">
	<div style="float:left;margin-top:5px;" title="${stripTags(name)}" class="text-overflow item-card-name ng-binding">${stripTags(name)}</div>
	<div class="text-overflow item-card-price font-header-2 text-subheader margin-top-none">
	<span class="icon icon-robux-16x16"></span><span style="margin-left:4px;" class="text-robux-tile">${addCommas(price)}
	</span></div>
	</a></div></div></div>`
	li.innerHTML = itemHTML
	return li
}

function createTab(tabName) {
tabList = ""
firstTab = null
count = 1
for (sort in sorts[tabName]) {
	if (firstTab == null) {
		firstTab = sort
	}
	if (activeTab == null) {
		activeTab = tabName
		currentTab = tabName
		currentSort = Object.keys(sorts[tabName])[0]
	}
	tabList += `<li class="dropdown-custom-item" class="ng-scope"> <a style="font-size:13px;">${sort}</a></li>`
	count++
}

div = document.createElement("div")
tabHTML = `
<div id="navbar-universal-search" style="margin-top:10px;margin-right:14px;float:right;width:680px;" role="search">
   <div class="search-container">
      <div class="input-group">
         <input style="width:530px;" class="form-control input-field search-input sandbox-search" placeholder="Search" maxlength="50" ng-keypress="onKeywordKeypress($event, true)" ng-model="searchLayout.keyword"> 
         <div style="width:150px;" class="input-group-btn">
            <button style="height:38px;" type="button" class="input-dropdown-btn category-options ng-scope"> <span style="font-size:13px;" class="text-overflow rbx-selection-label ng-binding">${firstTab}</span> <span class="icon-down-16x16"></span> </button> 
            <ul page="0" style="width:150px;display:block;" class="dropdown_menu dropdown_menu-4 dropdown-menu dropdown-custom">
				${tabList}
            </ul>
            <button class="sandbox-search-button input-addon-btn" type="submit"> <span class="icon-search"></span> </button> 
         </div>
      </div>
   </div>
</div>`

itemContentHTML = `
<div style="width:680px;min-height:50px;margin-right:14px;float:right;margin-top:10px;" class="item-content">
<ul page="0" class="item-list hlist item-cards-stackable">

</ul>
</div>
`

div.innerHTML = tabHTML + itemContentHTML
return div
}

async function updatePage(cursor, keyword, back) {
	if (currentSort != "Bundles" || await fetchSetting("sandboxOutfits")) {
		setTimeout(function(){
			pageLoading = false
		},500)
		if (pageLoading == false) {
			pageLoading = true
			mySort = sorts[currentTab][currentSort]
			console.log(currentSort)
			catalogPage = await fetchPage(mySort, keyword, cursor)
			if (catalogPage != null) {
				itemDetails = await fetchDetails({"items":catalogPage.data})
				itemList = currentPage.getElementsByClassName('item-list')[0]
				newCursor = catalogPage.nextPageCursor
				oldCursor = catalogPage.previousPageCursor
				cursors[currentTab][0] = oldCursor
				cursors[currentTab][1] = newCursor
				itemList.innerHTML = ""
				bundleIds = []
				bundleItems = []
				for (i = 0; i < itemDetails.data.length; i++) {
					item = itemDetails.data[i]
					if (typeof item.lowestPrice != 'undefined') {
						price = item.lowestPrice
					} else if (item.priceStatus == "No Resellers") {
						price = "No Sellers"
					} else {
						if (item.priceStatus != "Offsale") {
							price = item.price
						} else {
							price = "Offsale"
						}
					}
					if (item.itemType != "Bundle") {
						itemElement = createItem(stripTags(item.name), item.id, price, false, false, stripTags(item.itemType), "")
						itemList.innerHTML += itemElement.outerHTML
					} else {
						bundleIds.push(item.id)
						bundleItems.push(item)
					}
				}
				if (bundleIds.length > 0) {
					bundles = await fetchBundleDetailsBulk(bundleIds)
					for (i = 0; i < bundles.length; i++) {
						item = bundleItems[i]
						userOutfitId = -1
						bundle = bundles[i]
						price = bundle.product.priceInRobux
						if (price == null) {
							price = "Offsale"
						}
						for (j = 0; j < bundle.items.length; j++) {
							bundleItem = bundle.items[j]
							if (bundleItem.type == "UserOutfit") {
								userOutfitId = bundleItem.id
							}
						}
						itemElement = createItem(stripTags(item.name), item.id, price, false, false, "Bundle", stripTags("https://www.roblox.com/outfit-thumbnail/image?userOutfitId=" + userOutfitId + "&width=420&height=420&format=png"))
						itemList.innerHTML += itemElement.outerHTML
					}
				}
				prevPage = itemList.getAttribute("page")
				if (cursor == "" & !back) {
					prevPage = 0
				}
				if (!back) {
					itemList.setAttribute("page", (parseInt(prevPage) + 1).toString())
				} else {
					itemList.setAttribute("page", (parseInt(prevPage) - 1).toString())
				}
				page = itemList.getAttribute("page")
				if (page == "1") {
					disabledString = "disabled"
				} else {
					disabledString = ""
				}
				if (newCursor == null) {
					disabledString2 = "disabled"
				} else {
					disabledString2 = ""
				}
				pagerHTML = `
				<div class="pager-holder" cursor-pagination="pager" ng-show="paginations.isEnabled">
					<ul class="pager">
					<li class="pager-prev ${disabledString}">
					<a class="prev-page"><span class="icon-back"></span></a></li>
					<li><span cursor="" class="page-num-text">Page ${page}</span> </li>
					<li class="pager-next ${disabledString2}">
					<a class="next-page">
					<span class="icon-next"></span></a> </li>
					</ul></div>
				</div>
				`
				itemList.innerHTML += pagerHTML
				$(itemList).find('.item-card-thumb').click(async function() {
					if ($(this).attr('class').includes('active')) {
						$(this).find('.checkmark-image').attr('src','https://ropro.io/images/checkmark_end.png')
						$(this).find('.checkmark-image').removeClass('active')
						if ($(this).attr('type') == "Bundle") {
							bundleDetails = await fetchBundleDetails($(this).attr('id'))
							bundleItems = bundleDetails[0].items
							bundleAssetIds = []
							for (i = 0; i < bundleItems.length; i++) {
								item = bundleItems[i]
								if (item.type == "Asset") {
									if (!item.name.includes("Animation") && !item.name.includes("Rthro")) {
										bundleAssetIds.push(item.id)
									}
								}
							}
							removeItemBulk(bundleAssetIds)
						} else {
							removeItem(parseInt($(this).attr('id')))
						}
					} else {
						$(this).find('.checkmark-image').addClass('active')
						$(this).find('.checkmark-image').attr('src','https://ropro.io/images/checkmark.png')
						function changeImage(checkmark) {
							setTimeout(function(){
								$(checkmark).find('.checkmark-image').attr('src','https://ropro.io/images/checkmark_done.gif')
							}, 400)
						}
						changeImage(this)
						if ($(this).attr('type') == "Bundle") {
							bundleDetails = await fetchBundleDetails($(this).attr('id'))
							bundleItems = bundleDetails[0].items
							bundleAssetIds = []
							for (i = 0; i < bundleItems.length; i++) {
								item = bundleItems[i]
								if (item.type == "UserOutfit") {
									outfitDetails = await fetchOutfitDetails(item.id)
									assets = outfitDetails.assets
									for (j = 0; j < assets.length; j++) {
										asset = assets[j]
										if (!asset.assetType.name.includes("Animation")) {
											bundleAssetIds.push(asset.id)
										}
									}
								}
							}
							addItemBulk(bundleAssetIds)
						} else {
							addItem(parseInt($(this).attr('id')))
						}
					}
					$(this).toggleClass('active')
				})
				$(itemList).find('.next-page').click(function() {
					currentTab = $(this).closest('.item-list').get(0).parentNode.parentNode.parentNode.id
					if (pageLoading == false) {
						if (!this.parentNode.classList.contains("disabled")) {
							updatePage(cursors[currentTab][1], keyword, false)
						}
					}
				})
				$(itemList).find('.prev-page').click(function() {
					if (pageLoading == false) {
						if (!this.parentNode.classList.contains("disabled")) {
							updatePage(cursors[currentTab][0], keyword, true)
						}
					}
				})
			}
		}
	} else {
		itemList = currentPage.getElementsByClassName('item-list')[0]
		itemList.innerHTML = `<div style="width:100px;margin:auto;"><img style="margin-top:0px;width:100px;" src="https://ropro.io/images/standard_icon.png"></div>
		<h3 style="text-align:center;">
			To try on Bundles, you must be a RoPro subscriber. <a style="display:inline-block;" class="btn-primary-md ng-binding" target="_blank" href="https://ropro.io#upgrade-standard">Upgrade</a>
		</h3>`
	}
}

function updateCurrentlyWearing() {
	wearingContainer = document.getElementById('wearingContainer')
	wearingContainer.innerHTML = ""
	for (i = 0; i < wearing.length; i++) {
		item = parseInt(stripTags(wearing[i].toString()))
		div = document.createElement("div")
		div.innerHTML += `<div class="wearing-name input-group input-field"><a style="font-size:13px;font-weight:bold;" class="wearing-${item}" href="https://roblox.com/catalog/${item}/item">${stripTags(wearingInfoDict[item])}</a>
		<br><div id="outfitCostDiv" style="margin-top:-10px;display: inline-block;">
		<span style="margin-left:-5px;margin-right:-8px;margin-bottom:0px;transform: scale(0.4);" id="nav-robux" class="icon-robux-28x28 roblox-popover-close"></span>
		<span style="font-size:12px;" class="rbx-text-navbar-right text-header wearing-robux-${item}">${wearingCostDict[item] == null ? "Offsale" : addCommas(wearingCostDict[item])}</span></div>
		</div>
		<div style="display:inline-block;width:50px;height:50px;" class="thumbnail-2d-container wearing-card">
		<a><img itemid="${item}" class="item-card-thumb-container ${item}" style="width:100%;height:100%;" src="https://www.roblox.com/asset-thumbnail/image?assetId=${item}&width=420&height=420&format=png">
		</a></div>`
		div.setAttribute("class", "wearing-div")
		wearingContainer.appendChild(div)
		itemImage = div.getElementsByTagName("img")[0]
		function listen(itemImage) {
			itemImage.addEventListener("click", function(){
				itemID = itemImage.getAttribute("itemid")
				removeItem(parseInt(itemID))
			})
		}
		listen(itemImage)
	}
}

async function loadWearing() {
	document.getElementById('loaderView').setAttribute('style', 'position:absolute;display:block;')
	updateCurrentlyWearing()
	assetsViewURL = await fetchAssetsView(wearing)
	if (assetsViewURL != "CANCELLED") {
		document.getElementById("sandboxView").src = "https://ropro.io/3dviewer/?" + assetsViewURL.split(".com/")[1] + "&background=" + background
		setTimeout(function(){
			document.getElementById('loaderView').setAttribute('style', 'position:absolute;display:none;')
		}, 500)
	}
}

async function loadCurrentlyWearing() {
	userID = await getStorage("rpUserID")
	currentlyWearing = await fetchCurrentlyWearing(userID)
	assets = currentlyWearing.assets
	for (i = 0; i < assets.length; i++) {
		asset = assets[i]
		if (!asset.assetType.name.includes("Animation")) {
			wearing.push(asset.id)
			calculateCost(asset.id)
		}
	}
	loadWearing()
	//Do outfit loading
	outfits = await fetchOutfits(userID);
	outfitsJSON = JSON.parse(outfits);
	for (i = 0; i < outfitsJSON.length; i++) {
		outfit = outfitsJSON[i];
		items = outfit.items
		if (items.length > 0) {
			itemsArray = items.split(",");
		} else {
			itemsArray = [];
		}
		addOutfit(userID, itemsArray, stripTags(outfit.name), outfit.thumbnail);
	}
}

function addItem(assetId) {
	wearing.push(parseInt(assetId))
	loadWearing()
	calculateCost(assetId)
}

function addItemBulk(assetIds) {
	for (i = 0; i < assetIds.length; i++) {
		assetId = assetIds[i]
		wearing.push(parseInt(assetId))
		calculateCost(assetId)
	}
	loadWearing()
}

function removeItem(assetId) {
	index = wearing.indexOf(parseInt(assetId))
	console.log(index, assetId)
	if (index != -1) {
		$('.'+assetId).find('.checkmark-image').attr('src','https://ropro.io/images/checkmark_end.png')
		$('.'+assetId).find('.checkmark-image').removeClass('active')
		$('.'+assetId).removeClass('active')
		console.log($('.'+assetId))
		wearing.splice(index, 1)
		delete wearingCostDict[assetId]
		calculateCost(-1)
		loadWearing()
	}
}

function removeItemBulk(assetIds) {
	for (i = 0; i < assetIds.length; i++) {
		assetId = assetIds[i]
		index = wearing.indexOf(parseInt(assetId))
		if (index != -1) {
			wearing.splice(index, 1)
			delete wearingCostDict[assetId]
			calculateCost(-1)
		}
	}
	loadWearing()
}

function clearItems() {
	wearing = []
	loadWearing()
}

async function sandboxMain() {
	sandbox = document.createElement("div")
	sandbox.innerHTML += sandboxHTML
	sandbox.setAttribute("id", "sandbox")
	sandbox.setAttribute("class", "tab-pane resellers-container")
	sandbox.setAttribute("style", "width:1000px;margin:auto;")
	document.getElementsByClassName('content')[0].appendChild(sandbox)
	$(sandbox).find('.background-selector').click(function() {
		$('.background-checkmark-image').attr('src', 'https://ropro.io/images/empty.png')
		$(this).find('.background-checkmark-image').attr('src', 'https://ropro.io/images/checkmark.png')
		function changeImage(checkmark) {
			setTimeout(function(){
				$(checkmark).find('.background-checkmark-image').attr('src', 'https://ropro.io/images/checkmark_done.gif')
			}, 400)
		}
		changeImage(this)
		background = this.id
		loadWearing()
	})
	tab1 = createTab("Limiteds")
	document.getElementById("Limiteds").appendChild(tab1)
	tabs["Limiteds"] = tab1
	currentPage = tab1
	tab1.getElementsByClassName('input-dropdown-btn')[0].addEventListener('click', function(){
		dropdown = tab1.getElementsByClassName('dropdown-custom')[0]
		dropdown.classList.toggle("active")
	})
	$('.sandbox-search').on('keypress',function(e) {
		if(e.which == 13) {
			updatePage("", this.value, false)
		}
	})
	$('.sandbox-search-button').click(function() {
		updatePage("", this.parentNode.parentNode.getElementsByClassName('sandbox-search')[0].value, false)
	})
	$('.dropdown-custom-item').click(function(){
		sortSelected = this.getElementsByTagName('a')[0].innerHTML
		this.parentNode.parentNode.getElementsByClassName('rbx-selection-label')[0].innerHTML = stripTags(sortSelected)
		this.parentNode.classList.toggle("active")
		currentSort = sortSelected
		updatePage("", "", false)
		
	})
	$('#createOutfitButton').click(function(){
		if (this.innerHTML == "Save") {
			document.getElementById('outfitNameGroup').style.display = "block"
			this.innerHTML = "Close"
			document.getElementById('outfitSubtitle').style.display = "none"
		} else {
			document.getElementById('outfitNameGroup').style.display = "none"
			this.innerHTML = "Save"
			document.getElementById('outfitSubtitle').style.display = "block"
		}
	})
	$('#outfitNameInput').on('keypress', function(e) {
		if (e.which == 13) {
			createOutfit(this.value)
		}
	})
	$('.catalog-tab').click(function() {
		$('.catalog-tab').removeClass('active')
		$(this).toggleClass('active')
		tabName = stripTags(this.innerHTML.split("<span")[0])
		if (tabName in tabs) {
			tabs[tabName].style.display = "block"
			for (i = 0; i < Object.keys(tabs).length; i++) {
				tabCheck = Object.keys(tabs)[i]
				if (tabCheck != tabName) {
					tabs[tabCheck].style.display = "none"
				}
			}
			currentPage = document.getElementById(tabName)
			activeTab = tabName
			currentTab = tabName
			currentSort = Object.keys(sorts[tabName])[0]
		} else {
			tab = createTab(tabName)
			tabDiv = document.getElementById(tabName)
			tabDiv.appendChild(tab)
			tab.style.display = "block"
			tabs[tabName] = tab
			currentPage = tab
			for (i = 0; i < Object.keys(tabs).length; i++) {
				tabCheck = Object.keys(tabs)[i]
				if (tabCheck != tabName) {
					tabs[tabCheck].style.display = "none"
				}
			}
			tab.getElementsByClassName('input-dropdown-btn')[0].addEventListener('click', function(){
				dropdown = this.parentNode.getElementsByClassName('dropdown-custom')[0]
				dropdown.classList.toggle("active")
			})
			$(tabDiv).find('.sandbox-search').on('keypress',function(e) {
				if(e.which == 13) {
					updatePage("", this.value, false)
				}
			})
			$(tabDiv).find('.sandbox-search-button').click(function() {
				updatePage("", this.parentNode.parentNode.getElementsByClassName('sandbox-search')[0].value, false)
			})
			$(tabDiv).find('.dropdown-custom-item').click(function(){
				sortSelected = this.getElementsByTagName('a')[0].innerHTML
				this.parentNode.parentNode.getElementsByClassName('rbx-selection-label')[0].innerHTML = stripTags(sortSelected)
				this.parentNode.classList.toggle("active")
				currentSort = sortSelected
				updatePage("", "", false)
			})
			activeTab = tabName
			currentTab = tabName
			currentSort = Object.keys(sorts[tabName])[0]
			updatePage("", "", false)
		}
	})
	updatePage("", "", false)
	document.getElementById("fullscreenToggle").addEventListener("click", function() {
		sandboxFrame = document.getElementById('sandboxFrame')
		state = sandboxFrame.getAttribute('class')
		if (state == "sandbox-frame") {
			sandboxFrame.setAttribute('class', 'sandbox-frame-full')
			document.getElementById('fullscreenImage').src = "https://ropro.io/images/fullscreen_1.png"
		} else {
			sandboxFrame.setAttribute('class', 'sandbox-frame')
			document.getElementById('fullscreenImage').src = "https://ropro.io/images/fullscreen_0.png"
		}
	})
	if (await fetchSetting("sandboxOutfits")) {
		document.getElementById("upgradeCTA").childNodes[1].innerHTML = "Please consider leaving us a review!"
		document.getElementById("upgradeCTA").childNodes[3].innerHTML = "Review"
		document.getElementById("upgradeCTA").childNodes[3].href = "https://ropro.io/install"
	} else {
		document.getElementById("myOutfits").style.display = "none"
	}
}

function doMain() {
	setTimeout(function() {
		try{
			document.getElementsByClassName('content')[0].setAttribute('style','height:2000px;')
			sandboxMain()
			loadCurrentlyWearing()
		}catch{
			doMain()
		}
	}, 500)
}

doMain()