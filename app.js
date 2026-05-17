const canvas = document.getElementById("drawing-canvas");
const context = canvas.getContext("2d");
const roughCanvas = rough.canvas(canvas);
const toolButtons = Array.from(document.querySelectorAll("[data-tool]"));
const activeToolLabel = document.getElementById("active-tool-label");
const shapeCountLabel = document.getElementById("shape-count");
const clearButton = document.getElementById("clear-canvas");
const shadowToggleButton = document.getElementById("shadow-toggle");
const optionControls = Array.from(document.querySelectorAll("[data-opt]"));
const optionOutputs = Array.from(document.querySelectorAll("[data-out]"));
const presetButtons = Array.from(document.querySelectorAll("[data-preset]"));

const state = {
  activeTool: "freedraw",
  shapes: [],
  pointerStart: null,
  previewShape: null,
};

const roughSettings = {
  stroke: "#6b4a2f",
  strokeWidth: 3,
  roughness: 1.35,
  bowing: 1.1,
  maxRandomnessOffset: 2,
  curveFitting: 0.95,
  curveStepCount: 9,
  simplification: 0,
  disableMultiStroke: false,
  preserveVertices: false,
  shadowEnabled: false,
  shadowStyle: "soft",
  shadowColor: "#312419",
  shadowOffsetX: 3,
  shadowOffsetY: 3,
  shadowPasses: 2,
  shadowJitter: 1.2,
  shadowSpread: 0.4,
  shadowRoughnessBoost: 0.55,
  shadowBowingBoost: 0.2,
  shadowSeedStep: 97,
  shadowOpacity: 0.25,
  fillEnabled: false,
  fill: "#d3a170",
  fillStyle: "hachure",
  fillWeight: 1,
  hachureGap: 4,
  hachureAngle: -41,
};

