// /* * GRADIXY - Professional Gradient Generator
//  * Built by: HAMZATAYYAB AKA HAMZFLST-TECH
//  * Project URL: https://gradixy.netlify.app
//  * GitHub: https://github.com/HAMZFLST-TECH/Gradixy
//  * * This code is part of my professional portfolio. 
//  * Please provide attribution if used for educational purposes.
//  */

var app = {
  gradientType: "linear",
  angle: 90,
  colors: [
    { hex: "#667eea", pos: 0 },
    { hex: "#764ba2", pos: 100 },
  ],
};

function saveState() {
  try {
    var state = JSON.stringify(app);
    sessionStorage.setItem("gradientState", state);
  } catch (e) {
    console.log("Could not save state");
  }
}

function loadState() {
  try {
    var saved = sessionStorage.getItem("gradientState");
    if (saved) {
      app = JSON.parse(saved);
    }
  } catch (e) {
    console.log("Could not load state");
  }
}

function init() {
  loadState();
  setupEventListeners();
  renderColors();
  updateGradient();
  updateAngleDisplay();
  updateTypeButtons();
}

function updateAngleDisplay() {
  document.getElementById("angleSlider").value = app.angle;
  document.getElementById("angleDisplay").textContent = app.angle;
}

function updateTypeButtons() {
  var typeBtns = document.querySelectorAll(".type-btn");
  for (var i = 0; i < typeBtns.length; i++) {
    typeBtns[i].classList.remove("active");
    if (typeBtns[i].getAttribute("data-type") === app.gradientType) {
      typeBtns[i].classList.add("active");
    }
  }
}

function setupEventListeners() {
  var typeBtns = document.querySelectorAll(".type-btn");
  for (var i = 0; i < typeBtns.length; i++) {
    typeBtns[i].onclick = function () {
      handleTypeChange(this);
    };
  }

  document.getElementById("angleSlider").oninput = function () {
    handleAngleChange(this.value);
  };

  document.getElementById("addColorBtn").onclick = function () {
    addColorStop();
  };

  document.getElementById("randomBtn").onclick = function () {
    generateRandom();
  };

  document.getElementById("copyCssBtn").onclick = function () {
    copyToClipboard(document.getElementById("cssCode").textContent, this);
  };

  document.getElementById("copyTailwindBtn").onclick = function () {
    copyToClipboard(document.getElementById("tailwindCode").textContent, this);
  };
}

function handleTypeChange(btn) {
  var typeBtns = document.querySelectorAll(".type-btn");
  for (var i = 0; i < typeBtns.length; i++) {
    typeBtns[i].classList.remove("active");
  }
  btn.classList.add("active");
  app.gradientType = btn.getAttribute("data-type");
  saveState();
  updateGradient();
}

function handleAngleChange(value) {
  app.angle = parseInt(value);
  document.getElementById("angleDisplay").textContent = value;
  saveState();
  updateGradient();
}

function renderColors() {
  var container = document.getElementById("colorStopsContainer");
  container.innerHTML = "";

  for (var i = 0; i < app.colors.length; i++) {
    var item = document.createElement("div");
    item.className = "color-stop-item";

    var picker = document.createElement("input");
    picker.type = "color";
    picker.className = "color-picker";
    picker.value = app.colors[i].hex;
    picker.setAttribute("data-index", i);
    picker.onchange = function () {
      handleColorChange(this);
    };

    var text = document.createElement("input");
    text.type = "text";
    text.className = "color-text";
    text.value = app.colors[i].hex;
    text.setAttribute("data-index", i);
    text.oninput = function () {
      handleColorTextChange(this);
    };

    var pos = document.createElement("input");
    pos.type = "number";
    pos.className = "position-input";
    pos.min = 0;
    pos.max = 100;
    pos.value = app.colors[i].pos;
    pos.setAttribute("data-index", i);
    pos.oninput = function () {
      handlePositionChange(this);
    };

    var del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "×";
    del.disabled = app.colors.length <= 2;
    del.setAttribute("data-index", i);
    del.onclick = function () {
      handleDeleteColor(this);
    };

    item.appendChild(picker);
    item.appendChild(text);
    item.appendChild(pos);
    item.appendChild(del);

    container.appendChild(item);
  }
}

