import {
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
  Geolocation,
} from 'react-native';
import React, {PureComponent} from 'react';
import {isAndroid, isIos} from './src/utils/platform';
import MapScreen from './src/Screens/map-screen';
import {request, PERMISSIONS, check} from 'react-native-permissions';

export class App extends PureComponent {
  componentDidMount() {
    this.requestPermissions();
  }
  async requestPermissions() {}

  render() {
    return (
      <View style={styles.screen}>
        <MapScreen />
      </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#223355',
  },
});
