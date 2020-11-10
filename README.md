
# D3.js v5 & Belgium's covid-19 data

My first personnal project on D3.js (v5),  the code is implementing OOP structure, I decided to work on Belgium's hospital's situation data.

## LineChart
I built a LineChart class that is used 2 times to create a graph about the number of hospital's intakes in Belgium and an another one with the total number of patients for the last few months.

## Map
I also use map, got the [NaturalEarthData] subunits data, I extracted only the belgium data from the shapefile and converted it in GeoJson file.
GDAL & TopoJSON are tools needed to perform this.

```
brew install gdal
```

```
npm install -g topojson
```

Extracting
```
ogr2ogr \
  -f GeoJSON \
  -where "ADM0_A3 = 'BEL' " \
  belgium.json \
  ne_10m_admin_0_map_subunits.shp
```

### Tech

[D3.js] - JavaScript library for visualizing data with HTML, SVG, and CSS.
[openData] - openData pandemic belgium hospitalisations API
[NaturalEarthData] - World vector map data

[openData]: <https://data.opendatasoft.com/explore/dataset/covid-19-pandemic-belgium-hosp-province%40public/api/?sort=date>
[D3.js]: <https://d3js.org/>
[NaturalEarthData]: <https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-0-details/>