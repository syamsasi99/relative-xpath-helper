/**
 * @author syamsasi99@gmail.com
 */

'use strict';

var debug=false;
var interv = 3000;
var selectElement1, origColor1, selectElement2, origColor2;
var temp;
var xpath1, xpath2;
var firstClick = false;
var secondClick = false;
var node1, node2;
var firingElement1 = null;
var firingElement2 = null;
var attr = null;
var normal = true;
var customxpathelementlist=[];
var customxpathelementoriginalbglist=[];


function printConsole(msg){
	if(debug==true){
	console.log(msg);
	}
}

function removeParenthesis(xpath) {

	var charArr = xpath.split('');

	var count = charArr.length;
	var indexArray = [];

	while (charArr[count - 2] != '[') {

		indexArray.push(charArr[count - 2]);
		count--;
	}

	indexArray.reverse();
	var finalStr = '';
	for (var i = 0; i < indexArray.length; i++) {

		finalStr = finalStr + indexArray[i];
	}

	var secndpart = "[" + finalStr + "]";
	var pre = xpath.split(secndpart);
	var firstpart = pre[0];

	firstpart = firstpart.substring(1, firstpart.length - 1)

	var newxpath = firstpart + secndpart;

	return firstpart;
}

function findRelXPath(element1, element2, xpath1, xpath2) {

printConsole("In findRelXPath")


try{
	var par1 = element1.parentNode;
	var par2 = element2.parentNode;
	var rel_xpath = '';

	var parentFlag = 0, parentCount = 1;
	var childFlag = 0, childCount = 1;

	printConsole("xpath1="+xpath1);

	if (xpath1 != undefined && xpath1.charAt(0) == '(') {
		xpath1 = removeParenthesis(xpath1);
	}


	printConsole("xpath1 after removing parenthesis="+xpath1);
	printConsole("xpath2="+xpath2);

   //both are same

	if(element1.isSameNode(element2)){
		printConsole("Both elements are same");

		rel_xpath=xpath1+"/self::"+element1.tagName;
		updateRelativeXPath(rel_xpath);

		return;
	}

	// both has same parent
	if (par1.isSameNode(par2)) {
		printConsole("Parent of the elements are same");

		var next = element1.nextElementSibling;
		var previous = element1.previousElementSibling;

		if ((next != null) && (next.isSameNode(element2))) {

			printConsole("Element 2 is just after Element 1");
			rel_xpath = xpath2 + "/preceding-sibling::*";

		} else if ((previous != null) && (previous.isSameNode(element2))) {
			printConsole("Element 1 is just after Element 2");
			rel_xpath = xpath2 + "/following-sibling::*";

		}

		else{

			rel_xpath=xpath2+"/.."+xpath1;
			var rel_count = getXpathCount(rel_xpath);

			if(rel_count>1){

				rel_xpath= findXpathWithIndex(rel_xpath,element1);

			}
		}

		updateRelativeXPath(rel_xpath);

		return;

	}// if both has same parent

	// check for Element 1 is one of the parent of element2

	var temp = element2.parentNode;

	while (temp != null || temp != undefined) {

		if (temp.isSameNode(element1)) {
			parentFlag = 1;
			break;
		} else {
			parentCount++;
			temp = temp.parentNode;
		}
	}

	// check for Element 2 is one of the parent of element1

	var tagArray = [];
	var temp = element1.parentNode;
	tagArray.push(element1.tagName);

	while (temp != null || temp != undefined) {

		if (temp.isSameNode(element2)) {
			childFlag = 1;
			break;
		} else {
			tagArray.push(temp.tagName);
			childCount++;
			temp = temp.parentNode;

		}

	}

	// Element 1 is one of the parent of element2

	if (parentFlag == 1) {

		// appendlevels
		printConsole("Element 1 is one of the parent of element2");

		var lv = '';
		for (var x = 0; x < parentCount; x++) {
			lv = lv + "/..";
		}
		rel_xpath = xpath2 + lv;
		var rel_count = getXpathCount(rel_xpath);

		if (rel_count > 1) {

			rel_xpath = findXpathWithIndex(rel_xpath, element1);

		}
		updateRelativeXPath(rel_xpath);
		return;

	}

	// Element 2 is the parent of element1

	if (childFlag == 1) {

		printConsole("Element 2 is one of the parent of element 1");

		tagArray.reverse();
		var postPart = '';
		tagArray[tagArray.length - 1] = xpath1.substring(2);

		postPart = "//" + tagArray[tagArray.length - 1]

		rel_xpath = xpath2 + postPart

		var rel_count = getXpathCount(rel_xpath);

		if (rel_count > 1) {

			rel_xpath = findXpathWithIndex(rel_xpath, element1);

		}
		updateRelativeXPath(rel_xpath);
		return;

	}

	var common = commonAncestor(node1, node2);
	parentCount = 1;

	if (common != null) {

		printConsole("Element 1 and 2 has a common parent node");

		var temp = element2.parentNode;

		while (temp != null || temp != undefined) {

			if (temp.isSameNode(common)) {
				parentFlag = 1;
				break;
			} else {
				parentCount++;
				temp = temp.parentNode;
			}
		}

		var lv = '';
		for (var x = 0; x < parentCount; x++) {

			lv = lv + "/..";
		}
		var first = xpath2 + lv;

		var tagArray = [];
		var temp = element1.parentNode;
		tagArray.push(element1.tagName);

		while (temp != null || temp != undefined) {

			if (temp.isSameNode(common)) {
				childFlag = 1;
				break;
			} else {
				tagArray.push(temp.tagName);
				childCount++;
				temp = temp.parentNode;

			}

		}

		tagArray.reverse();
		var postPart = '';
		tagArray[tagArray.length - 1] = xpath1.substring(2);

		postPart = "//" + tagArray[tagArray.length - 1];
		rel_xpath = first + postPart;
		var rel_count = getXpathCount(rel_xpath);

		if (rel_count > 1) {

			rel_xpath = findXpathWithIndex(rel_xpath, element1);

		}

    printConsole("rel_xpath zzzzzz="+rel_xpath)
		updateRelativeXPath(rel_xpath);
		return;

	}// if(common!=null)
}
catch(err){
	printConsole("err="+err);

}

updateRelativeXPath("Sorry! It is not possible to calculate relative xpath of two elements between an iframe to document or two iframes. For More details please check http://stackoverflow.com/questions/9942928/how-to-handle-iframe-in-webdriver");

}


