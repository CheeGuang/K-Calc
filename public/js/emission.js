let rawData = [];

const hardcodedInsights = {
  "Category 1": [
    {
      icon: "fas fa-database",
      text: "3 out of 5 key suppliers now provide primary emission data, improving accuracy by 12%",
    },
    {
      icon: "fas fa-chart-line",
      text: "Scope 3 Cat 1 emissions totalled 1,245 tCO₂e in June 2025, a 5% increase from May due to higher raw material purchases.",
    },
    {
      icon: "fas fa-balance-scale",
      text: "Average emissions intensity across suppliers: 2.8 kgCO₂e per $1 spent. Highest: 7.2, Lowest: 1.1 kgCO₂e/$1",
    },
  ],
  "Category 4": [
    {
      icon: "fas fa-ship",
      text: "Upstream logistics emissions are strongly influenced by seasonal shipping volumes and the types of logistics providers used.",
    },
    {
      icon: "fas fa-sync-alt",
      text: "Primary data for all shipping providers is currently being collected to replace previously used estimated emission factors.",
    },
    {
      icon: "fas fa-route",
      text: "Consider route optimisation technology to significantly reduce upstream logistics-related emissions during peak periods.",
    },
  ],
  "Category 6": [
    {
      icon: "fas fa-plane",
      text: "Business travel-related emissions vary significantly based on international versus domestic air travel proportion across teams.",
    },
    {
      icon: "fas fa-file-alt",
      text: "Employee travel policies are now being reviewed for better alignment with internal sustainability and budgeting goals.",
    },
    {
      icon: "fas fa-video",
      text: "Encouraging more virtual meetings and local alternatives could help reduce long-haul emissions for business purposes.",
    },
  ],
  "Category 7": [
    {
      icon: "fas fa-car",
      text: "EV commuting has a significantly lower carbon impact than traditional bus commuting. Consider incentivising EV usage policies.",
    },
    {
      icon: "fas fa-chart-pie",
      text: "Survey data shows a 15% increase in EV commuting among all employees since early 2023, especially in urban locations.",
    },
    {
      icon: "fas fa-charging-station",
      text: "Parking and charging incentives are currently being considered for electric vehicle owners at the main office premises.",
    },
  ],
};

const hardcodedVendors = {
  "Category 1": [
    { name: "Shipping Genius", emissions: "45 tCO₂e", spend: "$127k" },
    { name: "Stevedore Master", emissions: "26 tCO₂e", spend: "$89k" },
    { name: "Shipping Minions", emissions: "18 tCO₂e", spend: "$51k" },
  ],
};

async function fetchData() {
  const res = await fetch(
    "http://localhost:8000/api/categoryEmissions/category-emissions"
  );
  const json = await res.json();
  rawData = json.data;

  populateDropdown();
}

function populateDropdown() {
  const dropdown = document.getElementById("categoryDropdown");
  const categories = [...new Set(rawData.map((d) => d.categoryNumber))];
  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    dropdown.appendChild(opt);
  });

  dropdown.addEventListener("change", () => renderDashboard(dropdown.value));

  // ✅ Additional listener to check for 'category' query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFromUrl = urlParams.get("category");

  if (categoryFromUrl && categories.includes(categoryFromUrl)) {
    dropdown.value = categoryFromUrl;
    renderDashboard(categoryFromUrl);
  } else {
    dropdown.value = "Category 1";
    renderDashboard("Category 1");
  }
}

function renderDashboard(categoryNum) {
  document.getElementById(
    "emissionTitle"
  ).textContent = `${categoryNum} Emissions`;

  const filtered = rawData.filter((d) => d.categoryNumber === categoryNum);

  const grouped = {};
  const costByActivity = {};
  let totalEmissions = 0;

  filtered.forEach((d) => {
    const value = (d.value * d.emission_factor) / 1000;

    // Emissions by Segment
    if (!grouped[d.category_segment]) grouped[d.category_segment] = {};
    grouped[d.category_segment][d.year] = value;

    // Sum Total
    totalEmissions += value;

    // Group cost by activity
    if (!costByActivity[d.activity]) costByActivity[d.activity] = 0;
    costByActivity[d.activity] += d.value; // Assume value = cost in SGD
  });

  const years = [...new Set(filtered.map((d) => d.year))].sort();
  const segments = [...new Set(filtered.map((d) => d.category_segment))];

  const segmentData = {};

  // Initialise segmentData
  segments.forEach((seg) => {
    segmentData[seg] = {};
    years.forEach((year) => {
      segmentData[seg][year] = 0;
    });
  });

  // Fill segmentData
  filtered.forEach((d) => {
    const emissions = (d.value * d.emission_factor) / 1000; // kg to t
    segmentData[d.category_segment][d.year] += emissions;
  });

  // Prepare datasets
  const datasets = segments.map((segment) => {
    return {
      label: segment,
      data: years.map((year) => segmentData[segment][year]),
      backgroundColor: getSegmentColor(segment),
      stack: "segments",
    };
  });

  renderChart(years, datasets);

  updateTotalEmissions(totalEmissions);
  updateInsights(categoryNum);
  updateVendors(categoryNum);
  renderSegmentValueChart(categoryNum);
}

