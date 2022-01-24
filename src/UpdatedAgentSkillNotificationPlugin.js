import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import { Actions, Notifications, NotificationType, NotificationBar, Tab, TaskHelper } from "@twilio/flex-ui";
import { FlexNotification } from './enums';

// import CustomTaskListContainer from './components/CustomTaskList/CustomTaskList.Container';
// import reducers, { namespace } from './states';

const PLUGIN_NAME = 'UpdatedAgentSkillNotificationPlugin';

export default class UpdatedAgentSkillNotificationPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    //this.registerReducers(manager);

    const state = manager.store.getState();

    // Retrieving the length of the skill array before the update
    // We will use this length to verify if the skill array was updated or not
    let currentSkills = state.flex.worker.attributes.routing.skills;
    let skillLength = state.flex.worker.attributes.routing.skills.length;


    manager.strings[FlexNotification.skillsChanged] = (
         'Your skills were updated to: "{{skills}}" '
      );


    // Registering the notification
    Notifications.registerNotification({
      id: FlexNotification.skillsChanged,       // Assign an id for the first notification
      content: FlexNotification.skillsChanged,  // Passing the component as content
      type: NotificationType.info,              // Specifying the type of notification
      timeout: 5000,                            // Specify the time for this notification to remain on screen
      backgroundColor: "lemonchiffon",          // Configure the color of the notification
      actions: [                                // You can dismiss this notification by clicking on the Dismiss label
        <NotificationBar.Action
            onClick={(_, notification) => {
              Notifications.dismissNotificationById(FlexNotification.skillsChanged);
            }}
            label="Dismiss"
        />
      ]
    });


   // When the attributes are updated, check if the attribute that was updated was the skill attribute
   // If the skill array was updated then display the notification

    manager.workerClient.on("attributesUpdated", worker => {

            let updatedAttributesSkillLength = worker.attributes.routing.skills.length;
            let updatedSkills = worker.attributes.routing.skills;

            if (updatedAttributesSkillLength!=skillLength || !currentSkills.every((val, index) => val === updatedSkills[index])) {
              Notifications.showNotification(FlexNotification.skillsChanged, { skills: worker.attributes.routing.skills});
            }
            skillLength = updatedAttributesSkillLength;

        });
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  // registerReducers(manager) {
  //   if (!manager.store.addReducer) {
  //     // eslint-disable-next-line
  //     console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
  //     return;
  //   }
  //
  //   manager.store.addReducer(namespace, reducers);
  // }
}
