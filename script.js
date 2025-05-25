const xRangeSlider = document.getElementById('xRange');
const yRangeSlider = document.getElementById('yRange');
const xRangeValue = document.getElementById('xRangeValue');
const yRangeValue = document.getElementById('yRangeValue');
let xLimit = 10;
let yLimit = 10;

xRangeSlider.addEventListener('input', () => {
  xLimit = parseInt(xRangeSlider.value);
  xRangeValue.textContent = `[-${xLimit}, ${xLimit}]`;
});

yRangeSlider.addEventListener('input', () => {
  yLimit = parseInt(yRangeSlider.value);
  yRangeValue.textContent = `[-${yLimit}, ${yLimit}]`;
});

document.getElementById('plotButton').addEventListener('click', () => {
  const rawInput = document.getElementById('equationInput').value.toLowerCase().replace(/\s+/g, '');
  const cleanedInput = rawInput
    .replace(/cosec/g, '1/sin')
    .replace(/csc/g, '1/sin')
    .replace(/cot/g, '1/tan')
    .replace(/sec/g, '1/cos');

  if (cleanedInput.includes('=')) {
    plotImplicit(cleanedInput);
  } else if (cleanedInput.startsWith('y=')) {
    plotExplicit(cleanedInput.substring(2));
  } else {
    alert("Unsupported format. Use y=expression or implicit equations like x^2+y^2=9.");
  }
});

function plotExplicit(expr) {
  try {
    const compiled = math.compile(expr);
    const xValues = math.range(-xLimit, xLimit, 0.1).toArray();
    const yValues = xValues.map(x => {
      try {
        const y = compiled.evaluate({ x });
        return isFinite(y) ? y : null;
      } catch {
        return null;
      }
    });

    const trace = {
      x: xValues,
      y: yValues,
      mode: 'lines',
      type: 'scatter',
      line: { color: '#ff5722' },
      hoverinfo: 'x+y'
    };

    const layout = {
      title: 'y = ' + expr,
      hovermode: 'closest',
      xaxis: {
        title: 'x',
        range: [-xLimit, xLimit],
        tickvals: [-2 * Math.PI, -Math.PI, 0, Math.PI, 2 * Math.PI],
        ticktext: ['-2π', '-π', '0', 'π', '2π']
      },
      yaxis: {
        title: 'y',
        range: [-yLimit, yLimit]
      }
    };

    Plotly.newPlot('plot', [trace], layout);
  } catch (err) {
    alert("Invalid expression or unable to evaluate: " + err.message);
  }
}

function plotImplicit(equation) {
  const [lhs, rhs] = equation.split('=');
  const implicitExpr = `(${lhs}) - (${rhs})`;

  const xRange = math.range(-xLimit, xLimit, 0.25).toArray();
  const yRange = math.range(-yLimit, yLimit, 0.25).toArray();
  const zValues = [];

  for (let y of yRange) {
    const row = [];
    for (let x of xRange) {
      try {
        const val = nerdamer(implicitExpr, { x, y }).evaluate().text();
        const numericVal = parseFloat(val);
        row.push(isNaN(numericVal) ? NaN : numericVal);
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
    hoverinfo: 'x+y+z',
    colorscale: 'Jet',
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
    title: 'Graph of: ' + equation,
    hovermode: 'closest',
    xaxis: {
      title: 'x',
      range: [-xLimit, xLimit],
      tickvals: [-2 * Math.PI, -Math.PI, 0, Math.PI, 2 * Math.PI],
      ticktext: ['-2π', '-π', '0', 'π', '2π']
    },
    yaxis: {
      title: 'y',
      range: [-yLimit, yLimit]
    }
  };

  Plotly.newPlot('plot', [trace], layout);
}
