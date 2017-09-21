// Hide LE Window
lpTag.sheet = (function() {
  var style = document.createElement("style");
  style.appendChild(document.createTextNode(""));
  document.head.appendChild(style);
  return style.sheet;
})();

lpTag.addCSSRule = function(sheet, selector, rules, index) {
  if("insertRule" in sheet) {
      lpTag.sheet.insertRule(selector + "{" + rules + "}", index);
  }
  else if("addRule" in sheet) {
      lpTag.sheet.addRule(selector, rules, index);
  }
};

lpTag.addCSSRule(lpTag.sheet, ".lp_desktop", "visibility: hidden !important;", 0);

// Temporary SDE store
lpTag.sdes = lpTag.sdes||[];
lpTag.sdeStore = {
  'service' : {
    'type' : 'service',
    'service' : {}
  },
  'ctmrinfo' : {
    'type' : 'ctmrinfo',
    'info' : {}
  },
  'personal' : {
    'type' : 'personal',
    'personal' : {
      'age' : {},
      'contacts' : []
    }
  },
  'cart' : {
    'type' : 'cart',
    'products' : []
  },
  'prodView' : {
    'type' : 'prodView',
    'products' : []
  },
  'purchase' : {
    'type' : 'purchase',
    'cart' : {
      'products' : []
    }
  },
  'lead' : {
    'type' : 'lead',
    'lead' : {}
  },
  'error' : {
    'type' : 'error',
    'error' : {}
  }
};

lpTag.checkDiv = function(isVisible) {
  if(document.getElementById(isVisible)) {
    if (document.getElementById(isVisible).offsetWidth != 0 && document.getElementById(isVisible).offsetHeight != 0) {
      var innerHTML = document.getElementById(isVisible).innerHTML;
      var strippedHTML = innerHTML.replace(/\s/g, '');
      return strippedHTML !== '';
    } else {
      return false;
    }
  } else {
    return false;
  }
};

// set logged out section for logged out pages
if (lpTag.cookieMethods.readCookie("amexsessioncookie") === "") {
  setTimeout(function() {
    if (typeof lpTag.section === "string") {
      newSection = [lpTag.section, "logged out"];
    } else {
      newSection = lpTag.section;
      newSection.push("logged out");
    }

    lpTag.newPage(window.location.href, {
      section : newSection,
      sdes : [{
        'type': 'ctmrinfo',
        'info': {
          'ctype': 'logged out'
        }
      }]
    });
  }, 1000);
} else {
  // Add button div ONLY if logged in
  var lpButtonDiv = document.createElement('DIV');
  lpButtonDiv.id = "lpButtonDiv";
  lpButtonDiv.style.cssText = "position:fixed; bottom:20px; right:20px; z-index:10399;";
  document.body.appendChild(lpButtonDiv);
}

