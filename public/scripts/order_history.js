/* Helper function to remove elements in the page*/
function removeElement(element){

	var parent = element.parentNode;
	parent.removeChild(element);
}
/* Create a background layout for a prompt to user */
function createBackground(){
	/* Creating a background layout*/
	var background = document.createElement("div");
	background.className = "background";
	//Add to the html page
	document.body.appendChild(background);
}
/* Prompt user for rating of a menu item */
function createRateMsg(){

	var rate_window = document.createElement("div");
	rate_window.className = "rate_window";
	document.body.appendChild(rate_window);

	var rate_text = document.createElement("div");
	rate_text.className = "rate_text";
	rate_text.innerHTML = "How did you like this meal?";
	rate_window.appendChild(rate_text)


	var rate_boxes = document.createElement("div");
	rate_boxes.className = "rate_boxes";
	rate_window.appendChild(rate_boxes);

	for(var i = 0; i < 5; i++){
		var input_1 = document.createElement("input");
		input_1.type = "radio";
		input_1.className = "radio_input";
		input_1.name = "radio1";
		rate_boxes.appendChild(input_1);
	}
	for(var i = 0; i < 5; i++){
		var input_container = document.createElement("div");
		input_container.className = "input_container";
		input_container.innerHTML = "" + (i + 1)
		rate_boxes.appendChild(input_container);
	}


	var submit_rating_button = document.createElement("button");
	submit_rating_button.className = "submit_rating";
	submit_rating_button.innerHTML = "Submit";
	submit_rating_button.addEventListener('click', function(){
		alert("Sending rating to database");
		removeElement(rate_window);
		var background = document.getElementsByClassName('background')[0];
		removeElement(background);
	})
	rate_window.appendChild(submit_rating_button);

	var cancel_rating_button = document.createElement("button");
	cancel_rating_button.className = "cancel_rating";
	cancel_rating_button.innerHTML = "Cancel";
	cancel_rating_button.addEventListener('click', function(){
		removeElement(rate_window);
		var background = document.getElementsByClassName('background')[0];
		removeElement(background);
	})
	rate_window.appendChild(cancel_rating_button);
}
/* Add the background and the prompts */

function rateWindow(){
	createBackground();
	createRateMsg();

}


var rate_buttons = document.getElementsByClassName('rate_item_button');
for(var i = 0; i < rate_buttons.length; i++){
	rate_buttons[i].addEventListener('click', rateWindow);
}