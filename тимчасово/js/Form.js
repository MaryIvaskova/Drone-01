export function createForm(fields, submitCallback) {
    const form = document.createElement('form');

    fields.forEach(field => {
        const label = document.createElement('label');
        label.textContent = field.label;
        label.setAttribute('for', field.id);

        const input = document.createElement('input');
        input.type = field.type || 'text';
        input.id = field.id;
        input.name = field.name || field.id;
        input.required = field.required || false;

        form.appendChild(label);
        form.appendChild(input);
    });

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Додати запис';

    form.appendChild(submitButton);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        submitCallback(data);
    });

    return form;
}