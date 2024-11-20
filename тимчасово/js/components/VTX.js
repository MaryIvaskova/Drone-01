import { createTable } from '..Table.js';
import { createForm } from '..Form.js';

export function createVTXTable() {
    const headers = ['Модель', 'Частота', 'Потужність', 'Ціна', 'ID'];
    const { table, tbody } = createTable(headers);

    return { table, tbody };
}

export function createVTXForm(submitCallback) {
    const fields = [
        { label: 'Модель', id: 'model', required: true },
        { label: 'Частота', id: 'frequency', required: true },
        { label: 'Потужність', id: 'power', required: true },
        { label: 'Ціна', id: 'price', required: true },
    ];

    return createForm(fields, submitCallback);
}