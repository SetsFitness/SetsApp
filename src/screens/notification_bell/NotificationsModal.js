// This is going to be the modal that opens after you press the notification bell in the corner to check your
// notifications.

import React from 'react';
import NotificationsFeed from "src/screens/notification_bell/NotificationBellFeed";

/**
 * This is the modal that contains the feed of notifications
 *
 * @returns {*} The React JSX used to display the component.
 * @constructor
 */
const NotificationsModal = () => {
  return (
    <div>
      <NotificationsFeed/>
    </div>
  );
};

export default NotificationsModal;