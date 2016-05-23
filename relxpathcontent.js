
/**
 * @author syamsasi99@gmail.com
 */



'use strict';


var element_bgcolor_map = {};

var interv=3000;
var  selectElement1,origColor1,selectElement2,origColor2;
var temp;
var xpath1,xpath2;


var firstClick=false;
var secondClick=false;

var node1,node2;
var firingElement1=null;
var firingElement2=null;
var attr=null;
var normal=true;






function removeParenthesis(xpath){

var charArr = xpath.split('');

var count = charArr.length;
var indexArray=[];

while (charArr[count-2]!='['){

indexArray.push(charArr[count-2]);
count--;
}

indexArray.reverse();
var finalStr='';
for (var i = 0; i < indexArray.length; i++) {

finalStr=finalStr+indexArray[i];
}



var secndpart = "["+finalStr+"]";
var pre = xpath.split(secndpart);
var firstpart = pre[0];

firstpart= firstpart.substring(1, firstpart.length-1)


var newxpath = firstpart+secndpart;


return firstpart;
}


function findRelXPath(element1,element2,xpath1,xpath2){


var par1 = element1.parentNode;
var par2 = element2.parentNode;
var rel_xpath='';

var parentFlag=0,parentCount=1;
var childFlag=0,childCount=1;


if(xpath1!= undefined  && xpath1.charAt(0)=='('){
xpath1= removeParenthesis(xpath1);
}




// both has same parent
if(par1.isSameNode(par2)){

//alert('Both elements has same parents');

var next = element1.nextElementSibling;
var previous = element1.previousElementSibling;

//alert('next='+next)
//alert('previous='+previous)



if(( next!=null) && (next.isSameNode(element2)) ){

rel_xpath=xpath2+"/preceding-sibling::"+xpath1.substring(2);


}
else if (  (previous!=null)  && (previous.isSameNode(element2) )){


rel_xpath=xpath2+"/following-sibling::"+xpath1.substring(2);


}
else{

//alert("hmmm");

rel_xpath=xpath2+"/.."+xpath1;
var rel_count = getXpathCount(rel_xpath);

if(rel_count>1){

	rel_xpath= findXpathWithIndex(rel_xpath,element1);

}

} 


////alert('xxx='+rel_xpath);

//alert("rel_xpath="+rel_xpath);

updateRelativeXPath(rel_xpath);

return;

}// if both has same parent

// check for  Element 1 is one of the parent of element2

var temp = element2.parentNode;

while(temp!=null || temp!=undefined){

if(temp.isSameNode(element1)){
parentFlag=1;
break;
}
else{
parentCount++;
temp=temp.parentNode;
}
}


// check for Element 2 is one of the parent of element1

var tagArray=[];
var temp = element1.parentNode;
tagArray.push(element1.tagName);

while(temp!=null || temp!=undefined){


if(temp.isSameNode(element2)){
childFlag=1;
break;
}
else{
tagArray.push(temp.tagName);
childCount++;
temp=temp.parentNode;


}

}


////alert('parentCount='+parentCount);
////alert('parentFlag='+parentFlag);
////alert('childFlag='+childFlag);
////alert('childCount='+childCount);
////alert('tagArray='+tagArray);



// Element 1 is one of the parent of element2

if(parentFlag==1){
////alert('Element 1 is the parent of element2');

//appendlevels

var lv='';
for(var x=0;x<parentCount;x++){
lv=lv+"/..";
}
rel_xpath=xpath2+lv;
//alert('rel_xpath='+rel_xpath)
var rel_count = getXpathCount(rel_xpath);

if(rel_count>1){

	rel_xpath= findXpathWithIndex(rel_xpath,element1);

}
updateRelativeXPath(rel_xpath);
return;

}

// Element 2 is the parent of element1

if(childFlag==1){
////alert('Element 2 is one of the parent of element1');

tagArray.reverse();
var postPart='';
tagArray[tagArray.length-1]=xpath1.substring(2);

//for(var x=0;x<tagArray.length;x++){
//postPart=postPart+"//"+tagArray[x];
//}

postPart="//"+tagArray[tagArray.length-1]

rel_xpath=xpath2+postPart

////alert('rel_xpath='+rel_xpath);

var rel_count = getXpathCount(rel_xpath);

if(rel_count>1){

	rel_xpath= findXpathWithIndex(rel_xpath,element1);

}
updateRelativeXPath(rel_xpath);
return;


}




var common = commonAncestor(node1,node2);
parentCount=1;

if(common!=null){
////alert('Im the common parent ='+common.tagName);

var temp = element2.parentNode;

while(temp!=null || temp!=undefined){

if(temp.isSameNode(common)){
parentFlag=1;
break;
}
else{
parentCount++;
temp=temp.parentNode;
}
}

////alert('parentCount='+parentCount);

var lv='';
for(var x=0;x<parentCount;x++){

lv=lv+"/..";
}
var first = xpath2+lv;



var tagArray=[];
var temp = element1.parentNode;
tagArray.push(element1.tagName);

while(temp!=null || temp!=undefined){


if(temp.isSameNode(common)){
childFlag=1;
break;
}
else{
tagArray.push(temp.tagName);
childCount++;
temp=temp.parentNode;


}

}

////alert('tagArray='+tagArray);

tagArray.reverse();
var postPart='';
tagArray[tagArray.length-1]=xpath1.substring(2);

//for(var x=0;x<postPart.length;x++){
//postPart=postPart+"//"+tagArray[x];
//}

postPart="//"+tagArray[tagArray.length-1];
rel_xpath = first+postPart;
var rel_count = getXpathCount(rel_xpath);

if(rel_count>1){

////alert('hmmmm');

	rel_xpath= findXpathWithIndex(rel_xpath,element1);

}

////alert('rel_xpath='+rel_xpath)
updateRelativeXPath(rel_xpath);

}//if(common!=null)

}

