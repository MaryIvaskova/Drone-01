/**
 * Відкриття модального вікна
 * @param {string} modalId - ID модального вікна.
 */
export function openModal(modalId) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
    } else {
        console.error(`Модальне вікно з ID "${modalId}" не знайдено.`);
    }
}

/**
 * Закриття модального вікна
 * @param {string} modalId - ID модального вікна.
 */
export function closeModal(modalId) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
        }
    } else {
        console.error(`Модальне вікно з ID "${modalId}" не знайдено.`);
    }
}

/**
 * Заповнення полів форми даними для редагування
 * @param {string} formId - ID форми.
 * @param {Object} data - Дані для заповнення.
 */
export function populateForm(formId, data) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Форма з ID "${formId}" не знайдена.`);
        return;
    }

    Object.entries(data).forEach(([key, value]) => {
        const field = form.querySelector(`[name="${key}"]`);
        if (field) {
            if (field.type === "checkbox" || field.type === "radio") {
                field.checked = !!value;
            } else {
                field.value = value;
            }
        }
    });
}

/**
 * Очищення форми
 * @param {string} formId - ID форми.
 */
export function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    } else {
        console.error(`Форма з ID "${formId}" не знайдена.`);
    }
}

/**
 * Встановлення обробника для відправки форми
 * @param {string} formId - ID форми.
 * @param {Function} callback - Функція для обробки даних форми.
 */
export function setFormSubmitHandler(formId, callback) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Форма з ID "${formId}" не знайдена.`);
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        callback(data);
        resetForm(formId);
    });
}