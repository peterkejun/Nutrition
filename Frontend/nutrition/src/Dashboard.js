import React from "react";
import {auth} from './firebase';
import Circle from 'react-circle';
import Carbohydrates from './img/Carbohydrates.svg';
import Protein from './img/Protein.svg';
import Fat from './img/Fat.svg';
import Vitamins from './img/Vitamins.svg';
import './Dashboard.css';
import TrendGraph from "./TrendGraph.js";

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
        if (this.props.user && Object.keys(this.state.nutrient_history).length === 0) {
            fetch('http://127.0.0.1:5000/user_nutrition_history', {
                method: 'Post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    localId: this.props.user.localId,
                    date: '20200125',
                    type: 'day'
                })
            }).then(response => response.json())
                .then(data => {
                    this.setState({
                        nutrient_history: data
                    })
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
            <div className={'container-fluid'} id={'dashboard-wrapper'}>
                <div className={'row'}>
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
                <div className={'row'}>
                    <div className={'col-3'} id={'portion-nutrients-wrapper'}>
                        <div id={'portion-nutrients-inner-wrapper'}>
                            <div id={'portion-nutrients-title-wrapper'}>
                                <h1 id={'portion-nutrients-title'}>Portions</h1>
                            </div>
                            <div id={'portion-list-inner-wrapper'}>
                                {
                                    Object.keys(this.state.nutrient_history).map((id, key) => (
                                        <div className={'portion-nutrient-wrapper'} key={key}>
                                            <div className={'portion-nutrient-text-wrapper'}>
                                                <h2 className={'portion-nutrient-title'}>{this.state.nutrient_history[id]['info']['name_en']}</h2>
                                                <h3 className={'portion-nutrient-portion-title'}>{this.state.nutrient_history[id]['amount']}</h3>
                                            </div>
                                            <div className={'portion-nutrient-graph-wrapper'}>
                                                <Circle animate={true}
                                                        animationDuration={'0.5s'}
                                                        responsive={true}
                                                        size={40}
                                                        lineWidth={40}
                                                        progress={this.state.nutrient_history[id]['amount']}
                                                        progressColor={'#E8E288'}
                                                        bgColor={'rgba(232,226,136,0.2)'}
                                                        textColor={'#E8E288'}
                                                        roundedStroke={true}
                                                        showPercentage={true} />
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className={'col-9'} id={'graph-nutrients-wrapper'}>
                        <div id={'graph-nutrients-inner-wrapper'}>
                            <div id={'graph-nutrients-title-wrapper'}>
                                <h1 id={'graph-nutrients-title'}>Nutrition Trend</h1>
                            </div>
                            <TrendGraph />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    }

}

export default Dashboard;

// <Circle
//   animate={true} // Boolean: Animated/Static progress
//   animationDuration="1s" //String: Length of animation
//   responsive={true} // Boolean: Make SVG adapt to parent size
//   size={150} // Number: Defines the size of the circle.
//   lineWidth={14} // Number: Defines the thickness of the circle's stroke.
//   progress={69} // Number: Update to change the progress and percentage.
//   progressColor="cornflowerblue"  // String: Color of "progress" portion of circle.
//   bgColor="whitesmoke" // String: Color of "empty" portion of circle.
//   textColor="hotpink" // String: Color of percentage text color.
//   textStyle={{
//     font: 'bold 5rem Helvetica, Arial, sans-serif' // CSSProperties: Custom styling for percentage.
//   }}
//   percentSpacing={10} // Number: Adjust spacing of "%" symbol and number.
//   roundedStroke={true} // Boolean: Rounded/Flat line ends
//   showPercentage={true} // Boolean: Show/hide percentage.
//   showPercentageSymbol={true} // Boolean: Show/hide only the "%" symbol.
// />