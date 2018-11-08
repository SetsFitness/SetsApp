import React, { Component } from 'react';
import { Modal, Button, Header } from 'semantic-ui-react';
import ClientModal from "./ClientModal";
import Lambda from '../Lambda';
import EventMemberList from "./EventMemberList";
import { connect } from 'react-redux';

/*
* Event Description Modal
*
* This is the event description which displays more in depth information about a challenge, and allows the user
* to join the challenge.
 */
class EventDescriptionModal extends Component {
    state = {
        isLoading: false,
        isOwned: null,
        isJoined: null,
        challenge: null,
        members: [],
        clientModalOpen: false,
    };

    componentDidMount() {
        if (this.props.challenge) {
            //alert("Owned: " + this.props.ifOwned + " Joined: " + this.props.ifJoined);
            this.setState({isLoading: false, challenge: this.props.challenge, isOwned: this.props.ifOwned,
                isJoined: this.props.ifJoined, members: this.props.members});
        }
        else {
            this.setState({isLoading: true, challenge: null, isOwned: null, isJoined: null, members: []})
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.challenge) {
            this.setState({isLoading: false, challenge: newProps.challenge, isOwned: newProps.ifOwned,
                isJoined: newProps.ifJoined, members: newProps.members});
        }
        else {
            this.setState({isLoading: true, challenge: null, isOwned: null, isJoined: null})
        }
        // if (newProps.challenge && this.props.id && this.props.ifJoined && this.props.ifOwned) {
        //     this.setState({isLoading: false, challenge: newProps.challenge, id: newProps.id});
        // }
    }

    /*
    handleDeleteChallengeButton() {
        alert("Handling deleting the challenge");
        Lambda.deleteChallenge(this.state.id, this.state.challenge, (data) => {
            alert(JSON.stringify(data));
        }, (error) => {
            alert(JSON.stringify(error));
        })
    }

    handleLeaveChallengeButton() {
        alert("Handling leaving the challenge");
        Lambda.leaveChallenge(this.state.id, this.state.id, this.state.challenge, (data) => {
            alert(JSON.stringify(data));
        }, (error) => {
            alert(JSON.stringify(error));
        })
    }

    handleJoinChallengeButton() {
        alert("Handling joining the challenge");
        Lambda.joinChallenge(this.state.id, this.state.id, this.state.challenge, (data) => {
            alert(JSON.stringify(data));
        }, (error) => {
            alert(JSON.stringify(error));
        })
    }
    */

    openClientModal() { this.setState({clientModalOpen: true}); }
    closeClientModal() { this.setState({clientModalOpen: false}); }

    render() {
        if (!this.state.challenge) {
            return null;
        }

        //This modal displays the challenge information and at the bottom contains a button which allows the user
        //to join a challenge.
        function createCorrectButton(isOwned, isJoined, userID, challengeID) {
            if(isOwned === true) {
                return (
                    <Button basic color='purple' onClick={() => {Lambda.deleteChallenge(userID, challengeID, (data) => {
                        alert(JSON.stringify(data));
                    }, (error) => {
                        alert(JSON.stringify(error));
                    })}}>
                        Delete
                    </Button>
                )
            }
            else if((isOwned === false) && isJoined === true) {
                return (
                <Button basic color='purple' onClick={() => {Lambda.deleteChallenge(userID, challengeID, (data) => {
                    alert(JSON.stringify(data));
                }, (error) => {
                    alert(JSON.stringify(error));
                })}}>
                    Leave
                </Button>
                )
            }
            else if((isOwned === false) && (isJoined === false)) {
                return (
                <Button basic color='purple' onClick={() => {Lambda.deleteChallenge(userID, challengeID, (data) => {
                    alert(JSON.stringify(data));
                }, (error) => {
                    alert(JSON.stringify(error));
                })}}>
                    Join
                </Button>
                )
            }
        }

        return(
            <Modal trigger={this.props.trigger}>
                <Modal.Header>{this.state.challenge.title}</Modal.Header>
                <Modal.Content image>
                    <div>
                        <ClientModal open={this.state.clientModalOpen} onClose={this.closeClientModal.bind(this)} clientID={this.state.challenge.owner}/>
                    </div>
                    <Button basic color='purple' onClick={this.openClientModal.bind(this)}>{this.state.challenge.owner}</Button>
                    <Modal.Description>
                        <Header>Info: </Header>
                        <p>{this.state.challenge.time}</p>
                        <p>{this.state.challenge.goal}</p>
                    </Modal.Description>
                    <div className='event list'>
                        <Modal trigger={<Button basic color='purple'>Members</Button>}>
                            <Modal.Content>
                                <EventMemberList ifOwned = {this.state.isOwned}/>
                            </Modal.Content>
                        </Modal>
                    </div>
                    <div className='button'>
                        {createCorrectButton(this.state.isOwned, this.state.isJoined, this.state.id, this.state.challenge.id)}
                    </div>
                </Modal.Content>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(EventDescriptionModal);