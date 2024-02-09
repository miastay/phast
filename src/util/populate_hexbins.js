import * as shapely from 'shapely';
import { featureToH3Set } from "geojson2h3";

export async function populateFeatures(geo, res) {

    let i = 0;

    //fetch feature data in dict format
    let data = await fetch('/phast/data/poly_bird_data.json').then((raw) => raw.json());

    //iterate through polygons
    let multipolygon = geo.geometry.coordinates;
    let polygons = []
    for(let subarray of multipolygon) {

        //if(i > 50) break;
        //console.log(subarray)
        let feature = {
            "type": "Feature",
            "properties": {
                // data here
                "pd": NaN,
                "mpd": NaN,
                "mntd": NaN,
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": subarray
            }
        }
        let index = featureToH3Set(feature, res)[0]
        if(!index || !data[index]) break;

        feature['properties'] = {...data[index], "id": index}

        polygons.push(feature)
        i++;
    }
    let object = {
        "type": "FeatureCollection",
        "features": polygons
    }
    return object;
}

export function objToDict(obj) {
    let dictionary = Object.fromEntries(obj.map(x => [x.id, {"pd": x.pd, "mpd": x.mpd, "mntd": x.mntd}]));
    return dictionary;
}