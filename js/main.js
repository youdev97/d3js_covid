/*
 *  main.js
 */

let lineChart1
let lineChart2
let mapChart1
// time parsers/formatters
const parseTime = d3.timeParse("%Y-%m-%d")
const formatTime = d3.timeFormat("%d-%m-%Y")


var url = "https://data.opendatasoft.com/api/records/1.0/search/?dataset=covid-19-pandemic-belgium-hosp-province%40public&rows=200&sort=date&facet=date&facet=province&facet=region&refine.region=Brussels"
d3.json("data/data.json").then(function (data) {
    // clean data
    data = Object.values(data)
    //console.log(data)
    formattedData = data[2].filter(date => {
        const dataExists = (date.fields.new_in && date.fields.date && date.fields.total_in)
        return dataExists
    }).map(date => {
        date.fields.new_in = Number(date.fields.new_in)
        date.fields.total_in = Number(date.fields.total_in)
        date.fields.date = parseTime(date.fields.date)
        return date.fields
    }).sort(function (a, b) {
        return a.date - b.date;
    })

    console.log(formattedData)
    // run the visualization for the first time
    lineChart1 = new lineChart("#chart-area", "new_in", "Hospital new entries")
    lineChart2 = new lineChart("#chart-area2", "total_in", "Total of patients ")
}).catch(function (error) {
    console.log("error getting json", error)
})


d3.json("data/belgium.json").then(function (values) {
    console.log(values)

    formattedValues = values
    mapChart1= new mapChart("#map")
}).catch(function (error) {
    console.error("error getting json", error)
})

function updateCharts() {
    lineChart1.wrangleData()
}