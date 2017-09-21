/**
 * This file contains all the pre-configurable settings and public method to control on Embedded Window flow from Parent page.
 * You can change the pre0configurable settings below. However, please dont change the functionalities unless you absolutely know what you are doing.
 * To make it works, you need to change the correct reference to your iFrame resource
 *  lpCWTagConst.CHAT_BASE_URL - your base URL domain
 *  lpCWTagConst.CHAT_LOCATION_URI - your URI referencing to the resources of iFrame
 **/

var chatcurrentTime;
var chatlastrefreshtime=0;
var chatlasttimeout=false;
var isTimerStopped=false;
var timeoutInterval=null;
var nuanceFlowFlag= "BAU";
var lenosToken="";
var lenoofferCount=0;
var lenosecCount=0;
var lenofromReload=false;
var starttimeLP;
var expansionFlag="standard";  
//var expansionFlag="centurion";  
var lpTestPopulation="Automation";
 var jwtValue='';
  var firsttimelogin ="false";

/*if(window.location.href.indexOf("credit-cards/benefits/view-all")!=-1){
	if(typeof jQuery != "undefined"){
		$=jQuery;
	}
}*/

/*if(typeof lpTestPopulation != "undefined")
	lpTestPopulation = "BAU";
if(typeof lpTestPopulation != "undefined" && lpTestPopulation!="")
	nuanceFlowFlag = lpTestPopulation.toUpperCase();
*/
//var nuanceFlowFlag=lpTestPopulation;
window.lpCWTagUI = window.lpCWTagUI || {};
window.lpCWTagConst = window.lpCWTagConst || {};
lpCWTagConst.CHAT_BASE_URL = "https://www.aexp-static.com";
lpCWTagConst.CHAT_LOCATION_URI = "/api/axpi/ioa/lechat/";
lpCWTagConst.CHAT_LOCATION_URI2 = "";
lpCWTagConst.LENOCHAT_LOCATION_URI = "/api/axpi/ioa/chatserver/customer.html?vr4.0&lpsuid=";
lpCWTagConst.DEBUG_ENABLE = false; //shows log in console only for Parent page
lpCWTagConst.LOGGER_NAME_BOOTSTAP = "LPChatBootstrap"; //debug purposes only
lpCWTagConst.WS_ENABLE=true; //Web Services Enable/not - if enable, you will see spinning wheel
lpCWTagConst.VERSION="0.9.6-b18"; //the version on this Embedded Window
lpCWTagConst.lpChatTitleVal = "American Express Chat";
lpCWTagConst.lpChatTitleDock = "Dock";
lpCWTagConst.lpChatTitleUndock = "Un-Dock";
lpCWTagConst.lpChatTitleMinimize = "Minimize";
lpCWTagConst.lpChatTitleMaximize = "Maximize";
lpCWTagConst.lpChatTitleClose = "Close";
lpCWTagConst.lpNewChatMsgArrive = "New Chat Message Has Arrived"; //change the new messge when flashing title
lpCWTagConst.enableSiteTitleFlashing = true;
lpCWTagConst.enableDockUnDock = true; //enable if you want to definitely show the dock/undock
lpCWTagConst.lpTitleFlashingTimer; //timer to use for title flashing
lpCWTagConst.widgetMarginRight = "32"; //indicates margin right
/**
 * Logger - to provide printing statement and JSON object to browser console.
 * Usage:
 *   logger = new lpCWTagUI.LPChatWidgetLogger();
 *   logger.debug("string or json object", "string or json object")
 * Output:
 *  time_stamp : LOGGER NAME : string or json object : string or json object
 * @version: 0.9
 */
lpCWTagUI.LPChatWidgetLogger = lpCWTagUI.LPChatWidgetLogger || function LPChatWidgetLogger() {
 var cwLogger = this;
 
 /**
  * adding leading zeros
  * @param num - actual number
  * @param size - length of actual number needs for leading zeros
  */
 function padZeros(num, size) {
     var temp = "000" + num;
     return temp.substr(temp.length-size);
 }
 /**
  * printing to browser console if supported
  * @param pLogName - logger name
  * @param pData - a simple string or complex JSOn data type
  * @param pData2 - a simple string or complex JSOn data type
  * @param pDebugOn - output to console only if true
  */
 function print_to_log(pLogName, pData, pData2, pDebugOn) {
  if (pDebugOn) {
   var date = new Date();
   try {
    pData = typeof pData === 'string' ? pData : JSON.stringify(pData);
    pData2 = typeof pData2 === 'string' ? pData2 : JSON.stringify(pData2);
   } catch (exc) {
    pData = exc;
    pData2 = "...";
   }
   date = "" + padZeros(date.getHours(), 2) + ":" + padZeros(date.getMinutes(), 2) 
      + ":" + padZeros(date.getSeconds(), 2) + ":" + padZeros(date.getMilliseconds(), 3);
   if(!(window.console && console.log)) {
     console = {
       log: function(){},
       debug: function(){},
       info: function(){},
       warn: function(){},
       error: function(){}
     };
   }
   console.log(date + " " + pLogName + " : " + pData + (pData2 == "" ? "" : (" : " + pData2)));
  }
 }
 
 /**
  * print debug statement to console only if DEBUG_ENABLE is true
  * @param dataOrMessage - string or JSON
  * @param dataOrMessage2 - string or JSON
  */
 cwLogger.debug = function(dataOrMessage, dataOrMessage2){
  print_to_log(lpCWTagConst.LOGGER_NAME_BOOTSTAP, dataOrMessage || "", dataOrMessage2 || "", lpCWTagConst.DEBUG_ENABLE);
 } 
 
 /**
  * print info statement to console
  * @param dataOrMessage - string or JSON
  * @param dataOrMessage2 - string or JSON
  */
 cwLogger.info = function(dataOrMessage, dataOrMessage2){
  print_to_log(lpCWTagConst.LOGGER_NAME_BOOTSTAP, dataOrMessage || "", dataOrMessage2 || "", true);
 } 
}
/**
 * LPChatWidgetUI is providing the wrapper functionality to create chat iFrame and all communication to the iFrame via postMessage.
 * This class also receiving postMessage (command) from iFrame to resize the PCI as well as other functionalities to support the wrapper behavior
 * Usage:
 *   chatUI = new lpCWTagUI.LPChatWidgetUI(window);
 *   chatUI.loadChat()
 * Output:
 *  will load the Embedded Window widget
 * @version: 0.9
 */
lpCWTagUI.LPChatWidgetUI = lpCWTagUI.LPChatWidgetUI|| function LPChatWidgetUI(window) {
 var myUI = this;
 var webserviceTimer;
 var logger = new lpCWTagUI.LPChatWidgetLogger();
 var chatWinLoaded = false;
 var isChatActive = false;
 var isDock = true;
 var setOffPositionValue = '';
 var setTopOffPositionValue = ''; 
 var setLeftOffPositionValue = ''; 
 var lpVisitorSessionId = "";
 var originalSiteTitle="";
 var chatMaximize = true;
 var lpPCIGenIDEnable = lpCWTagConst.WS_ENABLE;
 var chatWizContainer, chatiFrameContainer, chatiFrame, dragManager, draManagerSession;
 var isPciVisible = false;
 var chatFrameLoaded = false;
 var previousTop=0, previousLeft = 0;
 var suid='';

 
 function getElement(id){
  return document.getElementById(id); 
 }
 
 function removeElement(element){
  if(element && element.parentNode)
   element.parentNode.removeChild(element); 
 }
 
 function showElement(idObj){
  if(typeof idObj != "undefined")
   idObj.style.display = "block"; 
 }
 
 function showElementById(id){
  showElement(getElement(id));
 }
 
 function hideElement(idObj){
  if(typeof idObj != "undefined")
   idObj.style.display = "none"; 
 }
 
 function hideElementById(id){
  hideElement(getElement(id)); 
 }
 
 function deleteAppendStyleClassById(elementId, classToRemove, classToAdd){
  return deleteAppendStyleClass(getElement(elementId), classToRemove, classToAdd);
 }
 
 /**
  * remove the css class and then append new css class
  * @param element - element to modify
  * @param classToRemove - css class to remove from the exist element
  * @param classToAdd - css class to append/add to the exist element
  */
 function deleteAppendStyleClass(element, classToRemove, classToAdd){
  logger.debug("deleteAppendStyleClass", "classToRemove="+classToRemove+", classToAdd="+classToAdd);
  
  var newClassName = "";       
    if(typeof element != "undefined" && element && element.className){
     var classes = element.className.split(/\s/g);  //split by whitespace
     if(classes.length > 0){
      for(var i = 0; i < classes.length; i++) {
       if(classes[i] != "" && classes[i] !== classToRemove && classes[i] !== classToAdd) {
        if(newClassName != "")
         newClassName += " ";
          newClassName += classes[i];
        }
      }
    }
   }
   
   if(newClassName != "")
   newClassName += " ";
    newClassName += classToAdd;
    logger.debug("deleteAppendStyleClass", "newClassName="+newClassName);
    return newClassName;
 }
 
 /**
  * Retrieve the offset of the element
  * @param element
  */
 function getOffset(element) {
  var left = 0, top = 0;
    while( element && !isNaN( element.offsetLeft ) && !isNaN( element.offsetTop ) ) {
        left += element.offsetLeft - element.scrollLeft;
        top += element.offsetTop - element.scrollTop;
        element = element.offsetParent;
    }
    return { top: top, left: left };
 }
 /**
  * Bind event to DOM. Supporting IE8 +
  * @param element to bind
  * @param eventName - event name to bind
  * @param callback - callback method
  */
 function bindEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else {
        element.attachEvent("on" + eventName, callback);
    }
 }
 
 /**
  * Unbinds method from DOM
  * @param element to unbind
  * @param eventName - event name to unbind
  * @param callback - callback method
  */
 function unBindEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.removeEventListener(eventName, callback, false);
    } else {
        element.detachEvent("on" + eventName, callback);
    }
 }
 /**
  * Buid the iFrame of Embedded Chat Window and mark if the DIV has created to avoid creating multiple embedded window.
  */
 function lpChatBuildFrame() {
  if(!chatWinLoaded){
   logger.debug("lpChatBuildFrame", "...");
   var body = document.body;
   try{
    //register to receive PostMessage prior create iFrame in case of iFrame will fireback the msg to show the container
    myUI.registerOnMessage();
    
    // 1. create outtermost container DIV '<div id="lpChatWizContainer" style="display:none;"></div>'
    chatWizContainer = document.createElement('div');
    chatWizContainer.id = 'lpChatWizContainer';
	chatWizContainer.className = "lp_US";
    chatWizContainer.style.display="none";
    
    body.appendChild(chatWizContainer);
    
    // 2. create Title contain for draggable. When chat is minize, only this title contain stay 'on' 
    chatWizContainer.innerHTML = makeHeader();
   
    // 3. create a iframe holder area '<div id="lpChatiFrameContainer" class="lpPosRel"></div>'
    chatiFrameContainer = document.createElement('div');
    chatiFrameContainer.id = 'lpChatiFrameContainer';
    chatiFrameContainer.className ="lpPosRel";
    chatWizContainer.appendChild(chatiFrameContainer);
   
    // 4. attach the iframe to lpChatiFrameContainer
    chatiFrame = document.createElement("iframe");
    chatiFrame.id = 'lpChatiFrame';
    chatiFrame.className = 'lpChatiFrame';
	chatiFrame.name = 'lpchatframe';
    chatiFrame.src = getFrameSource(); 
	//chatiFrame.src = "https://lpdww554.trcw.us.aexp.com:2095/api/axpi/lecode/lpChatWireFrame.html";
	//chatiFrame.src =   "https://qwww.aexp-static.com/api/axpi/EW/chatserver/leChatWireFrame.html";
    chatiFrame.scrolling = 'no';
    chatiFrame.frameBorder = '0';
    chatiFrame.style.border = "none";
    chatiFrame.style.width = "400px";
    chatiFrame.style.height = "410px";
    chatiFrame.setAttribute('allowtransparency', 'true');
    //chatiFrame.onload = flagChatFrameLoaded;
    bindEvent(chatiFrame, "load", flagChatFrameLoaded);
    chatiFrameContainer.appendChild(chatiFrame);
    
    chatWinLoaded = true;
    
    makeHeaderForMin();
    document.getElementById("lpChatTitleContainerMin").style.display = "none";
    //bind all events to this chat
    myUI.bindEvents();
	if(window.location.href.indexOf("travel-offers")!=-1  || window.location.href.indexOf("my-trips")!=-1 || window.location.href.indexOf("travel-experts")!=-1 || 
			window.location.href.indexOf("travelexperts")!=-1 ){
		window.location.hash = 'ioa'; 
	}
   }catch(excp){
    logger.debug("lpChatBuildFrame", "Exception occurred", excp);
   }
  }else{
   logger.debug("lpChatBuildFrame", "chat window already loaded");
  }
 }
 
 function flagChatFrameLoaded(){
  logger.debug("flagChatFrameLoaded", "method invoke");
  chatFrameLoaded = true;
  //document.getElementById("lpChatWizContainer").style.display = "block";
 }
 
  
 function sendPostMessageToRCWidget(jsonData){
	 logger.debug("parentFrame sending postmsg to ="+getTargetForLenoChatFrame(), jsonData);
  if (getRCWidgetFrameObj().postMessage)
	getRCWidgetFrameObj().postMessage(JSON.stringify(jsonData), getTargetForLenoChatFrame()); 
  else  
   throw new Error ("Your browser does not support the postMessage method!"); 
 }
 
 function getRCWidgetFrameObj(){
	 var x = document.getElementById("lnChatiFrame")
	 if(typeof x != "undefined" && x != null )
	 return (x.contentWindow || x.contentDocument);
 }
 
 function getTargetForChatFrame(){
  var iFrameURL = getFrameSource();
  return iFrameURL.indexOf('https') > -1 ? 'https://' + iFrameURL.substr(8).split('/')[0] : 'http://'
       + iFrameURL.substr(7).split('/')[0];
 }
 
 function getTargetForLenoChatFrame(){
  var iFrameURL = getLenoFrameSource()
  return iFrameURL.indexOf('https') > -1 ? 'https://' + iFrameURL.substr(8).split('/')[0] : 'http://'
       + iFrameURL.substr(7).split('/')[0];
 }
 
 function getChatBaseDomain() {
  return lpCWTagConst.CHAT_BASE_URL.replace(/,\s*$/, ""); 
 }
 
 
 function lnChatBuildFrame(suid,reloadstr){
	if(typeof(slFlag)!="undefined" && slFlag){
	var chatWizContainer = document.getElementById('lpChatiFrameContainer');	
	lnchatiFrameContainer = document.createElement('div');
    lnchatiFrameContainer.id = 'leno-ChatiFrameContainer';    
    chatWizContainer.appendChild(lnchatiFrameContainer);	
    lnchatiFrame = document.createElement("iframe");
    lnchatiFrame.id = 'lnChatiFrame';
    lnchatiFrame.className = 'lpChatiFrame';
    lnchatiFrame.src = getLenoFrameSource(suid,reloadstr);
    lnchatiFrame.scrolling = 'no';
    lnchatiFrame.frameBorder = '0';
    lnchatiFrame.style.border = "none";
    lnchatiFrame.style.width = "254px";
    lnchatiFrame.style.height = "360px";
    lnchatiFrame.setAttribute('allowtransparency', 'true');       
    bindEvent(lnchatiFrame, "load", flagChatFrameLoaded);
    lnchatiFrameContainer.appendChild(lnchatiFrame);
	myUI.bindEvents();
	}
}
 
