
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

export const schemes = {

    '*ibm_flip': function ibm(min, max) {
        return [
            [-1, "#ddddddcc"],
            [min, "#FFB000cc", "Very low"],
            [getQuant(min, max, 0.25), "#FE6100cc"],
            [getQuant(min, max, 0.5), "#DC267Fcc", "Expected"],
            [getQuant(min, max, 0.75), "#785EF0cc"],
            [max, "#648FFFcc", "Very high"],
        ];
    },
    
    'orGrBlu': function orGrBlu(min, max) {
        return [
            [-1, "#ddddddcc"],
            [min, "#F9A825cc", "Very low"],
            [getQuant(min, max, 0.35), "#e8f4c4cc"],
            [getQuant(min, max, 0.5), "#00E676cc", "Expected"],
            [getQuant(min, max, 0.75), "#3d9ab8cc"],
            [getQuant(min, max, 0.85), "#318ab5cc"],
            [max, "#2a4e9bcc", "Very high"],
        ];
    },
    
    'blGr': function blGr(min, max) {
        return [
            [-1, "#ddddddcc"],
            [min, "#000000", "Very low"],
            [max, "#00ff00", "Very high"],
        ]
    },
    
    'blBluCyWt': function blBluCyWt(min, max) {
        return [
            [-1, "#ddddddcc", "Missing"],
            [min, "#000000cc", "Very low"],
            [getQuant(min, max, 0.5), "#0000ffcc", "Expected"],
            [getQuant(min, max, 0.75), "#00ffffcc"],
            [max, "#ffffffcc", "Very high"],
        ]
    },
    
    
    'rdYlGr': function rdYlGr(min, max) {
        return [
            [-1, "#ddddddcc", "Missing"],
            [min, "#fd5533cc", "Very low"],
            [getQuant(min, max, 0.5), "#f8f611cc", "Normal"],
            [max, "#4eb87bcc", "Very high"],
        ]
    },
    
    
    '*mgYlGr': function mgYlGr(min, max) {
        return [
            [-1, "#ddddddcc", "Missing"],
            [min, "#F15C8Ecc", "Very low"],
            [getQuant(min, max, 0.5), "#f8f611cc", "Normal"],
            [max, "#4eb87bcc", "Very high"],
        ]
    },
    
    'grYlRd': function grYlRd(min, max) {
        return [
            [-1, "#ddddddcc", "Missing"],
            [min, "#00ff33cc", "Very low biodiversity"],
            [getQuant(min, max, 0.5), "#ffff33cc", "Normal biodiversity"],
            [max, "#ff3300cc", "Very high biodiversity"],
        ]
    },
    
    '*census': function census(min, max) {
        return [
            [-1, "#ddddddcc", "Missing"],
            [min, "#efd100cc", "Very low biodiversity"],
            [getQuant(min, max, 0.5), "#4eb87bcc", "Normal biodiversity"],
            [max, "#007fc4cc", "Very high biodiversity"],
        ]
    },
    
    'seqseq': function seqseq(min, max) {
        return [
            [-1, "#ddddddcc", "Missing"],
            [min, "#de4fa6cc", "Very low biodiversity"],
            [getQuant(min, max, 0.5), "#4fadd0cc", "Normal biodiversity"],
            [max, "#2a1a8acc", "Very high biodiversity"],
        ]
    },
    
    '*parula': function parula(min, max) {
        return [
            [-1, "#ddddddcc"],
            [min, "#352a87cc", "Very low"],
            [getQuant(min, max, 0.167), "#0469dfcc"],
            [getQuant(min, max, 0.33), "#06a0cbcc"],
            [getQuant(min, max, 0.5), "#1fb2accc", "Expected"],
            [getQuant(min, max, 0.667), "#a3bd6acc"],
            [getQuant(min, max, 0.833), "#fcc336cc"],
            [max, "#f8f611cc", "Very high"],
        ];
    },
    
    '*parula_flip': function parula_flip(min, max) {
        return [
            [-1, "#ddddddcc"],
            [min, "#f8f611cc", "Very low"],
            [getQuant(min, max, 0.167), "#fcc336cc"],
            [getQuant(min, max, 0.33), "#a3bd6acc"],
            [getQuant(min, max, 0.5), "#1fb2accc", "Expected"],
            [getQuant(min, max, 0.667), "#06a0cbcc"],
            [getQuant(min, max, 0.833), "#0469dfcc"],
            [max, "#352a87cc", "Very high"],
        ];
    },

    '*ibm': function ibm(min, max) {
        return [
            [-1, "#ddddddcc"],
            [min, "#648FFFcc", "Very low"],
            [getQuant(min, max, 0.25), "#785EF0cc"],
            [getQuant(min, max, 0.5), "#DC267Fcc", "Expected"],
            [getQuant(min, max, 0.75), "#FE6100cc"],
            [max, "#FFB000cc", "Very high"],
        ];
    },

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