function getTheLastTag(exp){
	var expArr=[]
	printConsole("exp="+exp);
	expArr=exp.split("//");
	printConsole("Last Tag="+expArr[expArr.length-1])
	return expArr[expArr.length-1];
}

function isNotEmpty(val) {
	return (val === undefined || val == null || val.length <= 0) ? false : true;
}

function inherit_xpath_from_parents(nodez) {

	// check any of the parent has unique id
	var new_xpath = '';
	var id_flag = 0;
	var tempNode = nodez;
	var all_Parents = [];
	while (tempNode) {

		if (tempNode != undefined) {
			all_Parents.push(tempNode);
			if (tempNode.id != undefined && tempNode.id.length > 0) {
				id_flag = 1;
				break;
			}

			tempNode = tempNode.parentNode;
		}
	}
	all_Parents = all_Parents.reverse();
	for (var k = 0; k < all_Parents.length; k++) {
		if (k == 0) {
			if (id_flag == 1) {
				new_xpath = "//" + all_Parents[k].tagName + "[@id='"
						+ all_Parents[k].id + "']";
			} else {
				new_xpath = "//" + all_Parents[k].tagName;

			}
		} else {
			new_xpath = new_xpath + "//" + all_Parents[k].tagName;
		}
	}

	var count = getXpathCount(new_xpath);
	if (count == 1) {
		return new_xpath;
	}
	if (count > 1) {
		new_xpath = findXpathWithIndex(new_xpath, nodez);
		return new_xpath;
	}

}


