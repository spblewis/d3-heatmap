import * as d3 from 'd3';

const source = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

const height = 500;
const width = 1200;
const padding = 30;
const colors = [
  "#313695",
  "#4575b4",
  "#74add1",
  "#abd9e9",
  "#e0f3f8",
  "#ffffbf",
  "#fee090",
  "#fdae61",
  "#f46d43",
  "#d73027",
  "#a50026"
];

const svg = d3.select('main')
  .append('svg')
  .attr('height', height)
  .attr('width', width);

d3.json(source).then((data) => {
  const dataset = data.monthlyVariance;
  console.log(data);

  // x axis
  const xScale = d3.scaleLinear();
  xScale.domain(
    [d3.min(dataset, (d) => d.year),
     d3.max(dataset, (d) => d.year)]
    )
    .range([padding, width - padding]);

  const xAxis = d3.axisBottom(xScale);
  
  svg.append('g')
    .attr('transform', `translate(0, ${height - padding})`)
    .attr('id', 'x-axis')
    .call(xAxis);

  // y axis
  const yScale = d3.scaleLinear();
  yScale.domain([0, 12])
    .range([height - padding, padding]);

  const yAxis = d3.axisLeft(yScale);
  
  svg.append('g')
    .attr('transform', `translate(${padding}, 0)`)
    .attr('id', 'y-axis')
    .call(yAxis);

  // color gradient
  const colorScale = d3.scaleQuantize()
  colorScale.domain([
    d3.min(dataset, (d) => d.variance),
    d3.max(dataset, (d) => d.variance)
  ])
    .range(colors);

  // cell data
  const cells = svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('data-month', (d) => d.month)
    .attr('data-year', (d) => d.year)
    .attr('data-temp', (d) => d.variance)
    .attr('height', (height - padding) / 12 - 1)
    .attr('width', 3)
    .attr('x', (d) => xScale(d.year))
    .attr('y', (d) => yScale(d.month))
    .attr('fill', (d) => colorScale(d.variance));

});