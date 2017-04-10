function removeElement(element){

	var parent = element.parentNode;
	parent.removeChild(element);
}

/*Append background for dynamic prompts*/
function createBackground(){
	/* Creating a background layout*/
	var background = document.createElement("div");
	background.className = "background";
	//Add to the html page
	document.body.appendChild(background);
}

/* Append confirming msg to page*/
function createConfirmMsg(){

	var confirm = document.createElement("div");
	confirm.className = "confirm";
	document.body.appendChild(confirm);

	var confirm_text = document.createElement("div");
	confirm_text.className = "confirm_text";
	confirm_text.innerHTML = "Are you sure?";
	confirm.appendChild(confirm_text)

	var confirm_removal_button = document.createElement("button");
	confirm_removal_button.className = "confirm_removal";
	confirm_removal_button.innerHTML = "Confirm";
	confirm_removal_button.addEventListener('click', function(){
		alert("Send remove request to database");
		removeElement(confirm);
		var background = document.getElementsByClassName('background')[0];
		removeElement(background);
	})

	confirm.appendChild(confirm_removal_button);

	var cancel_removal_button = document.createElement("button");
	cancel_removal_button.className = "cancel_removal";
	cancel_removal_button.innerHTML = "Cancel";
	cancel_removal_button.addEventListener('click', function(){
		removeElement(confirm);
		var background = document.getElementsByClassName('background')[0];
		removeElement(background);
	})
	confirm.appendChild(cancel_removal_button);
}



/* Removes the list element that the button is associated with */
function confirm(){

	var element = this.parentElement;
	//Name of who is going to be deleted
	var to_be_deleted = element.children[0].innerHTML;

	createBackground();


	//Create confirmation div

	var confirm = document.createElement("div");
	confirm.className = "confirm";
	document.body.appendChild(confirm);

	var confirm_text = document.createElement("div");
	confirm_text.className = "confirm_text";
	confirm_text.innerHTML = "Are you sure you want to remove:";
	confirm.appendChild(confirm_text)

	var confirm_name = document.createElement("div");
	confirm_name.className = "confirm_name";
	confirm_name.innerHTML = to_be_deleted + "?";
	confirm.appendChild(confirm_name)


	var confirm_form = document.createElement('form');
	confirm_form.setAttribute('action', '/remove_acc');
	confirm_form.setAttribute('method', 'get');
	confirm.appendChild(confirm_form);

	var confirm_removal_button = document.createElement("button");
	confirm_form.appendChild(confirm_removal_button);
	confirm_removal_button.className = "confirm_removal";
	confirm_removal_button.innerHTML = "Confirm";
	confirm_removal_button.addEventListener('click', function(){
		alert("Send remove request to database");
		removeElement(confirm);
		var background = document.getElementsByClassName('background')[0];
		removeElement(background);
	})

	//confirm.appendChild(confirm_removal_button);

	var cancel_removal_button = document.createElement("button");
	cancel_removal_button.className = "cancel_removal";
	cancel_removal_button.innerHTML = "Cancel";
	cancel_removal_button.addEventListener('click', function(){
		removeElement(confirm);
		var background = document.getElementsByClassName('background')[0];
		removeElement(background);
	})
	confirm.appendChild(cancel_removal_button);

}


var truck_buttons = document.getElementsByClassName('truck_button');
for(var i = 0; i < truck_buttons.length; i++){
	truck_buttons[i].addEventListener('click', confirm);
}
var customer_buttons = document.getElementsByClassName('customer_button');
for(var i = 0; i < customer_buttons.length; i++){
	customer_buttons[i].addEventListener('click', confirm);
}