function lpChkValidUser() {
            var s = lpReadCookie("amexsessioncookie");
            var z = lpReadCookie("blueboxvalues");
            var r = lpReadCookie("SMSESSION");
            if (s != null  && s != "") {
                var v = new Date()
                  , u = v.getTime()
                  , w = "=([^|]+)"
                  , y = s.match("uts" + w)[1]
                  , x = parseInt((u - y) / (1000 * 60 * 60));
                if (x < 12) {
                    return true
                } else {
                    return false
                }
            } else {
                if ((z != null  && z != "") || (r != null  && r != "LOGGEDOFF")) {
                    return true
                } else {
                    return false
                }
            }
        }
 function lpReadCookie(u) {
            var w = u + "=";
            var s = document.cookie.split(";");
            for (var v = 0; v < s.length; v++) {
                var r = s[v];
                while (r.charAt(0) == " ") {
                    r = r.substring(1, r.length)
                }
                if (r.indexOf(w) == 0) {
                    return r.substring(w.length, r.length)
                }
            }
            return null 
        }
		
 function getLenoFrameSource(suid,reloadstr) {
	 
	  lenoframeURL = getChatBaseDomain() +lpCWTagConst.LENOCHAT_LOCATION_URI+suid+reloadstr;	 
	  return lenoframeURL;
 }		
 
 function getFrameSource() {
  var frameURL = '';
  if(lpChkValidUser()){
  frameURL = "https://www.aexp-static.com/api/axpi/ioa/chatserver/leChatWireFrame2.html?intlvr=32.0&vr"+ lpCWTagConst.VERSION+"userloggedin=true";  
  
  }else{
  frameURL = "https://www.aexp-static.com/api/axpi/ioa/chatserver/leChatWireFrame2.html?intlvr=32.0&vr"+ lpCWTagConst.VERSION;
     }  

  //frameURL = "https://qwww.aexp-static.com/api/axpi/EW/chatserver/leChatWireFrame.html?vr"+ lpCWTagConst.VERSION;

  if(document.cookie.indexOf("lpchat_active")>-1){
	  frameURL=frameURL+"&lpchatactive=true";
  }else{
	  frameURL=frameURL+"&lpchatactive=false";
  }
  if(document.cookie.indexOf("marvinchat_active")>-1){
	  frameURL=frameURL+"&marvinchatactive=true";
  }else{
	  frameURL=frameURL+"&marvinchatactive=false";
  }  
  if(typeof(Bootstrapper) != "undefined"){
		frameURL=frameURL+"&lpctrycd="+Bootstrapper.ensMarket;
	}  
	frameURL=frameURL+"&intlvr=29.0";
	
	var cvalue = getCookie_AA('lpdata');
	var str ='';
	if(cvalue!=""){
	var carr = cvalue.split("||");
	for(i=0;i<carr.length;i++){
		var pname = carr[i].split("=")[0];
		var pvalue = carr[i].split("=")[1]; 
		str=str+'&'+pname+"="+pvalue;
	}
	var vid = getCookie_AA('vid');
	str=str+'&vid='+vid;	
	
	var lastupdate = getCookie_AA('lpupdate');
	str=str+'&lpupdate='+lastupdate;
	
	var lpcoredata = getCookie_AA("lpcoredata");
	lpcoredata = encodeURIComponent(lpcoredata);
	str=str+'&smdatacore='+lpcoredata;
	
   }   
   var setatbbv = getCookie_AA("setatbbv");
	str=str+'&setatbbv='+setatbbv;
	
	var setatesc = getCookie_AA("setatesc");
	str=str+'&setatesc='+setatesc;
	
	var setatcnvsid = getCookie_AA("setatcnvsid");
	str=str+'&setatcnvsid='+setatcnvsid;
var jwtVal = getCookie_AA("jwtVal");
	str=str+'&jwtValue='+jwtVal;
	
   frameURL=frameURL+str;
	if((window.location.href.indexOf("travel")!=-1) || (window.location.href.indexOf("iseatz.com")!=-1)){
		frameURL=frameURL+'&travelpage=true';
	}
	var qlpscont;
	if (typeof window.lpMTagConfig  != "undefined") {		
		if(typeof window.lpMTagConfig.FPC_CONT!= "undefined")
			qlpscont = window.lpMTagConfig.FPC_CONT;
		else
			qlpscont = getCookie_AA("qScont");
		frameURL=frameURL+'&qlpscont='+qlpscont;
  }else{
	  qlpscont = getCookie_AA("qScont");
		frameURL=frameURL+'&qlpscont='+qlpscont;
  }
	
		
  return frameURL;
 }
 
 function isSameOrigin(respDomain) {
  logger.debug("isSameOrigin respDomain=" + respDomain , "targetDomain: " + getTargetForChatFrame());
  return getTargetForChatFrame() == respDomain ? true : false;
 }
 
 /**
  * Send postMessage to iFrame
  * @param jsonData - json data to send to iFrame
  */
 function sendPostMessage(jsonData){
  logger.debug("parentFrame sending postmsg to ="+getTargetForChatFrame(), jsonData);
  
  if (getLPChatiFrameObj().postMessage)
   getLPChatiFrameObj().postMessage(JSON.stringify(jsonData), getTargetForChatFrame()); 
  else  
   throw new Error ("Your browser does not support the postMessage method!"); 
     
 }
 
 function getLPChatiFrameObj() {
  var x = document.getElementById("lpChatiFrame");
  return (x.contentWindow || x.contentDocument);
 }
 
 //hide embedded chat window
 function hideLPChat() {
  hideElement(chatWizContainer);
 }
 
 //show embedded chat window
 function showLPChat() {
  showElement(chatWizContainer);
 }
 
 /**
  * Fire web service and detecting auto completion within 10sec
  */
 
	/* code for session extention on SPA starts*/
	var sessionIntervalID =null;
	var eventChat = null;
	if(document.createEvent){
		eventChat = document.createEvent('CustomEvent');
		eventChat.initCustomEvent('extendSession', false, false, {});
	}

	myUI.keepSessionAlive  = function(){
		console.log("in myUI.keepSessionAlive");
	  window.dispatchEvent(eventChat);	  
	}
	/* code for session extention on SPA ends*/
 
   /* code for refresh starts here*/
 function refreshTillTimeout(){
	 var timeCounter=0;
		if (timeoutInterval !== null) return;	
		timeoutInterval = setInterval(function(){
		timeCounter=timeCounter+1;
		
		if((timeCounter<30 && timeCounter%2 == 0) && !chatlasttimeout){
			var travelele = document.getElementById("rhContainer");	
			if (typeof timeoutWidget!= "undefined") {
				timeoutWidget.refreshSession();
			}else if (typeof chatSessionCallback != "undefined") {
				chatSessionCallback(true);
			}else if(window.location.href.indexOf("ssearch.jsp")>-1){
				var d = new Date();
				chatcurrentTime = d.getTime();
			}else if(typeof travelele !== 'undefined' && travelele !== null){
				angular.element(document.getElementById("rhContainer")).scope().$parent.userSessionTimeout();
	  	    }	
			logger.debug("refreshSession started", "refresh method triggered");
			isTimerStopped=false;
		}
		if(timeCounter>=30 || chatlasttimeout){			
			if(!chatlasttimeout){
				if(timeCounter>=30){
					sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "TIMERCOMPLETE", "value" : "true"}); 
				}
			}
			clearInterval(timeoutInterval);
			logger.debug("refreshSession stopped");
			chatlasttimeout=false;
			isTimerStopped=true;
			clearInterval(sessionIntervalID); //added here for SPA
		}		
	 
   }, 60000);//2 mins 
 }
 
 //invokes when close button on the title bar is clicked
 function closeButtonClicked(){
  logger.debug("closeButtonClicked", "method is invoked");
  deletelpchatActiveCookie1('lpPopulation');
  try {
      if (typeof omn_rmassistaction!= "undefined") 
	omn_rmassistaction("Click","LiveChat_InChatSession-Close");
  }catch(e){
	console.log("omn error LiveChat_InChatSession-Close");
  }
  sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "CONTROL", "value" : "END_CHAT"});
 }
 
 function closeButtonClickedforEnterkey(e){
	 e = e || window.event;
				var key = (e.keyCode ? e.keyCode : e.which); 
	if (key == 13) {
		logger.debug("closeButtonClicked", "method is invoked");
		deletelpchatActiveCookie1('lpPopulation');
		try {
			omn_rmassistaction("Click","LiveChat_InChatSession-Close");
		}catch(e){
			console.log("omn error LiveChat_InChatSession-Close");
		}
		sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "CONTROL", "value" : "END_CHAT"});
	}
	if(document.activeElement.id === "lpChatEndChatBtn"){
		document.getElementById("lpChatMinizeBtn").style.outline = "none";		
	}	
	if(key == "9"){
		document.getElementById("lpChatEndChatBtn").style.outline = "none";
	}
	if(e.shiftKey && key == "9"){
document.getElementById("lpChatMinizeBtn").style.outline = "2px solid #265AB1";
		document.getElementById("lpChatMinizeBtn").focus();
		
		if (e.preventDefault) {
			e.preventDefault();
		}else{
			e.returnValue = false;
		}
	}
 }
  function closeButtonClickedforShiftTabkey(e){
	 e = e || window.event;
	var key = (e.keyCode ? e.keyCode : e.which); 
	if(e.shiftKey && key == "9"){
		document.getElementById("lpChatMinizeBtn").focus();
		document.getElementById("lpChatMinizeBtn").style.outline = "2px solid #265AB1";
	}
 }
 function closeButtonClickedForMinforEnterkey(e){
	  e = e || window.event;
				var key = e.keyCode || e.which;
				if (key == 13) {
						closeButtonClickedForMin();
				}if (e.shiftKey && key == "9") {
						document.getElementById("lpChatEndChatBtnMin").style.outline = "none";
						document.getElementById("lpChatMaximizeBtn").focus();
						document.getElementById("lpChatMaximizeBtn").style.outline = "2px solid #265AB1";
						if (e.preventDefault) {
							e.preventDefault();
						}else{
							e.returnValue = false;
						}
				}else if (key == "9") {

						
						document.getElementById("lpChatEndChatBtnMin").focus();
						document.getElementById("lpChatEndChatBtnMin").style.outline = "2px solid #265AB1";
						if (e.preventDefault) {
							e.preventDefault();
						}else{
							e.returnValue = false;
						}
				}


 }
  var chatlogomin;
	var ccount;
	var stopanimate=false;
	
 function closeButtonClickedForMin(){
  logger.debug("closeButtonClicked for min", "method is invoked");
  sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "CONTROL", "value" : "END_CHAT"});
  var titleDiv = document.getElementById( 'lpChatTitleContainerMin' );
  var titleText = document.getElementsByClassName("lpChatHeaderText")[1];
  titleDiv.style.backgroundColor = "#002665";
  titleText.style.color = "white";
  if(document.getElementById("lpMessageIconPos").className.indexOf("animateIcon") != -1){
	document.getElementById("lpMessageIconPos").className = "lpChatTitleContainerLogo lpLeft lpCustSpriteBackground lpCustChatLogoSmall";
  }
  if(getCookie_AA1('lpPopulation') == "AUTOMATION")	
	titleText.innerHTML = "American Express Chat";
  else 
	titleText.innerHTML = "American Express Live Chat";	
  //document.getElementById("lpMessageIconPos").style.marginTop = "14px";
  stopanimate=true;
  document.getElementById('lpMessageIconPos').style.top="";
 }
 //invokes when browser is resize
 function onWinResizeEvent(){
  logger.debug("onWinResizeEvent", "...");
  adjustChatWizLocation();
 }
 
 /**
  * Adjust the embedded window to display a proper location depends on the logic inside the code
  */
 function adjustChatWizLocation(){
  var wizNewTop, wizNewLeft, top, bottom, left, right;
  var chatWizContainerOffset = getOffset(chatWizContainer); 
  var wizCurrentTop = chatWizContainerOffset.top;
  var wizCurrentLeft = chatWizContainerOffset.left;
  var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  var wizWidth = chatWizContainer.offsetWidth;
  var wizHeight = chatWizContainer.offsetHeight;
  logger.debug("adjustChatWizLocation", "(win.width, win.height): ("+winWidth+", "+winHeight +") (widget.width, widget.height): (" + wizWidth+", " + wizHeight
       + ") (EW.top, EW.left): ("+ wizCurrentTop + ", " + wizCurrentLeft + ")");
  
  if(isDock){ 
   wizNewTop = winHeight - wizHeight;
   wizNewLeft = winWidth - wizWidth - lpCWTagConst.widgetMarginRight;
   
   if(wizNewTop >=0){
    //enough space for the height
    top ="auto";
    bottom ="0px";
   }else{
    //not enought space for the height
    top ="0px";
    bottom = "auto";
   }
   
   if(wizNewLeft >=0){
    //enough space for the width
    left = "auto";
    right = "0px";
   }else{
    //not enough space for the width
    left = "0px";
    right = "auto";
   }
   
  }else{
   wizNewTop = winHeight - wizHeight - wizCurrentTop;
   wizNewLeft = winWidth - wizWidth - wizCurrentLeft;
   logger.debug("adjustChatWizLocation", "new (EW.top, EW.left):("+ wizNewTop + ", " + wizNewLeft+")");
  
   //reaching to the top, adjust to fit window
   if(wizNewTop < 0)
    wizNewTop = winHeight - wizHeight;
   else
    wizNewTop = wizCurrentTop;
   
   //if passing out the top range, at least visible the top 
   if(wizNewTop < 0){
    wizNewTop = 0;
   }
   
   //if reaching to left, adjust left to fit window
   if(wizNewLeft < 0)
    wizNewLeft = winWidth - wizWidth;
   else
    wizNewLeft = wizCurrentLeft;
   
   //if passing out of left range, at least visible from the left
   if(wizNewLeft < 0)
    wizNewLeft = 0;
   
   bottom = "auto";
   right = "auto";
   left = wizNewLeft + "px";
   top = wizNewTop + "px";
  }
  
  logger.debug("adjustChatWizLocation", "FINAL (EW.top, EW.left, EW.bottom, EW.right) : ("+ top + ", "+ left+", " + bottom + ", " + right + ")");
  
  chatWizContainer.style.bottom = bottom;
  chatWizContainer.style.right = right;
  chatWizContainer.style.left = left;
  chatWizContainer.style.top = top;
 }
 
 //invokes to adjust embedded window size to make it larger to accomodate PCI widget
 function adjustWindowSizeForPCI(){
  logger.debug("adjustWindowSizeForPCI", "...");
  chatWizContainer.style.width="700px";
  chatiFrameContainer.style.width = "700px";
  chatiFrame.style.width = "700px";
  logger.debug("adjustWindowSizeForPCI", "1top="+chatWizContainer.style.top+", "+chatWizContainer.style.left);
  
  var newLeft = parseInt(chatWizContainer.style.left) - 300;
  if(newLeft < 0 )
   newLeft = 0;
  chatWizContainer.style.left = newLeft+"px";
 }
 
 //invokes to adjust embedded window to a standard size without PCI widget
 function adjustWindowSizeNonePCI(){
  logger.debug("adjustWindowSizeNonPCI", "...");
  logger.debug("adjustWindowSizeNonPCI", "top="+chatWizContainer.style.top+", "+chatWizContainer.style.left);
  chatiFrameContainer.style.width = "400px";
  chatiFrame.style.width = "400px";
  
  //adjust window location
  var originalLeft = parseInt(chatWizContainer.style.left);
  var chatWizContainerWidth = parseInt(chatWizContainer.style.width);
  logger.debug("adjustWindowSizeNonPCI", "width="+chatWizContainer.style.width);
  if(chatWizContainerWidth > 400){
   originalLeft += 300 ;
  }
  
  chatWizContainer.style.width = "400px";
  chatWizContainer.style.left = originalLeft+"px";
  
  logger.debug("adjustWindowSizeNonPCI", "originalLeft="+originalLeft+", " + "top="+chatWizContainer.style.top+", "+chatWizContainer.style.left);
 }
 
 //invokes to handle minimize embedded window
 function showMinimizeHandler(){
  logger.debug("showMinimizeHandler", "method is invoked");
  document.getElementById('lpChatMinizeBtn').style.outline = 'none'; 
  chatWizContainer.style.bottom = "0px";
  chatWizContainer.style.right = "0px";
  chatWizContainer.style.left = "auto";
  chatWizContainer.style.top = "auto";
     document.getElementById('lpChatWizContainer').style.boxShadow = 'none';
   if(isPremExp==true)
	chatWizContainer.style.right = "300px";
  
  hideElement(chatiFrameContainer);
                  document.getElementById('lpChatTitleContainer').style.display = 'none'; 
  document.getElementById('lpChatTitleContainerMin').style.display = 'block'; 
  if(getCookie_AA1('lpPopulation') == "AUTOMATION"){	
	 document.getElementsByClassName("lpChatHeaderTextmin")[0].innerHTML="American Express Chat";
        document.getElementById('lpChatTitleContainerMin').style.width="245px";
   }else{
  	 document.getElementsByClassName("lpChatHeaderTextmin")[0].innerHTML="American Express Chat"; 	
        document.getElementById('lpChatTitleContainerMin').style.width="263px";
   }
  
  var chatIconMinBtnImg = getElement("lpChatMinizeBtnImg");
  var newClasses = deleteAppendStyleClass(chatIconMinBtnImg, "lpCustChatIconMinimize", "lpCustChatIconMinimize");
  chatIconMinBtnImg.className = newClasses;
 
  var chatIconMinBtn = getElement("lpChatMinizeBtn");
  chatIconMinBtn.setAttribute("data-msg", lpCWTagConst.lpChatTitleMinimize);
  sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "FLASHING", "value" : "MINIMIZED", "MSG": "" });
  chatMaximize = false;
  try {
	omn_rmassistaction("Click","LiveChat_InChatSession-Minimize");
  }catch(e){
	console.log("omn error LiveChat_InChatSession-Minimize");  
  }
 }
 
 
 function showMinimizeHandlerforEnterKey(e){
	  e = e || window.event;
				var key = (e.keyCode ? e.keyCode : e.which); 
				if (key == 13) {
						showMinimizeHandler();
						document.getElementById('lpChatMaximizeBtn').focus();	
						document.getElementById('lpChatMaximizeBtn').style.outline = "2px solid #265AB1";
				}
				if (e.shiftKey && key == "9") {

						document.getElementById('lpChatMinizeBtn').focus();	
						document.getElementById("lpChatMinizeBtn").style.outline = "2px solid #265AB1";
						if (e.preventDefault) {
							e.preventDefault();
						}else{
							e.returnValue = false;
						}
				}else if (key == "9") {
						document.getElementById("lpChatMinizeBtn").style.outline = "none";							
						document.getElementById("lpChatEndChatBtn").style.outline = "2px solid #265AB1";
				}
	/*try{		
		omn_rmassistaction("Click","LiveChat_InChatSession-Minimize");
	}catch(e){
		console.log("omn error in LiveChat_InChatSession-Minimize");
	}*/

 }
 function showMaximizeHandlerforEnterKey(e){
	 e = e || window.event;
				var key = e.keyCode || e.which;
				if (key == 13) {
						showMaximizeHandler();
						document.getElementById('lpChatMinizeBtn').focus();	
						document.getElementById('lpChatMinizeBtn').style.outline = "2px solid #265AB1";
				}if (e.shiftKey && key == "9") {
						
						document.getElementById("lpChatEndChatBtnMin").style.outline = "none";
						document.getElementById('lpChatMaximizeBtn').focus();
						document.getElementById('lpChatMaximizeBtn').style.outline = "2px solid #265AB1";
						if (e.preventDefault) {
							e.preventDefault();
						}else{
							e.returnValue = false;
						}

				}
				else if (key == 9) {
						document.getElementById('lpChatMaximizeBtn').style.outline = "none";
						document.getElementById("lpChatEndChatBtnMin").style.outline = "2px solid #265AB1";
				}
	/*try{
		omn_rmassistaction("Click","LiveChat_InChatSession-Maximize");
	}catch(e){
		console.log("omn error LiveChat_InChatSession-Maximize");
	}*/
 }
 
 //invokes to handle maximize embedded window
 function showMaximizeHandler(){
  logger.debug("showMaximizeHandler", "method is invoked");
  showElement(chatiFrameContainer);
  document.getElementById('lpChatMaximizeBtn').style.outline = 'none'; 
  document.getElementById('lpChatTitleContainer').style.display = 'block';
  document.getElementById('lpChatTitleContainerMin').style.display = 'none'; 
     document.getElementById('lpChatWizContainer').style.boxShadow = '0 0 2em #666666';
  if(getCookie_AA1('lpPopulation') == "AUTOMATION"){	
	 document.getElementsByClassName("lpChatHeaderText")[0].innerHTML="American Express Chat";     
   }else{
  	 document.getElementsByClassName("lpChatHeaderText")[0].innerHTML="American Express Chat"; 	
   }

  adjustChatWizLocation();
  
  var chatIconMinBtnImg = getElement("lpChatMaximizeBtnImg");
  var newClasses = deleteAppendStyleClass(chatIconMinBtnImg, "lpCustChatIconMaximize", "lpCustChatIconMaximize");
  chatIconMinBtnImg.className = newClasses;
 
  var chatIconMinBtn = getElement("lpChatMaximizeBtn");
  chatIconMinBtn.setAttribute("data-msg", lpCWTagConst.lpChatTitleMaximize);
  
  logger.debug("showMaximizeHandler", "flashingStop....before");
  flashingStop();
  logger.debug("showMaximizeHandler", "flashingStop....after");
  sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "FLASHING", "value" : "MAXIMIZED", "MSG": "" });
  chatMaximize = true;
  
  chatWizContainer.style.top = setTopOffPositionValue + "px";
  chatWizContainer.style.left = setLeftOffPositionValue + "px";  
  try{
     if(typeof omn_rmassistaction!= "undefined" && omn_rmassistaction!= null)
	omn_rmassistaction("Click","LiveChat_InChatSession-Maximize");
  }catch(e){
	console.log("omn error in LiveChat_InChatSession-Maximize"); 
  }
 }
 
 //invokes when minimize or maximize button is clicked
 function minimzeMaximizeButtonClick() {
  logger.debug("minimzeMaximizeButtonClick", "method is invoked");
  
  if(chatMaximize){
   showMinimizeHandler();
  }else{
   showMaximizeHandler();
  }
 }
 
 /**
  * Handle the end chat
  */
 function endChat(){
  logger.debug("endChat", "method is invoked");
  chatlastrefreshtime = 0;
  document.getElementById("lpChatEndChatBtn").style.outline = "none";
  document.getElementById("lpChatEndChatBtnMin").style.outline = "none";
  if(typeof(Bootstrapper) != "undefined")
	  document.getElementById("lpChatWizContainer").className = "lp_"+Bootstrapper.ensMarket;
  delCookie("lp_flg");
  isChatActive = false;
  showChatWizContainerVisibility(false);
  dockButtonHandler(); 
  clearInterval(webserviceTimer);
 }
 
 /**
  * make flashing to the page title
  */
 function flashMainPageTitle(){
  originalSiteTitle = document.title;
  titleTimer = setInterval(function(){
    logger.debug("flashMainPageTitle", "originalSiteTitle...."+originalSiteTitle);
    if (document.title == lpCWTagConst.lpNewChatMsgArrive){
     document.title = originalSiteTitle;
    }else{
     document.title = lpCWTagConst.lpNewChatMsgArrive;
    }
   }, 800);
 }

 // invokes when there is a new message arrived and embedded window in minimized state
 function flashingStart(){
  /*var defaultColor = 1;
  if(lpCWTagConst.enableSiteTitleFlashing)
   originalSiteTitle = document.title;
   
  if (typeof lpCWTagConst.lpTitleFlashingTimer == "undefined") {
   logger.debug("lpFlashingStart", " starting...");
   lpCWTagConst.lpTitleFlashingTimer = setInterval(function(){ 
       var titleDiv = getElement( 'lpChatTitleContainer' );
       var titleText = getElement('lpChatTitleTxt');
   var msgIconPos = getElement('lpMessageIconPos');
       if(defaultColor == 1){
        titleDiv.style.backgroundColor = '#335184';
        titleText.style.color = "#ffeb37";
    msgIconPos.style.maringTop = "-9px";
        defaultColor = 0;
       }else{
        titleDiv.style.backgroundColor = '#335184';
        titleText.style.color = "white";
    msgIconPos.style.maringTop = "14px";
        defaultColor = 1;
       }
       
       if(lpCWTagConst.enableSiteTitleFlashing){
      if (document.title == lpCWTagConst.lpNewChatMsgArrive){
       document.title = originalSiteTitle;
      }else{
       document.title = lpCWTagConst.lpNewChatMsgArrive;
      }
     }
      }, 1000);
   }*/ 
  logger.debug("in lpFlashingStart", " starting...");
    var titleDiv = document.getElementById( 'lpChatTitleContainerMin' );
       var titleText = document.getElementsByClassName("lpChatHeaderText")[1];
    var msgIconPos = document.getElementById("lpMessageIconPos");       
       titleDiv.style.backgroundColor = '#002665';
       titleText.style.color = "darkorange";
	    chatlogomin = document.getElementById('lpMessageIconPos');
		ccount = 0;
		 document.getElementById("lpMessageIconPos").className += " animateIcon";
		if(document.getElementById("lpMessageIconPos").className.indexOf("animateIcon") != -1){
			stopanimate=false;ccount=0;
			chaticonmoveup();
		}
    //document.getElementById("lpMessageIconPos").style.marginTop = "-9px";
  
    logger.debug("in lpFlashingStart::", titleDiv.style.backgroundColor);
    logger.debug("in lpFlashingStart::", titleText.style.color);
    logger.debug("in lpFlashingStart::", msgIconPos.style.maringTop);
  logger.debug("in lpFlashingStart", " stopping...");
    
 }
 
 // Stop flashing when embedded window is in maximized state
 function flashingStop(){
  logger.debug("lpFlashingStop", " stoppping...");
  
  var titleDiv = document.getElementById( 'lpChatTitleContainerMin' );
     var titleText = document.getElementsByClassName("lpChatHeaderText")[1];
     var msgIconPos = document.getElementById('lpMessageIconPos');  
  clearInterval(lpCWTagConst.lpTitleFlashingTimer);
  titleDiv.style.backgroundColor = "#002665";
  titleText.style.color = "white";
  if(document.getElementById("lpMessageIconPos").className.indexOf("animateIcon") != -1){
 document.getElementById("lpMessageIconPos").className = "lpChatTitleContainerLogo lpLeft lpCustSpriteBackground lpCustChatLogoSmall";
  }  
  //document.getElementById("lpMessageIconPos").style.marginTop = "14px";
  stopanimate=true;
  document.getElementById('lpMessageIconPos').style.top="";
  
  lpCWTagConst.lpTitleFlashingTimer = undefined;
  if(lpCWTagConst.enableSiteTitleFlashing){
   document.title = originalSiteTitle;
   originalSiteTitle = "";
  }
  logger.debug("lpFlashingStop", " stoppping... ending");
 }
 //code for animation icon
 function chaticonmoveup(){
if(!stopanimate){
	ccount++;
	chatlogomin.style.top = parseInt(chatlogomin.offsetTop)-1+'px';
	if(ccount<27)
		setTimeout(chaticonmoveup,15);
	else{ccount=0;
		chaticonmovedown();
		}
}
}
function chaticonmovedown(){
if(!stopanimate){
	ccount++;
	chatlogomin.style.top = parseInt(chatlogomin.offsetTop)+1+'px';
	if(ccount<27)
		setTimeout(chaticonmovedown,15);
	else{ccount=0;
		chaticonmovehalfup();
		}
}
}
function chaticonmovehalfup(){
if(!stopanimate){
	ccount++;
	chatlogomin.style.top = parseInt(chatlogomin.offsetTop)-1+'px';
	if(ccount<7)
		setTimeout(chaticonmovehalfup,15);
	else{ccount=0;
		chaticonsmovehalfdown();
		}
}
}
function chaticonsmovehalfdown(){
if(!stopanimate){
	ccount++;
	chatlogomin.style.top = parseInt(chatlogomin.offsetTop)+1+'px';
	if(ccount<7)
		setTimeout(chaticonsmovehalfdown,15);
	else{ccount=0;
		setTimeout(chaticonmoveup,500);
		}
}
}
 
 //make embedded window visible
 function showChatWizContainerVisibility(bVal){
  logger.debug("showChatWizContainerVisibility", "...");
  if(bVal){  
   showElement(chatWizContainer);
   console.log('poulation flag in Cookie:'+getCookie_AA('lpPopulation'));
   if(typeof lpTestPopulation != "undefined")
	   console.log('Population flag:'+lpTestPopulation);
   else
	    console.log('Population flag not yet defined');
  if(getCookie_AA1('lpPopulation') == "AUTOMATION"){	
	 document.getElementsByClassName("lpChatHeaderTextmin")[0].innerHTML="American Express Chat";
          document.getElementById('lpChatTitleContainerMin').style.width="245px";
	  document.getElementsByClassName("lpChatHeaderText")[0].innerHTML="American Express Chat";  	 	
   }else{
  	 document.getElementsByClassName("lpChatHeaderTextmin")[0].innerHTML="American Express Chat"; 	
        document.getElementById('lpChatTitleContainerMin').style.width="263px";
	 document.getElementsByClassName("lpChatHeaderText")[0].innerHTML="American Express Chat";
   }    
  }else{ 
   hideElement(chatWizContainer); 
  }
 }
 
 /* make html for blue header with dock, minimize and close button */
 function makeHeader() {
  var headerStr = '<div id="lpChatTitleContainer" class="lpRight">'
    + '<div id="lpChatTitleDragArea" class="lpLeft"><div class="lpLeft"><span class="lpChatTitleContainerLogo lpLeft lpCustSpriteBackground lpCustChatLogoSmall lpChatHeaderIcon" ></span></div>'
    + '<div id="lpChatTitleTxt" class="lpLeft lpChatHeaderText noselect" unselectable="on">' + lpCWTagConst.lpChatTitleVal + '</div></div>'
    + '<div class="lpRight lpHeaderActionbuttonsContainer" style="">' 
    + '<div class="lpHeaderActionbuttons lpHoverButton lpPointer" data-msg="Minimize" id="lpChatMinizeBtn" tabindex="0">'
    + '<span id="lpChatMinizeBtnImg" class="lpPointer lpCustSpriteBackground lpCustChatIconMinimize" ></span></div>'
    + '<div class="lpHeaderActionbuttons lpHoverButton lpPointer" data-msg="End Chat" id="lpChatEndChatBtn" tabindex="0"><span class="lpPointer lpCustSpriteBackground lpCustChatIconClose"></span></div>'
    + '</div><div class="lpClear"></div>'
    + '</div><div class="lpClear"></div>';
    return headerStr;
 }
 /* make html for blue header with dock, minimize and close button */
 function makeHeaderForMin() {
  var lpMinHeader = document.createElement('div');
  lpMinHeader.id = 'lpChatTitleContainerMin';
  lpMinHeader.className = 'lpRight';
  lpMinHeader.style.display="block";
  lpMinHeader.innerHTML = '<div id="lpChatTitleDragAreaMin" class="lpLeft"><div class="lpLeft"><span id="lpMessageIconPos" class="lpChatTitleContainerLogo lpLeft lpCustSpriteBackground lpCustChatLogoSmall"></span></div><div id="lpChatTitleTxt" class="lpLeft lpChatHeaderText noselect lpChatHeaderTextmin" unselectable="on">American Express Chat</div><div class="lpRight lpHeaderActionbuttonsContainer" style=""><div class="lpHeaderActionbuttons lpHoverButton lpPointer" data-msg="Maximize" id="lpChatMaximizeBtn" tabindex="0"><span id="lpChatMaximizeBtnImg" class="lpPointer lpCustSpriteBackground lpCustChatIconMaximize"></span></div></div></div><div class="lpHeaderActionbuttons lpHoverButton lpPointer" data-msg="End Chat" id="lpChatEndChatBtnMin" tabindex="0"><span class="lpPointer lpCustSpriteBackground lpCustChatIconClose"></span></div><div class="lpClear"></div>';
  chatWizContainer.appendChild(lpMinHeader);    
 }
 
 
 /* make hover message for dock, minimize and close button */
 function makeHoverDiv(msg, pDownArrow) {
  removeMouseOverToolTip();
  
  var messageDiv = document.createElement('div');
  messageDiv.className = pDownArrow?'lpBubbleUp':'lpBubbleDown';
  messageDiv.id = "lpToolTipContent";
  messageDiv.innerHTML = msg;
  return messageDiv;
 }
 
 // remove hover tool-tip div
 function removeMouseOverToolTip() {
  logger.debug("removeMouseOverToolTip", "delete tooltip");
  removeElement(getElement("lpToolTipContent"));
 }
 
 
 myUI.endChatRequest = function(){
  closeButtonClicked();
 }
 
 myUI.debugEnable = function(){
  lpCWTagConst.DEBUG_ENABLE = true;
  sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "DEBUG", "value" : "ENABLE"});
 }
 
 myUI.debugDisable = function(){
  lpCWTagConst.DEBUG_ENABLE = false;
  sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "DEBUG", "value" : "DISABLE"});
 }
 
 myUI.debug = function(pLogName, pData) {
  logger.debug(pLogName, pData);
 }
 myUI.loadChat  = function(data) {
  logger.debug("loadChat", "method invoked");
  lpChatBuildFrame();
	var iFrameContentTimerCounter = 0;
  var iFrameContentTimer = setInterval(function(){
     iFrameContentTimerCounter += 500;
     if(iFrameContentTimerCounter >= 30000){
      clearInterval(iFrameContentTimer);
      logger.info("loadChat", "iframe content exceeded maximun load time of " + iFrameContentTimerCounter + " seconds. Suggest to reload page");
     }else{
          logger.debug("loadChat", "waiting for iFrame content to load..chatFrameLoaded="+chatFrameLoaded); 
           if(chatFrameLoaded){
            logger.debug("loadChat", "iFrame content fully loaded"); 
            if(typeof lpTag != "undefined" && typeof lpTag.exp_value != "undefined" && lpTag.exp_value!="")
				expansionFlag = lpTag.exp_value;
		
		var bbCookie = getCookie_AA('blueboxpublic');		
		var xcutobj;
  if(typeof mycaAssistJSON != "undefined"){
	if(mycaAssistJSON.commonAppData !=null && mycaAssistJSON.commonAppData!="")
	{
		xcutobj = mycaAssistJSON.commonAppData;
		if(xcutobj!=null)
		{
			lenosToken=JSON.parse(xcutobj).stoken;
		}
	}
  }else{
     if(typeof loyaltyAssistJSON != "undefined"){
	if(loyaltyAssistJSON.commonAppData !=null && loyaltyAssistJSON.commonAppData!="")
	{
		xcutobj = loyaltyAssistJSON.commonAppData;
		if(xcutobj!=null)
		{
			lenosToken=JSON.parse(xcutobj).stoken;
		}
	}
     }

  }	 
	 

   var defaultSkill = 'offline';
		if (typeof window.lpChatSkill != "undefined") {
   			defaultSkill = window.lpChatSkill;
  		}

	if(document.getElementById("oceLayer")!=null)
		firsttimelogin ="true";	
	
    var cType="";
    if(typeof lpTag.sdes.get("ctmrinfo")!="undefined" && typeof lpTag.sdes.get("ctmrinfo")[0] !="undefined" && typeof lpTag.sdes.get("ctmrinfo")[0].info !="undefined"){
		cType = lpTag.sdes.get("ctmrinfo")[0].info.ctype;
	}	
		
	var sidvid="";
    if(typeof lpTag.taglets !="undefined" && typeof lpTag.taglets.lp_monitoringSDK !="undefined"){
		sidvid = lpTag.taglets.lp_monitoringSDK.getVid();
	}	
       var jwtTimer = setInterval(function(){
		 if(jwtValue!=="") { 
		    clearInterval(jwtTimer); 
			sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "CONTROL", "value" : "lpStartChatButtonClicked","pageurl": location.search.substring(1),"nuanceFlowFlag":lpTestPopulation.toUpperCase(),"sendAddlineTrigger":true,"xcutobj":xcutobj,"bbCookie":bbCookie,"lpexpansion":expansionFlag,"jwtValue":"","sidvid":sidvid,"cType":cType,"skill" : cType,"firsttimelogin":firsttimelogin,"visitorId":data.svid,"sessionId":data.ssid,"interactionContextId":data.scid});
			
		 }  	      
		}, 500);
 		showMaximizeHandler(); 
         clearInterval(iFrameContentTimer);
        }
        }
      }, 500);	

  
  }
 
 myUI.chatOnPageLoad  = function() {
  logger.info("chatOnPageLoad", "starting...");
  lpChatBuildFrame();
 }
 
 myUI.registerOnMessage = function() {
  if (window.addEventListener){
   window.addEventListener("message", myUI.receiveChatPostMessage, false)
  } else {
   window.attachEvent("onmessage", myUI.receiveChatPostMessage)
  }
 }
 
 myUI.receiveChatPostMessage  = function(e) {logger.debug("in receive of bootstrapp file ");
  if (lpCWTagConst.DEBUG_ENABLE && isSameOrigin(e.origin)) {
   logger.debug("receiveChatPostMessageParent", e.data);
  }
  
  try{
   var msgData = JSON.parse(e.data);
    logger.debug("in bootstrap receiveChatPostMessageParent value::::", msgData.value);
  logger.debug("in bootstrap receiveChatPostMessageParent cmd::::", msgData.CMD);

	if(msgData.isSliderEnabled=='true'){
		if(!lenofromReload){
			if(msgData.type=="offer")
				lenoofferCount=lenoofferCount+1;
			else
				lenosecCount=lenosecCount+1;
		}	
		if(msgData.type=="offer")
			sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "LENOOFFERCOUNT","value":lenosToken+"_"+lenoofferCount}); 
		else
			sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "LENOSECCOUNT","value":lenosToken+"_"+lenosecCount});
		console.log("msgData.offerName_msgData.offerId"+msgData.offerName+"_"+msgData.offerId);
		
		var elem = document.createElement('div');
		elem.innerHTML = msgData.offerName;
		tmpElem = elem.innerHTML;
		tmpElem = tmpElem.replace(/[^a-zA-Z0-9 ]/g, "")
		console.log(tmpElem);
		
		if(!lenofromReload){
                  var rcOpenarray=[]; 
                  var ts1, ts2;
		    if(msgData.type=="offer"){	
				//lpSendData("session","RC_offer_name"+lenoofferCount,tmpElem+"_"+msgData.offerId);
				ts1 = 'RC_offer_sent'+lenoofferCount+'|'+'true';      
				ts2 = 'RC_offer_name'+lenoofferCount+'|'+tmpElem+'_'+msgData.offerId;        
				rcOpenarray.push(ts1);
				rcOpenarray.push(ts2);					
			}else{
				//lpSendData("session","Secure Question"+lenosecCount,tmpElem);
				ts1 = 'Secure Widget Sent'+lenoofferCount+'|'+'true';
				ts2 = 'Secure Question'+lenoofferCount+'|'+tmpElem;
				rcOpenarray.push(ts1);
				rcOpenarray.push(ts2);
                     }
                     
                  lpTag.sdes = lpTag.sdes||[];
        	     lpTag.sdes.push(
        			{
				        "type": "searchInfo",
				        "keywords": rcOpenarray
		              }
        		);     
		}

		
		lenofromReload=false;
		
    	document.getElementById("leno-ChatiFrameContainer").style.display="block";
		setTimeout(function(){ 
		var windowleft=document.getElementById("lpChatWizContainer").style.left;	
			windowleft = windowleft.replace("px","");
			if( parseInt(windowleft) < 270){
				setLeftOffPositionValue = 270;
             			 document.getElementById("lpChatWizContainer").style.left = setLeftOffPositionValue + "px"
	 	       }
		document.getElementById("leno-ChatiFrameContainer").className="go-left";
		}, 1600);
	}	  
       if(msgData.isSliderDisabled=='true'){
		console.log("RC_offer_status:"+msgData.offerStatus);
		var rcClosearray=[];
		var ts1, ts2;

		if(msgData.type=="offer"){
			//lpSendData("session","RC_offer_status"+lenoofferCount,msgData.offerStatus);
			ts1 = 'RC_offer_status'+lenoofferCount+'|'+msgData.offerStatus;  
            rcClosearray.push(ts1); 
		}else{
			//lpSendData("session","Secure Widget Status"+lenosecCount,msgData.offerStatus);
			ts1 = 'Secure Widget Status'+lenoofferCount+'|'+msgData.offerStatus;
            rcClosearray.push(ts1); 
		}
		if(msgData.nameoncard!=""){			
		   //lpSendData("session","RC_offer_nameoncard"+lenoofferCount,msgData.nameoncard);
		    ts2 = 'RC_offer_nameoncard'+lenoofferCount+'|'+msgData.nameoncard;
            rcClosearray.push(ts2);
		}
		lpTag.sdes = lpTag.sdes||[];
              lpTag.sdes.push(
	        {
       		 "type": "searchInfo",
		        "keywords": rcClosearray
         	 }
        	);
		document.getElementById("leno-ChatiFrameContainer").className="go-right";
		setTimeout(function(){ 
		   if(document.getElementById("leno-ChatiFrameContainer")!=null)	
				document.getElementById("leno-ChatiFrameContainer").style.display="none";
		}, 1600);
		sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "REMOVELENOSESSION"});
		if(typeof msgData.ccpcancelled!="undefined" && msgData.ccpcancelled=="true"){
		 sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "DISPLAYCCPMSG"});
		}
	}
	if(msgData.LNCMSTATE=='true'){
		refreshAddLine();
		sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "EXTENDSESSION","value":msgData.value}); 
		console.log('received from LENO widget:'+msgData.value);
	}
	if(msgData.LNSTATUS=='true'){
		if(msgData.type=="offer"){
			//lpSendData("session","RC_offer_status"+lenoofferCount,msgData.offerStatus);
		}else{
			//lpSendData("session","Secure Widget Status"+lenosecCount,msgData.offerStatus);
             }
		if(msgData.nameoncard!=""){
		    //lpSendData("session","RC_offer_nameoncard"+lenoofferCount,msgData.nameoncard);
              }   
		console.log('received from LENO widget:'+msgData.value);
	}
	if(msgData.openinterstitial=='true'){
		if(window.location.href.indexOf("accountprofile/us/view.do")!=-1){
			MycaAssist.interstitial.paperless.display(mycaAssistJSON.commonAppData);
		}else{
			setCookie('lp_ppl', "true", null, 10);
			window.location="https://e2qonline.americanexpress.com/myca/accountprofile/us/view.do?request_type=authreg_home&source=inav&sorted_index=0&inav=MYCA_DUAL_Profile";		
		}
	}
	
   if(msgData.lpEmbChatWiz == "LPNVPF"){
     logger.debug("receiveChatPostMessageParent::::", msgData.lpEmbChatWiz);
  if(msgData.CMD == "UIDESIGN"){
  logger.debug("in bootstrap receiveChatPostMessageParent cmd inside UIDESIGN::::",msgData.CMD);
   if(msgData.value == 'FROMRESTABLISH'){
	   console.log('bootstrap parent page:'+window.location.href);
	   if(window.location.href.indexOf("ssearch.jsp")>-1){
			IOA.globalRule.sendAddlineTrigger=true;
		}
		if (typeof timeoutWidget!= "undefined") {
			IOA.globalRule.sendAddlineTrigger=true;
		}	
		if(window.location.href.indexOf("travel")>-1 || window.location.href.indexOf("iseatz.com")>-1){
			IOA.globalRule.sendAddlineTrigger=true;
		}
	if(window.location.href.indexOf("e1qglobal2.americanexpress.com")>-1){
		window.IOA = {};
		IOA.globalRule = {sendAddlineTrigger: true}
	}
	var xcutforrestablish;
	var xcutvid;
	var xcutctype;
	
	if(typeof lpTag!=="undefined" && typeof lpTag.taglets!=="undefined"){
		 xcutvid =  lpTag.taglets.lp_monitoringSDK.getVid();
	  }
	  if(typeof lpTag!=="undefined" && typeof lpTag.sdes!=="undefined"&& typeof lpTag.sdes.get("ctmrinfo")!=="undefined"){
		  xcutctype = lpTag.sdes.get("ctmrinfo")[0].info.ctype;
	  }
	if(mycaAssistJSON.commonAppData !=null && mycaAssistJSON.commonAppData!=""){
		xcutforrestablish = mycaAssistJSON.commonAppData;
	}else{
	    if(loyaltyAssistJSON.commonAppData !=null && loyaltyAssistJSON.commonAppData!=""){
		xcutforrestablish = loyaltyAssistJSON.commonAppData;
	    }	
       }
	if(document.getElementById("oceLayer")!=null)
		firsttimelogin ="true";
	if(typeof lpTag != "undefined" && typeof lpTag.exp_value != "undefined" && lpTag.exp_value!="")
			expansionFlag = lpTag.exp_value;
       sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "TORESTABLISH", "value" : window.location.href,"sendAddlineTrigger":IOA.globalRule.sendAddlineTrigger,"xcutobj":xcutforrestablish,"lpexpansion":expansionFlag,"sidvid":xcutvid,"cType":xcutctype,"firsttimelogin":firsttimelogin});  
  }
  if(msgData.value == 'FORXCUTRELOAD'){
	   var xcutforrestablish;
	   var xcutvid;
		var xcutctype;
	if(document.getElementById("oceLayer")!=null)
		firsttimelogin ="true";
	if(typeof lpTag!=="undefined" && typeof lpTag.taglets!=="undefined"){
		 xcutvid =  lpTag.taglets.lp_monitoringSDK.getVid();
	  }
	  if(typeof lpTag!=="undefined" && typeof lpTag.sdes!=="undefined"&& typeof lpTag.sdes.get("ctmrinfo")!=="undefined"){
		  xcutctype = lpTag.sdes.get("ctmrinfo")[0].info.ctype;
	  }
	   if(mycaAssistJSON.commonAppData !=null && mycaAssistJSON.commonAppData!=""){
		xcutforrestablish = mycaAssistJSON.commonAppData;
	  }else{
	    if(loyaltyAssistJSON.commonAppData !=null && loyaltyAssistJSON.commonAppData!=""){
		xcutforrestablish = loyaltyAssistJSON.commonAppData;
	    }	
       }
	  sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "TOXCUTRELOAD","xcutobj":xcutforrestablish,"sidvid":xcutvid,"cType":xcutctype,"firsttimelogin":firsttimelogin });
   }
   if(msgData.value == 'HIDECLOSEBTN'){
    logger.debug("in bootstrap receiveChatPostMessageParent cmd inside HIDECLSOE::::",msgData.value);
   //lpRemoveCloseIcon();
  }
 if(msgData.value == 'SHOWCLOSEBTN'){
  logger.debug("in bootstrap receiveChatPostMessageParent cmd inside SHOWCLSOE::::",msgData.value);
  //lpShowCloseIcon();
 }
 if(msgData.value == 'TABONCLOSEBTN'){
  logger.debug("in bootstrap receiveChatPostMessageParent cmd inside TABONCLOSEBTN::::",msgData.value);
  document.getElementById("lpChatMinizeBtn").focus();
  if(document.activeElement.id === "lpChatMinizeBtn"){
	document.getElementById("lpChatMinizeBtn").style.outline = "2px solid #265AB1";
  }else{
	document.getElementById("lpChatMinizeBtn").style.outline = "none";  
  }
}
if(msgData.value == 'ADDLINES'){
	refreshAddLine();
}
if(msgData.value == 'CCPUNAVAILABLE'){
	lpSendData("session","EWError","ccpunavailable"+msgData.ckValue);
	console.log("sent ccpunavailable message to LP ");
	lpSendData("session","EWError",msgData.chatObj);
	console.log("sent ccpunavailable chat object to LP ");
	lpSendData("session","EWError",msgData.context);
}
if(msgData.value == 'CANTCONNECT'){
	lpSendData("session","EWError","cantconnect"+msgData.ckValue);
	console.log("sent cantconnect message to LP ");
	lpSendData("session","EWError",msgData.chatObj);
	console.log("sent cantconnect chat object to LP ");
	lpSendData("session","EWError",msgData.context);
}

