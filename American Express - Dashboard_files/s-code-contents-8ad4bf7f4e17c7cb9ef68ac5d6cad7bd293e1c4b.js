/* set s.account dynamically */
var s = new AppMeasurement();
if (_satellite.getVar("RSID") != '' && _satellite.getVar("RSID") != "undefined") {
    s.account = _satellite.getVar("RSID");
 }
s_account = s.account;
/************************** CONFIG SECTION **************************/
// Check with app team on source entry points for OneAmex sites
s.linkInternalFilters = "javascript:,mailto:,tel:,americanexpress.,.americanexpress,americanexpress-,amex,american-express,aexp.com,membershiprewards.,experiandirect.com,brassring.com,aeprepaid.com,bonuspoint,openforum.com,davidjones,ibanking-services.com,aetclocator.com,res99.com,deltaskymilescard.com,isopenrightforyou.com,yourcarrentalclaim.com,goldcarddestinations.com,guidestar.org,open.com,takecharge.com,fx4you.com,plumcard.com,travelocity.com,carddefence.net,corporate-platinum.de,areyouacardmember.com,solicitalatarjeta.com,as00.estara.com,75.101.129.171,shopandmilesjourneys.com,iddefence,acceptpay.com,reservetravelprivileges.com,maxvantagemeetings.com,goldyearendsummary.com,axpbillpay.com,aceinsurance.com,leisure.travelpn.com,securweb.biz,ukbo.savvislive.com,ebm.cheetahmail.com,businesscreditsecure.com,flweb20.ypsilon.net,getcurrency.com,magroup-online.com,co-store.com,axbtportal.com,dailygood.com,mytrueearnings.com,searchmanager.com,xml4.eotis.com,insuranceedge.com,platinumcardtravel.at,morethanjustacard.fi,aexp.se,paycenter.com,nextpedition.com,ezrez.com,serve.com,admanager.com,paysimple.com,yourbuzz.com,openbusinesstravel.com,veri.com,theopenappcenter.com,servevirtual.net,bluebirdmoney.com,amextravel.com";
s.linkInternalFilters += "," + window.location.hostname;
s.trackExternalLinks = true
s.linkLeaveQueryString = false
var omn_temp = 1;
/*ChannelManagerList*/
s.cmQlist = "extlink,affid,eaid,psctn,psccsg,psopen,psboth,om_mid,et_cid,s_email,emaillink,campaignid,vanity,extlink,mrexc";
s.cmQGCTlist = "cpid,itu_id,pid,psku";
s.omn_getFromQueryParamVars = ['cpid', 'extlink', 'inav', 'intlink', 'linknav', 'omnlogin', 'dynamicsearch', 'searchresult']
s.omn_getValOnceVars = ['cpid', 'extlink', 'inav', 'intlink', 'linknav', 'omnlogin'];
s.omn_toLowerCase = ['intlink'];
if (typeof omn == "undefined") window.omn = new Object();


// doPlugins code
s.usePlugins = true;

