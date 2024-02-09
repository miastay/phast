export function buildModel(type) {

    const types = ["pd", "mpd", "mntd"];
    if(!type || !types.includes(type)) return;

    const resolution = 100;
    let points = new Array(resolution);
    let yAxis = [0, 1]

    const ll3 = (x,d,b,e) => (d) / (1 + Math.exp(b * (Math.log(x) - Math.log(e))))

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
    let minY = data.minY;
    let maxY = data.maxY;
    for(let i = 0; i < resolution; i++) {
        points[i] = {
            "x": i * delta,
            "high": ll3(i, d.high, b.high, e.high),
            "low": ll3(i, d.low, b.low, e.low)
        }
    }

    yAxis = [minY, maxY]

    return {
        confidence: points,
        yAxis: yAxis,
        xAxis: xAxis
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
    "maxY": 5000
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
    "minY": 240,
    "maxY": 320
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
    "minY": 50,
    "maxY": 175
}