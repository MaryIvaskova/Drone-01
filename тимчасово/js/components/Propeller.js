import { createTable } from '..Table.js';
import { createForm } from '..Form.js';

export function createPropellerTable() {
    const headers = ['Модель', 'Розмір', 'Матеріал', 'Ціна', 'ID'];
    const { table, tbody } = createTable(headers);

    return { table, tbody };
}

export function createPropellerForm(submitCallback) {
    const fields = [
        { label: 'Модель', id: 'model', required: true },
        { label: 'Розмір', id: 'size', required: true },
        { label: 'Матеріал', id: 'material', required: true },
        { label: 'Ціна', id: 'price', required: true },
    ];

    return createForm(fields, submitCallback);
}