/*
 *  main.js
 */

let lineChart1
let lineChart2
let mapChart1
let formattedData
// time parsers/formatters
const parseTime = d3.timeParse('%Y-%m-%d')
const formatTime = d3.timeFormat('%d-%m-%Y')

let url = 'https://data.opendatasoft.com/api/records/1.0/search/?dataset=covid-19-pandemic-belgium-hosp-province%40public&rows=200&sort=date&facet=date&facet=province&facet=region'
d3.json('data/data.json').then(function (data) {
  // all data => to an array
  data = Object.values(data)

  // sort the array by Region becoming the key
  dataByRegion = data[2].reduce(function (r, a) {
    r[a.fields.region] = r[a.fields.region] || []
    r[a.fields.region].push(a)
    return r
  }, Object.create(null))

  //console.log(dataByRegion)
  // get Brussel's region data filter and format fields and sort by date ascending 
  formattedData = {}
  Object.keys(dataByRegion).forEach(region => {
    formattedData[region] = dataByRegion[region]
      .filter(d => {
        const validData = (d.fields.new_in && d.fields.date && d.fields.total_in)
        return validData
      }).map(d => {
        d.fields.new_in = Number(d.fields.new_in)
        d.fields.total_in = Number(d.fields.total_in)
        d.fields.date = parseTime(d.fields.date)
        return d.fields
      }).sort(function (a, b) {
        return a.date - b.date
      })
  })
  console.log(formattedData)

  //console.log(formattedData)
  // run the visualization for the first time
  lineChart1 = new lineChart('#chart-area', 'new_in', 'Hospital new entries')
  lineChart2 = new lineChart('#chart-area2', 'total_in', 'Total of patients ')
}).catch(function (error) {
  console.log('error getting json', error)
})

d3.json('data/belgium.json').then(function (values) {
  console.log(values)

  formattedValues = values
  mapChart1 = new mapChart('#map')
}).catch(function (error) {
  console.error('error getting json', error)
})

function updateCharts() {
  lineChart1.wrangleData()
}
