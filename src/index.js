import * as d3 from 'd3';

const source = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

const svg = d3.select('main')
  .append('svg')
  .attr('height', '500px')
  .attr('width', '800px');

d3.json(source).then((data) => {
  const dataset = data.monthlyVariance;

  svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('height', '2px')
    .attr('width', '2px')
    .attr('x', (d) => (d.year - 1700) + 10)
    .attr('y', (d) => (d.month * 3) + 100)
    .style('color', 'blue');

});

  svg.select('');
