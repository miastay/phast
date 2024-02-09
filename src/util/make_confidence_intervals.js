
const LL4 = ({x,b,c,d,e}) => c + ((d - c) / (1 + Math.exp(b * (Math.log(x) - Math.log(e)))));
const MM3 = ({x,c,d,e}) => c + ((d-c) / (1 + (e/x)));

export function buildModel(type) {

    const types = ["pd", "mpd", "mntd"];
    if(!type || !types.includes(type)) return;

    const resolution = 100;
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
    let model = data.model;
    let minY = data.minY;
    let maxY = data.maxY;

    let xOffset = 2;

    for(let i = 0; i < resolution; i++) {
        points[i] = {
            "x": (i + xOffset) * delta,
            "high": model({x: (i + xOffset), b: b.high, c: c.high, d: d.high, e: e.high}),
            "low": model({x: (i + xOffset), b: b.low, c: c.low, d: d.low, e: e.low})
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
    "yAxisLabel": "Phylogenetic Diversity (pd)",
    "model": LL4
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
    "yAxisLabel": "M Phylogenetic Diversity (mpd)",
    "model": ({x,b,c,d,e}) => c + ((d - c) / (1 + Math.exp(b * (Math.log(x) - Math.log(e)))))
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
    "yAxisLabel": "MN Tree Diversity (mntd)",
    "model": ({x,b,c,d,e}) => c + ((d - c) / (1 + Math.exp(b * (Math.log(x) + Math.log(e)))))
}
