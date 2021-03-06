import React from 'react'
import Layout from '../core/Layout'
import axios, { AxiosError } from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { UpdateResponse } from '../types/UpdateResponse'

type PropType = unknown

type StateType = {
    email: string
    buttonText: string
}

type ChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void

class Forgot extends React.Component<PropType, StateType> {
    state = {
        email: '',
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
        this.setState({ ...this.state, buttonText: 'Submitting...' })
        const url = `${process.env.REACT_APP_API}/forgot-password`
        const { email } = this.state // destructure to shorthand properties
        axios
            .put<UpdateResponse>(url, { email })
            .then((response) => {
                console.log('SIGNIN SUCCESS')
                // eg: "Check your email for new password reset link"
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

    passwordForgotForm(): JSX.Element {
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
                    <h1>Forgot password</h1>
                    {this.passwordForgotForm()}
                </div>
            </Layout>
        )
    }
}

export default Forgot
