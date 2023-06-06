var memory = [];


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
        })
        .call(drag); // Apply the drag behavior to the groups


    // Append the state circles
    stateGroups.append('circle')
        .attr('r', 25)
        .attr('fill', 'white')
        .attr('stroke','black');

    // Append the state labels
    stateGroups.append('text')
        .text(function(d) {
          return d;
        })
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '12px');


  }
  drag = d3.drag()
      .on("start", dragStart)
      .on("drag", dragging)
      .on("end", dragEnd);

  // Define the drag start function
  function dragStart(d) {
    d3.select(this).raise().classed("active", true);
  }

  // Define the dragging function
  // Define the dragging function
  function dragging(d) {
    var svg = d3.select('#svgContainer');
    var containerWidth = parseInt(svg.style('width'));
    var containerHeight = parseInt(svg.style('height'));
    var stateRadius = 25;

    // Calculate the maximum allowed x and y coordinates
    var maxX = containerWidth - stateRadius * 2;
    var maxY = containerHeight - stateRadius * 2;

    // Calculate the limited x and y coordinates
    var x = Math.max(stateRadius, Math.min(maxX, d3.event.x));
    var y = Math.max(stateRadius, Math.min(maxY, d3.event.y));

    d3.select(this)
        .attr("transform", function(d) {
          // Update the center coordinates of the state
          var centerX = x;
          var centerY = y;
          // Get the state ID
          var stateId = d3.select(this).attr('id').split('_')[1];
          // console.log(getTargetState(stateId));
          // Update the loop arc for the current state
          updateLoopArc(stateId, centerX, centerY);
          updateCurvLineRetour(stateId, centerX,centerY)
          updateCurvLineAller(stateId, centerX,centerY)
          return "translate(" + (d.x = x) + "," + (d.y = y) + ")";
        });
  }
  // Define the drag end function
  function dragEnd(d) {
    d3.select(this).classed("active", false);
  }

  // Define the loopArc function
  function updateLoopArc(state, centerX, centerY) {
    var svg = d3.select('#svgContainer');
    var currentState = svg.select('#state_' + state);

    // Calculate the radius of the loop arc
    var radius = parseFloat(currentState.select('circle').attr('r')) + 5;

    var startAngle = Math.PI * (5 / 4);
    var endAngle = Math.PI * (7 / 4);

    var startX = centerX + radius * Math.cos(startAngle);
    var startY = centerY + radius * Math.sin(startAngle);
    var endX = centerX + radius * Math.cos(endAngle);
    var endY = centerY + radius * Math.sin(endAngle);

    // Update the loop arc path
    var path = svg.select('#loopArc_' + state);
    path.attr('d', 'M ' + (startX+24) + ',' + (startY-4) +
        ' A ' + (radius-5) + ',' + (radius+5) + ' 0 1,1 ' +
        (endX-1) + ',' + (endY+3));

    // Update the loop arc text position
    var actionText = svg.select('#actionText_' + state);
    actionText.attr('x', centerX+16)
        .attr('y', centerY - radius - 26) // Position the text above the loop arc
  }


  function updateCurvLineRetour(state, newX,newY) {
    var svg = d3.select('#svgContainer');
    var firstPart,secondPart;
    for (let i = 0; i < memory.length; i++) {
      [firstPart, secondPart] = memory[i].split("DEL");
      if (firstPart === state) {
        var currentState = svg.select('#state_' + state);

        

        var centerX = parseFloat(currentState.attr('transform').split('(')[1].split(',')[0]);
        var centerY = parseFloat(currentState.attr('transform').split('(')[1].split(',')[1].split(')')[0]);

        var targetState = svg.select('#state_' + secondPart);
        var targetX = parseFloat(targetState.attr('transform').split('(')[1].split(',')[0]);
        var targetY = parseFloat(targetState.attr('transform').split('(')[1].split(',')[1].split(')')[0]);

        // Adjust the scaling factor to make the arc smaller or larger
        var scalingFactor = 0.75; // Adjust this value as needed

        var radius = scalingFactor * Math.sqrt(Math.pow(centerX - targetX, 2) + Math.pow(centerY - targetY, 2));

        console.log(firstPart + secondPart);
        var path = svg.select('#' + firstPart + secondPart);
        // alert(path);
        var dValue = path.attr('d');
        var desiredPart = dValue.split(" ").pop();

        console.log(desiredPart); // Output: "494.66666666666663,250"
        path.attr('d', 'M ' + (newX) + ',' + (newY) +
            ' A ' + radius + ',' + (radius - 24) + ' 0 0,1 ' +
            desiredPart);
      }
    }
  }

  function updateCurvLineAller(state,newX,newY) {
    var svg = d3.select('#svgContainer');
    var firstPart,secondPart;
    for (let i = 0; i < memory.length; i++) {
      [firstPart, secondPart] = memory[i].split("DEL");
      if (secondPart === state) {
        var currentState = svg.select('#state_' + state);

        var centerX = parseFloat(currentState.attr('transform').split('(')[1].split(',')[0]);
        var centerY = parseFloat(currentState.attr('transform').split('(')[1].split(',')[1].split(')')[0]);

        var targetState = svg.select('#state_' + firstPart);
        var targetX = parseFloat(targetState.attr('transform').split('(')[1].split(',')[0]);
        var targetY = parseFloat(targetState.attr('transform').split('(')[1].split(',')[1].split(')')[0]);

        // Adjust the scaling factor to make the arc smaller or larger
        var scalingFactor = 0.75; // Adjust this value as needed

        var radius = scalingFactor * Math.sqrt(Math.pow(centerX - targetX, 2) + Math.pow(centerY - targetY, 2));

        console.log(firstPart + secondPart);
        var path = svg.select('#' + firstPart + secondPart);
        // alert(path);
        var dValue = path.attr('d');
        var desiredPart = dValue.split(" ")[1];
        path.attr('d', 'M ' + desiredPart +
            ' A ' + radius + ',' + (radius - 24) + ' 0 0,1 ' +
            (newX+30) + ',' + newY);
      }
    }
  }




  // Define the drawTransition function
  function drawTransition(transitions) {
    var svg = d3.select('#svgContainer');
    var curvId="";

    for (var i = 0; i < transitions.length; i++) {
      var transition = transitions[i];
      // Check if the current state equals the target state
      if (null == transition.target) {
        loopArc(transition.state, transition);

      }
      else if (((curvId=hasReverseTransition(transition, transitions)).charAt(0))=="1" ) {
        curvId=curvId.substring(1);
        // alert(hi);
        curvLineRetour(transition.state, transition,curvId);
      }else if(((curvId=hasReverseTransition(transition, transitions)).charAt(0))=="2") {
        curvId=curvId.substring(1);
        // alert(hi);
        curvLineAller(transition.state, transition,curvId);
      }

    }
  }
