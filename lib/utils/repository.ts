/**
 * Repository utility functions for validating and parsing repository URLs
 */

export type RepositoryProvider = 'github' | 'gitlab'

export interface RepositoryValidation {
  isValid: boolean
  provider?: RepositoryProvider
  error?: string
}

/**
 * Validates if a URL is a valid GitHub or GitLab repository URL
 */
export function validateRepositoryUrl(url: string): RepositoryValidation {
  if (!url || url.trim() === '') {
    return {
      isValid: true, // Empty is valid (optional field)
    }
  }

  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()

    // Check for GitHub
    if (hostname === 'github.com' || hostname === 'www.github.com') {
      return {
        isValid: true,
        provider: 'github',
      }
    }

    // Check for GitLab
    if (hostname === 'gitlab.com' || hostname === 'www.gitlab.com') {
      return {
        isValid: true,
        provider: 'gitlab',
      }
    }

    // Invalid provider
    return {
      isValid: false,
      error: 'Solo se permiten URLs de GitHub o GitLab',
    }
  } catch (error) {
    return {
      isValid: false,
      error: 'URL inválida',
    }
  }
}

/**
 * Gets the repository provider from a URL
 * Returns null if the URL is invalid or not from a supported provider
 */
export function getRepositoryProvider(url: string): RepositoryProvider | null {
  if (!url || url.trim() === '') {
    return null
  }

  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()

    if (hostname === 'github.com' || hostname === 'www.github.com') {
      return 'github'
    }

    if (hostname === 'gitlab.com' || hostname === 'www.gitlab.com') {
      return 'gitlab'
    }

    return null
  } catch (error) {
    return null
  }
}

/**
 * Gets a display name for the repository provider
 */
export function getProviderDisplayName(provider: RepositoryProvider): string {
  switch (provider) {
    case 'github':
      return 'GitHub'
    case 'gitlab':
      return 'GitLab'
    default:
      return ''
  }
}
