/*
 *  main.js
 */

let lineChart1

// time parsers/formatters
const parseTime = d3.timeParse("%Y-%m-%d")
const formatTime = d3.timeFormat("%d-%m-%Y")


var url = "https://data.opendatasoft.com/api/records/1.0/search/?dataset=covid-19-pandemic-belgium-hosp-province%40public&rows=200&sort=date&facet=date&facet=province&facet=region&refine.region=Brussels"
d3.json(url).then(function (data) {
    // clean data
    data = Object.values(data)
    console.log(data)
    formattedData = data[2].filter(date => {
        const dataExists = (date.fields.new_in && date.fields.date)
        return dataExists
    }).map(date => {
        date.fields.new_in = Number(date.fields.new_in)
        date.fields.date = parseTime(date.fields.date)
        return date
    })
    console.log(formattedData)
    // run the visualization for the first time
    lineChart1 = new LineChart("#chart-area")
}).catch(function (error) {
    console.log("error getting json", error)
})


function updateCharts() {
    lineChart1.wrangleData()
}