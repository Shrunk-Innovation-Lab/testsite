const BIN_CONFIG = {
  '660L': { basePrice: 128.93, includedWeight: 49, excessRate: 2.63 },
  '240L': { basePrice: 34.21, includedWeight: 13, excessRate: 2.63 },
  '120L': { basePrice: 21.05, includedWeight: 8, excessRate: 2.63 }
};

// Global variables
let rawData = [];
let processedData = []; // All rows processed from the spreadsheet.
let filteredData = [];  // Subset of processedData after filtering.
let searchTerm = '';
let selectedBinSize = 'all';
let selectedSiteName = 'all';
let selectedWeightFilter = 'all';
let selectedChargeFilter = 'all';
let currentPage = 1;
let entriesPerPage = 'All';
let originalFilename = '';
let summaryStats = {
  totalRows: 0,
  totalErrors: 0,
  total660L: 0,
  total240LBins: 0,
  total120LBins: 0,
  totalBinsOverweight: 0,
  totalBinsUnderweight: 0,
  totalChargeExclGST: 0,
  totalWasteKg: 0,
  totalExcessKgCorrected: 0,  // Corrected value (excludes rows with "Waste Kg and Excess kg cannot be identical")
  totalExcessKgRaw: 0,        // Raw value from the invoice "Excess kg" column
  totalOvercharges: 0,
  totalUndercharges: 0,
  totalNetCharge: 0
};

