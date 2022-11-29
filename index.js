import {
  getToken,
  getMessaging,
  deleteToken as deleteTokenFCM,
  onMessage,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging.js";

const messaging = getMessaging();

// get element by id for request permision UI and token
// div UI
const tokenDivId = "token_div";
const permissionDivId = "permission_div";

// handle received message from server. When:
// - in app using( current focus on app)
// - when user click on the notifi create by sw
onMessage(messaging, (payload) => {
  console.log("foreground", payload);
  appendMessage(payload);
});

// const resetUI = () => {
//   clearMessages();
//   showToken("loading...");
//   // get registration token. This initial make a network call, once retried
//   // subsequent call for the token, will retrieve from cache
//   getToken(messaging, {
//     vapidKey:
//       "<VAPID_KEY>",
//   })
//     .then((currentToken) => {
//       if (currentToken) {
//         sendTokenToServer(currentToken);
//         updateUIForPushEnabled(currentToken);
//         console.log(currentToken);
//       } else {
//         // show permission request UI
//         console.log("No registrantion token available");
//       }
//     })
//     .catch((err) => {
//       console.error("An error occurred while retrieve token.", err);
//     });
// };
function resetUI() {
  clearMessages();
  showToken("loading...");
  // Get registration token. Initially this makes a network call, once retrieved
  // subsequent calls to getToken will return from cache.

  getToken(messaging, {
    vapidKey: "<VAPID_KEY>",
  })
    .then((currentToken) => {
      if (currentToken) {
        sendTokenToServer(currentToken);
        updateUIForPushEnabled(currentToken);
      } else {
        // Show permission request.
        console.log(
          "No registration token available. Request permission to generate one."
        );
        // Show permission UI.
        updateUIForPushPermissionRequired();
        setTokenSentToServer(false);
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      showToken("Error retrieving registration token. ", err);
      setTokenSentToServer(false);
    });
}

function showToken(currentToken) {
  // Show token in console and UI.
  const tokenElement = document.querySelector("#token");
  tokenElement.textContent = currentToken;
}

// Send the registration token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
    console.log("Sending token to server...");
    // TODO(developer): Send the current token to your server.
    //test subscriber a topic
    // subscribeTopicFromServer(currentToken);

    setTokenSentToServer(true);
  } else {
    console.log(
      "Token already sent to server so won't send it again " +
        "unless it changes"
    );
  }
}

// this function subscribe new token to a topic
// function subscribeTopicFromServer(currentToken) {
//   console.log("Set up subscriber to topic");
//   const ACCESS_TOKEN =
//     "";
//   const FIREBASE_API_KEY = "";
//   const topicURL = `https://iid.googleapis.com/iid/v1/${currentToken}/rel/topics/demo-send-test`;

//   fetch(topicURL, {
//     method: "POST",
//     headers: {
//       "x-goog-api-key": `${FIREBASE_API_KEY}`,
//       Authorization: `Bearer ${ACCESS_TOKEN}`,
//     },
//   })
//     .then((response) => {
//       console.log("success subscriber msg: ", response);
//     })
//     .catch((err) => {
//       console.log("fail subscribe msg: ", err);
//     });
// }

function isTokenSentToServer() {
  return window.localStorage.getItem("sentToServer") === "1";
}

function setTokenSentToServer(sent) {
  window.localStorage.setItem("sentToServer", sent ? "1" : "0");
}

function showHideDiv(divId, show) {
  const div = document.querySelector("#" + divId);
  if (show) {
    div.style = "display: visible";
  } else {
    div.style = "display: none";
  }
}

function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      // TODO(developer): Retrieve a registration token for use with FCM.
      // In many cases once an app has been granted notification permission,
      // it should update its UI reflecting this.
      resetUI();
    } else {
      console.log("Unable to get permission to notify.");
    }
  });
}

function deleteToken() {
  // Delete registration token.
  getToken(messaging)
    .then((currentToken) => {
      deleteTokenFCM(messaging, currentToken)
        .then(() => {
          console.log("Token deleted.");
          setTokenSentToServer(false);
          // Once token is deleted update UI.
          resetUI();
        })
        .catch((err) => {
          console.log("Unable to delete token. ", err);
        });
    })
    .catch((err) => {
      console.log("Error retrieving registration token. ", err);
      showToken("Error retrieving registration token. ", err);
    });
}

// Add a message to the messages element.
function appendMessage(payload) {
  const messagesElement = document.querySelector("#messages");
  const dataHeaderElement = document.createElement("h5");
  const dataElement = document.createElement("pre");
  dataElement.style = "overflow-x:hidden;";
  dataHeaderElement.textContent = "Received message:";
  dataElement.textContent = JSON.stringify(payload, null, 2);
  messagesElement.appendChild(dataHeaderElement);
  messagesElement.appendChild(dataElement);
}

// Clear the messages element of all children.
function clearMessages() {
  const messagesElement = document.querySelector("#messages");
  while (messagesElement.hasChildNodes()) {
    messagesElement.removeChild(messagesElement.lastChild);
  }
}

function updateUIForPushEnabled(currentToken) {
  showHideDiv(tokenDivId, true);
  showHideDiv(permissionDivId, false);
  showToken(currentToken);
}

function updateUIForPushPermissionRequired() {
  showHideDiv(tokenDivId, false);
  showHideDiv(permissionDivId, true);
}

// add event click to 2 button delete token and request permission
document.getElementById("btn-delete").onclick = deleteToken;
document.getElementById("btn-request-permission").onclick = requestPermission;

resetUI();
