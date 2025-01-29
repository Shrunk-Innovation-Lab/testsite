/*************************************************
 * script.js — Using CSV for Each Site (No XLSX)
 *************************************************/

/*
  1) CSV_URL_MAP: map each site name to its published CSV URL.
  2) If you want to fetch "All Sites", we'll iterate over all these URLs.
*/
const CSV_URL_MAP = {
  "Box Hill":        "https://docs.google.com/spreadsheets/d/e/2PACX-1vREbOQf96fu-XVWClgTFVdmaZ-MQ0CqGlgcXRPq_j2nvoqfpVnqRlQDxmlnhQC_zSYdNXWg4xV5sNOW/pub?gid=494600588&single=true&output=csv",
  "Wantirna":        "https://docs.google.com/spreadsheets/d/e/2PACX-1vREbOQf96fu-XVWClgTFVdmaZ-MQ0CqGlgcXRPq_j2nvoqfpVnqRlQDxmlnhQC_zSYdNXWg4xV5sNOW/pub?gid=1825774984&single=true&output=csv",
  "Burwood":         "https://docs.google.com/spreadsheets/d/e/2PACX-1vREbOQf96fu-XVWClgTFVdmaZ-MQ0CqGlgcXRPq_j2nvoqfpVnqRlQDxmlnhQC_zSYdNXWg4xV5sNOW/pub?gid=294019943&single=true&output=csv",
  "Ferntree Gully":  "https://docs.google.com/spreadsheets/d/e/2PACX-1vREbOQf96fu-XVWClgTFVdmaZ-MQ0CqGlgcXRPq_j2nvoqfpVnqRlQDxmlnhQC_zSYdNXWg4xV5sNOW/pub?gid=267580033&single=true&output=csv",
  "Maroonda":        "https://docs.google.com/spreadsheets/d/e/2PACX-1vREbOQf96fu-XVWClgTFVdmaZ-MQ0CqGlgcXRPq_j2nvoqfpVnqRlQDxmlnhQC_zSYdNXWg4xV5sNOW/pub?gid=191428538&single=true&output=csv",
  "Murenda":         "https://docs.google.com/spreadsheets/d/e/2PACX-1vREbOQf96fu-XVWClgTFVdmaZ-MQ0CqGlgcXRPq_j2nvoqfpVnqRlQDxmlnhQC_zSYdNXWg4xV5sNOW/pub?gid=1654220950&single=true&output=csv"
};

// (Optional) Sites to hide from display
const HIDDEN_SITES = [];  // e.g. ['VCCC'] if needed

// Data arrays
let allData = [];
let filteredData = [];

// Pagination
let currentPage = 1;
let entriesPerPage = 'All';

// Sorting
let currentDateSort = 'newest';

/**
 * Return a nicer site display name. 
 * Adjust if your code needs different naming logic.
 */
