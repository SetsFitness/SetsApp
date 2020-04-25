import React, {useState} from 'react';
import {Grid, Button} from "semantic-ui-react";
import MessageBoardFeed from "../../vastuscomponents/components/messaging/MessageBoardFeed";
import {connect} from "react-redux";
import StartChatModal from "../../vastuscomponents/components/manager/StartChatModal";

/**
 * Displays all of the current conversations the user has going and allows the user to start new ones with other users.
 *
 * @param {Props} props The given props to the component.
 * @returns {*} The React JSX used to display the component.
 * @constructor
 */
const MessageTab = (props) => {
  const [chatModalOpen, setChatModalOpen] = useState(false);
  return (
    <Grid centered>
      <Grid.Row>
        <Button primary onClick={() => chatModalOpen || setChatModalOpen(true)}>Start New Chat</Button>
      </Grid.Row>
      <Grid.Row>
        <StartChatModal open={chatModalOpen} onClose={() => setChatModalOpen(false)}/>
      </Grid.Row>
      <Grid.Row>
        <MessageBoardFeed userID={props.user.id}/>
      </Grid.Row>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(MessageTab);