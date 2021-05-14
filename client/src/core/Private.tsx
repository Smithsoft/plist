import React from 'react'
import Layout from '../core/Layout'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { ToastContainer, toast } from 'react-toastify'

import { Redirect, RouteComponentProps } from 'react-router-dom'
import { getCookie, isAuth, signout, updateUser } from '../auth/helpers'
import { User } from '../types/User'
import { ErrorResponse } from '../types/ErrorResponse'

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
        console.log('PRIVATE COMPONENT >>> mount <<< #####')

        const login = isAuth()
        const user = login as User
        const token = getCookie('token')

        console.log('User: ', login)
        console.log('Token: ', token)
        //
        if (login && token) {
            this.loadProfile(user, token)
        } else {
            console.log('PRIVATE PROFILE UPDATE ISSUE - token or user missing')
            console.log('Login: ', login)
            console.log('Token: ', token?.substr(0, 10))
            signout(() => {
                this.props.history.push('/')
            })
        }
    }

    loadProfile(user: User, token: string): void {
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
            .catch((error: AxiosError<ErrorResponse>) => {
                const serverError = error.response?.data.error ?? 'Unknown'
                console.log('PRIVATE PROFILE UPDATE ERROR: ', serverError)
                if (error.response?.status == 401) {
                    // expired token - sign user out to clear invalid token
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
        const token = getCookie('token')
        const { name, password } = this.state
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        this.setState({ ...this.state, buttonText: 'Submitting...' })
        const url = `${process.env.REACT_APP_API}/user/update`
        const data = { name, password }
        axios
            .put(url, data, config)
            .then((response) => {
                console.log('PRIVATE PROFILE UPDATE SUCCESS: ', response)
                updateUser(response, () => {
                    this.setState({ ...this.state, buttonText: 'Submitted' })
                    toast.success('Profile updated successfully')
                })
            })
            .catch((error: AxiosError<ErrorResponse>) => {
                const serverError = error.response?.data.error ?? 'Unknown'
                console.log('PRIVATE PROFILE UPDATE ERROR: ', serverError)
                this.setState({ ...this.state, buttonText: 'Submit' })
                if (error.response?.status == 401) {
                    // expired token - sign user out to clear invalid token
                    toast.error('Login expired. Please sign in again.')
                    signout(() => {
                        this.props.history.push('/')
                    })
                } else {
                    toast.error(serverError)
                }
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
        console.log('PRIVATE COMPONENT RENDER #####')
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
