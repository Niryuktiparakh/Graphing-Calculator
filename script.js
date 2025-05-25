document.getElementById("fileInput").addEventListener("change", function(evt) {
  const file = evt.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const lines = e.target.result.split("\n");

    // Check for equation header
    if (lines[0].startsWith("#")) {
      const equation = lines[0].substring(1).trim();
      document.getElementById("equationDisplay").innerText = "y = " + equation;
      lines.shift(); // remove header
    }

    const x = [], y = [];

    lines.forEach(line => {
      const [xVal, yVal] = line.split(",");
      if (!isNaN(xVal) && !isNaN(yVal)) {
        x.push(parseFloat(xVal));
        y.push(parseFloat(yVal));
      }
    });

    const trace = {
      x: x,
      y: y,
      type: 'scatter',
      mode: 'lines'
    };

    Plotly.newPlot('plot', [trace]);
  };
  reader.readAsText(file);
});
