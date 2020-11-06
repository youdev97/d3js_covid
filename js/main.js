/*
 *  main.js
 */

let lineChart1
let lineChart2

// time parsers/formatters
const parseTime = d3.timeParse("%Y-%m-%d")
const formatTime = d3.timeFormat("%d-%m-%Y")

var url = "https://data.opendatasoft.com/api/records/1.0/search/?dataset=covid-19-pandemic-belgium-hosp-province%40public&rows=200&sort=date&facet=date&facet=province&facet=region&refine.region=Brussels"
d3.json(url).then(function (data) {
    // clean data
    data = Object.values(data)
    console.log(data)
    formattedData = data[2].filter(date => {
        const dataExists = (date.fields.new_in && date.fields.date && date.fields.total_in)
        return dataExists
    }).map(date => {
        date.fields.new_in = Number(date.fields.new_in)
        date.fields.total_in = Number(date.fields.total_in)
        date.fields.date = parseTime(date.fields.date)
        return date.fields
    })
    console.log(formattedData)
    // run the visualization for the first time
    lineChart1 = new lineChart("#chart-area", "new_in", "Hospital new entries")
    //lineChart2 = new lineChart("#chart-area2", "total_in", "Total in")
}).catch(function (error) {
    console.log("error getting json", error)
})


function updateCharts() {
    lineChart1.wrangleData()
}