function checkHtmlEntities(str){


var res =null;

var exp1="&nbsp;";
var exp2="&lt;";
var exp3="&gt;";
var exp4="&amp;";
var exp5="&quot;";
var exp6="&apos;";
var exp7="&pound;";
var exp8="&yen;";
var exp9="&euro;";
var exp10="&copy;";
var exp11="&reg;";


if(str.includes(exp1)){
res = str.split(exp1);
}
else if(str.includes(exp2)){
res = str.split(exp2);
}
else if(str.includes(exp3)){
res = str.split(exp3);
}
else if(str.includes(exp4)){
res = str.split(exp4);
}
else if(str.includes(exp5)){
res = str.split(exp5);
}
else if(str.includes(exp6)){
res = str.split(exp6);
}
else if(str.includes(exp7)){
res = str.split(exp7);
}
else if(str.includes(exp8)){
res = str.split(exp8);
}
else if(str.includes(exp9)){
res = str.split(exp9);
}
else if(str.includes(exp10)){
res = str.split(exp10);
}
else if(str.includes(exp11)){
res = str.split(exp11);
}
else {
	return str;
}

return res[0];

}
function getXpath(node) {

	printConsole("document.activeElement="+document.activeElement)


	var attrs = node.attributes;
	var i = attrs.length;
	var tagName = node.tagName;
	var map = {};
	var j = 0;
	var val = '';
	var count = 0;
	printConsole("i="+i)
	printConsole("tagName="+tagName)



	// no attributes
	if (i == 0) {

		var text = node.innerHTML;
		var oldText=text;
		text= checkHtmlEntities(text);
		printConsole("text="+text)
		if ((text.length > 0) && (!text.includes("<"))
				&& (text.indexOf('\'') == -1) && (text.indexOf('"') == -1)) {

			text= checkHtmlEntities(text);
			if(oldText==text){
			val = "//" + tagName + "[text()='" + text + "']";
		  }
			else{
					val = "//" + tagName + "[contains(text(),'" + text + "')]";
			}
			count = getXpathCount(val);
			if (count == 1) {
				return val;
			}
			if (count > 1) {
				val = findXpathWithIndex(val, node);
				return val;
			} else {
				return findXpathWithIndex("//"+node.tagName,node);
			}
		} else {

			return findXpathWithIndex("//"+node.tagName,node);

		}

	} // end if i==0

	var realCount = 0;
	while (j < i) {
		attr = attrs[j];

		if ((attr.name != "style") && (attr.value.indexOf('\'') < 0)) {
			map[attr.name] = attr.value;
			realCount++;
		}
		j++;

	}
	var attrLength = j;

	printConsole("realCount="+realCount)
	if (realCount == 0) {// undefined case
		printConsole("tagName="+tagName)
		var xp = findXpathWithIndex("//"+tagName,node);
		return xp;
	}// end of realCount==0

	// Since Id going to be unique , no need to check further attributes

	if (isNotEmpty(map['id'])) {

		val = "//" + tagName + "[@id='" + map['id'] + "']";
		return val;

	}

	// find which attribute combination gives the xpath count 1

	for ( var attribute in map) {
		if (map.hasOwnProperty(attribute)) {

			val = "//" + tagName + "[@" + attribute + "='" + map[attribute]
					+ "']";

			var text = node.innerHTML;
			var oldText=text;
				text= checkHtmlEntities(text);
				printConsole('text='+text)
			if ((text.length > 0) && (!text.includes("<"))
					&& (text.indexOf('\'') == -1) && (text.indexOf('"') == -1)) {
				if(oldText==text){
				val = val + "[text()='" + text + "']";
				}
				else{
					val = val + "[contains(text(),'" + text + "')]";
				}
			}
			printConsole("val="+val)

			count = getXpathCount(val);
      printConsole("count hi="+count)
			if (count == 1) {
				return val;
			}

			if (count > 1) {
				val = findXpathWithIndex(val, node);
				return val;
			} else {
				return "No Unique Identifiers found";
			}

		}
	}

}

