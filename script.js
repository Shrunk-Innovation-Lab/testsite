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

let allData = [];
let currentPage = 1;
let entriesPerPage = 'All';
let filteredData = [];
let currentDateSort = 'newest';

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
        onClose: function(selectedDates, dateStr, instance) {
            if (selectedDates.length === 1) {
                document.getElementById('startDate').value = formatDateForFiltering(selectedDates[0]);
                document.getElementById('endDate').value = formatDateForFiltering(selectedDates[0]);
            } else if (selectedDates.length === 2) {
                document.getElementById('startDate').value = formatDateForFiltering(selectedDates[0]);
                document.getElementById('endDate').value = formatDateForFiltering(selectedDates[1]);
            }
        }
    });

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

    document.getElementById('fetchData').addEventListener('click', fetchData);

    document.getElementById('entriesPerPage').addEventListener('change', (e) => {
        if (e.target.value === 'All') {
            entriesPerPage = 'All';
        } else {
            entriesPerPage = parseInt(e.target.value);
        }
        currentPage = 1;
        updateTable();
    });

    document.getElementById('dateSortFilter').addEventListener('change', (e) => {
        currentDateSort = e.target.value;
        sortDataByDate();
        updateTable();
    });

    document.getElementById('copyButton').addEventListener('click', copySelectedRows);
    document.getElementById('csvButton').addEventListener('click', downloadExcel);
    
    document.getElementById('selectAll').addEventListener('change', selectAllRows);

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

    updateTable();
    populateFilters();
});

function formatDateForFiltering(dateObj) {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${year}-${month}-${day}`;
}

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
        let sitesToFetch = [];
        if (site === 'All Sites') {
            sitesToFetch = Object.keys(SITE_GID_MAP);
        } else {
            sitesToFetch = [site];
        }

        allData = [];

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
            const workbook = XLSX.read(data, {type: 'array'});

            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

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
                        'Estimated $': cost,
                        'Emissions': emissions
                    };
                });

                allData = allData.concat(processedSiteData);
            }
        }

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

        // Filter out hidden sites from display
        filteredData = filteredData.filter(row => !HIDDEN_SITES.includes(row.Site));

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

function calculateNetWeight(grossWeight, binSize) {
    switch (binSize) {
        case '80L': return Math.max(0, grossWeight - 8.5);
        case '120L': return Math.max(0, grossWeight - 9.3);
        case '240L': return Math.max(0, grossWeight - 12.5);
        case '660L': return Math.max(0, grossWeight - 43);
        case '1100L': return Math.max(0, grossWeight - 65);
        default: 
            return grossWeight;
    }
}

function calculateCost(binSize, netWeight, binType) {
    if (!binType) return 0;

    switch (binType.toUpperCase()) {
        case 'GENERAL':
            switch (binSize) {
                case '660L':
                    return (netWeight * 0.2233) + 7.60;
                case '1100L':
                    return (netWeight * 0.2233) + 23.57;
                default:
                    return 0;
            }
        case 'ORGANICS':
            if (binSize === '120L') {
                return 21.34;
            }
            return 0;
        case 'COMMINGLED':
            switch (binSize) {
                case '240L':
                    return 11.76;
                case '660L':
                    return 18.86;
                default:
                    return 0;
            }
        case 'CLINICAL':
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

function sortDataByDate() {
    filteredData.sort((a, b) => {
        if (currentDateSort === 'newest') {
            return b.Date - a.Date;
        } else {
            return a.Date - b.Date;
        }
    });
}

function updateTable() {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';

    const pageData = entriesPerPage === 'All' ? filteredData : getPageData();

    pageData.forEach(row => {
        const tr = document.createElement('tr');
        // Only show Clinical Barcode Scan if Bin Type is CLINICAL
        const clinicalBarcode = row['Bin Type']?.toUpperCase() === 'CLINICAL' ? row['Clinical Barcode Scan'] : '';
        
        tr.innerHTML = `
            <td><input type="checkbox" class="rowSelector"></td>
            <td>${row.Site}</td>
            <td>${row.Date ? row.Date.toLocaleDateString('en-GB') : 'Invalid Date'}</td>
            <td>${row.Time}</td>
            <td>${formatNumber(row['Weight (Gross)'])}</td>
            <td>${formatNumber(row['Weight (Net)'])}</td>
            <td>${row['Bin Size']}</td>
            <td>${row['Bin Type']}</td>
            <td>${clinicalBarcode}</td>
            <td>$${formatNumber(row['Estimated $'])}</td>
            <td>${formatNumber(row.Emissions)}</td>
        `;
        tableBody.appendChild(tr);
    });

    updateTotals();
    updatePagination();
    updateRecordCount();
}

function getPageData() {
    if (entriesPerPage === 'All') {
        return filteredData;
    }
    const start = (currentPage - 1) * entriesPerPage;
    const end = start + entriesPerPage;
    return filteredData.slice(start, end);
}

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
        <td colspan="3"></td>
        <td>$${formatNumber(totals['Estimated $'])}</td>
        <td>${formatNumber(totals.Emissions)}</td>
    `;
}

