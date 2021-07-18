import * as d3 from 'd3';

const source = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

const height = 500;
const width = 800;
const padding = 30;

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

  //y axis
  const yScale = d3.scaleLinear();
  yScale.domain([0, 12])
    .range([height - padding, padding]);

  const yAxis = d3.axisLeft(yScale);
  
  svg.append('g')
    .attr('transform', `translate(${padding}, 0)`)
    .attr('id', 'y-axis')
    .call(yAxis);

  const cells = svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('data-month', (d) => d.month)
    .attr('data-year', (d) => d.year)
    .attr('data-temp', (d) => d.temperature)
    .attr('height', '2px')
    .attr('width', '2px')
    .attr('x', (d) => (d.year - 1753) + 30)
    .attr('y', (d) => (d.month * 3) + 100)
    .attr('fill', 'blue');

});

  svg.select('');
