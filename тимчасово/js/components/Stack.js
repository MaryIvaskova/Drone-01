import { createTable } from '..Table.js';
import { createForm } from '..Form.js';

export function createStackTable() {
    const headers = ['Модель', 'Виходи', 'Потужність', 'Ціна', 'ID'];
    const { table, tbody } = createTable(headers);

    return { table, tbody };
}

export function createStackForm(submitCallback) {
    const fields = [
        { label: 'Модель', id: 'model', required: true },
        { label: 'Виходи', id: 'outputs', required: true },
        { label: 'Потужність', id: 'power', required: true },
        { label: 'Ціна', id: 'price', required: true },
    ];

    return createForm(fields, submitCallback);
}