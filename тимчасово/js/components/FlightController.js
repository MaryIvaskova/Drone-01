import { createTable } from '..Table.js';
import { createForm } from '..Form.js';

export function createFlightControllerTable() {
    const headers = ['Модель', 'Виходи', 'Сенсори', 'Ціна', 'ID'];
    const { table, tbody } = createTable(headers);

    return { table, tbody };
}

export function createFlightControllerForm(submitCallback) {
    const fields = [
        { label: 'Модель', id: 'model', required: true },
        { label: 'Виходи', id: 'outputs', required: true },
        { label: 'Сенсори', id: 'sensors', required: true },
        { label: 'Ціна', id: 'price', required: true },
    ];

    return createForm(fields, submitCallback);
}