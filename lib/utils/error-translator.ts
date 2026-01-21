/**
 * Utility to translate API errors into user-friendly Spanish messages
 */

interface ApiError {
  response?: {
    status?: number
    data?: any
  }
  message?: string
  code?: string
}

interface FieldError {
  [field: string]: string[]
}

/**
 * Translates common API error messages to Spanish
 */
function translateErrorMessage(message: string, field?: string): string {
  const lowerMessage = message.toLowerCase()

  // Common field validation errors
  if (lowerMessage.includes('this field is required') || lowerMessage.includes('required')) {
    const fieldNames: { [key: string]: string } = {
      name: 'El nombre',
      team: 'El equipo',
      team_id: 'El equipo',
      team_name: 'El nombre del equipo',
      description: 'La descripción',
      email: 'El correo electrónico',
      repository_url: 'La URL del repositorio',
      url: 'La URL del proyecto',
      project_url: 'La URL del proyecto',
    }
    const fieldName = field ? (fieldNames[field] || field) : 'Este campo'
    return `${fieldName} es requerido`
  }

  if (lowerMessage.includes('this field may not be blank') || lowerMessage.includes('may not be blank')) {
    const fieldNames: { [key: string]: string } = {
      name: 'El nombre',
      team_name: 'El nombre del equipo',
      description: 'La descripción',
    }
    const fieldName = field ? (fieldNames[field] || field) : 'Este campo'
    return `${fieldName} no puede estar vacío`
  }

  if (lowerMessage.includes('enter a valid url') || lowerMessage.includes('invalid url')) {
    if (field === 'repository_url') {
      return 'La URL del repositorio no es válida. Debe comenzar con http:// o https://'
    }
    if (field === 'url' || field === 'project_url') {
      return 'La URL del proyecto no es válida. Debe comenzar con http:// o https://'
    }
    return 'La URL no es válida'
  }

  if (lowerMessage.includes('enter a valid email') || lowerMessage.includes('invalid email')) {
    return 'El correo electrónico no es válido'
  }

  if (lowerMessage.includes('already exists') || lowerMessage.includes('duplicate')) {
    if (field === 'name' || field === 'team_name') {
      return 'Ya existe un registro con este nombre'
    }
    if (field === 'email') {
      return 'Este correo electrónico ya está registrado'
    }
    return 'Este registro ya existe'
  }

  if (lowerMessage.includes('invalid pk') || lowerMessage.includes('does not exist')) {
    if (field === 'team' || field === 'team_id') {
      return 'El equipo seleccionado no existe o no es válido'
    }
    return 'El registro seleccionado no existe'
  }

  if (lowerMessage.includes('permission denied') || lowerMessage.includes('forbidden')) {
    return 'No tienes permisos para realizar esta acción'
  }

  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('authentication')) {
    return 'Tu sesión ha expirado. Por favor inicia sesión nuevamente'
  }

  if (lowerMessage.includes('not found')) {
    return 'El recurso solicitado no fue encontrado'
  }

  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return 'La solicitud tardó demasiado tiempo. Por favor intenta nuevamente'
  }

  if (lowerMessage.includes('network') || lowerMessage.includes('connection')) {
    return 'Error de conexión. Verifica tu internet e intenta nuevamente'
  }

  // Return original message if no translation found
  return message
}

/**
 * Extracts and translates field-specific errors from API response
 */
function extractFieldErrors(data: any): { field: string; message: string }[] {
  const errors: { field: string; message: string }[] = []

  if (!data) return errors

  // Handle different error response formats
  if (typeof data === 'object') {
    Object.keys(data).forEach((field) => {
      const fieldErrors = data[field]

      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach((error) => {
          if (typeof error === 'string') {
            errors.push({
              field,
              message: translateErrorMessage(error, field),
            })
          }
        })
      } else if (typeof fieldErrors === 'string') {
        errors.push({
          field,
          message: translateErrorMessage(fieldErrors, field),
        })
      }
    })
  }

  return errors
}

/**
 * Main function to translate API errors into user-friendly Spanish messages
 * 
 * @param error - The error object from the API call
 * @returns A user-friendly error message in Spanish
 * 
 * @example
 * try {
 *   await api.post('/teams/', data)
 * } catch (error) {
 *   const message = translateApiError(error)
 *   toast.error(message)
 * }
 */
export function translateApiError(error: any): string {
  const apiError = error as ApiError

  // Network errors
  if (!apiError.response) {
    if (apiError.code === 'ECONNABORTED' || apiError.message?.includes('timeout')) {
      return 'La solicitud tardó demasiado tiempo. Por favor intenta nuevamente'
    }
    if (apiError.code === 'ERR_NETWORK' || apiError.message?.includes('Network Error')) {
      return 'Error de conexión. Verifica tu internet e intenta nuevamente'
    }
    return 'Error de conexión con el servidor. Por favor intenta nuevamente'
  }

  const status = apiError.response.status
  const data = apiError.response.data

  // Handle HTTP status codes
  switch (status) {
    case 400: {
      // Bad Request - usually validation errors
      const fieldErrors = extractFieldErrors(data)

      if (fieldErrors.length > 0) {
        // Return the first field error
        return fieldErrors[0].message
      }

      // Check for detail or message in response
      if (data?.detail) {
        return translateErrorMessage(data.detail)
      }
      if (data?.message) {
        return translateErrorMessage(data.message)
      }

      return 'Los datos enviados no son válidos. Por favor verifica la información'
    }

    case 401:
      return 'Tu sesión ha expirado. Por favor inicia sesión nuevamente'

    case 403:
      return 'No tienes permisos para realizar esta acción'

    case 404:
      return 'El recurso solicitado no fue encontrado'

    case 409:
      return 'Ya existe un registro con estos datos'

    case 422:
      return 'Los datos enviados no son válidos. Por favor verifica la información'

    case 429:
      return 'Has realizado demasiadas solicitudes. Por favor espera un momento e intenta nuevamente'

    case 500:
      return 'Error del servidor. Por favor intenta nuevamente en unos momentos'

    case 502:
    case 503:
    case 504:
      return 'El servidor no está disponible. Por favor intenta nuevamente más tarde'

    default:
      // Try to extract error message from response
      if (data?.detail) {
        return translateErrorMessage(data.detail)
      }
      if (data?.message) {
        return translateErrorMessage(data.message)
      }
      return 'Ocurrió un error inesperado. Por favor intenta nuevamente'
  }
}

/**
 * Extracts all field errors from an API error response
 * Useful for displaying multiple validation errors
 * 
 * @param error - The error object from the API call
 * @returns Array of field errors with translated messages
 */
export function getFieldErrors(error: any): { field: string; message: string }[] {
  const apiError = error as ApiError

  if (!apiError.response?.data) {
    return []
  }

  return extractFieldErrors(apiError.response.data)
}
