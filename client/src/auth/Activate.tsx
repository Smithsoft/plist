import React from 'react'
import Layout from '../core/Layout'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { RouteComponentProps } from 'react-router'

import jwt from 'jsonwebtoken'

type ClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => void

type TParams = { token: string }

type PropType = RouteComponentProps<TParams>

interface ActivationPayload {
    name: string
    token: string
}

type StateType = {
    name: string
    token: string
    show: boolean
}

class Activate extends React.Component<PropType, StateType> {
    state = {
        name: '',
        token: '',
        show: true
    }

    componentDidMount(): void {
        const token = this.props.match.params.token
        const { name } = jwt.decode(token) as ActivationPayload
        if (token) {
            this.setState({ ...this.state, name, token })
        }
    }

    clickHandler(): ClickHandler {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return (_e: React.MouseEvent<HTMLButtonElement>) => {
            const url = `${process.env.REACT_APP_API}/account-activation`
            const token = this.state.token
            axios
                .post(url, { token })
                .then((response) => {
                    console.log('ACTIVATE SUCCESS')
                    this.setState({ ...this.state, name: '', show: false })
                    toast.success(response.data.message)
                })
                .catch((error) => {
                    console.log('ACTIVATE ERROR', error.response.data)
                    toast.error(error.response.data.error)
                })
        }
    }

    displayButton(): JSX.Element | undefined {
        if (this.state.show) {
            return (
                <button className="btn btn-outline-primary" onClick={this.clickHandler()}>
                    Activate Account
                </button>
            )
        }
    }

    activationLink(): JSX.Element {
        return (
            <div className="text-center">
                <h1 className="p-5 text-center">Hey {name}, ready to activate your account?</h1>
                <p>{this.displayButton()}</p>
            </div>
        )
    }

    render(): JSX.Element {
        return (
            <Layout>
                <div className="col-md-6 offset-md-3">
                    <ToastContainer />
                    {this.activationLink()}
                </div>
            </Layout>
        )
    }
}

export default Activate
