document.addEventListener('DOMContentLoaded', function () {
    const generateDataButton = document.getElementById('generateData');
    const resetDataButton = document.getElementById('resetData');
    const downloadLink = document.getElementById('downloadLink');
    const dataOutput = document.getElementById('dataOutput');
    const formatSelection = document.getElementsByName('format');
    const refreshButton = document.querySelector('.refresh-button');
    const formatCheckboxes = document.getElementsByName('format');
    const fieldCheckboxes = document.getElementsByName('field');

    // Function to handle checkbox behavior
    function handleCheckboxChange(checkbox) {
        if (checkbox.checked) {
            // Uncheck other checkboxes
            formatCheckboxes.forEach((otherCheckbox) => {
                if (otherCheckbox !== checkbox) {
                    otherCheckbox.checked = false;
                }
            });
        }
    }

    // Add change event listener to each format checkbox
    formatCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            handleCheckboxChange(checkbox);
        });
    });

    generateDataButton.addEventListener('click', function () {
        const selectedFields = getSelectedFields();
        const data = generateData(selectedFields); // Replace with your data generation logic
        const selectedFormat = getSelectedFormat();

        let formattedData;
        if (selectedFormat === 'csv') {
            formattedData = convertToCSV(data);
        } else if (selectedFormat === 'xml') {
            formattedData = convertToXML(data);
        } else if (selectedFormat === 'json') {
            formattedData = convertToJSON(data);
        } else if (selectedFormat === 'html') {
            formattedData = convertToHTML(data);
        }

        // Display the generated data on the web page
        dataOutput.textContent = formattedData;

        const blob = new Blob([formattedData], { type: 'text/plain' });
        downloadLink.href = 'data:text/html,' + encodeURIComponent(formattedData);
        // downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `generated_data.${selectedFormat}`;
        downloadLink.style.display = 'block';

        // Show the refresh button
        refreshButton.style.display = 'block';

        // Set dataOutput to display block
        dataOutput.style.display = 'block';
    });

    resetDataButton.addEventListener('click', function () {
        // Clear the dataOutput when the Reset button is clicked
        clearDataOutput();

        // Uncheck all field checkboxes
        fieldCheckboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });
    });

    refreshButton.addEventListener('click', function () {
        const selectedFields = getSelectedFields();
        const data = generateData(selectedFields);
        const selectedFormat = getSelectedFormat();

        let formattedData;
        if (selectedFormat === 'csv') {
            formattedData = convertToCSV(data);
        } else {
            formattedData = convertToXML(data);
        }

        dataOutput.textContent = formattedData;
        refreshButton.style.display = 'inline-block';
    });

    function clearDataOutput() {

        // Uncheck all format checkboxes
        formatCheckboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });

        // Clear the content of the dataOutput element
        dataOutput.textContent = '';

        // Hide the download link
        downloadLink.style.display = 'none';
        refreshButton.style.display = 'none';
        dataOutput.style.display = 'none';
    }


    function getSelectedFields() {
        const checkboxes = document.getElementsByName('field');
        const selectedFields = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        return selectedFields;
    }

    function getSelectedFormat() {
        const selectedFormat = [...formatSelection].find(input => input.checked);
        return selectedFormat.value;
    }

    function generateData(selectedFields) {
        // Replace this with your dataset generation logic
        // Example: Generating a simple dataset
        const data = [];
        for (let i = 0; i < 2000; i++) {
            const name = faker.name.findName(); // Generate a random name
            const age = Math.floor(Math.random() * 50 + 18); // Random age between 18 and 67
            const email = faker.internet.email();
            const nationality = faker.address.country(); // Generate a random nationality
            const jobTitle = faker.name.jobTitle();

            data.push([name, age, email, nationality, jobTitle]);
        }

        const filteredData = data.map(row => selectedFields.map(field => {
            return field === 'Name' ? row[0] : field === 'Age' ? row[1] : field === 'Email' ? row[2] :
                field === 'Nationality' ? row[3] : row[4]
        }));
        return [selectedFields, ...filteredData];
    }

    function convertToCSV(data) {
        return data.map(row => row.join(',')).join('\n');
    }

    function convertToXML(data) {
        const selectedFields = data[0];
        const xmlData = [];

        for (let i = 1; i < data.length; i++) {
            const item = {};
            for (let j = 0; j < selectedFields.length; j++) {
                item[selectedFields[j]] = data[i][j];
            }
            xmlData.push(item);
        }

        // Convert to XML format
        const xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n' + xmlData.map(item => `<item>\n${Object.entries(item).map(([key, value]) => `<${key}>${value}</${key}>\n`).join('')}</item>`).join('\n') + '\n</data>';
        return xmlString;
    }

    function convertToJSON(data) {
        return JSON.stringify(data, null, 2);
    }

    function convertToHTML(data) {
        // Create an HTML table based on the data
        const selectedFields = data[0];
        const tableRows = data.slice(1).map(row => {
            return `<tr>${selectedFields.map((field, index) => `<td>${row[index]}</td>`).join('')}</tr>`;
        });

        const htmlTable = `
            <table>
                <thead>
                    <tr>${selectedFields.map(field => `<th>${field}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${tableRows.join('')}
                </tbody>
            </table>
        `;

        // Create a simple HTML document with the table
        const htmlDocument = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Generated Data</title>
            </head>
            <body>
                <h1>Generated Data</h1>
                ${htmlTable}
            </body>
            </html>
        `;

        return htmlDocument;
    }
});
