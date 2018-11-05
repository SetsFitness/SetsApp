import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import EventDescriptionModal from './EventDescriptionModal';

/*
* Event Card
*
* This is the generic view for how a challenge shows up in any feeds or lists.
* It is used as a modal trigger in the feed.
 */
class EventCard extends Component {
    state = {
        error: null,
        isLoading: true,
        challenge: null
    };

    componentDidMount() {
        if (this.props.challenge) {
            this.setState({isLoading: false, challenge: this.props.challenge});
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.challenge) {
            this.setState({isLoading: false, challenge: newProps.challenge});
        }
    }

    render() {
        if (this.state.isLoading) {
            return(
                <Card>
                    <h1>Loading...</h1>
                </Card>
            );
        }

        return(
            // This is displays a few important pieces of information about the challenge for the feed view.
            <EventDescriptionModal challenge={this.state.challenge}
                trigger={
                    <Card>
                        <Card.Content>
                            <Card.Header>{this.state.challenge.title}</Card.Header>
                            <Card.Meta>{this.state.challenge.time}</Card.Meta>
                            <Card.Description>
                                {this.state.challenge.goal}
                            </Card.Description>
                        </Card.Content>
                    </Card>
                }
            />
        );
    }
}

export default EventCard;
