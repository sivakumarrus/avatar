// inline chat eligible apps
var chatEligibleApps = [ "accountsummary", "estmt", "onlinepayment",
		"accountprofile", "credit-cards/benefits", "rewards", "ATWORK", "OSPC",
		"gmip", "business-card-application", "small-business", "credit-card",
		"acctserv","extra","atwork", "ciw", "gmip", "cop", "ResourceCenter", "supplier-payments", "atWork", "iers", "amexbta", "resourcecenter", "payve", "myPA", "mstr8t","startChat","ssearch.jsp","merchant","travel","amex-website","amex-qa","lending/enroll","dashboard","accounts","help","account-management","search","address","paperless","faq","login","payments/history","demo/wrapped","global.americanexpress.com"];

var xhr;
var onlineTabLoaded = false;
var HOME_PAGE_SERVER_URL=null;

if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	};
}

if (!window.console) {
	console = {
		log : function() {
		}
	};
};

if (IOASSIST === null || typeof (IOASSIST) === "undefined") {
	var IOASSIST = new Object();
}
IOASSIST.ioaBox = {
	appProduct : "",
	appCategory : "",
	inPageFaqLink : false,
	footerLinkClicked : false,
	ioaUserInput : false,
	ioaLAMstatus : true,
	ioaOmnOnChat : function() {
		if(document.getElementById("ioaLCBtn")!=null){
		document.getElementById("ioaLCBtn").addEventListener("click",function(e){
		if (e.preventDefault) {
			e.preventDefault();
		}else{
			e.returnValue = false;
		}
    	})
		}	
		var omnMessage = 'StartChat';
		
		 var value = "personalCards";
	    if(document.getElementById("ioaSelectedOption")!=null){
			value = document.getElementById("ioaSelectedOption").innerHTML;
		}
		if (value === 'Membership Rewards') {
			return;
		}
		/*var ioaLMBtn = document.getElementById("ioaLMBtn");
		if (typeof ioaLMBtn === "undefined") {
			return;
		}
		if (typeof ioaLMBtn.childNodes === "undefined") {
			return;
		}
		var ioaLMBtnHook = ioaLMBtn.childNodes[0];
		if (ioaLMBtnHook.className.indexOf("ioaDisabled") > -1) {
			omnMessage = 'StartChat-noLAM';
		} else {
			omnMessage = 'StartChat-LAMAvailable';
		}*/
		if (typeof (omn_rmassistaction) === "function") {
			omn_rmassistaction("Click", omnMessage);
		}

	},
	ioaOmnOnLAM : function() {
	if(document.getElementById("ioaLMBtn")!=null){	
		document.getElementById("ioaLMBtn").addEventListener("click",function(e){
	if (e.preventDefault) {
		e.preventDefault();
	}else{
		e.returnValue = false;
	}
	})
	}	
		var omnMessage = '';
		var ioaLMBtn = document.getElementById("ioaLMBtn");
		if (typeof ioaLMBtn === "undefined") {
			return;
		}
		if (typeof ioaLMBtn.childNodes === "undefined") {
			return;
		}
		var ioaLMBtnHook = ioaLMBtn.childNodes[0];
		if (ioaLMBtnHook.className.indexOf("ioaDisabled") > -1) {
			omnMessage = 'LeaveMessage-noChat';
		} else {
			omnMessage = 'LeaveMessage-chatAvailable';
		}
		if (typeof (omn_rmassistaction) === "function") {
			omn_rmassistaction("Click", omnMessage);
		}
	},
	ioaLMessage : function(ioaccpStatus) {
		// console.log('ioaLMessage::' + ioaccpStatus);
		if (ioaccpStatus == "show") {
			IOASSIST.ioaBox.ioaLAMstatus = true;
		} else if (ioaccpStatus == "hide") {
			IOASSIST.ioaBox.ioaLAMstatus = false;
		}

		IOASSIST.ioaBox.ioaSetLAMSection();
	},
	ioaLiveChat : function(ioaccpAvailable) {
		if (ioaccpAvailable == "yes") {
			IOASSIST.ioaBox.ioaSetOnlineTab = true;
			IOASSIST.ioaBox.ioaUserInput = true;
		} else {
			IOASSIST.ioaBox.ioaSetOnlineTab = true;
			IOASSIST.ioaBox.ioaUserInput = false;
		}
		IOASSIST.ioaBox.ioaSetLAMSection();
	},
	ioaSetLAMSection : function() {
		if (IOASSIST.ioaBox.ioaLAMstatus) {
			if (IOASSIST.ioaBox.ioaUserInput) {
				document.getElementById("ioaLeaveMsg").querySelectorAll(
						".ioaLMHdr")[0].innerHTML = 'No Time to Chat?';
				document.getElementById("ioaLeaveMsg").querySelectorAll(
						".ioaLMTxt")[0].innerHTML = "Drop us a message and we'll get back to you shortly.";
			} else {
				document.getElementById("ioaLeaveMsg").querySelectorAll(
						".ioaLMHdr")[0].innerHTML = 'Live Chat Not Available, Leave Us a Message!';
				document.getElementById("ioaLeaveMsg").querySelectorAll(
						".ioaLMTxt")[0].innerHTML = "Drop us a message and we'll get back to you shortly.";

			}
		} else {
			if (IOASSIST.ioaBox.ioaUserInput) {

				document.getElementById("ioaLeaveMsg").querySelectorAll(
						".ioaLMHdr")[0].innerHTML = 'We apologize for the inconvenience.';
				document.getElementById("ioaLeaveMsg").querySelectorAll(
						".ioaLMTxt")[0].innerHTML = "Leave a Message is currently unavailable. Please feel free to Chat with one of our Customer Care Professionals.";
			} else {
				document.getElementById("ioaLeaveMsg").querySelectorAll(
						".ioaLMHdr")[0].innerHTML = 'We apologize for the inconvenience.';

				document.getElementById("ioaLeaveMsg").querySelectorAll(
						".ioaLMTxt")[0].innerHTML = "All of our Live Chat Customer Care Professionals are currently busy. If this is an urgent matter, you can contact us using the number on the back of your Card or please check Live Chat again shortly.";

			}
		}
	}
};
// initial function triggered by ITM
function loadIOA(global) {console.log("staring IOA ");
	loadInlineChat();
}

