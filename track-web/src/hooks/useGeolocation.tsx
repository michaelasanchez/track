import { useEffect, useState } from 'react';

import { Location } from '../models/odata/Location';

export const positionToGeolocation = (
  position: any // GeolocationPosition
): Location => {
  return {
    Latitude: position.coords.latitude,
    Longitude: position.coords.longitude,
    Accuracy: position?.coords?.accuracy + 0.5,
  } as Location;
};

export const useGeolocation = () => {
  const [geolocation, setGeolocation] = useState<Location>();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation(positionToGeolocation(position));
        },
        null,
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return geolocation;
};