function isNotEmpty(val){
    return (val === undefined || val == null || val.length <= 0) ? false : true;
}


function inherit_xpath_from_parents(nodez){



// check any of the parent has unique id
var new_xpath='';
var id_flag=0;
var tempNode=nodez;
var all_Parents = [];
while (tempNode) {

	if(tempNode != undefined){
    all_Parents.push(tempNode);
    	if(tempNode.id !=undefined && tempNode.id.length>0){
    	id_flag=1;
    	break;
    	}

    tempNode = tempNode.parentNode;
    }
}
all_Parents = all_Parents.reverse();
for(var k=0;k<all_Parents.length;k++){
if(k==0){
if(id_flag==1){
new_xpath="//"+all_Parents[k].tagName+"[@id='"+all_Parents[k].id+"']";
}
else{
new_xpath="//"+all_Parents[k].tagName;

}
}
else{
new_xpath=new_xpath+"//"+all_Parents[k].tagName;
}
}


var count = getXpathCount(new_xpath);
    if(count==1){
        return new_xpath;
    }
	if(count>1){
	new_xpath= findXpathWithIndex(new_xpath,nodez);
	return new_xpath;
	}



}

function getXpath(node){

var attrs = node.attributes;
var i = attrs.length;
var tagName= node.tagName;
var map = {};
var j = 0;
var val='';
var count=0;


console.log("i="+i);
// no attributes
if(i==0){

var text = node.innerHTML;
    if((text.length >0) && (!text.includes("<"))  && (text.indexOf('\'') == -1) && (text.indexOf('"') == -1)){
    val="//"+tagName+"[text()='"+text+"']";
    count = getXpathCount(val);
    if(count==1){
        return val;
    }
	if(count>1){
	val= findXpathWithIndex(val,node);
	return val;
	}
	else {
	return inherit_xpath_from_parents(node);
	}
    }
    else{
	return inherit_xpath_from_parents(node);

    }

} // end if i==0

var realCount = 0;
while (j<i)
{
    attr = attrs[j];
    console.log(attr.name + '="' + attr.value + '"');

    if((attr.name != "style") && (attr.value.indexOf('\'')<0)){
    map[attr.name] = attr.value;
    realCount++;
    }
        j++;



}
var attrLength = j;



if(realCount==0){// undefined case

var xp = inherit_xpath_from_parents(node);
return xp;
}// end of realCount==0


// Since Id going to be unique , no need to check further attributes

if(isNotEmpty(map['id'])){

val ="//"+tagName+"[@id='"+map['id']+"']";
return val;

}

// find which attribute combination gives the xpath count 1


for (var attribute in map) {
  if (map.hasOwnProperty(attribute)) {
    
    val ="//"+tagName+"[@"+attribute+"='"+map[attribute]+"']";
    
     var text = node.innerHTML;
    if((text.length >0) && (!text.includes("<"))  && (text.indexOf('\'') == -1) && (text.indexOf('"') == -1)){
    val=val+"[text()='"+text+"']";
    }
   
    count = getXpathCount(val);
    console.log("count="+count);

    if(count==1){
    console.log(val);
    return val;
 }
 
	if(count>1){
	val= findXpathWithIndex(val,node);
	return val;
	}
	else {
	return "No Unique Identifiers found";
	}
 

  }
}


}


function getXpathCount(val){


var nodes = document.evaluate(val, document, null, XPathResult.ANY_TYPE, null); 
var results = [], nodex;

    while(nodex = nodes.iterateNext()) {
        results.push(nodex);
    }
return results.length; 

}

function findXpathWithIndex(val,node){

var nodes = document.evaluate(val, document, null, XPathResult.ANY_TYPE, null); 
var results = [], nodex;
var index=0;
    while(nodex = nodes.iterateNext()) {
       
              index++;

       if(nodex.isSameNode(node)){
       
       return "("+val+")["+index+"]";
       }
    }

}

function commonAncestor(node1, node2) {
  var parents1 = parents(node1)
  var parents2 = parents(node2)

  if (parents1[0] != parents2[0]) return null;

  for (var i = 0; i < parents1.length; i++) {
    if (parents1[i] != parents2[i]) return parents1[i - 1]
  }
}

