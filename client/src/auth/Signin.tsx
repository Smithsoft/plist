import React from 'react'
import Layout from '../core/Layout'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'

import { AuthenticationResponse } from '../types/AuthenticationResponse'

import { authenticate, isAuth } from './helpers'
import { Redirect } from 'react-router-dom'

type PropType = unknown

type StateType = {
    email: string
    password: string
    buttonText: string
}

type ChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void

class Signin extends React.Component<PropType, StateType> {
    state = {
        email: 'sarah@storybridge.org',
        password: '123456',
        buttonText: 'Sign In'
    }

    handleChange(name: string): ChangeHandler {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            console.log(`Handling: ${name} - ${event}`)
            this.setState({ ...this.state, [name]: event.target.value })
        }
    }

    clickSubmit(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault()
        this.setState({ ...this.state, buttonText: 'Signing in...' })
        const url = `${process.env.REACT_APP_API}/signin`
        const { email, password } = this.state // destructure to shorthand properties
        axios
            .post<AuthenticationResponse>(url, { email, password })
            .then((response) => {
                console.log('SIGNIN SUCCESS')
                authenticate(response, () => {
                    // save the response (user, token)
                    this.setState({ ...this.state, email: '', password: '', buttonText: 'Signed In' })
                    //toast.success(`Hey ${response.data.user.name}, welcome back!`)
                    if (isAuth() && (isAuth as User).role === 'admin')
                })
            })
            .catch((error) => {
                console.log('SIGNIN ERROR', error.response.data)
                toast.error(error.response.data.error)
                this.setState({ ...this.state, buttonText: 'Sign In' })
            })
    }

    signinForm(): JSX.Element {
        return (
            <form>
                <div className="form-group">
                    <label htmlFor="signupFormEmail" className="text-muted">
                        Email
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        onChange={this.handleChange('email')}
                        value={this.state.email}
                        id="signupFormEmail"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="signupFormPassword" className="text-muted">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        onChange={this.handleChange('password')}
                        value={this.state.password}
                        id="signupFormPassword"
                    />
                </div>
                <div>
                    <button className="btn btn-primary" onClick={(e) => this.clickSubmit(e)}>
                        {this.state.buttonText}
                    </button>
                </div>
            </form>
        )
    }

    render(): JSX.Element {
        return (
            <Layout>
                <div className="col-md-6 offset-md-3">
                    <ToastContainer />
                    {isAuth() ? <Redirect to="/" /> : null}
                    <h1>Sign In</h1>
                    {this.signinForm()}
                </div>
            </Layout>
        )
    }
}

export default Signin
