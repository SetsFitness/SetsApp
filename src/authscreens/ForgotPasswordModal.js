import React, {useState} from 'react';
import {Modal, Button, Form, Message, Dimmer} from 'semantic-ui-react';
import {
  closeForgotPasswordModal,
  confirmForgotPassword,
  forgotPassword, openForgotPasswordModal,
} from "../vastuscomponents/redux/actions/authActions";
import {connect} from "react-redux";
import {setError} from "../vastuscomponents/redux/actions/infoActions";
import Spinner from "../vastuscomponents/components/props/Spinner";

/**
 * Changes the text of the state for the component.
 *
 * @param {string} key The attribute name of the part of the state to update.
 * @param {{target: {value: string}}} value The value object from the input.
 * @param {{}} setStates The setState functions mapped from the attribute names they update.
 */
const changeStateText = (key, value, setStates) => {
  // TODO Sanitize this input?
  setStates[key](value.target.value);
};

/**
 * Submits the forgot password Auth function and continues the auth flow.
 *
 * @param {string} username The inputted username to reset the password for.
 * @param {function(string)} forgotPassword The function to submit the forgot password call.
 */
const handleSubmitButton = (username, forgotPassword) => {
  username = username.toLocaleLowerCase();
  forgotPassword(username);
};

/**
 * Handles the confirm button after the User received the confirmation code. Checks the inputs as well to make sure that
 * the passwords are the same.
 *
 * @param {string} username The username for the User.
 * @param {string} confirmationCode The confirmation code that the User received from their email.
 * @param {string} newPassword The new password they want to reset their account to.
 * @param {string} confirmNewPassword The new password again, to confirm correct input.
 * @param {function(error)} setError Sets the error for the component.
 * @param {function(string, string, string)} confirmForgotPassword Completes the forgot password reset.
 */
const handleConfirmButton = (username, confirmationCode, newPassword, confirmNewPassword, setError, confirmForgotPassword) => {
  if (newPassword !== confirmNewPassword) {
    console.log("Failed to make a new password :(");
    console.log("Passwords did not match");
    setError(new Error("Password and confirm password do not match!"));
  } else if (!(username && confirmationCode && newPassword && confirmNewPassword)) {
    setError(new Error("All fields need to be filled in!"));
  } else {
    confirmForgotPassword(username, confirmationCode, newPassword);
  }
};

/**
 * Handles the cancel button and navigates away from modal.
 *
 * @param {function()} closeForgotPasswordModal Closes the forgot password modal.
 */
const handleCancelButton = (closeForgotPasswordModal) => {
  // TODO Have a are you sure? thing attached to this
  // this.setState({error: null, isConfirming: false});
  closeForgotPasswordModal();
};

/**
 * Generates an error message based on the current error state of the component.
 *
 * @param error The error object of the component.
 * @return {*} The React JSX to display the error message.
 */
function errorMessage(error) {
  if (error) {
    return (
      <Modal.Description>
        <Message color='red'>
          <h1>Error!</h1>
          <p>{JSON.stringify(error)}</p>
        </Message>
      </Modal.Description>
    );
  }
}

/**
 * Generates a loading graphic based on the current loading state of the component.
 *
 * @param {boolean} isLoading Whether the app is loading or not.
 * @return {*} The React JSX to display the loading component.
 */
function loadingProp(isLoading) {
  if (isLoading) {
    return (
      <Dimmer active>
        <Spinner/>
      </Dimmer>
    );
  }
  return null;
}

/**
 * The Modal responsible for handling the resetting of passwords if a User forgets their password. Inputs a username
 * and sends an email to the User which then they use to reset their password.
 *
 * @param {{}} props The given props to the component.
 * @return {*} The React JSX to display this component.
 * @constructor
 */
const ForgotPasswordModal = (props) => {
  const [username, setUsername] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Make an object to set the state dynamically
  const setStates = {
    username: setUsername,
    confirmationCode: setConfirmationCode,
    newPassword: setNewPassword,
    confirmNewPassword: setConfirmNewPassword
  };

  if (props.auth.confirmingForgotPassword) {
    return (
      <Modal open={props.auth.forgotPasswordModalOpen} onClose={() => (false)}
             trigger={<Button onClick={() => props.openForgotPasswordModal()} primary style={{color: 'white'}}>
                 Forgot Password?</Button>} size='tiny'>
        {loadingProp(props.info.isLoading)}
        <Modal.Header>Confirm your email and choose your new password!</Modal.Header>
        {errorMessage(props.info.error)}
        <Modal.Content>
          <p>Enter your username to retrieve your information</p>
        </Modal.Content>
        <Modal.Actions style={{borderTop: 'none'}}>
          <Form>
            <Form.Input type="text" label="Confirmation Code from your Email" name="confirmationCode"
                        placeholder="XXXXXX" onChange={value => changeStateText("confirmationCode", value, setStates)}/>
            <Form.Input type="password" label="New Password" name="newPassword" placeholder="new password"
                        onChange={value => changeStateText("newPassword", value, setStates)}/>
            <Form.Input type="password" name="confirmNewPassword" placeholder="confirm new password"
                        onChange={value => changeStateText("confirmNewPassword", value, setStates)}/>
            <div className="u-flex u-flex-justify--space-between u-padding-y--2 u-margin-top--2">
              <Button negative onClick={() => handleCancelButton(props.closeForgotPasswordModal)}>Cancel</Button>
              <Button positive color='green'
                      onClick={() => handleConfirmButton(username, confirmationCode, newPassword, confirmNewPassword, props.setError, props.confirmForgotPassword)}>Confirm</Button>
            </div>
          </Form>
        </Modal.Actions>
      </Modal>
    );
  }
  return (
    <Modal open={props.auth.forgotPasswordModalOpen} onClose={() => (false)}
           trigger={<Button size="large" fluid inverted onClick={() => props.openForgotPasswordModal()} primary
           style={{color: 'white'}}>Forgot
             Password?</Button>} size='tiny'>
      {loadingProp(props.info.isLoading)}
      <Modal.Header style={{borderBottom: 'none', color: 'purple', background: 'white'}}>Forgot Password?</Modal.Header>
      {errorMessage(props.info.error)}
      <Modal.Content style={{background: 'white', color: 'purple'}}>
        <p>Enter your username to retrieve your information</p>
      </Modal.Content>
      <Modal.Actions style={{borderTop: 'none', background: 'white', color: 'purple'}}>
        <Form>
          <Form.Input type="text" name="username" placeholder="username"
                      onChange={value => changeStateText("username", value, setStates)}/>
          <div className="u-flex u-flex-justify--space-between u-padding-y--2 u-margin-top--2">
            <Button negative onClick={() => handleCancelButton(props.closeForgotPasswordModal)}>Cancel</Button>
            <Button positive color='green'
                    onClick={() => handleSubmitButton(username, props.forgotPassword)}>Submit</Button>
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
    forgotPassword: (username) => {
      dispatch(forgotPassword(username));
    },
    confirmForgotPassword: (username, confirmationCode, newPassword) => {
      dispatch(confirmForgotPassword(username, confirmationCode, newPassword));
    },
    setError: (error) => {
      dispatch(setError(error));
    },
    openForgotPasswordModal: () => {
      dispatch(openForgotPasswordModal());
    },
    closeForgotPasswordModal: () => {
      dispatch(closeForgotPasswordModal());
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordModal);
