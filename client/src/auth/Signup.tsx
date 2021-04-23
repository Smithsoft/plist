import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'

const Signup: React.FC = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        buttonText: 'Submit'
    })

    const handleChange = (name: string) => (event: any) => {
        console.log(`Handling: ${name} - ${event}`)
    }

    const clickSubmit = (event: any) => {
        //
    }

    const signupForm = () => (
        <Form>
            <Form.Group controlId="formGroupName">
                <Form.Label>Name</Form.Label>
                <Form.Control onChange={handleChange('name')} type="text" />
            </Form.Group>
            <Form.Group controlId="formGroupEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control onChange={handleChange('email')} type="email" />
            </Form.Group>
            <Form.Group controlId="formGroupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control onChange={handleChange('password')} type="password" />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={clickSubmit}>
                {values.buttonText}
            </Button>
        </Form>
    )

    return (
        <Layout>
            <Col md={{ span: 6, offset: 3 }}>
                <ToastContainer />
                <h1>Signup</h1>
                {signupForm()}
            </Col>
        </Layout>
    )
}

export default Signup
