/***********************************
 * FULL JS CODE (no HTML included)
 ************************************/

/* 
   Google Sheets configuration:
   - Update SPREADSHEET_ID
   - Update SITE_GID_MAP as needed
*/
const SPREADSHEET_ID = '1NKMZLWZyorzKHbL-uISb8eEFUFjgGfGoUA_UAKizzAI';
const SITE_GID_MAP = {
    'VCCC': '841396830',
    'Box Hill': '494600588',
    'Wantirna': '1825774984',
    'Burwood': '294019943',
    'Ferntree Gully': '267580033',
    'Maroonda': '191428538',
    'Murenda': '1654220950'
};

// Add list of sites to hide from display
const HIDDEN_SITES = ['VCCC'];

// Data arrays
let allData = [];
let filteredData = [];

// Pagination
let currentPage = 1;
let entriesPerPage = 'All';

// Sorting
let currentDateSort = 'newest';

/**
 * Helper function for consistent site name display
 */
function getSiteDisplayName(site) {
    if (site === 'Ferntree Gully') return 'Angliss';
    if (site === 'Maroonda') return 'Maroondah';
    return site;
}

/**
 * Initialize everything once DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize flatpickr with all options explicitly set
    flatpickr("#dateRangePicker", {
        mode: "range",
        dateFormat: "d-m-Y",
        allowInput: true,
        clickOpens: true,
        enableTime: false,
        defaultHour: 0,
        position: "below",
        static: false,
        onClose: function (selectedDates) {
            if (selectedDates.length === 1) {
                document.getElementById('startDate').value = formatDateForFiltering(selectedDates[0]);
                document.getElementById('endDate').value = formatDateForFiltering(selectedDates[0]);
            } else if (selectedDates.length === 2) {
                document.getElementById('startDate').value = formatDateForFiltering(selectedDates[0]);
                document.getElementById('endDate').value = formatDateForFiltering(selectedDates[1]);
            }
        }
    });

    // Hook up the search input
    document.getElementById('search').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filteredData = allData.filter(row =>
            Object.values(row).some(value =>
                value.toString().toLowerCase().includes(searchTerm)
            )
        );
        sortDataByDate();
        currentPage = 1;
        updateTable();
    });

    // Clear data button
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

    // Entries per page selector
    document.getElementById('entriesPerPage').addEventListener('change', (e) => {
        if (e.target.value === 'All') {
            entriesPerPage = 'All';
        } else {
            entriesPerPage = parseInt(e.target.value);
        }
        currentPage = 1;
        updateTable();
    });

    // Date sort filter
    document.getElementById('dateSortFilter').addEventListener('change', (e) => {
        currentDateSort = e.target.value;
        sortDataByDate();
        updateTable();
    });

    // Copy button
    document.getElementById('copyButton').addEventListener('click', copySelectedRows);

    // Excel export button
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

    // Close dropdown if user clicks outside
    document.addEventListener('click', (event) => {
        if (
            !event.target.closest('.filter-icon') &&
            !event.target.closest('.filter-dropdown')
        ) {
            closeAllDropdowns();
        }
    });

    // Initialize table and filters (empty at first)
    updateTable();
    populateFilters();
});

/**
 * Convert a JS Date object to YYYY-MM-DD string for hidden fields
 */