if(msgData.value == 'SURVEY'){
	lpSendData("session","EWError","Survey"+msgData.ckValue);
	console.log("sent cantconnect message to LP ");
}
if(msgData.value == 'TIMESTAMP'){
	lpSendData("session","EWInfo","Timestamp "+msgData.ckValue);
	console.log("sent cantconnect message to LP ");
}

}
  
    if(msgData.CMD == "FLASHING"){
     logger.debug("receiveChatPostMessageParent::::", msgData.CMD);
     if(msgData.value == 'START'){
      logger.debug("receiveChatPostMessageParent::::", msgData.value);
      flashingStart();
     }/*else{
      logger.debug("Flashing Stop::::", msgData.value);
      flashingStop();
      logger.debug("Flashing Stop::::", "stop");
     }*/
    }else if(msgData.CMD == "REFRESH"){
		console.log("parent page refresh"+msgData.value);
		window.parent.location.href=msgData.value;
     }else if(msgData.CMD == "CONTROL"){
	 if(msgData.value == 'SETLPPARAMS3'){
		 setlpchatActiveCookie1('lpupdate',msgData.lpupdate);
	 }else if(msgData.value == 'SHOW_CONTAINER'){
	 /* if(msgData.chatwindowstatus=="true"){
           var windowStatusarray=[]; 
	    var ws1 = 'chatWindowOpen|true';
	    windowStatusarray.push(ws1);

	    lpTag.sdes = lpTag.sdes||[];
	    lpTag.sdes.push(
          {
			"type": "searchInfo",
			"keywords": windowStatusarray
	   } 
         );
	 }*/
	 
      showChatWizContainerVisibility(true);
	   undockButtonHandler();
   //lpShowCloseIcon();
     }else if(msgData.value == 'END_CHAT'){
	  chatlastrefreshtime = 0;	 
      endChat();
	/*  var windowStatusarray=[]; 
       var ws1 = 'chatWindowOpen|false';
        windowStatusarray.push(ws1);

       lpTag.sdes = lpTag.sdes||[];
       lpTag.sdes.push(
           {
		"type": "searchInfo",
		"keywords": windowStatusarray
	   }
        ); */
	//  lpSendData("session","chatWindowOpen","false");
       document.getElementById("leno-ChatiFrameContainer").remove();
     }else if(msgData.value == 'HIDE_CONTAINER'){
      showChatWizContainerVisibility(false);
     }else if(msgData.value == 'CHAT_STATE_ACTIVE'){
      isChatActive = true;      
     }else if(msgData.value == 'CHAT_STATE_INACTIVE'){
      isChatActive = false;     
	  deletelpchatActiveCookie();	
     }else if(msgData.value == 'UPDATE_DRAG_AREA_SHOW_PCI'){
      adjustWindowSizeForPCI();
      isPciVisible = true;
     }else if(msgData.value == 'UPDATE_DRAG_AREA_HIDE_PCI'){
      adjustWindowSizeNonePCI();
      isPciVisible = false;
   // logger.debug("in bootstrap receiveChatPostMessageParent cmd inside UPDATE_DRAG_AREA_HIDE_PCI::::",msgData.value);
   //lpShowCloseIcon();
     }else if(msgData.value == 'SET_PRECHATACTIVECOOKIE'){
		setlpchatActiveCookie();
     }else if(msgData.value == 'SET_ACTIVECOOKIE'){
		setlpchatActiveCookie();
		if(msgData.MSGTIMER){
			refreshTillTimeout();
			var reloadstr;
			if(msgData.LNVALUE==undefined){
				reloadstr = "&reload=false";			
			}else{
				reloadstr = "&reload=true";
				lenofromReload=true;
			}
			if(window.location.href.indexOf("lpsidvar")!=-1){
				if(window.lpMTagConfig!=undefined && window.lpMTagConfig.LPSID_VAR!= undefined && window.lpMTagConfig.LPSID_VAR!=""){
					console.log("LENO SHOW AND TELL window.lpMTagConfig.LPSID_VAR:"+window.lpMTagConfig.LPSID_VAR);
					lnChatBuildFrame(window.lpMTagConfig.LPSID_VAR,reloadstr);
				}
			}else{			
				/*if(window.lpSID!=undefined && window.lpSID!=""){
					console.log("LENO SHOW AND TELL window.lpSID:"+window.lpSID);	
					lnChatBuildFrame(window.lpSID,reloadstr);
				}else{
					console.log("LENO SHOW AND TELL msgData.LPSUID:"+msgData.LPSUID);
					lnChatBuildFrame(msgData.LPSUID,reloadstr);
				}*/
				if(lenosToken==""){
					lenosToken = getCookie_AA('lpToken');
				}
				var sendMessage=false;
				if(lenosToken!=""){
					//lenosToken=lenosToken.substring(0, 45);
					console.log("LENO SHOW AND TELL STOKEN(80 chars):"+lenosToken);	
					if(document.getElementById("leno-ChatiFrameContainer")==null){
						lnChatBuildFrame(lenosToken,reloadstr);	
						sendMessage=true;
				    }		
					setlpchatActiveCookie1("lpToken",lenosToken);
				}
			}
			lenoofferCount=msgData.LNOFFERCNT;
			lenosecCount=msgData.LNSECCNT;
			if(lenoofferCount!=0){
				if(lenosToken==lenoofferCount.split("_")[0]){
					lenoofferCount=parseInt(lenoofferCount.split("_")[1]);
				}else{
					sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "REMOVELENOOFFERCOUNT","value":""}); 
					lenoofferCount=0;
				}	
			}
			
			if(lenosecCount!=0){
				if(lenosToken==lenosecCount.split("_")[0]){
					lenosecCount=parseInt(lenosecCount.split("_")[1]);
				}else{
					sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "REMOVELENOSECCOUNT","value":""}); 
					lenosecCount=0;
				}	
			}
			
			suid=msgData.LPSUID;
			if(msgData.LNVALUE!=undefined){
				setTimeout(function(){
				if(sendMessage){	
				sendPostMessageToRCWidget({"LNCSFRMBOOTSTRAP": msgData.LNVALUE});
				sendMessage=false;
				}
				}, 3000);				
			}
		}
     }else if(msgData.value == 'SET_MARVINACTIVECOOKIE'){
		setmarvinchatActiveCookie();
		if(msgData.MSGTIMER){
			refreshTillTimeout();	
			var reloadstr;
			if(msgData.LNVALUE==undefined){
				reloadstr = "&reload=false";			
			}else{
				reloadstr = "&reload=true";
				lenofromReload=true;
			}	
			/*if(window.lpSID!=undefined && window.lpSID!=""){	
				lnChatBuildFrame(window.lpSID,reloadstr);
				//lnChatBuildFrame(msgData.LPSUID,reloadstr);
			}else{
				lnChatBuildFrame(msgData.LPSUID,reloadstr);
			}*/
			if(lenosToken==""){
					lenosToken = getCookie_AA('lpToken');
				}
				var sendMessage=false;
				if(lenosToken!=""){
					//lenosToken=lenosToken.substring(0, 45);
					console.log("LENO SHOW AND TELL STOKEN(80 chars):"+lenosToken);	
					if(document.getElementById("leno-ChatiFrameContainer")==null){
						lnChatBuildFrame(lenosToken,reloadstr);		
						sendMessage=true;			
					}	
					setlpchatActiveCookie1("lpToken",lenosToken);
				}
			
			lenoofferCount=msgData.LNOFFERCNT;
			lenosecCount=msgData.LNSECCNT;
			if(lenoofferCount!=0){
				if(lenosToken==lenoofferCount.split("_")[0]){
					lenoofferCount=parseInt(lenoofferCount.split("_")[1]);
				}else{
					sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "REMOVELENOOFFERCOUNT","value":""}); 
					lenoofferCount=0;
				}	
			}
			
			if(lenosecCount!=0){
				if(lenosToken==lenosecCount.split("_")[0]){
					lenosecCount=parseInt(lenosecCount.split("_")[1]);
				}else{
					sendPostMessage({"lpEmbChatWiz": "LPNVCF", "CMD" : "REMOVELENOSECCOUNT","value":""}); 
					lenosecCount=0;
				}	
			}
			
			if(msgData.LNVALUE!=undefined){
				setTimeout(function(){
				if(sendMessage){	
					sendPostMessageToRCWidget({"LNCSFRMBOOTSTRAP": msgData.LNVALUE});
					sendMessage=false;
				}
				}, 3000);				
			}
		}
     }else if(msgData.value == 'SETLPPARAMS1'){
		 setlpchatActiveCookie1('lpdata',msgData.cValue);
	 }else if(msgData.value == 'SETLPPARAMS2'){
		 setlpchatActiveCookie1('vid',msgData.vID);
	 }else if(msgData.value == 'LPCDATA'){
		
 	
		 deletelpchatActiveCookie1('lpchat_active');
		deletelpchatActiveCookie1('marvinchat_active');
		 deletelpchatActiveCookie1('lpdata');
		 deletelpchatActiveCookie1('vid');
		 deletelpchatActiveCookie1('lpcoredata');
		  deletelpchatActiveCookie1('setatbbv');
		   deletelpchatActiveCookie1('setatesc');
		    deletelpchatActiveCookie1('setatcnvsid');
			 deletelpchatActiveCookie1('lpToken');
			deletelpchatActiveCookie1('jwtVal');
			
		 if(timeoutInterval!=null){
				clearInterval(timeoutInterval); 
				timeoutInterval=null;
		 }
		 if(sessionIntervalID!=null){
			clearInterval(sessionIntervalID);
			sessionIntervalID=null;
		 }
		 chatlasttimeout=true;
		sendPostMessageToRCWidget({"lpEmbChatWiz": "LPNVCF", "CMD" : "LENO_CLOSEWIDGET"});	
		/*$("#leno-ChatiFrameContainer").animate({left: 11}, 1500,function(){
			$("#leno-ChatiFrameContainer").css("display","none");			
		});*/
		document.getElementById("leno-ChatiFrameContainer").className="go-right";
		setTimeout(function(){ 
		  if(document.getElementById("leno-ChatiFrameContainer")!=null)
			document.getElementById("leno-ChatiFrameContainer").style.display="none";
		}, 1600);

	 }else if(msgData.value == 'SET_LPCOOKIE'){
		 setlpchatActiveCookie1('lpcoredata',msgData.ckValue);
	 }else if(msgData.value == 'SET_ATBBV'){
		 setlpchatActiveCookie1('setatbbv',msgData.cValue);
	 }else if(msgData.value == 'SET_ATCHTESC'){
		 setlpchatActiveCookie1('setatesc',msgData.ckValue);
	 }else if(msgData.value == 'SET_ATCNVSID'){
		 setlpchatActiveCookie1('setatcnvsid',msgData.ckValue);
	 }else if(msgData.value == 'IN_PRECHAT_SCREEN'){
		 lpSendData("session","chatWindowOpen","true");
	 }else if(msgData.value == 'SET_JWTCOOKIE'){
		 setlpchatActiveCookie1('jwtVal',msgData.ckValue);
	 }else if(msgData.value == 'LE_END_CHAT'){
          /*var questionSet1 = "es_myca_q1|Overall, how would you rate the service you received during this contact with American Express? |"+msgData.ans1;
        var questionSet2 = "es_myca_q2|Was the agent able to help you complete your transaction or address your inquiry?|"+msgData.ans2;*/
		var keywordsarray=[];
		var sObj= msgData.ans1;
	for(var i=0;i<sObj.length;i++){var ts = 'es_myca_q'+(i+1)+'|'+sObj[i].question+'|'+sObj[i].answer;keywordsarray.push(ts);} 

		
        lpTag.sdes = lpTag.sdes||[];
        lpTag.sdes.push(
        {
        "type": "searchInfo",
        "keywords": keywordsarray
         }
        );
		lpTag.sdes.send(); 
		lpTag.sdes.send({
			"type": "mrktInfo",
			"info": {
				"campaignId": "Survey SDEs Sent"
			}
		});
	  chatlastrefreshtime = 0;
	  var surveyDetails = {};
	  surveyDetails ["surveyType"] = msgData.surveyType;
	  surveyDetails ["StartDate"] = msgData.startEscalationTime;
	  var de = new Date(); 
	 var endChatTime=de.getTime();
	 surveyDetails ["EndDate"] = endChatTime;
	 surveyDetails ["GENID"] = JSON.parse(mycaAssistJSON.commonAppData).bbPublic;
	  var sObj1= msgData.qualtrics;
	  for(var i=0;i<sObj1.length;i++){		
        surveyDetails ["q"+(i+1)] = sObj1[i].answer;		
		} 
		surveyDetails ["agentName"] = msgData.agentName;
		surveyDetails ["agentEmpID"] = msgData.agentEmpID;
		surveyDetails ["convID"] = msgData.convID;
		surveyDetails ["cardtype"] =JSON.parse(mycaAssistJSON.commonAppData).cardsInfoList[0].cardDesc;
		if(typeof lpTag.sdes.get("ctmrinfo")!="undefined" && typeof lpTag.sdes.get("ctmrinfo")[0] !="undefined" && typeof lpTag.sdes.get("ctmrinfo")[0].info !="undefined"){
			surveyDetails ["skill"] =lpTag.sdes.get("ctmrinfo")[0].info.ctype;
		}else{
			surveyDetails ["skill"] ="";
		}
		surveyDetails ["Product"] =JSON.parse(mycaAssistJSON.commonAppData).cardsInfoList[0].cardType;	
		
		/*console.log("survey details:"+surveyDetails);
		
		$.ajax({
			  url: "https://clicktochat.americanexpress.com/chat/sendsurvey",
			  type: "POST",
						contentType: "application/json",
						crossDomain: true,
						data: JSON.stringify(surveyDetails)
			}).done(function(data){
				logger.debug(data); 
			});
		*/
	/*  var windowStatusarray=[]; 
       var ws1 = 'chatWindowOpen|false';
        windowStatusarray.push(ws1);

       lpTag.sdes = lpTag.sdes||[];
       lpTag.sdes.push(
           {
		"type": "searchInfo",
		"keywords": windowStatusarray
	   }
        );	*/
         endChat();	
       document.getElementById("leno-ChatiFrameContainer").remove();
     }
    }
   }
  }catch (excp) { 
   logger.debug("lpReceiveChatPostMessage. Exception occurred", excp);
  }
  
  return;
 }
 
 // mouse hover tool-tip div
 function showMouseOverToolTip(elementId) {
  logger.debug("showMouseOverToolTip", "id ="+elementId);
  
  removeMouseOverToolTip();
  var buttonObj = getElement(elementId);
  var toolTipTopSpaceRequired = buttonObj.offsetHeight - 12;
  var chatWizContainerOffset = getOffset(chatWizContainer);
  
  logger.debug("showMouseOverToolTip", "container top ="+ getOffset(chatWizContainer).top + " , button height="+toolTipTopSpaceRequired);
  var tooltipDiv;
  if(chatWizContainerOffset.top >= toolTipTopSpaceRequired){
   tooltipDiv = makeHoverDiv(buttonObj.getAttribute("data-msg"), false);
  }else{
   tooltipDiv = makeHoverDiv(buttonObj.getAttribute("data-msg"), true);
  }
  chatWizContainer.appendChild(tooltipDiv);
  
  var tooltipDiv = getElement("lpToolTipContent");
  if(elementId=="lpChatPopOutBtn"){
   tooltipDiv.style.right = "22px";
  }else if(elementId=="lpChatMinizeBtn"){
   tooltipDiv.style.right = "2px";
  }else if(elementId=="lpChatEndChatBtn"){
   tooltipDiv.style.right = "-19px";
  }else if(elementId=="lpChatMaximizeBtn"){
	  if(chatWizContainer.className.indexOf("lp_US") > -1){
   if(chatWizContainer.className == "lp_US lpDraggable"){
   		tooltipDiv.style.right = "-20px"; //-20px
		if(getCookie_AA1('lpPopulation') == "AUTOMATION"){
			tooltipDiv.style.right = "-9px"; 
		}
   		tooltipDiv.style.top = "-22px";
  	}else{
		tooltipDiv.style.right = "2px";//12px
		if(getCookie_AA1('lpPopulation') == "AUTOMATION"){
			tooltipDiv.style.right = "12px"; 
		}
   		tooltipDiv.style.top = "-22px";  		
  	}
	  }
	  if(chatWizContainer.className.indexOf("lp_ca_en") > -1){
	if(chatWizContainer.className == "lp_ca_en lpDraggable"){
   		tooltipDiv.style.right = "-5px";
   		tooltipDiv.style.top = "-22px";
  	}else{
		tooltipDiv.style.right = "14px";
   		tooltipDiv.style.top = "-22px";  		
  	}
	  }
  }else if(elementId=="lpChatEndChatBtnMin"){
	  if(chatWizContainer.className.indexOf("lp_US") > -1){
   if(chatWizContainer.className == "lp_US lpDraggable"){
	    tooltipDiv.style.right = "-40px";//-40px
		if(getCookie_AA1('lpPopulation') == "AUTOMATION"){
			tooltipDiv.style.right = "-30px"; 
		}
   		tooltipDiv.style.top = "-22px";
  	}else{
		tooltipDiv.style.right = "-19px";
		if(getCookie_AA1('lpPopulation') == "AUTOMATION"){
			tooltipDiv.style.right = "-8px"; 
		}
   		tooltipDiv.style.top = "-22px";
  	}
	  }
	  if(chatWizContainer.className.indexOf("lp_ca_en") > -1){
	if(chatWizContainer.className == "lp_ca_en lpDraggable"){
	    tooltipDiv.style.right = "-26px";
   		tooltipDiv.style.top = "-22px";
  	}else{
		tooltipDiv.style.right = "-10px";
   		tooltipDiv.style.top = "-22px";
  	}
	  }
  }  
  
 }
 
 function dockButtonHandler(){
  logger.debug("dockButtonHandler", "");
  
  //isDock = true;
  
  //var chatIconPopOutImg = getElement("lpChatPopOutBtnImg");
  //var newClasses = deleteAppendStyleClass(chatIconPopOutImg, "lpCustChatIconPopIn", "lpCustChatIconPopOut");
  //chatIconPopOutImg.className = newClasses;
  
  //var chatIconPopOut = getElement("lpChatPopOutBtn");
  //chatIconPopOut.setAttribute("data-msg", lpCWTagConst.lpChatTitleUndock);
  
  chatWizContainer.style.bottom = "0px";
  chatWizContainer.style.right = "0px";
  chatWizContainer.style.left = "auto";
  chatWizContainer.style.top = "auto";
  
  if(typeof dragManager != "undefined"){
   dragManager.unbind( draManagerSession );
  }
 }
 
 function undockButtonHandler(){
  logger.debug("undockButtonHandler", "222");
  isDock = false;
  
  //var chatIconPopOutImg = getElement("lpChatPopOutBtnImg");
  //var newClasses = deleteAppendStyleClass(chatIconPopOutImg, "lpCustChatIconPopOut", "lpCustChatIconPopIn");
  //chatIconPopOutImg.className = newClasses;
  
  //var chatIconPopOut = getElement("lpChatPopOutBtn");
  //chatIconPopOut.setAttribute("data-msg", lpCWTagConst.lpChatTitleDock);   
  
  dragManager = lpTag.taglets.lpDragManager();
  var titleDragArea = getElement( 'lpChatTitleContainer' );
  var dmParam = {
      drag: chatWizContainer,   //The element to drag
      anchor: titleDragArea,   //The drag anchor chatiFrameContainer, chatWizContainer
      horizontal: true,      //Allow horizontal drag
      vertical: true,       //Allow vertical drag
      onDrag: function (data) {  //Callback when starting
	     document.getElementById("lpChatWizContainer").className = "lp_"+Bootstrapper.ensMarket+" lpDraggable";
         logger.debug("Drag Start",  "...");
       },
      onDragEnd: function (data) {//callback when ended
        logger.debug("Drag Complete",  data);
		setTopOffPositionValue = data.top; 
		 setLeftOffPositionValue = data.left; 
		if(document.getElementById("leno-ChatiFrameContainer").style.display == "block"){
		 if(data.left < 270){
			setLeftOffPositionValue = 270;
            document.getElementById("lpChatWizContainer").style.left = setLeftOffPositionValue + "px"
        }
	    else
	       setLeftOffPositionValue = data.left; 
       }
       }
   };
  draManagerSession = dragManager.bind(dmParam); 
    
 }
 function dockUnDockButtonClick(e){
  logger.debug("dockUnDockButtonClick", "...");
  
  /*if(isDock){
   undockButtonHandler();
  }else{
   dockButtonHandler();
  }*/
  undockButtonHandler();
  
 }
 
 //function to show grab pointer
  function showGrabPointer(){
var lpChatTitleDragAreaID = document.getElementById("lpChatTitleDragArea");
lpChatTitleDragAreaID.className = "lpLeft grab";
 }
 
 //function to hide grab pointer
 function hideGrabPointer(){
var lpChatTitleDragAreaID = document.getElementById("lpChatTitleDragArea");
lpChatTitleDragAreaID.className = "lpLeft";
 }


 myUI.bindEvents = function() {
  logger.debug("bindEvents", "...");
  
  /*if(lpCWTagConst.enableDockUnDock){
   //bindEvent(getElement("lpChatPopOutBtn"), "click", dockUnDockButtonClick);
   bindEvent(getElement("lpChatPopOutBtn"), "mouseover", function(){ showMouseOverToolTip("lpChatPopOutBtn") } );
   bindEvent(getElement("lpChatPopOutBtn"), "mouseout", removeMouseOverToolTip);
  }*/
  //bindEvent(getElement("lpChatTitleContainer"), "click", dockUnDockButtonClick);
  bindEvent(getElement("lpChatMinizeBtn"), "click", showMinimizeHandler);
  bindEvent(getElement("lpChatMinizeBtn"), "keydown", function(){showMinimizeHandlerforEnterKey(event);}); 
  bindEvent(getElement("lpChatMaximizeBtn"), "keydown", function(){showMaximizeHandlerforEnterKey(event);});
  bindEvent(getElement("lpChatTitleDragAreaMin"), "click", showMaximizeHandler);
  bindEvent(getElement("lpChatEndChatBtn"), "click", closeButtonClicked); 
  bindEvent(getElement("lpChatEndChatBtn"), "keydown", function(){closeButtonClickedforEnterkey(event);}); 
  bindEvent(getElement("lpChatEndChatBtnMin"), "click", closeButtonClickedForMin); 
  bindEvent(getElement("lpChatEndChatBtnMin"), "keydown", function(){closeButtonClickedForMinforEnterkey(event);});
  
  bindEvent(getElement("lpChatMinizeBtn"), "mouseover", function(){ showMouseOverToolTip("lpChatMinizeBtn") } );
  bindEvent(getElement("lpChatMaximizeBtn"), "mouseover", function(){ showMouseOverToolTip("lpChatMaximizeBtn") } );
  bindEvent(getElement("lpChatEndChatBtn"), "mouseover", function(){ showMouseOverToolTip("lpChatEndChatBtn") }); 
  bindEvent(getElement("lpChatEndChatBtnMin"), "mouseover", function(){ showMouseOverToolTip("lpChatEndChatBtnMin") }); 
  
  bindEvent(getElement("lpChatMinizeBtn"), "mouseout", removeMouseOverToolTip);
  bindEvent(getElement("lpChatMaximizeBtn"), "mouseout", removeMouseOverToolTip);
  bindEvent(getElement("lpChatEndChatBtn"), "mouseout", removeMouseOverToolTip); 
  bindEvent(getElement("lpChatEndChatBtnMin"), "mouseout", removeMouseOverToolTip);

  bindEvent(getElement("lpChatTitleDragArea"), "mousedown", showGrabPointer);
  bindEvent(getElement("lpChatTitleDragArea"), "mouseup", hideGrabPointer);
  bindEvent(getElement("lpChatTitleDragArea"), "mouseleave", hideGrabPointer);
  
  bindEvent(window, "resize", onWinResizeEvent); 
  logger.debug("bindEvents", "complete");      
 }
 
 myUI.isChatWinLoaded = function() {
  return chatWinLoaded;
 }
 
 myUI.webServicesEnable = function(){
  lpPCIGenIDEnable = true;
 }
 
 myUI.webServicesDisable = function(){
  lpPCIGenIDEnable = false;
 }
 
 myUI.embeddedChatVersion = function(){
  return lpCWTagConst.VERSION;
 }
 /*US669762*/
 myUI.isSessionStorageSupported = function(){
		var sessionStorageFound = false;
		try{
			if(typeof sessionStorage != "undefined" && sessionStorage != null){
				sessionStorageFound = true;
			}
		} catch(excpt){}
			
		logger.debug("sessionStorage " + (sessionStorageFound?"is": "is NOT"), "available");
		return sessionStorageFound;
	}

	myUI.isJSONSupported = function(){
		var jsonFound = false;
		try{
			if (JSON && typeof JSON.parse === 'function') {
				jsonFound = true;
			}else if (typeof JSON === 'object' && typeof JSON.parse === 'function') {
				jsonFound = true;
			}
		} catch(excpt){}
			
		logger.debug("JSON " + (jsonFound?"is": "is NOT"), "available");
		return jsonFound;
	}
	
	myUI.isPostMessageSupported = function(){
		var postMsgFound = false;
		try{
			if (typeof window.postMessage === 'function') {
				postMsgFound = true;
			}else if (typeof window.postMessage != 'undefined') {
				postMsgFound = true;
			}
		} catch(excpt){}
			
		logger.debug("PostMessage " + (postMsgFound?"is": "is NOT"), "available");
		return postMsgFound;
	}
	
	myUI.isBrowserCompatible = function(){
		var incompatibilityRC = "";
		if(!myUI.isJSONSupported()){incompatibilityRC="JSONNotSupported_";}
		if(!myUI.isPostMessageSupported()){incompatibilityRC=incompatibilityRC+"PostMessageNotSupported_";}
		if(!myUI.isSessionStorageSupported()){incompatibilityRC=incompatibilityRC+"SessionStorageNotSupported";}
		if(incompatibilityRC!=""){
			lpSendData("session","EWINFO",incompatibilityRC);
		}
		return myUI.isJSONSupported() && myUI.isPostMessageSupported() && myUI.isSessionStorageSupported() ? true: false;
	} 
 /*US669762*/
 
}
lpChatWidgetUI = new lpCWTagUI.LPChatWidgetUI(window);
/*** BELOW METHODs AVAILABLE MAIN WINDOW ***/
/**
 * invoke this method if you want to end chat. This is particular useful when a user clicks to log out and 
 * you code needs to call this method to end the chat as well.
 */
