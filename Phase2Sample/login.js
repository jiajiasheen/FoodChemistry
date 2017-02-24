//Toggle between login and register forms'))
document.getElementById('toregister').onclick = function(){
	document.getElementById('register_form').style.display = 'block'
	document.getElementById('login_form').style.display = 'none'	
}

document.getElementById('tologin').onclick = function(){
	document.getElementById('register_form').style.display = 'none'
	document.getElementById('login_form').style.display = 'block'
}