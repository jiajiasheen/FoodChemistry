








$(function(){

	$('.input_button').on('click',function(){
		var text = $('.input_text').val();
		var timeInMs = new Date();
		var html = ' ';
		postProfileImage = '<div class="post">' + '<img src="images/profile_user.png" width="60px" height="60px" />' + '</div>';
		postSign = '<div class="post">' +  timeInMs +  " Sheen Li" +'</div><br>';
		postText = '<div class="post"><P>' + text + '</P></div>';	
		html = '<div class="post_item">' + postProfileImage + postSign  + postText + '</div>';		
		$('.comment-section').append(html);		
	});
});


















$(document).ready(function(){
	//$('#context-logo').bind('contextmenu',function(e){
		//$('.thisismyclass').bind('contextmenu',function(e){
			$('.thisismyclass').bind('click',function(e){
		//if (e.button === 1){
			showPressModal();
			e.preventDefault();
		//}
		$('#shadow, .close').on('click', function(){
		
		hidePressModal();
	});
		
		$('.buttonConfirm').on('click', function(e){		
		//var x = document.getElementById('items_num').innerHTML;
		//var count = Number(x) + 1;
		//x = document.getElementById('items_num').innerHTML=count; 
		hidePressModal();
	});
		
	});
	
	
	
	$('a[rel="external"]').click(function(){
		
		window.open( $(this).attr('href'));
		return false;
	});	
});

var logos = '<h2>Nutrition Table<span class="close">X</span></h2>';
logos += '<img src="images/food.png" alt="Logo Download" />';
logos += '<div class="Nutrition Table">Dish Instruction:</div><br>';
logos += '<div class="Nutrition Table">When checking out please leave a note indicating 2 choices of:\
 Roasted Duck, Soya Chicken, or Honey BBQ Pork. If not indicated, the default is chicken and duck.</div><br>';
logos += '<div class="Nutrition Table">The Nutrition information will be shown here:</div><br>';
logos += '<div class="Nutrition Table">Amount Per 100 grams\
Calories 295% Daily Value*Total Fat 14 g	21%Saturated fat 5 g	25% Polyunsaturated fat 0.4 g	\
Monounsaturated fat 5 g	Trans fat 0.8 g	Cholesterol 47 mg	15%Sodium 414 mg 17% Potassium 226 mg	6%Total Carbohydrate 24 g	8% \
Dietary fiber 0.9 g	3%Sugar 4.2 g	Protein 17 g	34%Vitamin A	0%	Vitamin C	0% Calcium	10%	Iron	16% \
Vitamin B-6	10%	Vitamin B-12	23% Magnesium	5%	</div><br>';
//logos +=  '<button class="buttonConfirm">cool</button>' +'</div>';	

function showPressModal(){
	if ($('#shadow').length === 0){
		$('#banner').append('<div id="logo-modal"></div>');
		$('body').prepend('<div id="shadow"></div>');
		$('#logo-modal').hide();
		$('#shadow').hide();
		if(logos !== undefined) {
			$('#logo-modal').append(logos);
			$('#shadow').fadeIn();
			$('#logo-modal').slideDown();
		}
	}
}

function hidePressModal() {
	$('#shadow').stop().fadeOut('slow', function() {
		$(this).remove();
	});
	$('#logo-modal').stop().slideUp('slow', function() {
		$(this).remove();
	});
}






