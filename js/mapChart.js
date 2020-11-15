class mapChart {
  // constructor
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
    vis.center = [0.00, 50.64] //approximative center

    vis.svg = d3.select('#map').append('svg')
      .attr('width', vis.WIDTH)
      .attr('height', vis.HEIGHT)

    vis.g = vis.svg.append('g')

    //setting up the tooltip
    vis.tooltip = d3.select('#map')
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    //approximative projection
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

    //mouseOver tooltip + get data
    let mouseover = function (event, d) {
      if (event.properties.BRK_NAME == "Brussels") {
        const lastReport = formattedData['Brussels'][0]
        console.log(lastReport.total_in)
      }
      if (event.properties.BRK_NAME == "Flemish") {
        vis.getLastRegionData('Flanders')
      }
      if (event.properties.BRK_NAME == "Walloon") {
        vis.getLastRegionData('Wallonia')
      }
      vis.tooltip
        .html(`<p>mouse is on</p>`)
        .style("left", (d3.mouse(this)[0] + 100) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
        .style("opacity", 1)
    }

    //tooltip following mouse
    let mousemove = function (event, d) {
      vis.tooltip
        .html(`<p>test</p>`)
        .style("left", (d3.mouse(this)[0] + 100) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
    }

    //removing tooltip when mouse leaving
    let mouseleave = function (d) {
      vis.tooltip.style("opacity", 0)
    }

    //better projection
    vis.projection = d3.geoMercator()
      .fitSize([vis.WIDTH, vis.HEIGHT], vis.filteredValues)

    //drawing path
    vis.path = d3.geoPath()
      .projection(vis.projection)

    vis.g.selectAll('path')
      .data(vis.filteredValues.features)
      .enter()
      .append('path')
      .attr('class', 'region')
      .attr('d', vis.path)
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseleave', mouseleave)
  }


  //sum tdata of subunits of a same region & date
  getLastRegionData(region) {
    const lastReport = formattedData[region][0]
    let totalIn = lastReport.total_in
    let i = 1
    while (formatTime(lastReport.date) == formatTime(formattedData[region][i].date)) {
      totalIn += formattedData[region][i].total_in
      i++
    }
    console.log(totalIn)
  }
}
