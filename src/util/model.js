
const LL4 = ({x,b,c,d,e}) => c + ((d - c) / (1 + Math.exp(b * (Math.log(x) - Math.log(e)))));
const MM3 = ({x,c,d,e}) => c + ((d-c) / (1 + (e/x)));

export const metrics = ["pd", "mpd", "mntd", "tree_sizes", "rel_pd", "quartile"]
export const descs = {
    "pd": "phylodiversity",
    "mpd": "mean pairwise phylogenetic distance",
    "mntd": "mean nearest-taxon phylogenetic distance"
}

export function buildModel(type) {

    const types = metrics;
    if(!type || !types.includes(type)) return;

    const resolution = 650;
    let points = new Array(resolution);
    let yAxis = [0, 1]

    const delta = (xAxis[1] / resolution)

    let data;
    switch(type) {
        case "mntd":
        case "rel_mntd":
            data = models.mntd;
            break;
        case "mpd":
        case "rel_mpd":
            data = models.mpd;
            break;
        default:
        case "pd":
            data = models.pd;
    }

    let d = data.d;
    let b = data.b;
    let e = data.e;
    let c = data.c;
    let modelHigh = data.modelHigh;
    let modelLow = data.modelLow;
    let minY = data.minY;
    let maxY = data.maxY;

    let xOffset = 2;

    for(let i = 0; i < resolution; i++) {
        let x = (i + xOffset) * delta;
        points[i] = {
            "x": x,
            "high": modelHigh({x: x, b: b.high, c: c.high, d: d.high, e: e.high}),
            "low": modelLow({x: x, b: b.low, c: c.low, d: d.low, e: e.low})
        }
    }

    yAxis = [minY, maxY]

    return {
        confidence: points,
        yAxis: yAxis,
        xAxis: xAxis,
        xAxisLabel: "Tree Size",
        yAxisLabel: data.yAxisLabel
    };
}

const xAxis = [0, 300]

const models = {
    'pd': {
        "b": {
            "low": -0.7505,
            "high": -0.6608
        },
        "c": {
            "low": 9.567,
            "high": 123.1524
        },
         "d": {
            "low": 11690.7906,
            "high": 10762.3392
        },
        "e": {
            "low": 1298.4931,
            "high": 1308.4918
        },
        "minY": 100,
        "maxY": 5000,
        "yAxisLabel": "Phylodiversity (pd)",
        "modelHigh": ({x,b,c,d,e}) => c + ((d - c) / (1 + Math.exp(b * (Math.log(x) - Math.log(e))))),
        "modelLow": ({x,b,c,d,e}) => c + ((d - c) / (1 + Math.exp(b * (Math.log(x) - Math.log(e)))))
    },
    "mpd": {
        "b": {
            "low": -0.6495,
            "high": 0.4117
        },
        "c": {
            "low": -39.3099,
            "high": 93.617
        },
         "d": {
            "low": 102.1695,
            "high": 152.3637
        },
        "e": {
            "low": 1.2904,
            "high": 2.763
        },
        "minY": 0,
        "maxY": 200,
        "yAxisLabel": "Mean pairwise phylogenetic distance (mpd)",
        "modelHigh": ({x,b,c,d,e}) => c + ((d - c) / (1 + Math.exp(b * (Math.log(x) - Math.log(e))))),
        "modelLow": ({x,b,c,d,e}) => c + ((d - c) / (1 + Math.exp(b * (Math.log(x) - Math.log(e)))))
    },
    "mntd": {
        "b": {
            "low": 1.2883,
            "high": 0.9501
        },
        "c": {
            "low": 8.8277,
            "high": 5.9462
        },
        "d": {
            "low": 33.4172,
            "high": 156.3706
        },
        "e": {
            "low": 44.5908,
            "high": 10.2206
        },
        "minY": 0,
        "maxY": 150,
        "yAxisLabel": "Mean nearest-taxon phylogenetic distance (mntd)",
        "modelHigh": ({x,b,c,d,e}) => c + ((d - c) / (1 + Math.exp(b * (Math.log(x) - Math.log(e))))),
        "modelLow": ({x,b,c,d,e}) => c + ((d - c) / (1 + Math.exp(b * (Math.log(x) - Math.log(e)))))
    }
}


export function generateRelativeMetric(type, value, x) {

    if(value === -1 || value == NaN) return -1;


    let data;
    switch(type) {
        case "mntd":
        case "rel_mntd":
            data = models.mntd;
            break;
        case "mpd":
        case "rel_mpd":
            data = models.mpd;
            break;
        default:
        case "pd":
            data = models.pd;
    }
    let d = data.d;
    let b = data.b;
    let e = data.e;
    let c = data.c;
    let modelHigh = data.modelHigh;
    let modelLow = data.modelLow;

    // if(!x) {
    //     return (xt) => ((value - modelLow({x: xt, b: b.low, c: c.low, d: d.low, e: e.low})) * (modelHigh({x: xt, b: b.high, c: c.high, d: d.high, e: e.high}) - modelLow({x: xt, b: b.low, c: c.low, d: d.low, e: e.low}))) / (data.maxY - data.minY);
    // }

    let upperBound = modelHigh({x: x, b: b.high, c: c.high, d: d.high, e: e.high})
    let lowerBound = modelLow({x: x, b: b.low, c: c.low, d: d.low, e: e.low})
    let confidenceIntervalWidth = (upperBound - lowerBound)

    //let ciCenter = lowerBound + (confidenceIntervalWidth / 2);

    // console.log("value", value)
    // console.log("x", x)
    // console.log("bounds", lowerBound, upperBound)
    // console.log("width", confidenceIntervalWidth)

    // console.log("10:", modelLow({x: 10, b: b.low, c: c.low, d: d.low, e: e.low}))
    // console.log("50:", modelLow({x: 50, b: b.low, c: c.low, d: d.low, e: e.low}))
    // console.log("200:", modelLow({x: 200, b: b.low, c: c.low, d: d.low, e: e.low}))

    return (value - lowerBound);
}