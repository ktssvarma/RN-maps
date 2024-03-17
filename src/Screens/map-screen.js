import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MapView, {
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
} from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import userImage from '../../assets/map-images/current-location.png';

const MapScreen = () => {
  const map = useRef(null);
  const [message, setMessage] = useState('');
  const [initialLocation, setInitialLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  useEffect(() => {
    getCurrentLocation();
    // setInterval(() => {
    //   getCurrentLocation();
    // }, 1000);
  }, []);

  const getCurrentLocation = () => {
    setMessage('Getting location');
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        setMessage('Location fetched');
        setCurrentLocation(location);
        // focusLocation(location)
        if (!initialLocation) {
          setInitialLocation(location);
        }
      })
      .catch(error => {
        const {message} = error;
        setMessage(message || 'Error fetching location');
        console.warn(error);
      });
  };

  useEffect(() => {
    console.log(selectedLocation);
  }, [selectedLocation]);

  const focusLocation = e => {
    if (e) {
      map.current.animateToRegion(
        {
          latitude: e.latitude,
          longitude: e.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        300,
      );
    }
  };

  const onLongpressOnMap = e => {
    setSelectedLocation(e.nativeEvent.coordinate);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.mapContainer}>
        {initialLocation !== null ? (
          <MapView
            style={styles.mapStyles}
            toolbarEnabled
            initialRegion={{
              latitude: initialLocation.latitude,
              longitude: initialLocation.longitude,
              latitudeDelta: 3,
              longitudeDelta: 3,
            }}
            onLongPress={onLongpressOnMap}
            ref={map}>
            <Circle
              center={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              radius={100}
              strokeColor="#454acd"
              fillColor="#454acd30"
            />
            {selectedLocation && (
              <Marker
                draggable
                onDragEnd={onLongpressOnMap}
                coordinate={{
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                  latitudeDelta: 1,
                  longitudeDelta: 1,
                }}></Marker>
            )}
            {selectedLocation && (
              <Polyline
                strokeWidth={2}
                coordinates={[
                  {
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                  },
                  {
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                  },
                ]}
              />
            )}
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 1,
                longitudeDelta: 1,
              }}>
              <Image style={{height: 32, width: 32}} source={userImage} />
            </Marker>
          </MapView>
        ) : (
          <Text style={styles.messageTextStyles}>Loading ...</Text>
        )}
      </View>
      <Text style={styles.messageTextStyles}>{message}</Text>
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.buttonStyles}
          onPress={getCurrentLocation}>
          <Text>Reload</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonStyles}
          onPress={() => {
            focusLocation(currentLocation);
          }}>
          <Text>Focus current</Text>
        </TouchableOpacity>
        {selectedLocation && (
          <TouchableOpacity
            style={styles.buttonStyles}
            onPress={() => {
              focusLocation(selectedLocation);
            }}>
            <Text>Focus selected</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  mapContainer: {
    height: '45%',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#00000050',
  },
  mapStyles: {
    flex: 1,
  },
  messageTextStyles: {
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 5,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    justifyContent: 'space-evenly',
  },
  buttonStyles: {
    height: 25,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff20',
    borderRadius: 5,
  },
});
