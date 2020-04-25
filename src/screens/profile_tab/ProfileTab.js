import React, {useState} from 'react'
import {connect} from "react-redux";
import {Button, Card, Modal, Dimmer, Loader, Input, Icon, Grid, Popup} from 'semantic-ui-react'
import ChallengeList from "../../vastuscomponents/components/lists/ChallengeList";
import DatabaseObjectList from "../../vastuscomponents/components/lists/DatabaseObjectList";
import ProfileImage from "../../vastuscomponents/components/props/ProfileImage";
import LogOutButton from "../../vastuscomponents/components/manager/LogOutButton";
import Calendar from "./Calendar.js";

/**
 * Displays either the name or an input to change the name if the page is in an editing state.
 *
 * @param {boolean} isEditing If the profile is currently in the editing phase.
 * @param {string} name The name of the user for the profile.
 * @returns {*} The React JSX used to display the component.
 */
function displayName(isEditing, name) {
  if (!isEditing) {
    return (
      <Card.Header as="h2" style={{"margin": "12px 0 0", color: 'purple'}}>{name}</Card.Header>
    );
  } else {
    return (
      <Input color='white' style={{color: 'white', background: 'white'}} defaultValue={name}/>
    );
  }
}

/**
 * This function controls the state of the edit button depending on whether the page is currently being edited or not.
 *
 * @param {boolean} isEditing If the profile is being edited or not.
 * @param {function(boolean)} setIsEditing {boolean} Function for setting the edit boolean.
 * @returns {*} The React JSX used to display the component.
 */
function editButton(isEditing, setIsEditing) {
  if (!isEditing) {
    return (
      <Button onClick={() => setIsEditing(p => !p)} floated='left' circular icon color={'purple'}>
        <Icon name='edit outline'/>
      </Button>
    );
  } else {
    return (
      <div>
        <Button onClick={() => setIsEditing(p => !p)} floated='left' circular icon color={'purple'}>
          <Icon name='save'/>
        </Button>
        <Button onClick={() => setIsEditing(p => !p)} floated='left' circular icon>
          <Icon name='cancel'/>
        </Button>
      </div>
    );
  }
}

// function saveChanges(setIsEditing, name) {
//     setIsEditing(p => !p);
// }

/**
 * This is the profile page which displays information about the current user.
 *
 * @param {Props} props The given props to the component.
 * @returns {*} The React JSX used to display the component.
 * @constructor
 */
const ProfileTab = (props) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!props.user) {
    return (
      <Dimmer>
        <Loader/>
      </Dimmer>
    )
  }
  return (
    <Card fluid raised style={{marginTop: '50px'}}>
      <Card.Content textAlign="center">
        {editButton(isEditing, setIsEditing)}
        <Popup style={{marginTop: '-70px'}}
          trigger={<Button floated='right' circular icon color={'#7F47AE'}>
            <Icon name='cog'/>
          </Button>}
          content={<LogOutButton/>}
          on='click'
          position='bottom right'
          basic
          style={{background: 'white', color: 'white'}}
        />
        <ProfileImage userID={props.user.id} profileImage={props.user.profileImage}
                      profileImagePaths={props.user.profileImagePaths} profileImages={props.user.profileImages}
                      editable={isEditing} />
        <Grid columns={1}>
          <Grid.Row>
            <Grid.Column>
              {displayName(isEditing, props.user.name)}
              <Card.Meta style={{marginBottom: '20px', color: '#D4AF37'}}
              >Challenge Wins: {props.user.challengesWon ? props.user.challengesWon.length : 0}</Card.Meta>

              <Modal basic size='mini' closeIcon
                     trigger={<Button primary circular icon size="massive"><Icon name="bookmark outline"/></Button>}>
                <Modal.Content>
                  <ChallengeList challengeIDs={props.user.completedChallenges}
                                 noChallengesMessage={"No completed challenges yet!"}/>
                </Modal.Content>
              </Modal>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
  );
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(ProfileTab);

/*<Modal size='large' closeIcon
       trigger={<Button primary circular icon size="massive"><Icon name="users"/></Button>}>
    <Modal.Header>Buddy List</Modal.Header>
    <Modal.Content image>
        <Modal.Description>
            <DatabaseObjectList
                ids={props.user.friends}
                noObjectsMessage={"No friends yet!"}
                acceptedItemTypes={["Client", "Trainer"]}
                randomized
            />
        </Modal.Description>
    </Modal.Content>
</Modal>
<div>Buddy List</div>*/

/*<Modal size='large' closeIcon
       trigger={<Button primary circular icon size="massive">
           <Icon name="calendar" style={{marginLeft: '-10px'}}/></Button>}>
    <Modal.Header>Scheduled Challenges</Modal.Header>
    <Modal.Content image>
        <Modal.Description>
            <Calendar/>
        </Modal.Description>
    </Modal.Content>
</Modal>
<div>Calendar</div>*/

/*<Grid columns={2}>
    <Grid.Row>
        <Grid.Column>
            <Modal basic size='mini' closeIcon
                   trigger={<Button primary circular icon size="massive">
                       <Icon name="trophy"/>
                   </Button>}>
                <Modal.Content>
                    <DatabaseObjectList
                        ids={props.user.ownedChallenges}
                        noObjectsMessage={"No Owned Challenges yet!"}
                        acceptedItemTypes={["Challenge"]}
                        randomized
                    />
                </Modal.Content>
            </Modal>
            <div>Owned Challenges</div>
        </Grid.Column>*/