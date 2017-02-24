/** dummy data **/
const brunch_menu = [
	{
		'name': 'Lemon Ricotta Pancakes',
		'ingredients': ['AP flour', 'baking powder', 'salt', 'sugar','ricotta', 'eggs', 'milk', 'lemon zest', 'lemon juice'],
		'allergies': ['no_nuts', 'kosher', 'halal', 'no_seafood', 'veg'],
		'likes': 145
	},{
		'name': 'Buckwheat Pancakes',
		'ingredients': ['buckwheat flour', 'GF baking powder', 'salt', 'sugar', 'eggs', 'milk'],
		'allergies': ['no_nuts', 'kosher', 'halal', 'no_gluten', 'no_seafood', 'veg'],
		'likes': 228
	},{
		'name': 'House Granola',
		'ingredients': ['oats', 'oil', 'salt', 'maple syrup', 'raisins', 'dates', 'dried apricots'],
		'allergies': ['no_nuts', 'kosher', 'halal', 'veg', 'vegan', 'no_seafood', 'no_gluten'],
		'likes': 97
	}
]

var MenuItems = React.createClass({
	onClick(evt) {
		//first is 'like_button', second is meal name
		var meal = evt.target.getAttribute('class').split(' ')[1]
		var meal_div = document.getElementsByClassName('item ' + meal)[0]
		
		meal_div.className += ' liked'
	},
	
	goToItem(evt) {
		evt.currentTarget.getElementsByTagName('a')[0].click()
	},
	
	render() {
		const menu_list = []
		const like_buttons = []
		for (var i = 0; i < this.props.items.length; i++) {
			var item = this.props.items[i]
			var item_name = item.name.replace(/ /g, '')
			var ingredients = item.ingredients.join(', ')
			
			var allergies = []
			item.allergies.sort()
			for (let i = 0; i < item.allergies.length; i++) {
				allergies.push(<img key={item.allergies[i]} className='allergy' src={'icons/' + item.allergies[i] + '.png'} />)
			}
			
			menu_list.push(
				<li key={item_name} className={'item '+item_name} title={ingredients} onClick={this.goToItem}>
					<img src='' />
					<section className='name'>{item.name}</section>
					<section className='likes'>{item.likes}</section>
					<section className='allergies'>{allergies}</section>
					<a href='./menu_item.html'></a>
				</li>)
				
			like_buttons.push(
				<figure className={'like_button '+item_name} key={item_name} onClick={this.onClick}></figure>
			)
		}
		
		return (
			<section id='menu_wrapper'>
				<ul id='menu_list'>
					{menu_list}
				</ul>
				<ul id='like_list'>
					{like_buttons}
				</ul>
			</section>
		)
	}
})

var Menu = React.createClass({
	render() {
		return (
			<section className='menu'>
				<h1>{this.props.menu_name} at {this.props.restaurant}</h1>
				<MenuItems items={brunch_menu}/>
			</section>
		)
	}
})

ReactDOM.render(
	<Menu menu_name='Brunch' restaurant='Green Street Cafe'/>,
	document.getElementById('menu_div')
)