/* Helper Functions */
function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function formatCurrency(amount) {
  const absAmount = Math.abs(amount);
  const prefix = amount < 0 ? '-$' : '$';
  const formattedAmount = absAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${prefix}${formattedAmount}`;
}
function formatDecimal(number) {
  return Number(number).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/* Data Validation */
// Expected charge is computed using ONLY the provided Excess kg value.
// If Waste Kg and Excess kg are identical (and nonzero), an error is flagged and the net difference
// is computed as (Charge excl GST - base price) multiplied by -1.
function validateRow(row) {
  const errors = [];
  
  // Validate Customer Details.
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
  
  // Determine bin type based on Service Description.
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
  
  // Parse weight values.
  const actualWeight = parseFloat(row["Waste Kg"] || 0);
  const providedExcessKg = parseFloat(row["Excess kg"] || 0);
  
  // Calculate expected total charge using providedExcessKg only.
  const expectedTotalCharge = config.basePrice + (providedExcessKg * config.excessRate);
  
  // Flag if Waste Kg and Excess kg are identical (and nonzero).
  let netDifference = 0;
  if (actualWeight === providedExcessKg && actualWeight !== 0) {
    errors.push("Waste Kg and Excess kg cannot be identical");
    // Calculate netDifference as: (Charge excl GST - base price) then make negative.
    netDifference = -(parseFloat(row["Charge excl GST"] || 0) - config.basePrice);
  } else {
    // Check if Waste Kg is less than included weight.
    if (actualWeight < config.includedWeight) {
      errors.push("Bin Less than Minimum Kg");
    }
    // Flag error if Waste Kg is less than included weight but Excess kg is nonzero.
    if (actualWeight < config.includedWeight && providedExcessKg > 0) {
      errors.push("Excess kg should be zero when Waste Kg is less than included weight");
    }
    // Normal net difference calculation.
    if (Math.abs(parseFloat(row["Charge excl GST"] || 0) - expectedTotalCharge) > 0.01) {
      netDifference = expectedTotalCharge - parseFloat(row["Charge excl GST"] || 0);
      const discrepancyType = parseFloat(row["Charge excl GST"] || 0) > expectedTotalCharge ? "Overcharge" : "Undercharge";
      errors.push(`${discrepancyType} - Incorrect total`);
    }
  }
  
  return {
    errors,
    binSize,
    netDifference,
    expectedTotalCharge
  };
}

/* Filter Matching Functions */
function matchesWeightFilter(row) {
  const binSize = row["Bin Size"];
  const waste = row["rawWasteKg"] || 0;
  const excess = row["rawExcessKg"] || 0;
  const totalDelivered = waste + excess;
  
  if (selectedWeightFilter === 'all') return true;
  if (binSize === "660L") {
    if (selectedWeightFilter === 'overweight') return totalDelivered > 89;
    if (selectedWeightFilter === 'underweight') return totalDelivered < 49;
    if (selectedWeightFilter === 'normal') return totalDelivered >= 49 && totalDelivered <= 89;
  } else if (binSize === "240L") {
    if (selectedWeightFilter === 'overweight') return totalDelivered > 33;
    if (selectedWeightFilter === 'underweight') return totalDelivered < 13;
    if (selectedWeightFilter === 'normal') return totalDelivered >= 13 && totalDelivered <= 33;
  } else if (binSize === "120L") {
    if (selectedWeightFilter === 'overweight') return totalDelivered > 18;
    if (selectedWeightFilter === 'underweight') return totalDelivered < 8;
    if (selectedWeightFilter === 'normal') return totalDelivered >= 8 && totalDelivered <= 18;
  }
  return true;
}

function matchesChargeFilter(row) {
  if (selectedChargeFilter === 'all') return true;
  const netDifference = row["rawNet"] || 0;
  if (selectedChargeFilter === 'overcharge') return netDifference < 0;
  if (selectedChargeFilter === 'undercharge') return netDifference > 0;
  return true;
}

/* Recalculate Summary Statistics from Filtered Data */
function recalcFilteredSummaryStats() {
  let stats = {
    totalRows: filteredData.length,
    totalErrors: 0,
    total660L: 0,
    total240LBins: 0,
    total120LBins: 0,
    totalBinsOverweight: 0,
    totalBinsUnderweight: 0,
    totalWasteKg: 0,
    totalExcessKgCorrected: 0, // Corrected value: excludes rows with "Waste Kg and Excess kg cannot be identical"
    totalExcessKgRaw: 0,       // Raw value from the invoice's "Excess kg" column
    totalChargeExclGST: 0,
    totalOvercharges: 0,
    totalUndercharges: 0,
    totalCorrect: 0  // Count of correct rows
  };
  
  filteredData.forEach(row => {
    if (row["Discrepancy"] && row["Discrepancy"].trim() !== "") {
      stats.totalErrors++;
    } else {
      stats.totalCorrect++;
    }
    if (row["Bin Size"] === "660L") stats.total660L++;
    else if (row["Bin Size"] === "240L") stats.total240LBins++;
    else if (row["Bin Size"] === "120L") stats.total120LBins++;
    
    let waste = row["rawWasteKg"] || 0;
    // Raw excess as given on the invoice.
    let rawExcess = row["rawExcessKg"] || 0;
    // Corrected excess: if the discrepancy error is present (case-insensitive), then use 0.
    let correctedExcess = rawExcess;
    if (row["Discrepancy"] && row["Discrepancy"].toLowerCase().includes("waste kg and excess kg cannot be identical")) {
      correctedExcess = 0;
    }
    let charge = row["rawCharge"] || 0;
    stats.totalWasteKg += waste;
    stats.totalExcessKgRaw += rawExcess;
    stats.totalExcessKgCorrected += correctedExcess;
    stats.totalChargeExclGST += charge;
    
    const totalDelivered = waste + rawExcess; // Use raw value for bin calculation.
    if (row["Bin Size"] === "660L") {
      if (totalDelivered < 49) stats.totalBinsUnderweight++;
      else if (totalDelivered > 89) stats.totalBinsOverweight++;
    } else if (row["Bin Size"] === "240L") {
      if (totalDelivered < 13) stats.totalBinsUnderweight++;
      else if (totalDelivered > 33) stats.totalBinsOverweight++;
    } else if (row["Bin Size"] === "120L") {
      if (totalDelivered < 8) stats.totalBinsUnderweight++;
      else if (totalDelivered > 18) stats.totalBinsOverweight++;
    }
    
    let net = row["rawNet"] || 0;
    if (net < 0) stats.totalOvercharges += Math.abs(net);
    else if (net > 0) stats.totalUndercharges += net;
  });
  return stats;
}

/* Update Summary Cards in the UI */
function updateSummaryCards() {
  document.getElementById("totalRowsAssessed").textContent = formatNumber(summaryStats.totalRows);
  document.getElementById("totalErrors").textContent = formatNumber(summaryStats.totalErrors);
  // Update Total Correct Rows card
  document.getElementById("totalCorrectRows").textContent = formatNumber(summaryStats.totalCorrect);
  document.getElementById("total660LBins").textContent = formatNumber(summaryStats.total660L);
  document.getElementById("total240LBins").textContent = formatNumber(summaryStats.total240LBins);
  document.getElementById("total120LBins").textContent = formatNumber(summaryStats.total120LBins);
  
  const totalBins = summaryStats.total660L + summaryStats.total240LBins + summaryStats.total120LBins;
  document.getElementById("totalBins").textContent = formatNumber(totalBins);
  
  document.getElementById("totalBinsOverweight").textContent = formatNumber(summaryStats.totalBinsOverweight);
  document.getElementById("totalBinsUnderweight").textContent = formatNumber(summaryStats.totalBinsUnderweight);
  
  document.getElementById("totalWasteKg").textContent = formatDecimal(summaryStats.totalWasteKg);
  // Rename the current total to "Total Excess Kg Corrected"
  document.getElementById("totalExcessKgCorrected").textContent = formatDecimal(summaryStats.totalExcessKgCorrected);
  // New summary card for raw excess value: "Total Excess Kg"
  document.getElementById("totalExcessKg").textContent = formatDecimal(summaryStats.totalExcessKgRaw);
  
  document.getElementById("totalChargeExclGST").textContent = formatCurrency(summaryStats.totalChargeExclGST);
  document.getElementById("totalOvercharges").textContent = formatCurrency(-summaryStats.totalOvercharges);
  document.getElementById("totalUndercharges").textContent = formatCurrency(summaryStats.totalUndercharges);
  
  const netCharge = summaryStats.totalChargeExclGST - summaryStats.totalOvercharges + summaryStats.totalUndercharges;
  document.getElementById("totalNetCharge").textContent = formatCurrency(netCharge);
}

/* Evaluate the Sheet and Build Processed Data */
function evaluateSheet(sheet) {
  const processedRows = [];
  let correctCount = 0; // Counter for correct rows
  
  sheet.forEach((row, index) => {
    const serviceDesc = row["Service Description"] || "";
    const wasteKg = parseFloat(row["Waste Kg"] || 0);
    const providedExcessKg = parseFloat(row["Excess kg"] || 0);
    const actualCharge = parseFloat(row["Charge excl GST"] || 0);
    
    const result = validateRow(row);
    const siteName = row["Task Site Name"] ? row["Task Site Name"].trim() : "N/A";
    
    // If there are no errors, increment the correctCount.
    if (result.errors.length === 0) {
      correctCount++;
    }
    
    processedRows.push({
      "Row": index + 2,
      "Site Name": siteName,
      "Bin Size": result.binSize || "N/A",
      "Service Description": row["Service Description"] || "N/A",
      "Contract Unit Price Charged": formatCurrency(parseFloat(row["Contract Unit Price"]) || 0),
      "Waste Kg": formatNumber(wasteKg),
      "rawWasteKg": wasteKg,
      "Excess kg": formatNumber(providedExcessKg),
      "rawExcessKg": providedExcessKg,
      "Charge excl GST ($)": formatCurrency(actualCharge),
      "rawCharge": actualCharge,
      "Expected Charge ($)": formatCurrency(result.expectedTotalCharge),
      "rawExpectedCharge": result.expectedTotalCharge,
      "Net Over (-$) | Undercharge ($)": formatCurrency(result.netDifference),
      "rawNet": result.netDifference,
      "Discrepancy": result.errors.join("; ")
    });
  });
  summaryStats.totalCorrect = correctCount;
  return processedRows;
}

/* Table Building Functions */
function updateTable() {
  const tableBody = document.querySelector("#results tbody");
  const totalsRow = document.querySelector("#totalsRow");
  tableBody.innerHTML = "";
  
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
  
  const pageData = getPageData();
  pageData.forEach((row, idx) => {
    row["Row"] = idx + 1 + ((currentPage - 1) * (entriesPerPage === "All" ? pageData.length : entriesPerPage));
    const tr = document.createElement("tr");
    columns.forEach(col => {
      const td = document.createElement("td");
      td.textContent = row[col] || "N/A";
      if (col === "Net Over (-$) | Undercharge ($)") {
        td.style.textAlign = "center";
      }
      if (col === "Discrepancy") {
        td.style.textAlign = "left";
      }
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
  
  let totalChargeExclGST = 0;
  let totalExpectedCharge = 0;
  let totalNet = 0;
  filteredData.forEach(row => {
    totalChargeExclGST += row["rawCharge"] || 0;
    totalExpectedCharge += row["rawExpectedCharge"] || 0;
    totalNet += row["rawNet"] || 0;
  });
  
  totalsRow.innerHTML = `
    <td colspan="5"><strong>Totals</strong></td>
    <td>${formatDecimal(summaryStats.totalWasteKg)}</td>
    <td>${formatDecimal(summaryStats.totalExcessKgCorrected)}</td>
    <td>${formatCurrency(totalChargeExclGST)}</td>
    <td>${formatCurrency(totalExpectedCharge)}</td>
    <td>${formatCurrency(totalNet)}</td>
    <td></td>
  `;
  
  updatePagination();
}

function getPageData() {
  if (entriesPerPage === "All") return filteredData;
  const start = (currentPage - 1) * entriesPerPage;
  return filteredData.slice(start, start + entriesPerPage);
}

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

/* UI Update */
function updateUI() {
  const resultsTable = document.getElementById("resultsTable");
  const noResultsMessage = document.getElementById("noResultsMessage");
  const tableControls = document.getElementById("tableControls");
  const hasBaseData = processedData.length > 0;
  const hasFilteredData = filteredData.length > 0;
  if (tableControls) {
    if (hasBaseData) tableControls.classList.remove("hidden");
    else tableControls.classList.add("hidden");
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

/* Populate Site Name Dropdown */
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

/* File Processing */
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
    populateSiteNameFilter();
    processedData = evaluateSheet(jsonData);
    applyFiltersAndSearch();
  };
  reader.readAsArrayBuffer(file);
}

/* Filtering & Recalculation */
function applyFiltersAndSearch() {
  filteredData = processedData.filter((row) => {
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
  summaryStats = recalcFilteredSummaryStats();
  updateSummaryCards();
  updateUI();
  updateRecordCount();
}

/* Setup Event Listeners */
function setupEventListeners() {
  const binSizeFilterEl = document.getElementById("binSizeFilter");
  if (binSizeFilterEl) {
    binSizeFilterEl.addEventListener("change", (e) => {
      selectedBinSize = e.target.value;
      applyFiltersAndSearch();
    });
  }
  const siteNameFilterEl = document.getElementById("siteNameFilter");
  if (siteNameFilterEl) {
    siteNameFilterEl.addEventListener("change", (e) => {
      selectedSiteName = e.target.value;
      applyFiltersAndSearch();
    });
  }
  const weightFilterEl = document.getElementById("weightFilter");
  if (weightFilterEl) {
    weightFilterEl.addEventListener("change", (e) => {
      selectedWeightFilter = e.target.value;
      applyFiltersAndSearch();
    });
  }
  const chargeFilterEl = document.getElementById("chargeFilter");
  if (chargeFilterEl) {
    chargeFilterEl.addEventListener("change", (e) => {
      selectedChargeFilter = e.target.value;
      applyFiltersAndSearch();
    });
  }
  const searchInputEl = document.getElementById("searchInput");
  if (searchInputEl) {
    searchInputEl.addEventListener("input", (e) => {
      searchTerm = e.target.value.toLowerCase();
      applyFiltersAndSearch();
    });
  }
  const resetFiltersEl = document.getElementById("resetFilters");
  if (resetFiltersEl) {
    resetFiltersEl.addEventListener("click", () => {
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
  const spreadsheetEl = document.getElementById("spreadsheet");
  if (spreadsheetEl) {
    spreadsheetEl.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) processFile(file);
    });
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
  }
  // New: Export Valid Rows Button event listener.
  const downloadValidButton = document.getElementById("downloadValidResults");
  if (downloadValidButton) {
    downloadValidButton.addEventListener("click", () => {
      const validRows = filteredData.filter(row => !row["Discrepancy"] || row["Discrepancy"].trim() === "");
      if (validRows.length === 0) {
        alert("No valid rows to export.");
        return;
      }
      try {
        const timestamp = new Date().toISOString().split('T')[0];
        const originalNameWithoutExt = originalFilename.replace(/\.[^/.]+$/, "");
        const exportFilename = `${originalNameWithoutExt}_Valid_Rows_${timestamp}.xlsx`;
        const worksheet = XLSX.utils.json_to_sheet(validRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Valid Rows");
        XLSX.writeFile(workbook, exportFilename);
      } catch (error) {
        console.error('Export error:', error);
        alert('There was an error during export. Please try again.');
      }
    });
  }
  const entriesPerPageEl = document.getElementById("entriesPerPage");
  if (entriesPerPageEl) {
    entriesPerPageEl.addEventListener("change", (e) => {
      entriesPerPage = e.target.value === "All" ? "All" : parseInt(e.target.value);
      currentPage = 1;
      updateTable();
      updateRecordCount();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  const entriesEl = document.getElementById("entriesPerPage");
  if (entriesEl) {
    entriesEl.value = "All";
  }
});



