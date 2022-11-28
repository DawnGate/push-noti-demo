import {
  getToken,
  getMessaging,
  onMessage,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging.js";

const messaging = getMessaging();
const getTokenRegistration = () => {
  getToken(messaging, {
    vapidKey: "<Vapid_Key>",
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log(currentToken);
      } else {
        // show permission request UI
        console.log("No registrantion token available");
      }
    })
    .catch((err) => {
      console.error("An error occurred while retrieve token.", err);
    });
};

// received message on foreground
onMessage(messaging, (payload) => {
  console.log("Message received", payload);
});

// call to get registration token
getTokenRegistration();
