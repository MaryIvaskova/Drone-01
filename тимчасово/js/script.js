import { fillTable } from './components/tableHandler.js';
import { setupForm } from './components/formHandler.js';

document.addEventListener('DOMContentLoaded', () => {
    if (document.body.id === 'droneNeedsPage') {
        fillTable('drone-needs', 'droneNeedsTable');
        setupForm('addDroneNeedForm', 'drone-needs', 'droneNeedsTable');
    }
});
// Перевірка, на якій сторінці перебуває користувач, і виклик відповідних функцій
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.id === 'droneNeedsPage') {
        fillTable('drone-needs', 'droneNeedsTable');
        setupForm('addDroneNeedForm', 'drone-needs');
    } else if (document.body.id === 'suppliersPage') {
        fillTable('suppliers', 'suppliersTable');
        setupForm('addSupplierForm', 'suppliers');
    } else if (document.body.id === 'inventoryPage') {
        fillTable('inventory', 'inventoryTable');
        setupForm('addInventoryForm', 'inventory');
    } else if (document.body.id === 'readyDronesPage') {
        fillTable('ready-drones', 'readyDronesTable');
        setupForm('addReadyDroneForm', 'ready-drones');
    } else if (document.body.id === 'monthlyReportPage') {
        fillTable('monthly-report', 'monthlyReportTable');
    }
});