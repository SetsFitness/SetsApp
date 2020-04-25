import React, {Component} from 'react';
import {Segment, Grid} from 'semantic-ui-react';
import {connect} from "react-redux";
import {logOut} from "../vastuscomponents/redux/actions/authActions";
import SignInPage from './SignInPage';
import Breakpoint from "react-socks";

// const transition = 'browse';

// TODO Get Blake to refactor this so he gets practice.

class OpeningScreen extends Component {
  state = {
    visible: true,
    slideNum: 0,
    reactSwipeEl: null,
    circles: ['circle', 'circle outline', 'circle outline'],
    active: true
  };

  // swipeRight = (reactSwipeEl) => {
  //     if(this.state.slideNum === 0) {
  //         this.setState({slideNum: this.state.slideNum + 1});
  //         this.setState({circles: ['circle outline', 'circle', 'circle outline']});
  //     }
  //     if(this.state.slideNum === 1) {
  //         this.setState({slideNum: this.state.slideNum + 1});
  //         this.setState({circles: ['circle outline', 'circle outline', 'circle']});
  //     }
  //     reactSwipeEl.next();
  // }
  //
  // swipeLeft = (reactSwipeEl) => {
  //     if(this.state.slideNum === 2) {
  //         this.setState({slideNum: this.state.slideNum - 1});
  //         this.setState({circles: ['circle outline', 'circle', 'circle outline']});
  //     }
  //     if(this.state.slideNum === 1) {
  //         this.setState({slideNum: this.state.slideNum - 1});
  //         this.setState({circles: ['circle', 'circle outline', 'circle outline']});
  //     }
  //     reactSwipeEl.prev();
  // }
  //
  // displayPage = () => {
  //     return _.times(3, i => (
  //         <Grid.Column width={1} key={i}>
  //             <Icon name={this.state.circles[i]}/>
  //         </Grid.Column>
  //     ));
  // };
  //
  // adjustCircles(index) {
  //     if(0 <= index <= 2) {
  //         this.setState({slideNum: index});
  //     }
  //
  //     if(index === 0) {
  //         this.setState({circles: ['circle', 'circle outline', 'circle outline']});
  //     }
  //     else if(index === 1) {
  //         this.setState({circles: ['circle outline', 'circle', 'circle outline']});
  //     }
  //     else if(index === 2) {
  //         this.setState({circles: ['circle outline', 'circle outline', 'circle']});
  //     }
  //     alert(index);
  // }
  //
  // toggleVisibility = () => this.setState({ visible: !this.state.visible });
  //
  // handleContextRef = contextRef => this.setState({ contextRef });
  //
  // handleToggle = () => this.setState({ active: !this.state.active });

  render() {
    // const { active, contextRef } = this.state;
    // let reactSwipeEl;
    // let self = this;
    // const { visible } = this.state;
    return (
      <div>
        <Breakpoint small down>
          <div>
            <Grid textAlign='center' centered
                  style={{marginLeft: '30px', marginRight: '30px', marginTop: '5px', height: 610}}>
              <Segment inverted style={{maxWidth: 430, background: 'white'}}>
                <SignInPage/>
              </Segment>
            </Grid>
          </div>
        </Breakpoint>

        <Breakpoint medium up>
          <div>
            <Grid textAlign='center' centered
                  style={{marginLeft: '30px', marginRight: '30px', marginTop: '5px', marginBottom: '50px'}}>
              <Segment inverted style={{marginTop: '10px', maxWidth: 430, minHeight: 660, background: 'white'}}>
                <SignInPage/>
              </Segment>
            </Grid>
          </div>
        </Breakpoint>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user
});

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => {
      dispatch(logOut());
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(OpeningScreen);