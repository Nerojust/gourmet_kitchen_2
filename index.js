/**
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

export default function Main() {
  LogBox.ignoreAllLogs(true);
  LogBox.ignoreLogs(['Unrecognized font family']);
  LogBox.ignoreLogs(["EventEmitter.removeListener"]);
  LogBox.ignoreLogs(["Can't perform a React state"]);
  return <App />;
}
AppRegistry.registerComponent(appName, () => Main);
