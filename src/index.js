import * as d3 from 'd3';

const source = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

const svg = d3.select('main')
  .append('svg')
  .attr('height', '500px')
  .attr('width', '800px')
  .style('background-color', 'green');


d3.json(source).then((data) => {

  document.getElementById('dummy').innerHTML = JSON.stringify(data);

});

  svg.select('');
