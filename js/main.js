/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 3 - CoinStats
*/

const MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

g.append("text")
    .attr("x",  WIDTH /2)
    .attr("y",  0)
    .text("Brussels")
// time parsers/formatters
const parseTime = d3.timeParse("%Y-%m-%d")
const formatTime = d3.timeFormat("%d/%m/%Y")

// add the line for the first time
g.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "grey")
    .attr("stroke-width", "3px")

// axis labels
const xLabel = g.append("text")
    .attr("class", "x axisLabel")
    .attr("y", HEIGHT + 50)
    .attr("x", WIDTH / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Time")
const yLabel = g.append("text")
    .attr("class", "y axisLabel")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -170)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("New in hospitals")

// scales
const x = d3.scaleTime().range([0, WIDTH])
const y = d3.scaleLinear().range([HEIGHT, 0])

// axis generators
const xAxisCall = d3.axisBottom()
const yAxisCall = d3.axisLeft()
    .ticks(6)

// axis groups
const xAxis = g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`)
const yAxis = g.append("g")
    .attr("class", "y axis")

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
    update()
}).catch(function(error) {
    console.log("error getting json", error)
})

function update() {
    const t = d3.transition().duration(1000)

    //console.log(formattedData)

    // update scales
    x.domain(d3.extent(formattedData, d => d.fields.date))
    y.domain([
        d3.min(formattedData, d => d.fields.new_in),
        d3.max(formattedData, d => d.fields.new_in)
    ])

    // fix for format values
    const formatSi = d3.format(".2s")
    function formatAbbreviation(x) {
        const s = formatSi(x)
        switch (s[s.length - 1]) {
            case "G": return s.slice(0, -1) + "B" // billions
            case "k": return s.slice(0, -1) + "K" // thousands
        }
        return s
    }

    // update axes
    xAxisCall.scale(x)
    xAxis.transition(t).call(xAxisCall)
    yAxisCall.scale(y)
    yAxis.transition(t).call(yAxisCall.tickFormat(formatAbbreviation))

    // Path generator
    line = d3.line()
        .x(d => x(d.fields.date))
        .y(d => y(d.fields.new_in))

    // Update our line path
    g.select(".line")
        .transition(t)
        .attr("d", line(formattedData))

}