document.getElementById('plotButton').addEventListener('click', () => {
  const input = document.getElementById('equationInput').value.toLowerCase();

  // Replace common trig aliases
  const cleanedInput = input
    .replace(/cosec/g, '1/sin')
    .replace(/cot/g, '1/tan')
    .replace(/sec/g, '1/cos');

  try {
    if (!cleanedInput.includes('=')) {
      alert("Please enter an equation with '='");
      return;
    }

    if (cleanedInput.startsWith('y=')) {
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
    line: { color: 'black' },
    hoverinfo: 'x+y'
  };

  const layout = {
    title: 'y = ' + exprRight,
    xaxis: { title: 'x' },
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
    colorscale: 'Jet',
    contours: {
      start: 0,
      end: 0,
      size: 0.01,
      coloring: 'lines',
      showlabels: false
    },
    hoverinfo: 'x+y'
  };

  const layout = {
    title: equation,
    xaxis: { title: 'x' },
    yaxis: { title: 'y' }
  };

  Plotly.newPlot('plot', [contour], layout);
}
