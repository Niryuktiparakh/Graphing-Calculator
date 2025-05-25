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


// Utility function to generate a range of numbers
function linspace(start, end, num) {
  const arr = [];
  const step = (end - start) / (num - 1);
  for (let i = 0; i < num; i++) {
    arr.push(start + step * i);
  }
  return arr;
}

function plotGraph() {
  const exprInput = document.getElementById("equation").value.trim();

  if (!exprInput) {
    alert("Please enter an equation.");
    return;
  }

  const xVals = linspace(-10, 10, 100);
  const yVals = linspace(-10, 10, 100);
  const zVals = [];

  let isExplicit = false;

  // Detect if it's an explicit equation (y = f(x))
  let expr = exprInput;
  if (expr.startsWith("y=") || expr.startsWith("y =")) {
    isExplicit = true;
    expr = expr.replace(/^y\s*=\s*/, "");
  }

  try {
    if (isExplicit) {
      // Explicit Function: Plot y = f(x)
      const xPoints = [];
      const yPoints = [];
      for (let x = -10; x <= 10; x += 0.1) {
        const scope = { x };
        const y = math.evaluate(expr, scope);
        if (typeof y === "number" && isFinite(y)) {
          xPoints.push(x);
          yPoints.push(y);
        }
      }

      const trace = {
        x: xPoints,
        y: yPoints,
        mode: 'lines',
        type: 'scatter',
        name: `y = ${expr}`
      };

      Plotly.newPlot("plot", [trace], {
        title: `Graph of y = ${expr}`,
        xaxis: { title: "x" },
        yaxis: { title: "y" },
      });

    } else {
      // Implicit Function: Evaluate over grid
      for (let i = 0; i < yVals.length; i++) {
        const row = [];
        for (let j = 0; j < xVals.length; j++) {
          const x = xVals[j];
          const y = yVals[i];

          const scope = { x, y };

          // Convert implicit equation to f(x, y) = 0 form
          const [left, right] = exprInput.split("=");
          if (!right) {
            alert("Please enter an equation using '=' for implicit form.");
            return;
          }

          const implicitExpr = `(${left}) - (${right})`;
          const result = math.evaluate(implicitExpr, scope);

          // To highlight 0-contour only, use result directly
          row.push(result);
        }
        zVals.push(row);
      }

      const contour = {
        x: xVals,
        y: yVals,
        z: zVals,
        type: "contour",
        contours: {
          coloring: 'lines',
          showlabels: true,
          labelfont: {
            size: 12,
            color: 'black'
          },
          start: 0,
          end: 0,
          size: 0.5
        },
        line: {
          width: 2
        }
      };

      Plotly.newPlot("plot", [contour], {
        title: `Graph of ${exprInput}`,
        xaxis: { title: "x" },
        yaxis: { title: "y" }
      });
    }
  } catch (error) {
    console.error("Error evaluating expression:", error);
    alert("Invalid equation. Please enter a valid mathematical expression.");
  }
}
