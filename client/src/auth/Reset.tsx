import React from 'react'
import Layout from '../core/Layout'
import axios, { AxiosError } from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { RouteComponentProps } from 'react-router-dom'
import { UpdateResponse } from '../types/UpdateResponse'

import jwt from 'jsonwebtoken'

type ChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void

type TParams = { token: string }

type PropType = RouteComponentProps<TParams>

type StateType = {
    name: string
    token: string
    newPassword: string
    buttonText: string
}

class Reset extends React.Component<PropType, StateType> {
    state = {
        name: '',
        token: '',
        newPassword: '',
        buttonText: 'Submit'
    }

    constructor(props: PropType) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount(): void {
        const token = this.props.match.params.token
        const { name } = jwt.decode(token) as { name: string }
        this.setState({ ...this.state, name, token })
    }

    handleChange(): ChangeHandler {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({ ...this.state, newPassword: e.target.value })
        }
    }

    clickSubmit(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault()
        this.setState({ ...this.state, buttonText: 'Submitting...' })
        const url = `${process.env.REACT_APP_API}/reset-password`
        axios
            .put<UpdateResponse>(url, {
                newPassword: this.state.newPassword,
                resetPasswordLink: this.state.token
            })
            .then((response) => {
                console.log('SIGNIN SUCCESS')
                toast.success(response.data.message)
                this.setState({ ...this.state, buttonText: 'Submit' })
            })
            .catch((error: Error | AxiosError<UpdateResponse>) => {
                if (axios.isAxiosError(error)) {
                    console.log('SIGNIN ERROR', error.response?.data)
                    toast.error(error.response?.data.error ?? 'Something went wrong: try again')
                    this.setState({ ...this.state, buttonText: 'Submit' })
                } else {
                    console.log
                }
            })
    }

    resetPasswordForm(): JSX.Element {
        return (
            <form>
                <div className="form-group">
                    <label htmlFor="resetPasswordForm" className="text-muted">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        onChange={this.handleChange()}
                        value={this.state.newPassword}
                        id="resetPasswordForm"
                        placeholder="Type new password"
                        required
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
                    <h1>Hey {this.state.name}, type your new password</h1>
                    {this.resetPasswordForm()}
                </div>
            </Layout>
        )
    }
}

export default Reset
