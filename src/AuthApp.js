import React, { Component } from 'react';
import './App.css';
import Tabs from './screens/Tabs.js';
import {Menu, Container, Message, Icon, Grid, Modal} from "semantic-ui-react";
import SearchBarProp from "./vastuscomponents/components/props/SearchBar";
import { connect } from "react-redux";
import {fetchUserAttributes} from "./redux_helpers/actions/userActions";
import NotificationBellProp from "./screens/messaging_tab/NotificationBell";
import NotificationFeed from "./screens/messaging_tab/NotificationBellFeed";
import Breakpoint from "react-socks";

/**
* Auth App
*
* This file contains the general outline of the app in a grid based format.
 */
class AuthApp extends Component {
    state = {
        userID: null,
        sentRequest: false,
        isLoading: true
    };

    // handleStickyRef = stickyRef => this.setState({ stickyRef })
    componentDidMount() {
        this.state.sentRequest = false;
        this.componentWillReceiveProps(this.props);
        // this.update(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.user.id !== this.state.userID) {
            this.setState({userID: newProps.user.id, sentRequest: false, isLoading: true});
        }
        this.update();
    }

    update() {
        if (!this.state.sentRequest && this.state.userID) {
            this.state.sentRequest = true;
            this.props.fetchUserAttributes(["name", "username", "birthday", "profileImagePath",
                "profileImagePaths", "challengesWon", "friends", "scheduledEvents", "ownedEvents", "completedEvents",
                "challenges", "ownedChallenges", "completedChallenges", "groups", "ownedGroups", "receivedInvites",
                "invitedChallenges"], (data) => {
                this.setState({isLoading: false});
            });
        }
    }

    //This displays the search bar, log out button, and tab system inside of the grid.
    render() {
        // const { stickyRef } = this.state;
        function getLoadingApp(isLoading) {
            if (isLoading) {
                return (
                    <div>
                        <Message icon>
                            <Icon name='spinner' size="small" loading />
                            <Message.Content>
                                <Message.Header>
                                    Loading...
                                </Message.Header>
                            </Message.Content>
                        </Message>
                    </div>
                );
            }
            else {
                return (
                    <Tabs />
                );
            }
        }

        return (
            <div>
                <Breakpoint medium up>
                <div className="App">
                    <Menu borderless inverted vertical fluid widths={1} fixed="top">
                        <Menu.Item>
                            <Container fluid>
                                <Grid columns="equal">
                                    <Grid.Row stretched>
                                        <Grid.Column style={{marginTop: "6px", marginLeft: "12px", marginRight: "-12px"}}>
                                            <Modal trigger={<Icon name="search" size="big"/>} closeIcon>
                                            </Modal>
                                        </Grid.Column>
                                        <Grid.Column width={14}>
                                            <SearchBarProp />
                                        </Grid.Column>
                                        <Grid.Column style={{marginTop: "6px", marginLeft: "-6px"}}>
                                            <Modal trigger={<Icon name="bell outline" size="big"/>} closeIcon>
                                                <Modal.Header align='center'>Notifcations</Modal.Header>
                                                <Modal.Content>
                                                    <NotificationFeed/>
                                                </Modal.Content>
                                            </Modal>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Container>
                        </Menu.Item>
                    </Menu>
                    {getLoadingApp(this.state.isLoading)}
                    {/*<Tabs />*/}
                </div>
                </Breakpoint>

                <Breakpoint small down>
                    <div className="App">
                        <Menu borderless inverted vertical fluid widths={1} fixed="top">
                            <Menu.Item>
                                <Container fluid>
                                    <Grid columns="equal">
                                        <Grid.Row stretched>
                                            <Grid.Column style={{marginTop: "6px", marginLeft: "12px", marginRight: "-12px"}}>
                                                <Modal trigger={<Icon name="search" size="big"/>} closeIcon>
                                                </Modal>
                                            </Grid.Column>
                                            <Grid.Column width={10}>
                                                <SearchBarProp />
                                            </Grid.Column>
                                            <Grid.Column style={{marginTop: "6px", marginLeft: "-6px"}}>
                                                <Modal trigger={<Icon name="bell outline" size="big"/>} closeIcon>
                                                    <Modal.Header align='center'>Notifcations</Modal.Header>
                                                    <Modal.Content>
                                                        <NotificationFeed/>
                                                    </Modal.Content>
                                                </Modal>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Container>
                            </Menu.Item>
                        </Menu>
                        {getLoadingApp(this.state.isLoading)}
                        {/*<Tabs />*/}
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
        fetchUserAttributes: (variablesList, dataHandler) => {
            dispatch(fetchUserAttributes(variablesList, dataHandler));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthApp);
