import React, {useState} from 'react';
import {Modal, Button, Form, Message, Dimmer, Loader, Popup, Divider} from 'semantic-ui-react';
import {closeSignUpModal, confirmSignUp, openSignUpModal, signUp} from "../vastuscomponents/redux/actions/authActions";
import {connect} from "react-redux";
import {clearError, setError} from "../vastuscomponents/redux/actions/infoActions";
import {err} from "../Constants";

/**
 * Changes the text of the state for the component.
 *
 * @param {string} key The attribute name of the part of the state to update.
 * @param {{target: {value: string}}} value The value object from the input.
 * @param {{}} setStates The setState functions mapped from the attribute names they update.
 */
const setStateText = (key, value, setStates) => {
  const setState = setStates[key];
  if (setState) {
    setState(value.target.value);
  } else {
    err && console.error("Setting non-handled set state case: " + key);
  }
};

/**
 * Handles what happens when the User tries to finish the sign up.
 *
 * @param {string} username The username the User has Chosen.
 * @param {string} password The password the User wants.
 * @param {string} confirmPassword The password confirmation.
 * @param {string} name The display name for the user
 * @param {string} email The email of the User.
 * @param {string} enterpriseID The optional enterprise ID for the sign up.
 * @param {function(error)} setError The function for setting the error of the component.
 * @param {function(string, string, string, string, string)} signUp Auth flow function for signing up.
 */
const handleCreateButton = (username, password, confirmPassword, name, email, enterpriseID, setError, signUp) => {
  // console.log("Setting state with isConfirming is true");
  // TODO Do extra checking for the specifications of the account!
  username = username.toLocaleLowerCase();
  if (fieldsAreFilledCorrectly(username, password, confirmPassword, name, email, setError)) {
    signUp(username, password, name, email, enterpriseID);
  }
};

/**
 * Handles the confirmation of the sign up, from a confirmation code sent through email.
 *
 * @param {string} username The username of the User.
 * @param {string} confirmationCode The confirmation code received by the User.
 * @param {function(string, string)} confirmSignUp The Auth Flow function to complete the sign up process.
 * @param {function(error)} setError The function for setting the error of the component.
 */
const handleConfirmButton = (username, confirmationCode, confirmSignUp, setError) => {
  // TODO Is there a chance that the username could be lost here?
  if (confirmationCode) {
    confirmSignUp(username, confirmationCode);
  } else {
    setError(new Error("Confirmation code cannot be empty"));
  }
};

/**
 * Cancels the sign up flow. Clears fields, but allows the User to continue the Sign up flow if confirming.
 *
 * @param {function()} clearError Clears the component state error.
 * @param {function()} closeSignUpModal Closes the sign up modal.
 */
const handleCancelButton = (clearError, closeSignUpModal) => {
  // TODO Have a confirmation like are you sure ya wanna close?
  clearError();
  closeSignUpModal();
};

/**
 * Checks all the values to ensure that they are filled correctly and can be sent through the Auth flow functions.
 *
 * @param {string} username The inputted username for the User.
 * @param {string} password The inputted password for the User.
 * @param {string} confirmPassword The confirmed inputted password for the User.
 * @param {string} name The display name of the User.
 * @param {string} email The email of the User.
 * @param {function(error)} setError The function for setting the error of the component.
 * @return {boolean} Whether or not the fields are filled correctly.
 */
const fieldsAreFilledCorrectly = (username, password, confirmPassword, name, email, setError) => {
  // console.log("Setting state with isConfirming is true");
  // TODO Do extra checking for the specifications of the account!
  if (username && password && confirmPassword && name && email) {
    if (password !== confirmPassword) {
      setError(new Error("Password and confirm password do not match!"));
    } else if (!email.includes("@") || !email.includes(".")) {
      setError(new Error("Email needs to be properly formed!"));
    } else if (username.includes(" ")) {
      setError(new Error("Username cannot contain spaces!"));
    }
    // Password checking: minLength = 8, needs a number, a lowercase letter, and an uppercase letter
    else if (!properlyFormedPassword(password)) {
      setError(new Error("Password must be longer than 8 characters, must need a number, a lower case letter, and an upper case letter"));
    } else {
      return true;
    }
  } else {
    setError(new Error("All fields need to be filled in!"));
  }
  return false;
};

/**
 * Ensures that the password is properly formatted for the Cognito User Pool.
 *
 * @param {string} password The inputted password from the User.
 * @return {boolean} Whether the password is properly formed or not.
 */
const properlyFormedPassword = (password) => {
  return (password.length > 8 && /\d/.test(password) && (password.toUpperCase() !== password) && (password.toLowerCase() !== password));
};

/**
 * Displays an error message for any potential component errors.
 *
 * @param {{message: string}} error The error object to display.
 * @return {*} The React JSX for displaying the error message.
 */
