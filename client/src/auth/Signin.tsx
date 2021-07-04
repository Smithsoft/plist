import React from 'react'
import Layout from '../core/Layout'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'

import { AuthenticationResponse } from '../types/AuthenticationResponse'

import { authenticate, isAuth } from './helpers'
import { Link, Redirect, RouteComponentProps, withRouter } from 'react-router-dom'

type StateType = {
    email: string
    password: string
    buttonText: string
}

type ChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void

// RouteComponentProps - needed here to get the history object
// https://stackoverflow.com/questions/51152417/react-with-typescript-property-push-does-not-exist-on-type-history

class Signin extends React.Component<RouteComponentProps, StateType> {
    state = {
        email: '',
        password: '',
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
                    const u = isAuth()
                    u && this.props.history.push(u.role === 'admin' ? '/admin' : '/private')
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
                    <br />
                    <Link to="/auth/password/forgot" className="btn btn-sm btn-outline-danger">
                        Forgot Password
                    </Link>
                </div>
            </Layout>
        )
    }
}

export default withRouter(Signin)