function getSiteDisplayName(site) {
  if (site === 'Ferntree Gully') return 'Angliss';
  if (site === 'Maroonda')       return 'Maroondah';
  if (site === 'Mirenda')        return 'Murenda';  
  return site;
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize flatpickr
  flatpickr("#dateRangePicker", {
    mode: "range",
    dateFormat: "d-m-Y",
    allowInput: true,
    clickOpens: true,
    enableTime: false,
    defaultHour: 0,
    position: "below",
    static: false,
    onClose: function(selectedDates) {
      if (selectedDates.length === 1) {
        document.getElementById('startDate').value = formatDateForFiltering(selectedDates[0]);
        document.getElementById('endDate').value = formatDateForFiltering(selectedDates[0]);
      } else if (selectedDates.length === 2) {
        document.getElementById('startDate').value = formatDateForFiltering(selectedDates[0]);
        document.getElementById('endDate').value = formatDateForFiltering(selectedDates[1]);
      }
    }
  });

  // Search input
  document.getElementById('search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filteredData = allData.filter(row =>
      Object.values(row).some(value => value.toString().toLowerCase().includes(searchTerm))
    );
    sortDataByDate();
    currentPage = 1;
    updateTable();
  });

  // Clear data
  document.getElementById('clearData').addEventListener('click', () => {
    document.getElementById('dateRangePicker').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('siteSelector').value = '';
    document.getElementById('search').value = '';
    allData = [];
    filteredData = [];
    currentPage = 1;
    updateTable();
    populateFilters();
  });

  // Fetch data button
  document.getElementById('fetchData').addEventListener('click', fetchData);

  // Entries per page
  document.getElementById('entriesPerPage').addEventListener('change', (e) => {
    entriesPerPage = (e.target.value === 'All') ? 'All' : parseInt(e.target.value);
    currentPage = 1;
    updateTable();
  });

  // Date sort filter
  document.getElementById('dateSortFilter').addEventListener('change', (e) => {
    currentDateSort = e.target.value;
    sortDataByDate();
    updateTable();
  });

  // Copy rows button
  document.getElementById('copyButton').addEventListener('click', copySelectedRows);

  // Export to Excel button
  document.getElementById('csvButton').addEventListener('click', downloadExcel);

  // Select all checkbox
  document.getElementById('selectAll').addEventListener('change', selectAllRows);

  // Filter dropdown toggles
  document.getElementById('binSizeFilterToggle').addEventListener('click', (event) => {
    toggleFilterDropdown('binSizeFilterDropdown', event);
  });
  document.getElementById('binTypeFilterToggle').addEventListener('click', (event) => {
    toggleFilterDropdown('binTypeFilterDropdown', event);
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.filter-icon') && !event.target.closest('.filter-dropdown')) {
      closeAllDropdowns();
    }
  });

  // Initial (empty) table + filters
  updateTable();
  populateFilters();
});

/**
 * Convert Date -> "YYYY-MM-DD" for hidden fields
 */
