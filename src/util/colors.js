export const schemes = {
    "blBluCyWt": blBluCyWt,
    "rdYlGr": rdYlGr,
    "rdYlGr_discrete": rdYlGr_discrete,
    "orGrBlu": orGrBlu,
    "blGr": blGr,
    "grYlRd": grYlRd,
}

export function getPalette(min, max, scheme = "blBluCyWt") {
    let palette = schemes[scheme](min, max)
    return palette
}

export function getDiscretePalette(min, max, scheme = "blBluCyWt") {
    let palette = schemes['rdYlGr_discrete'](min, max)
    return palette
}

function getQuant(min, max, quant) {
    return  (quant * (max - min)) + min;
}

function orGrBlu(min, max) {
    return [
        [-1, "#ddddddcc"],
        [min, "#F9A825cc", "Very low"],
        [getQuant(min, max, 0.35), "#e8f4c4cc"],
        [getQuant(min, max, 0.5), "#00E676cc", "Expected"],
        [getQuant(min, max, 0.75), "#3d9ab8cc"],
        [getQuant(min, max, 0.85), "#318ab5cc"],
        [max, "#2a4e9bcc", "Very high"],
    ];
}

function blGr(min, max) {
    return [
        [-1, "#ddddddcc"],
        [min, "#000000", "Very low"],
        [max, "#00ff00", "Very high"],
    ]
}

function blBluCyWt(min, max) {
    return [
        [-1, "#ddddddcc", "Missing"],
        [min, "#000000cc", "Very low"],
        [getQuant(min, max, 0.5), "#0000ffcc", "Expected"],
        [getQuant(min, max, 0.75), "#00ffffcc"],
        [max, "#ffffffcc", "Very high"],
    ]
}


function rdYlGr(min, max) {
    return [
        [-1, "#ddddddcc", "Missing"],
        [min, "#ff3300cc", "Very low"],
        [getQuant(min, max, 0.5), "#ffff33cc", "Normal"],
        [max, "#00ff33cc", "Very high"],
    ]
}


function rdYlGr_discrete(min, max) {
    return [
        [-1, "#ddddddcc", "Missing"],
        [0, "#ff3300cc", "Very low"],
        [getQuant(min, max, 0.5), "#ffff33cc", "Normal"],
        [max, "#00ff33cc", "Very high"],
    ]
}

function grYlRd(min, max) {
    return [
        [-1, "#ddddddcc", "Missing"],
        [min, "#00ff33cc", "Very low biodiversity"],
        [getQuant(min, max, 0.5), "#ffff33cc", "Normal biodiversity"],
        [max, "#ff3300cc", "Very high biodiversity"],
    ]
}

/**
 * 
 *  Palette 1: orange-green-blue
 * 
 *  [0, "#F9A825", "Very low biodiversity"],
    [0.35, "#e8f4c4"],
    [0.5, "#00E676", "Expected biodiversity"],
    [0.6, "#3d9ab8"],
    [0.7, "#318ab5"],
    [1, "#2a4e9b", "Very high biodiversity"],
 * 
 */