import React, { useState } from 'react'
import Layout from '../core/Layout'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import { AuthenticationResponse } from '../types/AuthenticationResponse'

import { authenticate, isAuth } from './helpers'
import { Redirect } from 'react-router-dom'

const Signin: React.FC = () => {
    const [values, setValues] = useState({
        email: 'sarah@storybridge.org',
        password: '123456',
        buttonText: 'Sign In'
    })

    const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(`Handling: ${name} - ${event}`)
        setValues({ ...values, [name]: event.target.value })
    }

    const clickSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setValues({ ...values, buttonText: 'Signing in...' })
        const url = `${process.env.REACT_APP_API}/signin`
        axios
            .post<AuthenticationResponse>(url, { email, password })
            .then((response) => {
                console.log('SIGNIN SUCCESS')
                authenticate(response, () => {
                    // save the response (user, token)
                    setValues({ ...values, email: '', password: '', buttonText: 'Signed In' })
                    toast.success(`Hey ${response.data.user.name}, welcome back!`)
                })
            })
            .catch((error) => {
                console.log('SIGNIN ERROR', error.response.data)
                toast.error(error.response.data.error)
                setValues({ ...values, buttonText: 'Sign In' })
            })
    }

    const { email, password, buttonText } = values

    const signinForm = () => (
        <Form>
            <Form.Group controlId="formGroupEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control onChange={handleChange('email')} value={email} type="email" />
            </Form.Group>
            <Form.Group controlId="formGroupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control onChange={handleChange('password')} value={password} type="password" />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={clickSubmit}>
                {buttonText}
            </Button>
        </Form>
    )

    return (
        <Layout>
            <Col md={{ span: 6, offset: 3 }}>
                <ToastContainer />
                {isAuth() ? <Redirect to="/" /> : null}
                <h1>Sign In</h1>
                {signinForm()}
            </Col>
        </Layout>
    )
}

export default Signin