const stylePresets = {
  crayon: {
    stroke: "#6b4a2f",
    strokeWidth: 3,
    roughness: 1.35,
    bowing: 1.1,
    maxRandomnessOffset: 2,
    curveFitting: 0.95,
    curveStepCount: 9,
    simplification: 0,
    disableMultiStroke: false,
    preserveVertices: false,
    shadowEnabled: false,
    shadowStyle: "soft",
    shadowColor: "#312419",
    shadowOffsetX: 3,
    shadowOffsetY: 3,
    shadowPasses: 2,
    shadowJitter: 1.2,
    shadowSpread: 0.4,
    shadowRoughnessBoost: 0.55,
    shadowBowingBoost: 0.2,
    shadowSeedStep: 97,
    shadowOpacity: 0.25,
    fillEnabled: false,
    fill: "#d3a170",
    fillStyle: "hachure",
    fillWeight: 1,
    hachureGap: 4,
    hachureAngle: -41,
  },
  pencil: {
    stroke: "#4a433d",
    strokeWidth: 1.7,
    roughness: 0.95,
    bowing: 0.45,
    maxRandomnessOffset: 1.1,
    curveFitting: 0.98,
    curveStepCount: 13,
    simplification: 0.06,
    disableMultiStroke: false,
    preserveVertices: false,
    shadowEnabled: false,
    shadowStyle: "sketch",
    shadowColor: "#3c3228",
    shadowOffsetX: 2,
    shadowOffsetY: 2,
    shadowPasses: 2,
    shadowJitter: 1.8,
    shadowSpread: 0.4,
    shadowRoughnessBoost: 1.1,
    shadowBowingBoost: 0.38,
    shadowSeedStep: 83,
    shadowOpacity: 0.2,
    fillEnabled: false,
    fill: "#d7d1cc",
    fillStyle: "hachure",
    fillWeight: 0.8,
    hachureGap: 3,
    hachureAngle: -55,
  },
  ink: {
    stroke: "#24201c",
    strokeWidth: 4.2,
    roughness: 0.35,
    bowing: 0.2,
    maxRandomnessOffset: 0.6,
    curveFitting: 1,
    curveStepCount: 10,
    simplification: 0,
    disableMultiStroke: true,
    preserveVertices: true,
    shadowEnabled: false,
    shadowStyle: "hard",
    shadowColor: "#22170f",
    shadowOffsetX: 2,
    shadowOffsetY: 2,
    shadowPasses: 1,
    shadowJitter: 0.25,
    shadowSpread: 0,
    shadowRoughnessBoost: 0.2,
    shadowBowingBoost: 0.08,
    shadowSeedStep: 131,
    shadowOpacity: 0.2,
    fillEnabled: false,
    fill: "#201d1a",
    fillStyle: "solid",
    fillWeight: 1,
    hachureGap: 4,
    hachureAngle: -41,
  },
  chalk: {
    stroke: "#6a6f7f",
    strokeWidth: 5.2,
    roughness: 2.8,
    bowing: 1.8,
    maxRandomnessOffset: 4.8,
    curveFitting: 0.86,
    curveStepCount: 7,
    simplification: 0.2,
    disableMultiStroke: false,
    preserveVertices: false,
    shadowEnabled: true,
    shadowStyle: "glow",
    shadowColor: "#6e5030",
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowPasses: 3,
    shadowJitter: 1.7,
    shadowSpread: 0.6,
    shadowRoughnessBoost: 0.9,
    shadowBowingBoost: 0.32,
    shadowSeedStep: 97,
    shadowOpacity: 0.28,
    fillEnabled: true,
    fill: "#b8bfd2",
    fillStyle: "dots",
    fillWeight: 1.8,
    hachureGap: 6,
    hachureAngle: -20,
  },
  technical: {
    stroke: "#3f3d3a",
    strokeWidth: 2.1,
    roughness: 0.08,
    bowing: 0,
    maxRandomnessOffset: 0,
    curveFitting: 1,
    curveStepCount: 18,
    simplification: 0,
    disableMultiStroke: true,
    preserveVertices: true,
    shadowEnabled: true,
    shadowStyle: "hard",
    shadowColor: "#2b241d",
    shadowOffsetX: 2,
    shadowOffsetY: 2,
    shadowPasses: 1,
    shadowJitter: 0.25,
    shadowSpread: 0,
    shadowRoughnessBoost: 0.2,
    shadowBowingBoost: 0.08,
    shadowSeedStep: 111,
    shadowOpacity: 0.22,
    fillEnabled: true,
    fill: "#d8d8d8",
    fillStyle: "solid",
    fillWeight: 1,
    hachureGap: 4,
    hachureAngle: -41,
  },
  playful: {
    stroke: "#6d3f2f",
    strokeWidth: 3.6,
    roughness: 2.15,
    bowing: 2.2,
    maxRandomnessOffset: 3.6,
    curveFitting: 0.88,
    curveStepCount: 8,
    simplification: 0.12,
    disableMultiStroke: false,
    preserveVertices: false,
    shadowEnabled: true,
    shadowStyle: "lifted",
    shadowColor: "#2b1c10",
    shadowOffsetX: 1,
    shadowOffsetY: 8,
    shadowPasses: 2,
    shadowJitter: 0.9,
    shadowSpread: 0.5,
    shadowRoughnessBoost: 0.45,
    shadowBowingBoost: 0.16,
    shadowSeedStep: 89,
    shadowOpacity: 0.3,
    fillEnabled: true,
    fill: "#e0b582",
    fillStyle: "zigzag",
    fillWeight: 1.3,
    hachureGap: 7,
    hachureAngle: -32,
  },
};

const numericOptions = new Set([
  "strokeWidth",
  "roughness",
  "bowing",
  "maxRandomnessOffset",
  "curveFitting",
  "curveStepCount",
  "simplification",
  "shadowOffsetX",
  "shadowOffsetY",
  "shadowPasses",
  "shadowJitter",
  "shadowSpread",
  "shadowRoughnessBoost",
  "shadowBowingBoost",
  "shadowSeedStep",
  "shadowOpacity",
  "fillWeight",
  "hachureGap",
  "hachureAngle",
]);