// PARSE CROSSCUT and SEND SDEs
lpMTagConfig.deferJSON = function(jsonToValidate) {
  var validatedJSON;
  if (typeof jsonToValidate == 'string') {
    if (typeof JSON !== 'undefined' && typeof JSON.parse !== 'undefined') {
      validatedJSON = JSON.parse(jsonToValidate);
    } else {
      validatedJSON = eval('(' + jsonToValidate + ')');
    }
  } else {
    validatedJSON = jsonToValidate;
  }

  var cstatusRouting = 'US-CEN-en-PropCharge';
  var cardDesc = validatedJSON.cardsInfoList[0].cardDesc || '';

  if (cardDesc.match(/Business Centurion|Centurion|Centurion Card Invited by Goldman Sachs/i)) {
    cstatusRouting = 'US-CEN-en-Centurion';
  } else if (cardDesc.match(/American Express Credit Card|Amex EveryDay Card|Amex EveryDay Preferred Card|Blue Cash|Blue Cash Everyday|Blue Cash for Business|Blue Cash Preferred(SM)|Blue for Business|Blue for Students|Blue from American Express|Blue Sky|Blue Sky Preferred|Business Cash Rebate Card|Business Management Account|Business Membership Rewards|Cash Rebate Card|Clear from American Express|FreedomPass Business Card|Gold Optima Card|Morgan Stanley Credit Card|NextStep(SM) Loans|One from American Express|Optima Credit Card|Optima Platinum Card|Optima Platinum Card|Plat Busn Premium Cash Reb|Plenti Credit Card|Plum Card|SimplyCash(SM) Business Card|SimplyCash|Business Card|SimplyCash Plus Card|Starwood Business Card|Starwood Preferred Guest|ZYNC Card|ZYNC Card|Working Captial Terms/)) {
    cstatusRouting = 'US-CEN-en-PropLending';
  } else if (cardDesc.match(/Business ExtrAA Card|Corporate Card|Corporate Gold Card|Corporate Meeting Card|Corporate Purchasing Account|Corporate Purchasing Card|Defined Expense Card (CPC)|Executive Corporate Card|Accenture Corporate Gold Card|Business Travel Account/)) {
    cstatusRouting = 'US-CEN-en-Corporate';
  } else if (cardDesc.match(/Ameriprise Gold Card|Fidelity Gold Card/)) {
    cstatusRouting = 'US-CEN-en-CoBrandCharge';
  } else if (cardDesc.match(/Costco Cash Rebate Card|Costco TrueEarnings Card|Delta Reserve|Delta Reserve Business|Delta SkyMiles|Gold Delta SkyMiles|Hilton HHonors Card|Hilton HHonors Surpass|Lowes Business Rewards Card|Mercedes-Benz Credit Card|Schwab Investor Card|Delta Gold Employee Card/)) {
    cstatusRouting = 'US-CEN-en-CoBrandLending';
  } else if (cardDesc.match(/Business Platinum Card|Corporate Platinum Card|Fidelity Platinum Card|Mercedes-Benz Platinum Card|Morgan Stanley Platinum Card|Platinum Busn Credit Card|Platinum Card|Platinum Delta SkyMiles|Schwab Platinum Card|The Business Platinum Card|The Platinum Credit Card/)) {
    cstatusRouting = 'US-CEN-en-Platinum';
  }

  function earlyTenureCheck() {
    var i = 0;
    var j = 0;
    var earlyTenure = false;
    var eligCard = true;
    while (typeof validatedJSON.cardsInfoList[i] !== "undefined" && typeof validatedJSON.cardsInfoList[i].accountTenure !== "undefined") {
      var startDate = validatedJSON.cardsInfoList[i].accountTenure;
      var startYear = startDate.substr(0,4);
      var startMonth = startDate.substr(4,2);
      var startDay = startDate.substr(6,2);
      var newStartDate = startMonth + "/" + startDay + "/" + startYear;
      var tenureUNIX = new Date(newStartDate).getTime();
      var nowUNIX = new Date().getTime();
      var deltaUNIX = nowUNIX - tenureUNIX;
      var deltaDays = Math.floor(deltaUNIX / 86400000);
      if  (deltaDays < 90) {
        earlyTenure = true;
        break;
      }
      i++;
    }
    while (typeof validatedJSON.cardsInfoList[j] !== "undefined" && typeof validatedJSON.cardsInfoList[j].cardType !== "undefined") {
      if (validatedJSON.cardsInfoList[j].cardType.match(/Business|Corporate/i) || validatedJSON.cardsInfoList[j].cardDesc.match(/Platinum/i)) {
        eligCard = false;
        break;
      }
      j++;
    }

    return earlyTenure && eligCard;
  }

  if (earlyTenureCheck()) {
    cstatusRouting = 'US-CEN-en-EarlyTenure';
  }
  
  function lastLoginCheck() {
    var i = 0;
    var j = 0;
    var lastLogin = false;
    var eligCard = true;
    if (typeof validatedJSON.demographics !== "undefined" && typeof validatedJSON.demographics.lastLogon !== "undefined") {
      var startDate = validatedJSON.demographics.lastLogon;
      var startYear = startDate.substr(0,4);
      var startMonth = startDate.substr(5,2);
      var startDay = startDate.substr(8,2);
      var newStartDate = startMonth + "/" + startDay + "/" + startYear;
      var tenureUNIX = new Date(newStartDate).getTime();
      var nowUNIX = new Date().getTime();
      var deltaUNIX = nowUNIX - tenureUNIX;
      var deltaDays = Math.floor(deltaUNIX / 86400000);
      if  (deltaDays >= 90) {
        lastLogin = true;
      }
      i++;
    }
    while (typeof validatedJSON.cardsInfoList[j] !== "undefined" && typeof validatedJSON.cardsInfoList[j].cardType !== "undefined") {
      if (validatedJSON.cardsInfoList[j].cardType.match(/Business|Corporate/i) || validatedJSON.cardsInfoList[j].cardDesc.match(/Platinum/i)) {
        eligCard = false;
        break;
      }
      j++;
    }

    return lastLogin && eligCard;
  }

  // Exclusion for abusive chatters, by cardKey xcut value
  var abusers = /358D0352036E8203BC50BE2F2318483DF70FD7C4|67CFD061D3DFEC3F8D5EB720C294DAD606E10DF7|250F2D9F08F727C4B8652D7A75D34839CA6BC184|0DD7CCC2FC2515364F7094A9A90A286C1266A217|529096145D7942BE82BE987D94EC33D738CDA985|E0A6CE21CA296232F115DC98E27A919C0DAF7E1B|F04DF2CDE8567559F928CBDB91A45CE4A9917D99|8E9C1A2CB1D7C5B7AC2C75592B5ECC07B41ACF20|12F8C4871748C7D886DDBDC9F1D201CE0710C551|B0DFF63DBF682CDEBD9C1B22920E60E9D5B3A710|F99B82BE6537766D659089C304A18C6EF3205D35/;
  if (typeof validatedJSON.cardsInfoList[0].cardKey !== 'undefined') {
    var checkCardKey = validatedJSON.cardsInfoList[0].cardKey;
    if (checkCardKey.match(abusers)) {
      cstatusRouting = 'abuser';
    }
  }
  
  lpTag.sdeStore.ctmrinfo.info.ctype = cstatusRouting;

  var firstTimeLogin = false;

  if (document.getElementById('oceLayer') && checkDiv('oceLayer')) {
    firstTimeLogin = true;
  }

  lpTag.sdeStore.ctmrinfo.info.role = firstTimeLogin;

  // SERVICE (was LEAD)

  // gkFlag > service - topic
  if (typeof validatedJSON.gkFlag !== "undefined") {
    lpTag.sdeStore.service.topic = validatedJSON.gkFlag;
  }

  // lastLogon > service - serviceId
  var lastLogon;
  if (typeof validatedJSON.demographics !== "undefined" && validatedJSON.demographics.lastLogon !== "undefined") {
    lpTag.sdeStore.service.serviceId = validatedJSON.demographics.lastLogon;
  }

  var eConsent = "";

  for (var n = 0; n < 5; n++) {
    if (typeof validatedJSON.cardsInfoList !== "undefined" &&
        typeof validatedJSON.cardsInfoList[n] !== "undefined" &&
        typeof validatedJSON.cardsInfoList[n].paperOff !== "undefined" &&
        typeof validatedJSON.cardsInfoList[n].paperOff.EStmt !== "undefined") {
      eConsent += eConsent =="" ? "eStatment" : ",eStatment";
      break;
    }
  }

  for (var m = 0; m < 5; m++) {
    if (typeof validatedJSON.cardsInfoList !== "undefined" &&
        typeof validatedJSON.cardsInfoList[m] !== "undefined" &&
        typeof validatedJSON.cardsInfoList[m].paperOff !== "undefined" &&
        typeof validatedJSON.cardsInfoList[m].paperOff.comm !== "undefined") {
      eConsent += eConsent =="" ? "eConsent" : ",eConsent";
      break;
    }
  }

  lpTag.sdeStore.ctmrinfo.info.imei = eConsent;
  lpTag.sdeStore.ctmrinfo.info.customerId = validatedJSON.bbPublic;
  lpTag.sdeStore.ctmrinfo.info.storeNumber = validatedJSON.cardsInfoList[0].homeCountryLocale;

  // Cycle through CardsInfoList array
  var counter = validatedJSON.cardsInfoList.length;
  for (var i = 0; i < counter; i++) {

    // determine GCA
    var GCACondition1 = typeof validatedJSON !== "undefined" && typeof validatedJSON.creditStatusCodes !== "undefined" && typeof validatedJSON.creditStatusCodes[0] !== "undefined" && validatedJSON.creditStatusCodes[0].match(/SkipTrace\_PastDue|WX\_SkipTrace|WC\_SkipTrace|ZI\_SK|CancelledDerog_Basic_withBal|NFC_ReferCrDept_Primary|NFC_ReferCrDept_XREF|NFC_ReferCrDept_NON-XREF|NFC_UntilPaid_Primary|NFC_UntilPaid_XREF|NFC_UntilPaid_NON_XREF|NFC_CustLvl_UntilPmtRcvd_Primary|NFC_CustLvl_UntilPmtRcvd_XREF|NFC_CustLvl_UntilPmtRcvd_NON-XREF|NFC_UntilPmtRcvd_Primary|NFC_UntilPmtRcvd_XREF|NFC_UntilPmtRcvd_NON-XREF|NFC_UntilCardProdCurr|NFC_UntilBalPaid|NFC_CancelledBy|SkipTrace_WebCollection/i) !== null;
    var GCACondition2 = typeof validatedJSON.creditStatusCodes === "undefined";
    var GCACondition3 = typeof validatedJSON.creditStatusCodes !== "undefined" && typeof validatedJSON.creditStatusCodes[0] !== "undefined" && validatedJSON.creditStatusCodes[0] === 'PastDue';
    var GCACondition4 = typeof validatedJSON.cardsInfoList !== "undefined" && typeof validatedJSON.cardsInfoList[i] !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData.creditStatusCodes !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData.creditStatusCodes[0] !== "undefined" && validatedJSON.cardsInfoList[i].finData.creditStatusCodes[0].match(/NFC\_UntilPaid\_Primary\_WebCollection|NFC\_CustLvl\_UntilPmtRcvd\_Primary\_WebCollection|NFC\_UntilPmtRcvd\_Primary\_WebCollection|WC\_PastDue|WX\_PastDue|WC\_NFC|WX\_NFC|ZI\_NFC|ZI\_PastDue|CancelledDerog\_Basic\_withBal|NFC\_ReferCrDept\_Primary|NFC\_ReferCrDept\_XREF|NFC\_ReferCrDept\_NON-XREF|NFC\_UntilPaid\_Primary|NFC\_UntilPaid\_XREF|NFC\_UntilPaid\_NON\_XREF|NFC\_CustLvl\_UntilPmtRcvd\_Primary|NFC\_CustLvl\_UntilPmtRcvd\_XREF|NFC\_CustLvl\_UntilPmtRcvd\_NON-XREF|NFC\_UntilPmtRcvd\_Primary|NFC\_UntilPmtRcvd\_XREF|NFC\_UntilPmtRcvd\_NON-XREF|NFC\_UntilCardProdCurr|NFC\_UntilBalPaid|NFC\_CancelledBy|SkipTrace\_WebCollection/i) !== null;
    var GCACondition5 = typeof validatedJSON.cardsInfoList !== "undefined" && typeof validatedJSON.cardsInfoList[i] !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData.creditStatusCodes !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData.creditStatusCodes[0] !== "undefined" && validatedJSON.cardsInfoList[i].finData.creditStatusCodes[0] === 'PastDue';
    var GCACondition6 = typeof validatedJSON.cardsInfoList !== "undefined" && typeof validatedJSON.cardsInfoList[i] !== "undefined" && typeof validatedJSON.cardsInfoList[i].cardStatus !== "undefined" && validatedJSON.cardsInfoList[i].cardStatus === 'Active';
    var GCACondition7 = typeof validatedJSON.cardsInfoList !== "undefined" && typeof validatedJSON.cardsInfoList[i] !== "undefined" && typeof validatedJSON.cardsInfoList[i].additionalCard !== "undefined" && validatedJSON.cardsInfoList[i].additionalCard === 'false';
    var GCACondition8 = typeof validatedJSON.cardsInfoList !== "undefined" && typeof validatedJSON.cardsInfoList[i] !== "undefined" && typeof validatedJSON.cardsInfoList[i].cardType !== "undefined" && validatedJSON.cardsInfoList[i].cardType.match(/Personal|Business/i) !== null;
    var GCACondition9 = typeof validatedJSON.creditStatusCodes !== "undefined" && typeof validatedJSON.creditStatusCodes[0] !== "undefined" && validatedJSON.creditStatusCodes[0].match(/SkipTrace\_PastDue|WX\_SkipTrace|WC\_SkipTrace|ZI\_SK|CancelledDerog\_Basic\_withBal|NFC\_ReferCrDept\_Primary|NFC\_ReferCrDept\_XREF|NFC\_ReferCrDept\_NON-XREF|NFC\_UntilPaid\_Primary|NFC\_UntilPaid\_XREF|NFC\_UntilPaid\_NON\_XREF|NFC\_CustLvl\_UntilPmtRcvd\_Primary|NFC\_CustLvl\_UntilPmtRcvd\_XREF|NFC\_CustLvl\_UntilPmtRcvd\_NON-XREF|NFC\_UntilPmtRcvd\_Primary|NFC\_UntilPmtRcvd\_XREF|NFC\_UntilPmtRcvd\_NON-XREF|NFC\_UntilCardProdCurr|NFC\_UntilBalPaid|NFC\_CancelledBy|SkipTrace\_WebCollection/i) !== null;
    var GCACondition10 = typeof validatedJSON.creditStatusCodes !== "undefined" && typeof validatedJSON.creditStatusCodes[0] !== "undefined" && validatedJSON.creditStatusCodes[0] === 'PastDue';
    var GCACondition11 = typeof validatedJSON.cardsInfoList !== "undefined" && typeof validatedJSON.cardsInfoList[i] !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData.creditStatusCodes !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData.creditStatusCodes[0] === 'undefined';
    var GCACondition12 = typeof validatedJSON.cardsInfoList !== "undefined" && typeof validatedJSON.cardsInfoList[i] !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData.creditStatusCodes !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData.creditStatusCodes[0] !== "undefined" && validatedJSON.cardsInfoList[i].finData.creditStatusCodes[0].match(/CancelledDerog\_Basic\_withBal|NFC\_ReferCrDept\_Primary|NFC\_ReferCrDept\_XREF|NFC\_ReferCrDept\_NON-XREF|NFC\_UntilPaid\_Primary|NFC\_UntilPaid\_XREF|NFC\_UntilPaid\_NON\_XREF|NFC\_CustLvl\_UntilPmtRcvd\_Primary|NFC\_CustLvl\_UntilPmtRcvd\_XREF|NFC\_CustLvl\_UntilPmtRcvd\_NON-XREF|NFC\_UntilPmtRcvd\_Primary|NFC\_UntilPmtRcvd\_XREF|NFC\_UntilPmtRcvd\_NON-XREF|NFC\_UntilCardProdCurr|NFC\_UntilBalPaid|NFC\_CancelledBy|SkipTrace\_WebCollection/i) !== null;
    var GCACondition13 = typeof validatedJSON.cardsInfoList !== "undefined" && typeof validatedJSON.cardsInfoList[i] !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData.creditStatusCodes !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData.creditStatusCodes[0] !== "undefined" && validatedJSON.cardsInfoList[i].finData.creditStatusCodes[0] == 'PastDue';
    var GCACondition14 = typeof validatedJSON.cardsInfoList !== "undefined" && typeof validatedJSON.cardsInfoList[i] !== "undefined" && typeof validatedJSON.cardsInfoList[i].cardStatus !== "undefined" && validatedJSON.cardsInfoList[i].cardStatus === 'Active';
    var GCACondition15 = typeof validatedJSON.cardsInfoList !== "undefined" && typeof validatedJSON.cardsInfoList[i] !== "undefined" && typeof validatedJSON.cardsInfoList[i].additionalCard !== "undefined" && validatedJSON.cardsInfoList[i].additionalCard === 'false';
    var GCACondition16 = typeof validatedJSON.cardsInfoList !== "undefined" && typeof validatedJSON.cardsInfoList[i] !== "undefined" && typeof validatedJSON.cardsInfoList[i].cardType !== "undefined" && validatedJSON.cardsInfoList[i].cardType.match(/Personal|Business/i) !== null;
    var GCACondition17 = typeof validatedJSON.cardsInfoList !== "undefined" && typeof validatedJSON.cardsInfoList[i] !== "undefined" && typeof validatedJSON.cardsInfoList[i].cardDesc !== "undefined" && validatedJSON.cardsInfoList[i].cardDesc.match(/NextStep/i) === null;
    var GCACondition18 = typeof validatedJSON.cardsInfoList !== "undefined" && typeof validatedJSON.cardsInfoList[i] !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData !== "undefined" &&  typeof validatedJSON.cardsInfoList[i].finData.creditStatusCodes !== "undefined" &&  typeof validatedJSON.cardsInfoList[i].finData.creditStatusCodes[0] !== "undefined" && validatedJSON.cardsInfoList[i].finData.creditStatusCodes[0].match(/Hardship_Enrolled/i) === null;
    var GCACondition19 = typeof validatedJSON.cardsInfoList !== "undefined" && typeof validatedJSON.cardsInfoList[i] !== "undefined" && typeof validatedJSON.cardsInfoList[i].cardDesc !== "undefined" && validatedJSON.cardsInfoList[i].cardDesc !== 'Business Loans';

    var GCAConditionSet1 = GCACondition1 || GCACondition2 || GCACondition3;
    var GCAConditionSet2 = GCACondition4 || GCACondition5;
    var GCAConditionSet3 = GCAConditionSet1 && GCAConditionSet2 && GCACondition6 && GCACondition7 && GCACondition8;
    var GCAConditionSet4 = GCACondition11 || GCACondition12 || GCACondition13;
    var GCAConditionSet5 = GCACondition10 && GCAConditionSet4 && GCACondition14 && GCACondition15 && GCACondition16 && GCACondition17 && GCACondition18 && GCACondition19;

    var GCAEligible = GCAConditionSet3 || GCACondition9 || GCAConditionSet5;
    
    if (GCAEligible) {
      lpTag.sdeStore.ctmrinfo.info.ctype = 'US-GCA-en-GCA';
      cstatusRouting = 'US-GCA-en-GCA';
    }

    // memberSince > Personal - year of birth
    if (typeof validatedJSON.demographics !== "undefined" && typeof validatedJSON.demographics.memberSince !== "undefined") {
      lpTag.sdeStore.personal.personal.age.year = validatedJSON.demographics.memberSince;
    }

    // FirstName > Personal - firstname
    if (typeof validatedJSON.cardsInfoList[i].firstName !== "undefined") {
      lpTag.sdeStore.personal.personal.firstname = validatedJSON.cardsInfoList[i].firstName;
    }

    // LastName > Personal - lastname
    if (typeof validatedJSON.cardsInfoList[i].lastName !== "undefined") {
      lpTag.sdeStore.personal.personal.lastname = validatedJSON.cardsInfoList[i].lastName;
    }

    // accountTenure > Personal - age
    if (typeof validatedJSON.cardsInfoList[i].accountTenure !== "undefined") {
      lpTag.sdeStore.personal.personal.age.age = validatedJSON.cardsInfoList[i].accountTenure;
    }

    // homeCountryLocale > Personal - company
    if (typeof validatedJSON.cardsInfoList[i].homeCountryLocale !== "undefined") {
      lpTag.sdeStore.personal.personal.company = validatedJSON.cardsInfoList[i].homeCountryLocale;
    }
    
    var contact = {};

    // mycaRegisteredDate > Personal - phone
    if (typeof validatedJSON.cardsInfoList[i].mycaRegisteredDate !== "undefined") {
      contact.phone = validatedJSON.cardsInfoList[i].mycaRegisteredDate;
    }

    // creditStatusCodes_0 > personal - email
    if (typeof validatedJSON.creditStatusCodes !== "undefined" && typeof validatedJSON.creditStatusCodes[i] !== "undefined") {
      contact.email = validatedJSON.creditStatusCodes[i];
    }
    
    lpTag.sdeStore.personal.personal.contacts.push(contact);

    var cartProduct = {};

    // embossedName > cart - product name
    if (typeof validatedJSON.cardsInfoList[i].embossedName !== "undefined") {
      cartProduct.name = validatedJSON.cardsInfoList[i].embossedName;
    }

    // acctNum > cart - category
    if (typeof validatedJSON.cardsInfoList[i].acctNum !== "undefined") {
      cartProduct.category = validatedJSON.cardsInfoList[i].acctNum;
    }

    // finData.outstdngBalance > cart - sku
    if (typeof validatedJSON.cardsInfoList[i].finData !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData.outstdngBalance !== "undefined") {
      cartProduct.sku = validatedJSON.cardsInfoList[i].finData.outstdngBalance;
    }

    // finData.paymentDueDate > cart - price
    if (typeof validatedJSON.cardsInfoList[i].finData !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData.paymentDueDate !== "undefined") {
      cartProduct.price = validatedJSON.cardsInfoList[i].finData.paymentDueDate;
    }

    lpTag.sdeStore.cart.products.push(cartProduct);

    var viewedProduct = {};

    // additionalCard > viewed product - product name
    if (typeof validatedJSON.cardsInfoList[i].additionalCard !== "undefined") {
      viewedProduct.name = validatedJSON.cardsInfoList[i].additionalCard;
    }

    // sortedIndex > viewed product - category
    if (typeof validatedJSON.cardsInfoList[i].sortedIndex !== "undefined") {
      viewedProduct.category = validatedJSON.cardsInfoList[i].sortedIndex;
    }

    // status > viewed product - SKU
    if (typeof validatedJSON.pageDetails  !== "undefined" && validatedJSON.pageDetails.status  !== "undefined") {
      viewedProduct.sku = validatedJSON.pageDetails.status ;
    }

    // pastDueAmt > viewed product - price
    if (typeof validatedJSON.cardsInfoList[i].finData !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData.pastDueAmt !== "undefined") {
      viewedProduct.price = validatedJSON.cardsInfoList[i].finData.pastDueAmt;
    }
  
    lpTag.sdeStore.prodView.products.push(viewedProduct);

    // currentBalance > cart - total
    if (typeof validatedJSON.cardsInfoList[i].finData !=="undefined" && typeof validatedJSON.cardsInfoList[i].finData.currentBalance !=="undefined") {
      lpTag.sdeStore.purchase.total = validatedJSON.cardsInfoList[i].finData.currentBalance;
    }

    // cardStatus > purchase - orderId
    if (typeof validatedJSON.cardsInfoList[i].cardStatus !== "undefined") {
      lpTag.sdeStore.purchase.orderId = validatedJSON.cardsInfoList[i].cardStatus;
    }

    var purchaseProduct = {};

    // cardDesc > purchase - product - name
    if (typeof validatedJSON.cardsInfoList[i].cardDesc !== "undefined") {
      purchaseProduct.name = validatedJSON.cardsInfoList[i].cardDesc;
    }

    // cardType > purchase - product - category
    if (typeof validatedJSON.cardsInfoList[i].cardType !== "undefined") {
      purchaseProduct.category = validatedJSON.cardsInfoList[i].cardType;
    }

    // defaultCard > purchase - product- sku
    if (typeof validatedJSON.defaultCard !== "undefined") {
      purchaseProduct.sku = validatedJSON.defaultCard;
    }

    // finData.minDueAmt > purchase - product - price
    if (typeof validatedJSON.cardsInfoList[i].finData !== "undefined" && typeof validatedJSON.cardsInfoList[i].finData.minDueAmt !== "undefined") {
      purchaseProduct.price = validatedJSON.cardsInfoList[i].finData.minDueAmt;
    }

    lpTag.sdeStore.purchase.cart.products.push({
      'product' : purchaseProduct,
      'quantity' : 1
    });

    // lyltyAcctDtls.tier > lead - topic
    if (typeof validatedJSON.cardsInfoList[i].lyltyAcctDtls !== "undefined" && typeof validatedJSON.cardsInfoList[i].lyltyAcctDtls.tier !== "undefined") {
      lpTag.sdeStore.lead.topic = validatedJSON.cardsInfoList[i].lyltyAcctDtls;
    }

    // loyaltyAcctNum > lead - value
    if (typeof validatedJSON.cardsInfoList[i].lyltyAcctDtls !== "undefined" && typeof validatedJSON.cardsInfoList[i].lyltyAcctDtls.loyaltyAcctNum !== "undefined") {
      lpTag.sdeStore.lead.value = validatedJSON.cardsInfoList[i].loyaltyAcctNum;
    }

    // availPts > lead - leadId
    if (typeof validatedJSON.cardsInfoList[i].lyltyAcctDtls !== "undefined" && typeof validatedJSON.cardsInfoList[i].lyltyAcctDtls.availPts !== "undefined") {
      lpTag.sdeStore.lead.leadId = validatedJSON.cardsInfoList[i].availPts;
    }

    // dataAvailability > error - code
    if (typeof validatedJSON.dataAvailability !== "undefined") {
      lpTag.sdeStore.error.error.code = validatedJSON.dataAvailability;
    } else {
      lpTag.sdeStore.error.error.code = 'false';
    }

    // cardKey > error - message
    if (typeof validatedJSON.cardsInfoList[i].cardKey !== "undefined") {
      lpTag.sdeStore.error.error.message = validatedJSON.cardsInfoList[i].cardKey;
    } else {
      lpTag.sdeStore.error.error.message = 'none';
    }

  }   // END CardsInfoList array

  // Setting Experience value for automation
  if (cstatusRouting.match(/gca/i)) {
    lpTag.exp_value = 'credit';
  } else if (cstatusRouting.match(/centurion/i)) {
    lpTag.exp_value = 'centurion';
  } else if (cstatusRouting.match(/earlytenure/i) && validatedJSON.cardsInfoList[0].cardType.match(/Personal/i)) {
    lpTag.exp_value = 'et_consumer';
  } else if (cstatusRouting.match(/earlytenure/i) && validatedJSON.cardsInfoList[0].cardType.match(/Personal/i)) {
    lpTag.exp_value = 'et_open';
  } else if (validatedJSON.cardsInfoList[0].acctNum.match(/\d{4}5/)) {
    lpTag.exp_value = 'control';
  } else {
    lpTag.exp_value = 'standard';
  }

  // Pass all the SDEs.
  lpTag.sdes.push(lpTag.sdeStore.service);
  lpTag.sdes.push(lpTag.sdeStore.ctmrinfo);
  lpTag.sdes.push(lpTag.sdeStore.personal);
  lpTag.sdes.push(lpTag.sdeStore.cart);
  lpTag.sdes.push(lpTag.sdeStore.prodView);
  lpTag.sdes.push(lpTag.sdeStore.purchase);
  lpTag.sdes.push(lpTag.sdeStore.lead);
  lpTag.sdes.push(lpTag.sdeStore.error);
  
  // Set new section values for invites
  var newSection = '';
  var newSDEs = [];
  for (var n in lpTag.sdeStore) {
    newSDEs.push(lpTag.sdeStore[n]);
  }

  if (cstatusRouting.match(/earlytenure/i)) {
    
    if (typeof lpTag.section === "string") {
      newSection = [lpTag.section, "new card"];
    } else {
      newSection = lpTag.section;
      newSection.push("new card");
    }
    
    lpTag.newPage(window.location.href, {
      section : newSection,
      sdes : newSDEs
    });
    
  }

  if (firstTimeLogin) {
    if (typeof lpTag.section === "string") {
      newSection = [lpTag.section, "first login"];
    } else {
      newSection = lpTag.section;
      newSection.push("first login");
    }
    
    lpTag.newPage(window.location.href, {
      section : newSection,
      sdes : newSDEs
    });
  }

  if (eConsent !== "") {
    if (typeof lpTag.section === "string") {
      newSection = [lpTag.section, "paperless targeting"];
    } else {
      newSection = lpTag.section;
      newSection.push("paperless targeting");
    }
    
    lpTag.newPage(window.location.href, {
      section : newSection,
      sdes : newSDEs
    });
  }

  if (typeof targetScore !== "undefined" && targetScore > 80) {
    if (typeof lpTag.section === "string") {
      newSection = [lpTag.section, "predictive targeting"];
    } else {
      newSection = lpTag.section;
      newSection.push("predictive targeting");
    }
    
    lpTag.newPage(window.location.href, {
      section : newSection,
      sdes : newSDEs
    });
  }
  
  if (!cstatusRouting.match(/platinum|gca|centurion/i) && lastLoginCheck()) {
    if (typeof lpTag.section === "string") {
      newSection = [lpTag.section, "last login"];
    } else {
      newSection = lpTag.section;
      newSection.push("last login");
    }
    
    lpTag.newPage(window.location.href, {
      section : newSection,
      sdes : newSDEs
    });
  }

};

