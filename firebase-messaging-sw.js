importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object

const firebaseConfig = {
  apiKey: "<API_KEY>",
  authDomain: "web-push-demo-93af2.firebaseapp.com",
  projectId: "web-push-demo-93af2",
  storageBucket: "web-push-demo-93af2.appspot.com",
  messagingSenderId: "588940271742",
  appId: "<APP-ID>",
  measurementId: "G-V45S7SBF2F",
};

firebase.initializeApp(firebaseConfig);

const isSupported = firebase.messaging.isSupported();
if (isSupported) {
  // Retrieve an instance of Firebase Messaging so that it can handle background
  // messages.
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log(
      "[firebase-messaging-sw.js] Received background message ",
      payload
    );
    // Customize notification here
    const notificationTitle = "Background Message Title";
    const notificationOptions = {
      body: "Background Message body.",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}
