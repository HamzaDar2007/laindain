// Email validation
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password validation (min 8 chars, at least one letter and one number)
export function validatePassword(password: string): boolean {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

// Required field validation
export function validateRequired(value: any): boolean {
    if (typeof value === 'string') {
        return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
}

// Numeric validation
export function validateNumeric(value: string): boolean {
    return !isNaN(Number(value)) && value.trim() !== '';
}

// Positive number validation
export function validatePositive(value: number): boolean {
    return value > 0;
}

// Min length validation
export function validateMinLength(value: string, min: number): boolean {
    return value.length >= min;
}

// Max length validation
export function validateMaxLength(value: string, max: number): boolean {
    return value.length <= max;
}

// Account code validation
export function validateAccountCodeFormat(code: string): boolean {
    const pattern = /^\d-\d{2}-\d{3}-\d{4}$/;
    return pattern.test(code);
}

// Journal entry validation (debits must equal credits)
export function validateJournalBalance(debits: number, credits: number): boolean {
    return Math.abs(debits - credits) < 0.01; // Allow for floating point precision
}

// Form validation helper
export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

export function validateForm(
    data: Record<string, any>,
    rules: Record<string, (value: any) => string | null>
): ValidationResult {
    const errors: Record<string, string> = {};

    for (const [field, validator] of Object.entries(rules)) {
        const error = validator(data[field]);
        if (error) {
            errors[field] = error;
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}
