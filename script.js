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


document.getElementById("plotButton").addEventListener("click", function () {
  const equationInput = document.getElementById("equationInput").value;
  const equationDisplay = document.getElementById("equationDisplay");

  if (!equationInput) {
    alert("Please enter an equation.");
    return;
  }

  equationDisplay.innerText = "y = " + equationInput;

  const x = [], y = [];

  // Compile the expression using math.js
  let compiled;
  try {
    compiled = math.compile(equationInput);
  } catch (err) {
    alert("Invalid equation: " + err.message);
    return;
  }

  // Generate values from -10 to 10
  for (let i = -10; i <= 10; i += 0.1) {
    x.push(i);
    try {
      const result = compiled.evaluate({ x: i });
      y.push(result);
    } catch (err) {
      y.push(null); // Skip invalid points
    }
  }

  const trace = {
    x: x,
    y: y,
    type: 'scatter',
    mode: 'lines',
    line: { color: 'blue' }
  };

  Plotly.newPlot('plot', [trace], {
    title: 'Graph of y = ' + equationInput,
    xaxis: { title: 'x' },
    yaxis: { title: 'y' }
  });
});
