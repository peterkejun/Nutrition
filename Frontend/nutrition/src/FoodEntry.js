import React from "react";
import './FoodEntry.css';

class FoodEntry extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            input_food: '',
            food_groups: [],
            search_filter: []
        };
        this.handle_input = this.handle_input.bind(this);
        this.handle_blur = this.handle_blur.bind(this);
        this.timeout = null;
    }

    componentDidMount() {
        fetch('http://127.0.0.1:5000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query: 'query{allFoodGroups{FoodGroupName,FoodGroupIconIndex}}'
            })
        }).then(response => response.json())
            .then(data => {
                this.setState({
                    food_groups: data['data']['allFoodGroups']
                })
            })
    }

    handle_input(e) {
        clearTimeout(this.timeout);
        const component = this;
        this.timeout = setTimeout(function() {
            fetch('http://127.0.0.1:5000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    query: 'query{foodNameLike(name:"' + component.state.input_food + '"){FoodID,FoodDescription}}'
                })
            }).then(response => response.json())
                .then(data => {
                    component.setState({
                        search_filter: data['data']['foodNameLike']
                    })
                })
        }, 500);
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handle_blur(e) {
        this.setState({
            search_filter: []
        })
    }

    render() {
        return <div id={'food-entry-container'}>
            <h1 id={'food-entry-prompt'}>What did you eat?</h1>
            <input type={"food"} name={'input_food'} id="food-entry-form" placeholder="Apple, Pickle Burger, Caeser Salad, etc."
                   value={this.state.input_food} onChange={this.handle_input} onFocus={this.handle_input_focus} onBlur={this.handle_blur}/>
            <div id={'food-groups-container'}>
                {
                    this.state.food_groups.map((food_group, i) =>
                        <div className={'food-group-wrapper'} key={i}>
                            <img className={'food-group-icon'} src={require('./img/food_icons/' + food_group['FoodGroupIconIndex'] + '.svg')} alt={food_group['FoodGroupName']} />
                            <h1 className={'food-group-title'}>{food_group['FoodGroupName']}</h1>
                        </div>
                    )
                }
            </div>
            <div id={'food-entry-dropdown'}>
                <ul className={'food-entry-dropdown-list'}>
                    {
                        this.state.search_filter.map((entry) => entry['FoodDescription']).map((food_description, i) =>
                            <li className={'food-entry-dropdown-list-item'} key={i}>{food_description}</li>
                        )
                    }
                </ul>
            </div>
        </div>
    }

}

export default FoodEntry;