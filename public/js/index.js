async function fetchCategoryEmissions() {
  const res = await fetch(
    "http://localhost:8000/api/categoryEmissions/category-segments"
  );
  const json = await res.json();
  return json.data;
}

function formatNumber(n) {
  return new Intl.NumberFormat().format(n);
}

function groupEmissionsByCategory(data) {
  const grouped = {};
  data.forEach((entry) => {
    const category = entry.category_name;
    const value = entry.category_segment_value * entry.emission_factor;
    grouped[category] = (grouped[category] || 0) + value;
  });
  return grouped;
}

function groupEmissionsByYearAndCategory(data) {
  const years = [...new Set(data.map((d) => d.year))].sort();
  const categories = [...new Set(data.map((d) => d.category_name))];
  const map = {};
  categories.forEach((cat) => (map[cat] = Array(years.length).fill(0)));
  data.forEach((entry) => {
    const yearIndex = years.indexOf(entry.year);
    const value = entry.category_segment_value * entry.emission_factor;
    map[entry.category_name][yearIndex] += value;
  });
  return {
    years,
    datasets: Object.entries(map).map(([label, data], i) => ({
      label,
      data: data.map((d) => +(d / 1000).toFixed(2)), // convert to tCO₂e
      backgroundColor: ["#C97D87", "#B591E1", "#7986CB", "#A5C8DB"][i % 4],
    })),
  };
}

async function renderCharts() {
  const data = await fetchCategoryEmissions();

  // ✅ Total Scope 3 Emissions
  const total = data.reduce((sum, d) => {
    const emissions = d.category_segment_value * d.emission_factor;
    return sum + emissions;
  }, 0);
  const totalTCO2e = (total / 1000).toFixed(0); // kg to tCO₂e
  document.getElementById("totalEmissions").innerHTML =
    formatNumber(totalTCO2e) + ' <small class="text-muted">tCO₂e</small>';

  // ✅ Emissions by Category
  const byCat = groupEmissionsByCategory(data);
  const catLabels = Object.keys(byCat);
  const catData = Object.values(byCat).map((v) => +(v / 1000).toFixed(2)); // convert to tCO₂e

  new Chart(document.getElementById("emissionsByCategoryChart"), {
    type: "bar",
    data: {
      labels: catLabels,
      datasets: [
        {
          data: catData,
          backgroundColor: ["#C97D87", "#B591E1", "#7986CB", "#A5C8DB"],
        },
      ],
    },
    options: {
      indexAxis: "y",
      plugins: { legend: { display: false } },
      scales: {
        x: {
          title: {
            display: true,
            text: "Emissions (tCO₂e)",
          },
        },
      },
    },
  });

  // ✅ Emissions by Type (stacked by category)
  const { years, datasets } = groupEmissionsByYearAndCategory(data);
  new Chart(document.getElementById("emissionsByTypeChart"), {
    type: "bar",
    data: {
      labels: years,
      datasets,
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: { mode: "index", intersect: false },
        legend: { position: "top" },
      },
      scales: {
        x: { stacked: true },
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

  // ✅ Path to Net Zero (Dynamic: sum emissions by year)
  const yearlySums = {};
  data.forEach((d) => {
    const year = d.year;
    const emissions = d.category_segment_value * d.emission_factor;
    yearlySums[year] = (yearlySums[year] || 0) + emissions;
  });

  const netZeroLabels = Object.keys(yearlySums).sort();
  const netZeroValues = netZeroLabels.map(
    (year) => +(yearlySums[year] / 1000).toFixed(2)
  );

  new Chart(document.getElementById("netZeroChart"), {
    type: "line",
    data: {
      labels: netZeroLabels,
      datasets: [
        {
          label: "Emissions (tCO₂e)",
          data: netZeroValues,
          borderColor: "#E57373",
          fill: false,
          tension: 0.3,
          pointBackgroundColor: "#E57373",
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "tCO₂e",
          },
        },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", renderCharts);
