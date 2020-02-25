import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import './SignUp.css'
import logo from "../img/avocado.svg";
import vegetables from '../img/vegetables.png';
import google_button from '../img/google_button.svg';
import {Redirect} from 'react-router';

class SignUp extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            user: null,
            redirect: false,
        };
        this.create_account = this.create_account.bind(this);
        this.handle_input_change = this.handle_input_change.bind(this);
    }

    handle_input_change(e) {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    create_account() {
        const first_name = this.state.first_name;
        const last_name = this.state.last_name;
        const email = this.state.email;
        const password = this.state.password;
        if (this.email_valid(email) && this.password_valid(password)) {
            fetch('http://127.0.0.1:5000/sign_up', {
                method: 'Post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    display_name: first_name + '\ ' + last_name
                })
            }).then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.setState({
                        user: data,
                        redirect: true
                    })
                })
        }
    }

    email_valid(em) {
        return true;
    }

    password_valid(pw) {
        return true;
    }


    render() {
        if (this.state.redirect)
            return <Redirect push to={{
                pathname: '/',
                state: {
                    user: this.state.user
                }
            }} />;
        return <div id={'sign-up-container'}>
            <div className={'col-4'} id={'sign-up-side-bar'}>
                <div id={'sign-up-logo-container'}>
                    <img id={'nav-bar-logo-img'} src={logo} alt={'logo'} />
                    <h1 id={'nav-bar-logo-title'}>NUTRITION</h1>
                </div>
                <div id={'sign-up-side-bar-text-wrapper'}>
                    <div id={'sign-up-side-bar-vertical-line'} />
                    <div id={'sign-up-side-bar-text-section-wrapper'}>
                        <div className={'sign-up-side-bar-text-section'} id={'sign-up-keep-section'}>
                            <div className={'sign-up-side-bar-text-section-bullet'} id={'sign-up-keep-bullet'} />
                            <h2 className={'sign-up-side-bar-text-section-text'} id={'sign-up-keep-text'}>Keep track of your diet</h2>
                        </div>
                        <div className={'sign-up-side-bar-text-section'} id={'sign-up-plan-section'}>
                            <div className={'sign-up-side-bar-text-section-bullet'} id={'sign-up-plan-bullet'} />
                            <h2 className={'sign-up-side-bar-text-section-text'} id={'sign-up-plan-text'}>Plan tomorrow's diet</h2>
                        </div>
                        <div className={'sign-up-side-bar-text-section'} id={'sign-up-find-section'}>
                            <div className={'sign-up-side-bar-text-section-bullet'} id={'sign-up-find-bullet'} />
                            <h2 className={'sign-up-side-bar-text-section-text'} id={'sign-up-find-text'}>Find equal-nutrient alternatives</h2>
                        </div>
                    </div>
                </div>
                <div id={'sign-up-side-bar-img-container'}>
                    <img id={'sign-up-side-bar-img'} src={vegetables} alt={'vegetables'} />
                </div>
            </div>
            <div className={'col-8'} id={'sign-up-methods-container'}>
                <div className={'offset-1 col-7'} id={'sign-up-methods-wrapper'}>
                    <h1 id={'sign-up-prompt'}>Sign up to Avocado</h1>
                    <img id={'sign-up-google-button'} src={google_button} alt={'google'} />
                    <div id={'sign-up-or-wrapper'}>
                        <div className={'sign-up-or-break'} id={'sign-up-or-break-left'} />
                        <h6 id={'sign-up-or-title'}>OR</h6>
                        <div className={'sign-up-or-break'} id={'sign-up-or-break-right'} />
                    </div>
                    <div id={'sign-up-name-wrapper'}>
                        <div className={'sign-up-input-wrapper'} id={'sign-up-first-name-input-wrapper'}>
                            <h5 className={'sign-up-input-prompt-title'} id={'sign-up-first-name-prompt-title'}>FIRST NAME</h5>
                            <input type={"username"} name={'first_name'} className="sign-up-form" id="sign-up-first-name-form" placeholder="John" value={this.state.first_name} onChange={this.handle_input_change} />
                        </div>
                        <div className={'sign-up-input-wrapper'} id={'sign-up-last-name-input-wrapper'}>
                            <h5 className={'sign-up-input-prompt-title'} id={'sign-up-last-name-prompt-title'}>LAST NAME</h5>
                            <input type={"username"} name={'last_name'} className="sign-up-form" id="sign-up-last-name-form" placeholder="Avocado" value={this.state.last_name} onChange={this.handle_input_change} />
                        </div>
                    </div>
                    <div className={'sign-up-input-wrapper'} id={'sign-up-email-input-wrapper'}>
                        <h5 className={'sign-up-input-prompt-title'} id={'sign-up-email-prompt-title'}>EMAIL ADDRESS</h5>
                        <input type={"email"} name={'email'} className="sign-up-form" id="sign-up-email-form" placeholder="john.avocado@example.com" value={this.state.email} onChange={this.handle_input_change} />
                    </div>
                    <div className={'sign-up-input-wrapper'} id={'sign-up-password-input-wrapper'}>
                        <h5 className={'sign-up-input-prompt-title'} id={'sign-up-password-prompt-title'}>PASSWORD</h5>
                        <input type={"password"} name={'password'} className="sign-up-form" id="sign-up-password-form" placeholder="8+ Characters with at least 1 sign (+, - & #, etc.)" value={this.state.password} onChange={this.handle_input_change} />
                    </div>
                    <button type={'button'} className={'col-5 sign-up-button btn'} id={'sign-up-button'} onClick={this.create_account}>Create Account</button>
                </div>
            </div>
        </div>
    }

}

export default SignUp;