function getXpathCount(val) {

var nodes=null;
 if(document.activeElement== document.querySelector('iframe')){

	 var currentIframe = document.activeElement;
	 var iDoc = currentIframe.contentWindow  || currentIframe.contentDocument;

	 nodes = iDoc.document.evaluate(val, iDoc.document, null, XPathResult.ANY_TYPE,
			null);
 }
 else{
	 nodes = document.evaluate(val, document, null, XPathResult.ANY_TYPE,
			null);
			}
	var results = [], nodex;

	while (nodex = nodes.iterateNext()) {
		results.push(nodex);
	}
	return results.length;

}

function findXpathWithIndex(val, node) {
   printConsole("val="+val)


	 var text = node.innerHTML;
	 var oldText=text;
	 	text= checkHtmlEntities(text);
	 printConsole("text in findXpathWithIndex="+text)
	 if ((text.length > 0) && (!text.includes("<"))
			 && (text.indexOf('\'') == -1) && (text.indexOf('"') == -1)) {
				 if(oldText==text){
			 val=val+"[text()='"+text+"']";
			 }
			 else{
				 val=val+"[contains(text(),'"+text+"')]";
			 }

	 }
	var nodes=null;
	 if(document.activeElement== document.querySelector('iframe')){

		 var currentIframe = document.activeElement;
		 var iDoc = currentIframe.contentWindow  || currentIframe.contentDocument;

		 nodes = iDoc.document.evaluate(val, iDoc.document, null, XPathResult.ANY_TYPE,
	 			null);
	 }

else{
	 nodes = document.evaluate(val, document, null, XPathResult.ANY_TYPE,
			null);
		}
			printConsole("nodes="+nodes)
	var results = [], nodex;
	var index = 0;
	while (nodex= nodes.iterateNext()) {

		index++;

		if (nodex.isSameNode(node)) {

			return "(" + val + ")[" + index + "]";
		}
	}

}

function commonAncestor(node1, node2) {
	var parents1 = parents(node1)
	var parents2 = parents(node2)

	if (parents1[0] != parents2[0])
		return null;

	for (var i = 0; i < parents1.length; i++) {
		if (parents1[i] != parents2[i])
			return parents1[i - 1]
	}
}

function parents(node) {
	var nodes = [ node ];
	for (; node; node = node.parentNode) {
		nodes.unshift(node);
	}
	return nodes;
}

function updateRelativeXPath(xpath) {
	var results = '';
	var nodex = '';

	try {

		if((xpath.indexOf("/following-sibling::*")>-1) || (xpath.indexOf("/preceding-sibling::*")>-1)){
			xpath = xpath.substring(0, xpath.length - 1);
			xpath=xpath+firingElement1.tagName;

		}

		if(document.activeElement== document.querySelector('iframe')){

			var currentIframe = document.activeElement;
			var iDoc = currentIframe.contentWindow  || currentIframe.contentDocument;

			results = iDoc.document.evaluate(xpath, iDoc.document, null,
					XPathResult.ANY_TYPE, null);
		}
else{
		results = document.evaluate(xpath, document, null,
				XPathResult.ANY_TYPE, null);
}
		var nodex = results.iterateNext();

	} catch (err) {
		printConsole(err.message)
	}
	printConsole("Final Xpath="+xpath);

	var outHTML=  nodex.outerHTML;
	var tgName= nodex.tagName;

	if(!(isNotEmpty(outHTML))){
		outHTML=' ';
		tgName=' ';
	}
	chrome.runtime.sendMessage({
		type : 'relative_xpath',
		query : xpath,
		results : outHTML,
		tag : tgName
	});
};

// window.xhBarInstance = new rxh.rhxPopup();