function formatDateForFiltering(dateObj) {
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${year}-${month}-${day}`;
}

/**
 * Parse "d-m-yyyy" into a JS Date object (or null on failure)
 */
function parseDate(dateString) {
  if (!dateString) return null;
  const [day, month, year] = dateString.split('-');
  const parsed = new Date(year, month - 1, day);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Fetch data from CSV for the selected site(s) + filter by date
 */
async function fetchData() {
  const startDate = document.getElementById('startDate').value;
  const endDate   = document.getElementById('endDate').value;
  const site      = document.getElementById('siteSelector').value;

  if (!startDate || !endDate || !site) {
    alert('Please select start date, end date, and site.');
    return;
  }

  const spinner = document.getElementById('spinner');
  spinner.style.display = 'block';

  try {
    let sitesToFetch = [];
    if (site === 'All Sites') {
      // If user selects "All Sites", fetch them all
      sitesToFetch = Object.keys(CSV_URL_MAP);
    } else {
      // Otherwise just the chosen site
      sitesToFetch = [site];
    }

    allData = [];

    // Loop over each required site
    for (const currentSite of sitesToFetch) {
      const csvUrl = CSV_URL_MAP[currentSite];
      if (!csvUrl) {
        console.warn(`No CSV URL for site: ${currentSite}`);
        continue;
      }

      // 1) Fetch CSV
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error(`Network response was not ok for ${currentSite}`);
      }
      const csvText = await response.text();

      // 2) Parse CSV -> Array of objects
      let rows = parseCsv(csvText);

      // 3) For each row, convert relevant fields
      rows = rows.map(row => {
        // Convert the "Date" field (assuming it's stored as e.g. "dd-mm-yyyy" in CSV)
        let parsedDt = parseDate(row.Date);

        // Convert numeric fields if present
        let grossWeight = parseFloat(row["Weight( kg)"] || 0);

        // Use your logic for bin size & bin type
        let binSize = (row["BIN SIZE"] || "").trim();
        let binType = (row["BIN TYPE"] || "").trim();

        const netWeight = calculateNetWeight(grossWeight, binSize);
        const cost = calculateCost(binSize, netWeight, binType);
        const emissions = calculateEmissions(binType, netWeight);

        return {
          // Adjust the site display name logic if you want
          Site: (currentSite === 'Maroonda') ? 'Maroondah' : currentSite,
          Date: parsedDt,
          Time: row["Time"] || "",
          "Weight (Gross)": grossWeight,
          "Weight (Net)": netWeight,
          "Bin Size": binSize,
          "Bin Type": binType,
          "Clinical Barcode Scan": (row["Scan"] || ""),
          "Location": "",
          "Estimated $": cost,
          "Emissions": emissions
        };
      });

      // 4) Combine into allData
      allData = allData.concat(rows);
    }

    // Filter by date range
    const startDateObj = new Date(startDate);
    const endDateObj   = new Date(endDate);
    startDateObj.setHours(0, 0, 0, 0);
    endDateObj.setHours(23, 59, 59, 999);

    filteredData = allData.filter(row => {
      if (!row.Date) return false;
      return (row.Date >= startDateObj && row.Date <= endDateObj);
    });

    // Exclude hidden sites if needed
    filteredData = filteredData.filter(row => !HIDDEN_SITES.includes(row.Site));

    // Sort & update
    sortDataByDate();
    currentPage = 1;
    populateFilters();
    updateTable();

    if (filteredData.length === 0) {
      alert('No data found for the selected date range.');
    }

  } catch (error) {
    console.error('Error fetching data:', error);
    alert(`Error fetching data: ${error.message}`);
    allData = [];
    filteredData = [];
    updateTable();
    populateFilters();
  } finally {
    spinner.style.display = 'none';
  }
}

/**
 * Simple CSV -> Array of Objects parser
 * Assumes first row is headers
 */
function parseCsv(csvString) {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',');
  const dataRows = lines.slice(1).map(line => {
    const cols = line.split(',');
    let obj = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = (cols[i] || "").trim();
    });
    return obj;
  });
  return dataRows;
}

/**
 * Calculate net weight by subtracting tare weights for known bin sizes
 */
function calculateNetWeight(grossWeight, binSize) {
  switch (binSize) {
    case '80L':   return Math.max(0, grossWeight - 8.5);
    case '120L':  return Math.max(0, grossWeight - 9.3);
    case '240L':  return Math.max(0, grossWeight - 12.5);
    case '660L':  return Math.max(0, grossWeight - 43);
    case '1100L': return Math.max(0, grossWeight - 65);
    default:
      return grossWeight;
  }
}

/**
 * Calculate cost by binType/binSize/netWeight
 */
function calculateCost(binSize, netWeight, binType) {
  if (!binType) return 0;
  switch (binType.toUpperCase()) {
    case 'GENERAL':
      // cost = netWeight * 0.2233 + base
      switch (binSize) {
        case '660L':
          return (netWeight * 0.2233) + 7.60;
        case '1100L':
          return (netWeight * 0.2233) + 23.57;
        default:
          return 0;
      }
    case 'ORGANICS':
      // 120L = flat 21.34
      if (binSize === '120L') return 21.34;
      return 0;
    case 'COMMINGLED':
      // 240L = 11.76, 660L = 18.86
      switch (binSize) {
        case '240L':
          return 11.76;
        case '660L':
          return 18.86;
        default:
          return 0;
      }
    case 'CLINICAL':
      // base + overage beyond included weight
      let basePrice, includedWeight, excessPrice;
      switch (binSize) {
        case '660L':
          basePrice = 124.46;
          includedWeight = 49;
          excessPrice = 2.54;
          break;
        case '240L':
          basePrice = 33.02;
          includedWeight = 13;
          excessPrice = 2.54;
          break;
        default:
          return 0;
      }
      if (netWeight <= includedWeight) return basePrice;
      const excessWeight = netWeight - includedWeight;
      return basePrice + (excessWeight * excessPrice);
    default:
      return 0;
  }
}

/**
 * Calculate emissions (CO₂-e) by binType * netWeight
 */
function calculateEmissions(binType, weight) {
  if (!binType || !weight) return 0;
  const factors = {
    'CLINICAL':   2.9,
    'COMMINGLED': 0.04,
    'ORGANICS':   1.9,
    'PAPER':      0.03,
    'GENERAL':    1.1
  };
  const factor = factors[binType.toUpperCase()] || 0;
  return weight * factor;
}

/**
 * Sort filteredData by date (newest or oldest)
 */
function sortDataByDate() {
  filteredData.sort((a, b) => {
    if (currentDateSort === 'newest') {
      return b.Date - a.Date;
    } else {
      return a.Date - b.Date;
    }
  });
}

/**
 * Render the table
 */
function updateTable() {
  const tableBody = document.querySelector('#dataTable tbody');
  tableBody.innerHTML = '';

  const pageData = (entriesPerPage === 'All') ? filteredData : getPageData();
  pageData.forEach(row => {
    const tr = document.createElement('tr');

    // Handle Clinical Barcode vs. Location
    let clinicalBarcode = '';
    let location = '';
    let displaySite = getSiteDisplayName(row.Site);

    // If site is "Murenda" (displayed as "Murenda"), we move "Scan" to "Location"
    if (row.Site === 'Murenda') {
      location = row["Clinical Barcode Scan"] || '';
      clinicalBarcode = '';
    } else if (row["Bin Type"]?.toUpperCase() === 'CLINICAL') {
      clinicalBarcode = row["Clinical Barcode Scan"] || '';
    }

    tr.innerHTML = `
      <td><input type="checkbox" class="rowSelector"></td>
      <td>${displaySite}</td>
      <td>${row.Date ? row.Date.toLocaleDateString('en-GB') : 'Invalid Date'}</td>
      <td>${row.Time}</td>
      <td>${formatNumber(row["Weight (Gross)"])}</td>
      <td>${formatNumber(row["Weight (Net)"])}</td>
      <td>${row["Bin Size"]}</td>
      <td>${row["Bin Type"]}</td>
      <td>${clinicalBarcode}</td>
      <td>${location}</td>
      <td>$${formatNumber(row["Estimated $"])}</td>
      <td>${formatNumber(row.Emissions)}</td>
    `;
    tableBody.appendChild(tr);
  });

  updateTotals();
  updatePagination();
  updateRecordCount();
}

/**
 * Get data for current page
 */
function getPageData() {
  if (entriesPerPage === 'All') return filteredData;
  const start = (currentPage - 1) * entriesPerPage;
  const end = start + entriesPerPage;
  return filteredData.slice(start, end);
}

/**
 * Update the totals row
 */
function updateTotals() {
  const totals = filteredData.reduce((acc, row) => {
    acc["Weight (Gross)"] += parseFloat(row["Weight (Gross)"]) || 0;
    acc["Weight (Net)"] += parseFloat(row["Weight (Net)"]) || 0;
    acc["Estimated $"] += parseFloat(row["Estimated $"]) || 0;
    acc.Emissions += parseFloat(row.Emissions) || 0;
    return acc;
  }, { "Weight (Gross)": 0, "Weight (Net)": 0, "Estimated $": 0, Emissions: 0 });

  const totalRow = document.getElementById('totalRow');
  totalRow.innerHTML = `
    <td colspan="4"><strong>Total</strong></td>
    <td>${formatNumber(totals["Weight (Gross)"])}</td>
    <td>${formatNumber(totals["Weight (Net)"])}</td>
    <td colspan="4"></td>
    <td>$${formatNumber(totals["Estimated $"])}</td>
    <td>${formatNumber(totals.Emissions)}</td>
  `;
}

/**
 * Pagination controls
 */
function updatePagination() {
  const paginationElement = document.getElementById('pagination');
  paginationElement.innerHTML = '';

  if (entriesPerPage === 'All') return;

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  // Back
  const backButton = document.createElement('button');
  backButton.innerHTML = '&larr;';
  backButton.disabled = (currentPage === 1);
  backButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updateTable();
    }
  });
  paginationElement.appendChild(backButton);

  // Page indicator
  const pageIndicator = document.createElement('span');
  pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
  pageIndicator.style.margin = '0 10px';
  paginationElement.appendChild(pageIndicator);

  // Forward
  const forwardButton = document.createElement('button');
  forwardButton.innerHTML = '&rarr;';
  forwardButton.disabled = (currentPage === totalPages);
  forwardButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      updateTable();
    }
  });
  paginationElement.appendChild(forwardButton);
}

/**
 * "Showing X to Y of Z entries"
 */
function updateRecordCount() {
  const recordCountElement = document.getElementById('recordCount');
  const totalEntries = filteredData.length;

  if (entriesPerPage === 'All') {
    recordCountElement.textContent = `Showing all ${totalEntries} entries`;
  } else {
    const start = (currentPage - 1) * entriesPerPage + 1;
    const end = Math.min(currentPage * entriesPerPage, totalEntries);
    recordCountElement.textContent = `Showing ${start} to ${end} of ${totalEntries} entries`;
  }
}

/**
 * Populate Bin Size + Bin Type filters
 */
function populateFilters() {
  const binSizes = [...new Set(filteredData.map(row => row["Bin Size"]))].filter(Boolean);
  const binTypes = [...new Set(filteredData.map(row => row["Bin Type"]))].filter(Boolean);

  const binSizeFilterDropdown = document.getElementById('binSizeFilterDropdown');
  const binTypeFilterDropdown = document.getElementById('binTypeFilterDropdown');

  binSizeFilterDropdown.innerHTML = binSizes.map(size => `
    <label><input type="checkbox" value="${size}" checked> ${size}</label>
  `).join('');

  binTypeFilterDropdown.innerHTML = binTypes.map(type => `
    <label><input type="checkbox" value="${type}" checked> ${type}</label>
  `).join('');

  binSizeFilterDropdown.addEventListener('change', applyFilters);
  binTypeFilterDropdown.addEventListener('change', applyFilters);
}

/**
 * Apply bin size & bin type filters
 */
function applyFilters() {
  const selectedBinSizes = Array.from(document.querySelectorAll('#binSizeFilterDropdown input:checked'))
    .map(input => input.value);
  const selectedBinTypes = Array.from(document.querySelectorAll('#binTypeFilterDropdown input:checked'))
    .map(input => input.value);

  const startDate = new Date(document.getElementById('startDate').value);
  const endDate   = new Date(document.getElementById('endDate').value);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  filteredData = allData.filter(row => {
    if (!row.Date) return false;
    return (
      row.Date >= startDate &&
      row.Date <= endDate &&
      selectedBinSizes.includes(row["Bin Size"]) &&
      selectedBinTypes.includes(row["Bin Type"]) &&
      !HIDDEN_SITES.includes(row.Site)
    );
  });

  sortDataByDate();
  currentPage = 1;
  updateTable();
}

/**
 * Format a number with commas and 2 decimals
 */
function formatNumber(num) {
  if (isNaN(num)) return '0.00';
  let formatted = parseFloat(num).toFixed(2);
  let parts = formatted.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join('.');
}

/**
 * Copy selected rows to clipboard (tab-delimited)
 */
function copySelectedRows() {
  const selectedRows = getSelectedRows();
  if (selectedRows.length === 0) {
    alert('No rows selected.');
    return;
  }

  const headers = getTableHeaders().join('\t');
  const rowsContent = selectedRows.map(row => {
    const rowCopy = { ...row };
    rowCopy.Site = getSiteDisplayName(rowCopy.Site);

    // If site is "Murenda" => move Scan data to Location
    if (row.Site === 'Murenda') {
      rowCopy["Location"] = row["Clinical Barcode Scan"] || '';
      rowCopy["Clinical Barcode Scan"] = '';
    } else if (row["Bin Type"]?.toUpperCase() !== 'CLINICAL') {
      rowCopy["Clinical Barcode Scan"] = '';
    }

    return Object.values(rowCopy).join('\t');
  }).join('\n');

  const clipboardContent = `${headers}\n${rowsContent}`;

  navigator.clipboard.writeText(clipboardContent)
    .then(() => {
      alert('Selected data copied to clipboard.');
    })
    .catch(err => {
      console.error('Failed to copy:', err);
      alert('Error: Could not copy to clipboard.');
    });
}

/**
 * Download selected rows as Excel (still works with CSV-based data)
 * We'll use the XLSX library if you included it, or you can remove it
 * if you prefer a purely CSV-based approach for exporting as well.
 */
function downloadExcel() {
  try {
    const selectedRows = getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      alert('No rows selected.');
      return;
    }

    const headers = getTableHeaders();
    if (!headers || headers.length === 0) {
      console.error('Headers are missing.');
      alert('Error: Unable to export. No headers found.');
      return;
    }

    // Build 2D array
    const data = [headers];
    for (let row of selectedRows) {
      const rowData = headers.map(header => {
        if (header === 'Site') {
          return getSiteDisplayName(row.Site || '');
        }
        if (header === 'Date') {
          return (row[header] instanceof Date)
            ? row[header].toLocaleDateString('en-GB')
            : (row[header] || '');
        }
        if (header === 'Clinical Barcode Scan') {
          return (row["Bin Type"]?.toUpperCase() === 'CLINICAL')
            ? (row[header] || '')
            : '';
        }
        if (header === 'Location') {
          return (row.Site === 'Murenda')
            ? (row["Clinical Barcode Scan"] || '')
            : '';
        }
        return row[header] !== undefined ? formatExcelNumber(row[header]) : '';
      });
      data.push(rowData);
    }

    // If you're still using XLSX, ensure it's loaded.
    // If not, remove this code or replace with your CSV export approach.
    if (typeof XLSX === 'undefined') {
      throw new Error('XLSX library is not loaded. Remove this or include SheetJS if you want Excel export.');
    }

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ScalerData");

    const filename = `ScalerData_${new Date().toISOString().slice(0, 19).replace(/[-T:]/g, "")}.xlsx`;
    XLSX.writeFile(wb, filename);

  } catch (error) {
    console.error('Error in downloadExcel function:', error);
    alert('An error occurred while trying to download the Excel file. See console for details.');
  }
}

/**
 * Convert numeric strings to real numbers in exported Excel
 */
function formatExcelNumber(value) {
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? value : parsed;
}

/**
 * Return the currently checked rows
 */
function getSelectedRows() {
  const selectedRows = [];
  const rowCheckboxes = document.querySelectorAll('#dataTable tbody .rowSelector');
  rowCheckboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      selectedRows.push(filteredData[index]);
    }
  });
  return selectedRows;
}

/**
 * The headers for copying/exporting
 */
function getTableHeaders() {
  return [
    'Site',
    'Date',
    'Time',
    'Weight (Gross)',
    'Weight (Net)',
    'Bin Size',
    'Bin Type',
    'Clinical Barcode Scan',
    'Location',
    'Estimated $',
    'Emissions'
  ];
}

/**
 * "Select All" checkbox logic
 */
function selectAllRows() {
  const isChecked = document.getElementById('selectAll').checked;
  document.querySelectorAll('.rowSelector').forEach(checkbox => {
    checkbox.checked = isChecked;
  });
}

/**
 * Show/hide filter dropdown
 */
function toggleFilterDropdown(dropdownId, event) {
  event.stopPropagation();
  const dropdown = document.getElementById(dropdownId);
  const isCurrentlyOpen = dropdown.classList.contains('show');

  closeAllDropdowns();

  if (!isCurrentlyOpen) {
    dropdown.classList.add('show');
    positionDropdown(dropdown, event.target);
  }
}

/**
 * Close all filter dropdowns
 */
function closeAllDropdowns() {
  const dropdowns = document.querySelectorAll('.filter-dropdown');
  dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
}

/**
 * Position the dropdown near the toggle icon
 */
function positionDropdown(dropdown, targetElement) {
  dropdown.style.top = `${targetElement.offsetHeight}px`;
  dropdown.style.right = '0';
  dropdown.style.left = 'auto';

  const rect = dropdown.getBoundingClientRect();
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  if (rect.right > viewportWidth) {
    dropdown.style.right = 'auto';
    dropdown.style.left = '0';
  }
}
