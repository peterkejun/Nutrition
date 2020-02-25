import React from "react";
import logo from "./img/avocado.svg";
import {Link} from "react-router-dom";
import './ProfileFloater.css'

class LogIn extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            animate_appear: true,
            input_email: '',
            input_password: '',
            input_vcode: '',
            auth_step: props.user ? 'logged in' : 'logged out'
        };
        this.handle_input = this.handle_input.bind(this);
        this.send_log_in = this.send_log_in.bind(this);
        this.send_log_out = this.send_log_out.bind(this);
        this.request_verification = this.request_verification.bind(this);
        this.submit_verification = this.submit_verification.bind(this);

        this.floater_ref = React.createRef();
    }

    componentDidMount() {
        this.floater_ref.current.classList.toggle('is-visible');
    }

    componentDidUpdate() {
        this.floater_ref.current.classList.toggle('is-visible');
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
        const current_component = this
        fetch('http://127.0.0.1:5000/sign_out', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                'email': this.state.input_email
            })
        }).then(response => response.text())
            .then(response => {
                if (response === 'Logout Successful') {
                    current_component.props.logout();
                }
            })
    }

    request_verification() {
        fetch('http://127.0.0.1:5000/sign_in', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                'email': this.state.input_email,
                'password': this.state.input_password
            })
        }).then(response => response.text())
            .then(response => {
                console.log(response)
                if (response === 'Verification Email Sent') {
                    this.setState({
                        auth_step: 'not verified'
                    })
                }
            })
    }

    submit_verification() {
        fetch('http://127.0.0.1:5000/verify_sign_in', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            // credentials: 'include',
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                'email': this.state.input_email,
                'OTP': this.state.input_vcode
            })
        }).then(response => response.text())
            .then(response => {
                if (response === 'Verification Successful') {
                    this.setState({
                        auth_step: 'logged in'
                    })
                }
            })
    }

    render() {
        //user already logged in
        let step;
        if (this.state.auth_step === 'logged in') {
            step = (<div className={'profile-floater-container'} style={this.props.profile_floater_style} ref={this.floater_ref}>
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
            </div>);
        }
        //user has not logged in and has not verified
        else if (this.state.auth_step === 'logged out') {
            step = (<div className={'profile-floater-container'} style={this.props.profile_floater_style} ref={this.floater_ref}>
                <div id={'profile-floater-header-wrapper'}>
                    <h1 id={'profile-floater-header-title'}>Connect to<br />Avocado</h1>
                    <img id={'profile-floater-header-logo-img'} src={logo} alt={'logo'} />
                </div>
                <div id={'profile-floater-input-container'}>
                    <h2 className={'profile-floater-prompt-title'}>Already a member?</h2>
                    <input type={"username"} name={'input_email'} className="profile-floater-form" id="profile-floater-username-form" placeholder="USERNAME" value={this.state.input_email} onChange={this.handle_input} />
                    <input type={"password"} name={'input_password'} className="profile-floater-form" id="profile-floater-password-form" placeholder="PASSWORD" value={this.state.input_password} onChange={this.handle_input} />
                    <button type={'button'} className={'profile-floater-button btn'} id={'profile-floater-log-in-button'} onClick={this.request_verification}>Log In</button>
                    <div id={'profile-floater-or-wrapper'}>
                        <h2 className={'col-1 profile-floater-prompt-title'}>OR</h2>
                        <div className={'col-10'} id={'profile-floater-or-break'} />
                    </div>
                    <Link to={'/sign_up'} id={'profile-floater-sign-up-link'}>
                        <button type={'button'} className={'profile-floater-button btn'} id={'profile-floater-sign-up-button'}>Sign Up</button>
                    </Link>
                </div>
            </div>);
        }
        //user has logged in but has not verified
        // if (this.state.auth_step === 'not verified')
        else {
            step = (<div className={'profile-floater-container'} style={this.props.profile_floater_style} ref={this.floater_ref}>
                <div id={'profile-floater-header-wrapper'}>
                    <h1 id={'profile-floater-header-title'}>Verify Your<br />Avocado</h1>
                    <img id={'profile-floater-header-logo-img'} src={logo} alt={'logo'} />
                </div>
                <div id={'profile-floater-input-container'}>
                    <h4 id={'verification-sent-title'}>A verification code has been sent<br /> to your email at</h4>
                    <h2 id={'email-title'}>{this.state.input_email}</h2>
                    <hr id={'email-input-separator'} />
                    <h5 id={'enter-code-prompt-title'}>Enter your 6-digit verification code to proceed</h5>
                    <input type={"verification"} name={'input_vcode'} className="profile-floater-form" id="profile-floater-username-form" placeholder="VERIFICATION CODE" value={this.state.input_vcode} onChange={this.handle_input} />
                    <h3 id={'expire-title'}>Please note that your verification code will expire in 5 minutes.</h3>
                    <div className={'profile-floater-button-wrapper'} id={'profile-floater-log-out-wrapper'}>
                        <button type={'button'} className={'profile-floater-button btn'} id={'profile-floater-verify-button'} onClick={this.submit_verification}>Verify</button>
                    </div>
                </div>
            </div>)
        }
        return step;
    }

}

export default LogIn;