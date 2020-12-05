/*
 *  main.js
 */

let lineChart1
let lineChart2
let mapChart1
let formattedData
let geoData
// time parsers/formatters
const parseTime = d3.timeParse('%Y-%m-%d')
const formatTime = d3.timeFormat('%d/%m/%Y')

const url = 'https://data.opendatasoft.com/api/records/1.0/search/?dataset=covid-19-pandemic-belgium-hosp-province%40public&rows=1200&sort=date&facet=date&facet=province&facet=region'
//const url = 'data/data.json' in case of broken url test with this
d3.json(url).then(function (data) {
  // wrapping data into an array
  data = Object.values(data)

  // sort the array by Region becoming the key
  dataByRegion = data[2].reduce(function (r, a) {
    r[a.fields.region] = r[a.fields.region] || []
    r[a.fields.region].push(a)
    return r
  }, Object.create(null))

  // Filter, format and sort fields by date ascending
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
  //console.log(formattedData)

  // data is ready, building the line charts
  lineChart1 = new lineChart('#chart-area', 'new_in', 'covid-19 new entries')
  lineChart2 = new lineChart('#chart-area2', 'total_in', 'covid-19 patients')

  // build the map chart
  d3.json('data/belgium.json').then(function (values) {
    geoData = values
    mapChart1 = new mapChart('#map')
  }).catch(function (error) {
    console.error('error getting map json', error)
  })
})

d3.selectAll(".btn").on("click", handleBtn);

function handleBtn() {
  city = this.getAttribute("data-index")
  updateCharts(city)
}

// update line charts on some buttons or select-box events
function updateCharts (city) {
  lineChart1.wrangleData(city)
  lineChart2.wrangleData(city)
}

// update map ...
function updateMap () {
  mapChart1.wrangleData()
}