// Function to check if there is a reverse transition
  function hasReverseTransition(transition, transitions) {
    for (var i = 0; i < transitions.length; i++) {
      var reverseTransition = transitions[i];
      if (
          reverseTransition.state === transition.target &&
          reverseTransition.target === transition.state
      ) { if(!memory.includes(reverseTransition.state + 'DEL' + transition.state))memory.push(reverseTransition.state + 'DEL' + transition.state);
        if(memory.includes(transition.state + 'DEL' + reverseTransition.state))
          return '1'+transition.state+ reverseTransition.state;
        //console.log(reverseTransition.state+" and "+ transition.state);
        return '2'+transition.state+ reverseTransition.state;
      }
    }
    return '3';
  }


  // Define the loopArc function
  function loopArc(state, transition) {
    var svg = d3.select('#svgContainer');
    var currentState = svg.select('#state_' + state);

    // Get the coordinates of the current state circle
    var centerX = parseFloat(currentState.attr('transform').split('(')[1].split(',')[0]);
    var centerY = parseFloat(currentState.attr('transform').split('(')[1].split(',')[1].split(')')[0]);

    // Calculate the radius of the loop arc
    var radius = parseFloat(currentState.select('circle').attr('r')) + 5;

    var startAngle = Math.PI * (5 / 4);
    var endAngle = Math.PI * (7 / 4);

    var startX = centerX + radius * Math.cos(startAngle);
    var startY = centerY + radius * Math.sin(startAngle);
    var endX = centerX + radius * Math.cos(endAngle);
    var endY = centerY + radius * Math.sin(endAngle);

    // Create the marker for the arrowhead (if not already created)
    if (svg.select('#arrowhead').empty()) {
      svg.append('marker')
          .attr('id', 'arrowhead')
          .attr('markerWidth', '10')
          .attr('markerHeight', '10')
          .attr('refX', '4')
          .attr('refY', '3')
          .attr('orient', 'auto')
          .append('path')
          .attr('d', 'M0,0 L0,6 L9,3 z')
          .attr('fill', 'black');
    }

    // Create or update the path for the loop arc
    var path = svg.select('#loopArc_' + state);
    if (path.empty()) {
      path = svg.append('path')
          .attr('id', 'loopArc_' + state)
          .attr('stroke', 'rgb(' + 204 + ', ' + 204 + ', ' + 204 + ')')
          .attr('fill', 'none')
          .attr('marker-end', 'url(#arrowhead)');
    }
    path.attr('d', 'M ' + (startX+24) + ',' + (startY-4) +
        ' A ' + (radius-5) + ',' + (radius+5) + ' 0 1,1 ' +
        (endX-1) + ',' + (endY+1.87));

    // Create or update the text for the loop action
    var actionText = svg.select('#actionText_' + state);
    if (actionText.empty()) {
      actionText = svg.append('text')
          .attr('id', 'actionText_' + state)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .attr('font-size', '12px');
    }
    var actionTextContent = transition.characters.join(',') + '->' + transition.direction;
    actionText.attr('x', centerX+16)
        .attr('y', centerY - radius - 26) // Position the text above the loop arc
        .text(actionTextContent);
  }


