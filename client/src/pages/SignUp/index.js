import React, { Component } from 'react';

import { Form, Button, Container, Row, Col } from 'react-bootstrap'

import PageRedirect from '../../components/PageRedirect'

import './styles.css';

class SignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            validated: false,
            submitted: false,
            error: false
        }
    }

    submitCredentials(e) {
        e.preventDefault()
        const form = e.currentTarget

        if (form.checkValidity() === false) {
            e.stopPropagation()
        }

        console.log(form)
        const email = form.getElementsByClassName("form-control")[1].value
        const username = form.getElementsByClassName("form-control")[0].value
        const password = form.getElementsByClassName("form-control")[2].value


        
    }

    render () {
        return (
            <div className="signup">
                <Container>
                    <Row>
                        <Col>
                            <div className="description">
                                <p>Logo</p>
                                <img src="" alt=""/>
                            </div>
                        </Col>
                        <Col xs={5}>
                            <div className="signup-dialog">
                                <h3 className="signup-header">Sign Up For a Music Collab account below</h3>
                                <Form onSubmit={this.submitCredentials.bind(this)} validated={this.state.validated}>
                                    <Form.Group controlId="formSignupUsername">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="text" placeholder="Enter username" />
                                    </Form.Group>
                                    <Form.Group controlId="formSignupProfileName">
                                        <Form.Label>Profile Name</Form.Label>
                                        <Form.Control type="ProfileName" placeholder="Enter Your Profile Name" />
                                    </Form.Group>
				   <Form.Group controlId="Email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" placeholder="Enter Your email Name" />
                                    </Form.Group>

                                    <Form.Group controlId="formSignupPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Enter password" />
                                    </Form.Group>
				    <Form.Group controlId="formSignupRepeatPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Repeat password" />
                                    </Form.Group>

                                    <Form.Group controlId="formSignupInterest">
                                        <Form.Label>Interests</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Your Interests" />
                                    </Form.Group>

                                    <Button variant="primary" type="submit">
                                        Create Account
                                    </Button>
                                    {
                                        this.state.submitted && !this.state.error ? 
                                        (<>
                                            <p >Sign up successful! You'll bemaile redirected to the login page in 2 seconds. </p>
                                            <PageRedirect to={'/Login'} delay={2000} />
                                        </>
                                        ) : null
                                    }
                                    {
                                        this.state.submitted && this.state.error ?
                                        (
                                            <p>Uh-oh, something went wrong. Try again later.</p>
                                        ) : null
                                    }
                                </Form>
                            </div>
                        </Col>
                    </Row>
                    </Container>
            </div>
        );
    }
}

export default SignUpa;
