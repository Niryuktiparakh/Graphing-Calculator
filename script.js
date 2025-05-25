// document.getElementById("fileInput").addEventListener("change", function(evt) {
//   const file = evt.target.files[0];
//   const reader = new FileReader();
//   reader.onload = function(e) {
//     const lines = e.target.result.split("\n");

//     // Check for equation header
//     if (lines[0].startsWith("#")) {
//       const equation = lines[0].substring(1).trim();
//       document.getElementById("equationDisplay").innerText = "y = " + equation;
//       lines.shift(); // remove header
//     }

//     const x = [], y = [];

//     lines.forEach(line => {
//       const [xVal, yVal] = line.split(",");
//       if (!isNaN(xVal) && !isNaN(yVal)) {
//         x.push(parseFloat(xVal));
//         y.push(parseFloat(yVal));
//       }
//     });

//     const trace = {
//       x: x,
//       y: y,
//       type: 'scatter',
//       mode: 'lines'
//     };

//     Plotly.newPlot('plot', [trace]);
//   };
//   reader.readAsText(file);
// }); 


// Add missing trig functions to math.js
math.import({
  sec: function (x) { return 1 / Math.cos(x); },
  cosec: function (x) { return 1 / Math.sin(x); },
  cot: function (x) { return 1 / Math.tan(x); },
  csc: function (x) { return 1 / Math.sin(x); }
}, { override: true });

document.getElementById("plotButton").addEventListener("click", function () {
  const input = document.getElementById("equationInput").value;
  let expr = input.replace("y=", "").trim();

  // Replace cosec with csc for consistency
  expr = expr.replace(/cosec\(/g, "csc(");

  const x = [], y = [];

  for (let i = -Math.PI * 4; i <= Math.PI * 4; i += 0.1) {
    try {
      const scope = { x: i };
      const yVal = math.evaluate(expr, scope);
      x.push(i);
      y.push(yVal);
    } catch (error) {
      x.push(i);
      y.push(null);
    }
  }

  const trace = {
    x: x,
    y: y,
    type: 'scatter',
    mode: 'lines',
    line: { shape: 'spline' }
  };

  const tickVals = [];
  const tickText = [];
  for (let k = -8; k <= 8; k++) {
    const val = k * Math.PI / 2;
    tickVals.push(val);
    if (k === 0) tickText.push('0');
    else if (k === 1) tickText.push('π/2');
    else if (k === -1) tickText.push('-π/2');
    else if (k % 2 === 0) tickText.push(`${k / 2}π`);
    else tickText.push(`${k}π/2`);
  }

  const layout = {
    xaxis: {
      tickvals: tickVals,
      ticktext: tickText,
      showgrid: true,
      range: [-Math.PI * 4, Math.PI * 4]
    },
    yaxis: {
      autorange: true,
      showgrid: true
    }
  };

  Plotly.newPlot('plot', [trace], layout);
});
