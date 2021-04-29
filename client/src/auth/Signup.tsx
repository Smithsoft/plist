import React, { useState } from 'react'
import Layout from '../core/Layout'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import { Redirect } from 'react-router-dom'
import { isAuth } from './helpers'

const Signup: React.FC = () => {
    const [values, setValues] = useState({
        name: 'Sarah',
        email: 'sarah@storybridge.org',
        password: '123456',
        buttonText: 'Submit'
    })

    const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(`Handling: ${name} - ${event}`)
        setValues({ ...values, [name]: event.target.value })
    }

    const clickSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setValues({ ...values, buttonText: 'Submitting...' })
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/signup`,
            data: { name, email, password }
        })
            .then((response) => {
                console.log('SIGNUP SUCCESS')
                setValues({ ...values, name: '', email: '', password: '', buttonText: 'Submitted' })
                toast.success(response.data.message)
            })
            .catch((error) => {
                console.log('SIGNUP ERROR', error.response.data)
                setValues({ ...values, buttonText: 'Submit' })
                toast.error(error.response.data.error)
            })
    }

    const { name, email, password, buttonText } = values

    const signupForm = () => (
        <Form>
            <Form.Group controlId="formGroupName">
                <Form.Label>Name</Form.Label>
                <Form.Control onChange={handleChange('name')} value={name} type="text" />
            </Form.Group>
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
                <h1>Signup</h1>
                {signupForm()}
            </Col>
        </Layout>
    )
}

export default Signup