function s_doPlugins() {
  //  console.log("do plugins start...");
  /* set s.account dynamically */
    if (_satellite.getVar("RSID") != '' && _satellite.getVar("RSID") != "undefined") {
        s.account = _satellite.getVar("RSID");
    }
  //console.log("RSID: "+s.account);
  //s = s_gi(s_account);
  if (_satellite.getVar('Page URL')) {
    s.pageURL = digitalData.view.location;
  }
  s.server = window.location.hostname.toLowerCase();
  //s_code version
  s.prop49 = "DTM-OneAmex-" + _satellite.getVar("RSID") + ":v1.0-AM:" + ((typeof s_scodesuffix != "undefined") ? s_scodesuffix : "") + s_c_il[1].version + "-VISID:" + ((typeof visitor != "undefined") ? visitor.version : (_satellite.getVisitorId() != null) ? _satellite.getVisitorId().version : "NA") + "-DIL:" + ((typeof DIL != "undefined") ? DIL.version : "NA") + "-Mbox:" + ((typeof mboxVersion != "undefined") ? mboxVersion : "NA");
  //Visitor ID coverage measurement
  s.contextData.visitorCheck = (typeof(Visitor) != "undefined" ? "VisitorAPI Present" : "VisitorAPI Missing");
  if (_satellite.getVar('Full PageName')) {
    s.pageName = _satellite.getVar('Full PageName');
  }
  if (_satellite.getVar('Language'))
    s.prop3 = _satellite.getVar('Language');
  if (_satellite.getVar('Country')) {
    s.prop4 = _satellite.getVar('Country').toUpperCase();
    // convert the prop4 to upper case.
    if (!s.prop4) {
      s.prop4 = "UnknownMarket"; // set default local market  
    }
    if (_satellite.getVar('Application'))
      s.prop31 = s.prop4 + "|" + _satellite.getVar('Application');
  }
  if (s.prop4) {
    s.eVar27 = s.prop4;
  }
  if (typeof _satellite.getVar('Hierarchy') != "undefined" && _satellite.getVar('Hierarchy')) {
    s.hier1 = _satellite.getVar('Hierarchy');
  }
  if (!s.eVar1 && _satellite.getVar('intlink')) {
    s.eVar1 = _satellite.getVar('intlink');
  }
  if (_satellite.getVar('iNav Link')) {
    s.eVar8 = _satellite.getVar('iNav Link');
  }
  if (_satellite.getVar('L3 Site Section')) {
    s.prop19 = _satellite.getVar('L3 Site Section');
  }
  if (_satellite.getVar('L4 Site Section')) {
    s.prop24 = _satellite.getVar('L4 Site Section');
  }
  if (_satellite.getVar('L5 Site Section')) {
    s.prop30 = _satellite.getVar('L5 Site Section');
  }
  if (_satellite.getVar('L6 Site Section')) {
    s.prop38 = _satellite.getVar('L6 Site Section');
  }
  s.prop56 = s.eVar78 = "oneamex";
  if (_satellite.getVar('device'))
    s.eVar78 = s.prop56 = s.prop56 + ":" + _satellite.getVar('device');
  if (_satellite.getVar('Amex Guid')) {
    s.prop34 = _satellite.getVar('Amex Guid');
  }
  if (_satellite.getVar('ZipCode')) {
    s.eVar39 = s.prop4 + ":" + _satellite.getVar('ZipCode');
  }
  if (_satellite.getVar('Login Status')) {
    s.prop50 = _satellite.getVar('Login Status');
  }
  if (typeof digitalData != "undefined") {
    if (typeof digitalData.charset != 'undefined' && digitalData.charset) {
      s.charSet = digitalData.charset
    }
  }
  // check with prop75 is requried or not

  //Percent of Page Viewed
  var ppvArray = s.getPercentPageViewed(s.pageName);
  if (ppvArray && typeof ppvArray == 'object') {
    if (typeof ppvArray[2] != "undefined")
      s.prop57 = ppvArray[2] + "|" + ppvArray[1]; //contains the previous page name
  }
  //Exit Links
  var dd_exitURL = (s.linkObject && s.linkType == 'e') ? s.linkURL : 0;
  if (dd_exitURL) {
    s.linkTrackVars = "prop27,prop49,prop57,prop58,contextData.ppvpage,contextData.ppvtotal,contextData.ppvinitial,ppvpixels";
    var ppvArray = s.getPercentPageViewed(s.pageName);
    omn.ppvtotal = ppvArray[1] //contains the total percent viewed
    omn.ppvinitial = ppvArray[2] //contains the percent viewed on initial load
    omn.ppvpage = s.prop27 = s.pageName ? s.pageName : "not available because pageName/hierarchy not set on page";
  }
  s.eVar41 = s.getPreviousValue(s.pageName, 'gpv_v41', '');
  //s.prop56=s.eVar78="OneAmex"; /* why not use data element application? */
  s.linkTrackVars = s.apl(s.linkTrackVars, 'prop56,eVar78', ',', 2);
  //Customer vs Prospect
  if (s.prop34) {
    s.prop10 = s.eVar45 = 'Customer';
  } else {
    s.prop10 = s.eVar45 = 'Prospect';
  }

  if (_satellite.getVar('Device Width') && _satellite.getVar('Device Height')) {
    var etratio = _satellite.getVar('Device Height') / _satellite.getVar('Device Width');
    if (etratio >= 1) {
      etorientation = "portrait";
    } else {
      etorientation = "landscape";
    }
    s.eVar61 = etorientation;
    s.eVar60 = _satellite.getVar('Device Width');
  }
  // International GCT cookie
  var gctcookie = s.c_r("gctrac")
  if (gctcookie) {
    s.prop48 = s.eVar22 = gctcookie;
  }
  if (s.pagename)
    s.eVar74 = s.pageName;
  if (typeof(Visitor) != "undefined") {
    s.visitor = Visitor.getInstance("5C36123F5245AF470A490D45@AdobeOrg");
    s.eVar75 = s.visitor.getMarketingCloudVisitorID();
  } else {
    s.eVar75 = "MCMID not available";
  }
  //   console.log("Before context data ...");
  if (typeof omn != "undefined") {
    if (_satellite.getVar("mycademo acctstatus")) {
      omn.acctstatus = _satellite.getVar("mycademo acctstatus");
    }
    if (_satellite.getVar("mycademo cardtype")) {
      omn.cardtype = _satellite.getVar("mycademo cardtype");
    }
    if (_satellite.getVar("mycademo mycacardholder")) {
      omn.mycacardholder = _satellite.getVar("mycademo mycacardholder");
    }
    if (_satellite.getVar("mycademo mycacardport")) {
      omn.mycacardport = _satellite.getVar("mycademo mycacardport");
    }
    if (_satellite.getVar("mycademo mycacardtype")) {
      omn.mycacardtype = _satellite.getVar("mycademo mycacardtype");
    }
    if (_satellite.getVar("mycademo mycadays")) {
      omn.mycadays = _satellite.getVar("mycademo mycadays");
    }
    if (_satellite.getVar("mycademo mycanumcards")) {
      omn.mycanumcards = _satellite.getVar("mycademo mycanumcards");
    }
    if (_satellite.getVar("mycademo mycatenture")) {
      omn.mycatenure = _satellite.getVar("mycademo mycatenture");
      //  omn.mycatenture=_satellite.getVar("mycademo mycatenture");
    }
    if (_satellite.getVar("mycademo usertype")) {
      omn.usertype = _satellite.getVar("mycademo usertype");
    }
    if (_satellite.getVar("mycademo mycacmtenure")) {
      omn.mycacmtenure = _satellite.getVar("mycademo mycacmtenure");
    }
    if (_satellite.getVar("mycademo lineofbusinesstype")) {
      omn.mycabuport = _satellite.getVar("mycademo lineofbusinesstype");
    }
    // Duplicate campaign issue exists , once framework fix applied need to change the logic.
    if (_satellite.getVar("Campaigns")) {
      omn.abtest = _satellite.getVar("Campaigns");
      s.list2 = omn.abtest;
      omn.abtestcounter = _satellite.getVar("Campaign Counter");
    } else {
      omn.abtest = "";
      omn.abtestcounter = 0;
    }
    if (_satellite.getVar('DDL View Id') && digitalData.view.viewId == "/search") {
      omn.intsearchterm = s.getQueryParam('term');
    } else {
      omn.intsearchterm = "";
    }
  }
  
   //! inc:common:DP_ChannelManager

  /*eInclude start DP_ChannelManager.txt*/
  /* destPage query paramet campaign capture */
  	if (s.getQueryParam('destpage') && !s.getQueryParam('extlink')) {
  		var destpage_override = decodeURIComponent(s.getQueryParam('destpage'))
	}
  	if (omn_temp == 1) {
  		if (omn.extlink) s.pageURL = s.insQP(s.pageURL, "extlink", omn.extlink)
  		/*Remove Email address from URL*/
  		if (s.pageURL.search(/(@|%40)\w+([\.-]?\w+)*(\.\w{2,3})+/g) > 0) {
  			base_url = s.pageURL.split('?');
  			s.pageURL = base_url[0] + "#URLTruncated";
  		}

  		/*ChannelManagerStart*/
  		if (destpage_override) {
  			var pre_destPage_override = s.pageURL;
  			s.pageURL = destpage_override;
  		}
  		//Manual doubleclick fix
  		s._cmevt = s.events + ","
  		if (s._cmevt.indexOf('event5,') > -1 || s._cmevt.indexOf('event5:') > -1 || s._cmevt.indexOf('event24') > -1) {} else { // These are references to events not used by servicing
  			if (typeof(omn.referrer) != 'undefined') { // use spoofed referrer for testing
  				s.referrer = omn.referrer
  			} else {
  				s.referrer = document.referrer
  			}
  			if (s.account.substring(s.account.length - 3) == "dev") {
  				s.testRef = s.getQueryParam('omnref') //another way to set the spoofed referrer (set in query string)
  				if (s.testRef) {
  					s.referrer = s.testRef
  				};
  			}
  			s.referrer = s.rmvQP(s.referrer, s.rmvParams) // Set referrer in situations where an automatic redirect was used
  			if (s.referrer.indexOf('americanexpress.com/myca/') > -1) {
  				s._SSOPage = s.getQueryParam('DestPage', s.referrer)
  			} else if (s.referrer.indexOf('americanexpress.com/occ/occwelcome.jsp') > -1 || s.referrer.indexOf('sso.americanexpress.com/sso/request') > -1) {
  				s._SSOPage = s.getQueryParam('TARGET', s.referrer)
  			} else if (s.referrer.indexOf('sso.americanexpress.com/sso') > -1) {
  				s._SSOPage = s.getQueryParam('SSOURL', s.referrer)
  			} else if (s.referrer.indexOf('icenturion.americanexpress.com') > -1) {
  				s._SSOPage = s.getQueryParam('target', s.referrer)
  			} else {
  				s._SSOPage = false
  			}
  			if (s._SSOPage) {
  				s.tempRef = s.referrer;
  				s.referrer = "//SSORedirect";
  			}
  			s.channelManager(s.cmQlist + ',' + s.cmQGCTlist, ':', '0', '', '', '', '1') // Makes the call to channel manager (channel ids, multiple campaign delimiter set to ':', opt out of getvalonce, don't uncompress search engine list, don't use direct load as channel, don't use typed/bookmark override, exclude internal campaigns is true)
  			if (s._SSOPage != false) { // sets referrer using the logic above in cases where there was a redirect
  				s.referrer = s.tempRef;
  			}

  			if (s._referringDomain != undefined) { //strips www. and query string params from referring domain
  				if (s._referringDomain.substring(0, 4) == 'www.') s._referringDomain = s._referringDomain.substring(4);
  				if (s._referringDomain.indexOf('?') > -1) s._referringDomain = s._referringDomain.substring(0, s._referringDomain.indexOf('?'));
  				//trim down the email referring domains
  				 s.mailRef=s._referringDomain.indexOf('.mail.')
  				 if(s.mailRef>-1){
  				 	s._referringDomain=s._referringDomain.substring(s.mailRef+1);
  				 }
  			}
  			s._paidEffort = 0;
  			s._refID = "";
  			s._cmlid = "";
  			if (s._keywords != undefined) s._keywords = s.repl(s._keywords, '+', ' ') //s._keywords is returned by channel manager
  			if (s._channel == "Paid Search") { //s._channel is returned by channel manager
  				s._paidEffort = 1;
  				if (s._keywords == "n/a") {
  					s._keywords = "keyword unavailable"
  				}
  				s._keywords = "p|" + s._keywords;
  			} else if (s._channel == "Unknown Paid Channel") {
  				s._paidEffort = 1;
  			} else if (s._channel == "Natural Search") {
  				if (s._keywords == "n/a") {
  					s._keywords = "keyword unavailable"
  				}
  				s._keywords = "n|" + s._keywords;
  				if (s.prop4.length == 2) {
  					s._campaign = s._refID = "n|" + s.prop4 + ":" + s._referringDomain;
  				} else {
  					s._campaign = s._refID = "n|" + s._referringDomain;
  				}
  				s._cmlid = "n/a"
  			} else if (s._channel == "Other Natural Referrers") {
  				s._cmlid = "n/a"
  				if (s._SSOPage || omn.iframe) {
  					s._refID = s._referrer = s._referringDomain = s._partner = s._campaignID = s._campaign = s._keywords = s._channel = s._cmlid = "";
  				} else if (s.prop4.length == 2) {
  					s._campaign = s._refID = "r|" + s.prop4 + ":" + s._referringDomain;
  				} else {
  					s._campaign = s._refID = "r|" + s._referringDomain;
  				}
  			}
  			if (s._paidEffort == 1) {
  				s._cpid = s.getQueryParam('cpid');
  				if (!s._cpid) s._cpid = s.getQueryParam('itu_id');
  				s._affid = s.getQueryParam('affid', window.location);
  				if (!s._affid) {
  					s._affid = s.getQueryParam('eaid', window.location);
  					if (s._affid) {
  						s._splitAffid = s.split(s._affid, '-');
  						s._affid = s._splitAffid[0];
  					}
  				}
  				if (s._cpid) {
  					s._refID = s._affid ? s._cpid + '|' + s._affid : s._cpid
  				} else if (s._channel == "Paid Search") {
  					if (s.prop4.length == 2) {
  						s._refID = s.prop4 + ':Legacy Paid Search'
  					} else {
  						s._refID = 'Legacy Paid Search'
  					}
  				} else if (s._channel == "Unknown Paid Channel") {
  					if (s.prop4.length == 2) {
  						s._refID = s.prop4 + ':Legacy Non-Search'
  					} else {
  						s._refID = 'Legacy Non-Search'
  					}
  				}
  				s._campaign = "";
  				s._cmlid = "n/a";
  				s.cmQlistA = s.split(s.cmQlist, ',')
  				s.cmQ = 0
  				while (s.cmQ < s.cmQlistA.length) {
  					if (!s._campaign) {
  						s._campaign = s.getQueryParam(s.cmQlistA[s.cmQ]);
  						if (s._campaign) {
  							if (s.cmQlistA[s.cmQ] == "om_mid") {
  								s._campaign = s.getQueryParam('om_mid');
  								s._cmlid = s.getQueryParam('om_lid');
  								if (!s._cmlid) s._cmlid = "n/a";
  							} else if (s.cmQlistA[s.cmQ] == "et_cid"){
  								s._campaign = s.getQueryParam('et_cid');
  								s._cmlid = s.getQueryParam('et_rid');
  								if (!s._cmlid) s._cmlid = "n/a";
  							} else if (s.cmQlistA[s.cmQ] == "affid") {
  								s.tcamp1 = s.getQueryParam('buid');
  								s.tcamp2 = s.getQueryParam('affid');
  								s.tcamp3 = s.getQueryParam('pid');
  								s.tcamp4 = s.getQueryParam('crtv');
  								s.tcamp1 = s.tcamp1 ? s.tcamp1 : 'null';
  								s.tcamp2 = s.tcamp2 ? s.tcamp2 : 'null';
  								s.tcamp3 = s.tcamp3 ? s.tcamp3 : 'null';
  								s.tcamp4 = s.tcamp4 ? s.tcamp4 : 'null';
  								s._campaign = "Affiliate|buid=" + s.tcamp1 + ":affid=" + s.tcamp2 + ":pid=" + s.tcamp3 + ":crtv=" + s.tcamp4;
  							} else if (s.cmQlistA[s.cmQ] == "eaid") {
  								s.tcamp5 = s.getQueryParam('eaid');
  								s.tcamp6 = s.getQueryParam('buid');
  								s.tcamp7 = s.getQueryParam('pid');
  								s.tcamp5 = s.tcamp5 ? s.tcamp5 : 'null';
  								s.tcamp6 = s.tcamp6 ? s.tcamp6 : 'null';
  								s.tcamp7 = s.tcamp7 ? s.tcamp7 : 'null';
  								s._campaign = "Affiliate|eaid=" + s.tcamp5 + ":buid=" + s.tcamp6 + ":pid=" + s.tcamp7;
  							} else {
  								if (s._campaign) s._campaign = s.cmQlistA[s.cmQ] + "=" + s._campaign;
  							}
  						}
  					}
  					s.cmQ++
  				}
  				if (!s._campaign) {
  					s.cmQGCTlistA = s.split(s.cmQGCTlist, ',')
  					for (var q in s.cmQGCTlistA) {
  						if (s.cmQGCTlistA.hasOwnProperty(q)) {
  							var qv = s.cmQGCTlistA[q];
  							var qspVars = s.getQueryParam(qv);
  							if (qspVars) {
  								s._campaign = "GCT CPID";
  							}
  						}
  					}
  				}
  			}

  			// Custom deduping: rather than relying on channel manager deduping, the following
  			// code is used to only set values on site entrance.
  			if (s._campaign) {
  				if (s.dedupeCM) {
  					s.dedupeCM = s.dedupeCM + s._campaign;
  				} else {
  					s.dedupeCM = s._campaign;
  				}
  			}
  			if (s._refID) {
  				if (s.dedupeCM) {
  					s.dedupeCM = s.dedupeCM + s._refID;
  				} else {
  					s.dedupeCM = s._refID;
  				}
  			}
  			if (s._referringDomain) {
  				if (s.dedupeCM) {
  					s.dedupeCM = s.dedupeCM + s._referringDomain;
  				} else {
  					s.dedupeCM = s._referringDomain;
  				}
  			}
  			if (s._keywords) {
  				if (s.dedupeCM) {
  					s.dedupeCM = s.dedupeCM + s._keywords;
  				} else {
  					s.dedupeCM = s._keywords;
  				}
  			}
  			if (s._cmlid) {
  				if (s.dedupeCM) {
  					s.dedupeCM = s.dedupeCM + s._cmlid;
  				} else {
  					s.dedupeCM = s._cmlid;
  				}
  			}
  			s.dedupeCM = s.getValOnce(s.dedupeCM, 's_dedupeCM', 0)
  			if (s.dedupeCM) {
  				s.campaign = s._campaign;
  				s.eVar21 = s._refID;
  				s.eVar70 = s._keywords;
  				s.eVar71 = s.pageName;
  				s.eVar72 = s._cmlid;
  			}
  			s.dedupeCM='';
  		}
  	} else {
  		s.campaign = s.eVar21 = s.eVar70 = s.eVar71 = s.eVar72 = ""
  	}
  	s.events = s.removeEvent('event45')
  	s.events = s.removeEvent('event46')
  	s.clickPast(s.campaign, 'event45', 'event46');

  	if (pre_destPage_override) {
  		s.pageURL = pre_destPage_override;
  	}
/*eInclude end DP_ChannelManager.txt*/
  
//  console.log("After context data ...");
  /*eInclude start DP_ContextDataMapping.txt*/
  //Map all variables to contextData
  //Map query string params to omn. variables
  //if (!s.isRM){
  for (var q in s.omn_getFromQueryParamVars) { // get variables from query params
    if (s.omn_getFromQueryParamVars.hasOwnProperty(q)) { // check that item is a property of omn
      qv = s.omn_getFromQueryParamVars[q];
      omn[qv] = (omn.hasOwnProperty(qv)) ? ((omn[qv] != "") ? omn[qv] : s.getQueryParam(qv)) : s.getQueryParam(qv);
    }
  }
  //toLowerCase variables
  for (var ucase in s.omn_toLowerCase) {
    uc = s.omn_toLowerCase[ucase];
    if (omn.hasOwnProperty(uc)) {
      omn[uc] = omn[uc].toLowerCase();;
    }
  }
  // copy first product ID to contextData variable for event mapping
  if (s.products && s.products.indexOf(';') > -1) {
    pl = s.split(s.products, ',');
    pll = pl.length;
    for (var n = 0; n < pll; n++) {
      pla = s.split(pl[n], ';');
      pid = pla[1];
      if (!s.contextData['omn.productID']) {
        s.contextData['omn.productID'] = pid;
      }
    }
  }

  // map omn. to context variables
  for (var ovar in omn) {
    if (omn.hasOwnProperty(ovar)) { // check that item is a property of omn				
      if (s.inArr(s.omn_getValOnceVars, ovar)) { // getValOnce if flagged
        s.contextData['omn.' + ovar] = s.getValOnce(omn[ovar], 'omn_' + ovar, 0);
      } else {
        s.contextData['omn.' + ovar] = omn[ovar];
      }
    }
  }
  //}
  omn_temp = 0;
  s.prop75 = "DTM";
  //  console.log("do plugins end...");
};
s.doPlugins = s_doPlugins;

