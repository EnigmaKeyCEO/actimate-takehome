import { AppRegistry } from 'react-native';
import App from './App';

// Register the app
AppRegistry.registerComponent('App', () => App);

// Mount on web
const rootTag = document.getElementById('root');
if (rootTag) {
  AppRegistry.runApplication('App', {
    rootTag,
    initialProps: {}
  });
}