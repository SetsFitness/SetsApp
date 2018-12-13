import React, { Component, Fragment } from 'react'
import {Message, Button, Modal} from 'semantic-ui-react';
import EventCard from "../components/EventCard";
// import QL from "../GraphQL";
import { connect } from "react-redux";
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";
// import { inspect } from 'util';
import Lambda from "../Lambda";
import {fetchEvent} from "../redux_helpers/actions/cacheActions";

class InviteToScheduledEventsModalProp extends Component {
    state = {
        isLoading: true,
        events: {},
        friendID: null,
        sentRequest: false,
        error: null,
        isInviteLoading: false
    };

    constructor(props) {
        super(props);
    }

    update() {
        // TODO Change this if we want to actually be able to do something while it's loading
        const user = this.props.user;
        //alert("Updating Scheduled Events");
        if (!user.id) {
            console.error("Pretty bad error");
            this.setState({isLoading: true});
            this.setState({isInviteLoading: false});
        }

        if (this.state.isLoading && user.hasOwnProperty("scheduledEvents") && user.scheduledEvents && user.scheduledEvents.length) {
            this.setState({isLoading: false});
            for (let i = 0; i < user.scheduledEvents.length; i++) {
                this.props.fetchEvent(user.scheduledEvents[i], ["time", "time_created", "title", "goal", "members"]);
            }
            this.setState({isInviteLoading: false});
        }
        else if (!this.props.info.isLoading) {
            if (!this.state.sentRequest && !this.props.info.error) {
                this.props.fetchUserAttributes(["scheduledEvents"]);
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

    sendInvite(event) {
        this.setState({isInviteLoading: true});
        this.handleInviteToEvent(event);
    }

    render() {
        function rows(userID, friendID, events, eventInviteHandler, isInviteLoading) {
            const rowProps = [];
            for (let i = 0; i < events.length; i++) {
                if (events.hasOwnProperty(i) === true) {
                    rowProps.push(
                        <Fragment>
                            {/* Need to put Button in card for UI aesthetics */}
                            <EventCard eventID={events[i]}/>
                            <Button loading={isInviteLoading} basic color='purple' onClick={() => {eventInviteHandler(events[i])}}>Invite to Challenge</Button>
                        </Fragment>
                    );
                }
            }

            return rowProps;
        }
        if (this.props.info.isLoading) {
            //alert("loading: " + JSON.stringify(this.state));
            return(
                <Modal dimmer='blurring' open={this.props.open} onClose={this.props.onClose.bind(this)}>
                    <Message>Loading...</Message>
                </Modal>
            );
        }
        if (this.props.user.scheduledEvents && this.props.user.scheduledEvents.length && this.props.user.scheduledEvents.length > 0) {
            return(
                <Modal centered dimmer='blurring' size='large' open={this.props.open} onClose={this.props.onClose.bind(this)} closeIcon>
                    <Modal.Header className="u-bg--bg">Select Challenge</Modal.Header>
                    <Modal.Content className="u-bg--bg">
                        {rows(this.props.user.id, this.props.friendID, this.props.user.scheduledEvents, this.sendInvite.bind(this),
                            this.state.isInviteLoading)}
                    </Modal.Content>
                </Modal>
            );
        }
        else {
            return(
                <Modal dimmer='blurring' open={this.props.open} onClose={this.props.onClose.bind(this)}>
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
        fetchUserAttributes: (attributeList) => {
            dispatch(fetchUserAttributes(attributeList));
        },
        fetchEvent: (id, variablesList) => {
            dispatch(fetchEvent(id, variablesList));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(InviteToScheduledEventsModalProp);