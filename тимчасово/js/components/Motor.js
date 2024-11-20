import { createTable } from '..Table.js';
import { createForm } from '..Form.js';

export function createMotorTable() {
    const headers = ['Модель', 'Тип', 'Потужність', 'Ціна', 'ID'];
    const { table, tbody } = createTable(headers);

    return { table, tbody };
}

export function createMotorForm(submitCallback) {
    const fields = [
        { label: 'Модель', id: 'model', required: true },
        { label: 'Тип', id: 'type', required: true },
        { label: 'Потужність', id: 'power', required: true },
        { label: 'Ціна', id: 'price', required: true },
    ];

    return createForm(fields, submitCallback);
}