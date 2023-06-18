/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import notifee, {EventType} from '@notifee/react-native';
import {AndroidColor} from '@notifee/react-native';
import {PermissionsAndroid} from 'react-native';
import messaging, {
  RemoteMessage,
  Notification,
} from '@react-native-firebase/messaging';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  async function onDisplayNotification() {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  // Subscribe to events
  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
  }, []);

  // // use of interface
  // const payload : Notification= {
  //   title: "diy title",
  //   body: "diy body"
  // }

  // const msg : RemoteMessage= {
  //   notification:payload
  // };

  // console.log("Title: " + msg.notification.title + "\nBody: " + msg.notification.body);

  async function onMessageReceived(remoteMessage) {
    // const msg = JSON.parse(remoteMessage.notification)

    // Do something
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    // console.log("Title: " + msg.notification.title + "\nBody: " + msg.notification.body);
    console.log(
      'Title: ' +
        remoteMessage.notification.title +
        '\nBody: ' +
        remoteMessage.notification.body,
    );
  }

  useEffect(() => {
    // foreground
    const unsubscribe = messaging().onMessage(onMessageReceived);
    messaging().setBackgroundMessageHandler(onMessageReceived);

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text>Testing FCM ...</Text>
          <Button
            title="Display Notification"
            onPress={() => onDisplayNotification()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