// in-line chat
function loadInlineChat() {
	console.log("staring IOA loadInlineChat");
	if (!chatCookieExists() && !isChatEligibleApp() && !onlineTabLoaded) {
		console.log("staring IOA loadInlineChat 1");
		return;
	}
	if (wasInlineScriptLoaded()) {
		console.log("staring IOA loadInlineChat 2");
		return;
	}
	var cssURL;
	var jsURL;
	if(loadlecode){
		cssURL = getHomePageServerURL()+ "api/axpi/ioa/lechat/css/chatFrame.css?vra2.0";
		jsURL = getHomePageServerURL()+ "api/axpi/ioa/lechat/js/chatButtonBootStrap.js?vra32.0";
	}else{
		cssURL = getHomePageServerURL()+ "api/axpi/ioa/chatdemo/css/chatFrame.css?vra8.0";
		jsURL = getHomePageServerURL()+ "api/axpi/ioa/chatdemo/js/chatButtonBootStrap.js?vra81.0";
	}
	downLoadCSS(cssURL);		
	downLoadInlineJS(jsURL);
	console.log("going to download jquery js file");
	var jQueryJsURL = getHomePageServerURL()
	+ "api/ext/jquery/1.10.1/jquery.min.js";
	downLoadJQueryJS(jQueryJsURL);
}
function wasInlineScriptLoaded() {
	console.log("staring IOA wasInlineScriptLoaded");
	var x = document.getElementsByTagName("script");
	for ( var i = 0; i < x.length; i++) {
		if (x[i].src.indexOf("chatButtonBootStrap.js") > -1) {
			return true;
		}
	}
	return false;
}
function isChatEligibleApp() {
	console.log("staring IOA isChatEligibleApp");
	var pageURL = window.location.href;
	// no need in Logon Handler page
	if (pageURL.indexOf("request_type=LogonHandler") > -1) {
		return false;
	}
	for ( var i = 0; i < chatEligibleApps.length; i++) {
		if (pageURL.indexOf(chatEligibleApps[i]) > -1) {
			return true;
		}
	}
	return false;
}
function chatCookieExists() {
	console.log("staring IOA chatCookieExists");
	if (getCookie_AA("lp_flg") !== "" && getCookie_AA("lp_flg").length > 0) {
		var cookie = getCookie_AA("lp_flg") + "";
		if (cookie === "true") {
			return true;
		}
	}
	return false;
}
function downLoadCSS(url) {
	console.log("staring IOA downLoadCSS");
	var oHead = document.getElementsByTagName('head').item(0);
	var oScript = document.createElement("link");
	oScript.type = "text/css";
	oScript.href = url;
	oScript.async = true;
	oScript.rel = "stylesheet";
	oHead.appendChild(oScript);
}
function downLoadInlineJS(url) {
	console.log("staring IOA downLoadInlineJS");
	var oHead = document.getElementsByTagName('head').item(0);
	var oScript = document.createElement("script");
	oScript.type = "text/javascript";
	if (oScript.readyState) { // IE
		oScript.onreadystatechange = function() {
			if (oScript.readyState == "loaded"
					|| oScript.readyState == "complete") {
				oScript.onreadystatechange = null;
				if (chatCookieExists() ||((window.location.href.indexOf("travel")!=-1) && window.location.href.indexOf("travel-offers")==-1  && window.location.href.indexOf("my-trips")==-1) || (window.location.href.indexOf("iseatz.com")!=-1)) {
					if(window.location.href.indexOf("online-privacy-statement.html")==-1){
						lpChatOnPageLoad();
					}
				}
			}
		};
	} else { // Others
		oScript.onload = function() {
			if (chatCookieExists()  ||((window.location.href.indexOf("travel")!=-1) && window.location.href.indexOf("travel-offers")==-1  && window.location.href.indexOf("my-trips")==-1) || (window.location.href.indexOf("iseatz.com")!=-1) ) {
				if(window.location.href.indexOf("online-privacy-statement.html")==-1){
					lpChatOnPageLoad();
				}
			}
		};
	}
	oScript.async = true;
	oScript.src = url;
	oHead.appendChild(oScript);
}

