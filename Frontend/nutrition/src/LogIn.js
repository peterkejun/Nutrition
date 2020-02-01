import React from "react";
import logo from "./img/avocado.svg";
import {Link} from "react-router-dom";

class LogIn extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            input_email: '',
            input_password: '',
        };
        this.handle_input = this.handle_input.bind(this);
        this.send_log_in = this.send_log_in.bind(this);
        this.send_log_out = this.send_log_out.bind(this);
    }

    handle_input(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    send_log_in() {
        this.props.login(this.state.input_email, this.state.input_password);
    }

    send_log_out() {
        this.props.logout();
    }

    render() {
        return this.props.user ?
            (<div id={'profile-floater-container'} style={this.props.profile_floater_style}>
                <div id={'profile-floater-user-info-wrapper'}>
                    <img id={'profile-floater-user-img'} src={this.props.user ? this.props.user.photoURL : null} />
                    <h1 id={'profile-floater-username-title'}>{this.props.user ? this.props.user.displayName : 'Not signed in yet'}</h1>
                </div>
                <div className={'profile-floater-button-wrapper'} id={'profile-floater-manage-wrapper'}>
                    <button type={'button'} className={'profile-floater-button btn'} id={'profile-floater-manage-button'}>Manage your account</button>
                </div>
                <div className={'profile-floater-button-wrapper'} id={'profile-floater-log-out-wrapper'}>
                    <button type={'button'} className={'profile-floater-button btn'} id={'profile-floater-log-out-button'} onClick={this.send_log_out}>Log Out</button>
                </div>
            </div>)
            :
            (<div id={'profile-floater-container'} style={this.props.profile_floater_style}>
            <div id={'profile-floater-header-wrapper'}>
                <h1 id={'profile-floater-header-title'}>Connect to<br />Avocado</h1>
                <img id={'profile-floater-header-logo-img'} src={logo} alt={'logo'} />
            </div>
            <div id={'profile-floater-input-container'}>
                <h2 className={'profile-floater-prompt-title'}>Already a member?</h2>
                <input type={"username"} name={'input_email'} className="profile-floater-form" id="profile-floater-username-form" placeholder="USERNAME" value={this.state.input_email} onChange={this.handle_input} />
                <input type={"password"} name={'input_password'} className="profile-floater-form" id="profile-floater-password-form" placeholder="PASSWORD" value={this.state.input_password} onChange={this.handle_input} />
                <button type={'button'} className={'profile-floater-button btn'} id={'profile-floater-log-in-button'} onClick={this.send_log_in}>Log In</button>
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

}

export default LogIn;