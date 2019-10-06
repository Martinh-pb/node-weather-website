const request = require('request')
const {forecastApiKey} = require('./apikeys')

const forecast = (latitude, longitude, callback) => {
    var url = `https://api.darksky.net/forecast/${forecastApiKey}/${latitude},${longitude}?units=si&lang=nl`

    request({ url, json: true }, (error, {body} = {}) => {
        if (error) {
            callback('Unable to get the weather service', undefined)
        } else if (body.error) {
            callback('Unable to find location', undefined);
        }
        else {
            const currently = body.currently
            data = {
                summary: body.daily.data[0].summary,
                temperature: currently.temperature,
                precipProbability: currently.precipProbability
            }
            
            callback(undefined, data)
        }
    })
    
}

module.exports = forecast