function downLoadJQueryJS(url) {
	console.log("downloading jquery js file");
	var oHead = document.getElementsByTagName('head').item(0);
	var oScript = document.createElement("script");
	oScript.type = "text/javascript";	
	oScript.async = true;
	oScript.src = url;
	oHead.appendChild(oScript);
}


function getENV() {
	var env = "3";
	try {
		if (Bootstrapper !== "undefined" && Bootstrapper != null
				&& Bootstrapper.ensEnv != null) {
			env = Bootstrapper.ensEnv;
		}
	} catch (e) {
		env = getFromHiddenVar();
	}
	return parseInt(env);
}
function getFromHiddenVar() {
	var pageURL = window.location.href;
	if (pageURL.indexOf("aaLauncher.jsp") > -1) {
		isTestPage = true;
	}
	var env = "3";
	try {
		var hiddenEnv = document.getElementById("env");
		if (typeof hiddenEnv !== "undefined" && hiddenEnv != null) {
			env = hiddenEnv.value;
			env = env.substring(1, 2);
		}
	} catch (e) {
	}
	return env;
}

function getHomePageServerURL() {
	if (HOME_PAGE_SERVER_URL != null) {
		return HOME_PAGE_SERVER_URL;
	}
	//var env = getENV();
	var env = 3;
	switch (env) {
	case 0: {
		HOME_PAGE_SERVER_URL = "https://dstatic.dev.ipc.us.aexp.com/";
		break;
	}
	case 1: {
		HOME_PAGE_SERVER_URL = "https://dstatic.dev.ipc.us.aexp.com/";
		break;
	}
	case 2: {
		HOME_PAGE_SERVER_URL = "https://qwww.aexp-static.com/";
		break;
	}
	case 3: {
		HOME_PAGE_SERVER_URL = "https://www.aexp-static.com/";
		break;
	}
	default: {
		HOME_PAGE_SERVER_URL = "https://www.aexp-static.com/";
		break;
	}
	}
	return HOME_PAGE_SERVER_URL;
}

if (typeof window.addEventListener !== "undefined") {
	document.body.addEventListener('click', function(e) {
			
	if(document.getElementById("lpButtonDiv")!=null){
	   if(typeof $ != "undefined" && typeof window.jQuery!="undefined"){	
		if($.contains(document.getElementById("lpButtonDiv"), e.target )){ 
		if (e.preventDefault) {
			e.preventDefault();
		}else{
			e.returnValue = false;
		}
      }
	} 
	}		
	}, false);	
} else if (typeof window.attachEvent !== "undefined") {
	document.body.attachEvent('onclick', function(e) {		
	
	if(document.getElementById("lpButtonDiv")!=null){
	   if(typeof $ != "undefined" && typeof window.jQuery!="undefined"){
		if($.contains(document.getElementById("lpButtonDiv"), e.target )){ 
		if (e.preventDefault) {
			e.preventDefault();
		}else{
			e.returnValue = false;
		}
      }
	}  
	}
	});
}


function setCookie(ioa_name, value, expiredays, expiremins) {
	var expiry = null;
	var ioadomain = document.domain;
	if (ioadomain.indexOf("aexp.com") !== -1) {
		ioadomain = "aexp.com";
	} else if (ioadomain.indexOf("americanexpress.com") !== -1) {
		ioadomain = "americanexpress.com";
	}
	var exdate = new Date();
	if (typeof expiremins !== "undefined" && expiremins !== null) {
		exdate.setTime(exdate.getTime() + (expiremins * 60 * 1000));
		expiry = expiremins;
	} else {
		exdate.setDate(exdate.getDate() + expiredays);
		expiry = expiredays;
	}
	document.cookie = ioa_name + "=" + escape(value)
			+ ((expiry == null) ? "" : "; expires=" + exdate.toGMTString())
			+ "; path=/; domain=" + ioadomain;
}

function getCookie_AA(ioa_name) {
	var c_start = -1, c_end = -1;
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(ioa_name + "=");
		if (c_start > -1) {
			c_start = c_start + ioa_name.length + 1;
			c_end = document.cookie.indexOf(";", c_start);
			if (c_end == -1)
				c_end = document.cookie.length;
			return unescape(document.cookie.substring(c_start, c_end));
		}
	}
	return "";
}

function delCookie(ioa_name) {
	try {
		setCookie(ioa_name, "", -1);
	} catch (e) {
	}
}

/* ------------- FROM ONLINE TAB --------------------------*/

var onlineContentMaster = null;
var aaLPCounter=0;
var aatimerVariable;
var eligibleonline=false;
var lppluginunavailable=false;
var lpSMCButtonsStarted = false;
var setPageCalled = false; // rename this variable as you see fit, or leave it as is

var chatEligiblePanes = [ "personalCards", "smallBusiness",
		"membershipRewards", "corporateCards","merchantServices" ];
var onLineTabRestrictedDomains = [ "business-card-application", "small-business","personal-card-application/supplementary"];
var onlineSupportedPanesMap = {"gmip":"corporateCards","ATWORK":"corporateCards","OSPC":"corporateCards","cop":"corporateCards","merchant":"merchantServices"};
var onlineNotSupportedSectionMap ={"gmip":"ioaLeaveMsg","ATWORK":"ioaLeaveMsg","OSPC":"ioaLeaveMsg","cop":"ioaLeaveMsg","rewards":"ioaLeaveMsg","www01.extra.americanexpress.com":"ioaLeaveMsg","merchant":"ioaLeaveMsg"};
var donothideOnlineMap = {"merchantServices":"merchant"};

function handleOnlineTabLogic() {
	if (!isCurrentPaneChatEligible()) {
		return;
	}
	if (onlineContentMaster == null) {
		setOnlineMaster();
	}
}

function isAppinMap(){
var keys = Object.keys(onlineSupportedPanesMap);
	var b=window.location.href;
	for ( var key in keys){
		keyvalue=keys[key];
		console.log("isAppinMap key:"+key)
		if(b.indexOf(keyvalue)>-1){
			console.log("from isAppinMap returning true");
		   return true;
		}
	}	console.log("from isAppinMap returning false");
	return false;
}

function isPaneSupportedinApp(){
	var keys = Object.keys(onlineSupportedPanesMap);
	var b=window.location.href;
	var needtocheck = isAppinMap();
	console.log("needtocheck::"+needtocheck)
	if(!needtocheck){
		return true;
	}
	for ( var key in keys){
		keyvalue=keys[key];
		if(b.indexOf(keyvalue)>-1){console.log("isPaneSupportedinApp key:"+keyvalue)
			var chatEligiblePaneItems = onlineSupportedPanesMap[keyvalue];
			chatEligiblePaneItemslist=chatEligiblePaneItems.split(",");
			for(var a=0; a<chatEligiblePaneItemslist.length;a++){console.log("values in isPaneSupportedinApp:"+chatEligiblePaneItemslist[a]);
				if(crntActPane == chatEligiblePaneItemslist[a]){
					console.log("from isPaneSupportedinApp returning true");
					return true;
				}
			}
		}
	}console.log("from isPaneSupportedinApp returning false");
	return false;
}

