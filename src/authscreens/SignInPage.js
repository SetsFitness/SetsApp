import React, { Component } from 'react';
import Amplify, { Auth, Analytics } from 'aws-amplify';
import { inspect } from 'util';
import Semantic, { Input, Grid, Form, Header, Button, Image, Segment, Message, Modal, Dimmer, Loader, Divider, List, Container } from 'semantic-ui-react';
import SignUpModal from './SignUpModal';
import ForgotPasswordModal from "./ForgotPasswordModal";
import Logo from '../img/vt_on_black.png';

class SignInPage extends Component {
    // This is the function that is called when the sign up button is pressed
    constructor(props) {
        super(props);
        this.authenticate = this.props.authenticate.bind(this);
    }

    authState = {
        username: "",
        password: "",
    };

    state = {
        error: null,
        user: {},
        isLoading: true,
        signUpModalOpen: false,
        forgotPasswordModalOpen: false
    };

    vastusSignIn(successHandler, failureHandler) {
        // TODO Check to see if the input fields are put  in correctly
        console.log("Starting Auth.signin!");
        this.setState({isLoading: true});
        Auth.signIn(this.authState.username, this.authState.password).then((data) => {
            console.log("Successfully signed in!");
            this.setState({isLoading: false});
            successHandler(data);
        }).catch((error) => {
            console.log("There was an error!");
            if (error.message) {
                error = error.message;
            }
            console.log(error);
            this.setState({isLoading: false});
            failureHandler(error);
        });
        console.log("We got past the sign in call!");
    }

    changeStateText(key, value) {
        // inspect(value);
        this.authState[key] = value.target.value;
        console.log("New " + key + " is equal to " + value.target.value);
    }

    handleLogInButtonPress() {
        this.vastusSignIn((user) => {
            this.setState({user: user});
            this.authenticate(user);
        }, (error) => {
            this.setState({error: error})
        });
    }

    openSignUpModal() {
        this.setState({signUpModalOpen: true})
    }
    closeSignUpModal() {
        this.setState({signUpModalOpen: false})
    }
    openForgotPasswordModal() {
        this.setState({forgotPasswordModalOpen: true})
    }
    closeForgotPasswordModal() {
        this.setState({forgotPasswordModalOpen: false})
    }

    async componentDidMount() {
        // StatusBar.setHidden(true);
        try {
            const user = await Auth.currentAuthenticatedUser();
            this.setState({ user, isLoading: false })
        } catch (err) {
            this.setState({ isLoading: false })
        }
    }
    // async componentWillReceiveProps(nextProps) {
    //     try {
    //         const user = await Auth.currentAuthenticatedUser();
    //         this.setState({ user })
    //     } catch (err) {
    //         this.setState({ user: {} })
    //     }
    // }

    render() {
        function errorMessage(error) {
            if (error) {
                return (
                    <Message color='red'>
                        <h1>Error!</h1>
                        <p>{error}</p>
                    </Message>
                );
            }
        }
        function loadingProp(isLoading) {
            if (isLoading) {
                return (
                    <Dimmer active inverted>
                        <Loader/>
                    </Dimmer>
                );
            }
            return null;
        }

        return (
            <Container className='login-form'>
                {loadingProp(this.state.isLoading)}
                {errorMessage(this.state.error)}
                <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Segment raised padded inverted>
                            <Segment basic>
                                <Image src={Logo} size="tiny" centered />
                                <Header as='h2' inverted textAlign='center'>
                                    Log in to your account
                                </Header>
                            </Segment>
                            <Form size='large'>
                                <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' onChange={value => this.changeStateText("username", value)}/>
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    onChange={value => this.changeStateText("password", value)}
                                />
                                <Button primary fluid size='large' onClick={this.handleLogInButtonPress.bind(this)}>
                                    Log in
                                </Button>
                            </Form>
                            <Divider horizontal inverted>or</Divider>
                            <List>
                            <List.Item>
                                <SignUpModal
                                    open={this.state.signUpModalOpen}
                                    onOpen={this.openSignUpModal.bind(this)}
                                    onClose={this.closeSignUpModal.bind(this)}
                                    authenticate={this.authenticate.bind(this)}
                                />
                            </List.Item>
                            <List.Item>
                                <ForgotPasswordModal
                                    open={this.state.forgotPasswordModalOpen}
                                    onOpen={this.openForgotPasswordModal.bind(this)}
                                    onClose={this.closeForgotPasswordModal.bind(this)}
                                    authenticate={this.authenticate.bind(this)}
                                />
                                </List.Item>
                            </List>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}
// {/*<div>*/}
//     {/*<button className="ui button" onClick = {this.vastusSignUp.bind(this)} > Sign Up </button>*/}
//     {/*<button className="ui button" onClick = {this.vastusSignIn.bind(this)} > Sign In </button>*/}
// {/*</div>*/}

const mapStateToProps = state => ({
    auth: state.auth
});

export default SignInPage;
