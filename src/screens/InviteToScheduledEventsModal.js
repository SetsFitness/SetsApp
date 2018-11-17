import React, { Component } from 'react'
import {Grid, Message, Button, Header, Modal} from 'semantic-ui-react';
import EventCard from "./EventCard";
import QL from "../GraphQL";
import { connect } from "react-redux";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
import { inspect } from 'util';
import Lambda from "../Lambda";
import {fetchEvent} from "../redux_helpers/actions/cacheActions";

class InviteToScheduledEventsModalProp extends Component {
    state = {
        isLoading: true,
        events: {},
        friendID: null,
        sentRequest: false,
        error: null
    };

    constructor(props) {
        super(props);
        //alert("Got into Scheduled Events constructor");
        // this.state.username = this.props.username;
    }

    update() {
        // TODO Change this if we want to actually be able to do something while it's loading
        const user = this.props.user;
        //alert("Updating Scheduled Events");
        if (!user.id) {
            alert("Pretty bad error");
            this.setState({isLoading: true});
        }

        if (this.state.isLoading && user.hasOwnProperty("scheduledEvents") && user.scheduledEvents && user.scheduledEvents.length) {
            this.setState({isLoading: false});
            for (let i = 0; i < user.scheduledEvents.length; i++) {
                this.props.fetchEvent(user.scheduledEvents[i], ["time", "time_created", "title", "goal", "members"]);
                // if (!(user.scheduledEvents[i] in this.state.events)) {
                //     this.addEventFromGraphQL(user.scheduledEvents[i]);
                // }
            }
        }
        else if (!this.props.info.isLoading) {
            if (!this.state.sentRequest && !this.props.info.error) {
                this.props.fetchUserAttributes(user.id, ["scheduledEvents"]);
                this.setState({sentRequest: true});
            }
        }
    }

    handleInviteToEvent(eventID) {
        Lambda.sendEventInvite(this.props.user.id, this.props.user.id, this.props.friendID, eventID,
            (data) => {
                this.handleClose();
            }, (error) => {
                alert(JSON.stringify(error));
            });
    }

    handleOpen = () => {this.props.onOpen.bind(this);};
    handleClose = () => {this.props.onClose.bind(this);};

    componentDidMount() {
        this.update();
    }

    componentWillReceiveProps(newProps, nextContext) {
        this.update();
    }

    render() {
        function rows(userID, friendID, events, eventInviteHandler) {
            const rowProps = [];
            for (let i = 0; i < events.length; i++) {
                if (events.hasOwnProperty(i) === true) {
                    rowProps.push(
                        <Grid.Row className="ui one column stackable center aligned page grid">
                            <Grid.Column>
                                    <EventCard eventID={events[i]}/>
                            </Grid.Column>
                            <Grid.Column/>
                            <Grid.Column>
                                <Button basic color='purple' onClick={() => {eventInviteHandler(events[i])}}>Invite to this Event</Button>
                            </Grid.Column>
                        </Grid.Row>
                    );
                }
            }

            return rowProps;
        }
        if (this.props.info.isLoading) {
            //alert("loading: " + JSON.stringify(this.state));
            return(
                <Modal open={this.props.open} onClose={this.props.onClose.bind(this)}>
                    <Message>Loading...</Message>
                </Modal>
            );
        }
        if (this.props.user.scheduledEvents && this.props.user.scheduledEvents.length && this.props.user.scheduledEvents.length > 0) {
            return(
                <Modal size='huge' open={this.props.open} onClose={this.props.onClose.bind(this)}>
                    <Modal.Header>Invite your friend to one of your scheduled events!</Modal.Header>
                    <Modal.Content>
                        <Grid columns={4}>
                            {rows(this.props.user.id, this.props.friendID, this.props.user.scheduledEvents, this.handleInviteToEvent.bind(this))}
                        </Grid>
                    </Modal.Content>
                </Modal>
            );
        }
        else {
            return(
                <Modal open={this.props.open} onClose={this.props.onClose.bind(this)}>
                    <Message>No scheduled events...</Message>
                </Modal>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info,
    cache: state.cache
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (id, attributeList) => {
            dispatch(fetchUserAttributes(id, attributeList));
        },
        fetchEvent: (id, variablesList) => {
            dispatch(fetchEvent(id, variablesList));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(InviteToScheduledEventsModalProp);