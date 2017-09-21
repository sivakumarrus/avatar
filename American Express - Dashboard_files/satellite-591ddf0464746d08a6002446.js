//console.log("dcr page analytics fired ... ");
/* Business unit specific logic */
if(_satellite.getVar("Business Unit")=="amexpressser")   
  _satellite.track("myca code"); 
else if(_satellite.getVar("Business Unit")=="amexpressmrent")
  _satellite.track("mr code");
else
	_satellite.track("default page code");
