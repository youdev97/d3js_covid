class mapChart {
    //constructor
    constructor(_parentElement, _variable, _title) {
        this.parentElement = _parentElement
        this.variable = _variable
        this.title = _title
        this.initVis()
    }

    initVis() {
        const vis = this

        vis.WIDTH = 800
        vis.HEIGHT = 650
        vis.scale = 5000
        vis.offset = [vis.WIDTH / 2, vis.HEIGHT / 2]
        vis.center = [0.00, 50.64]



        vis.svg = d3.select("#map").append("svg")
            .attr("width", vis.WIDTH)
            .attr("height", vis.HEIGHT);

        vis.g = vis.svg.append("g")

        vis.projection = d3.geoMercator()
            .fitSize([vis.WIDTH, vis.HEIGHT])
            .scale(vis.scale)
            .center(vis.center)
            .translate([0, 0])

        vis.path = d3.geoPath()
            .projection(vis.projection)

        vis.wrangleData()
    }

    wrangleData() {
        const vis = this
        vis.filteredValues = formattedValues
        vis.updateVis()
    }

    updateVis() {
        const vis = this
        vis.projection = d3.geoMercator()
            .fitSize([vis.WIDTH, vis.HEIGHT], vis.filteredValues)

        vis.path = d3.geoPath()
            .projection(vis.projection)

        vis.g.selectAll("path")
            .data(vis.filteredValues.features)
            .enter()
            .append("path")
            .attr("class", "region")
            .attr("d", vis.path)
    }
}