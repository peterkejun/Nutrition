import React from 'react';
import {Link} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import './navbar.css';
import './sidebar.css';
import './ProfileFloater.css';
import logo from './img/avocado.svg';
import search from './img/search.png';
import bell from './img/bell.png';
import collapse from './img/collapse.png';
import dashboard from './img/activity.png';
import today from './img/calendar.png';
import today_muted from './img/calendar_muted.png';
import lookup from './img/book.png';
import lookup_muted from './img/book_muted.png';
import Nutripedia from "./nutripedia/Nutripedia";
import Dashboard from "./Dashboard";
import LogIn from "./LogIn";

class App extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            section: 'Dashboard',
            show_floater: false,
            user: null,
            input_email: '',
            input_password: '',
        };
    }

    componentDidMount() {
         if (this.state.user == null) {

         }
    }

    switch_section(new_section) {
        if (this.state.section === new_section)
            return;
        this.setState({
            section: new_section,
        });
    }

    toggle_floater() {
        this.setState({
            show_floater: !this.state.show_floater,
        });
    }

    log_in = (email, password) => {
        console.log('email: ' + email + ' password: ' + password);
        if (this.email_valid(email) && this.password_valid(password)) {
            fetch('http://127.0.0.1:5000/sign_in', {
                method: 'Post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }).then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.setState({
                        user: data
                    });
                })
        }
    };

    email_valid = (email) => {
        return true;
    };

    password_valid = (password) => {
        return true
    };

    log_out() {
        this.setState({
            user: null
        })
    }

    render() {
        const profile_floater_style = {
            display: this.state.show_floater ? 'flex' : 'none',
        };
        let section_component;
        switch (this.state.section) {
            case 'Lookup': section_component = (<Nutripedia user={this.state.user} />); break;
            default: section_component = (<Dashboard user={this.state.user}/>);
        }
        return (
    <div className="App">
        <div className={'col-md-12'} id={'nav-bar'}>
            <div className={'col-md-2'} id={'nav-bar-logo-container'}>
                <div>
                    <img id={'nav-bar-logo-img'} src={logo} alt={'logo'} />
                    <h1 id={'nav-bar-logo-title'}>NUTRITION</h1>
                </div>
            </div>
            <div className={'col-md-7'} id={'nav-bar-search-container'}>
                <img id={'nav-bar-search-img'} src={search} alt={'search'} />
                <h2 id={'nav-bar-search-placeholder'}>Search</h2>
            </div>
            <div className={'col-md-1'} id={'nav-bar-notification-container'}>
                <img id={'nav-bar-notification-img'} src={bell} alt={'notification'} />
            </div>
            <div className={'col-md-2'} id={'nav-bar-user-container'} onClick={this.toggle_floater.bind(this)}>
                <img id={'nav-bar-user-profile-img'} src={this.state.user ? this.state.user.photoURL : null} />
                <h3 id={'nav-bar-user-title'}>{this.state.user ? this.state.user.displayName : 'Sign In'}</h3>
                <img id={'nav-bar-collapse-button-img'} src={collapse} alt={'collapse'} />
            </div>
        </div>
        <div className={'col-md-2'} id={'side-bar'}>
            <div className={'col-md-11'} id={'side-bar-wrapper'}>
                <div className={'sidebar-section-container'} id={'sidebar-dashboard-container'}>
                    <img className={'sidebar-section-img'} id={'sidebar-dashboard-img'} src={dashboard} alt={'dashboard'} />
                    <h1 className={'sidebar-section-title'} id={'sidebar-dashboard-title'} onClick={this.switch_section.bind(this, 'Dashboard')}>Dashboard</h1>
                </div>
                <div className={'sidebar-subsection-container'} id={'sidebar-today-container'}>
                    <img className={'sidebar-subsection-img'} id={'sidebar-today-img'} src={this.state.section === 'Today' ? today : today_muted} alt={'dashboard'} />
                    <h1 className={'sidebar-subsection-title'} id={'sidebar-today-title'} onClick={this.switch_section.bind(this, 'Today')}>Today</h1>
                </div>
                <div className={'sidebar-subsection-container'} id={'sidebar-lookup-container'}>
                    <img className={'sidebar-subsection-img'} id={'sidebar-lookup-img'} src={this.state.section === 'Lookup' ? lookup : lookup_muted} alt={'dashboard'} />
                    <h1 className={'sidebar-subsection-title'} id={'sidebar-lookup-title'} onClick={this.switch_section.bind(this, 'Lookup')}>Nutrition</h1>
                </div>
            </div>
        </div>
        <LogIn profile_floater_style={profile_floater_style} user={this.state.user} login={this.log_in} logout={this.log_out}/>
        { section_component }
    </div>)
    }
}

export default App;