function lpEndChat(){
 delCookie("lp_flg");
 lpChatWidgetUI.endChatRequest();
}
/**
 * invoke this method to start embedded chat. This is required to call this method when users click on 'chat now' button
 */
//added for drag and drop
function loadDragJSForInlineChat(){
 try {
  if(wasDragJSLoaded()){
   return;
  }
  var url = getHomePageServerURL() + "api/axpi/ioa/chatdemo/js/drag.min.js";
  var oHead = document.getElementsByTagName('head').item(0);
  var oScript = document.createElement("script");
  oScript.type = "text/javascript";
  oScript.async = true;
  oScript.src = url;
  oHead.appendChild(oScript);
 } catch (e) {
 }
}
function wasDragJSLoaded() {
 var x = document.getElementsByTagName("script");
 for ( var i = 0; i < x.length; i++) {
  if (x[i].src.indexOf("chatdemo/js/drag.min.js") > -1) {
   return true;
  }
 }
 return false;
}
function setAACookieForInlineChat(){
 try {
  setCookie('lp_flg', "true", null, 45);
 } catch (e) {
  console.log("Error in setAACookieForInlineChat:: " + e.message);
 }
}

function setlpchatActiveCookie(){
 try {
  setCookie('lpchat_active', "true", null, 45);
 } catch (e) {
  console.log("Error in setlpchatActiveCookie:: " + e.message);
 }
}
function setmarvinchatActiveCookie(){
 try {
  setCookie('marvinchat_active', "true", null, 45);
 } catch (e) {
  console.log("Error in setlpchatActiveCookie:: " + e.message);
 }
}
function setlpchatActiveCookie1(cName,cValue){
 try {
  setCookie(cName, cValue, null, 45);
 } catch (e) {
  console.log("Error in setlpchatActiveCookie:: " + e.message);
 }
}

