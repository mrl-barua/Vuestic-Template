export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export const validateField = (value: any, rules: ValidationRule): ValidationResult => {
  const errors: string[] = []

  // Required validation
  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push('This field is required')
  }

  // Skip other validations if value is empty and not required
  if (!value || value.toString().trim() === '') {
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Min length validation
  if (rules.minLength && value.toString().length < rules.minLength) {
    errors.push(`Minimum length is ${rules.minLength} characters`)
  }

  // Max length validation
  if (rules.maxLength && value.toString().length > rules.maxLength) {
    errors.push(`Maximum length is ${rules.maxLength} characters`)
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value.toString())) {
    errors.push('Invalid format')
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value)
    if (customError) {
      errors.push(customError)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateForm = (data: Record<string, any>, schema: Record<string, ValidationRule>): ValidationResult => {
  const errors: string[] = []
  let isValid = true

  for (const [field, rules] of Object.entries(schema)) {
    const result = validateField(data[field], rules)
    if (!result.isValid) {
      isValid = false
      errors.push(`${field}: ${result.errors.join(', ')}`)
    }
  }

  return {
    isValid,
    errors
  }
}

// Common validation rules
export const commonRules = {
  required: { required: true },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      if (!/(?=.*[a-z])/.test(value)) {
        return 'Password must contain at least one lowercase letter'
      }
      if (!/(?=.*[A-Z])/.test(value)) {
        return 'Password must contain at least one uppercase letter'
      }
      if (!/(?=.*\d)/.test(value)) {
        return 'Password must contain at least one number'
      }
      return null
    }
  },
  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/
  },
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/
  }
}

// Helper function to get first error for a field
export const getFieldError = (field: string, validationResult: ValidationResult): string | null => {
  const fieldError = validationResult.errors.find(error => 
    error.startsWith(`${field}:`)
  )
  return fieldError ? fieldError.replace(`${field}: `, '') : null
}
