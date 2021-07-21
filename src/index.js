import * as d3 from 'd3';

// Declare unchanging constants.
const source = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
const height = 500;
const width = 1200;
const padding = 75;

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

// Helper function to get month names from their numbers (0 indexed)
const getTheMonth = (n) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  return months[n];
}

const svg = d3.select('main')
  .append('svg')
  .attr('height', height)
  .attr('width', width);

const tooltip = d3.select('main')
  .append('div')
  .style('height', 200)
  .style('width', 200)
  .style('background-color', 'gray')
  .style('display', 'none');

// Get the data
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
  yScale.domain([0, 11])
    .range([height - padding, padding]);

  const yAxis = d3.axisLeft(yScale)
    .tickFormat(getTheMonth);
  
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
    .attr('data-month', (d) => d.month - 1)
    .attr('data-year', (d) => d.year)
    .attr('data-temp', (d) => d.variance)
    .attr('height', (height - padding) / 12 - 1)
    .attr('width', 3)
    .attr('x', (d) => xScale(d.year))
    .attr('y', (d) => yScale(d.month))
    .attr('fill', (d) => colorScale(d.variance));

  // tooltip
  

});