import React, { Component } from 'react'
import _ from 'lodash';
import {Grid, Button, Message, Image, Modal, Label, Icon, Form, Container, TextArea, Checkbox, Rating} from 'semantic-ui-react';
import CreateEventProp from "./CreateEvent";
import VTLogo from "../img/vt_new.svg"
import {connect} from "react-redux";
import Lambda from "../Lambda";
import {setError} from "../redux_helpers/actions/infoActions";
import {clearEventQuery, fetchEvent, putEvent, putEventQuery} from "../redux_helpers/actions/cacheActions";

// Take from StackOverflow, nice snippit!
// https://stackoverflow.com/a/17415677
Date.prototype.toIsoString = function() {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
};

/*
* Create Event Prop
*
* This is the modal for creating events. Every input is in the form of a normal text input.
* Inputting the time and date utilizes the Semantic-ui Calendar React library which isn't vanilla Semantic.
 */
class CreateChallengeProp extends Component {

    state = {
        checked: false,
        isSubmitLoading: false,
        showModal: false,
        submitError: "",
        showSuccessModal: false,
        showSuccessLabel: false,
        showSuccessLabelTimer: 0,
        challengeType: ""
    };

    toggle = () => this.setState({ checked: !this.state.checked });

    eventState = {
        title: "",
        eventDate: null,
        startTime: CreateChallengeProp.getNowTimeString(),
        duration: '60',
        location: "",
        time: "",
        time_created: "",
        capacity: "",
        goal: "",
        description: "",
        access: "public"
    };

    changeStateText(key, value) {
        // TODO Sanitize this input
        // TODO Check to see if this will, in fact, work.!
        this.eventState[key] = value.target.value;
        console.log("New " + key + " is equal to " + value.target.value);
    }

    handleAccessSwitch = () => {
        if(this.eventState.access === 'public') {
            this.eventState.access = 'private';
        }
        else if (this.eventState.access === 'private') {
            this.eventState.access = 'public';
        }
        else {
            alert("Event access should be public or private");
        }
    };

    handleSubmit = () => {
        // TODO Make sure the dates are well formed?
        /*
        const year = parseInt(this.eventState.eventDate.substr(0, 4));
        const month = parseInt(this.eventState.eventDate.substr(5, 2)) - 1;
        const day = parseInt(this.eventState.eventDate.substr(8, 2));
        const hour = parseInt(this.eventState.startTime.substr(0, 2));
        const minute = parseInt(this.eventState.startTime.substr(3, 2));
        let startDate = new Date(year, month, day, hour, minute);
        let endDate = new Date(startDate.getTime() + (60000 * this.eventState.duration));
        // alert(endDate.toDateString());
        // alert(endDate.getMinutes());
        // endDate.setMinutes(endDate.getMinutes() + this.eventState.duration);
        // alert(endDate.getMinutes());
        // alert(endDate.toDateString());



        const time = startDate.toIsoString() + "_" + endDate.toIsoString();
        */
        this.setState({isSubmitLoading: true});

        // TODO Check to see if valid inputs!
        if (this.eventState.capacity && this.eventState.title && this.eventState.goal) {
            if (Number.isInteger(+this.eventState.capacity)) {
                Lambda.createChallengeOptional(this.props.user.id, this.props.user.id, this.eventState.eventDate, this.eventState.capacity,
                    "n/a", this.eventState.title, this.eventState.goal, "n/a",
                    "3", [], [], this.eventState.access, null, "n/a", (data) => {
                        console.log("Successfully created a challenge!");
                        //This is the second call
                        this.props.clearEventQuery();
                        this.props.queryEvents();
                        this.setState({isSubmitLoading: false});
                        this.closeModal();
                        this.setState({showSuccessLabel: true});
                        //this.setState({showSuccessModal: true});

                    }, (error) => {
                        //alert(JSON.stringify(error));
                        this.setState({submitError: "*" + JSON.stringify(error)});
                        this.setState({isSubmitLoading: false});
                    });
            }
            else {
                this.setState({isSubmitLoading: false, submitError: "Capacity needs to be an integer!"});
            }
        }
        else {
            this.setState({isSubmitLoading: false, submitError: "All fields need to be filled out!"});
        }
    };

    handleDurationChange = (e, data) => {
        this.eventState.duration = data.value;
        //alert(this.eventState.duration);
        // this.setState({
        //     duration: data.value,
        // }, () => {
        //     console.log('value',this.state.duration);
        // });
    };