function renderChart(labels, datasets) {
  const canvas = document.getElementById("segmentChart");
  const ctx = canvas.getContext("2d");

  if (window.segmentChart instanceof Chart) {
    window.segmentChart.destroy();
  }

  window.segmentChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: datasets.map((ds) => ({
        ...ds,
        maxBarThickness: 40, // ✅ Make bars thinner
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: { mode: "index", intersect: false },
        legend: { position: "bottom" },
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: "Year",
          },
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: "Emissions (tCO₂e)",
          },
        },
      },
    },
  });
}

function updateTotalEmissions(total) {
  const element = document.getElementById("totalCategoryEmissions");
  if (element) {
    element.innerHTML = `${total.toFixed(
      1
    )} <small class="text-muted">tCO₂e</small>`;
  }
}

function updateInsights(categoryNum) {
  const list = document.getElementById("insightsList");
  list.innerHTML = "";
  const insights = hardcodedInsights[categoryNum] || [
    {
      icon: "fas fa-spinner",
      text: "Data is being collected and normalised for this category.",
    },
  ];

  insights.forEach((item) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex align-items-center gap-3 text-start border-0 px-2 py-3";

    li.innerHTML = `
      <i class="${item.icon} mx-2" style="font-size: 1.5rem; color: black;"></i>
      <span style="font-size: 1.05rem;">${item.text}</span>
    `;
    list.appendChild(li);
  });
}

function updateVendors(categoryNum) {
  const table = document.getElementById("vendorTable");
  table.innerHTML = "";
  const vendors = hardcodedVendors[categoryNum] || [];
  vendors.forEach((v) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${v.name}</td><td>${v.emissions}</td><td>${v.spend}</td>`;
    table.appendChild(row);
  });
}

async function renderSegmentValueChart(categoryNum) {
  const res = await fetch(
    "http://localhost:8000/api/categoryEmissions/category-segments"
  );
  const json = await res.json();
  const data = json.data;

  const filtered = data.filter(
    (d) => d.category_categoryNumber === categoryNum
  );

  const segmentValues = {};
  let unitLabel = "";

  filtered.forEach((d) => {
    const segment = d.category_segment;
    const value = d.category_segment_value;
    const formula = d.formula.toLowerCase();

    if (!segmentValues[segment]) segmentValues[segment] = 0;
    segmentValues[segment] += value;

    // Set the y-axis unit only once
    if (!unitLabel) {
      if (formula.includes("cost")) {
        unitLabel = `Cost (${d.category_segment_unit})`;
      } else if (formula.includes("distance")) {
        unitLabel = `Distance (${d.category_segment_unit})`;
      } else {
        unitLabel = `Value (${d.category_segment_unit})`;
      }
    }
  });

  renderCostChartBySegment(segmentValues, unitLabel);
}

function renderCostChartBySegment(values, unitLabel) {
  const canvas = document.getElementById("costChart");
  const ctx = canvas.getContext("2d");

  if (window.costChart instanceof Chart) {
    window.costChart.destroy();
  }

  const labels = Object.keys(values);
  const dataValues = labels.map((key) => values[key]);
  const backgroundColors = labels.map((segment) => getSegmentColor(segment));

  window.costChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: unitLabel,
          data: dataValues,
          backgroundColor: backgroundColors, // ✅ dynamic colour per segment
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: { mode: "index", intersect: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: unitLabel },
        },
        x: {
          title: { display: true, text: "Segment" },
          ticks: {
            callback: function (value, index, ticks) {
              const label = this.getLabelForValue(value);
              const words = label.split(" ");
              let lines = [];
              for (let i = 0; i < words.length; i += 4) {
                lines.push(words.slice(i, i + 4).join(" "));
              }
              return lines;
            },
            maxRotation: 0,
            minRotation: 0,
            autoSkip: false,
          },
        },
      },
    },
  });
}

const segmentColorMap = {};
const colorPalette = [
  "#7986CB",
  "#B388EB",
  "#AED581",
  "#FFAB91",
  "#A9D6E5",
  "#FFCC80",
  "#81D4FA",
  "#CE93D8",
  "#E6EE9C",
  "#90CAF9",
  "#F48FB1",
  "#80CBC4",
  "#DCE775",
  "#B0BEC5",
  "#F06292",
];
let colorIndex = 0;

function getSegmentColor(segment) {
  if (!segmentColorMap[segment]) {
    segmentColorMap[segment] = colorPalette[colorIndex % colorPalette.length];
    colorIndex++;
  }
  return segmentColorMap[segment];
}

document.addEventListener("DOMContentLoaded", fetchData);