function deletelpchatActiveCookie(){
 try {
  delCookie('lpchat_active');
 } catch (e) {
  console.log("Error in deletelpchatActiveCookie:: " + e.message);
 }
}

function deletelpchatActiveCookie1(cname){
 try {
  delCookie(cname);
 } catch (e) {
  console.log("Error in deletelpchatActiveCookie:: " + e.message);
 }
}

function getCookie_AA1(cname){
	var cvalue='';
	if(typeof lpTestPopulation != "undefined" && lpTestPopulation!="")
		cvalue=lpTestPopulation.toUpperCase();
	else
		cvalue=getCookie_AA('lpPopulation');
	return cvalue;
}

function refreshAddLine(){
	console.log("in refreshAddLine");
	if(!isTimerStopped){
		var travelele = document.getElementById("rhContainer");
		if (typeof chatSessionCallback != "undefined") {
			chatSessionCallback(true);
		}else if(window.location.href.indexOf("ssearch.jsp")>-1){
			var d = new Date();
			chatcurrentTime = d.getTime();
		}else if(typeof travelele !== 'undefined' && travelele !== null){
				angular.element(document.getElementById("rhContainer")).scope().$parent.userSessionTimeout();
		}else if (typeof timeoutWidget!= "undefined") {
			var d = new Date();
			chatcurrentTimetmp = d.getTime();
			if(chatcurrentTimetmp - chatlastrefreshtime >120000){
				timeoutWidget.refreshSession();
				chatlastrefreshtime = chatcurrentTimetmp; 
			}
		}else{ //added else condition for SPA
		    console.log("in keepSessionAlive");
			var d = new Date();
			chatcurrentTimetmp = d.getTime();
			if(chatcurrentTimetmp - chatlastrefreshtime >120000){
				lpChatWidgetUI.keepSessionAlive();
				chatlastrefreshtime = chatcurrentTimetmp; 
			}
			
		}
	}
}