function handleColorChange(input) {
  var idx = parseInt(input.getAttribute("data-index"));
  app.colors[idx].hex = input.value;
  updateColorInputsOnly(idx);
  saveState();
  updateGradient();
}

function handleColorTextChange(input) {
  var idx = parseInt(input.getAttribute("data-index"));
  var value = input.value;
  if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
    app.colors[idx].hex = value;
    updateColorInputsOnly(idx);
    saveState();
    updateGradient();
  }
}

function updateColorInputsOnly(idx) {
  var items = document.querySelectorAll(".color-stop-item");
  if (items[idx]) {
    var picker = items[idx].querySelector(".color-picker");
    var text = items[idx].querySelector(".color-text");
    if (picker) picker.value = app.colors[idx].hex;
    if (text) text.value = app.colors[idx].hex;
  }
}

function handlePositionChange(input) {
  var idx = parseInt(input.getAttribute("data-index"));
  app.colors[idx].pos = parseInt(input.value);
  saveState();
  updateGradient();
}

function handleDeleteColor(btn) {
  var idx = parseInt(btn.getAttribute("data-index"));
  if (app.colors.length > 2) {
    app.colors.splice(idx, 1);
    saveState();
    renderColors();
    updateGradient();
  }
}

function addColorStop() {
  app.colors.push({
    hex: "#ffffff",
    pos: 50,
  });
  saveState();
  renderColors();
  updateGradient();
}

function generateRandom() {
  var numColors = Math.floor(Math.random() * 3) + 2;
  app.colors = [];

  for (var i = 0; i < numColors; i++) {
    var randomHex =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    var pos = Math.floor((100 / (numColors - 1)) * i);
    app.colors.push({ hex: randomHex, pos: pos });
  }

  app.angle = Math.floor(Math.random() * 360);
  document.getElementById("angleSlider").value = app.angle;
  document.getElementById("angleDisplay").textContent = app.angle;

  saveState();
  renderColors();
  updateGradient();
}

function buildGradientCSS() {
  var sorted = app.colors.slice().sort(function (a, b) {
    return a.pos - b.pos;
  });

  var stops = "";
  for (var i = 0; i < sorted.length; i++) {
    stops += sorted[i].hex + " " + sorted[i].pos + "%";
    if (i < sorted.length - 1) stops += ", ";
  }

  if (app.gradientType === "linear") {
    return "background: linear-gradient(" + app.angle + "deg, " + stops + ");";
  } else if (app.gradientType === "radial") {
    return "background: radial-gradient(circle, " + stops + ");";
  } else {
    return (
      "background: conic-gradient(from " + app.angle + "deg, " + stops + ");"
    );
  }
}

function buildTailwindClass() {
  var angleMap = {
    0: "bg-gradient-to-t",
    45: "bg-gradient-to-tr",
    90: "bg-gradient-to-r",
    135: "bg-gradient-to-br",
    180: "bg-gradient-to-b",
    225: "bg-gradient-to-bl",
    270: "bg-gradient-to-l",
    315: "bg-gradient-to-tl",
  };

  var angles = [0, 45, 90, 135, 180, 225, 270, 315];
  var closest = angles[0];
  var minDiff = Math.abs(app.angle - angles[0]);

  for (var i = 1; i < angles.length; i++) {
    var diff = Math.abs(app.angle - angles[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closest = angles[i];
    }
  }

  return angleMap[closest.toString()];
}

function updateGradient() {
  var css = buildGradientCSS();
  var preview = document.getElementById("gradientPreview");
  var gradientValue = css.split(": ")[1].replace(";", "");
  preview.style.background = gradientValue;

  document.getElementById("cssCode").textContent = css;

  if (app.gradientType === "linear") {
    document.getElementById("tailwindCode").textContent = buildTailwindClass();
  } else {
    document.getElementById("tailwindCode").textContent =
      "N/A (Only for linear gradients)";
  }
}

function copyToClipboard(text, btn) {
  var temp = document.createElement("textarea");
  temp.value = text;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);

  var originalText = btn.textContent;
  btn.textContent = "✓ Copied!";
  setTimeout(function () {
    btn.textContent = originalText;
  }, 2000);
}

init();