/************************** PLUGINS SECTION *************************/
/*eInclude start Plugin_ChannelManager.txt*/
/*
 * Plugin channelManager v3.05 - Tracking External Traffic
 */
s.channelManager=function(a,b,c,d,e,f,g){var s=this,h=new Date,i=0,j,k,l,m,n,o,p,q,r,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V;U=s.getQueryParam?1:0;V=s.repl?1:0;if(e){i=1;if(s.c_r(e))i=0;h.setTime(h.getTime()+18E5);s.c_w(e,1,h);if(f&&s.c_r("s_tbm"+e+f))i=0}j=s.referrer?s.referrer:document.referrer;if(j=="Typed/Bookmarked")j="";j=decodeURIComponent(j.toLowerCase());if(!j)k=1;else{l=j.indexOf("?")>-1?j.indexOf("?"):j.length;m=j.substring(0,l);n=j.split("/");n=n[2].split("?");o=n[0].toLowerCase();
p=s.linkInternalFilters.toLowerCase();p=p.split(",");for(q=0;q<p.length;q++){r=o.indexOf(p[q])==-1?"":j;if(r)break}}if(!r&&!k){t=j;u=o;w="Other Natural Referrers";v=w+": "+o;x=s.seList+">"+s._extraSearchEngines;if(d==1){m=V?s.repl(m,"oogle","%"):s.replace(m,"oogle","%");m=V?s.repl(m,"ahoo","^"):s.replace(m,"ahoo","^");j=V?s.repl(j,"as_q","*"):s.replace(j,"as_q","*")}y=x.split(">");for(z=0;z<y.length;z++){A=y[z];A=A.split("|");B=A[0].split(",");for(C=0;C<B.length;C++){D=m.indexOf(B[C]);if(D>-1){if(A[2])E=
v=A[2];else E=o;if(d==1){E=V?s.repl(E,"#"," - "):s.replace(E,"#"," - ");j=V?s.repl(j,"*","as_q"):s.replace(j,"*","as_q");E=V?s.repl(E,"^","ahoo"):s.replace(E,"^","ahoo");E=V?s.repl(E,"%","oogle"):s.replace(E,"%","oogle")}F=A[1].split(",");for(G=0;G<F.length;G++){if(j.indexOf(F[G]+"=")>-1||j.indexOf("googlequicksearchbox")>-1||j.indexOf("http://www.google.")==0||j.indexOf("https://www.google.")==0||j.indexOf("https://search.yahoo.com/")==0||j.indexOf("http://r.search.yahoo.com")==0||j.indexOf("https://www.bing.com")==
0)H=1;I=U?s.getQueryParam(F[G],"",j).toLowerCase():s.Util.getQueryParam(F[G],j).toLowerCase();if(H||I)break}}if(H||I)break}if(H||I)break}}if(!r||g!="1"){J=a.split(",");for(var q in J)if(J.hasOwnProperty(q))if(U?s.getQueryParam(J[q]):s.Util.getQueryParam(J[q]))if(b)T=T?T+b+(U?s.getQueryParam(J[q]):s.Util.getQueryParam(J[q])):U?s.getQueryParam(J[q]):s.Util.getQueryParam(J[q]);else{T=U?s.getQueryParam(J[q]):s.Util.getQueryParam(J[q]);if(T)break}if(T){v=T;if(E)w="Paid Search";else w="Unknown Paid Channel"}if(!T&&
E&&H){w="Natural Search";v=w+": "+E}}if(i&&k&&!T)t=u=v=w="Typed/Bookmarked";J=s._channelDomain;if(J&&o&&!r){K=J.split(">");for(L=0;L<K.length;L++){M=K[L]?K[L].split("|"):"";N=M[1]?M[1].split(","):"";O=N.length;for(P=0;P<O;P++){Q=N[P].toLowerCase();R=("/"+o).indexOf(Q);if(R>-1){w=M[0];v=T?v:M[0]+": "+o;break}}if(R>-1)break}}J=s._channelParameter;if(J){K=J.split(">");for(L=0;L<K.length;L++){M=K[L]?K[L].split("|"):"";N=M[1]?M[1].split(","):"";O=N.length;for(P=0;P<O;P++){R=U?s.getQueryParam(N[P]):s.Util.getQueryParam(N[P]);
if(R){w=M[0];break}}if(R)break}}J=s._channelPattern;if(J){K=J.split(">");for(L=0;L<K.length;L++){M=K[L]?K[L].split("|"):"";N=M[1]?M[1].split(","):"";O=N.length;for(P=0;P<O;P++){Q=N[P].toLowerCase();R=T?T.toLowerCase():"";S=R.indexOf(Q);if(S==0){w=M[0];break}}if(S==0)break}}S=w?T+u+w+I:"";c=c?c:"c_m";if(c!="0")S=s.getValOnce(S,c,0);if(S){s._campaignID=T?T:"n/a";s._referrer=t?t:"n/a";s._referringDomain=u?u:"n/a";s._campaign=v?v:"n/a";s._channel=w?w:"n/a";s._partner=E?E:"n/a";s._keywords=H?I?I:"Keyword Unavailable":
"n/a";if(f&&w!="Typed/Bookmarked"){h.setTime(h.getTime()+f*864E5);s.c_w("s_tbm"+e+f,1,h)}}else s._campaignID=s._referrer=s._referringDomain=s._campaign=s._channel=s._partner=s._keywords=""};
/* Top 130 - Grouped */
s.seList="google.,googlesyndication.com,.googleadservices.com|q,as_q|"
+"Google>bing.com|q|Bing>yahoo.com,yahoo.co.jp|p,va|Yahoo!>ask.jp,ask"
+".co|q,ask|Ask>search.aol.,suche.aolsvc.de|q,query|AOL>altavista.co,"
+"altavista.de|q,r|AltaVista>.mywebsearch.com|searchfor|MyWebSearch>w"
+"ebcrawler.com|q|WebCrawler>wow.com|q|Wow>infospace.com|q|InfoSpace>"
+"blekko.com|q|Blekko>dogpile.com|q|DogPile>alhea.com|q|Alhea>goduckg"
+"o.com|q|GoDuckGo>info.com|qkw|Info.com>contenko.com|q|Contenko>baid"
+"u.com|word,wd|Baidu>daum.net,search.daum.net|q|Daum>icqit.com|q|icq"
+">myway.com|searchfor|MyWay.com>naver.com,search.naver.com|query|Nav"
+"er>netscape.com|query,search|Netscape Search>reference.com|q|Refere"
+"nce.com>seznam|w|Seznam.cz>abcsok.no|q|Startsiden>tiscali.it,www.ti"
+"scali.co.uk|key,query|Tiscali>virgilio.it|qs|Virgilio>yandex|text|Y"
+"andex.ru>optimum.net|q|Optimum Search>search.earthlink.net|q|Earthl"
+"ink>search.comcast.net|q|Comcast>libero.it|query|libero.it>excite.c"
+"o|search|Excite>mail.ru|q|Mail.ru>isearch.avg.com|q|AVG>msn.com|q|M"
+"SN>seznam.cz|q|seznam.cz>so.com|q|so.com>ixquick.com|query|ixquick."
+"com>sogou.com|query|sogou.com>360.cn|q|360.cn";

/*eInclude end Plugin_ChannelManager.txt*/

//! inc:common:Plugin_Replace
/*eInclude start Plugin_Replace.txt version 1.0*/
s.repl=new Function("x","o","n",""
+"var i=x.indexOf(o),l=n.length;while(x&&i>=0){x=x.substring(0,i)+n+x."
+"substring(i+o.length);i=x.indexOf(o,i+l)}return x");
/*eInclude end Plugin_Replace.txt*/

//! inc:common:Plugin_RemoveQSP
/*eInclude start Plugin_RemoveQSP.txt custom AMEX plugin*/
s.rmvQP=new Function("u","p",""
+"var s=this,i,j,k,pa=s.split(p,',');u=''+u;for(i in pa){p=pa[i];j=0;"
+"while(j!=-1){j=u.indexOf('?'+p+'=');if(j==-1)j=u.indexOf('&'+p+'=')"
+";if(j!=-1){k=u.indexOf('&',j+1);if(k==-1)k=u.length;u=u.substring(0"
+",j+1)+u.substring(k+1,u.length)}}}return u");
/*eInclude end Plugin_RemoveQSP.txt*/

//! inc:common:Plugin_RemoveEvent
/*eInclude start Plugin_RemoveEvent.txt vesion: 1.0*/
s.removeEvent=new Function("e",""
+"var s=this;var el,a,b,c,a1,b1,c1,d;if(s.events){el=s.split(s.events"
+",',');a=e+',';b=e+':';c=e+'=';x=0;while(x<el.length){a1=el[x]+',';b"
+"1=el[x]+':';c1=el[x]+'=';if(a1.indexOf(a)>-1||b1.indexOf(b)>-1||c1."
+"indexOf(c)>-1){}else{d?d=d+','+el[x]:d=el[x];}x++;}}d?d=d:d='';retu"
+"rn d;");
/*eInclude end Plugin_RemoveEvent.txt*/

/*eInclude start Plugin_ClickPast.txt version: 1.0*/
s.clickPast=new Function("scp","ct_ev","cp_ev","cpc",""
+"var s=this,scp,ct_ev,cp_ev,cpc,ev,tct;if(s.p_fo(ct_ev)==1){if(!cpc)"
+"{cpc='s_cpc';}ev=s.events?s.events+',':'';if(scp){s.events=ev+ct_ev"
+";s.c_w(cpc,1,0);}else{if(s.c_r(cpc)>=1){s.events=ev+cp_ev;s.c_w(cpc"
+",0,0);}}}");
/* p_fo (pageFirstOnly) Utility - 1.0 (minified) */
s.p_fo=function(n){var s=this;if(!s.__fo)s.__fo=new Object;if(!s.__fo[n]){s.__fo[n]=new Object;return 1}else return 0};

/*eInclude end Plugin_ClickPast.txt*/
/*eInclude start Plugin_AppendToList.txt version: 2.5*/
/*
 * Plugin Utility: apl (Append to List) v2.5 (Minified) - Uses s.inList Plugin Utility
 */
