// Full JavaScript Code

const BIN_CONFIG = {
  '660L': { basePrice: 128.93, includedWeight: 49, excessRate: 2.63 },
  '240L': { basePrice: 34.21, includedWeight: 13, excessRate: 2.63 },
  '120L': { basePrice: 21.05, includedWeight: 8, excessRate: 2.63 }
};

// Global variables
let rawData = [];
let processedData = []; // All rows processed from the spreadsheet.
let filteredData = [];  // Subset of processedData (error rows only) after filtering.
let searchTerm = '';
let selectedBinSize = 'all';
let selectedSiteName = 'all';
let selectedWeightFilter = 'all';
let selectedChargeFilter = 'all';
let currentPage = 1;
let entriesPerPage = 'All';
let originalFilename = '';
// Toggle to flag error if Waste Kg is below minimum.
let flagWasteKgMin = true;

let summaryStats = {
  totalRows: 0,              // From processedData
  totalCorrect: 0,           // From processedData
  totalErrors: 0,            // From filteredData
  total660L: 0,
  total240LBins: 0,
  total120LBins: 0,
  totalBinsOverweight: 0,
  totalBinsUnderweight: 0,
  totalChargeExclGST: 0,
  totalWasteKg: 0,
  totalExcessKgCorrected: 0, // From filteredData: corrected (error rows only)
  totalExcessKgRaw: 0,       // From filteredData: raw value (error rows only)
  totalOvercharges: 0,
  totalUndercharges: 0,
  totalNetCharge: 0,
  totalBinQty: 0           // New: total for Bin Qty column
};

/* Helper to safely update textContent of an element */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
  }
}

