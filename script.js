// Add missing trig functions
math.import({
  sec: function (x) { return 1 / Math.cos(x); },
  cosec: function (x) { return 1 / Math.sin(x); },
  cot: function (x) { return 1 / Math.tan(x); },
  csc: function (x) { return 1 / Math.sin(x); }
}, { override: true });

document.getElementById("plotButton").addEventListener("click", function () {
  const input = document.getElementById("equationInput").value;
  const expr = input.replace("y=", "").trim();

  const x = [], y = [];

  for (let i = -10; i <= 10; i += 0.1) {
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
    mode: 'lines'
  };

  Plotly.newPlot('plot', [trace]);
});