const booleanOptions = new Set(["disableMultiStroke", "preserveVertices", "shadowEnabled", "fillEnabled"]);

function formatOptionValue(value) {
  if (typeof value === "number") {
    return Number(value.toFixed(2)).toString();
  }

  return String(value);
}

function updateOutputs() {
  optionOutputs.forEach((output) => {
    const key = output.dataset.out;
    if (!key) {
      return;
    }

    output.textContent = formatOptionValue(roughSettings[key]);
  });
}

function syncControlValues() {
  optionControls.forEach((control) => {
    const key = control.dataset.opt;
    if (!key) {
      return;
    }

    if (booleanOptions.has(key)) {
      control.checked = Boolean(roughSettings[key]);
      return;
    }

    control.value = String(roughSettings[key]);
  });
  updateOutputs();
}

function handleOptionChange(event) {
  const control = event.currentTarget;
  const key = control.dataset.opt;

  if (!key) {
    return;
  }

  if (booleanOptions.has(key)) {
    roughSettings[key] = control.checked;
  } else if (numericOptions.has(key)) {
    roughSettings[key] = Number(control.value);
  } else {
    roughSettings[key] = control.value;
  }

  updateOutputs();
  updateShadowToggleButton();
  presetButtons.forEach((button) => button.classList.remove("is-active"));
  render();
}

function getShadowSpec(style, opacity) {
  const presets = {
    soft: {
      offsetX: 3,
      offsetY: 3,
      color: `rgba(49, 36, 25, ${opacity})`,
      passes: 2,
      jitter: 1.2,
      roughnessBoost: 0.55,
    },
    hard: {
      offsetX: 2,
      offsetY: 2,
      color: `rgba(35, 24, 16, ${Math.min(1, opacity * 1.1)})`,
      passes: 1,
      jitter: 0.25,
      roughnessBoost: 0.2,
    },
    glow: {
      offsetX: 0,
      offsetY: 0,
      color: `rgba(110, 80, 48, ${opacity})`,
      passes: 3,
      jitter: 1.7,
      roughnessBoost: 0.9,
    },
    lifted: {
      offsetX: 1,
      offsetY: 8,
      color: `rgba(43, 28, 16, ${opacity})`,
      passes: 2,
      jitter: 0.9,
      roughnessBoost: 0.45,
    },
    sketch: {
      offsetX: 2,
      offsetY: 2,
      color: `rgba(58, 40, 24, ${Math.min(1, opacity * 0.95)})`,
      passes: 2,
      jitter: 1.8,
      roughnessBoost: 1.1,
    },
  };

  return presets[style] || presets.soft;
}

function hexToRgba(hexColor, alpha) {
  const hex = hexColor.replace("#", "");
  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map((char) => char + char)
          .join("")
      : hex;
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function renderShapePrimitive(shape, options, offsetX = 0, offsetY = 0) {
  if (shape.type === "line") {
    roughCanvas.line(shape.x1 + offsetX, shape.y1 + offsetY, shape.x2 + offsetX, shape.y2 + offsetY, options);
    return;
  }

  if (shape.type === "circle") {
    const diameter = shape.radius * 2;
    roughCanvas.ellipse(shape.cx + offsetX, shape.cy + offsetY, diameter, diameter, options);
    return;
  }

  roughCanvas.rectangle(shape.x + offsetX, shape.y + offsetY, shape.size, shape.size, options);
}

function updateShadowToggleButton() {
  if (!shadowToggleButton) {
    return;
  }

  shadowToggleButton.textContent = roughSettings.shadowEnabled ? "Shadow: On" : "Shadow: Off";
  shadowToggleButton.classList.toggle("is-active", roughSettings.shadowEnabled);
}

function applyPreset(presetName) {
  const preset = stylePresets[presetName];
  if (!preset) {
    return;
  }

  Object.assign(roughSettings, preset);
  syncControlValues();

  presetButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.preset === presetName);
  });

  updateShadowToggleButton();
  render();
}

function getPointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function drawShape(shape, isPreview = false) {
  const options = {
    stroke: roughSettings.stroke,
    strokeWidth: roughSettings.strokeWidth,
    roughness: roughSettings.roughness,
    bowing: roughSettings.bowing,
    maxRandomnessOffset: roughSettings.maxRandomnessOffset,
    curveFitting: roughSettings.curveFitting,
    curveStepCount: Math.max(4, Math.round(roughSettings.curveStepCount)),
    simplification: roughSettings.simplification,
    seed: shape.seed,
    strokeLineDash: [0, 0],
    disableMultiStroke: roughSettings.disableMultiStroke,
    preserveVertices: roughSettings.preserveVertices,
  };

  if (shape.type !== "line" && roughSettings.fillEnabled) {
    options.fill = roughSettings.fill;
    options.fillStyle = roughSettings.fillStyle;
    options.fillWeight = roughSettings.fillWeight;
    options.hachureGap = roughSettings.hachureGap;
    options.hachureAngle = roughSettings.hachureAngle;
  }

  context.save();
  context.globalAlpha = isPreview ? 0.55 : 1;

  if (shape.type !== "freedraw" && roughSettings.shadowEnabled) {
    const shadowSpec = getShadowSpec(roughSettings.shadowStyle, roughSettings.shadowOpacity);
    const finalShadowColor = hexToRgba(roughSettings.shadowColor, roughSettings.shadowOpacity);
    const shadowPasses = Math.max(1, Math.round(roughSettings.shadowPasses || shadowSpec.passes));
    const shadowSeedStep = Math.max(1, Math.round(roughSettings.shadowSeedStep));
    const shadowOptions = {
      ...options,
      stroke: finalShadowColor,
      roughness: options.roughness + roughSettings.shadowRoughnessBoost,
      bowing: options.bowing + roughSettings.shadowBowingBoost,
      fill: options.fill ? finalShadowColor : undefined,
      seed: options.seed + 1337,
    };

    for (let pass = 0; pass < shadowPasses; pass += 1) {
      const passSign = pass % 2 === 0 ? 1 : -1;
      const spreadOffset = roughSettings.shadowSpread * pass;
      const passOffsetX =
        roughSettings.shadowOffsetX + passSign * (roughSettings.shadowJitter * 0.4 * pass) + spreadOffset;
      const passOffsetY = roughSettings.shadowOffsetY + roughSettings.shadowJitter * 0.6 * pass + spreadOffset;
      const passOptions = {
        ...shadowOptions,
        seed: shadowOptions.seed + pass * shadowSeedStep,
      };

      renderShapePrimitive(shape, passOptions, passOffsetX, passOffsetY);
    }
  }

  if (shape.type === "freedraw") {
    if (shape.points.length > 1) {
      roughCanvas.linearPath(
        shape.points.map((point) => [point.x, point.y]),
        {
          ...options,
          preserveVertices: true,
        }
      );
    }

    context.restore();
    return;
  }

  renderShapePrimitive(shape, options);

  context.restore();
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  state.shapes.forEach((shape) => drawShape(shape));

  if (state.previewShape) {
    drawShape(state.previewShape, true);
  }

  shapeCountLabel.textContent = String(state.shapes.length);
}

function setActiveTool(tool) {
  state.activeTool = tool;
  activeToolLabel.textContent = tool === "freedraw" ? "Free draw" : tool.charAt(0).toUpperCase() + tool.slice(1);

  toolButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tool === tool);
  });
}

