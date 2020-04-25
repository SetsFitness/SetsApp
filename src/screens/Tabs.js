import {Fragment} from 'react';
import {Tab, Menu, Icon} from "semantic-ui-react";
import ProfileTab from "./profile_tab/ProfileTab";
import React from "react";
import TrainerTab from "./trainer_tab/TrainerTab";
import MainTab from "./main_tab/MainTab";
import MessageTab from "./messaging_tab/MessageTab";
import MessageIcon from "../vastuscomponents/components/messaging/MessageIcon";
import GroupFeed from "./trainer_tab/CommunityTab";
import DealTab from "./deal_tab/DealTab";

/**
 * A bottom menu for all of the tabs in the app.
 * The app is currently split up into two sections: the main and profile tabs.
 *
 * @returns {*} The React JSX used to display the component.
 */
export default () => (
  <Tab menu={{color: "white", fixed: "bottom", widths: 2, size: "large", inverted: true}} panes={
    [
      {
        menuItem:
          (<Menu.Item key={0}>
            <Icon name='home' color='violet' size='large'/>
          </Menu.Item>),
        render: () =>
          <Tab.Pane basic attached={false}>
            <MainTab/>
          </Tab.Pane>
      },
      {
        menuItem: (
          <Menu.Item key={1}>
            <Icon name='user circle' color='violet' size='large'/>
          </Menu.Item>),
        render: () => <Tab.Pane basic attached={false}>
          <ProfileTab/>
        </Tab.Pane>
      },
      /*{
          menuItem:
              (<Menu.Item key={2}>
                  <Icon name='group' size='large' />
              </Menu.Item>),
          render: () =>
              <Tab.Pane basic attached={false}>
                  <GroupFeed/>
              </Tab.Pane>
      },
      {
          menuItem: (
              <Menu.Item key={3}>
                  <Icon name='stopwatch' size='large' />
              </Menu.Item>),
          render: () => <Tab.Pane basic attached={false}>
              <TrainerTab/>
          </Tab.Pane>
      },
      {
          menuItem: (
              <Menu.Item key={4}>
                  <MessageIcon/>
              </Menu.Item>),
          render: () => <Tab.Pane basic attached={false}>
              <Fragment>
                  <MessageTab/>
              </Fragment>
          </Tab.Pane>
      },*/

    ]
  }/>
);