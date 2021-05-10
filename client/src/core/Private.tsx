import React from 'react'
import Layout from '../core/Layout'
import axios, { AxiosRequestConfig } from 'axios'
import { ToastContainer, toast } from 'react-toastify'

import { Redirect, RouteComponentProps } from 'react-router-dom'
import { getCookie, isAuth, signout } from '../auth/helpers'
import { User } from '../types/User'

type StateType = {
    role: string
    name: string
    email: string
    password: string
    buttonText: string
}

type ChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void

class Private extends React.Component<RouteComponentProps, StateType> {
    state = {
        role: '',
        name: '',
        email: '',
        password: '',
        buttonText: 'Submit'
    }

    componentDidMount(): void {
        this.loadProfile()
    }

    loadProfile(): void {
        const login = isAuth()
        const user = login as User
        const token = getCookie('token')
        const conf: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        axios
            .get<User>(`${process.env.REACT_APP_API}/user/${user._id}`, conf)
            .then((response) => {
                console.log('PROFILE UPDATE', response)
                const { role, name, email } = response.data
                this.setState({ ...this.state, role, name, email })
            })
            .catch((error) => {
                console.log('PRIVATE PROFILE UPDATE ERROR', error.response.data.console.error)
                if (error.response.status == 401) {
                    signout(() => {
                        this.props.history.push('/')
                    })
                }
            })
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

    updateForm(): JSX.Element {
        const { role, name, email, password, buttonText } = this.state
        return (
            <form>
                <div className="form-group">
                    <label htmlFor="updateFormRole" className="text-muted">
                        Role
                    </label>
                    <input readOnly type="text" className="form-control" value={role} id="updateFormRole" />
                </div>
                <div className="form-group">
                    <label htmlFor="updateFormName" className="text-muted">
                        Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        onChange={this.handleChange('name')}
                        value={name}
                        id="updateFormName"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="updateFormEmail" className="text-muted">
                        Email
                    </label>
                    <input readOnly type="email" className="form-control" value={email} id="updateFormEmail" />
                </div>
                <div className="form-group">
                    <label htmlFor="updateFormPassword" className="text-muted">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        onChange={this.handleChange('password')}
                        value={password}
                        id="updateFormPassword"
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
                    {!isAuth() ? <Redirect to="/" /> : null}
                    <h1 className="pt-5 text-center">Private</h1>
                    <p className="lead text-center">Profile update</p>
                    {this.updateForm()}
                </div>
            </Layout>
        )
    }
}

export default Private
