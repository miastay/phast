export function getPalette(min, max) {
    return blGr(min, max)
    //return orGrBlu(min, max);
}

function getQuant(min, max, quant) {
    return  (quant * (max - min));
}

function orGrBlu(min, max) {
    return [
        [min, "#F9A825", "Very low biodiversity"],
        [getQuant(min, max, 0.35), "#e8f4c4"],
        [getQuant(min, max, 0.5), "#00E676", "Expected biodiversity"],
        [getQuant(min, max, 0.75), "#3d9ab8"],
        [getQuant(min, max, 0.85), "#318ab5"],
        [max, "#2a4e9b", "Very high biodiversity"],
    ];
}

function blGr(min, max) {
    return [
        [min, "#000000", "Very low biodiversity"],
        [max, "#00ff00", "Very high biodiversity"],
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