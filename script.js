const BIN_CONFIG = {
  '660L': { basePrice: 128.93, includedWeight: 49, excessRate: 2.63 },
  '240L': { basePrice: 34.21, includedWeight: 13, excessRate: 2.63 },
  '120L': { basePrice: 21.05, includedWeight: 8, excessRate: 2.63 }
};

// Global variables
let rawData = [];
let discrepancyData = [];
let filteredData = [];
let searchTerm = '';
let selectedBinSize = 'all';
let selectedSiteName = 'all'; // New filter for Site Name
let selectedWeightFilter = 'all';
let selectedChargeFilter = 'all';
let currentPage = 1;
let entriesPerPage = 'All';
let originalFilename = '';
let summaryStats = {
  totalRows: 0,
  total660L: 0,
  total240LBins: 0,
  total120LBins: 0,
  totalErrors: 0,
  totalOvercharges: 0,
  totalUndercharges: 0,
  totalBinsOverweight: 0,
  totalBinsUnderweight: 0,
  totalChargeExclGST: 0,
  totalWasteKg: 0,    // Sum of Waste Kg values
  totalExcessKg: 0,   // Sum of provided Excess kg values
  totalNetCharge: 0
};

// Format numbers (integers) with thousand separators
function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format currency with two decimals and thousand separators
function formatCurrency(amount) {
  const absAmount = Math.abs(amount);
  const prefix = amount < 0 ? '-$' : '$';
  const formattedAmount = absAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${prefix}${formattedAmount}`;
}

// Format a decimal number with thousand separators and exactly two decimal places
function formatDecimal(number) {
  return Number(number).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Validate a single row (includes customer details, bin validations, and uses Task Site Name)
function validateRow(row) {
  const errors = [];
  
  // Validate Customer Details
  const customerGroup = (row["Customer Group"] || "").trim();
  if (customerGroup !== "Eastern Health") {
    errors.push("Incorrect Customer Group");
  }
  
  const customerName = (row["Customer Name"] || "").trim();
  if (customerName !== "EASTERN HEALTH") {
    errors.push("Incorrect Customer Name");
  }
  
  const customerNo = (row["Customer No."] || "").trim();
  const validCustomerNos = [
    "C-001148", "C-002810", "C-001352", "C-001234", 
    "C-011883", "C-001469", "C-002811", "C-001693", 
    "C-027713", "C-027790"
  ];
  if (!validCustomerNos.includes(customerNo)) {
    errors.push("Incorrect Customer No.");
  }
  
  const customerABN = (row["Customer ABN"] || "").trim();
  if (customerABN !== "68223819017") {
    errors.push("Incorrect Customer ABN");
  }

  // Determine bin type based on Service Description
  const serviceDesc = row["Service Description"] || "";
  let binSize = null;
  if (serviceDesc.includes("660L")) {
    binSize = "660L";
  } else if (serviceDesc.includes("240L")) {
    binSize = "240L";
  } else if (serviceDesc.includes("Collect 120L Clinical Waste Bin")) {
    binSize = "120L";
  } else {
    errors.push("Unknown or missing bin size");
    return { errors };
  }

  const config = BIN_CONFIG[binSize];
  const contractPrice = parseFloat(row["Contract Unit Price"] || 0);
  if (Math.abs(contractPrice - config.basePrice) > 0.01) {
    errors.push("Incorrect contract rate applied");
  }

  const includedWeight = config.includedWeight;
  const actualWeight = parseFloat(row["Waste Kg"] || 0);
  const providedExcessKg = parseFloat(row["Excess kg"] || 0);

  // Flag error if Waste Kg and Excess kg are identical (and nonzero)
  if (actualWeight === providedExcessKg && actualWeight !== 0) {
    errors.push("Waste Kg and Excess kg cannot be identical");
  }

  // Minimum weight check
  if (binSize === "660L" && actualWeight < 49) {
    errors.push("Bin Less than Minimum Kg");
  } else if (binSize === "240L" && actualWeight < 13) {
    errors.push("Bin Less than Minimum Kg");
  } else if (binSize === "120L" && actualWeight < 8) {
    errors.push("Bin Less than Minimum Kg");
  }

  const excessKg = Math.max(0, actualWeight - includedWeight);

  // Check for excessive additional kg
  if (binSize === "660L" && excessKg > 40) {
    errors.push("Excessive Additional Kg");
  } else if (binSize === "240L" && excessKg > 20) {
    errors.push("Excessive Additional Kg");
  } else if (binSize === "120L" && excessKg > 10) {
    errors.push("Excessive Additional Kg");
  }

  if (Math.abs(excessKg - providedExcessKg) > 0.01) {
    errors.push("Incorrect additional kg rate applied");
  }

  const excessRate = config.excessRate;
  const expectedTotalCharge = config.basePrice + excessKg * excessRate;
  const actualCharge = parseFloat(row["Charge excl GST"] || 0);
  let netDifference = 0;
  if (Math.abs(actualCharge - expectedTotalCharge) > 0.01) {
    netDifference = expectedTotalCharge - actualCharge;
    const discrepancyType = actualCharge > expectedTotalCharge ? "Overcharge" : "Undercharge";
    errors.push(`${discrepancyType} - Incorrect total`);
  }

  return {
    errors,
    binSize,
    netDifference,
    expectedTotalCharge
  };
}

// Check if a row matches the selected weight filter
function matchesWeightFilter(row) {
  const binSize = row["Bin Size"];
  const actualWeight = parseFloat(row["Waste Kg"].replace(/,/g, "")) || 0;
  if (selectedWeightFilter === 'all') return true;
  if (binSize === "660L") {
    if (selectedWeightFilter === 'overweight') return actualWeight > 89;
    if (selectedWeightFilter === 'underweight') return actualWeight < 49;
    if (selectedWeightFilter === 'normal') return actualWeight >= 49 && actualWeight <= 89;
  } else if (binSize === "240L") {
    if (selectedWeightFilter === 'overweight') return actualWeight > 33;
    if (selectedWeightFilter === 'underweight') return actualWeight < 13;
    if (selectedWeightFilter === 'normal') return actualWeight >= 13 && actualWeight <= 33;
  } else if (binSize === "120L") {
    if (selectedWeightFilter === 'overweight') return actualWeight > 18;
    if (selectedWeightFilter === 'underweight') return actualWeight < 8;
    if (selectedWeightFilter === 'normal') return actualWeight >= 8 && actualWeight <= 18;
  }
  return true;
}

// Check if a row matches the selected charge filter
function matchesChargeFilter(row) {
  if (selectedChargeFilter === 'all') return true;
  const netDifference = parseFloat(row["Net Over (-$) | Undercharge ($)"].replace(/[^0-9.-]+/g, "")) || 0;
  if (selectedChargeFilter === 'overcharge') return netDifference < 0;
  if (selectedChargeFilter === 'undercharge') return netDifference > 0;
  return true;
}

// Update summary cards in the UI (using formatDecimal for weight values)
function updateSummaryCards() {
  document.getElementById("totalRowsAssessed").textContent = formatNumber(summaryStats.totalRows);
  document.getElementById("total660LBins").textContent = formatNumber(summaryStats.total660L);
  document.getElementById("total240LBins").textContent = formatNumber(summaryStats.total240LBins);
  document.getElementById("total120LBins").textContent = formatNumber(summaryStats.total120LBins);
  document.getElementById("totalErrors").textContent = formatNumber(summaryStats.totalErrors);
  
  // Use formatDecimal for weight totals
  document.getElementById("totalWasteKg").textContent = formatDecimal(summaryStats.totalWasteKg);
  document.getElementById("totalExcessKg").textContent = formatDecimal(summaryStats.totalExcessKg);
  document.getElementById("totalCombinedWasteKg").textContent = formatDecimal(summaryStats.totalWasteKg + summaryStats.totalExcessKg);
  
  // Total Bins is the sum of 660L, 240L, and 120L bins
  const totalBins = summaryStats.total660L + summaryStats.total240LBins + summaryStats.total120LBins;
  document.getElementById("totalBins").textContent = formatNumber(totalBins);
  
  document.getElementById("totalChargeExclGST").textContent = formatCurrency(summaryStats.totalChargeExclGST);
  
  const overchargesElement = document.getElementById("totalOvercharges");
  overchargesElement.textContent = formatCurrency(-summaryStats.totalOvercharges);
  overchargesElement.classList.remove('credit-negative');
  overchargesElement.classList.add('credit-positive');
  
  const underchargesElement = document.getElementById("totalUndercharges");
  underchargesElement.textContent = formatCurrency(summaryStats.totalUndercharges);
  underchargesElement.classList.remove('credit-positive');
  underchargesElement.classList.add('credit-negative');
  
  const netCharge = summaryStats.totalChargeExclGST - summaryStats.totalOvercharges + summaryStats.totalUndercharges;
  const totalNetChargeElement = document.getElementById("totalNetCharge");
  totalNetChargeElement.textContent = formatCurrency(netCharge);
  totalNetChargeElement.classList.remove('credit-positive', 'credit-negative');
  if (netCharge < summaryStats.totalChargeExclGST) {
    totalNetChargeElement.classList.add('credit-positive');
  } else if (netCharge > summaryStats.totalChargeExclGST) {
    totalNetChargeElement.classList.add('credit-negative');
  }
}

// Evaluate the entire sheet and update summaryStats
function evaluateSheet(sheet) {
  const discrepancies = [];
  // Reset summaryStats
  summaryStats = {
    totalRows: sheet.length,
    total660L: 0,
    total240LBins: 0,
    total120LBins: 0,
    totalErrors: 0,
    totalOvercharges: 0,
    totalUndercharges: 0,
    totalBinsOverweight: 0,
    totalBinsUnderweight: 0,
    totalChargeExclGST: 0,
    totalWasteKg: 0,
    totalExcessKg: 0,
    totalNetCharge: 0
  };

  sheet.forEach((row, index) => {
    const serviceDesc = row["Service Description"] || "";
    const wasteKg = parseFloat(row["Waste Kg"] || 0);
    const providedExcessKg = parseFloat(row["Excess kg"] || 0);
    const actualCharge = parseFloat(row["Charge excl GST"] || 0);

    // Accumulate totals for waste and excess weights
    summaryStats.totalWasteKg += wasteKg;
    summaryStats.totalExcessKg += providedExcessKg;
    summaryStats.totalChargeExclGST += actualCharge;

    // Count bins and weight thresholds
    if (serviceDesc.includes("660L")) {
      summaryStats.total660L++;
      if (wasteKg > 89) {
        summaryStats.totalBinsOverweight++;
      } else if (wasteKg < 49) {
        summaryStats.totalBinsUnderweight++;
      }
    } else if (serviceDesc.includes("240L")) {
      summaryStats.total240LBins = summaryStats.total240LBins + 1;
      if (wasteKg > 33) {
        summaryStats.totalBinsOverweight++;
      } else if (wasteKg < 13) {
        summaryStats.totalBinsUnderweight++;
      }
    } else if (serviceDesc.includes("Collect 120L Clinical Waste Bin")) {
      summaryStats.total120LBins = summaryStats.total120LBins + 1;
      if (wasteKg > 18) {
        summaryStats.totalBinsOverweight++;
      } else if (wasteKg < 8) {
        summaryStats.totalBinsUnderweight++;
      }
    }

    // Build discrepancy row and include Site Name (from "Task Site Name")
    const { errors, binSize, netDifference, expectedTotalCharge } = validateRow(row);
    if (errors.length > 0) {
      const nonWeightErrors = errors.filter(
        error => error !== "Bin Less than Minimum Kg" && error !== "Excessive Additional Kg"
      );
      if (nonWeightErrors.length > 0) {
        summaryStats.totalErrors++;
      }
      if (netDifference > 0) {
        summaryStats.totalUndercharges += netDifference;
      } else {
        summaryStats.totalOvercharges += Math.abs(netDifference);
      }
      discrepancies.push({
        Row: index + 2,
        "Bin Size": binSize || "N/A",
        "Service Description": row["Service Description"] || "N/A",
        "Site Name": row["Task Site Name"] ? row["Task Site Name"].trim() : "N/A",
        "Contract Unit Price Charged": formatCurrency(parseFloat(row["Contract Unit Price"]) || 0),
        "Waste Kg": formatNumber(wasteKg),
        "Excess kg": formatNumber(providedExcessKg),
        "Charge excl GST ($)": formatCurrency(actualCharge),
        "Expected Charge ($)": formatCurrency(expectedTotalCharge),
        "Net Over (-$) | Undercharge ($)": formatCurrency(netDifference),
        "Discrepancy": errors.join("; "),
      });
    }
  });
  updateSummaryCards();
  return discrepancies;
}

// Populate the Site Name dropdown with unique values from rawData
function populateSiteNameFilter() {
  const siteNameSet = new Set();
  rawData.forEach(row => {
    if (row["Task Site Name"]) {
      siteNameSet.add(row["Task Site Name"].trim());
    }
  });
  const siteNames = Array.from(siteNameSet).sort();
  const siteNameFilter = document.getElementById("siteNameFilter");
  if (siteNameFilter) {
    siteNameFilter.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "all";
    defaultOption.textContent = "All Sites";
    siteNameFilter.appendChild(defaultOption);
    siteNames.forEach(site => {
      const option = document.createElement("option");
      option.value = site;
      option.textContent = site;
      siteNameFilter.appendChild(option);
    });
  }
}

// Process the uploaded file
function processFile(file) {
  originalFilename = file.name;
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
    rawData = jsonData;
    // Populate Site Name dropdown based on raw data
    populateSiteNameFilter();
    discrepancyData = evaluateSheet(jsonData);
    applyFiltersAndSearch();
  };
  reader.readAsArrayBuffer(file);
}

// Apply filters (including the new Site Name filter) and search
function applyFiltersAndSearch() {
  filteredData = discrepancyData.filter((row) => {
    if (selectedBinSize !== 'all' && row["Bin Size"] !== selectedBinSize) return false;
    if (selectedSiteName !== 'all' && row["Site Name"] !== selectedSiteName) return false;
    if (!matchesWeightFilter(row)) return false;
    if (!matchesChargeFilter(row)) return false;
    if (searchTerm && !Object.values(row).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )) return false;
    return true;
  });
  currentPage = 1;
  updateUI();
  updateRecordCount();
}

// Update record count display
function updateRecordCount() {
  const recordCount = document.getElementById("recordCount");
  const total = filteredData.length;
  if (entriesPerPage === "All") {
    recordCount.textContent = `Showing all ${formatNumber(total)} entries`;
  } else {
    const start = (currentPage - 1) * entriesPerPage + 1;
    const end = Math.min(currentPage * entriesPerPage, total);
    recordCount.textContent = `Showing ${formatNumber(start)} to ${formatNumber(end)} of ${formatNumber(total)} entries`;
  }
}

// Update the UI: show/hide table and no-results message
function updateUI() {
  const resultsTable = document.getElementById("resultsTable");
  const noResultsMessage = document.getElementById("noResultsMessage");
  const tableControls = document.getElementById("tableControls");
  const hasBaseData = discrepancyData.length > 0;
  const hasFilteredData = filteredData.length > 0;
  if (tableControls) {
    if (hasBaseData) {
      tableControls.classList.remove("hidden");
    } else {
      tableControls.classList.add("hidden");
    }
  }
  if (!hasFilteredData) {
    if (resultsTable) resultsTable.classList.add("hidden");
    if (noResultsMessage) {
      noResultsMessage.classList.remove("hidden");
      if (hasBaseData && (searchTerm || selectedBinSize !== 'all' || selectedSiteName !== 'all' || selectedWeightFilter !== 'all' || selectedChargeFilter !== 'all')) {
        noResultsMessage.innerHTML = `
          <p>No results found for your search.</p>
          <button id="clearFilters" class="button primary">Clear All Filters</button>
        `;
        const clearFiltersButton = document.getElementById("clearFilters");
        if (clearFiltersButton) {
          const newButton = clearFiltersButton.cloneNode(true);
          clearFiltersButton.parentNode.replaceChild(newButton, clearFiltersButton);
          newButton.addEventListener("click", () => {
            document.getElementById("searchInput").value = "";
            document.getElementById("binSizeFilter").value = "all";
            document.getElementById("siteNameFilter").value = "all";
            document.getElementById("weightFilter").value = "all";
            document.getElementById("chargeFilter").value = "all";
            searchTerm = "";
            selectedBinSize = "all";
            selectedSiteName = "all";
            selectedWeightFilter = "all";
            selectedChargeFilter = "all";
            applyFiltersAndSearch();
          });
        }
      } else {
        noResultsMessage.innerHTML = `
          <img src="https://i.imgur.com/0OUg0tX.png" alt="Success" class="success-image">
          <p>No discrepancies found!</p>
        `;
      }
    }
  } else {
    if (resultsTable) resultsTable.classList.remove("hidden");
    if (noResultsMessage) noResultsMessage.classList.add("hidden");
    updateTable();
  }
}

// Update the results table using a fixed column order
function updateTable() {
  const tableBody = document.querySelector("#results tbody");
  const totalsRow = document.querySelector("#totalsRow");
  tableBody.innerHTML = "";
  
  // Fixed column order as per your requirement.
  const columns = [
    "Row",
    "Site Name",
    "Bin Size",
    "Service Description",
    "Contract Unit Price Charged",
    "Waste Kg",
    "Excess kg",
    "Charge excl GST ($)",
    "Expected Charge ($)",
    "Net Over (-$) | Undercharge ($)",
    "Discrepancy"
  ];
  
  // Create table rows for the current page data.
  const pageData = getPageData();
  pageData.forEach((row) => {
    const tr = document.createElement("tr");
    columns.forEach(col => {
      const td = document.createElement("td");
      td.textContent = row[col] || "N/A";
      // Center-align cells in the "Net Over (-$) | Undercharge ($)" column.
      if (col === "Net Over (-$) | Undercharge ($)") {
        td.style.textAlign = "center";
      }
      // Left-align the Discrepancy column (if needed).
      if (col === "Discrepancy") {
        td.style.textAlign = "left";
      }
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
  
  // Compute totals over all filtered rows (not just the current page).
  let totalWaste = 0;
  let totalExcess = 0;
  let totalCharge = 0;
  let totalExpected = 0;
  let totalNet = 0;
  
  filteredData.forEach(row => {
    totalWaste += parseFloat(row["Waste Kg"].replace(/,/g, "")) || 0;
    totalExcess += parseFloat(row["Excess kg"].replace(/,/g, "")) || 0;
    totalCharge += parseFloat(row["Charge excl GST ($)"].replace(/[^0-9.-]+/g, "")) || 0;
    totalExpected += parseFloat(row["Expected Charge ($)"].replace(/[^0-9.-]+/g, "")) || 0;
    totalNet += parseFloat(row["Net Over (-$) | Undercharge ($)"].replace(/[^0-9.-]+/g, "")) || 0;
  });
  
  // Build the totals row.
  // First cell spans columns 1 to 5; then one cell per total value; final cell for Discrepancy is blank.
  totalsRow.innerHTML = `
    <td colspan="5"><strong>Totals</strong></td>
    <td>${formatDecimal(totalWaste)}</td>
    <td>${formatDecimal(totalExcess)}</td>
    <td>${formatCurrency(totalCharge)}</td>
    <td>${formatCurrency(totalExpected)}</td>
    <td>${formatCurrency(totalNet)}</td>
    <td></td>
  `;
  
  updatePagination();
}

// Paginate table data
function getPageData() {
  if (entriesPerPage === "All") return filteredData;
  const start = (currentPage - 1) * entriesPerPage;
  return filteredData.slice(start, start + entriesPerPage);
}

// Update pagination controls
function updatePagination() {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;
  pagination.innerHTML = "";
  if (entriesPerPage === "All") return;
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    currentPage--;
    updateTable();
    updateRecordCount();
  });
  pagination.appendChild(prevButton);
  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    currentPage++;
    updateTable();
    updateRecordCount();
  });
  pagination.appendChild(nextButton);
}

// Setup event listeners with defensive checks
function setupEventListeners() {
  const binSizeFilterEl = document.getElementById("binSizeFilter");
  if (binSizeFilterEl) {
    binSizeFilterEl.addEventListener("change", (e) => {
      selectedBinSize = e.target.value;
      applyFiltersAndSearch();
    });
  } else {
    console.warn("Element with id 'binSizeFilter' not found.");
  }

  const siteNameFilterEl = document.getElementById("siteNameFilter");
  if (siteNameFilterEl) {
    siteNameFilterEl.addEventListener("change", (e) => {
      selectedSiteName = e.target.value;
      applyFiltersAndSearch();
    });
  } else {
    console.warn("Element with id 'siteNameFilter' not found.");
  }

  const weightFilterEl = document.getElementById("weightFilter");
  if (weightFilterEl) {
    weightFilterEl.addEventListener("change", (e) => {
      selectedWeightFilter = e.target.value;
      applyFiltersAndSearch();
    });
  } else {
    console.warn("Element with id 'weightFilter' not found.");
  }

  const chargeFilterEl = document.getElementById("chargeFilter");
  if (chargeFilterEl) {
    chargeFilterEl.addEventListener("change", (e) => {
      selectedChargeFilter = e.target.value;
      applyFiltersAndSearch();
    });
  } else {
    console.warn("Element with id 'chargeFilter' not found.");
  }

  const searchInputEl = document.getElementById("searchInput");
  if (searchInputEl) {
    searchInputEl.addEventListener("input", (e) => {
      searchTerm = e.target.value.toLowerCase();
      applyFiltersAndSearch();
    });
  } else {
    console.warn("Element with id 'searchInput' not found.");
  }

  const resetFiltersEl = document.getElementById("resetFilters");
  if (resetFiltersEl) {
    resetFiltersEl.addEventListener("click", () => {
      const inputs = ["searchInput", "binSizeFilter", "siteNameFilter", "weightFilter", "chargeFilter"];
      inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "all"; // for dropdowns, "all"; for searchInput, set to ""
      });
      document.getElementById("searchInput").value = "";
      searchTerm = "";
      selectedBinSize = "all";
      selectedSiteName = "all";
      selectedWeightFilter = "all";
      selectedChargeFilter = "all";
      applyFiltersAndSearch();
    });
  } else {
    console.warn("Element with id 'resetFilters' not found.");
  }

  const spreadsheetEl = document.getElementById("spreadsheet");
  if (spreadsheetEl) {
    spreadsheetEl.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) processFile(file);
    });
  } else {
    console.warn("Element with id 'spreadsheet' not found.");
  }

  const downloadButton = document.getElementById("downloadResults");
  if (downloadButton) {
    const newDownloadButton = downloadButton.cloneNode(true);
    downloadButton.parentNode.replaceChild(newDownloadButton, downloadButton);
    newDownloadButton.addEventListener("click", () => {
      if (filteredData.length === 0) {
        alert("No data to export.");
        return;
      }
      try {
        const timestamp = new Date().toISOString().split('T')[0];
        const originalNameWithoutExt = originalFilename.replace(/\.[^/.]+$/, "");
        const exportFilename = `${originalNameWithoutExt}_Discrepancy_Report_${timestamp}.xlsx`;
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Discrepancies");
        XLSX.writeFile(workbook, exportFilename);
      } catch (error) {
        console.error('Export error:', error);
        alert('There was an error during export. Please try again.');
      }
    });
  } else {
    console.warn("Element with id 'downloadResults' not found.");
  }

  const entriesPerPageEl = document.getElementById("entriesPerPage");
  if (entriesPerPageEl) {
    entriesPerPageEl.addEventListener("change", (e) => {
      entriesPerPage = e.target.value === "All" ? "All" : parseInt(e.target.value);
      currentPage = 1;
      updateTable();
      updateRecordCount();
    });
  } else {
    console.warn("Element with id 'entriesPerPage' not found.");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  const entriesEl = document.getElementById("entriesPerPage");
  if (entriesEl) {
    entriesEl.value = "All";
  }
});

