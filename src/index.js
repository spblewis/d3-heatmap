import * as d3 from 'd3';

// global constants.
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

// Drawing area for the chart
const svg = d3.select('section')
  .append('svg')
  .attr('height', height)
  .attr('width', width);

// Define an (invisible) tooltip to manipulate later
const tooltip = d3.select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('height', '200px')
  .style('width', '200px')
  .style('background-color', 'gray')
  .style('display', 'none')
  .html('<p>tooltip here</p>');

// Get the data
d3.json(source).then((data) => {
  const dataset = data.monthlyVariance;

  // x axis
  const xScale = d3.scaleBand();
  xScale.domain(dataset.map((d) => d.year))
    .range([padding, width - padding]);

  const xAxis = d3.axisBottom(xScale)
    .tickValues(xScale.domain().filter((y) => y % 10 === 0));
  
  svg.append('g')
    .attr('transform', `translate(0, ${height - padding})`)
    .attr('id', 'x-axis')
    .call(xAxis);

  // y axis
  const yScale = d3.scaleBand();
  yScale.domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .range([padding, height - padding]);

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

  // The Legend
  /*const legend = d3.select('svg')
    .append('g')
    .attr('transform', `translate(${height - (padding/2)}, ${padding})`);

  legend.selectAll('rect')
    .data(colorScale.range)
    .enter()
    .append('rect')
    .attr('width', 4)
    .attr('height', 4)
    .attr('fill', (d) => d);
*/
  
  // Map the data
  svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('data-month', (d) => d.month - 1)
    .attr('data-year', (d) => d.year)
    .attr('data-temp', (d) => data.baseTemperature + d.variance)
    .attr('height', yScale.bandwidth)
    .attr('width', xScale.bandwidth)
    .attr('x', (d) => xScale(d.year))
    .attr('y', (d) => yScale(d.month - 1))
    .attr('fill', (d) => colorScale(d.variance))
    // Tooltip manipulation
    .on('mouseover', (e, d) => {
      const [x, y] = d3.pointer(e);
      tooltip.style('display', 'block')
        .style('left', `${x + 120}px`)
        .style('top', `${y + 100}px`)
        .attr('data-year', d.year)
        .html(`<p>${getTheMonth(d.month - 1)}, ${d.year}</p>
        <p>${data.baseTemperature + d.variance}</p>`
      );
    }).on('mouseout', () => {
      tooltip.style('display', 'none');
  });
  

});