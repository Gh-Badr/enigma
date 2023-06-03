document.addEventListener("DOMContentLoaded", function() {
    // Define the drawState function
    function drawState(states) {
      // Select the SVG container
      var svg = d3.select('#svgContainer');
  
      // Set the dimensions of the SVG container
      var width = parseInt(svg.style('width'));
      var height = parseInt(svg.style('height'));
  
      // Calculate the angle between each state
      var angle = (2 * Math.PI) / states.length;
  
      // Calculate the radius of the circular arrangement
      var radius = Math.min(width, height) / 3;
  
      // Append a group for each state circle and label
      var stateGroups = svg.selectAll('.state')
        .data(states)
        .enter()
        .append('g')
        .attr('class', 'state')
        .attr('id', function(d) {
          return 'state_' + d; // Add an ID for each state
        })
        .attr('transform', function(d, i) {
          // Calculate the x and y coordinates based on the angle and radius
          var x = width / 2 + radius * Math.cos(i * angle);
          var y = height / 2 + radius * Math.sin(i * angle);
          return 'translate(' + x + ',' + y + ')';
        });
  
      // Append the state circles
      stateGroups.append('circle')
        .attr('r', 30)
        .attr('fill', 'lightblue');
  
      // Append the state labels
      stateGroups.append('text')
        .text(function(d) {
          return d;
        })
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '12px');
    }
  
    // Define the drawTransition function
    function drawTransition(transitions) {
      // Select the SVG container
      var svg = d3.select('#svgContainer');
  
      for (var i = 0; i < transitions.length; i++) {
        var transition = transitions[i];
  
        // Get the current state circle
        var currentState = svg.select('#state_' + transition.currentState);
  
        // Get the target state circle
        var targetState = svg.select('#state_' + transition.target);
  
        // Get the coordinates of the current and target state circles
        var currentX = parseFloat(currentState.attr('transform').split('(')[1].split(',')[0]);
        var currentY = parseFloat(currentState.attr('transform').split('(')[1].split(',')[1].split(')')[0]);
        var targetX = parseFloat(targetState.attr('transform').split('(')[1].split(',')[0]);
        var targetY = parseFloat(targetState.attr('transform').split('(')[1].split(',')[1].split(')')[0]);
  
        // Calculate the angle and radius for the line
        var dx = targetX - currentX;
        var dy = targetY - currentY;
        var angle = Math.atan2(dy, dx);
        var radius = parseFloat(currentState.select('circle').attr('r')) + 5;
  
        // Calculate the start and end points of the line
        var startX = currentX + Math.cos(angle) * radius;
        var startY = currentY + Math.sin(angle) * radius;
        var endX = targetX - Math.cos(angle) * radius;
        var endY = targetY - Math.sin(angle) * radius;
  
        // Create a curved line using the start and end points
        var line = svg.append('path')
          .attr('d', 'M' + startX + ',' + startY + 'Q' + (startX + endX) / 2 + ',' + (startY + endY) / 2 + ',' + endX + ',' + endY)
          .attr('stroke', 'black')
          .attr('fill', 'none');
  
        // Specify the x and y coordinates for the text
        var textX = (startX + endX) / 2;
        var textY = (startY + endY) / 2;
  
        
        // Append the text for the transition action
var actionText = transition.characters.join(',') + '->' + transition.direction;
svg.append('text')
  .attr('x', textX)
  .attr('y', textY - 10) // Subtract a value to position the text above the line
  .text(actionText)
  .attr('text-anchor', 'middle')
  .attr('alignment-baseline', 'middle')
  .attr('font-size', '12px')
  .attr('transform', function() {
    // Calculate the rotation angle for the text
    var angleDeg = angle * (180 / Math.PI);
    if (angleDeg > 90 && angleDeg < 270) {
        angleDeg -= 180; // Adjust the angle if the line goes left
      }
      else if (angleDeg > 270 && angleDeg < 360) {
        angleDeg -= 90; // Subtract 90 degrees to rotate the text along the line
      }
      else {
        angleDeg += 90; // Add 90 degrees to rotate the text along the line
      }
    return 'rotate(' + angleDeg + ',' + textX + ',' + (textY - 10) + ')'; // Subtract a value here as well
  });
      }
    }
  
    // Function to calculate the intermediate points along the curved path
    function calculateIntermediatePoints(startX, startY, endX, endY, numPoints, index) {
      var intermediatePoints = [];
      var dx = endX - startX;
      var dy = endY - startY;
  
      for (var i = 1; i <= numPoints; i++) {
        var fraction = i / (numPoints + 1);
        var x = startX + dx * fraction;
        var y = startY + dy * fraction;
  
        // Add some curve to the y-coordinate based on the index
        y += Math.sin((index + 1) * Math.PI / numPoints) * 50;
  
        intermediatePoints.push([x, y]);
      }
  
      return intermediatePoints;
    }
  
    // Define your states and transitions
    var states = ['q0', 'q1', 'q2','q3','q4','q5','q6','q7','q8'];
    // Example transitions
    var transitions = [
      {
        currentState: 'q0',
        characters: ['0', '1'],
        direction: 'R',
        target: 'q1'
      },
      {
        currentState: 'q1',
        characters: ['0'],
        direction: 'L',
        target: 'q2'
      },
      {
        currentState: 'q2',
        characters: ['1'],
        direction: 'R',
        target: 'q3'
      },
      {
        currentState: 'q0',
        characters: ['0'],
        direction: 'L',
        target: 'q2'
      },
       {
        currentState: 'q1',
        characters: ['1'],
        direction: 'R',
        target: 'q3'
      }
    ];
  
    // Call the drawState function with your states
    drawState(states);
  
    // Call the drawTransition function with the transitions array
    drawTransition(transitions);
  });
  