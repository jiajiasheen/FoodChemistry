/** dummy examples **/

$(function(){

	$('.input_button').on('click',function(){
		var text = $('.input_text').val();
		postText = '<div class="post">' + text + '</div>';	
		$('.post_feed').append(postText);
		
		
	});



});












const icons = {
	veg: 'icons/veg.png',
	vegan: 'icons/vegan.png',
	kosher: 'icons/kosher.png',
	halal: 'icons/halal.png',
	no_nuts: 'icons/no_nuts.png',
	no_gluten: 'icons/no_gluten.png',
	no_seafood: 'icons/no_seafood.png',	
}

const icon_names = Object.keys(icons)

const example_meal_info = {
	'Mac and Cheese': {
		photo: '',
		restaurant: 'Riverview Cafe',
		menu: 'Lunch',
		likes: '6.2k',
		allergies: {
			veg: true,
			kosher: true,
			halal: true,
			no_nuts: true,
			no_seafood: true,
		},
		like_users: 'user1, user2, user3, user4, etc'
	},
	'Pesto Pizza': {
		photo: '',
		restaurant: 'Sam\'s Pizzeria',
		menu: 'Dinner',
		likes: '4.6k',
		allergies: {
			vegan: true,
			kosher: true,
			halal: true,
			no_seafood: true,
		},
		like_users: 'user1, user2, user3, user5, user8, user13, etc'
	},
	'Clam Chowder': {
		photo: '',
		restaurant: 'Boston Harbor',
		menu: 'Lunch',
		likes: '997',
		allergies: {
			veg: true,
			halal: true,
			no_nuts: true,
			no_gluten: true,
		},
		like_users: 'user11, user13, user17, user19, user23, etc'
	},
}

const meals = Object.keys(example_meal_info)
//choose random meal (just for phase2 prototype)
const name = meals[Math.floor(Math.random() * meals.length)];
const info = example_meal_info[name]


var Meal = React.createClass({
	getInitialState() {
		return {
			photo: 'images/meals/default_meal.jpg',
		}
	},
	
	iconClick(evt) {
		evt.currentTarget.className += ' clicked'
	},
	
	render() {
		const photo = (this.props.info.photo == '') ? this.state.photo : this.props.info.photo
		const true_icons = []
		for (let i = 0; i < icon_names.length; i++) {
			let name = icon_names[i]
			if (this.props.info.allergies[name]) {
				true_icons.push(
					<tr key={icons[name]}>
						<td><img src={icons[name]} /></td>
						<td><figure className='confirm' onClick={this.iconClick}></figure>{Math.floor(Math.random() * 500)}</td>
						<td><figure className='report' onClick={this.iconClick}></figure>{Math.floor(Math.random() * 500)}</td>
					</tr>)
			}
		}

		return (
			<section className='meal_wrapper'>
				<div className='meal'>
					<h1>{this.props.name}</h1>
					<section className='meal_left'>
						<figure className='meal_icon'>
							<img src={photo} />
						</figure>
						<div id='like_button'>Like</div>
						<div id='likes'>
							{this.props.info.likes}
						</div>
						<figcaption id='like_users'>
							Liked by: {this.props.info.like_users}
						</figcaption>
					</section>
					<table className='meal_info'><tbody>
						{true_icons}
					</tbody></table>
				</div>
				<Restaurant name={this.props.info.restaurant} menu={this.props.info.menu}/>
			</section>
		)
	}
})

var Restaurant = React.createClass({
	render() {
		return (
			<section className='restaurant'>
				<h2>Restaurant: {this.props.name}</h2>
				<h2>Menu: {this.props.menu}</h2>
			</section>
		)
	}
})

ReactDOM.render(
	<Meal name={name} info={info} />,
	document.getElementById('menu_item')
)

//Hide/show users that liked on mouseover/mouseout
document.getElementById('likes').onmouseover = function() {
	document.getElementById('like_users').style.display = 'block';
}

document.getElementById('likes').onmouseout = function() {
	document.getElementById('like_users').style.display = 'none';
}