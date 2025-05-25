document.getElementById('plotButton').addEventListener('click', () => {
  const input = document.getElementById('equationInput').value.toLowerCase();
  const cleanedInput = input.replace(/cosec/g, 'csc').replace(/sec/g, 'sec').replace(/cot/g, 'cot');
  
  try {
    if (!cleanedInput.includes('=')) {
      plotExplicit(cleanedInput);
    } else {
      plotImplicit(cleanedInput);
    }
  } catch (err) {
    alert('Invalid equation: ' + err.message);
  }
});

function plotExplicit(expr) {
  const exprRight = expr.replace('y=', '').replace('y =', '').trim();
  const compiled = math.compile(exprRight);
  const xValues = math.range(-10, 10, 0.1).toArray();
  const yValues = xValues.map(x => {
    try {
      const y = compiled.evaluate({x});
      return (typeof y === 'number' && isFinite(y)) ? y : null;
    } catch {
      return null;
    }
  });

  const trace = {
    x: xValues,
    y: yValues,
    mode: 'lines',
    type: 'scatter',
    line: { color: 'orange' }
  };

  const layout = {
    title: 'Graph of y = ' + exprRight,
    xaxis: { title: 'x', tickvals: [-2 * Math.PI, -Math.PI, 0, Math.PI, 2 * Math.PI], ticktext: ['-2π', '-π', '0', 'π', '2π'] },
    yaxis: { title: 'y' }
  };

  Plotly.newPlot('plot', [trace], layout);
}

function plotImplicit(equation) {
  const [lhs, rhs] = equation.split('=').map(part => part.trim());
  const f = nerdamer(lhs + '-(' + rhs + ')').toString();

  const xRange = math.range(-10, 10, 0.2).toArray();
  const yRange = math.range(-10, 10, 0.2).toArray();
  const zValues = [];

  for (let y of yRange) {
    const row = [];
    for (let x of xRange) {
      try {
        const val = nerdamer(f, {x, y}).evaluate().text();
        row.push(parseFloat(val));
      } catch {
        row.push(NaN);
      }
    }
    zValues.push(row);
  }

  const contour = {
    z: zValues,
    x: xRange,
    y: yRange,
    type: 'contour',
    colorscale: 'Electric',
    contours: {
      coloring: 'lines',
      showlabels: true,
      labelfont: {
        family: 'Roboto',
        size: 12,
        color: 'white'
      }
    }
  };

  const layout = {
    title: 'Implicit Plot of ' + equation,
    xaxis: { title: 'x', tickvals: [-2 * Math.PI, -Math.PI, 0, Math.PI, 2 * Math.PI], ticktext: ['-2π', '-π', '0', 'π', '2π'] },
    yaxis: { title: 'y' }
  };

  Plotly.newPlot('plot', [contour], layout);
}
