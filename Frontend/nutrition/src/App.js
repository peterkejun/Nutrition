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
import userEvent from "@testing-library/user-event";

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
        this.log_in = this.log_in.bind(this);
        this.log_out = this.log_out.bind(this);
        this.handle_input = this.handle_input.bind(this);
    }

    componentDidMount() {
         // if (this.props.location.state && this.props.location.state.user) {
         //     this.setState({
         //         user: this.props.location.state.user
         //     })
         // }
         // else {
         //     fetch('http://127.0.0.1:5000/current_user', {
         //         method: 'Get'
         //     }).then(response => response.json())
         //         .then(data => {
         //             this.setState({
         //                 user: data
         //             })
         //         })
         // }
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

    handle_input(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    log_in() {
        const email = this.state.input_email;
        const password = this.state.input_password;
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
                    })
                })
        }
    }

    email_valid(em) {
        return true;
    }

    password_valid(pw) {
        return true
    }

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
        {
            this.state.user ?
            (<div id={'profile-floater-container'} style={profile_floater_style}>
                <div id={'profile-floater-user-info-wrapper'}>
                    <img id={'profile-floater-user-img'} src={this.state.user ? this.state.user.photoURL : null} />
                    <h1 id={'profile-floater-username-title'}>{this.state.user ? this.state.user.displayName : 'Not signed in yet'}</h1>
                </div>
                <div className={'profile-floater-button-wrapper'} id={'profile-floater-manage-wrapper'}>
                    <button type={'button'} className={'profile-floater-button btn'} id={'profile-floater-manage-button'}>Manage your account</button>
                </div>
                <div className={'profile-floater-button-wrapper'} id={'profile-floater-log-out-wrapper'}>
                    <button type={'button'} className={'profile-floater-button btn'} id={'profile-floater-log-out-button'} onClick={this.log_out}>Log Out</button>
                </div>
            </div>)
            :
            (<div id={'profile-floater-container'} style={profile_floater_style}>
            <div id={'profile-floater-header-wrapper'}>
                <h1 id={'profile-floater-header-title'}>Connect to<br />Avocado</h1>
                <img id={'profile-floater-header-logo-img'} src={logo} alt={'logo'} />
            </div>
            <div id={'profile-floater-input-container'}>
                <h2 className={'profile-floater-prompt-title'}>Already a member?</h2>
                <input type={"username"} name={'input_email'} className="profile-floater-form" id="profile-floater-username-form" placeholder="USERNAME" value={this.state.input_email} onChange={this.handle_input} />
                <input type={"password"} name={'input_password'} className="profile-floater-form" id="profile-floater-password-form" placeholder="PASSWORD" value={this.state.input_password} onChange={this.handle_input} />
                <button type={'button'} className={'profile-floater-button btn'} id={'profile-floater-log-in-button'} onClick={this.log_in}>Log In</button>
                <div id={'profile-floater-or-wrapper'}>
                    <h2 className={'col-1 profile-floater-prompt-title'}>OR</h2>
                    <div className={'col-10'} id={'profile-floater-or-break'} />
                </div>
                <Link to={'/sign_up'} id={'profile-floater-sign-up-link'}>
                    <button type={'button'} className={'profile-floater-button btn'} id={'profile-floater-sign-up-button'}>Sign Up</button>
                </Link>
            </div>
        </div>)
        }
        { section_component }
    </div>)
    }
}

export default App;
