document.addEventListener("DOMContentLoaded", function () {
  const supplierSelect = document.querySelectorAll(".filter-dropdown")[0];
  const countrySelect = document.querySelectorAll(".filter-dropdown")[1];
  const categorySelect = document.querySelectorAll(".filter-dropdown")[2];
  const refreshBtn = document
    .querySelector(".btn-light i.fa-refresh")
    .closest("button");

  // Helper to populate dropdown with unique values
  function populateDropdown(select, values, placeholder) {
    select.innerHTML = `<option value="">${placeholder}</option>`;
    [...new Set(values)].sort().forEach((val) => {
      const option = document.createElement("option");
      option.value = val;
      option.textContent = val;
      select.appendChild(option);
    });
  }

  // Scan table and extract unique values
  const supplierList = [];
  const countryList = [];
  const categoryList = [];

  document.querySelectorAll("tbody tr").forEach((row) => {
    const supplier = row.querySelector(".supplier-name")?.textContent.trim();
    const country = row.querySelector(".country")?.textContent.trim();
    const category = row.querySelector(".category")?.textContent.trim();

    if (supplier) supplierList.push(supplier);
    if (country) countryList.push(country);
    if (category) categoryList.push(category);
  });

  // Populate all dropdowns
  populateDropdown(supplierSelect, supplierList, "Supplier");
  populateDropdown(countrySelect, countryList, "Country");
  populateDropdown(categorySelect, categoryList, "Category");

  // Filtering logic
  function filterTable() {
    const selectedSupplier = supplierSelect.value.toLowerCase();
    const selectedCountry = countrySelect.value.toLowerCase();
    const selectedCategory = categorySelect.value.toLowerCase();

    document.querySelectorAll("tbody tr").forEach((row) => {
      const supplier =
        row.querySelector(".supplier-name")?.textContent.toLowerCase() || "";
      const country =
        row.querySelector(".country")?.textContent.toLowerCase() || "";
      const category =
        row.querySelector(".category")?.textContent.toLowerCase() || "";

      const matchSupplier = !selectedSupplier || supplier === selectedSupplier;
      const matchCountry = !selectedCountry || country === selectedCountry;
      const matchCategory = !selectedCategory || category === selectedCategory;

      row.style.display =
        matchSupplier && matchCountry && matchCategory ? "" : "none";
    });
  }

  // Attach filter listeners
  supplierSelect.addEventListener("change", filterTable);
  countrySelect.addEventListener("change", filterTable);
  categorySelect.addEventListener("change", filterTable);

  // Reset filters
  refreshBtn.addEventListener("click", () => {
    supplierSelect.selectedIndex = 0;
    countrySelect.selectedIndex = 0;
    categorySelect.selectedIndex = 0;
    filterTable();
  });
});

// Filter by status badge with visual toggle
const statusButtons = document.querySelectorAll(".filter-buttons button");

statusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const text = button.textContent.trim().toLowerCase();

    // Toggle button classes
    statusButtons.forEach((btn) => {
      btn.classList.remove("btn-dark");
      btn.classList.add("btn-secondary");
    });
    button.classList.remove("btn-secondary");
    button.classList.add("btn-dark");

    // Filter logic
    document.querySelectorAll("tbody tr").forEach((row) => {
      const badgeText =
        row
          .querySelector("td:last-child span")
          ?.textContent.trim()
          .toLowerCase() || "";

      if (text === "all") {
        row.style.display = "";
      } else if (text === "valid" && badgeText === "success") {
        row.style.display = "";
      } else if (text === "invalid" && badgeText === "error") {
        row.style.display = "";
      } else if (
        text === "not yet calculated" &&
        badgeText === "not calculated"
      ) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });

    // Reset dropdowns on status click
    supplierSelect.selectedIndex = 0;
    countrySelect.selectedIndex = 0;
    categorySelect.selectedIndex = 0;
  });
});
const searchInput = document.getElementById("globalSearch");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  document.querySelectorAll("tbody tr").forEach((row) => {
    const cells = row.querySelectorAll("td");
    const rowMatches = Array.from(cells).some((cell) => {
      return cell.textContent.trim().toLowerCase() === query;
    });

    row.style.display = query === "" || rowMatches ? "" : "none";
  });

  // Reset dropdowns and status buttons
  supplierSelect.selectedIndex = 0;
  countrySelect.selectedIndex = 0;
  categorySelect.selectedIndex = 0;

  statusButtons.forEach((btn, idx) => {
    if (idx === 0) {
      btn.classList.add("btn-dark");
      btn.classList.remove("btn-secondary");
    } else {
      btn.classList.add("btn-secondary");
      btn.classList.remove("btn-dark");
    }
  });
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  document.querySelectorAll("tbody tr").forEach((row) => {
    const cells = row.querySelectorAll("td");
    const rowMatches = Array.from(cells).some((cell) => {
      return cell.textContent.toLowerCase().includes(query);
    });

    row.style.display = query === "" || rowMatches ? "" : "none";
  });

  // Reset dropdowns and status buttons
  supplierSelect.selectedIndex = 0;
  countrySelect.selectedIndex = 0;
  categorySelect.selectedIndex = 0;

  statusButtons.forEach((btn, idx) => {
    if (idx === 0) {
      btn.classList.add("btn-dark");
      btn.classList.remove("btn-secondary");
    } else {
      btn.classList.add("btn-secondary");
      btn.classList.remove("btn-dark");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");

  selectAllCheckbox.addEventListener("change", function () {
    const allRowCheckboxes = document.querySelectorAll(
      "tbody input[type='checkbox']"
    );
    allRowCheckboxes.forEach((cb) => {
      cb.checked = selectAllCheckbox.checked;
    });
  });
});

document.querySelector(".download-btn").addEventListener("click", function () {
  const rows = Array.from(document.querySelectorAll("tbody tr"));
  const selectedRows = rows.filter(
    (row) => row.querySelector("input[type='checkbox']").checked
  );
  const rowsToDownload =
    selectedRows.length > 0
      ? selectedRows
      : rows.filter((r) => r.style.display !== "none");

  // Extract headers
  const headers = Array.from(document.querySelectorAll("thead th"))
    .slice(1) // skip the checkbox column
    .map((th) => th.textContent.trim());

  // Extract data
  const data = rowsToDownload.map((row) => {
    return Array.from(row.querySelectorAll("td"))
      .slice(1) // skip the checkbox column
      .map((td) => td.textContent.trim());
  });

  // Convert to CSV
  const csvContent = [headers.join(","), ...data.map((r) => r.join(","))].join(
    "\n"
  );

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "emissions_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
