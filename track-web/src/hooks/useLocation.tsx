import { useState, useEffect } from "react"
import { Location } from '../models/Location';

const positionToLocation = (position: Position): Location => {
  return {
    Latitude: position.coords.latitude,
    Longitude: position.coords.longitude,
    Accuracy: position?.coords?.accuracy + .5
  } as Location;
}

export const useLocation = () => {
  const [location, setLocation] = useState<Location>();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(positionToLocation(position));
      });
    }
  }, []);

  return location;
}