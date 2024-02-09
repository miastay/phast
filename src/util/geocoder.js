// we can't hide this in a static context, so if you're reading this -- don't
const openweather_api_key = "7e5587b668bcd0d0c03ea54bd2d9e0fe"

export async function reverseGeocode(lat, lng, limit = 1) {
    return fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=${limit}&appid=${openweather_api_key}`)
    .then((response) => response.json())
    .then((data) => { return data[0]?.name ?? "Unknown"; })
}