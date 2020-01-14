import React from "react";
import {auth} from './firebase';
import Carbohydrates from './img/Carbohydrates.svg';
import Protein from './img/Protein.svg';
import Fat from './img/Fat.svg';
import Vitamins from './img/Vitamins.svg';
import './Dashboard.css';

class Dashboard extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            nutrient_history: {},
        };
        this.user = null;
        this.vitamins_ids = [324, 876, 418, 415, 874, 401, 339, 324, 876, 430];
    }

    /*
        205 : {name: 'Carbohydrates', unit: 'GRAMS', amount: 0}
    */


    componentDidMount() {
    }

    render() {
        if (this.props.user) {
            console.log(this.props.user.uid)
            console.log(JSON.stringify({
                    uid: this.props.user.uid,
                    date: '20200113'
                }))
            fetch('http://127.0.0.1:5000/user_nutrition_history', {
                method: 'Post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: this.props.user.uid,
                    date: '20200113'
                })
            }).then(response => response.json())
                .then(data => {
                    console.log(data);
                })
        }
        let first_nutrients = [
            [205, 'Carbohydrates', Carbohydrates, 'GRAMS'],
            [203, 'Protein', Protein, 'GRAMS'],
            [204, 'Fat', Fat, 'GRAMS'],
            [1000, 'Vitamins', Vitamins, 'MILLIGRAMS']
        ];
        for (let i = 0; i < first_nutrients.length; i++) {
            if (this.state.nutrient_history[first_nutrients[i][0]]) {
                first_nutrients[i].push(this.state.nutrient_history[first_nutrients[i][0]].amount ?? 0);
            } else {
                first_nutrients[i].push(0);
            }
        }

        return <div className={'offset-2 col-10'} id={'dashboard-container'}>
            <div id={'first-nutrients-wrapper'}>
                {
                    first_nutrients.map((info, key) => (
                        <div className={'col-3 first-nutrient-wrapper'} key={key}>
                            <div className={'first-nutrient-inner-wrapper'}>
                                <div className={'first-nutrient-name-wrapper'}>
                                    <img className={'first-nutrient-img'} src={info[2]} alt={'first nutrients'} />
                                    <h1 className={'first-nutrient-title'}>{info[1]}</h1>
                                </div>
                                <div className={'first-nutrient-numbers-wrapper'}>
                                    <div className={'first-nutrient-numbers-wrapper-1'}>
                                        <h1 className={'first-nutrient-number-title'}>{info[4]}</h1>
                                        <h2 className={'first-nutrient-unit-title'}>{info[3]}</h2>
                                    </div>
                                    <div className={'first-nutrient-numbers-wrapper-2'}>
                                        <div className={'first-nutrient-trend-title'}>TREND</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    }

}

export default Dashboard;