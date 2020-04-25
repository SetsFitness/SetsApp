import React, {Component} from 'react';
import OpeningScreen from './authscreens/OpeningScreen';

class UnauthApp extends Component {
  // This defines the passed function for use
  authenticate = (user) => {
  };

  render() {
    // Maybe this would be to have a sort of advertisement for our website?
    return (
      <div>
        <OpeningScreen/>
      </div>
    );
  }
}

// const mapStateToProps = state => ({
//     auth: state.auth
// });

export default UnauthApp;

