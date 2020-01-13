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
            first_nutrients: [],
            nutrients: {},
        };
        this.vitamins_ids = [324, 876, 418, 415, 874, 401, 339, 324, 876, 430];
        this.first_nutrients = [205, 203, 204, 1000];
    }

    /*
        205 : {name: 'Carbohydrates', unit: 'GRAMS', amount: 0}
    */


    componentDidMount() {
        // const current_component = this;
        // const getNutrientsConsumption = functions.httpsCallable('getNutrientsConsumption');
        // getNutrientsConsumption({text: 'hello'}).then(function(result) {
        //     console.log(result)
        //     if (Object.keys(result).length === 0) return;
        //     let nutrients = {};
        //     const ids = Object.keys(result.data);
        //     for (const id of ids) {
        //         nutrients[id] = {
        //             amount: result.data[id],
        //         }
        //     }
        //     fetch('http://127.0.0.1:5000/nutrient_name_and_unit_of_ids', {
        //         method: 'Post',
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(ids),
        //     }).then(response => response.json())
        //         .then(data => {
        //             for (const id of Object.keys(data)) {
        //                 nutrients[id].name = data[id].name;
        //                 nutrients[id].unit = data[id].unit;
        //             }
        //             current_component.setState({
        //                 nutrients: nutrients,
        //                 first_nutrients: [
        //                     [205, nutrients[205] ?? {amount: 0, name: 'Carbohydrates', unit: 'GRAMS'}],
        //                     [203, nutrients[203] ?? {amount: 0, name: 'Protein', unit: 'GRAMS'}],
        //                     [204, nutrients[204] ?? {amount: 0, name: 'Fat', unit: 'GRAMS'}],
        //                     [1000, nutrients[1000] ?? {amount: 0, name: 'Vitamins', unit: 'MILLIGRAMS'}]
        //                 ]
        //             });
        //             // 203: {amount: 45.2, name: "PROTEIN", unit: "g"}
        //             // 204: {amount: 90, name: "FAT (TOTAL LIPIDS)", unit: "g"}
        //             // 205: {amount: 325, name: "CARBOHYDRATE, TOTAL (BY DIFFERENCE)", unit: "g"}
        //             // 1000: {name: "VITAMINS", unit: "mg", amount: 0}
        //             // console.log(current_component.state.first_nutrients.map(id => nutrients[id]))
        //         })
        // })
    }

    render() {
        console.log(this.props.user);
        if (this.props.user != null) {
            fetch('http://127.0.0.1:5000/user_nutrition_history', {
                method: 'Post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uid: this.props.user.uid,
                    date: '20200113'
                })
            }).then(response => response.json())
                .then(data => {
                    console.log(data);
                });
        }

        const first_nutrients_img_src = [Carbohydrates, Protein, Fat, Vitamins];
        return <div className={'offset-2 col-10'} id={'dashboard-container'}>
            <div id={'first-nutrients-wrapper'}>
                {
                    this.state.first_nutrients.map((arr, key) => (
                        <div className={'col-3 first-nutrient-wrapper'}>
                            <div className={'first-nutrient-inner-wrapper'}>
                                <div className={'first-nutrient-name-wrapper'}>
                                    <img className={'first-nutrient-img'} src={first_nutrients_img_src[key]} alt={'first nutrients'} />
                                    <h1 className={'first-nutrient-title'}>{arr[1].name}</h1>
                                </div>
                                <div className={'first-nutrient-numbers-wrapper'}>
                                    <div className={'first-nutrient-numbers-wrapper-1'}>
                                        <h1 className={'first-nutrient-number-title'}>{arr[1].amount}</h1>
                                        <h2 className={'first-nutrient-unit-title'}>{arr[1].unit}</h2>
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