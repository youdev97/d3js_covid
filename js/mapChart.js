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

    vis.tooltip = vis.g.append("div")
      .attr("class", "tooltip")

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
      .on("mouseover", function (event, d) {
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
      })
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