/* Formatting Functions */
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
  return Number(number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* Data Validation */
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
  const validCustomerNos = ["C-001148", "C-002810", "C-001352", "C-001234", "C-011883", "C-001469", "C-002811", "C-001693", "C-027713", "C-027790"];
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
  
  // Additional Rule: Flag an issue if the bin quantity is greater than 1.
  const binQuantity = parseFloat(row["Bin Qty"] || row["Bin Quanity"] || "1");
  if (binQuantity > 1) {
    errors.push("Bin quantity cannot be greater than 1");
  }
  
  // Additional Rule: "Included Kg" (if provided) should never exceed the minimum included kg.
  if (row["Included Kg"]) {
    const includedKg = parseFloat(row["Included Kg"]);
    if (includedKg > config.includedWeight) {
      errors.push("Included Kg should never exceed the minimum included kg");
    }
  }
  
  // Check if Waste Kg is below the minimum included kg (only if toggle is on).
  if (flagWasteKgMin && actualWeight < config.includedWeight) {
    errors.push(`Waste Kg is below the minimum included kg of ${config.includedWeight}Kg`);
  }
  
  // Calculate expected total charge using providedExcessKg.
  let expectedTotalCharge = config.basePrice + (providedExcessKg * config.excessRate);
  
  let netDifference = 0;
  // If Waste Kg equals Excess kg (and nonzero), flag error and override expectedTotalCharge.
  if (actualWeight === providedExcessKg && actualWeight !== 0) {
    errors.push("Waste Kg and Excess kg cannot be identical");
    expectedTotalCharge = config.basePrice;
    netDifference = -(parseFloat(row["Charge excl GST"] || 0) - config.basePrice);
  } else {
    if (actualWeight < config.includedWeight && providedExcessKg > 0) {
      errors.push("Excess kg should be zero when Waste Kg is below the minimum included kg");
    }
    if (Math.abs(parseFloat(row["Charge excl GST"] || 0) - expectedTotalCharge) > 0.01) {
      netDifference = expectedTotalCharge - parseFloat(row["Charge excl GST"] || 0);
      const discrepancyType = parseFloat(row["Charge excl GST"] || 0) > expectedTotalCharge ? "Overcharge" : "Undercharge";
      errors.push(`${discrepancyType} - Incorrect total`);
    }
  }
  
  return { errors, binSize, netDifference, expectedTotalCharge };
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

/* Compute Bin Counts from Entire Processed Data */
function computeBinCounts(data) {
  let binStats = {
    total660L: 0,
    total240LBins: 0,
    total120LBins: 0,
    totalBinsOverweight: 0,
    totalBinsUnderweight: 0
  };
  
  data.forEach(row => {
    const binSize = row["Bin Size"];
    if (binSize === "660L") binStats.total660L++;
    else if (binSize === "240L") binStats.total240LBins++;
    else if (binSize === "120L") binStats.total120LBins++;
    
    const waste = row["rawWasteKg"] || 0;
    const excess = row["rawExcessKg"] || 0;
    const totalDelivered = waste + excess;
    if (binSize === "660L") {
      if (flagWasteKgMin && totalDelivered < 49) binStats.totalBinsUnderweight++;
      else if (totalDelivered > 89) binStats.totalBinsOverweight++;
    } else if (binSize === "240L") {
      if (flagWasteKgMin && totalDelivered < 13) binStats.totalBinsUnderweight++;
      else if (totalDelivered > 33) binStats.totalBinsOverweight++;
    } else if (binSize === "120L") {
      if (flagWasteKgMin && totalDelivered < 8) binStats.totalBinsUnderweight++;
      else if (totalDelivered > 18) binStats.totalBinsOverweight++;
    }
  });
  return binStats;
}

/* Compute Overall Financial Statistics from Entire Processed Data */
function computeOverallFinancialStats(data) {
  let totalWasteKg = 0;
  let totalExpectedCharge = 0;
  let totalChargeExclGST = 0;
  data.forEach(row => {
    totalWasteKg += row["rawWasteKg"] || 0;
    totalExpectedCharge += row["rawExpectedCharge"] || 0;
    totalChargeExclGST += row["rawCharge"] || 0;
  });
  return { totalWasteKg, totalExpectedCharge, totalChargeExclGST };
}

/* Compute Financial Statistics from Filtered Data (Error Rows) */
function computeFinancialStats(filteredRows) {
  let stats = {
    totalErrors: filteredRows.length,
    totalWasteKg: 0,
    totalExcessKgCorrected: 0,
    totalExcessKgRaw: 0,
    totalChargeExclGST: 0,
    totalOvercharges: 0,
    totalUndercharges: 0
  };
  
  filteredRows.forEach(row => {
    let waste = row["rawWasteKg"] || 0;
    let rawExcess = row["rawExcessKg"] || 0;
    let correctedExcess = rawExcess;
    if (row["Discrepancy"] && row["Discrepancy"].toLowerCase().includes("waste kg and excess kg cannot be identical")) {
      correctedExcess = 0;
    }
    let charge = row["rawCharge"] || 0;
    stats.totalWasteKg += waste;
    stats.totalExcessKgRaw += rawExcess;
    stats.totalExcessKgCorrected += correctedExcess;
    stats.totalChargeExclGST += charge;
    
    const totalDelivered = waste + rawExcess;
    if (row["Bin Size"] === "660L") {
      if (totalDelivered < 49) stats.totalBinsUnderweight = (stats.totalBinsUnderweight || 0) + 1;
      else if (totalDelivered > 89) stats.totalBinsOverweight = (stats.totalBinsOverweight || 0) + 1;
    } else if (row["Bin Size"] === "240L") {
      if (totalDelivered < 13) stats.totalBinsUnderweight = (stats.totalBinsUnderweight || 0) + 1;
      else if (totalDelivered > 33) stats.totalBinsOverweight = (stats.totalBinsOverweight || 0) + 1;
    } else if (row["Bin Size"] === "120L") {
      if (totalDelivered < 8) stats.totalBinsUnderweight = (stats.totalBinsUnderweight || 0) + 1;
      else if (totalDelivered > 18) stats.totalBinsOverweight = (stats.totalBinsOverweight || 0) + 1;
    }
    
    let net = row["rawNet"] || 0;
    if (net < 0) stats.totalOvercharges += Math.abs(net);
    else if (net > 0) stats.totalUndercharges += net;
  });
  return stats;
}

/* Update Summary Cards in the UI */
function updateSummaryCards() {
  // Overall totals from processedData:
  setText("totalRowsAssessed", formatNumber(summaryStats.totalRows));
  setText("totalCorrectRows", formatNumber(summaryStats.totalCorrect));
  
  // Error rows from filteredData:
  setText("totalErrors", formatNumber(summaryStats.totalErrors));
  
  // Bin counts from processedData:
  setText("total660LBins", formatNumber(summaryStats.total660L));
  setText("total240LBins", formatNumber(summaryStats.total240LBins));
  setText("total120LBins", formatNumber(summaryStats.total120LBins));
  const totalBins = summaryStats.total660L + summaryStats.total240LBins + summaryStats.total120LBins;
  setText("totalBins", formatNumber(totalBins));
  
  // Overweight/Underweight counts (underweight respects the toggle).
  setText("totalBinsOverweight", formatNumber(summaryStats.totalBinsOverweight));
  setText("totalBinsUnderweight", formatNumber(summaryStats.totalBinsUnderweight));
  
  // Overall financial stats from processedData (not affected by the toggle).
  setText("totalWasteKg", formatDecimal(summaryStats.totalWasteKg));
  setText("totalChargeExclGST", formatCurrency(summaryStats.totalChargeExclGST));
  setText("estCorrectInvoiceCharge", formatCurrency(summaryStats.totalExpectedCharge));
  
  // Error-specific financial stats from filteredData.
  setText("totalExcessKgCorrected", formatDecimal(summaryStats.totalExcessKgCorrected));
  setText("totalExcessKg", formatDecimal(summaryStats.totalExcessKgRaw));
  setText("totalOvercharges", formatCurrency(-summaryStats.totalOvercharges));
  setText("totalUndercharges", formatCurrency(summaryStats.totalUndercharges));
  
  // Change the color of Total Estimated Overcharges and Undercharges to green.
  const overEl = document.getElementById("totalOvercharges");
  if (overEl) overEl.style.color = "green";
  const underEl = document.getElementById("totalUndercharges");
  if (underEl) underEl.style.color = "green";
  
  const netCharge = summaryStats.totalChargeExclGST - summaryStats.totalOvercharges + summaryStats.totalUndercharges;
  setText("totalNetCharge", formatCurrency(netCharge));
}

/* Evaluate the Sheet and Build Processed Data */
function evaluateSheet(sheet) {
  const processedRows = [];
  let correctCount = 0;
  
  sheet.forEach((row, index) => {
    const wasteKg = parseFloat(row["Waste Kg"] || 0);
    const providedExcessKg = parseFloat(row["Excess kg"] || 0);
    const actualCharge = parseFloat(row["Charge excl GST"] || 0);
    
    const result = validateRow(row);
    const siteName = row["Task Site Name"] ? row["Task Site Name"].trim() : "N/A";
    // Use "Bin Qty" if available; if not, try "Bin Quanity"; default to 1.
    const binQty = parseFloat(row["Bin Qty"] || row["Bin Quanity"] || "1");
    
    if (result.errors.length === 0) {
      correctCount++;
    }
    
    processedRows.push({
      "Row": index + 2,
      "Site Name": siteName,
      "Bin Qty": binQty,
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
    "Bin Qty",
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
      if (col === "Net Over (-$) | Undercharge ($)") td.style.textAlign = "center";
      if (col === "Discrepancy") td.style.textAlign = "left";
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
  
  // Compute totals from filteredData (which is what is displayed in the table)
  let totBinQty = 0;
  let totWasteKg = 0;
  let totExcessKg = 0;
  let totChargeExclGST = 0;
  let totExpectedCharge = 0;
  let totNet = 0;
  
  filteredData.forEach(row => {
    totBinQty += parseFloat(row["Bin Qty"]) || 0;
    totWasteKg += row["rawWasteKg"] || 0;
    totExcessKg += row["rawExcessKg"] || 0;
    totChargeExclGST += row["rawCharge"] || 0;
    totExpectedCharge += row["rawExpectedCharge"] || 0;
    totNet += row["rawNet"] || 0;
  });
  
  // Totals row: 
  // - First cell spans columns 1-2 ("Row" and "Site Name") with "Totals"
  // - Column 3: Total Bin Qty
  // - Columns 4-6: empty (for Bin Size, Service Description, Contract Unit Price Charged)
  // - Columns 7-11: Totals for Waste Kg, Excess kg (corrected), Charge excl GST, Expected Charge, Net Over/Undercharge
  // - Column 12: empty
  totalsRow.innerHTML = `
    <td colspan="2"><strong>Totals</strong></td>
    <td id="totBinQty">${formatDecimal(totBinQty)}</td>
    <td></td>
    <td></td>
    <td></td>
    <td id="totWasteKg">${formatDecimal(totWasteKg)}</td>
    <td id="totExcessKg">${formatDecimal(totExcessKg)}</td>
    <td id="totChargeExclGST">${formatCurrency(totChargeExclGST)}</td>
    <td id="totExpectedCharge">${formatCurrency(totExpectedCharge)}</td>
    <td id="totNet">${formatCurrency(totNet)}</td>
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
      if (hasBaseData && (searchTerm || selectedBinSize !== 'all' || selectedSiteName !== 'all' ||
          selectedWeightFilter !== 'all' || selectedChargeFilter !== 'all')) {
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

/* Populate Bin Size Dropdown Based on Processed Data */
function populateBinSizeFilter() {
  const binSizeSet = new Set();
  processedData.forEach(row => {
    if (row["Bin Size"] && row["Bin Size"] !== "N/A") {
      binSizeSet.add(row["Bin Size"]);
    }
  });
  const binSizes = Array.from(binSizeSet).sort();
  const binSizeFilter = document.getElementById("binSizeFilter");
  if (binSizeFilter) {
    binSizeFilter.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "all";
    defaultOption.textContent = "All Sizes";
    binSizeFilter.appendChild(defaultOption);
    binSizes.forEach(size => {
      const option = document.createElement("option");
      option.value = size;
      option.textContent = size;
      binSizeFilter.appendChild(option);
    });
  }
}

/* File Processing */
function processFile(file) {
  originalFilename = file.name;
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
    rawData = jsonData;
    populateSiteNameFilter();
    processedData = evaluateSheet(jsonData);
    populateBinSizeFilter();
    applyFiltersAndSearch();
  };
  reader.readAsArrayBuffer(file);
}

/* Filtering & Recalculation */
// We show only rows with errors (filteredData) in the table,
// but overall totals (Total Rows Assessed, Total Correct Rows, bin counts, and overall financial stats)
// are computed from the entire processedData.
function applyFiltersAndSearch() {
  filteredData = processedData.filter((row) => {
    // Only include rows with non-empty Discrepancy.
    if (!row["Discrepancy"] || row["Discrepancy"].trim() === "") return false;
    
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
  
  // Overall totals from processedData.
  summaryStats.totalRows = processedData.length;
  summaryStats.totalCorrect = processedData.filter(row => row["Discrepancy"].trim() === "").length;
  
  // Compute bin counts from processedData.
  const binStats = computeBinCounts(processedData);
  summaryStats.total660L = binStats.total660L;
  summaryStats.total240LBins = binStats.total240LBins;
  summaryStats.total120LBins = binStats.total120LBins;
  summaryStats.totalBinsOverweight = binStats.totalBinsOverweight;
  summaryStats.totalBinsUnderweight = binStats.totalBinsUnderweight;
  
  // Compute total Bin Qty from processedData.
  let totalBinQty = 0;
  processedData.forEach(row => {
    totalBinQty += parseFloat(row["Bin Qty"]) || 0;
  });
  summaryStats.totalBinQty = totalBinQty;
  
  // Compute overall financial stats from processedData (not impacted by the toggle).
  const overallFinancial = computeOverallFinancialStats(processedData);
  summaryStats.totalWasteKg = overallFinancial.totalWasteKg;
  summaryStats.totalExpectedCharge = overallFinancial.totalExpectedCharge;
  summaryStats.totalChargeExclGST = overallFinancial.totalChargeExclGST;
  
  // Compute error-specific financial stats from filteredData.
  const financialStats = computeFinancialStats(filteredData);
  summaryStats.totalErrors = financialStats.totalErrors;
  summaryStats.totalExcessKgCorrected = financialStats.totalExcessKgCorrected;
  summaryStats.totalExcessKgRaw = financialStats.totalExcessKgRaw;
  summaryStats.totalOvercharges = financialStats.totalOvercharges;
  summaryStats.totalUndercharges = financialStats.totalUndercharges;
  
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
  const toggleWasteKgMinEl = document.getElementById("toggleWasteKgMin");
  if (toggleWasteKgMinEl) {
    toggleWasteKgMinEl.addEventListener("change", (e) => {
      flagWasteKgMin = e.target.checked;
      // Re-run full processing using evaluateSheet(rawData) so that validation reflects the toggle state.
      processedData = evaluateSheet(rawData);
      populateBinSizeFilter();
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
  // Export Valid Rows: Export all rows with no discrepancy from processedData.
  const downloadValidButton = document.getElementById("downloadValidResults");
  if (downloadValidButton) {
    downloadValidButton.addEventListener("click", () => {
      const validRows = processedData.filter(row => !row["Discrepancy"] || row["Discrepancy"].trim() === "");
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