    static getTodayDateString() {
        // This is annoying just because we need to work with time zones :(
        const shortestTimeInterval = 5;
        const date = new Date();
        date.setMinutes(date.getMinutes() + (shortestTimeInterval - (date.getMinutes() % shortestTimeInterval)));
        return date.toIsoString().substr(0, 10);
    }

    static getNowTimeString() {
        // Sneaking some modular arithmetic in this ;) This is so that the time shown is always a nice lookin' number
        const shortestTimeInterval = 5;
        const date = new Date();
        date.setMinutes(date.getMinutes() + (shortestTimeInterval - (date.getMinutes() % shortestTimeInterval)));
        return date.toIsoString().substr(11, 5);
    }

    closeModal = () => {
        this.setState({ showModal: false })
    };

    createSuccessModal() {

        return(
            <Modal open={this.state.showSuccessModal}>
                <Modal.Header align='center'>Successfully Created Event!</Modal.Header>
                <Modal.Content>
                    <Button fluid negative size="small" onClick={this.closeSuccessModal}>Ok</Button>
                </Modal.Content>
            </Modal>
        );
    }

    createSuccessLabel() {
        if(this.state.showSuccessLabel && this.state.showModal) {
            this.setState({showSuccessLabel: false});
        }
        else if(this.state.showSuccessLabel) {
            return (<Label inverted primary fluid size="massive" color="green">Successfully Created Event!</Label>);
        }
        else {
            return null;
        }
    }

    closeSuccessModal = () => {
        this.setState({showSuccessModal: false});
    };

    displayError() {
        if(this.state.submitError !== "") {
            return (<Message negative>
                <Message.Header>Sorry!</Message.Header>
                <p>{this.state.submitError}</p>
            </Message>);
        }
    }

    render() {

        return (
            <Modal closeIcon trigger={<Button primary fluid size="large"> <Icon name='plus' /> Post Challenge</Button>}>
                <Modal.Header align='center'>Challenge Builder</Modal.Header>
                <Modal.Content align='center'>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                    <Image size='medium' src={require('../img/HIIT_icon.png')} onClick={() => {alert("call hiit tag handler")}}/>
                                    HIIT
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Image size='medium' src={require('../img/Strength_icon.png')} onClick={() => {alert("call strength tag handler")}}/>
                                Strength
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Image size='medium' src={require('../img/Performance_Icon.png')} onClick={() => {alert("call performance tag handler")}}/>
                                Performance
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Image size='medium' src={require('../img/endurance_icon.png')} onClick={() => {alert("call endurance tag handler")}}/>
                                Endurance
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <Container>
                        <Grid.Row centered>
                            <Grid.Column width={2} className="segment centered">
                                <Form onSubmit={this.handleSubmit}>
                                        <Form.Input width={5} label="Title" type="text" name="title" placeholder="Title" onChange={value => this.changeStateText("title", value)}/>
                                        <div className="field" width={5}>
                                            <label>End Date & Time</label>
                                            <input width={5} type="datetime-local" name="challengeDate" onChange={value => this.changeStateText("eventDate", value)}/>
                                        </div>
                                        <Form.Input width={5} label="Capacity" type="text" name="capacity" placeholder="Number of allowed attendees... " onChange={value => this.changeStateText("capacity", value)}/>
                                        <Form.Input width={5} label="Goal" type="text" name="goal" placeholder="Criteria the victor is decided on..." onChange={value => this.changeStateText("goal", value)}/>
                                        {/*<Form.Field>
                                            <div className="field" width={5}>
                                                <label>Difficulty</label>
                                                <Rating icon='star' defaultRating={1} maxRating={3} />
                                            </div>
                                        </Form.Field>*/}
                                        <Form.Field width={12}>
                                            <Checkbox toggle onClick={this.handleAccessSwitch} onChange={this.toggle} checked={this.state.checked} label={this.eventState.access} />
                                        </Form.Field>
                                    <div>{this.displayError()}</div>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                    </Container>
                </Modal.Content>
                <Modal.Actions>
                    <Button loading={this.state.isSubmitLoading} disabled={this.state.isSubmitLoading} primary size="big" type='button' onClick={() => { this.handleSubmit()}}>Submit</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info,
    cache: state.cache
});

const mapDispatchToProps = (dispatch) => {
    return {
        setError: (error) => {
            dispatch(setError(error));
        },
        fetchEvent: (id, variablesList) => {
            dispatch(fetchEvent(id, variablesList));
        },
        putEvent: (event) => {
            dispatch(putEvent(event));
        },
        putEventQuery: (queryString, queryResult) => {
            dispatch(putEventQuery(queryString, queryResult));
        },
        clearEventQuery: () => {
            dispatch(clearEventQuery())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateChallengeProp);