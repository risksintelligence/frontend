/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * RRIO Data Shape Validators
 * Bloomberg-grade data validation for frontend type safety
 */

import { rrio, RRIOErrorType } from './monitoring';

// Generic validation result interface
interface ValidationResult<T> {
  isValid: boolean;
  data: T | null;
  errors: string[];
}

// Base validator function type
type Validator<T> = (data: unknown, endpoint?: string) => ValidationResult<T>;

/**
 * Creates a validation result object
 */
function createValidationResult<T>(
  isValid: boolean, 
  data: T | null, 
  errors: string[] = []
): ValidationResult<T> {
  return { isValid, data, errors };
}

/**
 * Validates that a value is a string
 */
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Validates that a value is a number
 */
function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Validates that a value is a valid date string
 */
function isDateString(value: unknown): boolean {
  return isString(value) && !isNaN(Date.parse(value));
}

/**
 * Validates that a value is an array
 */
function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Validates that a value is a plain object
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Risk Overview Data Validator
 */
export const validateRiskOverview: Validator<any> = (data, endpoint) => {
  const errors: string[] = [];

  if (!isObject(data)) {
    return createValidationResult(false, null, ['Risk overview must be an object']);
  }

  if (!isObject(data.overview)) {
    errors.push('Risk overview.overview is required and must be an object');
  } else {
    const overview = data.overview;
    
    if (!isNumber(overview.score)) {
      errors.push('Risk overview.overview.score must be a number');
    } else if (overview.score < 0 || overview.score > 100) {
      errors.push('Risk overview.overview.score must be between 0 and 100');
    }

    if (!isNumber(overview.change_24h)) {
      errors.push('Risk overview.overview.change_24h must be a number');
    }

    if (!isString(overview.updated_at) || !isDateString(overview.updated_at)) {
      errors.push('Risk overview.overview.updated_at must be a valid ISO date string');
    }

    if (!isString(overview.band)) {
      errors.push('Risk overview.overview.band must be a string');
    }

    if (!isArray(overview.drivers)) {
      errors.push('Risk overview.overview.drivers must be an array');
    }
  }

  if (!isArray(data.alerts)) {
    errors.push('Risk overview.alerts must be an array');
  }

  if (errors.length > 0) {
    rrio.trackDataQuality(`Risk overview validation failed: ${errors.join(', ')}`, endpoint || 'unknown', 'high');
    return createValidationResult(false, null, errors);
  }

  return createValidationResult(true, data, []);
};

/**
 * Components Data Validator
 */
export const validateComponentsData: Validator<any> = (data, endpoint) => {
  const errors: string[] = [];

  if (!isObject(data)) {
    return createValidationResult(false, null, ['Components data must be an object']);
  }

  if (!isArray(data.components)) {
    return createValidationResult(false, null, ['Components data must have a components array']);
  }

  data.components.forEach((component: unknown, index: number) => {
    if (!isObject(component)) {
      errors.push(`Component at index ${index} must be an object`);
      return;
    }

    if (!isString(component.id)) {
      errors.push(`Component at index ${index} must have a string id`);
    }

    if (!isNumber(component.value)) {
      errors.push(`Component at index ${index} must have a numeric value`);
    }

    if (!isNumber(component.z_score)) {
      errors.push(`Component at index ${index} must have a numeric z_score`);
    }
  });

  if (errors.length > 0) {
    rrio.trackDataQuality(`Components validation failed: ${errors.join(', ')}`, endpoint || 'unknown', 'high');
    return createValidationResult(false, null, errors);
  }

  return createValidationResult(true, data, []);
};

/**
 * Partners Data Validator
 */
export const validatePartnersData: Validator<any> = (data, endpoint) => {
  const errors: string[] = [];

  if (!isObject(data)) {
    return createValidationResult(false, null, ['Partners data must be an object']);
  }

  if (!isArray(data.partners)) {
    return createValidationResult(false, null, ['Partners data must have a partners array']);
  }

  data.partners.forEach((partner: unknown, index: number) => {
    if (!isObject(partner)) {
      errors.push(`Partner at index ${index} must be an object`);
      return;
    }

    if (!isString(partner.lab_id)) {
      errors.push(`Partner at index ${index} must have a string lab_id`);
    }

    if (!isString(partner.sector)) {
      errors.push(`Partner at index ${index} must have a string sector`);
    }

    if (!isString(partner.status)) {
      errors.push(`Partner at index ${index} must have a string status`);
    }

    if (!isArray(partner.deliverables)) {
      errors.push(`Partner at index ${index} must have a deliverables array`);
    }

    if (!isString(partner.showcase_date) || !isDateString(partner.showcase_date)) {
      errors.push(`Partner at index ${index} must have a valid showcase_date`);
    }

    // Optional fields validation
    if (partner.engagement_score !== undefined && !isNumber(partner.engagement_score)) {
      errors.push(`Partner at index ${index} engagement_score must be a number if provided`);
    }

    if (partner.project_details !== undefined && !isArray(partner.project_details)) {
      errors.push(`Partner at index ${index} project_details must be an array if provided`);
    }
  });

  if (errors.length > 0) {
    rrio.trackDataQuality(`Partners validation failed: ${errors.join(', ')}`, endpoint || 'unknown', 'high');
    return createValidationResult(false, null, errors);
  }

  return createValidationResult(true, data, []);
};

/**
 * Anomalies/Alerts Data Validator
 */
export const validateAlertsData: Validator<any> = (data, endpoint) => {
  const errors: string[] = [];

  if (!isObject(data)) {
    return createValidationResult(false, null, ['Alerts data must be an object']);
  }

  if (!isArray(data.anomalies)) {
    return createValidationResult(false, null, ['Alerts data must have an anomalies array']);
  }

  data.anomalies.forEach((anomaly: unknown, index: number) => {
    if (!isObject(anomaly)) {
      errors.push(`Anomaly at index ${index} must be an object`);
      return;
    }

    if (!isNumber(anomaly.score)) {
      errors.push(`Anomaly at index ${index} must have a numeric score`);
    }

    if (!isString(anomaly.classification)) {
      errors.push(`Anomaly at index ${index} must have a string classification`);
    }

    if (!isArray(anomaly.drivers)) {
      errors.push(`Anomaly at index ${index} must have a drivers array`);
    }

    if (!isString(anomaly.timestamp) || !isDateString(anomaly.timestamp)) {
      errors.push(`Anomaly at index ${index} must have a valid timestamp`);
    }
  });

  if (errors.length > 0) {
    rrio.trackDataQuality(`Alerts validation failed: ${errors.join(', ')}`, endpoint || 'unknown', 'high');
    return createValidationResult(false, null, errors);
  }

  return createValidationResult(true, data, []);
};

/**
 * Regime Data Validator
 */
export const validateRegimeData: Validator<any> = (data, endpoint) => {
  const errors: string[] = [];

  if (!isObject(data)) {
    return createValidationResult(false, null, ['Regime data must be an object']);
  }

  if (!isString(data.current)) {
    errors.push('Regime data must have a string current field');
  }

  if (!isArray(data.probabilities)) {
    errors.push('Regime data must have a probabilities array');
  } else {
    data.probabilities.forEach((prob: unknown, index: number) => {
      if (!isObject(prob)) {
        errors.push(`Probability at index ${index} must be an object`);
        return;
      }

      if (!isString(prob.name)) {
        errors.push(`Probability at index ${index} must have a string name`);
      }

      if (!isNumber(prob.probability)) {
        errors.push(`Probability at index ${index} must have a numeric probability`);
      } else if (prob.probability < 0 || prob.probability > 1) {
        errors.push(`Probability at index ${index} must be between 0 and 1`);
      }
    });
  }

  if (!isString(data.updatedAt) || !isDateString(data.updatedAt)) {
    errors.push('Regime data must have a valid updatedAt timestamp');
  }

  if (errors.length > 0) {
    rrio.trackDataQuality(`Regime validation failed: ${errors.join(', ')}`, endpoint || 'unknown', 'medium');
    return createValidationResult(false, null, errors);
  }

  return createValidationResult(true, data, []);
};

/**
 * Transparency Status Validator
 */
export const validateTransparencyStatus: Validator<any> = (data, endpoint) => {
  const errors: string[] = [];

  if (!isObject(data)) {
    return createValidationResult(false, null, ['Transparency status must be an object']);
  }

  if (!isString(data.timestamp) || !isDateString(data.timestamp)) {
    errors.push('Transparency status must have a valid timestamp');
  }

  if (!isString(data.overall_status)) {
    errors.push('Transparency status must have a string overall_status');
  } else if (!['healthy', 'degraded', 'critical'].includes(data.overall_status)) {
    errors.push('overall_status must be one of: healthy, degraded, critical');
  }

  if (errors.length > 0) {
    rrio.trackDataQuality(`Transparency validation failed: ${errors.join(', ')}`, endpoint || 'unknown', 'medium');
    return createValidationResult(false, null, errors);
  }

  return createValidationResult(true, data, []);
};

/**
 * Generic data validator that attempts to validate common data shapes
 */
export const validateGenericData: Validator<any> = (data, endpoint) => {
  if (data === null || data === undefined) {
    rrio.trackDataQuality('Received null or undefined data', endpoint || 'unknown', 'high');
    return createValidationResult(false, null, ['Data cannot be null or undefined']);
  }

  // For now, just accept any non-null data as valid
  // This can be extended as we discover more data patterns
  return createValidationResult(true, data, []);
};

/**
 * Validator registry for different endpoint patterns
 */
export const validatorRegistry = {
  '/api/v1/risk/overview': validateRiskOverview,
  '/api/v1/analytics/components': validateComponentsData,
  '/api/v1/impact/partners': validatePartnersData,
  '/api/v1/anomalies/latest': validateAlertsData,
  '/api/v1/regime/current': validateRegimeData,
  '/api/v1/transparency/data-freshness': validateTransparencyStatus,
} as const;

/**
 * Gets the appropriate validator for an endpoint
 */
export function getValidatorForEndpoint(endpoint: string): Validator<any> {
  // Try to match exact endpoint first
  if (endpoint in validatorRegistry) {
    return validatorRegistry[endpoint as keyof typeof validatorRegistry];
  }

  // Try to match endpoint patterns
  for (const [pattern, validator] of Object.entries(validatorRegistry)) {
    if (endpoint.includes(pattern)) {
      return validator;
    }
  }

  // Fall back to generic validator
  return validateGenericData;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
