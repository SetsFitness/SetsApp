import {Tab, Card, Label, Menu, Icon } from "semantic-ui-react";
import EventFeed from "./EventFeed";
import NotificationFeed from "./NotificationBellFeed";
import ProfileProp from "./Profile";
import React from "react";
import CreateEventProp from "./CreateEvent";
import NextWorkoutProp from "./NextWorkout";
import ScheduledEventsList from "./ScheduledEventList";

/**
* Tabs TODO Potentially clean this up
*
* The app is currently split up into three sections: home, profile, and notifications.
 */
export default () => (
    <Tab menu={{fixed: "bottom", widths: 3, labeled: true, size: "huge"}} panes={
        [
            {
                menuItem:
                    (<Menu.Item>
                        <Icon name='home' size='large' />
                    </Menu.Item>),
                render: () =>
                    <Tab.Pane basic attached={false}>
                        <CreateEventProp/>
                        <NextWorkoutProp/>
                        <div className="ui one column stackable center aligned page grid">
                            <EventFeed/>
                        </div>
                    </Tab.Pane>
            },
            {
                menuItem: (<Menu.Item>
                    <Icon name='user circle outline' size='large' />
                </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <ProfileProp/>
                </Tab.Pane>
            },
            {
                menuItem: (
                    <Menu.Item>
                        <Icon name='bell outline' size='large' />
                    </Menu.Item>),
                render: () => <Tab.Pane attached={false}>
                    <div className="ui one column stackable center aligned page grid">
                        <Card>
                            <Card.Content>
                                <Card.Header textAlign={'center'}>Notification Feed</Card.Header>
                            </Card.Content>
                            <Card.Content>
                                <NotificationFeed/>
                            </Card.Content>
                        </Card>
                    </div>
                </Tab.Pane>
            },
        ]
    }/>
);