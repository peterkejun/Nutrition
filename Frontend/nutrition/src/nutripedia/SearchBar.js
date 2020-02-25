import React from "react";
import search_icon from '../img/search muted.png';
import './SearchBar.css';

class SearchBar extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            search_content: '',
            list: ['1', '2', '3', '4'],
        };
        this.handle_input = this.handle_input.bind(this);
    }

    handle_input(e) {

    }

    render() {
        return <div id={'search-bar-container'}>
            <div id={'search-bar-wrapper'}>
                <img id={'search-bar-icon-img'} src={search_icon} alt={'search'} />
                <input type={'search'} name={'search'} id={'search-bar-form'} placeholder={'Find a nutrient'}
                       value={this.state.search_content} onChange={this.handle_input} />
            </div>
            <div id={'search-bar-dropdown-container'} style={{display: this.props.list.length === 0 ? 'none' : 'block'}}>
                <ul id={'search-bar-list'}>
                    {
                        this.props.list.map((item, i) =>
                            <li className={'search-bar-list-item'} key={i}>{item}</li>
                        )
                    }
                </ul>
            </div>
        </div>
    }

}

export default SearchBar;