// Look for and parse Cross Cut (only if logged in)
if (lpTag.cookieMethods.readCookie("amexsessioncookie") !== '') {
  if (typeof MycaAssist !== "undefined" && MycaAssist.isWidgetReady()) {
    lpMTagConfig.deferJSON(mycaAssistJSON.commonAppData);
  } else {

    // For NON-IE
    if (document.body.addEventListener) {
      document.body.addEventListener("jsonAvailable", function(){
        lpMTagConfig.deferJSON(mycaAssistJSON.commonAppData);
      }, true);
    // FOR IE
    } else if (document.body.attachEvent) {
      document.documentElement.jsonAvailable = 0;
      document.body.attachEvent("onpropertychange", function(){
        if (event.propertyName == "jsonAvailable") {
          lpMTagConfig.deferJSON(mycaAssistJSON.commonAppData);
        }
      });
    }
  }
}
// END JSON CROSS CUT

lpTag.engagementVisibility = 'visible';

lpTag.checkWindow = function() {
  if (lpTag.checkDiv('lpChatWizContainer')) {
    if (lpTag.engagementVisibility === 'visible') {
      lpTag.engagementVisibility = 'hidden';
      var engs = document.getElementsByClassName('LPMcontainer');
      for (var i = 0; i < engs.length; i++) {
        engs[i].style.visibility = 'hidden';
      }
    }
  } else {
     if (lpTag.engagementVisibility === 'hidden') {
      lpTag.engagementVisibility = 'visible';
      var engs = document.getElementsByClassName('LPMcontainer');
      for (var i = 0; i < engs.length; i++) {
        engs[i].style.visibility = 'visible';
      }
    }                                                                                                                                  }
}

lpTag.checkForWindow = function() {
  lpTag.checkWindow();
  setTimeout(lpTag.checkForWindow, 2000);
}

setTimeout(lpTag.checkForWindow, 2000);

lpTag.events.bind('LP_OFFERS', 'OFFER_DISPLAY', function() {
  var engs = document.getElementsByClassName('LPMcontainer');
  var i;
  if (lpTag.checkDiv('lpChatWizContainer')) {
    for (i = 0; i < engs.length; i++) {
      engs[i].style.visibility = 'hidden';
    }
  } else if (document.location.href.match(/help/i)) {
    for (i = 0; i < engs.length; i++) {
      engs[i].style.display = 'inherit';
      engs[i].style.width = '100%';
      if (engs[i].classList.match(/row/i) === null) {
        engs[i].classList += ' row';
      }
    }
  }
});