import React  from 'react';
import './App.css';
import './video-react-copy.css';
import { connect } from 'react-redux';
import AuthApp from './AuthApp';
import UnauthApp from './UnauthApp';

// function requestNotificationPermission() {
    // Some browsers don't support Notification yet. I'm looking at you iOS Safari
    // if ("Notification" in window) {
    //     if (
    //         Notification.permission !== "denied" &&
    //         Notification.permission !== "granted"
    //     ) {
    //         Notification.requestPermission();
    //     }
    // }
// }

const App = (props) => (props.auth.loggedIn ? <AuthApp/> : <UnauthApp/>);

const mapStateToProps = (state) => ({auth: state.auth,});

export default connect(mapStateToProps)(App);
