import * as shapely from 'shapely';

export async function populateFeatures(geo) {
    let multipolygon = geo.geometry.coordinates;
    let polygons = []
    for(let subarray of multipolygon) {

        //console.log(subarray)

        let feature = {
            "type": "Feature",
            "properties": {
                // data here
                "pd": Math.random()
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": subarray
            }
        }

        polygons.push(feature)
    }
    let object = {
        "type": "FeatureCollection",
        "features": polygons
    }
    return object;
}