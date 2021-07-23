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
  const legendHeight = 20;
  const legendWidth = legendHeight * colors.length;

  const legend = svg
    .append('g')
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .attr('id', 'legend')
    .attr('transform', `translate(${padding}, 0)`);



  const legendScale = d3.scaleLinear()
  legendScale.domain([
      d3.min(colorScale.domain()),
      d3.max(colorScale.domain())
    ])
    .range([0, legendWidth]);
  
    
  const legendAxis = d3.axisBottom(legendScale)
    .tickValues(colorScale.thresholds())
    .tickFormat((n) => (n + data.baseTemperature).toFixed(1));

  legend
    .selectAll('rect')
    .data(colorScale.range().map((color) => {
      let d = colorScale.invertExtent(color);
      if (d[0] === null) {
        d[0] = legendScale.domain()[0];
      }
      if (d[1] === null) {
        d[1] = legendScale.domain()[1];
      }
      console.log(d);
      return d;
    }))
    .enter()
    .append('rect')
    .attr('width', legendHeight)
    .attr('height', legendHeight)
    .attr('x', (d) => legendScale(d[0]))
    .attr('fill', (d) => colorScale(d[0]));

  legend.append('g')
    .attr('transform', `translate(0, ${legendHeight})`)
    .attr('id', 'legend-axis')
    .call(legendAxis);

  
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
        <p>${(data.baseTemperature + d.variance).toFixed(2)}</p>`
      );
    }).on('mouseout', () => {
      tooltip.style('display', 'none');
  });
  

});