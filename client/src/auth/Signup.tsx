import React from 'react'
import Layout from '../core/Layout'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'

import { Redirect } from 'react-router-dom'
import { isAuth } from './helpers'

type PropType = unknown

type StateType = {
    name: string
    email: string
    password: string
    buttonText: string
}

type ChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void

class Signup extends React.Component<PropType, StateType> {
    state = {
        name: 'Sarah',
        email: 'sarah@storybridge.org',
        password: '123456',
        buttonText: 'Submit'
    }

    handleChange(name: string): ChangeHandler {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            console.log(`Handling: ${name} - ${event}`)
            this.setState({ ...this.state, [name]: event.target.value })
        }
    }

    clickSubmit(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault()
        const { name, email, password } = this.state
        this.setState({ ...this.state, buttonText: 'Submitting...' })
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/signup`,
            data: { name, email, password }
        })
            .then((response) => {
                console.log('SIGNUP SUCCESS')
                this.setState({ ...this.state, name: '', email: '', password: '', buttonText: 'Submitted' })
                toast.success(response.data.message)
            })
            .catch((error) => {
                console.log('SIGNUP ERROR', error.response.data)
                this.setState({ ...this.state, buttonText: 'Submit' })
                toast.error(error.response.data.error)
            })
    }

    signupForm(): JSX.Element {
        const { name, email, password, buttonText } = this.state
        return (
            <form>
                <div className="form-group">
                    <label htmlFor="signupFormName" className="text-muted">
                        Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        onChange={this.handleChange('name')}
                        value={name}
                        id="signupFormName"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="signupFormEmail" className="text-muted">
                        Email
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        onChange={this.handleChange('email')}
                        value={email}
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
                        value={password}
                        id="signupFormPassword"
                    />
                </div>
                <div>
                    <button className="btn btn-primary" onClick={(e) => this.clickSubmit(e)}>
                        {buttonText}
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
                    <h1>Signup</h1>
                    {this.signupForm()}
                </div>
            </Layout>
        )
    }
}

export default Signup
