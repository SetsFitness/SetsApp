import React, { Component } from 'react';
//import './App.css';
// import Tabs from './screens/Tabs.js';
import Amplify, { API, graphqlOperation, Auth, Analytics } from 'aws-amplify';
import { inspect } from 'util'
import Semantic, { Checkbox, Modal, Button, Input, Form, Container, Icon, TextArea } from 'semantic-ui-react';
import {
    DateInput,
    TimeInput,
    DateTimeInput,
    DatesRangeInput
} from 'semantic-ui-calendar-react';
import setupAWS from "./appConfig";
// import { Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings, Connect, withAuthenticator } from 'aws-amplify-react';
// import aws_exports from './aws-exports';
// import SearchBarProp from "./screens/searchBar";

setupAWS();

//username of the current user
var curUserName;

//name of the current user
var curUserID;

//Number of challenge wins for the current user
//var curChalWins;

async function asyncCallCurUser(callback) {
    console.log('calling');
    var result = await Auth.currentAuthenticatedUser()
        .then(user => user.username)
        .catch(err => console.log(err));
    console.log(result);
    callback(result);
    // expected output: 'resolved'
}

function callBetterCurUser(callback) {
    asyncCallCurUser(function(data) {
        /*
        let usernameJSON = JSON.stringify(data);
        alert(usernameJSON);
        let username = JSON.parse(usernameJSON);
        */
        //alert(data);
        callback(data);
    });
}

callBetterCurUser(function(data) {
    curUserName = data;
    //alert(getClient(curUserName));
    callQueryBetter(getClient(curUserName), function(data) {
        curUserID = data.id;
        //alert(curUserID);
        //curChalWins = data.challengesWon;
    });
});

async function asyncCall(query, callback) {
    console.log('calling');
    var result = await API.graphql(graphqlOperation(query));
    console.log(result);
    callback(result);
    // expected output: 'resolved'
}

function callQueryBetter(query, callback) {
    asyncCall(query, function(data) {
        let userJSON = JSON.stringify(data);
        //alert(userJSON);
        let user = JSON.parse(userJSON);
        callback(user.data.getClientByUsername);
    });

}

function getClient(userName) {
    const userQuery = `query getUser {
        getClientByUsername(username: "` + userName + `") {
            id
            name
            username
            challengesWon
            scheduledChallenges
            friends
            friendRequests
            }
        }`;
    return userQuery;
}

window.LOG_LEVEL='DEBUG';

window.LOG_LEVEL='DEBUG';

var AWS = require("aws-sdk");

AWS.config.update({region: 'us-east-1'});
AWS.config.credentials = new AWS.CognitoIdentityCredentials(
    {IdentityPoolId: 'us-east-1:d9a16b98-4393-4ff6-9e4b-5e738fef1222'});

console.log("Adding a new item...");

var lambda = new AWS.Lambda({region: 'us-east-1', apiVersion: '2015-03-31'});


function convertDateTimeToISO8601(dateAndTime) {
    var dateTimeString = String(dateAndTime);
    var day = dateTimeString.substr(0, 2);
    var month = dateTimeString.substr(3, 2);
    var year = dateTimeString.substr(6, 4);
    var time = dateTimeString.substr(11, 5);
    return year + "-" + month + "-" + day + "T" + time + ":00+00:00";
}

class CreateEventProp extends Component {

    state = {
        date: '',
        time: '',
        dateTime: '',
        dateTimeEnd: '',
        datesRange: '',
        checked: false
    };

    toggle = () => this.setState({ checked: !this.state.checked });

    challengeState = {
        title: "",
        date: "",
        location: "",
        time: "",
        capacity: "",
        goal: "",
        description: "",
        access: "Public"
    };

    /*
    dateStartState = {
        date: '',
        time: '',
        dateTime: '',
        datesRange: ''
    };

    dateEndState = {
        date: '',
        time: '',
        dateTime: '',
        datesRange: ''
    };

    handleStartTimeChange = (event, {name, value}) => {
        if (this.dateStartState.hasOwnProperty(name)) {
            this.dateStartState[name] = value;
            console.log("New date " + name + "equals: " + convertDateTimeToISO8601(value));
        }
    };

    handleEndTimeChange = (event, {name, value}) => {
        if (this.dateEndState.hasOwnProperty(name)) {
            this.dateEndState[name] = value;
            console.log("New date " + name + "equals: " + convertDateTimeToISO8601(value));
        }
    };
    */

