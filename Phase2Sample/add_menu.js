/** dummy data **/
const restaurant_menus = {
	'Riverview' : {
		'Breakfast' : {
			
		},
		'Lunch' : {
			
		}
	},
	'Green Street Cafe' : {
		'Brunch' : [
			{
				'name': 'Lemon Ricotta Pancakes',
				'ingredients': ['AP flour', 'baking powder', 'salt', 'sugar','ricotta', 'eggs', 'milk', 'lemon zest', 'lemon juice'],
				'allergies': ['no_nuts', 'kosher', 'halal', 'no_seafood']
			},{
				'name': 'Buckwheat Pancakes',
				'ingredients': ['buckwheat flour', 'GF baking powder', 'salt', 'sugar', 'eggs', 'milk'],
				'allergies': ['no_nuts', 'kosher', 'halal', 'no_gluten', 'no_seafood']
			},{
				'name': 'House Granola',
				'ingredients': ['oats', 'oil', 'salt', 'maple syrup', 'raisins', 'dates', 'dried apricots'],
				'allergies': ['no_nuts', 'kosher', 'halal', 'veg', 'vegan', 'no_seafood', 'no_gluten']
			}
		],
		'Lunch' : [
			{
				'name': 'sandwich of the day',
				'ingredients': ['varies'],
				'allergies': ['no_nuts']
			},{
				'name': 'House Pasta',
				'ingredients': ['AP flour', 'eggs', 'water', 'oil', 'tomatoes', 'spinach', 'onion', 'garlic', 'salt', 'pepper', 'spices and herbs'],
				'allergies': ['veg', 'vegan', 'kosher', 'halal', 'no_nuts', 'no_seafood']
			}
		]
	}
}

const restaurant_names = ['Select a Restaurant'].concat(Object.keys(restaurant_menus)).concat(['New...'])

const no_menus = ['Select a Menu', 'New...']

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

var RestaurantForm = React.createClass({
	onAddFormChange(evt) {
		if(evt.target.value == 'New...')
			document.getElementById('add_restaurant').style.display = 'block'
		else {
			this.props.onChange(evt.target.value)
			document.getElementById('add_restaurant').style.display = 'none'
		}
	},
	
	render() {
		const rest_options = []
		for (var i = 0; i < this.props.restaurants.length; i++) {
			rest_options.push(<option key={this.props.restaurants[i]}>{this.props.restaurants[i]}</option>)
		}
		
		return (
			<section className='form_box'>
				<h3>Select or Add a Restaurant</h3>
				<h3><select className='form_select' onChange={this.onAddFormChange}>
					{rest_options}
				</select>
				</h3>
				<section id='add_restaurant'>
					<div className='label'>Restaurant Name: </div>
					<input type='text' />
					<div className='label'>Short Description: </div>
					<input type='text' />
					<div className='label'>Cuisine: </div>
					<select>
						<option></option>
						<option>Canadian</option>
						<option>Mexican</option>
						<option>Italian</option>
						<option>Indian</option>
						<option>Greek</option>
						<option>Chinese</option>
					</select>
					
					<button type='submit'>Add Restaurant</button>
				</section>
			</section>
		)
	}
})

var MenuForm = React.createClass({
	getInitialState() {
		return {
			enabled: false,
			num_items: 1,
		}		
	},
	
	onMenuChange(evt) {
		if(evt.target.value == 'Other')
			document.getElementById('other_text').style.display = "block";
	},
	
	onAddFormChange(evt) {
		this.setState({enabled: evt.target.value != 'Select a Menu'})
	},
	
	addItem() {
		this.setState({num_items: this.state.num_items + 1})
	},
	
	render() {
		const menu_items = []
		for (var i = 0; i < this.state.num_items; i++) {
			menu_items.push(<ItemForm key={i}/>)
		}
		
		const menu_options = []
		for (var i = 0; i < this.props.menus.length; i++) {
			menu_options.push(<option key={this.props.menus[i]}>{this.props.menus[i]}</option>)
		}
		
		return (
			<section className='form_box'>
				<h3>Add or Edit a Menu</h3>
				<h3><select className='form_select' onChange={this.onAddFormChange}>
					{menu_options}
				</select></h3>
				<section id='menu_form'>
					<fieldset disabled={!this.state.enabled}>
						<div className='label'>Menu: </div>
						<select onChange={this.onMenuChange}>
							<option></option>
							<option>Breakfast</option>
							<option>Brunch</option>
							<option>Lunch</option>
							<option>Dinner</option>
							<option>Dessert</option>
							<option>Appetizers</option>
							<option>Bar</option>
							<option>Other</option>
						</select>
						<input id='other_text' type='text' placeholder='Other...' />
						<h4>Menu Items:</h4>
						{menu_items}
						
						<button id='add_item' onClick={this.addItem}>Add Menu Item</button>
						<button id='add_menu'>Add Menu</button>
						<button id='delete_menu'>Delete Menu</button>
					</fieldset>
				</section>
			</section>
		)
	}
})

var ItemForm = React.createClass({
	getInitialState() {
		return {
			enabled: false,
			num_ings: 1,
		}		
	},
	
	addIng() {
		this.setState({num_ings: this.state.num_ings + 1})
	},
	
	render() {
		const allergies = []
		for (var i = 0; i < icon_names.length; i++){
			allergies.push(
				<section className='allergy' key={icon_names[i]} >
					<input type='checkbox' />
					<img src={icons[icon_names[i]]} />
					{icon_names[i].replace("_" , " ")}
				</section>)
		}
		
		const ingredients = []
		for (var i = 0; i < this.state.num_ings; i++){
			ingredients.push(<Ingredient key={i} onClick={this.addIng} label={i==0}/>)
		}
		
		return (
			<section className='item_form'>
				<div className='label b'>Menu Item Name: </div>
				<input type='text' />
				<button id='add_meal_pic'>Upload Picture</button>
				{ingredients}
				<div className='label'>Allergies and Diets: </div>
				<section className='allergies'>{allergies}</section>
			</section>
		)
	}
})

var Ingredient = React.createClass({
	render() {
		return (
			<section className='ingredient'>
				<div className='label'>
					{this.props.label ? 'Ingredients:' : ''}
				</div>
				<input type='text' />
				<button className='add_ing' onClick={this.props.onClick}>+</button>
			</section>
		)
	}
})

var OuterWrapper = React.createClass({
	getInitialState() {
		return {
			menus: no_menus,
			restaurant: 'Select a Menu',
		}
	},
	
	setRestaurant(restaurant) {
		this.setState({
			restaurant: restaurant,
			menus: getMenuList(restaurant)
		})
	},
	
	render() {
		return (
			<section>
				<RestaurantForm restaurants={restaurant_names} onChange={this.setRestaurant}/>
				<MenuForm menus={this.state.menus} />
			</section>
		)
	}
})

ReactDOM.render(
	<OuterWrapper />,
	document.getElementById('add_menu_form')
)

function getMenuList(restaurant) {
	var menus = Object.keys(restaurant_menus[restaurant])
	return ['Select a Menu'].concat(menus).concat(['New...'])
}