jQuery(document).ready(function($){
	var cartWrapper = $('.cd-cart-container');
	var productId = 0;

	if ( cartWrapper.length > 0){
		//store jQuery objects
		var cartBody = cartWrapper.find('.body');
		var cartList = cartBody.find('ul').eq(0);
		var cartTotal = cartWrapper.find('.checkout').find('span');
		var cartTrigger = cartWrapper.children('.cd-cart-trigger');
		var cartCount = cartTrigger.children('.count');
		var addToCartBtn = $('.cd-add-to-cart');
		var undo = cartWrapper.find('.undo');
		var undoTimeoutId;

		//add product to cart
		addToCartBtn.on('click', function(event){
			event.preventDefault();
			addToCart($(this));

		});
		//open/close cart
		cartTrigger.on('click', function(event){
			event.preventDefault();
			toggleCart();
		});		
		//close cart when clicking on the .cd-cart-container::before (bg layer)
		cartWrapper.on('click', function(event){
			if( $(event.target).is($(this)) ) toggleCart(true);
		});

		//delete an item from the cart
		cartList.on('click', '.delete-item', function(event){
			event.preventDefault();
			removeProduct($(event.target).parents('.product'));
		});

		//update item quantity
		cartList.on('change', 'select', function(event){
			quickUpdateCart();
		});

		//reinsert item deleted from the cart
		undo.on('click', 'a', function(event){
			clearInterval(undoTimeoutId);
			event.preventDefault();
			cartList.find('.deleted').addClass('undo-deleted').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
				$(this).off('webkitAnimationEnd oanimationend msAnimationEnd animationend').removeClass('deleted undo-deleted').removeAttr('style');
				quickUpdateCart();
			});
			undo.removeClass('visible');
		});


	}

	function toggleCart(bool) {
		var cartIsOpen = ( typeof bool === 'undefined' ) ? cartWrapper.hasClass('cart-open') : bool;
		
		if( cartIsOpen ) {
			cartWrapper.removeClass('cart-open');
			//reset undo
			clearInterval(undoTimeoutId);
			undo.removeClass('visible');
			cartList.find('.deleted').remove();

			setTimeout(function(){
				cartBody.scrollTop(0);
				//check if cart empty to hide it
				if( Number(cartCount.find('li').eq(0).text()) == 0) cartWrapper.addClass('empty');
			}, 500);
		} else {
			cartWrapper.addClass('cart-open');
		}
	}	

	function addToCart(trigger){
		var cartIsEmpty = cartWrapper.hasClass('empty');
		//update product list
		addProduct();
		//update number of items
		updateCartCount(cartIsEmpty);
		//update total price
		updateCartTotal(trigger.data('price'),true);
		//show cart
		cartWrapper.removeClass('empty');
	}

	function addProduct(product){
		productId = productId + 1;
		var productAdded = $('<li class="product"><div class="product-image">\
			<a href="#0"><img src="images/food.png" width="160px" height="160px" alt="placeholder">\
			</a></div><div class="product-details"><h3><a href="#0">######</a>\
			</h3><span class="price">$10</span><div class="actions"><a href="#0" class="delete-item">Delete</a>\
			<div class="quantity"><label for="cd-product-'+ productId +'">Qty</label><span class="select">\
			<select id="cd-product-'+ productId +'" name="quantity">\
			<option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4\
			</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option></select></span></div></div></div></li>');
		cartList.prepend(productAdded);
	}
	function removeProduct(product) {
		clearInterval(undoTimeoutId);
		cartList.find('.deleted').remove();
		
		var topPosition = product.offset().top - cartBody.children('ul').offset().top ,
			productQuantity = Number(product.find('.quantity').find('select').val()),
			productTotPrice = Number(product.find('.price').text().replace('$', '')) * productQuantity;
		
		product.css('top', topPosition+'px').addClass('deleted');

		//update items count + total price
		updateCartTotal(productTotPrice, false);
		updateCartCount(true, -productQuantity);
		undo.addClass('visible');

		//wait 8sec before completely remove the item
		undoTimeoutId = setTimeout(function(){
			undo.removeClass('visible');
			cartList.find('.deleted').remove();
		}, 8000);
	}
	function quickUpdateCart() {
		var quantity = 0;
		var price = 0;
		
		cartList.children('li:not(.deleted)').each(function(){
			var singleQuantity = Number($(this).find('select').val());
			quantity = quantity + singleQuantity;
			price = price + singleQuantity*Number($(this).find('.price').text().replace('$', ''));
		});

		cartTotal.text(price.toFixed(2));
		cartCount.find('li').eq(0).text(quantity);
		cartCount.find('li').eq(1).text(quantity+1);
	}
	function updateCartCount(emptyCart, quantity) {
	if( typeof quantity === 'undefined' ) {
		var actual = Number(cartCount.find('li').eq(0).text()) + 1;
		var next = actual + 1;
		
		if( emptyCart ) {
			cartCount.find('li').eq(0).text(actual);
			cartCount.find('li').eq(1).text(next);
		} else {
			cartCount.addClass('update-count');

			setTimeout(function() {
				cartCount.find('li').eq(0).text(actual);
			}, 150);

			setTimeout(function() {
				cartCount.removeClass('update-count');
			}, 200);

			setTimeout(function() {
				cartCount.find('li').eq(1).text(next);
			}, 230);
		}
	} else {
		var actual = Number(cartCount.find('li').eq(0).text()) + quantity;
		var next = actual + 1;
		
		cartCount.find('li').eq(0).text(actual);
		cartCount.find('li').eq(1).text(next);
	}
	}

	function updateCartTotal(price, bool) {
		bool ? cartTotal.text( (Number(cartTotal.text()) + price).toFixed(2) )  : cartTotal.text( (Number(cartTotal.text()) - price).toFixed(2) );
	}


});




















































