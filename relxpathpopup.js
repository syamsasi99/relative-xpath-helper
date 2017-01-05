/**
 * @author syamsasi99@gmail.com
 */

'use strict';

var toggleFlag = 0;

var xpath1 = document.getElementById('xpath_1');
var xpath2 = document.getElementById('xpath_2');
var rel_xpath = document.getElementById('rel_xpath');
var final_res = document.getElementById('final_xpath_result');

var handleRequest = function(request, sender, cb) {

	if (request.type === 'update_xpath_1') {
		if (request.query !== null) {
			xpath1.value = request.query;
		}
		if (request.results !== null) {
			xpath2.value = request.results;
			rel_xpath.value = '';
			final_res.value = '';
		}
	}

	if (request.type === 'update_xpath_2') {
		if (request.query !== null) {
			xpath2.value = request.query;
		}
		if (request.results !== null) {
			rel_xpath.value = request.results;
		}
	}

	if (request.type === 'relative_xpath') {
		if (request.query !== null) {
			rel_xpath.value = request.query;
		}
		if (request.results !== null) {
			if(request.results==''){
				request.results="Empty Element";
			}

      //console.log("test="+request.tag)

			final_res.value = request.tag+"                        "+request.results;
		}
	}

	if (request.type === 'reset') {
		xpath1.placeholder="Right-click anywhere on the page to select element";
		xpath1.value="";
		xpath2.value="";
	}

	if (request.type === 'backToInitialState') {
		xpath1.placeholder="Right-click anywhere on the page to select element";
		xpath1.value="";
		xpath2.value="";
		rel_xpath.value="";
		rel_xpath.placeholder="Right-Click on any two elements...  OR Type in an expression here and hit ENTER key...";
		final_res.value="";

	}

};

var togglePopupHtml = function(e) {

	chrome.runtime.sendMessage({
		type : 'changePosition'
	});
	if (toggleFlag == 0) {
		document.getElementById("toggle").src = "up.png";
		toggleFlag = 1;
	} else {
		document.getElementById("toggle").src = "down.png";
		toggleFlag = 0;

	}
};

function evaluateXpath(e) {

	e = e || event;
	if (e.keyCode === 13 && !e.ctrlKey) {

		var xpr = rel_xpath.value;

		chrome.runtime.sendMessage({
			type : 'evaluateCustomXPath',
			xpath : xpr
		});

	}
}

window.addEventListener('message', function(event) {

	var data = String(event.data);
	//console.log("data="+data)
	var xpathList = data.split(",");
	//console.log("xpathList="+xpathList)

	var res = '';
	if(data === ''){
		res='No Result Found!!'
	}
	else{
	for (var i = 0; i < xpathList.length; i++) {

		res = res + xpathList[i] + "\n";
	}
}

//console.log("res="+res)
if(!res.includes("[object Object]")){
	if(res.startsWith("Blocked a frame")){
		final_res.value = "Sorry!! We can't execute the query due to cross origin policy!";

	}
else{
final_res.value = res;
}
}

});




document.getElementById("toggle").addEventListener('click', togglePopupHtml);
rel_xpath.addEventListener('keyup', evaluateXpath);
chrome.runtime.onMessage.addListener(handleRequest);
