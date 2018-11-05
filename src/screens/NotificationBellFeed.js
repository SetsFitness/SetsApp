import React, {Component} from 'react'
import _ from 'lodash'
import {Grid, Image, Modal, Button, Item} from 'semantic-ui-react'
import { API, Auth, graphqlOperation } from "aws-amplify";
import setupAWS from './AppConfig';
import proPic from "../img/BlakeProfilePic.jpg";
import QL from "../GraphQL";
import Lambda from "../Lambda";
import ClientModal from "./ClientModal";

setupAWS();

//username of the current user
// var curUserName;
//
// //name of the current user
// var curName;
//
// //ID of the current user
// var curID;
//
// var curFriendRequests = [];
//
// var friendRequestNames = [];
//
// var friendRequestIDs = [];
//
// async function asyncCallCurUser(callback) {
//     console.log('calling');
//     var result = await Auth.currentAuthenticatedUser()
//         .then(user => user.username)
//         .catch(err => console.log(err));
//     console.log(result);
//     callback(result);
//     // expected output: 'resolved'
// }
//
// function callBetterCurUser(callback) {
//     asyncCallCurUser(function(data) {
//         callback(data);
//     });
// }
//
// function getUser(n, query, callback) {
//     asyncCall(query, function (data) {
//         callback(data.data.getClient);
//     });
// }
//
// callBetterCurUser(function(data) {
//     curUserName = data;
//     callQueryBetter(getClientByUsername(curUserName), function(data) {
//         curName = data.name;
//         curID = data.id;
//         if(data.friendRequests != null) {
//             for(var i = 0; i < data.friendRequests.length; i++) {
//                 curFriendRequests[i] = data.friendRequests[i];
//                 try{throw i}
//                 catch(ii) {
//                     getUser(ii, getClientByID(curFriendRequests[ii]), function (data) {
//                         console.log(ii);
//                         friendRequestNames[ii] = data.name;
//                         friendRequestIDs[ii] = data.id;
//                     });
//                 }
//             }
//         }
//     });
// });
//
// async function asyncCall(query, callback) {
//     console.log('calling');
//     var result = await API.graphql(graphqlOperation(query));
//     console.log(result);
//     callback(result);
// }
//
// function callQueryBetter(query, callback) {
//     asyncCall(query, function(data) {
//         let userJSON = JSON.stringify(data);
//         //alert(allChallengesJSON);
//         let user = JSON.parse(userJSON);
//         callback(user.data.getClientByUsername);
//     });
// }
//
// function getClientByUsername(userName) {
//     const userQuery = `query getUser {
//         getClientByUsername(username: "` + userName + `") {
//             id
//             name
//             username
//             challengesWon
//             scheduledChallenges
//             friends
//             friendRequests
//             }
//         }`;
//     return userQuery;
// }
//
// function getClientByID(userID) {
//     const userQuery = `query getUser {
//         getClient(id: "` + userID + `") {
//             id
//             name
//             username
//             challengesWon
//             scheduledChallenges
//             friends
//             friendRequests
//             }
//         }`;
//     return userQuery;
// }

function denyFriendRequest(userID, requestID) {
    Lambda.declineFriendRequest(userID, userID, requestID, handleBudRequestSuccess, handleBudRequestFailure)
}

function acceptFriendRequest(userID, requestID) {
    Lambda.acceptFriendRequest(userID, userID, requestID, handleBudRequestSuccess, handleBudRequestFailure)
}

function handleBudRequestSuccess(success) {
    alert(JSON.stringify(success));
}

function handleBudRequestFailure(failure) {
    alert(failure);
}

/*
* Notification Feed
*
* This is a feed which contains all of the buddy (friend) requests that have been sent to the current user.
 */
class NotificationFeed extends Component {
    state = {
        error: null,
        isLoading: false,
        username: null,
        friendRequests: [],
    };

    componentDidMount() {
        this.update();
    }

    componentWillReceiveProps(newProps) {
        if (this.props.username) {
            this.setState({username: this.props.username});
        }
    }

    update() {
        if (!this.state.username) {
            return;
        }
        this.setState({isLoading: true});
        QL.getClientByUsername(this.state.username, ["friendRequests"], (data) => {
            if (data.friendRequests) {
                for (let i = 0; i < data.friendRequests.length; i++) {
                    this.addFriendRequest(data.friendRequests[i]);
                }
            }
            else {
                this.setState({isLoading: false});
            }
        }, (error) => {

        });
    }

    addFriendRequest(friendRequestID) {
        QL.getClient(friendRequestID, ["name"], (data) => {
            this.setState({friendRequests: [...this.state.friendRequests, data], isLoading: false});
        }, (error) => {
            alert(error);
        })
    }

    handleAcceptFriendRequestButton(friendRequestID) {

    }

    handleDeclineFriendRequestButton(friendRequestID) {

    }

    //The buddy requests consists of a profile picture with the name of the user who has sent you a request.
    //To the right of the request is two buttons, one to accept and one to deny the current request.
    render() {
        function rows(friendRequests, acceptHandler, denyHandler)
        {
            return _.times(friendRequests.length, i => (
                <Grid.Row key={i} className="ui one column stackable center aligned page grid">
                    <Button basic color='purple'>{friendRequests[i].name}</Button>
                    {/*<ClientModal open={}/>*/}
                    <div> has sent you a buddy request</div>
                    <Button basic color='purple' onClick={acceptHandler}>Accept</Button>
                    <Button basic onClick={denyHandler}>Deny</Button>
                </Grid.Row>
            ));
        }

        return(
            <Grid>{rows(this.state.friendRequests, this.handleAcceptFriendRequestButton, this.handleDeclineFriendRequestButton)}</Grid>
        );
    }
}
// {/*<Modal>*/}
//     {/*<Modal.Header>Select a Photo</Modal.Header>*/}
//     {/*<Modal.Content image>*/}
//         {/*<Item>*/}
//             {/*<Item.Image size='medium' src={proPic} circular/>*/}
//             {/*<Item.Content>*/}
//                 {/*<Item.Header as='a'><div>{friendRequestNames[i]}</div></Item.Header>*/}
//                 {/*<Item.Extra>Friends: <div>{}</div></Item.Extra>*/}
//                 {/*<Item.Extra>Event Wins: <div>{}</div></Item.Extra>*/}
//             {/*</Item.Content>*/}
//         {/*</Item>*/}
//     {/*</Modal.Content>*/}
// {/*</Modal>*/}

export default NotificationFeed;