/**
 * invoke when bootstrap.js is included and once the page is loaded
 */
function lpChatOnPageLoad() {
 try{
 loadDragJSForInlineChat();
 lpChatWidgetUI.chatOnPageLoad(); 
 }catch(e){
  console.log("Error in lpChatOnPageLoad:: " + e.message);
 }
}
function lpLoadChat(data) {
//var d = new Date();
//starttimeLP = d.getTime();
// the code added for chat error window displayed when conversation is not closed
// by CM properly - Begin
if ( typeof data != 'undefined' && data != null ){
    if ( data.eventName == null || typeof data.eventName == 'undefined' ){
       loadDragJSForInlineChat();
       setAACookieForInlineChat();
       lpChatWidgetUI.loadChat(data);
       // isTimerStopped=false;
       chatlasttimeout=false;
    }
    else if (typeof data.eventName != 'undefined' && data.eventName != null && data.eventName == 'SHOW'){
       loadDragJSForInlineChat();
       setAACookieForInlineChat();
       lpChatWidgetUI.loadChat(data);
       // isTimerStopped=false;
       chatlasttimeout=false;
    }
 }
}
function lpChatWizInfo(){
 new lpCWTagUI.LPChatWidgetLogger().info("Initializing Chat Widget Bootstrap", "Version ["+lpCWTagConst.VERSION+"]");
}
/***Function to remove close icon***/
function lpRemoveCloseIcon(){
//logger.debug("lpRemoveCloseIcon", "lpRemoveCloseIcon.....");
 document.getElementById("lpChatEndChatBtn").style.display = "none";
}
/***Function to show close icon***/
function lpShowCloseIcon(){
//logger.debug("lpShowCloseIcon", "lpShowCloseIcon.....");
 document.getElementById("lpChatEndChatBtn").style.display = "inline-block";
}
//show info to console that Embedded Chat Window is included.
lpChatWizInfo();

