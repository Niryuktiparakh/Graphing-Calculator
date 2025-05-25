document.getElementById('plotButton').addEventListener('click', () => {
  const input = document.getElementById('equationInput').value.toLowerCase();

  // Convert alternate trig notation to mathjs-compatible form
  const cleanedInput = input
    .replace(/cosec/g, '1/sin')
    .replace(/csc/g, '1/sin')
    .replace(/sec/g, '1/cos')
    .replace(/cot/g, '1/tan');

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
      const y = compiled.evaluate({ x });
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
    line: { color: 'orange' },
    hoverinfo: 'x+y'
  };

  const layout = {
    title: 'Graph of y = ' + exprRight,
    xaxis: { title: 'x' },
    yaxis: { title: 'y' }
  };

  Plotly.newPlot('plot', [trace], layout);
}

function plotImplicit(equation) {
  const [lhs, rhs] = equation.split('=').map(part => part.trim());
  const expr = `${lhs} - (${rhs})`;

  const compiled = math.compile(expr);
  const xRange = math.range(-10, 10, 0.25).toArray();
  const yRange = math.range(-10, 10, 0.25).toArray();
  const zValues = [];

  for (let y of yRange) {
    const row = [];
    for (let x of xRange) {
      try {
        const z = compiled.evaluate({ x, y });
        row.push((typeof z === 'number' && isFinite(z)) ? z : NaN);
      } catch {
        row.push(NaN);
      }
    }
    zValues.push(row);
  }

  const trace = {
    z: zValues,
    x: xRange,
    y: yRange,
    type: 'contour',
    colorscale: 'Jet',
    contours: {
      coloring: 'lines',
      showlabels: false,
      start: 0,
      end: 0,
      size: 0.01
    },
    hoverinfo: 'x+y'
  };

  const layout = {
    title: 'Implicit Plot of ' + equation,
    xaxis: { title: 'x' },
    yaxis: { title: 'y' }
  };

  Plotly.newPlot('plot', [trace], layout);
}
