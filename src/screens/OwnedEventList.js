import React, { Component } from 'react'
import {Grid, Message} from 'semantic-ui-react';
import EventCard from "./EventCard";
import QL from '../GraphQL';
import { connect } from 'react-redux';
import {fetchUserAttributes} from "../redux_helpers/actions/userActions";

class OwnedEventsList extends Component {
    state = {
        isLoading: true,
        events: {},
        sentRequest: false,
        error: null
    };

    constructor(props) {
        super(props);
        // alert("Got into Scheduled events constructor");
        // this.state.username = this.props.username;
        this.update();
    }

    update() {
        // TODO Change this if we want to actually be able to do something while it's loading
        const user = this.props.user;
        if (!user.id) {
            alert("Pretty bad error");
            this.setState({isLoading: true});
        }

        if (user.hasOwnProperty("ownedEvents")) {
            for (let i = 0; i < user.ownedEvents.length; i++) {
                if (!(user.ownedEvents[i] in this.state.events)) {
                    this.addEventFromGraphQL(user.ownedEvents[i]);
                }
            }
        }
        else if (!this.props.info.isLoading) {
            if (!this.state.sentRequest && !this.props.info.error) {
                this.props.fetchUserAttributes(user.id, ["ownedEvents"]);
                this.setState({sentRequest: true});
            }
        }
    }

    addEventFromGraphQL(eventID) {
        QL.getEvent(eventID, ["id", "time", "time_created", "title", "goal", "owner", "members"], (data) => {
            console.log("successfully got a event");
            this.setState({events: {...this.state.events, [data.id]: data}, isLoading: false});
        }, (error) => {
            console.log("Failed to get a event");
            console.log(JSON.stringify(error));
            this.setState({error: error});
        });
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;
        this.update();
    }

    render() {
        function rows(events) {
            const row = [];
            const rowProps = [];
            if(events != null) {
                for (const key in events) {
                    if (events.hasOwnProperty(key)) {
                        //alert(JSON.stringify(events[key]));
                        row.push(
                            events[key]
                        );
                    }
                }
            }
            //row.sort(function(a,b){return b.time_created.localeCompare(a.time_created)});

            for (const key in row) {
                if (row.hasOwnProperty(key)) {
                    //alert(JSON.stringify(events[key]));
                    rowProps.push(
                        <Grid.Row className="ui one column stackable center aligned page grid">
                            <EventCard eventID={row[key].id}/>
                        </Grid.Row>
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
            <Grid>{rows(this.state.events)}</Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (id, attributeList) => {
            dispatch(fetchUserAttributes(id, attributeList));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OwnedEventsList);

