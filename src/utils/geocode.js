const request = require('request')
const {geocodeApiKey} = require('./apikeys')

const geocode = (address, callback) => {
    const uriAddress = encodeURIComponent(address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${uriAddress}.json?proximity=-74.70850,40.78375&access_token=${geocodeApiKey}&limit=1`
    
    request({ url, json: true }, (error, {body} = {}) => {
        if (error) {
            callback('Unable to connect to location service', undefined)
        }
        else if (body.features == undefined || body.features.length === 0) {
            callback('Unable to find the geo locaton. Try another search', undefined)
        }
        else {
            const feature = body.features[0];
            data = {
                location: feature.place_name,
                latitude: feature.center[1],
                longitude: feature.center[0]
            }

            callback(undefined, data)
        }
    })
}

module.exports = geocode