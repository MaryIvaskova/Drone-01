import { createTable } from '..Table.js';
import { createForm } from '..Form.js';

export function createSpeedControllerTable() {
    const headers = ['Модель', 'Токи', 'Потужність', 'Ціна', 'ID'];
    const { table, tbody } = createTable(headers);

    return { table, tbody };
}

export function createSpeedControllerForm(submitCallback) {
    const fields = [
        { label: 'Модель', id: 'model', required: true },
        { label: 'Токи', id: 'current', required: true },
        { label: 'Потужність', id: 'power', required: true },
        { label: 'Ціна', id: 'price', required: true },
    ];

    return createForm(fields, submitCallback);
}