function donotHideCheck()
{
	console.log("in donot hide");
	var keys = Object.keys(donothideOnlineMap);
	var b=window.location.href;
	for ( var key in keys){
		keyvalue=keys[key];
		if(crntActPane.indexOf(keyvalue)>-1){
			var donothideOnlineMapItems = donothideOnlineMap[keyvalue];
			donothideOnlineMaplist=donothideOnlineMapItems.split(",");
			for(var a=0; a<donothideOnlineMaplist.length;a++){console.log("values in donotHideCheck:"+donothideOnlineMaplist[a]);
				if(b.indexOf(donothideOnlineMaplist[a])>-1){
					console.log("from donotHideCheck returning true");
					return true;
				}else
					return false;
			}
		}else{
			return true;
		}			
	}
	return true;
}

function isCurrentPaneChatEligible() {
	for ( var i = 0; i < chatEligiblePanes.length; i++) {
		if (crntActPane == chatEligiblePanes[i]) {
			checkResponse= isPaneSupportedinApp();
		   console.log("checkResponse:"+checkResponse)
		   if(checkResponse){
				//return true;
				extraCheck=donotHideCheck();
				if(extraCheck)
					return true;
				else	
					return false;				
		   }
			else
				return false;
		}
	}
	return false;
}

function isAppEligibleforOnline(){
	var pageURL = window.location.href;
	for ( var i = 0; i < chatEligibleApps.length; i++) {
		if (pageURL.indexOf(chatEligibleApps[i]) > -1) {
			return true;
		}
	}
	return false;

}

function hideOnlineChatId() {
	if ( document.getElementById("onlineChatId") != null ){
		document.getElementById("onlineChatId").style.display = "none";
	}
}

function showOnlineTab(originsrc) {

	if(!isAppEligibleforOnline()){	
		
		eligibleonline=false;
		hideOnlineChatId();
		lppluginunavailable=true;
		return;
	}
	if (isOnlineTabRestricted()) {
	eligibleonline=false;
		hideOnlineChatId();
	lppluginunavailable=true;	
		return;
	}
		eligibleonline=true;
		clearTimeout(aatimerVariable);
		aaLPCheck(originsrc);			
}
function aaLPCheck(originsrc){
	if(aaLPCounter < 20){
		if(typeof lpMTagConfig !== "undefined"){
			aaLPCounter=0;
			lppluginunavailable=false;
            if(typeof iscorppage !="undefined" && iscorppage){
				finallyShowOnlineTab();
			}else{			
			if (!setPageCalled) {
			    lpMTagConfig.ifVisitorCode = lpMTagConfig.ifVisitorCode || [];
			    lpMTagConfig.ifVisitorCode.push(function() {
			        if (!setPageCalled) {
			            finallyShowOnlineTab();
			            setPageCalled = true;
			        }
			    });
			} else {
			    finallyShowOnlineTab();
			}
		}
		}else{	
			aaLPCounter++;
			aatimerVariable=window.setTimeout(function(){aaLPCheck(originsrc);},500);
		}	
	}else{
     		aaLPCounter=0;
		  onlineTabLoaded=false;
		  lppluginunavailable=true;
		  hideOnlineChatId();
 		
		
	}
}


function hideOnlineChatId() {
	if ( document.getElementById("onlineChatId") != null ){
		document.getElementById("onlineChatId").style.display = "none";
	}
}

function isOnlineTabRestricted() {
	var pageURL = window.location.href;
	for ( var i = 0; i < onLineTabRestrictedDomains.length; i++) {
		if (pageURL.indexOf(onLineTabRestrictedDomains[i]) > -1) {
			return true;
		}
	}
	return false;
}

