
const LL4 = ({x,b,c,d,e}) => c + ((d - c) / (1 + Math.exp(b * (Math.log(x) - Math.log(e)))));
const MM3 = ({x,c,d,e}) => c + ((d-c) / (1 + (e/x)));

export const metrics = ["pd", "mpd", "mntd", "rel_pd", "rel_mpd", "rel_mntd", "tree_sizes"]
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
            data = mntd;
            break;
        case "mpd":
            data = mpd;
            break;
        default:
        case "pd":
            data = pd;
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

const xAxis = [0, 650]

const pd = {
    "b": {
        "low": -0.931227328236421,
        "high": -0.850415384226551
    },
    "c": {
        "low": 139.306047949838,
        "high": 436.895903091284
    },
     "d": {
        "low": 19162.375584044,
        "high": 12915.6022684778
    },
    "e": {
        "low": 327.846953673696,
        "high": 161.518693290759
    },
    "minY": 0,
    "maxY": 5000,
    "yAxisLabel": "Phylodiversity (pd)",
    "modelHigh": ({x,b,c,d,e}) => c + ((d - c) / (1 + Math.exp(b * (Math.log(x) + Math.log(e))))),
    "modelLow": ({x,b,c,d,e}) => c + ((d - c) / (1 + Math.exp(b * (Math.log(x) + Math.log(e)))))
}

const mpd = {
    "b": {
        "low": -0.694118805220058,
        "high": 0.438483491772355
    },
    "c": {
        "low": 62.1579404827569,
        "high": 291.293982442487
    },
     "d": {
        "low": 333.919579385655,
        "high": 465.531774320664
    },
    "e": {
        "low": 2.95718871003758,
        "high": 4.49962992132698
    },
    "minY": 0,
    "maxY": 500,
    "yAxisLabel": "Mean pairwise phylogenetic distance (mpd)",
    "modelHigh": ({x,b,c,d,e}) => c + ((d - c) / (1 + Math.exp(b * (Math.log(x) + Math.log(e))))),
    "modelLow": ({x,b,c,d,e}) => c + ((d - c) / (1 + Math.exp(b * (Math.log(x) + Math.log(e)))))
}

const mntd = {
    "b": {
        "low": 0.201425689862832,
        "high": 0.67160099325109
    },
    "c": {
        "low": -54.3817056624714,
        "high": 2.24604817474376
    },
     "d": {
        "low": 226.214892066078,
        "high": 738.112935166842
    },
    "e": {
        "low": 12.7584223154993,
        "high": 3.26410875351594
    },
    "minY": 0,
    "maxY": 150,
    "yAxisLabel": "Mean nearest-taxon phylogenetic distance (mntd)",
    "modelHigh": ({x,b,c,d,e}) => c + ((d - c) / (1 + Math.exp(b * (Math.log(x) + Math.log(e))))),
    "modelLow": ({x,b,c,d,e}) => c + ((d - c) / (1 + Math.exp(b * (Math.log(x) + Math.log(e)))))
}

export function generateRelativeMetric(type, value, x) {

    if(value == -1) return 0;

    let data;
    switch(type) {
        case "mntd":
            data = mntd;
            break;
        case "mpd":
            data = mpd;
            break;
        default:
        case "pd":
            data = pd;
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

    let ciCenter = lowerBound + (confidenceIntervalWidth / 2);

    // console.log("value", value)
    // console.log("x", x)
    // console.log("bounds", lowerBound, upperBound)
    // console.log("width", confidenceIntervalWidth)

    // console.log("10:", modelLow({x: 10, b: b.low, c: c.low, d: d.low, e: e.low}))
    // console.log("50:", modelLow({x: 50, b: b.low, c: c.low, d: d.low, e: e.low}))
    // console.log("200:", modelLow({x: 200, b: b.low, c: c.low, d: d.low, e: e.low}))

    return (value - ciCenter);
}