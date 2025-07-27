export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface ViewportBounds {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}

export interface MapMarker {
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
  pinColor?: string;
}
