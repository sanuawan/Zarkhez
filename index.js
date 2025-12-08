/**
 * @format
 */
import 'react-native-url-polyfill/auto'; 
import {AppRegistry} from 'react-native';
// ... rest of your code
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
