import * as shapely from 'shapely';

export async function populateFeatures(geo) {

    const gmin = -124.43785565431665;

    let multipolygon = geo.geometry.coordinates;
    let polygons = []
    for(let subarray of multipolygon) {

        //console.log(subarray)

        let feature = {
            "type": "Feature",
            "properties": {
                // data here
                "pd": subarray[0][0][0] / gmin  //(i / multipolygon.length)//Math.random()
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