//Maxymiser changes
//US-2 emea - uk, it, fr, de japa - au, jp, sg canlac - mx, ca

var dom=".americanexpress.com";
var getfsrs = "";
var URLpath = document.location.pathname;
var acctsum_cntxtArray = ["/myca/acctmgmt/us/myaccountsummary.do","/myca/accountsummary/us/accounthome","/myca/intl/isummary/emea/summary.do","/myca/intl/acctsumm/emea/accountSummary.do","/myca/intl/isummary/japa/summary.do","/myca/intl/acctsumm/japa/accountSummary.do","/myca/intl/isummary/canlac/summary.do","/myca/intl/acctsumm/canlac/accountSummary.do","/dashboard"];

var estmt_cntxtArray = ["/myca/estmt/alt/us/list.do","/myca/estmt/us/list.do","/myca/intl/istatement/emea/statement.do", "/myca/intl/estatement/emea/statement.do","/myca/intl/istatement/japa/statement.do","/myca/intl/estatement/japa/statement.do","/myca/intl/istatement/japa/v1/statement.do","/myca/intl/estatement/canlac/statement.do"];

var profile_cntxtArray = ["/myca/accountprofile/us/view.do","/myca/intl/rc/emea/profiles/rchome.do","/myca/intl/rc/japa/profiles/rchome.do","/myca/intl/rc/canlac/profiles/rchome.do","/myca/intl/acctmaintain/japa/acctServ.do","/myca/intl/acctmaintain/emea/acctServ.do","/myca/intl/acctmaintain/canlac/acctServ.do","/account-management"];

var paymnt_cntxtArray = ["/myca/onlinepayment/us/v3/payment/inquiry.do","/myca/onlinepayment/us/paymentcenter.do","/myca/intl/paybill/emea/payBillPaymentAlt.do","/myca/intl/paybill/japa/paybill.do","/myca/intl/paybill/canlac/payBillPayment.do","/myca/onlinepayments/canlac/CA/payments.do","/myca/onlinepayments/japa/IN/payments.do","/myca/onlinepayments/japa/HK/payments.do"];//CA, IN, HK, AR

var myca_pagename = ["AH","estmt","profile","paymnt"];
try{
var cntxt_valid=acctsum_cntxtArray.indexOf(URLpath)>-1 || estmt_cntxtArray.indexOf(URLpath)>-1 || profile_cntxtArray.indexOf(URLpath)>-1 || paymnt_cntxtArray.indexOf(URLpath)>-1;

function readCookie(c_name)
 {
    if (document.cookie.length > 0)
    {
       var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1)
        {
            c_start = c_start + c_name.length + 1;
           var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
 }
 var fsrsCk = function(fsrcookie) { //Check for foresee cookie
  var b;
  if (document.cookie.length > 0) {
    b = document.cookie.indexOf(fsrcookie);
    if (b != -1) {
      return false;
    } else {
      return true;
    }
  }
	return true;
};
 var seccount=0;
 var getfsrsck = function(){
	 seccount++;//console.log("seccount "+seccount);
	 var fsrs_valid = fsrsCk("fsr.s=") !== true && readCookie("fsr.s").indexOf("Maxymiser")>-1;
	 if(seccount == 10){
		  clearInterval(getfsrs);
		  if(fsrs_valid){
			  max_val_update();
		  }else{
			  getfsrs = setInterval(getfsrsck, 500);
		  }
	 }else if(fsrs_valid){//console.log("passed");
		 clearInterval(getfsrs);
		  max_val_update();
	 }
 };
 function maxundefinedcheck(varname) {
  if (typeof varname != "undefined" && varname !== null && varname !== "") {
    return true;
  } else {
    return false;
  }

}
 function max_val_update(){
	var fsrscookie = readCookie("fsr.s");
	if(fsrscookie !== ""){
	var fsrjson =JSON.parse(fsrscookie);
	//console.log(fsrjson);
	var fsrckmaxvalue="";
	if(maxundefinedcheck(fsrjson.cp) && maxundefinedcheck(fsrjson.cp.Maxymiser)){
		fsrckmaxvalue=fsrjson.cp.Maxymiser.valueOf().split("#");
	}
	//console.log("started");
	function maxymiser_val(){
        var max_val = "None";
		if(typeof(omn)!=="undefined" && typeof(omn.abtest) !=="undefined" && omn.abtest !== null && omn.abtest !==""){
			max_val=omn.abtest;
			}else if(typeof(max_Test_Recipe) !=="undefined" && max_Test_Recipe!==null && max_Test_Recipe!==""){
				max_val=max_Test_Recipe;
				} else{max_val="Var undefined";}
		function updtemaxval(cntxtpath,maxval){
			fsrscookie = readCookie("fsr.s");
			fsrjson =JSON.parse(fsrscookie);
			if(maxundefinedcheck(fsrjson.cp.Maxymiser)){
				fsrckmaxvalue=fsrjson.cp.Maxymiser.valueOf().split("#");
			}
			switch (myca_pagename.indexOf(cntxtpath)) {
				case 0:fsrckmaxvalue[0]=maxval;
				break;
				case 1:fsrckmaxvalue[1]=maxval;
				break;
				case 2:fsrckmaxvalue[2]=maxval;
				break;
				case 3:fsrckmaxvalue[3]=maxval;
				break;
			}
			maxval = fsrckmaxvalue.join("#");
			return maxval;
		}
		function fsrsckupdate(maxval){//console.log("updated");
			fsrjson.cp.Maxymiser=maxval;
			//console.log("before creation "+readCookie("fsr.s"));
            document.cookie="fsr.s="+JSON.stringify(fsrjson)+";domain="+dom+";path=/"; 
			//console.log("after creation "+readCookie("fsr.s"));
		}
		if(acctsum_cntxtArray.indexOf(URLpath)>-1){
			var actmaxval = updtemaxval("AH",max_val);
			fsrsckupdate(actmaxval);
		}else if(estmt_cntxtArray.indexOf(URLpath)>-1){
			var estmaxval = updtemaxval("estmt",max_val);
			fsrsckupdate(estmaxval);
		}else if(profile_cntxtArray.indexOf(URLpath)>-1){
			var ppmaxval = updtemaxval("profile",max_val);
			fsrsckupdate(ppmaxval);
		}else if(paymnt_cntxtArray.indexOf(URLpath)>-1){
			var pmntmaxval = updtemaxval("paymnt",max_val);
			fsrsckupdate(pmntmaxval);
		} 
	}
	if(maxundefinedcheck(fsrjson.cp) && maxundefinedcheck(fsrjson.cp.Maxymiser) && fsrjson.cp.Maxymiser.indexOf("#") == -1){
		fsrjson.cp.Maxymiser = "N#N#N#N";
		maxymiser_val();
	}else if(fsrckmaxvalue.length !== 0 && fsrckmaxvalue.indexOf("N") > -1){
		maxymiser_val();
	}
 }
	
}
if(cntxt_valid){
    getfsrs = setInterval(getfsrsck, 500);
}
}catch(err){
	console.log(err);
}
//End