function buildShape(tool, start, current) {
  const seed = Math.floor(Math.random() * 1000000);

  if (tool === "line") {
    return {
      seed,
      type: "line",
      x1: start.x,
      y1: start.y,
      x2: current.x,
      y2: current.y,
    };
  }

  if (tool === "circle") {
    const dx = current.x - start.x;
    const dy = current.y - start.y;

    return {
      seed,
      type: "circle",
      cx: start.x,
      cy: start.y,
      radius: Math.sqrt(dx * dx + dy * dy),
    };
  }

  const deltaX = current.x - start.x;
  const deltaY = current.y - start.y;
  const size = Math.max(Math.abs(deltaX), Math.abs(deltaY));

  return {
    seed,
    type: "square",
    x: deltaX >= 0 ? start.x : start.x - size,
    y: deltaY >= 0 ? start.y : start.y - size,
    size,
  };
}

function handlePointerDown(event) {
  const point = getPointerPosition(event);
  state.pointerStart = point;

  if (state.activeTool === "freedraw") {
    state.previewShape = {
      seed: Math.floor(Math.random() * 1000000),
      type: "freedraw",
      points: [point],
    };
  } else {
    state.previewShape = buildShape(state.activeTool, point, point);
  }

  if (typeof canvas.setPointerCapture === "function" && event.pointerId !== undefined) {
    try {
      canvas.setPointerCapture(event.pointerId);
    } catch {
      // Ignore capture failures from synthetic/test pointer streams.
    }
  }

  render();
}

function handlePointerMove(event) {
  if (!state.pointerStart || !state.previewShape) {
    return;
  }

  const point = getPointerPosition(event);

  if (state.activeTool === "freedraw") {
    const points = state.previewShape.points;
    const lastPoint = points[points.length - 1];
    const distance = Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y);

    if (distance >= 2) {
      points.push(point);
    }
  } else {
    const nextShape = buildShape(state.activeTool, state.pointerStart, point);
    nextShape.seed = state.previewShape.seed;
    state.previewShape = nextShape;
  }

  render();
}

function finishPointer(event) {
  if (!state.pointerStart || !state.previewShape) {
    return;
  }

  const point = getPointerPosition(event);

  if (state.activeTool === "freedraw") {
    state.previewShape.points.push(point);
    if (state.previewShape.points.length > 1) {
      state.shapes.push(state.previewShape);
    }
  } else {
    const nextShape = buildShape(state.activeTool, state.pointerStart, point);
    nextShape.seed = state.previewShape.seed;

    const isVisibleShape =
      nextShape.type === "line"
        ? nextShape.x1 !== nextShape.x2 || nextShape.y1 !== nextShape.y2
        : nextShape.type === "circle"
          ? nextShape.radius > 0
          : nextShape.size > 0;

    if (isVisibleShape) {
      state.shapes.push(nextShape);
    }
  }

  state.pointerStart = null;
  state.previewShape = null;
  render();
}

toolButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTool(button.dataset.tool);
  });
});

clearButton.addEventListener("click", () => {
  state.shapes = [];
  state.pointerStart = null;
  state.previewShape = null;
  render();
});

if (shadowToggleButton) {
  shadowToggleButton.addEventListener("click", () => {
    roughSettings.shadowEnabled = !roughSettings.shadowEnabled;
    syncControlValues();
    updateShadowToggleButton();
    presetButtons.forEach((button) => button.classList.remove("is-active"));
    render();
  });
}

optionControls.forEach((control) => {
  control.addEventListener("input", handleOptionChange);
  control.addEventListener("change", handleOptionChange);
});

presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyPreset(button.dataset.preset);
  });
});

canvas.addEventListener("pointerdown", handlePointerDown);
window.addEventListener("pointermove", handlePointerMove);
window.addEventListener("pointerup", finishPointer);
canvas.addEventListener("pointermove", handlePointerMove);
canvas.addEventListener("pointerup", finishPointer);
canvas.addEventListener("pointercancel", finishPointer);

setActiveTool(state.activeTool);
applyPreset("crayon");
updateShadowToggleButton();
render();