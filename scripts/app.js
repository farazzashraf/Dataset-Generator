document.addEventListener('DOMContentLoaded', function () {
    const generateDataButton = document.getElementById('generateData');
    const resetDataButton = document.getElementById('resetData');
    const downloadLink = document.getElementById('downloadLink');
    const dataOutput = document.getElementById('dataOutput');
    const formatSelection = document.getElementsByName('format');
    const refreshButton = document.querySelector('.refresh-button');
    const formatCheckboxes = document.getElementsByName('format');
    const fieldCheckboxes = document.getElementsByName('field');
    const notification = document.getElementById("notification");
    const dataAmountContainer = document.getElementById("dataAmountContainer");


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

        const atLeastOneColumnSelected = Array.from(fieldCheckboxes).some((checkbox) => checkbox.checked);
        const atLeastOneFileTypeSelected = Array.from(formatCheckboxes).some((checkbox) => checkbox.checked);

        if (atLeastOneColumnSelected && atLeastOneFileTypeSelected) {
            // Show the "Data Amount" input field
            dataAmountContainer.style.display = 'block';
        } else {
            // Hide the "Data Amount" input field
            dataAmountContainer.style.display = 'none';
        }
    }

    // Add change event listener to each format checkbox
    formatCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            handleCheckboxChange(checkbox);
        });
    });

    fieldCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            handleCheckboxChange(checkbox);
        });
    });

    function isDataGenerationValid() {
        const atLeastOneColumnSelected = Array.from(fieldCheckboxes).some((checkbox) => checkbox.checked);
        const atLeastOneFileTypeSelected = Array.from(formatCheckboxes).some((checkbox) => checkbox.checked);

        return atLeastOneColumnSelected && atLeastOneFileTypeSelected;
    }

    generateDataButton.addEventListener('click', function () {
        const columnsSelected = document.querySelectorAll('input[name="field"]:checked').length > 0;
        const selectedFields = getSelectedFields();
        const dataAmount = parseInt(document.getElementById('dataAmount').value); // Get the user-specified data amount
        const data = generateData(selectedFields, dataAmount); // Replace with your data generation logic
        const selectedFormat = getSelectedFormat();

        // Show the file type heading in the output
        const fileTypeHeading = document.getElementById('fileTypeHeading');
        fileTypeHeading.textContent = `${selectedFormat.toUpperCase()}`;
        fileTypeHeading.style.display = 'block';

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

        document.getElementById('dataAmount').value = '';
    });

    refreshButton.addEventListener('click', function () {
        const selectedFields = getSelectedFields();
        const dataAmount = parseInt(document.getElementById('dataAmount').value); // Get the user-specified data amount
        const data = generateData(selectedFields, dataAmount); // Regenerate the data
        const selectedFormat = getSelectedFormat();

        // Show the file type heading in the output
        const fileTypeHeading = document.getElementById('fileTypeHeading');
        fileTypeHeading.textContent = `${selectedFormat.toUpperCase()}`;
        fileTypeHeading.style.display = 'block';

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

        // Display the regenerated data on the web page
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
        fileTypeHeading.style.display = 'none';
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

    function generateData(selectedFields, dataAmount) {
        // Replace this with your dataset generation logic
        // Example: Generating a simple dataset
        if (!areColumnsAndFileTypeSelected() || !isDataAmountSpecified()) {
            showNotification('Please choose columns, file type, and specify the data amount before generating data.');
        } else {
            hideNotification();
            output.style.display = 'block';
            const data = [];
            for (let i = 0; i < dataAmount; i++) {
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

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const dataAmountInput = document.getElementById('dataAmount');
    const output = document.getElementById('output');

    function areColumnsAndFileTypeSelected() {
        const columnsSelected = Array.from(checkboxes).filter(checkbox => checkbox.name === 'field' && checkbox.checked).length > 0;
        const fileTypeSelected = Array.from(checkboxes).filter(checkbox => checkbox.name === 'format' && checkbox.checked).length > 0;
        return columnsSelected && fileTypeSelected;
    }

    function isDataAmountSpecified() {
        return dataAmountInput.value.trim() !== '';
    }

    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
    }

    function hideNotification() {
        notification.style.display = 'none';
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            hideNotification();
        });
    });

});




