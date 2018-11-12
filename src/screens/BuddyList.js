import React, { Component } from 'react'
import { Button, List, Message, Image } from 'semantic-ui-react';
import ClientModal from "./ClientModal";
import QL from "../GraphQL";
import { connect } from "react-redux";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import Lambda from "../Lambda";
import { inspect } from 'util';
import proPic from '../img/BlakeProfilePic.jpg';

class BuddyListProp extends Component {
    state = {
        isLoading: true,
        friends: {},
        sentRequest: false,
        clientModalOpen: false,
        error: null
    };

    constructor(props) {
        super(props);
        this.update();
        this.openClientModal = this.openClientModal.bind(this);
        this.closeClientModal = this.closeClientModal.bind(this);
    }

    update() {
        // TODO Change this if we want to actually be able to do something while it's loading
        const user = this.props.user;
        if (!user.id) {
            alert("Pretty bad error");
            this.setState({isLoading: true});
        }

        if (user.hasOwnProperty("friends")) {
            //alert("Friends: " + user.friends);
            if(user.friends != null) {
                //alert("getting to friend loupe");
                for (let i = 0; i < user.friends.length; i++) {
                    if (!(user.friends[i] in this.state.friends)) {
                        this.addFriendFromGraphQL(user.friends[i]);
                    }
                }
            }
            else {
                alert("You got no friends you loser");
            }
        }
        else if (!this.props.user.info.isLoading) {
            if (!this.state.sentRequest && !this.props.user.info.error) {
                this.props.fetchUserAttributes(user.id, ["friends"]);
                this.setState({sentRequest: true});
            }
        }
    }

    addFriendFromGraphQL(friendID) {
        QL.getClient(friendID, ["id"], (data) => {
            console.log("successfully got a friend");
            this.setState({friends: {...this.state.friends, [data.id]: data}, isLoading: false});
        }, (error) => {
            console.log("Failed to get a vent");
            console.log(JSON.stringify(error));
            this.setState({error: error});
        });
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;
        this.update();
    }

    openClientModal = () => { this.setState({clientModalOpen: true}); };
    closeClientModal = () => { this.setState({clientModalOpen: false}); };

    render() {

        function rows(friends, closeModal, openModal, openBool, userID) {
            const rowProps = [];
            for (const key in friends) {
                if (friends.hasOwnProperty(key) === true) {
                    //alert("Friend " + key + ": " + JSON.stringify(friends[key].id));
                    rowProps.push(
                        <List.Item>
                            <List.Content floated="right">
                                <Button inverted onClick={() => {
                                    Lambda.removeFriend(userID, userID, friends[key].id,
                                        (data) => {
                                            alert("Successfully declined " + friends[key].id + " as a friend!");
                                        }, (error) => {
                                            alert(JSON.stringify(error));
                                            this.setState({error: error});
                                        })}}>Remove Buddy
                                </Button>
                            </List.Content>
                            <Image avatar src={proPic} circular/>
                            <List.Content as="a" onClick={openModal}>
                                <ClientModal open={openBool} onClose={closeModal} clientID={friends[key].id}/>
                                {friends[key].id}
                            </List.Content>
                        </List.Item>
                    );
                }
            }
            return rowProps;
        }

        if (this.state.isLoading) {
            return(
                <Message>Loading...</Message>
            )
        }
        return(
            <List relaxed divided verticalAlign="middle">
                {rows(this.state.friends, this.closeClientModal, this.openClientModal, this.state.clientModalOpen, this.props.user.id)}
            </List>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (id, attributeList) => {
            dispatch(fetchUserAttributes(id, attributeList));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuddyListProp);