import React, {useState} from 'react';
import './App.css';
import Tabs from './screens/Tabs.js';
import {Menu, Container, Icon, Grid, Modal, Label, Button, Image} from "semantic-ui-react";
import SearchBarProp from "./vastuscomponents/components/props/SearchBar";
import {connect} from "react-redux";
import NotificationBellProp from "./vastuscomponents/components/info/NotificationBell";
import NotificationFeed from "./screens/notification_bell/NotificationBellFeed";
import Breakpoint from "react-socks";
import FilterModal from "./screens/filter/FilterModal";
import Logo from "../src/vastuscomponents/img/VC_logo.svg"

/**
 * Auth App
 *
 * This file contains the general outline of the app in a grid based format.
 */
const AuthApp = (props) => {
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  return [
    <Menu borderless inverted vertical fluid widths={1} fixed="top" style={{background: 'rgba(256, 256, 256, 0.5)'}}>
          <Menu.Item style={{background: 'rgba(256, 256, 256, 0.5)'}}>
            <Container fluid>
              {/*<Breakpoint large up>*/}
              <Grid columns="equal" centered style={{background: 'rgba(256, 256, 256, 0.5)', border: '2px solid rebeccapurple'}}>
                <Grid.Row stretched>
                  <Grid.Column style={{minWidth: '401px'}}>
                    <SearchBarProp/>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
                <Button floated='right' primary circular style={{marginRight: '20px', marginTop: '-25px'}}>
                    <Image src={Logo} size='mini'
                           style={{marginRight: '-5px', marginBottom: '-2px', marginTop: '-2px'}}/>
                    7
                </Button>
              {/*<Breakpoint medium>
                                <Grid columns="equal" centered>
                                    <Grid.Row stretched>
                                        <Grid.Column width={2}>
                                            <Grid onClick={() => setFilterModalOpen(true)} style={{marginTop: "6px", marginLeft: "-40px"}} centered>
                                                <Icon name="filter" size="big"/>
                                            </Grid>
                                        </Grid.Column>
                                        <Grid.Column width={12}>
                                            <SearchBarProp />
                                        </Grid.Column>
                                        <Grid.Column width={2}>
                                            <Modal trigger={<NotificationBellProp/>} closeIcon>
                                                <Modal.Header align='center'>Notifications</Modal.Header>
                                                <Modal.Content>
                                                    <NotificationFeed/>
                                                </Modal.Content>
                                            </Modal>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Breakpoint>
                            <Breakpoint small down>
                                <Grid columns="equal" centered>
                                    <Grid.Row stretched>
                                        <Grid.Column style={{marginTop: "6px", marginLeft: "12px", marginRight: "-12px"}}>
                                            <Grid onClick={() => setFilterModalOpen(true)} style={{marginTop: "3px", marginLeft: "-60px"}} centered>
                                                <Icon name="filter" size="big"/>
                                            </Grid>
                                        </Grid.Column>
                                        <Grid.Column width={9}>
                                            <SearchBarProp />
                                        </Grid.Column>
                                        <Grid.Column style={{marginTop: "3px", marginLeft: "-6px"}}>
                                            <Modal trigger={<NotificationBellProp/>} closeIcon>
                                                <Modal.Header align='center'>Notifications</Modal.Header>
                                                <Modal.Content>
                                                    <NotificationFeed/>
                                                </Modal.Content>
                                            </Modal>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Breakpoint>*/}
            </Container>
          </Menu.Item>
        </Menu>,
        <FilterModal open={filterModalOpen} onClose={() => setFilterModalOpen(false)}/>,
        <Tabs user={props.user}/>
  ];
};

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(AuthApp);