function formatDateForFiltering(dateObj) {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${year}-${month}-${day}`;
}

/**
 * Parse a date in d-m-yyyy format into a Date object (or null)
 */
function parseDate(dateString) {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('-');
    const parsedDate = new Date(year, month - 1, day);
    if (!isNaN(parsedDate)) {
        return parsedDate;
    }
    console.error(`Failed to parse date: ${dateString}`);
    return null;
}

/**
 * Main function to fetch data from Google Sheets for the specified site(s) and date range
 */
async function fetchData() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const site = document.getElementById('siteSelector').value;

    if (!startDate || !endDate || !site) {
        alert('Please select start date, end date, and site.');
        return;
    }

    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block';

    try {
        // If "All Sites" selected, fetch them all; otherwise, just the chosen one
        let sitesToFetch = [];
        if (site === 'All Sites') {
            sitesToFetch = Object.keys(SITE_GID_MAP);
        } else {
            sitesToFetch = [site];
        }

        allData = [];

        // Fetch data from each site
        for (const currentSite of sitesToFetch) {
            const gid = SITE_GID_MAP[currentSite];
            if (!gid) {
                console.warn(`Invalid site: ${currentSite}`);
                continue;
            }

            const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=xlsx&gid=${gid}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const arrayBuffer = await response.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);

            // Parse XLSX
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Process data
            if (jsonData && jsonData.length > 0) {
                const processedSiteData = jsonData.map(row => {
                    let parsedDate = parseDate(row.Date);
                    const binType = (row['BIN TYPE'] || '').trim();
                    const binSize = (row['BIN SIZE'] || '').trim();
                    const netWeight = calculateNetWeight(parseFloat(row['Weight( kg)'] || 0), binSize);
                    const cost = calculateCost(binSize, netWeight, binType);
                    const emissions = calculateEmissions(binType, netWeight);

                    return {
                        Site: currentSite === 'Maroonda' ? 'Maroondah' : currentSite,
                        Date: parsedDate,
                        Time: row.Time || '',
                        'Weight (Gross)': parseFloat(row['Weight( kg)'] || 0),
                        'Weight (Net)': netWeight,
                        'Bin Size': binSize,
                        'Bin Type': binType,
                        'Clinical Barcode Scan': row['Scan'] || '',
                        'Location': '',
                        'Estimated $': cost,
                        'Emissions': emissions
                    };
                });

                allData = allData.concat(processedSiteData);
            }
        }

        // Filter by start/end date
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        startDateObj.setHours(0, 0, 0, 0);
        endDateObj.setHours(23, 59, 59, 999);

        filteredData = allData.filter(row => {
            if (!row.Date) {
                return false;
            }
            return row.Date >= startDateObj && row.Date <= endDateObj;
        });

        // Filter out hidden sites
        filteredData = filteredData.filter(row => !HIDDEN_SITES.includes(row.Site));

        // Sort + update
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
 * Calculate net weight given a bin size (subtracting bin tare weight)
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
 * Calculate estimated cost based on binType/binSize/netWeight
 */
function calculateCost(binSize, netWeight, binType) {
    if (!binType) return 0;

    switch (binType.toUpperCase()) {
        case 'GENERAL':
            // $/kg = 0.2233, plus lift charge depending on bin size
            switch (binSize) {
                case '660L':
                    return (netWeight * 0.2233) + 7.60;
                case '1100L':
                    return (netWeight * 0.2233) + 23.57;
                default:
                    return 0;
            }
        case 'ORGANICS':
            // 120L flat cost
            if (binSize === '120L') {
                return 21.34;
            }
            return 0;
        case 'COMMINGLED':
            // 240L or 660L
            switch (binSize) {
                case '240L':
                    return 11.76;
                case '660L':
                    return 18.86;
                default:
                    return 0;
            }
        case 'CLINICAL':
            // base price + (excess weight * 2.54) if > included weight
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
            if (netWeight <= includedWeight) {
                return basePrice;
            }
            const excessWeight = netWeight - includedWeight;
            return basePrice + (excessWeight * excessPrice);
        default:
            return 0;
    }
}

/**
 * Calculate emissions based on bin type and weight
 */
function calculateEmissions(binType, weight) {
    if (!binType || !weight) return 0;
    const emissionsFactors = {
        'CLINICAL': 2.9,
        'COMMINGLED': 0.04,
        'ORGANICS': 1.9,
        'PAPER': 0.03,
        'GENERAL': 1.1
    };
    const factor = emissionsFactors[binType.toUpperCase()] || 0;
    return weight * factor;
}

/**
 * Sort the filtered data by date (newest first or oldest first)
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
 * Render the table rows based on filteredData and current page
 */
function updateTable() {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';

    // Determine which rows to show for this page
    const pageData = (entriesPerPage === 'All') ? filteredData : getPageData();

    pageData.forEach(row => {
        const tr = document.createElement('tr');

        // Handle Clinical Barcode Scan + Location
        let clinicalBarcode = '';
        let location = '';
        let displaySite = getSiteDisplayName(row.Site);

        // For Murenda, always move Scan data to Location
        if (row.Site === 'Murenda') {
            location = row['Clinical Barcode Scan'] || '';
            clinicalBarcode = '';
        } else if (row['Bin Type']?.toUpperCase() === 'CLINICAL') {
            clinicalBarcode = row['Clinical Barcode Scan'] || '';
        }

        tr.innerHTML = `
            <td><input type="checkbox" class="rowSelector"></td>
            <td>${displaySite}</td>
            <td>${row.Date ? row.Date.toLocaleDateString('en-GB') : 'Invalid Date'}</td>
            <td>${row.Time}</td>
            <td>${formatNumber(row['Weight (Gross)'])}</td>
            <td>${formatNumber(row['Weight (Net)'])}</td>
            <td>${row['Bin Size']}</td>
            <td>${row['Bin Type']}</td>
            <td>${clinicalBarcode}</td>
            <td>${location}</td>
            <td>$${formatNumber(row['Estimated $'])}</td>
            <td>${formatNumber(row.Emissions)}</td>
        `;
        tableBody.appendChild(tr);
    });

    updateTotals();
    updatePagination();
    updateRecordCount();
}

/**
 * Return only the data for the current page
 */
function getPageData() {
    if (entriesPerPage === 'All') {
        return filteredData;
    }
    const start = (currentPage - 1) * entriesPerPage;
    const end = start + entriesPerPage;
    return filteredData.slice(start, end);
}

/**
 * Update the totals row in the table footer
 */
function updateTotals() {
    const totals = filteredData.reduce((acc, row) => {
        acc['Weight (Gross)'] += parseFloat(row['Weight (Gross)']) || 0;
        acc['Weight (Net)'] += parseFloat(row['Weight (Net)']) || 0;
        acc['Estimated $'] += parseFloat(row['Estimated $']) || 0;
        acc.Emissions += parseFloat(row.Emissions) || 0;
        return acc;
    }, { 'Weight (Gross)': 0, 'Weight (Net)': 0, 'Estimated $': 0, Emissions: 0 });

    const totalRow = document.getElementById('totalRow');
    totalRow.innerHTML = `
        <td colspan="4"><strong>Total</strong></td>
        <td>${formatNumber(totals['Weight (Gross)'])}</td>
        <td>${formatNumber(totals['Weight (Net)'])}</td>
        <td colspan="4"></td>
        <td>$${formatNumber(totals['Estimated $'])}</td>
        <td>${formatNumber(totals.Emissions)}</td>
    `;
}

/**
 * Update pagination controls (<<, Page X of Y, >>)
 */
function updatePagination() {
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';

    if (entriesPerPage === 'All') {
        return;
    }

    const totalPages = Math.ceil(filteredData.length / entriesPerPage);

    // Back button
    const backButton = document.createElement('button');
    backButton.innerHTML = '&larr;';
    backButton.disabled = currentPage === 1;
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

    // Forward button
    const forwardButton = document.createElement('button');
    forwardButton.innerHTML = '&rarr;';
    forwardButton.disabled = currentPage === totalPages;
    forwardButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateTable();
        }
    });
    paginationElement.appendChild(forwardButton);
}

/**
 * Update "Showing X to Y of Z entries" text
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
 * Populate bin size and bin type filters with available options
 */
function populateFilters() {
    const binSizes = [...new Set(filteredData.map(row => row['Bin Size']))].filter(Boolean);
    const binTypes = [...new Set(filteredData.map(row => row['Bin Type']))].filter(Boolean);

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
 * Apply bin size and bin type filters
 */
function applyFilters() {
    const selectedBinSizes = Array.from(document.querySelectorAll('#binSizeFilterDropdown input:checked'))
        .map(input => input.value);
    const selectedBinTypes = Array.from(document.querySelectorAll('#binTypeFilterDropdown input:checked'))
        .map(input => input.value);

    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    filteredData = allData.filter(row => {
        return (
            row.Date >= startDate &&
            row.Date <= endDate &&
            selectedBinSizes.includes(row['Bin Size']) &&
            selectedBinTypes.includes(row['Bin Type']) &&
            !HIDDEN_SITES.includes(row.Site)
        );
    });

    sortDataByDate();
    currentPage = 1;
    updateTable();
}

/**
 * Utility function to format numbers with commas and 2 decimal places
 */
function formatNumber(num) {
    if (isNaN(num)) return '0.00';
    let formattedNum = parseFloat(num).toFixed(2);
    let parts = formattedNum.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
}

/**
 * Copy selected rows to clipboard as tab-delimited text
 */
function copySelectedRows() {
    const selectedRows = getSelectedRows();
    if (selectedRows.length === 0) {
        alert('No rows selected.');
        return;
    }

    // Create header row
    const headers = getTableHeaders().join('\t');

    // Create row content
    const rowsContent = selectedRows.map(row => {
        // Create a copy with conditional Clinical Barcode Scan
        const rowCopy = { ...row };
        rowCopy.Site = getSiteDisplayName(rowCopy.Site);

        if (row.Site === 'Murenda') {
            // For Murenda, put Scan data into Location
            rowCopy['Location'] = row['Clinical Barcode Scan'] || '';
            rowCopy['Clinical Barcode Scan'] = '';
        } else if (row['Bin Type']?.toUpperCase() !== 'CLINICAL') {
            // If not clinical, clear out Clinical Barcode
            rowCopy['Clinical Barcode Scan'] = '';
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
 * Download selected rows as an Excel file
 * Uses SheetJS (xlsx)
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

        // Build 2D array (AOA) for XLSX
        const data = [headers];
        for (let row of selectedRows) {
            const rowData = headers.map(header => {
                if (header === 'Site') {
                    return getSiteDisplayName(row.Site || '');
                }
                if (header === 'Date') {
                    return row[header] instanceof Date
                        ? row[header].toLocaleDateString('en-GB')
                        : (row[header] || '');
                }
                if (header === 'Clinical Barcode Scan') {
                    return row['Bin Type']?.toUpperCase() === 'CLINICAL'
                        ? (row[header] || '')
                        : '';
                }
                if (header === 'Location') {
                    return (row.Site === 'Murenda')
                        ? (row['Clinical Barcode Scan'] || '')
                        : '';
                }
                return row[header] !== undefined ? formatExcelNumber(row[header]) : '';
            });
            data.push(rowData);
        }

        if (typeof XLSX === 'undefined') {
            throw new Error('XLSX library is not loaded. Make sure to include it in your HTML.');
        }

        // Convert AOA to Sheet, create Workbook, and write file
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ScalerData");

        const filename = `ScalerData_${new Date()
            .toISOString()
            .slice(0, 19)
            .replace(/[-T:]/g, "")}.xlsx`;
        XLSX.writeFile(wb, filename);

    } catch (error) {
        console.error('Error in downloadExcel function:', error);
        alert('An error occurred while trying to download the Excel file. See console for details.');
    }
}

/**
 * Convert numeric strings to numbers in the exported Excel file
 * so Excel cells remain numeric
 */
function formatExcelNumber(value) {
    if (typeof value === 'number') return value;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? value : parsed;
}

/**
 * Get all currently selected (checked) rows in the data table
 */
function getSelectedRows() {
    const selectedRows = [];
    // We rely on the rendered table order to match filteredData order
    const rowCheckboxes = document.querySelectorAll('#dataTable tbody .rowSelector');
    rowCheckboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            selectedRows.push(filteredData[index]);
        }
    });
    return selectedRows;
}

/**
 * Table headers for copying or exporting
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
 * Position the dropdown below the clicked icon or header
 */
function positionDropdown(dropdown, targetElement) {
    const th = targetElement.closest('th') || targetElement; 
    dropdown.style.top = `${th.offsetHeight}px`;
    dropdown.style.right = '0';
    dropdown.style.left = 'auto';

    const rect = dropdown.getBoundingClientRect();
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    if (rect.right > viewportWidth) {
        dropdown.style.right = 'auto';
        dropdown.style.left = '0';
    }
}