var isPremExp =false;
 var travelele = document.getElementById("rhContainer");	
  if(typeof travelele !== 'undefined' && travelele !== null){
	 var angElement = angular.element(travelele);
 if(angElement){ 
 var travelPlatTimer = setInterval(function(){ 
		var angscope= angElement.scope();
  if(typeof(angscope)!="undefined"){
   isPremExp = angscope.isPremiumExperience;
   
 if(isPremExp==true){
	 var travelclassname = document.body.className;
	 document.body.className = travelclassname+" lpTravelplat";
 }else{    
	angscope.$watch('isPremiumExperience', function(newValue, oldValue) {  
    isPremExp = angscope.isPremiumExperience; 	
    if(isPremExp==true){
	   var travelclassname = document.body.className;
	   document.body.className = travelclassname+" lpTravelplat";
    }
  }); 
 } 
 clearInterval(travelPlatTimer);
 }

 }, 500);
 
  
 } 
}

if(document.cookie.indexOf("lp_ppl")>-1){
	if(window.location.href.indexOf("accountprofile/us/view.do")!=-1){
		deletelpchatActiveCookie1('lp_ppl');
		MycaAssist.interstitial.paperless.display(mycaAssistJSON.commonAppData);
	}
}
 
/*$("#startchart").on("click",function(e){
	lpLoadChat();
});*/

 var jwtTimer1 = setInterval(function(){
 if((typeof mycaAssistJSON!="undefined" && mycaAssistJSON.commonAppData!="")|| (typeof loyaltyAssistJSON!="undefined" && loyaltyAssistJSON.commonAppData!="")){ 	 
 jwtValue="present";
clearInterval(jwtTimer1);
 }
}, 500);