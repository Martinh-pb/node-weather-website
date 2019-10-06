const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const pathToPublic = path.join(__dirname, '../public')
const pathToViews = path.join(__dirname, '../templates/views')
const pathToPartials = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', pathToViews)
hbs.registerPartials(pathToPartials);

// Setup static directory to serve
app.use(express.static(pathToPublic))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Martin Haisma'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Martin Haisma'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Martin Haisma',
        message: 'This is the help page.'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }

    var address = req.query.address;
    getWeatherForAddress(address, (error, {location, forecast} = {}) => {
        if (error) {
            res.send({
                error
            })
        }
        else {
            res.send({
                location,
                forecast,
                address
            })
        }
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Martin Haisma',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Martin Haisma',
        errorMessage: 'Page not found.'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})


const getWeatherForAddress = (address, callback) => {
    geocode(address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return callback(error, undefined)
        }

        forecast(latitude, longitude, (error, { summary, temperature, precipProbability }) => {
            if (error) {
                return callback(error, undefined)
            }

            data = {
                location,
                forecast: `${summary} Het is momenteel ${temperature} graden buiten. Er is ${precipProbability}% kans op regen.`
            }
            
            return callback(undefined, data)
        })
    })
}