var handleRequest = function(request, sender, cb) {

	if (request.type === 'changePosition') {
		if (isPopAtTop) {
			popUpFrame.style.top = 'auto';
			popUpFrame.style.bottom = 0;
			isPopAtTop = false;
		} else {
			popUpFrame.style.top = 0;
			popUpFrame.style.bottom = 'auto';
			isPopAtTop = true;
		}
	} else if (request.type === 'togglePopup') {
		displayPopup();
	}

	else if (request.type === 'evaluateCustomXPath') {
		doEvaluteUserXpath(request.xpath);
	}

};

function changeNodeBg(node){
	customxpathelementlist.push(node);
	customxpathelementoriginalbglist.push(node.style.border);
	node.style.border="5px groove #2E64FE";

}

function changeNodeBgToOriginal(){

	for(var i=0;i<customxpathelementlist.length;i++){
		customxpathelementlist[i].style.border=customxpathelementoriginalbglist[i];
	}

	customxpathelementlist.length=0;
	customxpathelementoriginalbglist.length=0;

}

function doEvaluteUserXpath(xpath) {

	try {

		resetXpath1AndXpath2();
		if(firingElement2!=null){
		firingElement2.style.border = origColor2;
     	}
		if(firingElement1!=null){
		firingElement1.style.border = origColor1;
		}


		changeNodeBgToOriginal();


   	//document.domain = window.location.hostname;
		var iframe = document.getElementById("rel_xpath_popup");
		//Need to include the iframe results as well


		var nodes = document.evaluate(xpath, document, null,
				XPathResult.ANY_TYPE, null);
		var results = [], nodex;

		while (nodex = nodes.iterateNext()) {
			results.push(nodex.tagName+"                        "+nodex.outerHTML);
			results.push("_____________________________________________________________________________________________________________________________");

			changeNodeBg(nodex);
		}

try{
		var z, frames;
frames = document.getElementsByTagName("iframe");
for (z = 0; z < frames.length; ++z){

	if(frames[z].id!="rel_xpath_popup"){
		var currentIframe = frames[z];
		var iDoc = currentIframe.contentWindow  || currentIframe.contentDocument;
   //iDoc.document.domain = window.location.hostname;
		 nodes = iDoc.document.evaluate(xpath, iDoc.document, null,
				XPathResult.ANY_TYPE, null);


		while (nodex = nodes.iterateNext()) {
			results.push(nodex.tagName+"                        "+nodex.outerHTML+"   [iframe]");
			results.push("___________________________________________________________________________________________________________________________________________________________");

			changeNodeBg(nodex);
		}
	}
}

}
catch(err){
	printConsole(err)
}

		iframe.contentWindow.postMessage(results, '*');


		 firstClick = false;
		 secondClick = false;


	} catch (err) {
		iframe.contentWindow.postMessage(err.message, '*');
	}

	//clear the textfields if user selected any element in between


}

function displayPopup() {

	// pop up is hidden, add to dom
	printConsole("domain="+window.location.hostname)
	var host = window.location.hostname;
	var hostArr = host.split(".");
	var lastHost= hostArr[hostArr.length-2]+"."+hostArr[hostArr.length-1]
	printConsole("lastHost="+lastHost)
	//document.domain = lastHost;
	if (!isIframeAdded) {
		document.body.appendChild(popUpFrame);
		isIframeAdded = true;



		document.addEventListener('contextmenu', analyseRightClick);


	var all_iframes = document.evaluate("//iframe", document, null, XPathResult.ANY_TYPE,
			null);
	var iframe;

	while (iframe = all_iframes.iterateNext()) {
		try{
		printConsole(iframe.id)
		if(iframe.id!="rel_xpath_popup"){
		var iDoc = iframe.contentWindow  || iframe.contentDocument;
		printConsole("iDoc="+iDoc)
			printConsole("iDoc.document="+iDoc.document)
			printConsole("-----------------------")
			//iDoc.document.domain = lastHost;
    iDoc.document.addEventListener('contextmenu',analyseRightClick);
		}
		}
		catch(err){
   printConsole("error="+err)
		}



	}



	} else {

		//remove all highlighted elements
		resetEverything();
		isIframeAdded = false;
		document.removeEventListener('contextmenu', analyseRightClick);

			var all_iframes = document.evaluate("//iframe", document, null, XPathResult.ANY_TYPE,
					null);
			var iframe;

			while (iframe = all_iframes.iterateNext()) {
				try{
				printConsole(iframe.id)
				var iDoc = iframe.contentWindow  || iframe.contentDocument;
				printConsole("iDoc="+iDoc)
					printConsole("iDoc.document="+iDoc.document)
					printConsole("-----------------------")
					//iDoc.document.domain = window.location.hostname;
		    iDoc.document.removeEventListener('contextmenu',analyseRightClick);
				}
				catch(err){
		   printConsole("error="+err)
				}



			}

		document.body.removeChild(popUpFrame);

	}

}


