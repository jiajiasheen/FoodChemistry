/** dummy examples **/
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

const meal_names = ['Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Dessert', 'Appetizers', 'Bar']

const example_search = 'Vegetarian Bibimbap'

const example_filters = {
	'allergies': ['veg', 'halal', 'no_gluten'],
	'ingredients': ['egg'],
	'cuisines': [],
	'meal': 'Lunch'
}

const example_results = [
	{
		meal: 'Dolsot Bibimbap',
		restaurant: 'Buk Change Dong Soon To Fu',
		allergies: ['veg', 'halal', 'no_nuts', 'no_seafood', 'no_gluten'],
		ingredients: ['rice', 'mushroom', 'zucchini', 'spinach', 'egg', 'etc'],
		likes: 4310
	},
	{
		meal: 'Bibimbap',
		restaurant: 'Miss Korea',
		allergies: ['veg', 'halal', 'no_gluten'],
		ingredients: ['rice', 'egg', 'three', 'four', 'five', 'etc'],
		likes: 2377
	},
	{
		meal: 'Fresh Tofu Bibimbap',
		restaurant: 'Sunrise Hosue',
		allergies: ['veg', 'halal', 'no_gluten', 'no_seafood'],
		ingredients: ['rice', 'egg', 'three', 'four', 'five', 'etc'],
		likes: 1234
	}
]

var Filters = React.createClass({
	render() {
		const allergies = []
		for (var i = 0; i < icon_names.length; i++){
			allergies.push(
				<div className='allergy' key={icon_names[i]} >
					<input type='checkbox' checked={(this.props.filters.allergies.indexOf(icon_names[i]) != -1) ? 'checked' : ''}/>
					<img src={icons[icon_names[i]]} />
					{icon_names[i].replace("_" , " ")}
				</div>)
		}
		
		const ingredients = []
		for (var i = 0; i < this.props.filters.ingredients.length; i++) {
			ingredients.push(
				<div className='ingredient' key={this.props.filters.ingredients[i]}>
					{this.props.filters.ingredients[i]}
				</div>
			)
		}
		
		const cuisines = []
		
		const meals = []
		for (var i = 0; i < meal_names.length; i++){
			meals.push(
				<article className='meal' key={meal_names[i]} >
					<input type='radio' name='meal' checked={(this.props.filters.meal == meal_names[i]) ? 'checked' : ''}/>
					{meal_names[i].replace("_" , " ")}
				</article>)
		}
		
		return (
		<section className='filters'>
			<div className='label b'>Allergies</div>
			<section className='filter_box'>
				{allergies}
			</section>
			<div className='label b'>Ingredients</div>
			<section className='filter_box'>
				{ingredients}
			</section>
			<div className='label b'>Cuisine</div>
			<section className='filter_box'>
				{cuisines}
			</section>
			<div className='label b'>Meal</div>
			<section className='filter_box'>
				{meals}
			</section>
			<button id='update_filters'>Update Filters</button>
		</section>
		)
	}
})

var Results = React.createClass({
	
	render() {
		var results = []
		for (var i = 0; i < this.props.results.length; i++){
			results.push(<MenuItem key={this.props.results[i].meal.replace(/ /g, '')} details={this.props.results[i]}/>)
		}
		
		return (<ul className='results'>{results}</ul>)
	}
	
})

var MenuItem = React.createClass({
	
	goToItem(evt) {
		evt.currentTarget.getElementsByTagName('a')[0].click()
	},
	
	render() {
		var item = this.props.details
		var item_name = item.meal.replace(/ /g, '')
		var ingredients = item.ingredients.join(', ')
		
		var allergies = []
		item.allergies.sort()
		for (let i = 0; i < item.allergies.length; i++) {
			allergies.push(<img key={item.allergies[i]} className='allergy' src={'icons/' + item.allergies[i] + '.png'} />)
		}
		
		return (
			<li key={item_name} className={'item '+item_name} title={ingredients} onClick={this.goToItem}>
					<img src='' />
					<h3 className='name'>{item.meal}</h3>
					<section className='likes'>{item.likes}</section>
					<section className='restaurant'>from {item.restaurant}</section>
					<section className='allergies'>{allergies}</section>
					<a href='./menu_item.html'></a>
			</li>
		)
	}
})

ReactDOM.render(
	<main className='search_page'>
		<h1>Search for: {example_search}</h1>
		<Filters filters={example_filters}/>
		<Results results={example_results}/>
	</main>,
	document.getElementById('search_div')
)