const errorMessage = (error) => {
  if (error && error.message) {
    return (
      <Modal.Description>
        <Message color='red'>
          <h1>Error!</h1>
          <p>{error.message}</p>
        </Message>
      </Modal.Description>
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
 * The Sign Up Modal handles the whole signing up flow: inputting User info, then confirming the email.
 *
 * @param {{}} props The props passed into the component.
 * @return {*} The React JSX to display the component.
 * @constructor
 */
const SignUpModal = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  // const [gender, setGender] = useState("");
  // const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [enterpriseID, setEnterpriseID] = useState("");
  const setStates = {
    username: setUsername,
    password: setPassword,
    confirmPassword: setConfirmPassword,
    name: setName,
    // gender: setGender,
    // birthday: setBirthday,
    email: setEmail,
    confirmationCode: setConfirmationCode,
    enterpriseID: setEnterpriseID
  };

  if (props.auth.confirmingSignUp) {
    return (
      <div>
        <Modal open={props.auth.signUpModalOpen} onClose={() => (false)}
               trigger={<Button fluid color='red' onClick={() => props.openSignUpModal()} inverted> Sign Up </Button>}
               size='tiny'>
          {loadingProp(props.info.isLoading)}
          <Modal.Header>Check your email to confirm the sign up!</Modal.Header>
          {errorMessage(props.info.error)}
          <Modal.Actions>
            <div>
              <Form>
                <label>Confirm Username!</label>
                <Form.Input type="text" name="username" placeholder=" Username "
                            onChange={value => setStateText("username", value, setStates)}/>
                <label>Confirmation Code</label>
                <Form.Input type="text" name="confirmationCode" placeholder=" XXXXXX "
                            onChange={value => setStateText("confirmationCode", value, setStates)}/>
              </Form>
            </div>
            <div>
              <Button
                onClick={() => handleConfirmButton(username, confirmationCode, props.confirmSignUp, props.setError)}
                color='blue'>Confirm Your Account</Button>
            </div>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
  return (
    <Modal open={props.auth.signUpModalOpen}
           trigger={<Button size="large" fluid inverted onClick={() => props.openSignUpModal()}
           primary style={{color: 'white'}}> Sign Up </Button>}
           size='tiny' style={{background: 'white'}}>
      {loadingProp(props.info.isLoading)}
      <Modal.Header style={{background: 'white', color: 'purple'}}>Create Account to Join</Modal.Header>
      {errorMessage(props.info.error)}
      <Modal.Actions style={{borderTop: 'none', background: 'white'}}>
        <Form style={{background: 'white'}}>
          {/* TODO WE SHOULD USE A QUERY TO FIND OUT IF THAT USERNAME HAS ALREADY BEEN TAKEN */}
          <Form.Input type="text" iconPosition='left' icon='user' name="username" placeholder="Username"
                      onChange={value => setStateText("username", value, setStates)}
                      style={{background: 'white', color: 'purple'}} color='white'/>
          <Popup position="left center"
                 trigger={<Form.Input iconPosition='left' icon='lock' type="password" name="password"
                                      placeholder="Password"
                                      onChange={value => setStateText("password", value, setStates)} color='white'/>}>
            Password must be at least 8 characters long, contains lower and upper case letters, contain at least one
            number.
          </Popup>
          {/* <Form.Input type="password" label="Password" name="password" placeholder="Password" onChange={value => this.changeStateText("password", value)}/> */}
          <Form.Input type="password" iconPosition='left' icon='lock' name="confirmPassword"
                      placeholder="Confirm Password"
                      onChange={value => setStateText("confirmPassword", value, setStates)}
                      style={{background: 'white', color: 'purple'}}/>
          <Divider/>
          <Popup position="left center"
                 trigger={<Form.Input type="text" iconPosition='left' icon='user circle' name="name"
                                      placeholder="Screen Name"
                                      onChange={value => setStateText("name", value, setStates)}/>}>
            This will be what your friends will see your name as.
          </Popup>
          {/*<Form.Input type="text" iconPosition='left' icon='male' name="gender" placeholder="Gender" onChange={value => this.changeStateText("gender", value)}/>*/}
          {/*<Divider />*/}
          {/*<Form.Input type="date" iconPosition='left' icon='calendar alternate outline' name="birthdate" onChange={value => this.changeStateText("birthday", value)}/>*/}
          <Form.Input type="text" iconPosition='left' icon='mail' name="email" placeholder="Email"
                      onChange={value => setStateText("email", value, setStates)}
                      style={{background: 'white', color: 'purple'}}/>
          {/*<Divider />*/}
          {/*<Popup position="left center" trigger={<Form.Input type="text" iconPosition='left' icon='id card' name='enterprise code' placeHolder="Company ID" onChange={value => setStateText("enterpriseID", value, setStates)}/>}>*/}
          {/*If you are signing up with your company, input the given ID here.*/}
          {/*</Popup>*/}
          <div className="u-flex u-flex-justify--space-between u-padding-y--2 u-margin-top--2">
            <Button negative
                    onClick={() => handleCancelButton(props.clearError, props.closeSignUpModal)}>Cancel</Button>
            <Button positive color='green'
                    onClick={() => handleCreateButton(username, password, confirmPassword, name, email, enterpriseID, props.setError, props.signUp)}>Create</Button>
          </div>
        </Form>
      </Modal.Actions>
    </Modal>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
  info: state.info
});

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (username, password, name, gender, birthday, email) => {
      dispatch(signUp(username, password, name, gender, birthday, email));
    },
    confirmSignUp: (username, confirmationCode) => {
      dispatch(confirmSignUp(username, confirmationCode));
    },
    setError: (error) => {
      dispatch(setError(error));
    },
    clearError: () => {
      dispatch(clearError());
    },
    openSignUpModal: () => {
      dispatch(openSignUpModal());
    },
    closeSignUpModal: () => {
      dispatch(closeSignUpModal());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpModal);
