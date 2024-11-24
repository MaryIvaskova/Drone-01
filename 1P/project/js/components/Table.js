export const renderTable = (containerId, data, columns) => {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Очистка таблиці перед рендерингом

    data.forEach((row) => {
        const tr = document.createElement("tr");
        columns.forEach((column) => {
            const td = document.createElement("td");
            td.textContent = row[column];
            tr.appendChild(td);
        });
        container.appendChild(tr);
    });
};