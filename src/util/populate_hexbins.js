import * as shapely from 'shapely';
import { featureToH3Set } from "geojson2h3";
import { generateRelativeMetric } from './model';

export async function populateFeatures(geo, res) {

    let i = 0;
    const relatives = ["rel_pd", "rel_mpd", "rel_mntd"]

    let maxes = {
        pd: Number.MIN_VALUE,
        mpd: Number.MIN_VALUE,
        mntd: Number.MIN_VALUE,
        tree_sizes: Number.MIN_VALUE,
        rel_pd: 1,
        rel_mpd: Number.MIN_VALUE,
        rel_mntd: Number.MIN_VALUE,
    }
    let mins = {
        pd: Number.MAX_VALUE,
        mpd: Number.MAX_VALUE,
        mntd: Number.MAX_VALUE,
        tree_sizes: Number.MAX_VALUE,
        rel_pd: 0,
        rel_mpd: Number.MAX_VALUE,
        rel_mntd: Number.MAX_VALUE,
    }

    //fetch feature data in dict format
    let data = await fetch('/phast/data/range_hex_data_statistics.json').then((raw) => raw.json())//.then((jsondata) => objToDict(jsondata));
    let trees = await fetch('/phast/data/Plants_trees.json').then((raw) => raw.json());
    trees = treeToDict(trees);


    console.log(data);


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
                "tree_sizes": 0,
                "rel_pd": -1,
                "rel_mpd": -1,
                "rel_mntd": -1,
                "tree": null
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
            let val = data[index][key][0]//generateRelativeMetric(key, data[index][key], data[index]["tree_sizes"])
            feature['properties'][key] = val
            if(val > maxes[key]) maxes[key] = val
            else if(val < mins[key]) mins[key] = val
        }

        // for(let key of relatives) {
        //     let absolute = data[index][key.substring(4)]
        //     let relative = generateRelativeMetric(key, absolute, data[index]["tree_sizes"])
        //     feature['properties'][key] = relative
        //     if(relative > maxes[key]) maxes[key] = relative
        //     else if(relative < mins[key]) mins[key] = relative
        // }
        feature['properties']['tree'] = (trees[index][0] ?? "");


        if(!feature.properties.pd) feature.properties.pd = -1;
        if(!feature.properties.mpd) feature.properties.mpd = -1;
        if(!feature.properties.mntd) feature.properties.mntd = -1;

        feature.properties.tree_sizes = data[index].present_species_rds?.length ?? 0;

        feature.properties.quartile = Number.parseFloat(data[index].quartile ?? -1);

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
            mins: mins,
            'rel_pd_exp': 0
        }
    }
    return object;
}

export async function populateEcoregions() {

    let geo = await fetch('/phast/data/ecoregions.geojson').then((raw) => raw.json());
    let models = await fetch('/phast/data/range_ecoregions_data_statistics.json').then((raw) => raw.json());

    console.log(models)

    let maxes = {
        pd: Number.MIN_VALUE,
        mpd: Number.MIN_VALUE,
        mntd: Number.MIN_VALUE,
        tree_sizes: Number.MIN_VALUE,
    }
    let mins = {
        pd: Number.MAX_VALUE,
        mpd: Number.MAX_VALUE,
        mntd: Number.MAX_VALUE,
        tree_sizes: Number.MAX_VALUE,
    }

    let features = []

    for(let region of geo["features"]) {
        console.log(region)

        let l3code = region["properties"]["US_L3CODE"]

        models[l3code].tree_sizes = models[l3code]?.present_species.length ?? 0

        for(let key of Object.keys(maxes)) {
            let val = Number.parseFloat(models[l3code][key] ?? -1);
            region.properties[key] = val;
            if(val > maxes[key]) maxes[key] = val
            else if(val < mins[key]) mins[key] = val
        }

        features.push(region)
    }

    let object = {
        "type": "FeatureCollection",
        "features": features,
        "properties": {
            maxes: maxes,
            mins: mins,
            'rel_pd_exp': 0
        }
    }

    return object;

}




export function objToDict(obj) {
    let dictionary = Object.fromEntries(obj.map(x => [x.id, {"pd": x.pd, "mpd": x.mpd, "mntd": x.mntd, "tree_sizes": x.retrieved_taxa}]));
    return dictionary;
}

export function treeToDict(obj) {
    //console.log(obj)
    let trees = JSON.parse(obj[0]);
    return trees;
}