    handleStartTimeChange = (event, {name, value}) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({ [name]: value });
            console.log(convertDateTimeToISO8601(value));
        }
    }

    handleEndTimeChange = (event, {name, value}) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({ [name]: value });
            console.log(convertDateTimeToISO8601(value));
        }
    }

    changeStateText(key, value) {
        // TODO Sanitize this input
        // TODO Check to see if this will, in fact, work.!
        this.challengeState[key] = value.target.value;
        console.log("New " + key + " is equal to " + value.target.value);
    }

    handleAccessSwitch = () => {
        if(this.challengeState.access == 'Public') {
            this.challengeState.access = 'Private';
            //alert(this.challengeState.access);
        }
        else if (this.challengeState.access == 'Private') {
            this.challengeState.access = 'Public';
            //alert(this.challengeState.access);
        }
        else {
            alert("Challenge access should be public or private");
        }

    };

    handleSubmit = () => {

        let createChallengeJSON = {
            fromID: curUserID,
            action: "CREATE",
            itemType: "Challenge",
            createChallengeRequest: {
                owner: curUserID,
                time: convertDateTimeToISO8601(this.state.dateTime) +
                    "_" +
                    convertDateTimeToISO8601(this.state.dateTimeEnd),
                capacity: String(this.challengeState.capacity),
                address: String(this.challengeState.location),
                title: String(this.challengeState.title),
                description: String(this.challengeState.description),
                goal: String(this.challengeState.goal),
                access: String(this.challengeState.access)
                // You can also set these optionally
                // description: "TODO",
                // difficulty: "TODO",
                // memberIDs: [ "TODO", "TODO", "TODO" ],
                // access: "TODO",
            }
        };

        lambda.invoke({
                          FunctionName: "VastusDatabaseLambdaFunction",
                          // This is where you put in the JSON for creation
                          Payload: JSON.stringify(createChallengeJSON)
    }, function(error, data) {
            alert("createChallengeJSON:: " + JSON.stringify(JSON.parse(data.Payload)));
        if (error) {
            alert(error);
            // TODO HANDLE WHAT HAPPENS afterwards
            // TODO keep in mind that this is asynchronous
        } else {
            // TODO Necessary?
            alert(JSON.stringify(data.Payload));
            // TODO HANDLE WHAT HAPPENS afterwards
            // TODO keep in mind that this is asynchronous
            let payload = JSON.parse(data.Payload);
            if (payload.errorMessage) {
                // TODO Java error handling
                alert("ERROR: " + payload.errorMessage + "!!! TYPE: " + payload.errorType + "!!! STACK TRACE: " + payload.stackTrace + "!!!");
            }
        }

        // TODO Is this where these go?
        //event.persist();
    });
};

render() {
        return (
            <Container style={{padding: 10}}>
                <Modal trigger={<Button basic color='purple'>+ Create Challenge</Button>}>
                    <Modal.Header align='center'>Create Event</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group unstackable widths={2}>
                                <div className="field">
                                    <label>Title</label>
                                    <Input type="text" name="title" placeholder="Title" onChange={value => this.changeStateText("title", value)}/>
                                </div>
                                <div className="field">
                                    <label>Location</label>
                                    <Input type="text" name="location" placeholder="Address for challenge" onChange={value => this.changeStateText("location", value)}/>
                                </div>
                                <div className="field">
                                    <label>Start Date and Time</label>
                                    <DateTimeInput
                                        name="dateTime"
                                        placeholder="Start"
                                        value={this.state.dateTime}
                                        iconPosition="left"
                                        onChange={this.handleStartTimeChange} />
                                    </div>
                                <div className="field">
                                    <label>End Date and Time</label>
                                    <DateTimeInput
                                        name="dateTimeEnd"
                                        placeholder="End"
                                        value={this.state.dateTimeEnd}
                                        iconPosition="left"
                                        onChange={this.handleEndTimeChange} />
                                </div>
                                <div className="field">
                                    <label>Capacity</label>
                                    <Input type="text" name="capacity" placeholder="Number of allowed attendees... " onChange={value => this.changeStateText("capacity", value)}/>
                                </div>
                                <div className="field">
                                    <label>Goal</label>
                                    <Input type="text" name="goal" placeholder="Criteria the victor is decided on..." onChange={value => this.changeStateText("goal", value)}/>
                                </div>
                            </Form.Group>
                            <div className="Challenge Description">
                                <label>Challenge Description</label>
                                <TextArea type="text" name="description" placeholder="Describe challenge here... " onChange={value => this.changeStateText("description", value)}/>
                            </div>
                            <div className="Submit Button">
                                <Button type='button' onClick={() => { this.handleSubmit()}}>Submit</Button>
                            </div>
                            <div className="Privacy Switch">
                                <Checkbox toggle onClick={this.handleAccessSwitch} onChange={this.toggle} checked={this.state.checked}/>
                                <div>{this.challengeState.access}</div>
                            </div>
                        </Form>
                    </Modal.Content>
                </Modal>
            </Container>
        );
    }
}

export default CreateEventProp;


