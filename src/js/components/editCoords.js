export default function editCoords(str) {
    const regexp = /[\[\]]/g;
    const coords = str.split(',').map(s => {
        s = s.trim();
        return s.replace(regexp, '');
      });

      let errors = [];

      if (Number(coords[0]) > 90 || Number(coords[0]) < -90) {
        errors.push( { error: 'Неверно введена широта. Широта не должна превышать 90 градусов и быть не меньше -90 градусов' } );
      } 
      if (Number(coords[1]) > 180 || Number(coords[1]) < -180) {
        errors.push( { error: 'Неверно введена долгота. Долгота не должна превышать 180 градусов и быть не меньше -180 градусов' } );
      } 

      if (errors.length > 0) {
        return { errors: errors };
      }

      return { latitude: coords[0], longitude: coords[1] };
}