function resetEverything(){

	 firstClick = false;
	 secondClick = false;

	if(firingElement2!=null){
		firingElement2.style.border = origColor2;
     	}
		if(firingElement1!=null){
		firingElement1.style.border = origColor1;
		}
		changeNodeBgToOriginal();
		chrome.runtime.sendMessage({
			type : 'backToInitialState'
		});

}

function analyseRightClick(e) {

	try{

	e.preventDefault();
	changeNodeBgToOriginal();


	if (firstClick == false && secondClick == false) {// first element going
														// to be selected
		printConsole("Clicked on First Element");
		firstClick = true;
		secondClick == false;
		node1 = e.srcElement;
    printConsole("node1="+node1)
		xpath1 = getXpath(node1);
		printConsole("xpath1="+xpath1)

		// if xpath1 is undefined, this element may not be in main document, so traverse all the iframes


		updateXPath1(xpath1);

		if (firingElement2 != null) {

			firingElement2.style.border = origColor2;
			firingElement1.style.border = origColor1;

		}

		firingElement1 = node1;

		origColor1 = firingElement1.style.border;
		firingElement1.style.border = '5px groove #ff0000';
		selectElement1 = firingElement1;


	}

	else if (firstClick == true && secondClick == false) {
		printConsole("Clicked on Second Element");
		secondClick = true;
		node2 = e.srcElement;
		firingElement2 = node2;

		xpath2 = getXpath(node2);
		updateXPath2(xpath2);

		origColor2 = firingElement2.style.border;

		firingElement2.style.border = '5px groove #F4FA58';
		selectElement2 = firingElement2;
		// bringBackOriginalBackground();

		// Element 1 and Element 2 are at same level

		findRelXPath(node1, node2, xpath1, xpath2);

		firstClick = false;
		secondClick = false;

	}

	}
	catch(err){
		printConsole("Err Happened, "+err.message);
	}

}

function bringBackOriginalBackground() {
	setTimeout(function() {

		if ((firstClick == true && secondClick == false)
				|| (firstClick == true && secondClick == true)) {
			firingElement1.style.border = origColor1;
			firingElement2.style.border = origColor2;

		}

	}, interv);
}

function updateXPath1(xpath) {
	var results = 'Please select the second element';
	chrome.runtime.sendMessage({
		type : 'update_xpath_1',
		query : xpath,
		results : results
	});
};

function updateXPath2(xpath) {
	var results = 'Calculating the relative xpath';
	chrome.runtime.sendMessage({
		type : 'update_xpath_2',
		query : xpath,
		results : results
	});
};

function resetXpath1AndXpath2() {
	chrome.runtime.sendMessage({
		type : 'reset'
	});
};

chrome.runtime.onMessage.addListener(handleRequest);

var popUpFrame = document.createElement('iframe');
popUpFrame.src = chrome.runtime.getURL('relxpathpopup.html');
popUpFrame.id = 'rel_xpath_popup';
popUpFrame.height = '250px';
popUpFrame.width = '100%';
var isIframeAdded = false;
var isPopAtTop = true;
