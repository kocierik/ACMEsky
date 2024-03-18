export function convertToKilometers(distance: string) {
 if (distance.endsWith("km")) {
     return parseFloat(distance.slice(0,-2))
      // Se la distanza è in metri, convertila in chilometri
    } else {
        const distanceInMeters = parseFloat(distance.slice(0,-1));
        return distanceInMeters / 1000; // 1 km = 1000 m
    }
  }