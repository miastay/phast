
export function getPalette(min, max, scheme = "*ibm_flip") {
    let palette = schemes[scheme](min, max)
    return palette
}

export function getRelPdPalette(min, max, exp, scheme = "*ibm_flip") {
    return [
        [-1, "#dddddd"],
        [min, "#FFB000", "Very low"],
        //[getQuant(min, max, 0.25), "#FE6100"],
        [exp, "#DC267F", "Expected"],
        //[getQuant(min, max, 0.75), "#785EF0"],
        [max, "#648FFF", "Very high"],
    ];
}

export function getPdQuartilePalette(scheme = "*ibm_flip") {
    return [
        [-1, "#dddddd"],
        [0.5, '#648FFFcc'], 
        [1, '#7580ed'], 
        [1.5, '#8671db'], 
        [2, '#9762c9'], 
        [2.5, '#a853b7'], 
        [5, '#b944a5'], 
        [10, '#ca3593'], 
        [25, '#DC267Fcc'], 
        [75, '#FFB000cc'], 
        [90, '#e64c5a'], 
        [97.5, '#eb6048'], 
        [98, '#f07436'], 
        [98.5, '#f58824'], 
        [99, '#fa9c12'], 
        [99.5, '#FFB000cc']
    ];
}


export function getColorList(scheme = "*ibm_flip") {
    let palette = schemes[scheme](0, 1)
    let colors = []
    for(let c of palette) {
        colors.push(c[1])
    }
    return colors
}

export function getDiscretePalette(min, max, scheme = "blBluCyWt") {
    let palette = schemes['rdYlGr_discrete'](min, max)
    return palette
}

function getQuant(min, max, quant) {
    return  (quant * (max - min)) + min;
}

export const schemes = {

    '*ibm_flip': function ibm_flip(min, max) {
        return [
            [-1, "#dddddd"],
            [min, "#FFB000", "Very low"],
            [getQuant(min, max, 0.25), "#FE6100"],
            [getQuant(min, max, 0.5), "#DC267F", "Expected"],
            [getQuant(min, max, 0.75), "#785EF0"],
            [max, "#648FFF", "Very high"],
        ];
    },

    'orGrBlu': function orGrBlu(min, max) {
        return [
            [-1, "#dddddd"],
            [min, "#F9A825", "Very low"],
            [getQuant(min, max, 0.35), "#e8f4c4"],
            [getQuant(min, max, 0.5), "#00E676", "Expected"],
            [getQuant(min, max, 0.75), "#3d9ab8"],
            [getQuant(min, max, 0.85), "#318ab5"],
            [max, "#2a4e9b", "Very high"],
        ];
    },
    
    'blGr': function blGr(min, max) {
        return [
            [-1, "#dddddd"],
            [min, "#000000", "Very low"],
            [max, "#00ff00", "Very high"],
        ]
    },
    
    'blBluCyWt': function blBluCyWt(min, max) {
        return [
            [-1, "#dddddd", "Missing"],
            [min, "#000000", "Very low"],
            [getQuant(min, max, 0.5), "#0000ff", "Expected"],
            [getQuant(min, max, 0.75), "#00ffff"],
            [max, "#ffffff", "Very high"],
        ]
    },
    
    
    'rdYlGr': function rdYlGr(min, max) {
        return [
            [-1, "#dddddd", "Missing"],
            [min, "#fd5533", "Very low"],
            [getQuant(min, max, 0.5), "#f8f611", "Normal"],
            [max, "#4eb87b", "Very high"],
        ]
    },
    
    
    '*mgYlGr': function mgYlGr(min, max) {
        return [
            [-1, "#dddddd", "Missing"],
            [min, "#F15C8E", "Very low"],
            [getQuant(min, max, 0.5), "#f8f611", "Normal"],
            [max, "#4eb87b", "Very high"],
        ]
    },
    
    'grYlRd': function grYlRd(min, max) {
        return [
            [-1, "#dddddd", "Missing"],
            [min, "#00ff33", "Very low biodiversity"],
            [getQuant(min, max, 0.5), "#ffff33", "Normal biodiversity"],
            [max, "#ff3300", "Very high biodiversity"],
        ]
    },
    
    '*census': function census(min, max) {
        return [
            [-1, "#dddddd", "Missing"],
            [min, "#efd100", "Very low biodiversity"],
            [getQuant(min, max, 0.5), "#4eb87b", "Normal biodiversity"],
            [max, "#007fc4", "Very high biodiversity"],
        ]
    },
    
    'seqseq': function seqseq(min, max) {
        return [
            [-1, "#dddddd", "Missing"],
            [min, "#de4fa6", "Very low biodiversity"],
            [getQuant(min, max, 0.5), "#4fadd0", "Normal biodiversity"],
            [max, "#2a1a8a", "Very high biodiversity"],
        ]
    },
    
    '*parula': function parula(min, max) {
        return [
            [-1, "#dddddd"],
            [min, "#352a87", "Very low"],
            [getQuant(min, max, 0.167), "#0469df"],
            [getQuant(min, max, 0.33), "#06a0cb"],
            [getQuant(min, max, 0.5), "#1fb2ac", "Expected"],
            [getQuant(min, max, 0.667), "#a3bd6a"],
            [getQuant(min, max, 0.833), "#fcc336"],
            [max, "#f8f611", "Very high"],
        ];
    },
    
    '*parula_flip': function parula_flip(min, max) {
        return [
            [-1, "#dddddd"],
            [min, "#f8f611", "Very low"],
            [getQuant(min, max, 0.167), "#fcc336"],
            [getQuant(min, max, 0.33), "#a3bd6a"],
            [getQuant(min, max, 0.5), "#1fb2ac", "Expected"],
            [getQuant(min, max, 0.667), "#06a0cb"],
            [getQuant(min, max, 0.833), "#0469df"],
            [max, "#352a87", "Very high"],
        ];
    },

    '*ibm': function ibm(min, max) {
        return [
            [-1, "#dddddd"],
            [min, "#648FFF", "Very low"],
            [getQuant(min, max, 0.25), "#785EF0"],
            [getQuant(min, max, 0.5), "#DC267F", "Expected"],
            [getQuant(min, max, 0.75), "#FE6100"],
            [max, "#FFB000", "Very high"],
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

export function getBrandColors() {
    return {
        100: '#e9f6fc',
        200: '#b9e4f7',
        300: '#89d1f0',
        400: '#59bee9',
        500: '#29abe2',
        600: '#2186af',
        700: '#175f7c',
        800: '#0d3849',
        900: '#031116'
    }   
}