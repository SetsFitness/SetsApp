import React, {Component} from 'react'
import _ from 'lodash'
import {Image, Modal, Button, Dimmer, Loader, Card, Feed, Icon, Divider} from 'semantic-ui-react'
import { API, Auth, graphqlOperation } from "aws-amplify";
import setupAWS from '../AppConfig';
import proPic from "../img/BlakeProfilePic.jpg";
import QL from "../GraphQL";
import Lambda from "../Lambda";
import ClientModal from "./ClientModal";

class Notification extends Component {
    state = {
        error: null,
        isLoading: false,
        userID: null,
        friendRequestID: null,
        clientModalOpen: false,
        name: null
    };

    constructor(props) {
        super(props);
        this.state.friendRequestID = this.props.friendRequestID;
        this.state.userID = this.props.userID;
        this.update = this.update.bind(this);
        this.update();
    }

    componentWillReceiveProps(newProps) {
        this.setState({friendRequestID: newProps.friendRequestID});
        this.setState({userID: newProps.userID});
        this.update();
    }

    update = () => {
        if (this.state.friendRequestID) {
            QL.getClient(this.state.friendRequestID, ["name"], (data) => {
                if (data.name) {
                    this.setState({isLoading: false, name: data.name});
                }
                else {
                    this.setState({isLoading: false});
                }
            }, (error) => {
                console.log("Getting friend request ID failed");
                if (error.message) {
                    error = error.message;
                }
                console.log(error);
                this.setState({error: error, isLoading: false});
            });
        }
    };

    handleClientModalOpen() { this.setState({clientModalOpen: true})};
    handleClientModalClose() { this.setState({clientModalOpen: false})};

    handleAcceptFriendRequestButton(userID, friendRequestID) {
        alert("Accepting " + friendRequestID);
        if(userID && this.state.friendRequestID) {
            alert("User ID: " + userID + " Friend ID: " + friendRequestID);
            Lambda.acceptFriendRequest(userID, userID, friendRequestID,
                (data) => {
                    alert("Successfully added " + userID + " as a friend!");
                    this.props.feedUpdate();
                }, (error) => {
                    alert(JSON.stringify(error));
                    this.setState({error: error});
                });
        }
    }

    handleDeclineFriendRequestButton(userID, friendRequestID) {
        alert("DECLINING " + "User ID: " + userID + " Friend ID: " + friendRequestID);
        if(userID != null && friendRequestID != null) {
            Lambda.declineFriendRequest(userID, userID, friendRequestID,
                (data) => {
                    alert("Successfully declined " + userID + " as a friend!");
                    this.props.feedUpdate();
                }, (error) => {
                    alert(JSON.stringify(error));
                    this.setState({error: error});
                });
        }
        else {
            alert("Lambda Didn't go through");
        }
    }

    render() {
        if (this.state.isLoading) {
            return(
                <Dimmer>
                    <Loader />
                </Dimmer>
            );
        }
        return(
            <Card fluid raised>
                <Card.Content>
                    <Feed>
                        <Feed.Event>
                            <Feed.Label>
                                <Image src={proPic} circular size="large" />
                            </Feed.Label>
                            <Feed.Content>
                                <Feed.Summary>
                                    <Feed.User onClick={this.handleClientModalOpen.bind(this)}>
                                        {this.state.name}
                                    </Feed.User>
                                    <ClientModal
                                        clientID={this.state.friendRequestID}
                                        open={this.state.clientModalOpen}
                                        onOpen={this.handleClientModalOpen.bind(this)}
                                        onClose={this.handleClientModalClose.bind(this)}
                                    />
                                    {' '}has sent you a buddy request
                                    <Feed.Date>4 hours ago</Feed.Date>
                                </Feed.Summary>
                                <Divider />
                                <Feed.Extra>
                                    <Button floated="right" size="small" onClick={() => {this.handleDeclineFriendRequestButton(this.state.userID, this.state.friendRequestID)}}>Deny</Button>
                                    <Button primary floated="right" size="small" onClick={() => {this.handleAcceptFriendRequestButton(this.state.userID, this.state.friendRequestID)}}>Accept</Button>
                                </Feed.Extra>
                            </Feed.Content>
                        </Feed.Event>
                    </Feed>
                </Card.Content>
            </Card>
        );
    }
}

export default Notification;
