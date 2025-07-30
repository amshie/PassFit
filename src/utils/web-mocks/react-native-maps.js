// Mock for react-native-maps on web platform
import React from 'react';
import { View } from 'react-native';

// Mock MapView component
const MapView = React.forwardRef((props, ref) => {
  return React.createElement(View, {
    ...props,
    ref,
    style: [{ flex: 1, backgroundColor: '#f0f0f0' }, props.style]
  });
});

// Mock Marker component
const Marker = (props) => {
  return React.createElement(View, props);
};

// Mock PROVIDER_GOOGLE
const PROVIDER_GOOGLE = 'google';

// Default export (MapView)
const MockMapView = MapView;

// Named exports
MockMapView.Marker = Marker;
MockMapView.PROVIDER_GOOGLE = PROVIDER_GOOGLE;

export default MockMapView;
export { Marker, PROVIDER_GOOGLE };