function parents(node) {
  var nodes = [node];
  for (; node; node = node.parentNode) {
    nodes.unshift(node);
  }
  return nodes;
}

function updateRelativeXPath(xpath) {
  var results = '';
  var  nodex='';
  
  

  
  try {
     results = document.evaluate(xpath, document, null,
                                    XPathResult.ANY_TYPE, null);
                                    
    var nodex = results.iterateNext();

   
}
catch(err) {
    results="Error occurred while calculating relative xpath "+err.message;
}
  chrome.runtime.sendMessage({
    type: 'relative_xpath',
    query: xpath,
    results: nodex.innerHTML
  });
};






//window.xhBarInstance = new rxh.rhxPopup();


var handleRequest = function(request, sender, cb) {

 if (request.type === 'changePosition') {
    if(isPopAtTop){
    popUpFrame.style.top='auto';
    popUpFrame.style.bottom=0;
    isPopAtTop=false;
    }
    else{
    popUpFrame.style.top=0;
     popUpFrame.style.bottom='auto';
    isPopAtTop=true;
    }
  }
  else if (request.type === 'togglePopup') {
   displayPopup();
  }
  
  else if (request.type === 'evaluateCustomXPath') {
   doEvaluteUserXpath(request.xpath);
  }
  
};

function doEvaluteUserXpath(xpath){

alert("in doEvaluteUserXpath,xpath="+xpath)

try{
   
  // alert('rel_xpath.value='+rel_xpath.value)
   //var res =document.evaluate(rel_xpath.value, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
     // alert("res="+res);
     
     var iframe = document.getElementById("rel_xpath_popup");
     var nodes = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null); 
     var results = [], nodex;

    while(nodex = nodes.iterateNext()) {
        results.push(nodex.tagName);
    }
    
    
    alert("results="+results)
         iframe.contentWindow.postMessage(results,'*');



   
   }
   catch(err){
   //final_res.innerHTML=err.message;
   alert("err.message="+err.message);
   }
}


function displayPopup(){


//pop up is hidden, add to dom
	if(!isIframeAdded){
    document.body.appendChild(popUpFrame);
    isIframeAdded=true;
    document.addEventListener('contextmenu', analyseRightClick);

    }
    else{
    isIframeAdded=false;
    document.removeEventListener('contextmenu', analyseRightClick);
     document.body.removeChild(popUpFrame);
    }

}


function analyseRightClick(e){

////alert("Hot right click");

e.preventDefault();

//alert("firstClick="+firstClick)
//alert("secondClick="+secondClick)

	    
 if(firstClick ==  false &&  secondClick== false)	{// first element going to be selected

firstClick= true;
secondClick== false;
node1=e.srcElement;

 xpath1 = getXpath(node1);
updateXPath1(xpath1);


if(firingElement2!=null){

//alert(':)')
firingElement2.style["backgroundColor"]=origColor2;
firingElement1.style["backgroundColor"]=origColor1;

}

firingElement1=node1;

origColor1=firingElement1.style["backgroundColor"];
firingElement1.style["backgroundColor"]='#ff0000';
selectElement1=firingElement1;




}

else if(firstClick== true && secondClick== false){
secondClick= true;
node2=e.srcElement;
firingElement2=node2;


 xpath2 = getXpath(node2);
updateXPath2(xpath2);


origColor2=firingElement2.style["backgroundColor"];

firingElement2.style["backgroundColor"]='#F4FA58';
selectElement2=firingElement2;
//bringBackOriginalBackground();

    
    // Element 1 and Element 2 are at same level
    
    findRelXPath(node1,node2,xpath1,xpath2);

firstClick=false;
secondClick= false;


}
	    
}



    
    
    
    function bringBackOriginalBackground() {
    setTimeout(function(){
    
   ////alert('now')
   if((firstClick == true  &&  secondClick==false) || (firstClick == true  &&  secondClick==true)){
   firingElement1.style["backgroundColor"]=origColor1;
   firingElement2.style["backgroundColor"]=origColor2;
   
   }


    }, interv);
}



 function updateXPath1(xpath) {
  var results = 'Please select the second element';
  chrome.runtime.sendMessage({
    type: 'update_xpath_1',
    query: xpath,
    results: results
  });
};

 function updateXPath2(xpath) {
   var results = 'Calculating the relative xpath';
  chrome.runtime.sendMessage({
    type: 'update_xpath_2',
    query: xpath,
    results: results
  });
};

chrome.runtime.onMessage.addListener(handleRequest);

  var popUpFrame = document.createElement('iframe');
  popUpFrame.src = chrome.runtime.getURL('relxpathpopup.html');
  popUpFrame.id = 'rel_xpath_popup';
  popUpFrame.height='250px';
  popUpFrame.width='100%';
  var isIframeAdded=false;
  var isPopAtTop=true;
  



