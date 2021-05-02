import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { RouteComponentProps } from 'react-router'

import jwt from 'jsonwebtoken'

type TParams = { token: string }

type PropType = RouteComponentProps<TParams>

interface ActivationPayload {
    name: string
    token: string
}

const Activate: React.FC<PropType> = ({ match }) => {
    const [values, setValues] = useState({
        name: '',
        token: '',
        show: true
    })

    useEffect(() => {
        const token = match.params.token
        const { name } = jwt.decode(token) as ActivationPayload
        console.log(`Effect ran ${token}`)
        if (token) {
            setValues({ ...values, name, token })
        }
    }, [])

    const clickHandler = () => {
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/account-activation`,
            data: { token }
        })
            .then((response) => {
                console.log('SIGNUP SUCCESS')
                setValues({ ...values, name: '', show: false })
                toast.success(response.data.message)
            })
            .catch((error) => {
                console.log('SIGNUP ERROR', error.response.data)
                toast.error(error.response.data.error)
            })
    }

    const { name, token, show } = values

    const displayButton = () => {
        if (show) {
            return (
                <button className="btn btn-outline-primary" onClick={clickHandler}>
                    Activate Account
                </button>
            )
        }
    }

    const activationLink = () => (
        <div className="text-center">
            <h1 className="p-5 text-center">Hey {name}, ready to activate your account?</h1>
            <p>{displayButton()}</p>
        </div>
    )

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <ToastContainer />
                {activationLink()}
            </div>
        </Layout>
    )
}

export default Activate
