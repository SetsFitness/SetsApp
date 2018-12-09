import { Fragment } from 'react';
import {Tab, Menu, Icon, Header, Feed } from "semantic-ui-react";
import EventFeed from "./EventFeed";
import NotificationFeed from "./NotificationBellFeed";
import ProfileProp from "./Profile";
import React from "react";
import CreateEventProp from "./CreateEvent";
import NextEventProp from "../components/NextWorkout";
// import ScheduledEventsList from "./ScheduledEventList";
import LeaderBoard from "./Leaderboard";
import CommentScreen from "./CommentScreen";

/**
* Tabs TODO Potentially clean this up
*
* The app is currently split up into three sections: home, profile, and notifications.
 */
export default () => (
    <Tab menu={{fixed: "bottom", widths: 4, size: "small", inverted: true}} panes={
        [
            {
                menuItem:
                    (<Menu.Item key={0}>
                        <Icon name='home' size='large' />
                    </Menu.Item>),
                render: () =>
                    <Tab.Pane basic attached={false}>
                        <CreateEventProp/>
                        <NextEventProp/>
                        <EventFeed/>
                    </Tab.Pane>
            },
            {
                menuItem: (
                    <Menu.Item key={1}>
                        <Icon name='user circle outline' size='large' />
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <ProfileProp/>
                </Tab.Pane>
            },
            {
                menuItem: (
                    <Menu.Item key={2}>
                        <Icon name='winner' size='large' />
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <LeaderBoard />
                </Tab.Pane>
            },
            {
                menuItem: (
                    <Menu.Item key={3}>
                        <Icon name='bell outline' size='large' />
                    </Menu.Item>),
                render: () => <Tab.Pane basic attached={false}>
                    <Fragment>
                        <Header inverted textAlign={'center'}>Notification Feed</Header>
                        <NotificationFeed/>
                    </Fragment>
                </Tab.Pane>
            },
        ]
    }/>
);