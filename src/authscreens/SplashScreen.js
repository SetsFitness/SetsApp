import React, {useEffect} from "react";
import {Segment, Image, Header, Grid} from "semantic-ui-react";
import {connect} from "react-redux";
import {updateAuth} from "../vastuscomponents/redux/actions/authActions";
import Logo from '../vastuscomponents/img/vt_gold_even_thicker_border.svg';

const loadingScreen = () => (
  <Grid verticalAlign="middle" centered textAlign='center'>
    <Grid.Row>
      <Segment raised padded inverted style={{minWidth: 340, maxWidth: 800, marginBottom: '-60px', marginTop: '120px',
      background: 'white', color: 'purple'}}>
        <Segment basic>
          <Image src={Logo} size="medium" centered/>
          <Header as='h2' inverted textAlign='center' style={{color: 'purple'}}>
            Loading...
          </Header>
        </Segment>
      </Segment>
    </Grid.Row>
  </Grid>
);

const SplashScreen = (props) => {
  useEffect(() => {
    props.updateAuth();
  }, []);

  return props.info.appIsLoading ? loadingScreen() : props.children
};

const mapStateToProps = state => ({
  info: state.info
});

const mapDispatchToProps = dispatch => {
  return {
    updateAuth: () => {
      dispatch(updateAuth());
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);