/// Define the curvLine function
  function curvLineRetour(state, transition,curvId) {
    var svg = d3.select('#svgContainer');
    var currentState = svg.select('#state_' + state);

    console.log(state);

    var centerX = parseFloat(currentState.attr('transform').split('(')[1].split(',')[0]);
    var centerY = parseFloat(currentState.attr('transform').split('(')[1].split(',')[1].split(')')[0]);

    var targetState = svg.select('#state_' + transition.target);
    var targetX = parseFloat(targetState.attr('transform').split('(')[1].split(',')[0]);
    var targetY = parseFloat(targetState.attr('transform').split('(')[1].split(',')[1].split(')')[0]);

    // Adjust the scaling factor to make the arc smaller or larger
    var scalingFactor = 0.75; // Adjust this value as needed

    var radius = scalingFactor * Math.sqrt(Math.pow(centerX - targetX, 2) + Math.pow(centerY - targetY, 2));
    var path = svg.append('path')
        .attr('d', 'M ' + (centerX+25) + ',' + (centerY-3) +
            ' A ' + (radius-0) + ',' + (radius-24) + ' 0 0,1 ' +
            (targetX+28) + ',' + targetY)
        .attr('stroke', 'rgb(' + 204 + ', ' + 204 + ', ' + 204 + ')')
        .attr('id',curvId)
        .attr('fill', 'none')
        .attr('marker-end', 'url(#arrowhead)');

    var text = svg.append('text')
        .attr('font-size', '12px');

// Create the textPath and set its attributes
    var textPath = text.append('textPath')
        .attr('startOffset', '50%')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'text-after-edge')
        .text(transition.characters.join(',') + '->' + transition.direction);

// Get the id of the path element
    var pathId = path.attr('id');

// Add the path reference to the textPath
    textPath.attr('href', '#' + pathId);

// Add the path reference to the textPath
    svg.attr('href', '#' + pathId);
  }


  function curvLineAller(state, transition,curvId) {
    var svg = d3.select('#svgContainer');
    var currentState = svg.select('#state_' + state);

    var centerX = parseFloat(currentState.attr('transform').split('(')[1].split(',')[0]);
    var centerY = parseFloat(currentState.attr('transform').split('(')[1].split(',')[1].split(')')[0]);

    var targetState = svg.select('#state_' + transition.target);
    var targetX = parseFloat(targetState.attr('transform').split('(')[1].split(',')[0]);
    var targetY = parseFloat(targetState.attr('transform').split('(')[1].split(',')[1].split(')')[0]);

    // Adjust the scaling factor to make the arc smaller or larger
    var scalingFactor = 0.75; // Adjust this value as needed

    var radius = scalingFactor * Math.sqrt(Math.pow(centerX - targetX, 2) + Math.pow(centerY - targetY, 2));
    var  coordinate = 'M ' + (centerX-25) + ',' + (centerY+7) +
        ' A ' + radius + ',' + (radius-24) + ' 0 0,1 ' +
        (targetX-57+30) + ',' + targetY;


    var path = svg.append('path')
        .attr('d', coordinate)
        .attr('stroke', 'rgb(' + 204 + ', ' + 204 + ', ' + 204 + ')')
        .attr('id',curvId)
        .attr('fill', 'none')
        .attr('marker-end', 'url(#arrowhead)');

    var text = svg.append('text')
        .attr('font-size', '12px');

// Create the textPath and set its attributes
    var textPath = text.append('textPath')
        .attr('startOffset', '50%')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'text-after-edge')
        .text(transition.characters.join(',') + '->' + transition.direction);

// Get the id of the path element
    var pathId = path.attr('id');

// Add the path reference to the textPath
    textPath.attr('href', '#' + pathId);

// Add the path reference to the textPath
    svg.attr('href', '#' + pathId);
  }

  // // Define your states and transitions
  // var states = ['q3', 'q1', 'q2','hello'];
  // // Example transitions
  // var transitions = [
  //   {
  //     currentState: 'hello',
  //     characters: ['0', '1'],
  //     direction: 'R',
  //     target: 'hello'
  //   },
  //   {
  //     currentState: 'q2',
  //     characters: ['0', '1'],
  //     direction: 'R',
  //     target: 'q2'
  //   },
  //   {
  //     currentState: 'q1',
  //     characters: ['0'],
  //     direction: 'L',
  //     target: 'q3'
  //   },
  //   {
  //     currentState: 'q3',
  //     characters: ['7','9'],
  //     direction: 'R',
  //     target: 'q1'
  //   },
  //   {
  //     currentState: 'q2',
  //     characters: ['6'],
  //     direction: 'L',
  //     target: 'q3'
  //   },
  //   {
  //     currentState: 'q3',
  //     characters: ['5','0'],
  //     direction: 'R',
  //     target: 'q2'
  //   },
  //   {
  //     currentState: 'q2',
  //     characters: ['4'],
  //     direction: 'L',
  //     target: 'hello'
  //   },
  //   {
  //     currentState: 'hello',
  //     characters: ['1'],
  //     direction: 'R',
  //     target: 'q2'
  //   },


  // ];




  console.log(memory);

