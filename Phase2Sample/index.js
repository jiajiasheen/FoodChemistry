/** dummy data **/
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
		restaurant: 'Restaurant',
		menu: 'Lunch',
		likes: '6.2k',
		details: {
			veg: true,
			kosher: true,
			halal: true,
			no_nuts: true,
			no_seafood: true,
		}
	},
	'Pesto Pizza': {
		photo: '',
		restaurant: 'Restaurant',
		menu: 'Dinner',
		likes: '4.6k',
		details: {
			vegan: true,
			kosher: true,
			halal: true,
			no_seafood: true,
		}
	},
	'Clam Chowder': {
		photo: '',
		restaurant: 'Restaurant',
		menu: 'Lunch',
		likes: '997',
		details: {
			veg: true,
			halal: true,
			no_nuts: true,
			no_gluten: true,
		}
	}
}

const example_meals = Object.keys(example_meal_info)
const example_searches = ['Pasta', 'Carrot Cake', 'Calamari']
const example_menus = ['Green Street - Brunch', 'Green Street - Lunch', 'Riverview - Dinner', 'Riverview - Appetizers']

var MealList = React.createClass({	
	render() {
		const meals = []
		for (let i = 0; i < this.props.meals.length; i++) {
			if(this.props.search) {
				meals.push(<li key={this.props.meals[i]}><header className='listitem_name'>{this.props.meals[i]}</header></li>)
			} else {
				meals.push(<MealListItem key={this.props.meals[i]} name={this.props.meals[i]} info={this.props.meal_info[this.props.meals[i]]} />)
			}
		}
		
		return (
			<section className='meal_list_div' id={this.props.id}>
				<h2 className='list_header'>{this.props.name}</h2>
				<ul className='meal_list'>
					{meals}
				</ul>
			</section>
		)
	}
})

var MealListItem = React.createClass({
	getInitialState() {
		return {
			icon: 'images/meals/default_meal.jpg'
		}
	},
	
	render() {
		const photo = (this.props.info.photo == '') ? this.state.icon : this.props.info.photo
		
		return (
			<li onClick={() => loadMenuItem(this.props.name, this.props.info)}>
				<img className='listitem_icon' src={this.state.photo} />
				<div className='listitem_name'>{this.props.name}</div>
				<div className='listitem_likes'>{this.props.info.likes}</div>
			</li>
		)
	}
})

ReactDOM.render(
	<section className='list_container'>
		<MealList name='LATEST MEALS' meals={example_meals} meal_info={example_meal_info}/>
		<MealList name='POPULAR MEALS' meals={example_meals} meal_info={example_meal_info}/>
		<MealList name='TOP SEARCHES' search='true' meals={example_searches} meal_info={{}}/>
		<MealList id='my_menus' name='MY MEALS' search='true' meals={example_menus} meal_info={{}}/>
		<MealList id='my_views' name='RECENT VIEWS' meals={example_meals} meal_info={example_meal_info}/>
		<MealList id='my_likes' name='MY LIKED MEALS' meals={example_meals} meal_info={example_meal_info}/>
	</section>,
	document.getElementById('dashboard')
)

//User type switching (for phase2 prototype demo)
var radios = document.getElementsByClassName('user_radio')
for (var i = 0; i < radios.length; i++) {
	radios[i].onclick = function(evt) {
		var val = evt.target.value
		if (val == 'none') {
			document.getElementById('login_button').style.display = 'block'
			document.getElementById('account_icon').style.display = 'none'
			document.getElementById('my_menus').style.display = 'none'
			document.getElementById('my_views').style.display = 'none'	
			document.getElementById('my_likes').style.display = 'none'	
		} else {
			document.getElementById('login_button').style.display = 'none'
			document.getElementById('account_icon').style.display = 'block'
			if (val == 'owner') {
				document.getElementById('my_menus').style.display = 'block'
				document.getElementById('my_views').style.display = 'none'	
				document.getElementById('my_likes').style.display = 'none'				
			} else if (val == 'customer') {
				document.getElementById('my_menus').style.display = 'none'
				document.getElementById('my_views').style.display = 'block'	
				document.getElementById('my_likes').style.display = 'block'				
			} else if (val == 'admin') {
				document.getElementById('my_menus').style.display = 'none'
				document.getElementById('my_views').style.display = 'none'
				document.getElementById('my_likes').style.display = 'none'
			}
			
		}
	}
}