function updatePagination() {
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';

    if (entriesPerPage === 'All') {
        return;
    }

    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
    
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

    const pageIndicator = document.createElement('span');
    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
    pageIndicator.style.margin = '0 10px';
    paginationElement.appendChild(pageIndicator);

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
        return row.Date >= startDate && 
               row.Date <= endDate && 
               selectedBinSizes.includes(row['Bin Size']) && 
               selectedBinTypes.includes(row['Bin Type']);
    });

    sortDataByDate();
    currentPage = 1;
    updateTable();
}

function formatNumber(num) {
    if (isNaN(num)) return '0.00';
    
    let formattedNum = parseFloat(num).toFixed(2);
    let parts = formattedNum.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
}

function copySelectedRows() {
    const selectedRows = getSelectedRows();
    if (selectedRows.length === 0) {
        alert('No rows selected.');
        return;
    }

    const headers = getTableHeaders().join('\t');
    const rowsContent = selectedRows.map(row => {
        // Create a copy of the row with conditional Clinical Barcode Scan
        const rowCopy = {...row};
        if (row['Bin Type']?.toUpperCase() !== 'CLINICAL') {
            rowCopy['Clinical Barcode Scan'] = '';
        }
        return Object.values(rowCopy).join('\t');
    }).join('\n');
    
    const clipboardContent = `${headers}\n${rowsContent}`;

    navigator.clipboard.writeText(clipboardContent).then(() => {
        alert('Selected data copied to clipboard.');
    });
}

function formatExcelNumber(num) {
    if (typeof num === 'number') {
        return Number(num.toFixed(2));
    }
    return num;
}

function downloadExcel() {
    try {
        const selectedRows = getSelectedRows();
        if (selectedRows.length === 0) {
            alert('No rows selected.');
            return;
        }

        const headers = getTableHeaders();

        const data = [
            headers,
            ...selectedRows.map(row => 
                headers.map(header => {
                    if (header === 'Date') {
                        return row[header] instanceof Date ? row[header].toLocaleDateString('en-GB') : row[header];
                    }
                    // Clear Clinical Barcode Scan if not CLINICAL
                    if (header === 'Clinical Barcode Scan' && row['Bin Type']?.toUpperCase() !== 'CLINICAL') {
                        return '';
                    }
                    return formatExcelNumber(row[header]);
                })
            )
        ];

        if (!XLSX) {
            throw new Error('XLSX library is not loaded');
        }

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ScalerData");

        const now = new Date();
        const filename = `ScalerData_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}.xlsx`;

        XLSX.writeFile(wb, filename);
        alert('Excel file has been downloaded.');
    } catch (error) {
        console.error('Error in downloadExcel function:', error);
        alert('An error occurred while trying to download the Excel file. Please check the console for more details.');
    }
}

function getSelectedRows() {
    const selectedRows = [];
    document.querySelectorAll('#dataTable tbody tr').forEach((row, index) => {
        const checkbox = row.querySelector('.rowSelector');
        if (checkbox && checkbox.checked) {
            selectedRows.push(filteredData[index]);
        }
    });
    return selectedRows;
}

function getTableHeaders() {
    return ['Site', 'Date', 'Time', 'Weight (Gross)', 'Weight (Net)', 'Bin Size', 'Bin Type', 'Clinical Barcode Scan', 'Estimated $', 'Emissions'];
}

function selectAllRows() {
    const isChecked = document.getElementById('selectAll').checked;
    document.querySelectorAll('.rowSelector').forEach(checkbox => {
        checkbox.checked = isChecked;
    });
}

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

function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.filter-dropdown');
    dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
}

function positionDropdown(dropdown, targetElement) {
    const th = targetElement.closest('th');
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
