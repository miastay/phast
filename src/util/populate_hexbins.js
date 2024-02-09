import * as shapely from 'shapely';
import { featureToH3Set } from "geojson2h3";

export async function populateFeatures(geo, res) {

    let i = 0;
    let maxes = {
        pd: Number.MIN_VALUE,
        mpd: Number.MIN_VALUE,
        mntd: Number.MIN_VALUE,
        tree_size: Number.MIN_VALUE,
    }
    let mins = {
        pd: Number.MAX_VALUE,
        mpd: Number.MAX_VALUE,
        mntd: Number.MAX_VALUE,
        tree_size: Number.MAX_VALUE,
    }

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
                "pd": -1,
                "mpd": -1,
                "mntd": -1,
                "tree_sizes": 0
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": subarray
            }
        }
        let index = featureToH3Set(feature, res)[0]
        if(!index || !data[index]) break;

        feature['properties']['id'] = index;

        for(let key of Object.keys(data[index])) {
            feature['properties'][key] = data[index][key]
            if(data[index][key] > maxes[key]) maxes[key] = data[index][key]
            else if(data[index][key] < mins[key]) mins[key] = data[index][key]
        }

        // if(data[index].pd) {
        //     feature['properties']['pd'] = data[index].pd
        //     if(data[index].pd > maxes.pd) maxPd = data[index].pd
        //     else if(data[index].pd < minPd) maxPd = data[index].pd
        // }
        // if(data[index].mpd) {
        //     feature['properties']['mpd'] = data[index].mpd
        //     if(data[index].mpd > maxMpd) maxPd = data[index].mpd
        //     else if(data[index].mpd < minMpd) maxPd = data[index].mpd
        // }
        // if(data[index].mpd) feature['properties']['mpd'] = data[index].mpd
        // if(data[index].mntd) feature['properties']['mntd'] = data[index].mntd

        polygons.push(feature)
        i++;
    }
    let object = {
        "type": "FeatureCollection",
        "features": polygons,
        "properties": {
            maxes: maxes,
            mins: mins
        }
    }
    return object;
}

export function objToDict(obj) {
    let dictionary = Object.fromEntries(obj.map(x => [x.id, {"pd": x.pd, "mpd": x.mpd, "mntd": x.mntd, "tree_sizes": x.tree_sizes}]));
    return dictionary;
}