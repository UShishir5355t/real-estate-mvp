import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface MapViewComponentProps {
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
  onMapPress?: (event: any) => void;
  interactive?: boolean;
}

const { width, height } = Dimensions.get('window');

const MapViewComponent: React.FC<MapViewComponentProps> = ({
  latitude,
  longitude,
  title,
  description,
  onMapPress,
  interactive = true,
}) => {
  const region = {
    latitude,
    longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onPress={onMapPress}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        rotateEnabled={interactive}
        pitchEnabled={interactive}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        mapType="standard"
      >
        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
          title={title}
          description={description}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapViewComponent;