s.apl=function(l,v,d,u){var s=this;d=d?d:",";if(!s.inList(l,v,d,u))l=l?l+d+v:v;return l};
s.inList=function(l,v,d,u){if(typeof v!="string")return false;var s=this,ar=Array();if(typeof l=="string"){d=d?d:",";ar=l.split(d)}else if(typeof l=="object")ar=l;else return false;for(var i=0,arlength=ar.length;i<arlength;i++)if(typeof u!="undefined"&&u==1&&v==ar[i])return true;else if(v.toLowerCase()==ar[i].toLowerCase())return true;return false};
/*eInclude end Plugin_AppendToList.txt*/

/*eInclude start Plugin_inArray.txt*/
s.inArr = function(hs,n){
	for (var i=0; i<hs.length; i++)
		if (hs[i] == n) return true;
  return false;
}
/*eInclude end Plugin_inArray.txt*/

/*eInclude start Plugin_GetPercentPageViewed.txt version:2.01*/
/* Plugin: getPercentPageViewed v2.01 */
s.handlePPVevents=function(){if(!s_c_il)return;for(var i=0,scill=s_c_il.length;i<scill;i++)if(typeof s_c_il[i]!="undefined"&&s_c_il[i]._c&&s_c_il[i]._c=="s_c"){var s=s_c_il[i];break}if(!s)return;if(!s.getPPVid)return;var dh=Math.max(Math.max(s.d.body.scrollHeight,s.d.documentElement.scrollHeight),Math.max(s.d.body.offsetHeight,s.d.documentElement.offsetHeight),Math.max(s.d.body.clientHeight,s.d.documentElement.clientHeight)),vph=window.innerHeight||(s.d.documentElement.clientHeight||s.d.body.clientHeight),
st=window.pageYOffset||(window.document.documentElement.scrollTop||window.document.body.scrollTop),vh=st+vph,pv=Math.min(Math.round(vh/dh*100),100),c="",p=s.c_r("s_ppv").split(",")[0];if(!s.c_r("tp")||(s.unescape?s.unescape(p):decodeURIComponent(p))!=s.getPPVid||s.ppvChange=="1"&&(s.c_r("tp")&&dh!=s.c_r("tp"))){s.c_w("tp",dh);s.c_w("s_ppv","")}else c=s.c_r("s_ppv");var a=c&&c.indexOf(",")>-1?c.split(",",4):[],id=a.length>0?a[0]:escape(s.getPPVid),cv=a.length>1?parseInt(a[1]):0,p0=a.length>2?parseInt(a[2]):
pv,cy=a.length>3?parseInt(a[3]):0,cn=pv>0?id+","+(pv>cv?pv:cv)+","+p0+","+(vh>cy?vh:cy):"";s.c_w("s_ppv",cn)};
s.getPercentPageViewed=function(pid,change){var s=this,ist=!s.getPPVid?true:false;pid=pid?pid:s.pageName?s.pageName:document.location.href;s.ppvChange=change?change:"1";if(typeof s.linkType!="undefined"&&s.linkType!="0"&&s.linkType!=""&&s.linkType!="e")return"";var v=s.c_r("s_ppv"),a=v.indexOf(",")>-1?v.split(",",4):[];if(a&&a.length<4){for(var i=3;i>0;i--)a[i]=i<a.length?a[i-1]:"";a[0]=""}if(a)a[0]=unescape(a[0]);if(!s.getPPVid||s.getPPVid!=pid){s.getPPVid=pid;s.c_w("s_ppv",escape(s.getPPVid));s.handlePPVevents()}if(ist)if(window.addEventListener){window.addEventListener("load",
s.handlePPVevents,false);window.addEventListener("click",s.handlePPVevents,false);window.addEventListener("scroll",s.handlePPVevents,false);window.addEventListener("resize",s.handlePPVevents,false)}else if(window.attachEvent){window.attachEvent("onload",s.handlePPVevents);window.attachEvent("onclick",s.handlePPVevents);window.attachEvent("onscroll",s.handlePPVevents);window.attachEvent("onresize",s.handlePPVevents)}return pid!="-"?a:a[1]};
/*eInclude end Plugin_GetPercentPageViewed.txt*/

/*eInclude start Plugin_GetPreviousValue.txt version : 1.0*/
s.getPreviousValue=new Function("v","c","el",""+"var s=this,t=new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el"+"){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i"+"){for(y in j){if(i[x]==j[y]){if(s.c_r(c)) r=s.c_r(c);v?s.c_w(c,v,t)"+":s.c_w(c,'no value',t);return r}}}}}else{if(s.c_r(c)) r=s.c_r(c);v?"+"s.c_w(c,v,t):s.c_w(c,'no value',t);return r}");
/*eInclude end Plugin_GetPreviousValue.tgetvalonce.txt*/

/*eInclude start Plugin_Join.txt version 1.0 **/
s.join = new Function("v","p",""+"var s = this;var f,b,d,w;if(p){f=p.front?p.front:'';b=p.back?p.back"+":'';d=p.delim?p.delim:'';w=p.wrap?p.wrap:'';}var str='';for(var x=0"+";x<v.length;x++){if(typeof(v[x])=='object' )str+=s.join( v[x],p);el"+"se str+=w+v[x]+w;if(x<v.length-1)str+=d;}return f+str+b;");
/*eInclude end Plugin_Join.txt*/

/*eInclude start Plugin_CookieCombine.txt*/
/*
 * Cookie Combining Utility v1.0 (Minified)
 */
if(!s.__ccucr){var c_rspers=function(){var s=this,cv=s.c_rr("s_pers"),date=(new Date).getTime(),expd=null,cvarr=[],vcv="";if(!cv)return vcv;cvarr=cv.split(";");for(var i=0,l=cvarr.length;i<l;i++){expd=cvarr[i].match(/\|([0-9]+)$/);if(expd&&parseInt(expd[1])>=date)vcv+=cvarr[i]+";"}return vcv};var c_r=function(k){var s=this,d=new Date,v=s.c_rr(k),c=s.c_rspers(),i,m,e;if(v)return v;k=s.escape?s.escape(k):encodeURIComponent(k);i=c.indexOf(" "+k+"=");c=i<0?s.c_rr("s_sess"):c;i=c.indexOf(" "+k+"=");m=
i<0?i:c.indexOf("|",i);e=i<0?i:c.indexOf(";",i);m=m>0?m:e;v=i<0?"":s.unescape?s.unescape(c.substring(i+2+k.length,m<0?c.length:m)):decodeURIComponent(c.substring(i+2+k.length,m<0?c.length:m));return v};s.c_rr=s.c_r;s.__ccucr=true;s.c_rspers=c_rspers;s.c_r=s.cookieRead=c_r}
if(!s.__ccucw){var c_w=function(k,v,e){var s=this,d=new Date,ht=0,pn="s_pers",sn="s_sess",pc=0,sc=0,pv,sv,c,i,t,f;d.setTime(d.getTime()-6E4);if(s.c_rr(k))s.c_wr(k,"",d);k=s.escape?s.escape(k):encodeURIComponent(k);pv=s.c_rspers();i=pv.indexOf(" "+k+"=");if(i>-1){pv=pv.substring(0,i)+pv.substring(pv.indexOf(";",i)+1);pc=1}sv=s.c_rr(sn);i=sv.indexOf(" "+k+"=");if(i>-1){sv=sv.substring(0,i)+sv.substring(sv.indexOf(";",i)+1);sc=1}d=new Date;if(e){if(e==1)e=new Date,f=e.getYear(),e.setYear(f+5+(f<1900?
1900:0));if(e.getTime()>d.getTime()){pv+=" "+k+"="+(s.escape?s.escape(v):encodeURIComponent(v))+"|"+e.getTime()+";";pc=1}}else{sv+=" "+k+"="+(s.escape?s.escape(v):encodeURIComponent(v))+";";sc=1}sv=sv.replace(/%00/g,"");pv=pv.replace(/%00/g,"");if(sc)s.c_wr(sn,sv,0);if(pc){t=pv;while(t&&t.indexOf(";")!=-1){var t1=parseInt(t.substring(t.indexOf("|")+1,t.indexOf(";")));t=t.substring(t.indexOf(";")+1);ht=ht<t1?t1:ht}d.setTime(ht);s.c_wr(pn,pv,d)}return v==s.c_r(s.unescape?s.unescape(k):decodeURIComponent(k))};
s.c_wr=s.c_w;s.__ccucw=true;s.c_w=s.cookieWrite=c_w};
/*eInclude end Plugin_CookieCombine.txt*/

/*eInclude start Plugin_Split.txt version:1.5*/
s.split=new Function("l","d",""
+"var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x"
+"++]=l.substring(0,i);l=l.substring(i+d.length);}return a");
/*eInclude end Plugin_Split.txt*/

/*
 *	getQueryParam v2.5 - H-code and AppMeasurement Compatible
 */
s.getQueryParam=function(p,d,u,h){var s=this,v="",i,j,t;d=d?d:"";u=u?u:s.pageURL?s.pageURL:s.wd?s.wd.location:window.location;while(p){i=p.indexOf(",");i=i<0?p.length:i;t=s.p_gpv(p.substring(0,i),u+"",h);if(t)t=t.indexOf("#")>-1?t.substring(0,t.indexOf("#")):t;if(t)v+=v?d+t:t;p=p.substring(i==p.length?i:i+1)}return v};
s.p_gpv=function(k,u,h){var s=this,v="",q;j=h==1?"#":"?";i=u.indexOf(j);if(k&&i>-1){q=u.substring(i+1);v=s.pt(q,"&","p_gvf",k)}return v};
s.p_gvf=function(t,k){if(t){var s=this,i=t.indexOf("="),p=i<0?t:t.substring(0,i),v=i<0?true:t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s.epa?s.epa(v):s.unescape(v)}return""};
/*
 *	pt - utility function
 */
s.pt=function(x,d,f,a){var s=this,t=x,z=0,y,r;while(t){y=t.indexOf(d);y=y<0?t.length:y;t=t.substring(0,y);r=s[f](t,a);if(r)return r;z+=y+d.length;t=x.substring(z,x.length);t=z<x.length?t:""}return""};

/*eInclude start Plugin_GetValOnce.txt version: 1.0*/
s.getValOnce=new Function("v","c","e",""
+"var s=this,k=s.c_r(c),a=new Date;e=e?e:0;if(v){a.setTime(a.getTime("
+")+e*86400000);s.c_w(c,v,e?a:0);}return v==k?'':v");
/*eInclude end Plugin_GetValOnce.txt*/

