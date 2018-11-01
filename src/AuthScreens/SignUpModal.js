import React, { Component } from 'react';
import Semantic, { Modal, Button, Input, Image, Grid, Form, Message } from 'semantic-ui-react';
import Amplify, { Auth } from 'aws-amplify';

class SignUpModal extends Component {
    constructor(props) {
        super(props);
        this.authenticate = this.props.authenticate.bind(this);
    }

    state = {
        error: null,
        isConfirming: false
    };

    authState = {
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
        gender: "",
        birthday: "",
        email: "",
        confirmationCode: "",
    };

    // TODO Retrieve information from the fields
    async vastusSignUp(successHandler, failureHandler) {
        // TODO Check to see if the input fields are put  in correctly
        // TODO Check to see that password is with confirm password correctly
        console.log("Starting Auth.signup!");
        if (!this.authState.password.equals(this.authState.confirmPassword)) {
            console.log("Sign up failed");
            failureHandler("Password and confirm password do not match");
            return;
        }

        const attributes = {
            name: this.authState.name,
            gender: this.authState.gender,
            birthdate: this.authState.birthday,
            email: this.authState.email,
        };
        const params = {
            username: this.authState.username,
            password: this.authState.password,
            attributes: attributes,
            validationData: []
        };
        Auth.signUp(params).then((data) => {
            console.log("Successfully signed up!");
            successHandler(data);
        }).catch((err) => {
            console.log("Sign up has failed :(");
            console.log(err);
            failureHandler(err);
        });
    }

    // TODO Make dependent on user
    vastusConfirmSignUp(successHandler, failureHandler) {
        // TODO Check to see if the input fields are put  in correctly
        Auth.confirmSignUp(this.authState.username, this.authState.confirmationCode).then((data) => {
            console.log("Successfully confirmed the sign up");
            console.log(data);
            successHandler(data);
        }).catch((error) => {
            console.log("Confirm sign up has failed :(");
            console.log(error);
            failureHandler(error);
        });
    }

    changeStateText(key, value) {
        // TODO Sanitize this input
        // TODO Check to see if this will, in fact, work.!
        // inspect(value);
        this.authState[key] = value.target.value;
        console.log("New " + key + " is equal to " + value.target.value);
    }

    handleCreateButton() {
        // alert("Setting state with isConfirming is true");
        this.vastusSignUp((user) => {
            this.setState({isConfirming: true})
        }, (error) => {
            this.setState({isConfirming: false, error: error})
        });
    }

    async handleConfirmButton() {
        this.vastusConfirmSignUp((user) => {
            this.setState({isConfirming: false});
            this.authenticate(user);
        }, (error) => {
            this.setState({isConfirming: true, error: error});
        });
    }

    handleCancelButton() {
        // TODO Have a confirmation like are you sure ya wanna close?
        this.setState({error: null});
        this.props.onClose();
    }

    render() {
        function errorMessage(error) {
            if (error) {
                return (
                    <Modal.Description>
                        <Message color='red'>
                            <h1>Error!</h1>
                            <p>{error}</p>
                        </Message>
                    </Modal.Description>
                );
            }
        }

        if (this.state.isConfirming) {
            return(
                <div>
                    <Modal open={this.props.open} onClose={() => (false)} trigger={<Button fluid color='red' onClick={this.props.onOpen.bind(this)} inverted> Sign Up </Button>} size='tiny'>
                        <Modal.Header>Check your email to confirm the sign up!</Modal.Header>
                        {errorMessage(this.state.error)}
                        <Modal.Actions>
                            <div>
                                <Form>
                                    <label>Confirmation Code</label>
                                    <Form.Input type="text" name="confirmationCode" placeholder=" XXXXXX " onChange={value => this.changeStateText("confirmationCode", value)}/>
                                </Form>
                            </div>
                            <div>
                                <Button onClick={this.handleConfirmButton.bind(this)} color='blue'>Confirm Your Account</Button>
                            </div>
                        </Modal.Actions>
                    </Modal>
                </div>
            );
        }
        return(
            <div>
                <Modal open={this.props.open} trigger={<Button fluid color='red' onClick={this.props.onOpen.bind(this)} inverted> Sign Up </Button>} size='tiny'>
                    <Modal.Header>Create your new VASTUS account!</Modal.Header>
                    {errorMessage(this.state.error)}
                    <Modal.Actions>
                        <Form>
                            <div className="field">
                                <label>Username</label>
                                <Form.Input type="text" name="username" placeholder="Username" onChange={value => this.changeStateText("username", value)}/>
                            </div>
                            <div className="field">
                                <label>Password</label>
                                <Form.Input type="password" name="password" placeholder="Password" onChange={value => this.changeStateText("password", value)}/>
                            </div>
                            <div className="field">
                                <label>Confirm Password</label>
                                <Form.Input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={value => this.changeStateText("confirmPassword", value)}/>
                            </div>
                            <div className="field">
                                <label>Name</label>
                                <Form.Input type="text" name="name" placeholder="Name" onChange={value => this.changeStateText("name", value)}/>
                            </div>
                            <div className="field">
                                <label>Gender</label>
                                <Form.Input type="text" name="gender" placeholder="Gender" onChange={value => this.changeStateText("gender", value)}/>
                            </div>
                            <div className="field">
                                <label>Birthdate</label>
                                <Form.Input type="text" name="birthdate" placeholder="YYYY-MM-DD" onChange={value => this.changeStateText("birthday", value)}/>
                            </div>
                            <div className="field">
                                <label>Email</label>
                                <Form.Input type="text" name="email" placeholder="Email" onChange={value => this.changeStateText("email", value)}/>
                            </div>
                            <Grid relaxed columns={4}>
                                <Grid.Column>
                                    <Button negative onClick={this.handleCancelButton.bind(this)}>Cancel</Button>
                                </Grid.Column>
                                <Grid.Column/>
                                <Grid.Column/>
                                <Grid.Column>
                                    <Button positive color='green' onClick={this.handleCreateButton.bind(this)}>Create</Button>
                                </Grid.Column>
                            </Grid>
                        </Form>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}

export default SignUpModal;
