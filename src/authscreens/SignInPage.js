import React, {useState} from 'react';
import {
  Grid, Form, Header, Button, Image, Segment, Message, Dimmer, Loader, Divider, List, Container, Icon
} from 'semantic-ui-react';
import {connect} from "react-redux";
import SignUpModal from './SignUpModal';
import ForgotPasswordModal from "./ForgotPasswordModal";
import Logo from '../vastuscomponents/img/vt_gold_even_thicker_border.svg';
import {logIn, openForgotPasswordModal, openSignUpModal} from "../vastuscomponents/redux/actions/authActions";
import {setError} from "../vastuscomponents/redux/actions/infoActions";
import GoogleSignUp from "./GoogleSignUp";

/**
 * Changes the text of the state for the component.
 *
 * @param {string} key The attribute name of the part of the state to update.
 * @param {{target: {value: string}}} value The value object from the input.
 * @param {{}} setStates The setState functions mapped from the attribute names they update.
 */
const changeStateText = (key, value, setStates) => {
  // inspect(value);
  setStates[key](value.target.value);
};

/**
 * Inputs the User's sign in credentials and attempts to sign into the application.
 *
 * @param {string} username The inputted username by the User.
 * @param {string} password The inputted password by the User.
 * @param {function(string, string)} logIn The Auth Flow function to attempt the log in.
 * @param {function(error)} setError Function to set the component's error state.
 */
const vastusSignIn = (username, password, logIn, setError) => {
  // TODO Check to see if the input fields are put in correctly
  username = username.toLocaleLowerCase();
  if (username && password) {
    logIn(username, password);
  } else {
    setError(new Error("Username and password must be filled!"));
  }
};

/**
 * Displays an error message for any potential component errors.
 *
 * @param {{message: string}} error The error object to display.
 * @return {*} The React JSX for displaying the error message.
 */
const errorMessage = (error) => {
  if (error) {
    return (
      <Message color='red' style={{marginTop: '100px'}}>
        <h1>Error!</h1>
        <p>{error.message}</p>
      </Message>
    );
  }
};

/**
 * Generates a loading graphic based on the current loading state of the component.
 *
 * @param {boolean} isLoading Whether the app is loading or not.
 * @return {*} The React JSX to display the loading component.
 */
const loadingProp = (isLoading) => {
  if (isLoading) {
    return (
      <Dimmer active>
        <Loader/>
      </Dimmer>
    );
  }
  return null;
};

/**
 * The Sign in page that displays the Logo and welcomes the User to the app. Handles all the signing in logic and
 * contains the rest of the Auth Flow components.
 *
 * @param {{}} props The props passed into the component.
 * @return {*} The React JSX to display the component.
 * @constructor
 */
const SignInPage = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const setStates = {
    username: setUsername,
    password: setPassword
  };

  return (
    <Container className='login-form' style={{color: "#FFFFFF", background: 'white'}}>
      {loadingProp(props.info.isLoading)}
      <Grid centered textAlign='center' style={{background: 'white'}}>
        <Segment raised padded inverted style={{minWidth: 340, maxWidth: 570, marginBottom: '-60px',
            background: "white", border: '1px solid purple'}}>
          <Button floated='right' circular icon color={'purple'}
                  onClick={() => window.open("https://vastustech.com", "_blank")}>
            <Icon name='info'/>
          </Button>
          <Segment basic>
            <Image src={Logo} size="small" centered/>
            <Header as='h2' inverted textAlign='center' style={{color: 'purple'}}>
              Join Below
            </Header>
          </Segment>
          <Form size='large'>
            <Form.Input fluid icon='user' iconPosition='left' placeholder='Username'
                        onChange={value => changeStateText("username", value, setStates)}/>
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              onChange={value => changeStateText("password", value, setStates)}
            />
            <Button primary fluid size='large'
                    onClick={() => vastusSignIn(username, password, props.logIn, props.setError)}>
              Log in
            </Button>
          </Form>
          <Divider horizontal inverted>or</Divider>
          <List>
            <List.Item>
              <SignUpModal/>
            </List.Item>
            <List.Item>
              <ForgotPasswordModal/>
            </List.Item>
            <GoogleSignUp/>
          </List>
        </Segment>
      </Grid>
        {errorMessage(props.info.error)}
    </Container>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
  info: state.info
});

const mapDispatchToProps = (dispatch) => {
  return {
    logIn: (username, password) => {
      dispatch(logIn(username, password));
    },
    setError: (error) => {
      dispatch(setError(error));
    },
    openSignUpModal: () => {
      dispatch(openSignUpModal());
    },
    openForgotPasswordModal: () => {
      dispatch(openForgotPasswordModal());
    }
  }
};
//

export default connect(mapStateToProps, mapDispatchToProps)(SignInPage);