function isLAMHidden(){
	/*document.getElementById("ioaLiveChat").style.display="block";
	document.getElementById("ioaLeaveMsg").style.display="block";*/
	var keys = Object.keys(onlineNotSupportedSectionMap);
	var b=window.location.href;
	for ( var key in keys){
		keyvalue=keys[key];
		if(b.indexOf(keyvalue)>-1){
		    var onlineNotSupportedSections = onlineNotSupportedSectionMap[keyvalue];
			onlineNotSupportedSectionslist=onlineNotSupportedSections.split(",");
			for(var a=0; a<onlineNotSupportedSectionslist.length;a++){
				document.getElementById(onlineNotSupportedSectionslist[a]).style.display="none";
			}
		}
	}
}

function finallyShowOnlineTab() {console.log("in showonline updated");
	 try {
		document.getElementById("ioaonlineplaceholder").style.display = "none";
			var b=window.location.href;
			
		/*if (typeof iscorppage !="undefined" && iscorppage) {
            var updatedSection = "";
			if (typeof lpTag.section === "string") {
						updatedSection = [lpTag.section, "overlay"];
			} else {
						updatedSection = lpTag.section;
						updatedSection.push("overlay");
			}
			lpTag.newPage(window.location.href, {
						section: updatedSection,
				taglets: {
					lp_external_js: {
						id: "scripts",
						value: lpTag.taglets.lp_external_js.inspect()._config.scripts
					}
				}
			});
        }else{	
    	 var params = {};
         var newdbs = [ {
                     name : 'chat-US-MYCA-help-english',
                     pid : 'gacLiveChat',
                     afterStartPage : true,
                     ovr : 'lpMTagConfig.db1'
              }, {
                     name : 'chat-SMC-leavemessage-english',
                     pid : 'ioaLMBtn',
                     afterStartPage : true,
                     ovr : 'lpMTagConfig.db1'
              } ];		
           			  
			  
	         if (!lpSMCButtonsStarted) {
				params.newDbs = newdbs;			
	        	lpSMCButtonsStarted = true;
	          }         	  
              params.udes = "PV!unit=US-MYCA-help";
			  
			  var value = "personalCards";
			  if(document.getElementById("ioaSelectedOption")!=null){
				value = document.getElementById("ioaSelectedOption").innerHTML;
				value = value.replace(/ /g, '');
				value = value.charAt(0).toLowerCase() + value.slice(1);
			  }	
              params.udes = params.udes + "&PV!contactUsSelection=" + value;
              lpMTag.lpSetPage(params);
	     }*/	  
	
			  
              onlineTabLoaded = true;
			  isLAMHidden();
       } catch (e) {
    	   	  onlineTabLoaded = false;
			  hideOnlineChatId();
             // console.log("Error while sending parameters to LP:: " + e.message);
       }
	   // console.log("Finally Online Tab enabled 2::" + onlineTabLoaded);
}

loadIOA(true);
setTimeout(showOnlineTab("dropdown"), 5000);

var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = "chatCss";
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://www.aexp-static.com/api/axpi/ioa/launcher/chatLauncher.css?vr1.0';
    link.media = 'all';
    head.appendChild(link);
	
/*if (typeof window.addEventListener !== "undefined") {console.log("brek")
	document.body.addEventListener('click', function(e) {

		if($.contains(document.getElementsByClassName("contact-us-wrapper")[0], e.target )){ 
			 setTimeout(function() { showOnlineTab("dropdown");}, 6000);
      }

	}, false);
} else if (typeof window.attachEvent !== "undefined") {
	document.body.attachEvent('onclick', function(e) {

		if($.contains(document.getElementsByClassName("contact-us-wrapper")[0], e.target )){ 
		    setTimeout(function() { showOnlineTab("dropdown");}, 6000);
    	}
	
	});
}	*/

function openCobrowseOnline(){
	if(document.getElementById("cobrowseJS")!=null){
		buildCobrowseHtml();
		return;
	}	
	var oHead = document.getElementsByTagName('head').item(0);
	var oScript = document.createElement("script");
	if (oScript.readyState) { // IE
		oScript.onreadystatechange = function() {
			if (oScript.readyState == "loaded"
					|| oScript.readyState == "complete") {
				oScript.onreadystatechange = null;
				buildCobrowseHtml();
			}
		};
	} else { // Others
		oScript.onload = function() {
			buildCobrowseHtml();
		};
	}
	oScript.type = "text/javascript";
	oScript.async = true;
	oScript.id="cobrowseJS";
	oScript.src = "https://web.aexp-static.com/chat/js/cobrowse.js";
	oHead.appendChild(oScript);
}