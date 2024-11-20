import { createTable } from '..Table.js';
import { createForm } from '..Form.js';

export function createStrapTable() {
    const headers = ['Модель', 'Довжина', 'Матеріал', 'Ціна', 'ID'];
    const { table, tbody } = createTable(headers);

    return { table, tbody };
}

export function createStrapForm(submitCallback) {
    const fields = [
        { label: 'Модель', id: 'model', required: true },
        { label: 'Довжина', id: 'length', required: true },
        { label: 'Матеріал', id: 'material', required: true },
        { label: 'Ціна', id: 'price', required: true },
    ];

    return createForm(fields, submitCallback);
}