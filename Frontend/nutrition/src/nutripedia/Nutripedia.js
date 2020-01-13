import React from "react";
import {database} from "../firebase";
import search_icon from '../img/search muted.png';
import './SearchBar.css';
import './Nutripedia.css';

class Nutripedia extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.handle_browse_all = this.handle_browse_all.bind(this);
        this.user = null;
        this.state = {
            nutrients_today: {},
            search_list: [],
            list: {},
            selected_nutrient: {},
            random_nutrients: [],
        };
        this.handle_input = this.handle_input.bind(this);
    }

    handle_input(e) {
        if (e.target.value === '') {
            this.setState({
                search_list: [],
            });
        } else {
            //linear search of elements (153 count)
            let search_list = [];
            const uppercase_value = e.target.value.toUpperCase();
            for (const [id, name] of Object.entries(this.state.list)) {
                if (name.startsWith(uppercase_value)) {
                    search_list.push([id, name])
                }
            }
            search_list.sort(function (a, b) {
                return (a[1] < b[1]) ? -1 : (a[1] > b[1]) ? 1 : 0;
            });
            this.setState({
                search_list: search_list,
            })
        }
    }

    componentDidMount() {
        //fetch all nutrients
        fetch('http://127.0.0.1:5000/all_nutrients_names_and_ids', {
            method: 'Get',
        }).then(response => response.json())
            .then(data => {
                this.setState({
                    list: data,
                })
            }).then(() => {
                //fetch random 6 nutrients' wikipedia summary
                const arr = Object.entries(this.state.list);
                let wiki_urls = [];
                for (let i = 0; i < 6; i++) {
                    // const rand = Math.floor(Math.random() * 6);
                    const rand = i + 5;
                    wiki_urls.push('https://en.wikipedia.org/api/rest_v1/page/summary/' +
                        arr[rand][1][0] + arr[rand][1].slice(1).toLowerCase() + '?redirect=true');
                }
                Promise.all(wiki_urls.map(url => fetch(url, {method: 'Get'}).then(response => response.json())))
                    .then(data => {
                        this.setState({
                            random_nutrients: data,
                        })
                    })
            }
        )
    }

    select_nutrient(id, name, src) {
        for (let i = 0; i < name.length; i++) {
            if (name[i] === '(') {
                name = name.slice(0, i);
                break;
            } else if (name[i] === ',') {
                name = name.slice(0, i);
                break;
            }
        }
        fetch('https://en.wikipedia.org/api/rest_v1/page/html/' + name[0].toUpperCase() + name.slice(1).toLowerCase(), {
            method: 'Get',
        }).then(response => response.text())
            .then(html => {
                const HtmlToReactParser = require('html-to-react').Parser;
                const parser = new HtmlToReactParser();
                const reactElement = parser.parse(html);
                this.setState({
                    selected_nutrient: {id: id, name: name, data: reactElement},
                    search_list: src === 'search' ? [] : this.state.search_list,
                })
            })
    }

    handle_browse_all() {

    }

    date_string(date) {
        let month = '' + (date.getMonth() + 1);
        let day = '' + date.getDate();
        let year = date.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [year, month, day].join('');
    }

    render() {
        //collect history nutrients
        if (this.user == null && this.props.user != null) {
            this.user = this.props.user;
            const today = new Date();
            const path = 'nutrition_history/' + this.user.id + '/' + this.date_string(today);
            const current_component = this;
            database.ref(path).once('value').then(function (snapshot) {
                if (snapshot.val() == null) return;
                console.log(snapshot.val())
                const ids = snapshot.val().split(':');
                fetch('http://127.0.0.1:5000/nutrients_names_of_ids', {
                    method: 'Post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(ids),
                }).then(response => response.json())
                    .then(data => {
                        console.log(data)
                        current_component.setState({
                            nutrients: data,
                        })
                    })
            }, function (error) {
                console.log(error);
            });
        }
        return <div className={'offset-md-2 col-md-10 display-container'} id={'nutripedia-container'}>
            <div className={'col-9'} id={'nutripedia-center-wrapper'}>
                <div id={'nutripedia-header-wrapper'}>
                    <div id={'nutripedia-header-search-wrapper'}>
                        <h1 id={'nutripedia-header-search-title'}>Nutri-pedia</h1>
                        <h3 id={'nutripedia-header-search-subtitle'}>Your encyclopedia for nutrition</h3>
                        <div id={'search-bar-container'}>
                            <div id={'search-bar-wrapper'}>
                                <img id={'search-bar-icon-img'} src={search_icon} alt={'search'} />
                                <input type={'search'} name={'search'} id={'search-bar-form'} placeholder={'Find a nutrient'} value={this.state.search_content} onChange={this.handle_input} />
                            </div>
                            <div id={'search-bar-dropdown-container'} style={{display: this.state.search_list.length === 0 ? 'none' : 'block'}}>
                                <ul id={'search-bar-list'}>
                                    {
                                        this.state.search_list.map((entry, key) =>
                                            <li className={'search-bar-list-item'} key={key} onClick={this.select_nutrient.bind(this, entry[0], entry[1], 'search')}><div>{entry[1]}</div></li>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                        <button type={'button'} id={'nutripedia-header-browse-all-button'} onClick={this.handle_browse_all}>Browse All</button>
                    </div>
                    <div id={'nutripedia-header-history-wrapper'}>
                        <h2 id={'nutripedia-header-history-title'}>The Ones You Had Today</h2>
                        <div id={'nutripedia-header-history-nutrients-wrapper'}>
                            {
                                Object.keys(this.state.nutrients_today).length === 0 ?
                                    <div id={'nutripedia-header-history-no-entries-wrapper'}>
                                        <h3 id={'nutripedia-header-history-no-entries-title'}>
                                            No entries for today.<br />Keep track of your meals?
                                        </h3>
                                        <button className={'btn-sm btn-primary'}>Go to Dashboard</button>
                                    </div>
                                    :
                                    Object.entries(this.state.nutrients_today).map(([key, value]) => {
                                    return <div className={'nutrient-wrapper'} key={key}>
                                        <h3 className={'nutrient-title'}>{value}</h3>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
                <div id={'nutripedia-display-wrapper'}>
                    {
                        Object.keys(this.state.selected_nutrient).length === 0 ?
                            (<div className={'card-columns'}>
                                {
                                   this.state.random_nutrients.map((nutrient, key) =>
                                    <div className={'card nutripedia-nutrient-card'} key={key}>
                                        <div className={'nutripedia-card-img-wrapper'}>
                                            <img src={nutrient.thumbnail.source} className={'card-img-top nutripedia-nutrient-card-img'}
                                             alt={'thumbnail'} style={{maxWidth: nutrient.thumbnail.width, maxHeight: nutrient.thumbnail.height}}/>
                                        </div>
                                        <div className={'card-body nutripedia-nutrient-card-body'}>
                                            <h5 className={'card-title nutripedia-nutrient-card-title'}>{nutrient.displaytitle}</h5>
                                            <p className={'card-text nutripedia-nutrient-card-text'}>{nutrient.extract}</p>
                                            <button className={'btn-sm btn-primary nutripedia-nutrient-button'}>Read More</button>
                                        </div>
                                    </div>
                                    )
                                }
                            </div>)
                            :
                            <div id={'nutripedia-wiki-page-wrapper'}>
                                <h1 id={'nutripedia-wiki-page-title'}>{this.state.selected_nutrient.name}</h1>
                                <div>{this.state.selected_nutrient.data}</div>
                            </div>
                        }
                </div>
            </div>
            <div className={''} id={'nutripedia-right-wrapper'}>
                <div id={'nutripedia-right-list-wrapper'}>
                    {
                        Object.entries(this.state.list).map(([key, value]) =>
                                <div className={'nutripedia-right-list-item'} key={key} onClick={this.select_nutrient.bind(this, key, value, 'list')}>{value}</div>
                        )
                    }
                </div>
            </div>
        </div>
    }

}

export default Nutripedia;