/*
 ============== DO NOT ALTER ANYTHING BELOW THIS LINE ! ===============

AppMeasurement for JavaScript version: 2.1.0
Copyright 1996-2016 Adobe, Inc. All Rights Reserved
More info available at http://www.adobe.com/marketing-cloud.html
*/
function AppMeasurement(){var a=this;a.version="2.1.0";var h=window;h.s_c_in||(h.s_c_il=[],h.s_c_in=0);a._il=h.s_c_il;a._in=h.s_c_in;a._il[a._in]=a;h.s_c_in++;a._c="s_c";var n=h.AppMeasurement.Ob;n||(n=null);var p=h,l,r;try{for(l=p.parent,r=p.location;l&&l.location&&r&&""+l.location!=""+r&&p.location&&""+l.location!=""+p.location&&l.location.host==r.host;)p=l,l=p.parent}catch(s){}a.P=function(a){try{console.log(a)}catch(b){}};a.La=function(a){return""+parseInt(a)==""+a};a.replace=function(a,b,d){return!a||
0>a.indexOf(b)?a:a.split(b).join(d)};a.escape=function(c){var b,d;if(!c)return c;c=encodeURIComponent(c);for(b=0;7>b;b++)d="+~!*()'".substring(b,b+1),0<=c.indexOf(d)&&(c=a.replace(c,d,"%"+d.charCodeAt(0).toString(16).toUpperCase()));return c};a.unescape=function(c){if(!c)return c;c=0<=c.indexOf("+")?a.replace(c,"+"," "):c;try{return decodeURIComponent(c)}catch(b){}return unescape(c)};a.vb=function(){var c=h.location.hostname,b=a.fpCookieDomainPeriods,d;b||(b=a.cookieDomainPeriods);if(c&&!a.cookieDomain&&
!/^[0-9.]+$/.test(c)&&(b=b?parseInt(b):2,b=2<b?b:2,d=c.lastIndexOf("."),0<=d)){for(;0<=d&&1<b;)d=c.lastIndexOf(".",d-1),b--;a.cookieDomain=0<d?c.substring(d):c}return a.cookieDomain};a.c_r=a.cookieRead=function(c){c=a.escape(c);var b=" "+a.d.cookie,d=b.indexOf(" "+c+"="),f=0>d?d:b.indexOf(";",d);c=0>d?"":a.unescape(b.substring(d+2+c.length,0>f?b.length:f));return"[[B]]"!=c?c:""};a.c_w=a.cookieWrite=function(c,b,d){var f=a.vb(),e=a.cookieLifetime,g;b=""+b;e=e?(""+e).toUpperCase():"";d&&"SESSION"!=
e&&"NONE"!=e&&((g=""!=b?parseInt(e?e:0):-60)?(d=new Date,d.setTime(d.getTime()+1E3*g)):1==d&&(d=new Date,g=d.getYear(),d.setYear(g+5+(1900>g?1900:0))));return c&&"NONE"!=e?(a.d.cookie=a.escape(c)+"="+a.escape(""!=b?b:"[[B]]")+"; path=/;"+(d&&"SESSION"!=e?" expires="+d.toGMTString()+";":"")+(f?" domain="+f+";":""),a.cookieRead(c)==b):0};a.K=[];a.ia=function(c,b,d){if(a.Ea)return 0;a.maxDelay||(a.maxDelay=250);var f=0,e=(new Date).getTime()+a.maxDelay,g=a.d.visibilityState,k=["webkitvisibilitychange",
"visibilitychange"];g||(g=a.d.webkitVisibilityState);if(g&&"prerender"==g){if(!a.ja)for(a.ja=1,d=0;d<k.length;d++)a.d.addEventListener(k[d],function(){var c=a.d.visibilityState;c||(c=a.d.webkitVisibilityState);"visible"==c&&(a.ja=0,a.delayReady())});f=1;e=0}else d||a.p("_d")&&(f=1);f&&(a.K.push({m:c,a:b,t:e}),a.ja||setTimeout(a.delayReady,a.maxDelay));return f};a.delayReady=function(){var c=(new Date).getTime(),b=0,d;for(a.p("_d")?b=1:a.xa();0<a.K.length;){d=a.K.shift();if(b&&!d.t&&d.t>c){a.K.unshift(d);
setTimeout(a.delayReady,parseInt(a.maxDelay/2));break}a.Ea=1;a[d.m].apply(a,d.a);a.Ea=0}};a.setAccount=a.sa=function(c){var b,d;if(!a.ia("setAccount",arguments))if(a.account=c,a.allAccounts)for(b=a.allAccounts.concat(c.split(",")),a.allAccounts=[],b.sort(),d=0;d<b.length;d++)0!=d&&b[d-1]==b[d]||a.allAccounts.push(b[d]);else a.allAccounts=c.split(",")};a.foreachVar=function(c,b){var d,f,e,g,k="";e=f="";if(a.lightProfileID)d=a.O,(k=a.lightTrackVars)&&(k=","+k+","+a.na.join(",")+",");else{d=a.g;if(a.pe||
a.linkType)k=a.linkTrackVars,f=a.linkTrackEvents,a.pe&&(e=a.pe.substring(0,1).toUpperCase()+a.pe.substring(1),a[e]&&(k=a[e].Mb,f=a[e].Lb));k&&(k=","+k+","+a.G.join(",")+",");f&&k&&(k+=",events,")}b&&(b=","+b+",");for(f=0;f<d.length;f++)e=d[f],(g=a[e])&&(!k||0<=k.indexOf(","+e+","))&&(!b||0<=b.indexOf(","+e+","))&&c(e,g)};a.r=function(c,b,d,f,e){var g="",k,m,h,t,l=0;"contextData"==c&&(c="c");if(b){for(k in b)if(!(Object.prototype[k]||e&&k.substring(0,e.length)!=e)&&b[k]&&(!d||0<=d.indexOf(","+(f?f+
".":"")+k+","))){h=!1;if(l)for(m=0;m<l.length;m++)k.substring(0,l[m].length)==l[m]&&(h=!0);if(!h&&(""==g&&(g+="&"+c+"."),m=b[k],e&&(k=k.substring(e.length)),0<k.length))if(h=k.indexOf("."),0<h)m=k.substring(0,h),h=(e?e:"")+m+".",l||(l=[]),l.push(h),g+=a.r(m,b,d,f,h);else if("boolean"==typeof m&&(m=m?"true":"false"),m){if("retrieveLightData"==f&&0>e.indexOf(".contextData."))switch(h=k.substring(0,4),t=k.substring(4),k){case "transactionID":k="xact";break;case "channel":k="ch";break;case "campaign":k=
"v0";break;default:a.La(t)&&("prop"==h?k="c"+t:"eVar"==h?k="v"+t:"list"==h?k="l"+t:"hier"==h&&(k="h"+t,m=m.substring(0,255)))}g+="&"+a.escape(k)+"="+a.escape(m)}}""!=g&&(g+="&."+c)}return g};a.usePostbacks=0;a.yb=function(){var c="",b,d,f,e,g,k,m,h,l="",p="",q=e="";if(a.lightProfileID)b=a.O,(l=a.lightTrackVars)&&(l=","+l+","+a.na.join(",")+",");else{b=a.g;if(a.pe||a.linkType)l=a.linkTrackVars,p=a.linkTrackEvents,a.pe&&(e=a.pe.substring(0,1).toUpperCase()+a.pe.substring(1),a[e]&&(l=a[e].Mb,p=a[e].Lb));
l&&(l=","+l+","+a.G.join(",")+",");p&&(p=","+p+",",l&&(l+=",events,"));a.events2&&(q+=(""!=q?",":"")+a.events2)}if(a.visitor&&a.visitor.getCustomerIDs){e=n;if(g=a.visitor.getCustomerIDs())for(d in g)Object.prototype[d]||(f=g[d],"object"==typeof f&&(e||(e={}),f.id&&(e[d+".id"]=f.id),f.authState&&(e[d+".as"]=f.authState)));e&&(c+=a.r("cid",e))}a.AudienceManagement&&a.AudienceManagement.isReady()&&(c+=a.r("d",a.AudienceManagement.getEventCallConfigParams()));for(d=0;d<b.length;d++){e=b[d];g=a[e];f=e.substring(0,
4);k=e.substring(4);g||("events"==e&&q?(g=q,q=""):"marketingCloudOrgID"==e&&a.visitor&&(g=a.visitor.marketingCloudOrgID));if(g&&(!l||0<=l.indexOf(","+e+","))){switch(e){case "customerPerspective":e="cp";break;case "marketingCloudOrgID":e="mcorgid";break;case "supplementalDataID":e="sdid";break;case "timestamp":e="ts";break;case "dynamicVariablePrefix":e="D";break;case "visitorID":e="vid";break;case "marketingCloudVisitorID":e="mid";break;case "analyticsVisitorID":e="aid";break;case "audienceManagerLocationHint":e=
"aamlh";break;case "audienceManagerBlob":e="aamb";break;case "authState":e="as";break;case "pageURL":e="g";255<g.length&&(a.pageURLRest=g.substring(255),g=g.substring(0,255));break;case "pageURLRest":e="-g";break;case "referrer":e="r";break;case "vmk":case "visitorMigrationKey":e="vmt";break;case "visitorMigrationServer":e="vmf";a.ssl&&a.visitorMigrationServerSecure&&(g="");break;case "visitorMigrationServerSecure":e="vmf";!a.ssl&&a.visitorMigrationServer&&(g="");break;case "charSet":e="ce";break;
case "visitorNamespace":e="ns";break;case "cookieDomainPeriods":e="cdp";break;case "cookieLifetime":e="cl";break;case "variableProvider":e="vvp";break;case "currencyCode":e="cc";break;case "channel":e="ch";break;case "transactionID":e="xact";break;case "campaign":e="v0";break;case "latitude":e="lat";break;case "longitude":e="lon";break;case "resolution":e="s";break;case "colorDepth":e="c";break;case "javascriptVersion":e="j";break;case "javaEnabled":e="v";break;case "cookiesEnabled":e="k";break;case "browserWidth":e=
"bw";break;case "browserHeight":e="bh";break;case "connectionType":e="ct";break;case "homepage":e="hp";break;case "events":q&&(g+=(""!=g?",":"")+q);if(p)for(k=g.split(","),g="",f=0;f<k.length;f++)m=k[f],h=m.indexOf("="),0<=h&&(m=m.substring(0,h)),h=m.indexOf(":"),0<=h&&(m=m.substring(0,h)),0<=p.indexOf(","+m+",")&&(g+=(g?",":"")+k[f]);break;case "events2":g="";break;case "contextData":c+=a.r("c",a[e],l,e);g="";break;case "lightProfileID":e="mtp";break;case "lightStoreForSeconds":e="mtss";a.lightProfileID||
(g="");break;case "lightIncrementBy":e="mti";a.lightProfileID||(g="");break;case "retrieveLightProfiles":e="mtsr";break;case "deleteLightProfiles":e="mtsd";break;case "retrieveLightData":a.retrieveLightProfiles&&(c+=a.r("mts",a[e],l,e));g="";break;default:a.La(k)&&("prop"==f?e="c"+k:"eVar"==f?e="v"+k:"list"==f?e="l"+k:"hier"==f&&(e="h"+k,g=g.substring(0,255)))}g&&(c+="&"+e+"="+("pev"!=e.substring(0,3)?a.escape(g):g))}"pev3"==e&&a.e&&(c+=a.e)}return c};a.D=function(a){var b=a.tagName;if("undefined"!=
""+a.Rb||"undefined"!=""+a.Hb&&"HTML"!=(""+a.Hb).toUpperCase())return"";b=b&&b.toUpperCase?b.toUpperCase():"";"SHAPE"==b&&(b="");b&&(("INPUT"==b||"BUTTON"==b)&&a.type&&a.type.toUpperCase?b=a.type.toUpperCase():!b&&a.href&&(b="A"));return b};a.Ha=function(a){var b=h.location,d=a.href?a.href:"",f,e,g;f=d.indexOf(":");e=d.indexOf("?");g=d.indexOf("/");d&&(0>f||0<=e&&f>e||0<=g&&f>g)&&(e=a.protocol&&1<a.protocol.length?a.protocol:b.protocol?b.protocol:"",f=b.pathname.lastIndexOf("/"),d=(e?e+"//":"")+(a.host?
a.host:b.host?b.host:"")+("/"!=d.substring(0,1)?b.pathname.substring(0,0>f?0:f)+"/":"")+d);return d};a.L=function(c){var b=a.D(c),d,f,e="",g=0;return b&&(d=c.protocol,f=c.onclick,!c.href||"A"!=b&&"AREA"!=b||f&&d&&!(0>d.toLowerCase().indexOf("javascript"))?f?(e=a.replace(a.replace(a.replace(a.replace(""+f,"\r",""),"\n",""),"\t","")," ",""),g=2):"INPUT"==b||"SUBMIT"==b?(c.value?e=c.value:c.innerText?e=c.innerText:c.textContent&&(e=c.textContent),g=3):"IMAGE"==b&&c.src&&(e=c.src):e=a.Ha(c),e)?{id:e.substring(0,
100),type:g}:0};a.Pb=function(c){for(var b=a.D(c),d=a.L(c);c&&!d&&"BODY"!=b;)if(c=c.parentElement?c.parentElement:c.parentNode)b=a.D(c),d=a.L(c);d&&"BODY"!=b||(c=0);c&&(b=c.onclick?""+c.onclick:"",0<=b.indexOf(".tl(")||0<=b.indexOf(".trackLink("))&&(c=0);return c};a.Gb=function(){var c,b,d=a.linkObject,f=a.linkType,e=a.linkURL,g,k;a.oa=1;d||(a.oa=0,d=a.clickObject);if(d){c=a.D(d);for(b=a.L(d);d&&!b&&"BODY"!=c;)if(d=d.parentElement?d.parentElement:d.parentNode)c=a.D(d),b=a.L(d);b&&"BODY"!=c||(d=0);
if(d&&!a.linkObject){var m=d.onclick?""+d.onclick:"";if(0<=m.indexOf(".tl(")||0<=m.indexOf(".trackLink("))d=0}}else a.oa=1;!e&&d&&(e=a.Ha(d));e&&!a.linkLeaveQueryString&&(g=e.indexOf("?"),0<=g&&(e=e.substring(0,g)));if(!f&&e){var l=0,p=0,n;if(a.trackDownloadLinks&&a.linkDownloadFileTypes)for(m=e.toLowerCase(),g=m.indexOf("?"),k=m.indexOf("#"),0<=g?0<=k&&k<g&&(g=k):g=k,0<=g&&(m=m.substring(0,g)),g=a.linkDownloadFileTypes.toLowerCase().split(","),k=0;k<g.length;k++)(n=g[k])&&m.substring(m.length-(n.length+
1))=="."+n&&(f="d");if(a.trackExternalLinks&&!f&&(m=e.toLowerCase(),a.Ka(m)&&(a.linkInternalFilters||(a.linkInternalFilters=h.location.hostname),g=0,a.linkExternalFilters?(g=a.linkExternalFilters.toLowerCase().split(","),l=1):a.linkInternalFilters&&(g=a.linkInternalFilters.toLowerCase().split(",")),g))){for(k=0;k<g.length;k++)n=g[k],0<=m.indexOf(n)&&(p=1);p?l&&(f="e"):l||(f="e")}}a.linkObject=d;a.linkURL=e;a.linkType=f;if(a.trackClickMap||a.trackInlineStats)a.e="",d&&(f=a.pageName,e=1,d=d.sourceIndex,
f||(f=a.pageURL,e=0),h.s_objectID&&(b.id=h.s_objectID,d=b.type=1),f&&b&&b.id&&c&&(a.e="&pid="+a.escape(f.substring(0,255))+(e?"&pidt="+e:"")+"&oid="+a.escape(b.id.substring(0,100))+(b.type?"&oidt="+b.type:"")+"&ot="+c+(d?"&oi="+d:"")))};a.zb=function(){var c=a.oa,b=a.linkType,d=a.linkURL,f=a.linkName;b&&(d||f)&&(b=b.toLowerCase(),"d"!=b&&"e"!=b&&(b="o"),a.pe="lnk_"+b,a.pev1=d?a.escape(d):"",a.pev2=f?a.escape(f):"",c=1);a.abort&&(c=0);if(a.trackClickMap||a.trackInlineStats||a.ActivityMap){var b={},
d=0,e=a.cookieRead("s_sq"),g=e?e.split("&"):0,k,m,h,e=0;if(g)for(k=0;k<g.length;k++)m=g[k].split("="),f=a.unescape(m[0]).split(","),m=a.unescape(m[1]),b[m]=f;f=a.account.split(",");k={};for(h in a.contextData)h&&!Object.prototype[h]&&"a.activitymap."==h.substring(0,14)&&(k[h]=a.contextData[h],a.contextData[h]="");a.e=a.r("c",k)+(a.e?a.e:"");if(c||a.e){c&&!a.e&&(e=1);for(m in b)if(!Object.prototype[m])for(h=0;h<f.length;h++)for(e&&(g=b[m].join(","),g==a.account&&(a.e+=("&"!=m.charAt(0)?"&":"")+m,b[m]=
[],d=1)),k=0;k<b[m].length;k++)g=b[m][k],g==f[h]&&(e&&(a.e+="&u="+a.escape(g)+("&"!=m.charAt(0)?"&":"")+m+"&u=0"),b[m].splice(k,1),d=1);c||(d=1);if(d){e="";k=2;!c&&a.e&&(e=a.escape(f.join(","))+"="+a.escape(a.e),k=1);for(m in b)!Object.prototype[m]&&0<k&&0<b[m].length&&(e+=(e?"&":"")+a.escape(b[m].join(","))+"="+a.escape(m),k--);a.cookieWrite("s_sq",e)}}}return c};a.Ab=function(){if(!a.Kb){var c=new Date,b=p.location,d,f,e=f=d="",g="",k="",h="1.2",l=a.cookieWrite("s_cc","true",0)?"Y":"N",n="",q="";
if(c.setUTCDate&&(h="1.3",(0).toPrecision&&(h="1.5",c=[],c.forEach))){h="1.6";f=0;d={};try{f=new Iterator(d),f.next&&(h="1.7",c.reduce&&(h="1.8",h.trim&&(h="1.8.1",Date.parse&&(h="1.8.2",Object.create&&(h="1.8.5")))))}catch(r){}}d=screen.width+"x"+screen.height;e=navigator.javaEnabled()?"Y":"N";f=screen.pixelDepth?screen.pixelDepth:screen.colorDepth;g=a.w.innerWidth?a.w.innerWidth:a.d.documentElement.offsetWidth;k=a.w.innerHeight?a.w.innerHeight:a.d.documentElement.offsetHeight;try{a.b.addBehavior("#default#homePage"),
n=a.b.Qb(b)?"Y":"N"}catch(s){}try{a.b.addBehavior("#default#clientCaps"),q=a.b.connectionType}catch(u){}a.resolution=d;a.colorDepth=f;a.javascriptVersion=h;a.javaEnabled=e;a.cookiesEnabled=l;a.browserWidth=g;a.browserHeight=k;a.connectionType=q;a.homepage=n;a.Kb=1}};a.Q={};a.loadModule=function(c,b){var d=a.Q[c];if(!d){d=h["AppMeasurement_Module_"+c]?new h["AppMeasurement_Module_"+c](a):{};a.Q[c]=a[c]=d;d.cb=function(){return d.hb};d.ib=function(b){if(d.hb=b)a[c+"_onLoad"]=b,a.ia(c+"_onLoad",[a,d],
1)||b(a,d)};try{Object.defineProperty?Object.defineProperty(d,"onLoad",{get:d.cb,set:d.ib}):d._olc=1}catch(f){d._olc=1}}b&&(a[c+"_onLoad"]=b,a.ia(c+"_onLoad",[a,d],1)||b(a,d))};a.p=function(c){var b,d;for(b in a.Q)if(!Object.prototype[b]&&(d=a.Q[b])&&(d._olc&&d.onLoad&&(d._olc=0,d.onLoad(a,d)),d[c]&&d[c]()))return 1;return 0};a.Cb=function(){var c=Math.floor(1E13*Math.random()),b=a.visitorSampling,d=a.visitorSamplingGroup,d="s_vsn_"+(a.visitorNamespace?a.visitorNamespace:a.account)+(d?"_"+d:""),f=
a.cookieRead(d);if(b){b*=100;f&&(f=parseInt(f));if(!f){if(!a.cookieWrite(d,c))return 0;f=c}if(f%1E4>b)return 0}return 1};a.R=function(c,b){var d,f,e,g,k,h;for(d=0;2>d;d++)for(f=0<d?a.Aa:a.g,e=0;e<f.length;e++)if(g=f[e],(k=c[g])||c["!"+g]){if(!b&&("contextData"==g||"retrieveLightData"==g)&&a[g])for(h in a[g])k[h]||(k[h]=a[g][h]);a[g]=k}};a.Ua=function(c,b){var d,f,e,g;for(d=0;2>d;d++)for(f=0<d?a.Aa:a.g,e=0;e<f.length;e++)g=f[e],c[g]=a[g],b||c[g]||(c["!"+g]=1)};a.ub=function(a){var b,d,f,e,g,k=0,h,
l="",n="";if(a&&255<a.length&&(b=""+a,d=b.indexOf("?"),0<d&&(h=b.substring(d+1),b=b.substring(0,d),e=b.toLowerCase(),f=0,"http://"==e.substring(0,7)?f+=7:"https://"==e.substring(0,8)&&(f+=8),d=e.indexOf("/",f),0<d&&(e=e.substring(f,d),g=b.substring(d),b=b.substring(0,d),0<=e.indexOf("google")?k=",q,ie,start,search_key,word,kw,cd,":0<=e.indexOf("yahoo.co")&&(k=",p,ei,"),k&&h)))){if((a=h.split("&"))&&1<a.length){for(f=0;f<a.length;f++)e=a[f],d=e.indexOf("="),0<d&&0<=k.indexOf(","+e.substring(0,d)+",")?
l+=(l?"&":"")+e:n+=(n?"&":"")+e;l&&n?h=l+"&"+n:n=""}d=253-(h.length-n.length)-b.length;a=b+(0<d?g.substring(0,d):"")+"?"+h}return a};a.$a=function(c){var b=a.d.visibilityState,d=["webkitvisibilitychange","visibilitychange"];b||(b=a.d.webkitVisibilityState);if(b&&"prerender"==b){if(c)for(b=0;b<d.length;b++)a.d.addEventListener(d[b],function(){var b=a.d.visibilityState;b||(b=a.d.webkitVisibilityState);"visible"==b&&c()});return!1}return!0};a.ea=!1;a.I=!1;a.kb=function(){a.I=!0;a.j()};a.ca=!1;a.V=!1;
a.gb=function(c){a.marketingCloudVisitorID=c;a.V=!0;a.j()};a.fa=!1;a.W=!1;a.lb=function(c){a.visitorOptedOut=c;a.W=!0;a.j()};a.Z=!1;a.S=!1;a.Wa=function(c){a.analyticsVisitorID=c;a.S=!0;a.j()};a.ba=!1;a.U=!1;a.Ya=function(c){a.audienceManagerLocationHint=c;a.U=!0;a.j()};a.aa=!1;a.T=!1;a.Xa=function(c){a.audienceManagerBlob=c;a.T=!0;a.j()};a.Za=function(c){a.maxDelay||(a.maxDelay=250);return a.p("_d")?(c&&setTimeout(function(){c()},a.maxDelay),!1):!0};a.da=!1;a.H=!1;a.xa=function(){a.H=!0;a.j()};a.isReadyToTrack=
function(){var c=!0,b=a.visitor,d,f,e;a.ea||a.I||(a.$a(a.kb)?a.I=!0:a.ea=!0);if(a.ea&&!a.I)return!1;b&&b.isAllowed()&&(a.ca||a.marketingCloudVisitorID||!b.getMarketingCloudVisitorID||(a.ca=!0,a.marketingCloudVisitorID=b.getMarketingCloudVisitorID([a,a.gb]),a.marketingCloudVisitorID&&(a.V=!0)),a.fa||a.visitorOptedOut||!b.isOptedOut||(a.fa=!0,a.visitorOptedOut=b.isOptedOut([a,a.lb]),a.visitorOptedOut!=n&&(a.W=!0)),a.Z||a.analyticsVisitorID||!b.getAnalyticsVisitorID||(a.Z=!0,a.analyticsVisitorID=b.getAnalyticsVisitorID([a,
a.Wa]),a.analyticsVisitorID&&(a.S=!0)),a.ba||a.audienceManagerLocationHint||!b.getAudienceManagerLocationHint||(a.ba=!0,a.audienceManagerLocationHint=b.getAudienceManagerLocationHint([a,a.Ya]),a.audienceManagerLocationHint&&(a.U=!0)),a.aa||a.audienceManagerBlob||!b.getAudienceManagerBlob||(a.aa=!0,a.audienceManagerBlob=b.getAudienceManagerBlob([a,a.Xa]),a.audienceManagerBlob&&(a.T=!0)),c=a.ca&&!a.V&&!a.marketingCloudVisitorID,b=a.Z&&!a.S&&!a.analyticsVisitorID,d=a.ba&&!a.U&&!a.audienceManagerLocationHint,
f=a.aa&&!a.T&&!a.audienceManagerBlob,e=a.fa&&!a.W,c=c||b||d||f||e?!1:!0);a.da||a.H||(a.Za(a.xa)?a.H=!0:a.da=!0);a.da&&!a.H&&(c=!1);return c};a.o=n;a.u=0;a.callbackWhenReadyToTrack=function(c,b,d){var f;f={};f.pb=c;f.ob=b;f.mb=d;a.o==n&&(a.o=[]);a.o.push(f);0==a.u&&(a.u=setInterval(a.j,100))};a.j=function(){var c;if(a.isReadyToTrack()&&(a.jb(),a.o!=n))for(;0<a.o.length;)c=a.o.shift(),c.ob.apply(c.pb,c.mb)};a.jb=function(){a.u&&(clearInterval(a.u),a.u=0)};a.eb=function(c){var b,d,f=n,e=n;if(!a.isReadyToTrack()){b=
[];if(c!=n)for(d in f={},c)f[d]=c[d];e={};a.Ua(e,!0);b.push(f);b.push(e);a.callbackWhenReadyToTrack(a,a.track,b);return!0}return!1};a.wb=function(){var c=a.cookieRead("s_fid"),b="",d="",f;f=8;var e=4;if(!c||0>c.indexOf("-")){for(c=0;16>c;c++)f=Math.floor(Math.random()*f),b+="0123456789ABCDEF".substring(f,f+1),f=Math.floor(Math.random()*e),d+="0123456789ABCDEF".substring(f,f+1),f=e=16;c=b+"-"+d}a.cookieWrite("s_fid",c,1)||(c=0);return c};a.t=a.track=function(c,b){var d,f=new Date,e="s"+Math.floor(f.getTime()/
108E5)%10+Math.floor(1E13*Math.random()),g=f.getYear(),g="t="+a.escape(f.getDate()+"/"+f.getMonth()+"/"+(1900>g?g+1900:g)+" "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds()+" "+f.getDay()+" "+f.getTimezoneOffset());a.visitor&&a.visitor.getAuthState&&(a.authState=a.visitor.getAuthState());a.p("_s");a.eb(c)||(b&&a.R(b),c&&(d={},a.Ua(d,0),a.R(c)),a.Cb()&&!a.visitorOptedOut&&(a.analyticsVisitorID||a.marketingCloudVisitorID||(a.fid=a.wb()),a.Gb(),a.usePlugins&&a.doPlugins&&a.doPlugins(a),a.account&&
(a.abort||(a.trackOffline&&!a.timestamp&&(a.timestamp=Math.floor(f.getTime()/1E3)),f=h.location,a.pageURL||(a.pageURL=f.href?f.href:f),a.referrer||a.Va||(f=a.Util.getQueryParam("adobe_mc_ref",null,null,!0),a.referrer=f||void 0===f?void 0===f?"":f:p.document.referrer),a.Va=1,a.referrer=a.ub(a.referrer),a.p("_g")),a.zb()&&!a.abort&&(a.visitor&&!a.supplementalDataID&&a.visitor.getSupplementalDataID&&(a.supplementalDataID=a.visitor.getSupplementalDataID("AppMeasurement:"+a._in,a.expectSupplementalData?
!1:!0)),a.Ab(),g+=a.yb(),a.Fb(e,g),a.p("_t"),a.referrer=""))),c&&a.R(d,1));a.abort=a.supplementalDataID=a.timestamp=a.pageURLRest=a.linkObject=a.clickObject=a.linkURL=a.linkName=a.linkType=h.s_objectID=a.pe=a.pev1=a.pev2=a.pev3=a.e=a.lightProfileID=0};a.za=[];a.registerPreTrackCallback=function(c){for(var b=[],d=1;d<arguments.length;d++)b.push(arguments[d]);"function"==typeof c?a.za.push([c,b]):a.debugTracking&&a.P("DEBUG: Non function type passed to registerPreTrackCallback")};a.bb=function(c){a.wa(a.za,
c)};a.ya=[];a.registerPostTrackCallback=function(c){for(var b=[],d=1;d<arguments.length;d++)b.push(arguments[d]);"function"==typeof c?a.ya.push([c,b]):a.debugTracking&&a.P("DEBUG: Non function type passed to registerPostTrackCallback")};a.ab=function(c){a.wa(a.ya,c)};a.wa=function(c,b){if("object"==typeof c)for(var d=0;d<c.length;d++){var f=c[d][0],e=c[d][1];e.unshift(b);if("function"==typeof f)try{f.apply(null,e)}catch(g){a.debugTracking&&a.P(g.message)}}};a.tl=a.trackLink=function(c,b,d,f,e){a.linkObject=
c;a.linkType=b;a.linkName=d;e&&(a.l=c,a.A=e);return a.track(f)};a.trackLight=function(c,b,d,f){a.lightProfileID=c;a.lightStoreForSeconds=b;a.lightIncrementBy=d;return a.track(f)};a.clearVars=function(){var c,b;for(c=0;c<a.g.length;c++)if(b=a.g[c],"prop"==b.substring(0,4)||"eVar"==b.substring(0,4)||"hier"==b.substring(0,4)||"list"==b.substring(0,4)||"channel"==b||"events"==b||"eventList"==b||"products"==b||"productList"==b||"purchaseID"==b||"transactionID"==b||"state"==b||"zip"==b||"campaign"==b)a[b]=
void 0};a.tagContainerMarker="";a.Fb=function(c,b){var d,f=a.trackingServer;d="";var e=a.dc,g="sc.",h=a.visitorNamespace;f?a.trackingServerSecure&&a.ssl&&(f=a.trackingServerSecure):(h||(h=a.account,f=h.indexOf(","),0<=f&&(h=h.substring(0,f)),h=h.replace(/[^A-Za-z0-9]/g,"")),d||(d="2o7.net"),e=e?(""+e).toLowerCase():"d1","2o7.net"==d&&("d1"==e?e="112":"d2"==e&&(e="122"),g=""),f=h+"."+e+"."+g+d);d=a.ssl?"https://":"http://";e=a.AudienceManagement&&a.AudienceManagement.isReady()||0!=a.usePostbacks;d+=
f+"/b/ss/"+a.account+"/"+(a.mobile?"5.":"")+(e?"10":"1")+"/JS-"+a.version+(a.Jb?"T":"")+(a.tagContainerMarker?"-"+a.tagContainerMarker:"")+"/"+c+"?AQB=1&ndh=1&pf=1&"+(e?"callback=s_c_il["+a._in+"].doPostbacks&et=1&":"")+b+"&AQE=1";a.bb(d);a.sb(d);a.ka()};a.Ta=/{(%?)(.*?)(%?)}/;a.Nb=RegExp(a.Ta.source,"g");a.tb=function(c){if("object"==typeof c.dests)for(var b=0;b<c.dests.length;++b){var d=c.dests[b];if("string"==typeof d.c&&"aa."==d.id.substr(0,3))for(var f=d.c.match(a.Nb),e=0;e<f.length;++e){var g=
f[e],h=g.match(a.Ta),l="";"%"==h[1]&&"timezone_offset"==h[2]?l=(new Date).getTimezoneOffset():"%"==h[1]&&"timestampz"==h[2]&&(l=a.xb());d.c=d.c.replace(g,a.escape(l))}}};a.xb=function(){var c=new Date,b=new Date(6E4*Math.abs(c.getTimezoneOffset()));return a.k(4,c.getFullYear())+"-"+a.k(2,c.getMonth()+1)+"-"+a.k(2,c.getDate())+"T"+a.k(2,c.getHours())+":"+a.k(2,c.getMinutes())+":"+a.k(2,c.getSeconds())+(0<c.getTimezoneOffset()?"-":"+")+a.k(2,b.getUTCHours())+":"+a.k(2,b.getUTCMinutes())};a.k=function(a,
b){return(Array(a+1).join(0)+b).slice(-a)};a.ta={};a.doPostbacks=function(c){if("object"==typeof c)if(a.tb(c),"object"==typeof a.AudienceManagement&&"function"==typeof a.AudienceManagement.isReady&&a.AudienceManagement.isReady()&&"function"==typeof a.AudienceManagement.passData)a.AudienceManagement.passData(c);else if("object"==typeof c&&"object"==typeof c.dests)for(var b=0;b<c.dests.length;++b){var d=c.dests[b];"object"==typeof d&&"string"==typeof d.c&&"string"==typeof d.id&&"aa."==d.id.substr(0,
3)&&(a.ta[d.id]=new Image,a.ta[d.id].alt="",a.ta[d.id].src=d.c)}};a.sb=function(c){a.i||a.Bb();a.i.push(c);a.ma=a.C();a.Ra()};a.Bb=function(){a.i=a.Db();a.i||(a.i=[])};a.Db=function(){var c,b;if(a.ra()){try{(b=h.localStorage.getItem(a.pa()))&&(c=h.JSON.parse(b))}catch(d){}return c}};a.ra=function(){var c=!0;a.trackOffline&&a.offlineFilename&&h.localStorage&&h.JSON||(c=!1);return c};a.Ia=function(){var c=0;a.i&&(c=a.i.length);a.q&&c++;return c};a.ka=function(){if(a.q&&(a.B&&a.B.complete&&a.B.F&&a.B.va(),
a.q))return;a.Ja=n;if(a.qa)a.ma>a.N&&a.Pa(a.i),a.ua(500);else{var c=a.nb();if(0<c)a.ua(c);else if(c=a.Fa())a.q=1,a.Eb(c),a.Ib(c)}};a.ua=function(c){a.Ja||(c||(c=0),a.Ja=setTimeout(a.ka,c))};a.nb=function(){var c;if(!a.trackOffline||0>=a.offlineThrottleDelay)return 0;c=a.C()-a.Oa;return a.offlineThrottleDelay<c?0:a.offlineThrottleDelay-c};a.Fa=function(){if(0<a.i.length)return a.i.shift()};a.Eb=function(c){if(a.debugTracking){var b="AppMeasurement Debug: "+c;c=c.split("&");var d;for(d=0;d<c.length;d++)b+=
"\n\t"+a.unescape(c[d]);a.P(b)}};a.fb=function(){return a.marketingCloudVisitorID||a.analyticsVisitorID};a.Y=!1;var q;try{q=JSON.parse('{"x":"y"}')}catch(u){q=null}q&&"y"==q.x?(a.Y=!0,a.X=function(a){return JSON.parse(a)}):h.$&&h.$.parseJSON?(a.X=function(a){return h.$.parseJSON(a)},a.Y=!0):a.X=function(){return null};a.Ib=function(c){var b,d,f;a.fb()&&2047<c.length&&("undefined"!=typeof XMLHttpRequest&&(b=new XMLHttpRequest,"withCredentials"in b?d=1:b=0),b||"undefined"==typeof XDomainRequest||(b=
new XDomainRequest,d=2),b&&(a.AudienceManagement&&a.AudienceManagement.isReady()||0!=a.usePostbacks)&&(a.Y?b.Ba=!0:b=0));!b&&a.Sa&&(c=c.substring(0,2047));!b&&a.d.createElement&&(0!=a.usePostbacks||a.AudienceManagement&&a.AudienceManagement.isReady())&&(b=a.d.createElement("SCRIPT"))&&"async"in b&&((f=(f=a.d.getElementsByTagName("HEAD"))&&f[0]?f[0]:a.d.body)?(b.type="text/javascript",b.setAttribute("async","async"),d=3):b=0);b||(b=new Image,b.alt="",b.abort||"undefined"===typeof h.InstallTrigger||
(b.abort=function(){b.src=n}));b.Da=function(){try{b.F&&(clearTimeout(b.F),b.F=0)}catch(a){}};b.onload=b.va=function(){a.ab(c);b.Da();a.rb();a.ga();a.q=0;a.ka();if(b.Ba){b.Ba=!1;try{a.doPostbacks(a.X(b.responseText))}catch(d){}}};b.onabort=b.onerror=b.Ga=function(){b.Da();(a.trackOffline||a.qa)&&a.q&&a.i.unshift(a.qb);a.q=0;a.ma>a.N&&a.Pa(a.i);a.ga();a.ua(500)};b.onreadystatechange=function(){4==b.readyState&&(200==b.status?b.va():b.Ga())};a.Oa=a.C();if(1==d||2==d){var e=c.indexOf("?");f=c.substring(0,
e);e=c.substring(e+1);e=e.replace(/&callback=[a-zA-Z0-9_.\[\]]+/,"");1==d?(b.open("POST",f,!0),b.send(e)):2==d&&(b.open("POST",f),b.send(e))}else if(b.src=c,3==d){if(a.Ma)try{f.removeChild(a.Ma)}catch(g){}f.firstChild?f.insertBefore(b,f.firstChild):f.appendChild(b);a.Ma=a.B}b.F=setTimeout(function(){b.F&&(b.complete?b.va():(a.trackOffline&&b.abort&&b.abort(),b.Ga()))},5E3);a.qb=c;a.B=h["s_i_"+a.replace(a.account,",","_")]=b;if(a.useForcedLinkTracking&&a.J||a.A)a.forcedLinkTrackingTimeout||(a.forcedLinkTrackingTimeout=
250),a.ha=setTimeout(a.ga,a.forcedLinkTrackingTimeout)};a.rb=function(){if(a.ra()&&!(a.Na>a.N))try{h.localStorage.removeItem(a.pa()),a.Na=a.C()}catch(c){}};a.Pa=function(c){if(a.ra()){a.Ra();try{h.localStorage.setItem(a.pa(),h.JSON.stringify(c)),a.N=a.C()}catch(b){}}};a.Ra=function(){if(a.trackOffline){if(!a.offlineLimit||0>=a.offlineLimit)a.offlineLimit=10;for(;a.i.length>a.offlineLimit;)a.Fa()}};a.forceOffline=function(){a.qa=!0};a.forceOnline=function(){a.qa=!1};a.pa=function(){return a.offlineFilename+
"-"+a.visitorNamespace+a.account};a.C=function(){return(new Date).getTime()};a.Ka=function(a){a=a.toLowerCase();return 0!=a.indexOf("#")&&0!=a.indexOf("about:")&&0!=a.indexOf("opera:")&&0!=a.indexOf("javascript:")?!0:!1};a.setTagContainer=function(c){var b,d,f;a.Jb=c;for(b=0;b<a._il.length;b++)if((d=a._il[b])&&"s_l"==d._c&&d.tagContainerName==c){a.R(d);if(d.lmq)for(b=0;b<d.lmq.length;b++)f=d.lmq[b],a.loadModule(f.n);if(d.ml)for(f in d.ml)if(a[f])for(b in c=a[f],f=d.ml[f],f)!Object.prototype[b]&&("function"!=
typeof f[b]||0>(""+f[b]).indexOf("s_c_il"))&&(c[b]=f[b]);if(d.mmq)for(b=0;b<d.mmq.length;b++)f=d.mmq[b],a[f.m]&&(c=a[f.m],c[f.f]&&"function"==typeof c[f.f]&&(f.a?c[f.f].apply(c,f.a):c[f.f].apply(c)));if(d.tq)for(b=0;b<d.tq.length;b++)a.track(d.tq[b]);d.s=a;break}};a.Util={urlEncode:a.escape,urlDecode:a.unescape,cookieRead:a.cookieRead,cookieWrite:a.cookieWrite,getQueryParam:function(c,b,d,f){var e,g="";b||(b=a.pageURL?a.pageURL:h.location);d=d?d:"&";if(!c||!b)return g;b=""+b;e=b.indexOf("?");if(0>
e)return g;b=d+b.substring(e+1)+d;if(!f||!(0<=b.indexOf(d+c+d)||0<=b.indexOf(d+c+"="+d))){e=b.indexOf(d+c+"=");if(0>e)return g;b=b.substring(e+d.length+c.length+1);e=b.indexOf(d);0<=e&&(b=b.substring(0,e));0<b.length&&(g=a.unescape(b));return g}}};a.G="supplementalDataID timestamp dynamicVariablePrefix visitorID marketingCloudVisitorID analyticsVisitorID audienceManagerLocationHint authState fid vmk visitorMigrationKey visitorMigrationServer visitorMigrationServerSecure charSet visitorNamespace cookieDomainPeriods fpCookieDomainPeriods cookieLifetime pageName pageURL customerPerspective referrer contextData currencyCode lightProfileID lightStoreForSeconds lightIncrementBy retrieveLightProfiles deleteLightProfiles retrieveLightData".split(" ");
a.g=a.G.concat("purchaseID variableProvider channel server pageType transactionID campaign state zip events events2 products audienceManagerBlob tnt".split(" "));a.na="timestamp charSet visitorNamespace cookieDomainPeriods cookieLifetime contextData lightProfileID lightStoreForSeconds lightIncrementBy".split(" ");a.O=a.na.slice(0);a.Aa="account allAccounts debugTracking visitor visitorOptedOut trackOffline offlineLimit offlineThrottleDelay offlineFilename usePlugins doPlugins configURL visitorSampling visitorSamplingGroup linkObject clickObject linkURL linkName linkType trackDownloadLinks trackExternalLinks trackClickMap trackInlineStats linkLeaveQueryString linkTrackVars linkTrackEvents linkDownloadFileTypes linkExternalFilters linkInternalFilters useForcedLinkTracking forcedLinkTrackingTimeout trackingServer trackingServerSecure ssl abort mobile dc lightTrackVars maxDelay expectSupplementalData usePostbacks registerPreTrackCallback registerPostTrackCallback AudienceManagement".split(" ");
for(l=0;250>=l;l++)76>l&&(a.g.push("prop"+l),a.O.push("prop"+l)),a.g.push("eVar"+l),a.O.push("eVar"+l),6>l&&a.g.push("hier"+l),4>l&&a.g.push("list"+l);l="pe pev1 pev2 pev3 latitude longitude resolution colorDepth javascriptVersion javaEnabled cookiesEnabled browserWidth browserHeight connectionType homepage pageURLRest marketingCloudOrgID".split(" ");a.g=a.g.concat(l);a.G=a.G.concat(l);a.ssl=0<=h.location.protocol.toLowerCase().indexOf("https");a.charSet="UTF-8";a.contextData={};a.offlineThrottleDelay=
0;a.offlineFilename="AppMeasurement.offline";a.Oa=0;a.ma=0;a.N=0;a.Na=0;a.linkDownloadFileTypes="exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";a.w=h;a.d=h.document;try{if(a.Sa=!1,navigator){var v=navigator.userAgent;if("Microsoft Internet Explorer"==navigator.appName||0<=v.indexOf("MSIE ")||0<=v.indexOf("Trident/")&&0<=v.indexOf("Windows NT 6"))a.Sa=!0}}catch(w){}a.ga=function(){a.ha&&(h.clearTimeout(a.ha),a.ha=n);a.l&&a.J&&a.l.dispatchEvent(a.J);a.A&&("function"==typeof a.A?a.A():
a.l&&a.l.href&&(a.d.location=a.l.href));a.l=a.J=a.A=0};a.Qa=function(){a.b=a.d.body;a.b?(a.v=function(c){var b,d,f,e,g;if(!(a.d&&a.d.getElementById("cppXYctnr")||c&&c["s_fe_"+a._in])){if(a.Ca)if(a.useForcedLinkTracking)a.b.removeEventListener("click",a.v,!1);else{a.b.removeEventListener("click",a.v,!0);a.Ca=a.useForcedLinkTracking=0;return}else a.useForcedLinkTracking=0;a.clickObject=c.srcElement?c.srcElement:c.target;try{if(!a.clickObject||a.M&&a.M==a.clickObject||!(a.clickObject.tagName||a.clickObject.parentElement||
a.clickObject.parentNode))a.clickObject=0;else{var k=a.M=a.clickObject;a.la&&(clearTimeout(a.la),a.la=0);a.la=setTimeout(function(){a.M==k&&(a.M=0)},1E4);f=a.Ia();a.track();if(f<a.Ia()&&a.useForcedLinkTracking&&c.target){for(e=c.target;e&&e!=a.b&&"A"!=e.tagName.toUpperCase()&&"AREA"!=e.tagName.toUpperCase();)e=e.parentNode;if(e&&(g=e.href,a.Ka(g)||(g=0),d=e.target,c.target.dispatchEvent&&g&&(!d||"_self"==d||"_top"==d||"_parent"==d||h.name&&d==h.name))){try{b=a.d.createEvent("MouseEvents")}catch(l){b=
new h.MouseEvent}if(b){try{b.initMouseEvent("click",c.bubbles,c.cancelable,c.view,c.detail,c.screenX,c.screenY,c.clientX,c.clientY,c.ctrlKey,c.altKey,c.shiftKey,c.metaKey,c.button,c.relatedTarget)}catch(n){b=0}b&&(b["s_fe_"+a._in]=b.s_fe=1,c.stopPropagation(),c.stopImmediatePropagation&&c.stopImmediatePropagation(),c.preventDefault(),a.l=c.target,a.J=b)}}}}}catch(p){a.clickObject=0}}},a.b&&a.b.attachEvent?a.b.attachEvent("onclick",a.v):a.b&&a.b.addEventListener&&(navigator&&(0<=navigator.userAgent.indexOf("WebKit")&&
a.d.createEvent||0<=navigator.userAgent.indexOf("Firefox/2")&&h.MouseEvent)&&(a.Ca=1,a.useForcedLinkTracking=1,a.b.addEventListener("click",a.v,!0)),a.b.addEventListener("click",a.v,!1))):setTimeout(a.Qa,30)};a.Qa();a.loadModule("ActivityMap")}
function s_gi(a){var h,n=window.s_c_il,p,l,r=a.split(","),s,q,u=0;if(n)for(p=0;!u&&p<n.length;){h=n[p];if("s_c"==h._c&&(h.account||h.oun))if(h.account&&h.account==a)u=1;else for(l=h.account?h.account:h.oun,l=h.allAccounts?h.allAccounts:l.split(","),s=0;s<r.length;s++)for(q=0;q<l.length;q++)r[s]==l[q]&&(u=1);p++}u||(h=new AppMeasurement);h.setAccount?h.setAccount(a):h.sa&&h.sa(a);return h}AppMeasurement.getInstance=s_gi;window.s_objectID||(window.s_objectID=0);
function s_pgicq(){var a=window,h=a.s_giq,n,p,l;if(h)for(n=0;n<h.length;n++)p=h[n],l=s_gi(p.oun),l.setAccount(p.un),l.setTagContainer(p.tagContainerName);a.s_giq=0}s_pgicq();