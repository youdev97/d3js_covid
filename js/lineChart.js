/*
*    lineChart.js
*    OOP
*/
class lineChart {
    //constructor
    constructor(_parentElement, _variable, _title) {
        this.parentElement = _parentElement
        this.variable = _variable
        this.title = _title
        this.initVis()
    }


    initVis() {
        const vis = this

        vis.MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 }
        vis.WIDTH = 600 - vis.MARGIN.LEFT - vis.MARGIN.RIGHT
        vis.HEIGHT = 500 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM

        vis.svg = d3.select(vis.parentElement).append("svg")
            .attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
            .attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM)

        vis.g = vis.svg.append("g")
            .attr("transform", `translate(${vis.MARGIN.LEFT}, ${vis.MARGIN.TOP})`)

        // time parsers/formatters
        vis.parseTime = d3.timeParse("%Y-%m-%d")
        vis.formatTime = d3.timeFormat("%d-%m-%Y")
        // for tooltip
        vis.bisectDate = d3.bisector(d => {
            return d.date
        }).left

        vis.g.append("text")
            .attr("x", vis.WIDTH / 2)
            .attr("y", 0)
            .text("Brussels")

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
            .text(vis.title)

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
        vis.x.domain(d3.extent(vis.filteredData, d => d.date))
        vis.y.domain([
            d3.min(vis.filteredData, d => d[vis.variable]),
            d3.max(vis.filteredData, d => d[vis.variable])
        ])

        // update axes
        vis.xAxisCall.scale(vis.x)
        vis.xAxis.transition(vis.t).call(vis.xAxisCall)
        vis.yAxisCall.scale(vis.y)
        vis.yAxis.transition(vis.t).call(vis.yAxisCall)

        // clear old tooltips
        vis.g.select(".focus").remove()
        vis.g.select(".overlay").remove()

        /******************************** Tooltip Code ********************************/

        vis.focus = vis.g.append("g")
            .attr("class", "focus")
            .style("display", "none")

        vis.focus.append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0)
            .attr("y2", vis.HEIGHT)

        vis.focus.append("line")
            .attr("class", "y-hover-line hover-line")
            .attr("x1", 0)
            .attr("x2", vis.WIDTH)

        vis.focus.append("circle")
            .attr("r", 7.5)

        vis.focus.append("text")
            .attr("x", 15)
            .attr("dy", ".31em")

        vis.g.append("rect")
            .attr("class", "overlay")
            .attr("width", vis.WIDTH)
            .attr("height", vis.HEIGHT)
            .on("mouseover", () => vis.focus.style("display", null))
            .on("mouseout", () => vis.focus.style("display", "none"))
            .on("mousemove", mousemove)

        function mousemove() {
            const x0 = vis.x.invert(d3.mouse(this)[0])
            const i = vis.bisectDate(vis.filteredData, x0, 1)
            const d0 = vis.filteredData[i - 1]
            const d1 = i == vis.filteredData.length ? vis.filteredData[i-1] : vis.filteredData[i] //avoid error on last index
            const d = x0 - d0.date > d1.date - x0 ? d1 : d0
            vis.focus.attr("transform", `translate(${vis.x(d.date)}, ${vis.y(d[vis.variable])})`)
            vis.focus.select("text").text(d[vis.variable])
            vis.focus.select(".x-hover-line").attr("y2", vis.HEIGHT - vis.y(d[vis.variable]))
            vis.focus.select(".y-hover-line").attr("x2", -vis.x(d.date))
        }

        /******************************** Tooltip Code ********************************/

        // Path generator
        vis.line = d3.line()
            .x(d => vis.x(d.date))
            .y(d => vis.y(d[vis.variable]))

        // Update our line path
        vis.g.select(".line")
            .transition(vis.t)
            .attr("d", vis.line(vis.filteredData))
    }
}