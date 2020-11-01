/*
*    lineChart.js
*    OOP   
*/
class LineChart {
    //constructor
    constructor(_parentElement) {
        this.parentElement = _parentElement
        this.initVis()
    }


    initVis() {
        const vis = this

        vis.MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 }
        vis.WIDTH = 800 - vis.MARGIN.LEFT - vis.MARGIN.RIGHT
        vis.HEIGHT = 500 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM

        vis.svg = d3.select("#chart-area").append("svg")
            .attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
            .attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM)

        vis.g = vis.svg.append("g")
            .attr("transform", `translate(${vis.MARGIN.LEFT}, ${vis.MARGIN.TOP})`)

        vis.g.append("text")
            .attr("x", vis.WIDTH / 2)
            .attr("y", 0)
            .text("Brussels")

        // time parsers/formatters
        vis.parseTime = d3.timeParse("%Y-%m-%d") //string to timestamp
        vis.formatTime = d3.timeFormat("%d/%m/%Y") //timestamp to formatted string

        // add the line for the first time
        vis.g.append("path")
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-width", "3px")

        // axis labels
        vis.xLabel = vis.g.append("text")
            .attr("class", "x axisLabel")
            .attr("y", vis.HEIGHT + 50)
            .attr("x", vis.WIDTH / 2)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("Time")
        vis.yLabel = vis.g.append("text")
            .attr("class", "y axisLabel")
            .attr("transform", "rotate(-90)")
            .attr("y", -60)
            .attr("x", -170)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("New in hospitals")

        // scales
        vis.x = d3.scaleTime().range([0, vis.WIDTH])
        vis.y = d3.scaleLinear().range([vis.HEIGHT, 0])

        // axis generators
        vis.xAxisCall = d3.axisBottom()
        vis.yAxisCall = d3.axisLeft()
            .ticks(6)

        // axis groups
        vis.xAxis = vis.g.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${vis.HEIGHT})`)
        vis.yAxis = vis.g.append("g")
            .attr("class", "y axis")

        vis.wrangleData()
    }

    //selecting/filtering the data with an interaction slider, buttons etc
    wrangleData() {
        const vis = this
        vis.filteredData = formattedData
        vis.updateVis()
    }

    // updateVis method - updating our elements to match the new data.
    updateVis() {
        const vis = this
        vis.t = d3.transition().duration(1000)

        //console.log(filteredData)

        // update scales
        vis.x.domain(d3.extent(vis.filteredData, d => d.fields.date))
        vis.y.domain([
            d3.min(vis.filteredData, d => d.fields.new_in),
            d3.max(vis.filteredData, d => d.fields.new_in)
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
        vis.xAxisCall.scale(vis.x)
        vis.xAxis.transition(vis.t).call(vis.xAxisCall)
        vis.yAxisCall.scale(vis.y)
        vis.yAxis.transition(vis.t).call(vis.yAxisCall.tickFormat(formatAbbreviation))

        // Path generator
        vis.line = d3.line()
            .x(d => vis.x(d.fields.date))
            .y(d => vis.y(d.fields.new_in))

        // Update our line path
        vis.g.select(".line")
            .transition(vis.t)
            .attr("d", vis.line(vis.filteredData))
    }
}