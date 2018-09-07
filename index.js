
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json()); // creates http server
const token = 'test'; // type here your verification token

app.get('/', (req, res) => {
    // check if verification token is correct
    if (req.query.token !== token) {
        return res.sendStatus(401);
    }

    // return challenge
    return res.end(req.query.challenge);
});

app.post('/', (req, res) => {
    // check if verification token is correct
    if (req.query.token !== token) {
        return res.sendStatus(401);
    }
  
    // print request body
    console.log(req.body);

	var body = req.body["result"];
	console.log(body["sessionParameters"]);
	var parameters = body["sessionParameters"];
	var interaction = body["interaction"];
	var interactionName = interaction["name"];

	var tools = require("./api.js");
	var value;

	var reseller = parameters["resellerNo"];
	var resellerString = reseller.toString();
	if (!resellerString.includes("-")) {
	resellerString = resellerString.slice(0, 2) + "-" + resellerString.slice(2);	
	}
	
	
	if (interactionName == "sku") {
	//var service = parameters["pna"];
	var sku = parameters["sku"];
	var skuString = sku.toString();
	var skuUpperCase = skuString.toUpperCase();
	
	//value = tools.pna(skuUpperCase, resellerString);

	//console.log(value);

	var prodDesciption;
	var stockInfo;

	var encoding = require("./encode.js");
	var encryptValue = encoding.encode('APPCHATBOT:@16Pc7T2ot');
	
var body = {  
   "servicerequest":{  
      "priceandstockrequest":{  
         
   
         "item":[  
            {  
               "ingrampartnumber": skuUpperCase
               
            }
         ],
         "includeallsystems":false
      },
      "requestpreamble":{  
         "customernumber": resellerString,
         "isocountrycode": "MX"
      }
   }
};

    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:

        var response = xhttp.responseText;
        console.log(response);

	var jsonResponse = JSON.parse(response);

	var serviceResponse = jsonResponse.serviceresponse;

	var responsepreamble = serviceResponse.responsepreamble;
	
	var priceandstockresponse = serviceResponse.priceandstockresponse;
	
	var details = priceandstockresponse.details;

	var prodDetails = details[0];

	
	if (responsepreamble.responsestatus == "SUCCESS"){
	console.log("success");
	var wareHouse = prodDetails.warehousedetails;

	var i;
	var qtyAvaliable = 0;
	for (i = 0; i < wareHouse.length; i++) { 
		var qty = wareHouse[i];
    		qtyAvaliable += qty["availablequantity"];
	}
	console.log(qtyAvaliable);	

	if (qtyAvaliable == 0) {
		stockInfo = "Out of Stock";
	}else{
		stockInfo = qtyAvaliable;
	}
	
	prodDesciption = prodDetails.partdescription1 + "\n" + "Price123: " +prodDetails.customerprice + "\n" + "Stock: "+ stockInfo;
	//return prodDesciption;
	} else {

	console.log("failure");
	var message = prodDetails.statusmessage;
	
	prodDesciption = message;
	//return prodDesciption;
	}

	// return a text response
    const data = {
        responses: [
            {
                type: 'text',
                elements: [prodDesciption]
            }
        ]
    };

    res.json(data);

    }
};

	
    xhttp.open("POST", "https://api.ingrammicro.com:443/multiskupriceandstockapi_v4", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Authorization', 'Basic ' +encryptValue); 
    xhttp.send(JSON.stringify(body));
	
} else if (interactionName == "SKU"){

	var sku = parameters["sku"];
	var skuString = sku.toString();
	var skuUpperCase = skuString.toUpperCase();
	
	//value = tools.pna(skuUpperCase, resellerString);

	//console.log(value);

	var prodDesciption;
	var stockInfo;

	var encoding = require("./encode.js");
	var encryptValue = encoding.encode('APPCHATBOT:@16Pc7T2ot');
	
var body = {  
   "servicerequest":{  
      "priceandstockrequest":{  
         
   
         "item":[  
            {  
               "ingrampartnumber": skuUpperCase
               
            }
         ],
         "includeallsystems":false
      },
      "requestpreamble":{  
         "customernumber": resellerString,
         "isocountrycode": "MX"
      }
   }
};

    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:

        var response = xhttp.responseText;
        console.log(response);

	var jsonResponse = JSON.parse(response);

	var serviceResponse = jsonResponse.serviceresponse;

	var responsepreamble = serviceResponse.responsepreamble;
	
	var priceandstockresponse = serviceResponse.priceandstockresponse;
	
	var details = priceandstockresponse.details;

	var prodDetails = details[0];



	
	if (responsepreamble.responsestatus == "SUCCESS"){
	console.log("success");
	var wareHouse = prodDetails.warehousedetails;

	var i;
	var qtyAvaliable = 0;
	for (i = 0; i < wareHouse.length; i++) { 
		var qty = wareHouse[i];
    		qtyAvaliable += qty["availablequantity"];
	}
	console.log(qtyAvaliable);	

	if (qtyAvaliable == 0) {
		stockInfo = "Out of Stock";
	}else{
		stockInfo = qtyAvaliable;
	}
	
	prodDesciption = prodDetails.partdescription1 + "\n" + "Price: " +prodDetails.customerprice + "\n" + "Stock: "+ stockInfo;
	//return prodDesciption;
	} else {

	console.log("failure");
	var message = prodDetails.statusmessage;
	
	prodDesciption = message;
	//return prodDesciption;
	}

	// return a text response
    const data = {
        responses: [
            {
                type: 'text',
                elements: [prodDesciption]
            }
        ]
    };

    res.json(data);

    }
};

	
    xhttp.open("POST", "https://api.ingrammicro.com:443/multiskupriceandstockapi_v4", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Authorization', 'Basic ' +encryptValue); 
    xhttp.send(JSON.stringify(body));

}else if (interactionName == "Order Number"){
// order status
      
	//var service = parameters["order"];
	var ordernumber = parameters["orderNo"];
	var ordernumberString = ordernumber.toString();
	if (!ordernumberString.includes("-")) {
		ordernumberString = ordernumberString.slice(0, 2) + "-" + ordernumberString.slice(2);	
	}
	
	console.log(ordernumberString)
	var ordernumberUpperCase = ordernumberString.toUpperCase();
       console.log(ordernumberUpperCase)
	
	//value = tools.pna(skuUpperCase, resellerString);

	//console.log(value);

	var prodDesciption;
	var stockInfo;

	var encoding = require("./encode.js");
	var encryptValue = encoding.encode('APPCHATBOT:@16Pc7T2ot');

	console.log(encryptValue);
	
var body = {  
   "servicerequest":{ 
        "requestpreamble":{ 
         "isocountrycode":"US", 
         "customernumber":resellerString
      }, 
      "ordersearchrequest":{ 
          "systemid":"A300", 
         "searchcriteria":{ 
            "ordernumber": ordernumberUpperCase 
         }, 
         "sortcriteria":[ 
            
            { 
               "orderby":"ordernumber", 
               "orderbydirection":"DESC" 
            } 
         ], 
         "pagenumber":"1" 
      } 
      
   } 
};

	console.log(body);
	console.log(resellerString);
	console.log(ordernumberUpperCase);

    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
	
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:

        var response = xhttp.responseText;
        console.log(response);

	var jsonResponse = JSON.parse(response);

	var serviceResponse = jsonResponse.serviceresponse;

	var responsepreamble = serviceResponse.responsepreamble;
	
	var ordersearchresponse = serviceResponse.ordersearchresponse;

	if (responsepreamble.responsestatus == "SUCCESS"){
	console.log("success");
	
	if (ordersearchresponse.numberoforderresults == 0){
		prodDesciption = "Cannot fetch order details.";
	} else {

	var details = ordersearchresponse.ordersummary;
	var prodDetails = details[0];
	var lineitems = prodDetails.lines;	
	console.log(lineitems);
	
	
	prodDesciption = "Order#: " +prodDetails.ordernumber + "\n" + "Price: " +prodDetails.currencycode+ " "  +prodDetails.ordertotalvalue  + "\n" + "Status: "+ prodDetails.orderstatus +  "\n" + "Date: "+prodDetails.entrytimestamp ;
	}
	//return prodDesciption;

	} else {
	var details = ordersearchresponse.ordersummary;
	var prodDetails = details[0];
	console.log("failure");
	var message = prodDetails.statusmessage;
	
	prodDesciption = message;
	//return prodDesciption;
	}

	// return a text response
    var data = {
        responses: [
            {
                type: 'text',
                elements: [prodDesciption]
			}
			
        ]
	};

	for(var i in lineitems){
		var details = "SKU: " + lineitems[i].partnumber + "\n" + "VPN: " + lineitems[i].manufacturerpartnumber +  "\n" + "Quantity: " + lineitems[i].requestedquantity;
		data.responses.push({
			type: "cards",
				filters: [],
				elements: [
					{
						title: lineitems[i].partdescription1,
						subtitle: details,
						buttons: [
							{
								type: "postback",
								title: "Lorem ipsum dolor sit.",
								value: "developer_message"
							}
						]
					}
					
				]
		});
	}

	
	// for(var i in lineitems){
	// 	data.responses.push({
	// 		type : 'card',
	// 		filters: [],
	// 		title : "[lineitems[i].partdescription1]",
	// 		subtitle: "qui dolorem ipsum quia dolor sit amet,",
	// 		imageUrl: "https://i.imgur.com/3yPwOLC.jpg",
	// 		                buttons: [
	// 		                    {
	// 		                        type: "postback",
	// 		                        title: "Lorem ipsum dolor sit.",
	// 		                        value: "developer_message"
	// 		                    }
	// 		                ]
				
	
	// 	});
	// }


	
	// data.responses.push({
	// 	type : 'text',
	// 	elements : [lineitems[0].ingrampartnumber]
	// });

    res.json(data);

    }
};
	
    xhttp.open("POST", "https://api.ingrammicro.com:443/vse/orders/v2/ordersearch", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Authorization', 'Basic ' +encryptValue); 
    xhttp.send(JSON.stringify(body));
		
} else if (interactionName == "RMA Number"){
	//RMA	
	console.log(resellerString);

					var rescn = resellerString.substr(3,6);
					var resbn = resellerString.substr(0,2);
					console.log(rescn);
					console.log(resbn);
					var rmanumber = parameters["rmaNo"];
					var rmanumberString = rmanumber.toString();
					var rmanumberUpperCase = rmanumberString.toUpperCase();
					var rmabn = rmanumberUpperCase.substr(0,2);
					var rmano = rmanumberUpperCase.substr(2,5);
					var rmadn = rmanumberUpperCase.substr(7,1);
					var rmasn = rmanumberUpperCase.substr(8,1);
					console.log(rmanumberString);
					console.log(rmanumberUpperCase);
					//var service = parameters["order"];
					//var ordernumber = parameters["orderNo"];
					//var ordernumberString = ordernumber.toString();
					//if (!ordernumberString.includes("-")) {
					//            ordernumberString = ordernumberString.slice(0, 2) + "-" + ordernumberString.slice(2);  
					//}
				   
					//console.log(ordernumberString)
					//var ordernumberUpperCase = ordernumberString.toUpperCase();
		//   console.log(ordernumberUpperCase)
				   
					//value = tools.pna(skuUpperCase, resellerString);
	 
					//console.log(value);
					var rmaDesciption;
					//var prodDesciption;
					//var stockInfo;
	 
					var encoding = require("./encode.js");
					var encryptValue = encoding.encode('APPCHATBOT:@16Pc7T2ot');
	 
					console.log(encryptValue);
				   
	var body = { 
	   "servicerequest":{
			"requestpreamble":{
			 "companycode":"CA",
			 "customernumber":rescn
		  },
		  "rmareviewrecieptrequest":{
									"customerbranch":resbn,
									"customernumber":rescn,
									"rmabranch":rmabn,
									"rmanumber":rmano,
									"distnumber":rmadn,
									"shipnumber":rmasn
		  }      
		}
	};
	 
					console.log(body);
					console.log(resellerString);
					console.log(rmanumberUpperCase);
	 
		var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
					var xhttp = new XMLHttpRequest();
	 
	xhttp.onreadystatechange = function() {
				   
		if (this.readyState == 4 && this.status == 200) {
		   // Typical action to be performed when the document is ready:
					//if (this.requeststatus == "SUCCESS") {
		var response = xhttp.responseText;
		console.log(response);
	 
					var jsonResponse = JSON.parse(response);
	 
					var serviceResponse = jsonResponse.serviceresponse;
	 
					var responsepreamble = serviceResponse.responsepreamble;
				   
					//var ordersearchresponse = serviceResponse.ordersearchresponse;
					var rmareceiptwebresponse = serviceResponse.rmareceiptwebresponse;
				   
					if (responsepreamble.requeststatus == "SUCCESS"){
					console.log("success");
					var rmastatus = rmareceiptwebresponse.rmastatus;
					var returnreason = rmareceiptwebresponse.returnreason;
					//if (ordersearchresponse.numberoforderresults == 0){
					//            prodDesciption = "Cannot fetch order details.";
					//} else {
	 
					//var details = ordersearchresponse.ordersummary;
					//var prodDetails = details[0]; 
					var reason;  
					switch(returnreason) {
						case "DF":
							reason = "Defective with original packaging";
							break;
						case "DM":
							reason = "Damages return";
							break;
						case "IN":
							reason = "Product Incomplete";
							break;
						case "OS":
							reason = "Overshipment";
							break;
						case "SB":
							reason = "Stock balance - Factory sealed";
							break;
						case "TE":
							reason = "Opened box return";
							break;
						case "WS":
							reason = "Wrong sales - Factory sealed";
							break;
						case "WW":
							reason = "Warehouse shipped wrong product";
							break;
						case "OB":
							reason = "Not defined";
							break;
						default:
							reason = "Not defined";
							break;	
					} 
				   
					rmaDesciption = "RMA#: " +rmareceiptwebresponse.rmanumber + "\n" + "Price: " +rmareceiptwebresponse.total + "\n" + "Return Reason: "+ reason +"\n"+ "Order Date: " +rmareceiptwebresponse.rmadate + "\n" + "Status: " +rmastatus+ "\n";
					
	 
					} else {
			
					console.log("failure");
				   
					rmaDesciption ="No RMA found";
					
					}
					
					const data ={
								responses: [
										{
										type: 'text',
										elements: [rmaDesciption]
										}
									]
								}
					var lineitems = rmareceiptwebresponse.lineinfo;
					console.log(lineitems);	
					
					var sku;
					var price;
					var invoice;
					var returnQty;
					var orderQty;
					
					for(var i in lineitems){

					if (lineitems[i].partnumber) {
						sku = lineitems[i].partnumber;
					} else {
						sku = "NA";
					}
					
					if (lineitems[i].rmaprice) {
						price = lineitems[i].rmaprice;
					} else {
						price = "NA";
					}

					if (lineitems[i].invoicenumber) {
						invoice = lineitems[i].invoicenumber;
					} else {
						invoice = "NA";
					}

					if (lineitems[i].returnquantity) {
						returnQty = lineitems[i].returnquantity;
					} else {
						returnQty = "NA";
					}

					if (lineitems[i].orderquantity) {
						orderQty = lineitems[i].orderquantity;
					} else {
						orderQty = "NA";
					}

					var titleLine = "SKU: " + sku + "\n" + "Price: " + price;

					var details = "Invoice Number: " + invoice +  "\n" + "Return Qty: " + returnQty + "\n" + "Order Qty: " + orderQty + "\n" + lineitems[i].productcondition;

					data.responses.push({
						type: "cards",
							filters: [],
							elements: [
								{
									title: titleLine,
									subtitle: details,
									buttons: [
										{
											type: "postback",
											title: "Lorem ipsum dolor sit.",
											value: "developer_message"
										}
									]
								}
							]
					});
					}
			
		res.json(data);
	 
		}
	};
				   
		xhttp.open("POST", "https://api.ingrammicro.com:443/api/rma/v1_1/rmareceipt", true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.setRequestHeader('Authorization', 'Basic ' +encryptValue);
		xhttp.send(JSON.stringify(body));
								   
	}
});
    



app.listen(8080, () => console.log('[BotEngine] Webhook is listening'));
