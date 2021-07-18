import * as d3 from 'd3';

const source = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

const svg = d3.select('main')
  .append('svg')
  .attr('height', '500px')
  .attr('width', '800px');

d3.json(source).then((data) => {
  const dataset = data.monthlyVariance;

  // x axis
  const xAxis = svg.append('g')
    .attr('id', 'x-axis');

  //y axis
  const yAxis = svg.append('g')
    .attr('id', 'y-axis');

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
