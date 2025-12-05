/**
 * API Contract Validator
 * 
 * Validates API responses against expected TypeScript interfaces
 * to ensure frontend-backend contract alignment.
 */

import type { 
  GeopoliticalEvent,
  SupplyChainDisruption,
  ProductionAlert,
  ActiveAlertsResponse,
  GeopoliticalDisruptionsResponse
} from '@/types/api';

export class ContractValidationError extends Error {
  constructor(
    public readonly endpoint: string,
    public readonly expectedType: string,
    public readonly actualData: unknown,
    public readonly validationErrors: string[]
  ) {
    super(`Contract validation failed for ${endpoint}: ${validationErrors.join(', ')}`);
    this.name = 'ContractValidationError';
  }
}

export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errors: string[];
}

/**
 * Validate geopolitical event data structure
 */
export function validateGeopoliticalEvent(data: unknown): ValidationResult<GeopoliticalEvent> {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Data must be an object');
    return { isValid: false, errors };
  }

  const event = data as Record<string, unknown>;

  if (!event.event_id || typeof event.event_id !== 'string') {
    errors.push('event_id must be a string');
  }

  if (!event.event_type || typeof event.event_type !== 'string') {
    errors.push('event_type must be a string');
  }

  if (!Array.isArray(event.location) || event.location.length !== 2) {
    errors.push('location must be an array of two numbers [lat, lng]');
  }

  if (typeof event.impact_score !== 'number') {
    errors.push('impact_score must be a number');
  }

  if (typeof event.confidence !== 'number') {
    errors.push('confidence must be a number');
  }

  if (errors.length === 0) {
    return { isValid: true, data: data as GeopoliticalEvent, errors: [] };
  }

  return { isValid: false, errors };
}

/**
 * Validate supply chain disruption data structure
 */
export function validateSupplyChainDisruption(data: unknown): ValidationResult<SupplyChainDisruption> {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Data must be an object');
    return { isValid: false, errors };
  }

  const disruption = data as Record<string, unknown>;

  if (!disruption.disruption_id || typeof disruption.disruption_id !== 'string') {
    errors.push('disruption_id must be a string');
  }

  if (!['low', 'medium', 'high', 'critical'].includes(disruption.severity as string)) {
    errors.push('severity must be one of: low, medium, high, critical');
  }

  if (!Array.isArray(disruption.location) || disruption.location.length !== 2) {
    errors.push('location must be an array of two numbers [lat, lng]');
  }

  if (!disruption.description || typeof disruption.description !== 'string') {
    errors.push('description must be a string');
  }

  if (!Array.isArray(disruption.affected_commodities)) {
    errors.push('affected_commodities must be an array');
  }

  if (errors.length === 0) {
    return { isValid: true, data: data as SupplyChainDisruption, errors: [] };
  }

  return { isValid: false, errors };
}

/**
 * Validate production alert data structure
 */
export function validateProductionAlert(data: unknown): ValidationResult<ProductionAlert> {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Data must be an object');
    return { isValid: false, errors };
  }

  const alert = data as Record<string, unknown>;

  if (!alert.id || typeof alert.id !== 'string') {
    errors.push('id must be a string');
  }

  if (!['critical', 'high', 'medium', 'low'].includes(alert.severity as string)) {
    errors.push('severity must be one of: critical, high, medium, low');
  }

  if (!alert.service_name || typeof alert.service_name !== 'string') {
    errors.push('service_name must be a string');
  }

  if (!alert.message || typeof alert.message !== 'string') {
    errors.push('message must be a string');
  }

  if (!alert.timestamp || typeof alert.timestamp !== 'string') {
    errors.push('timestamp must be a string');
  }

  if (typeof alert.resolved !== 'boolean') {
    errors.push('resolved must be a boolean');
  }

  if (errors.length === 0) {
    return { isValid: true, data: data as ProductionAlert, errors: [] };
  }

  return { isValid: false, errors };
}

/**
 * Validate geopolitical disruptions response
 */
export function validateGeopoliticalDisruptionsResponse(data: unknown): ValidationResult<GeopoliticalDisruptionsResponse> {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Data must be an object');
    return { isValid: false, errors };
  }

  const response = data as Record<string, unknown>;

  if (!Array.isArray(response.geopolitical_events)) {
    errors.push('geopolitical_events must be an array');
  } else {
    // Validate each event
    response.geopolitical_events.forEach((event, index) => {
      const eventValidation = validateGeopoliticalEvent(event);
      if (!eventValidation.isValid) {
        errors.push(`geopolitical_events[${index}]: ${eventValidation.errors.join(', ')}`);
      }
    });
  }

  if (!Array.isArray(response.supply_chain_disruptions)) {
    errors.push('supply_chain_disruptions must be an array');
  } else {
    // Validate each disruption
    response.supply_chain_disruptions.forEach((disruption, index) => {
      const disruptionValidation = validateSupplyChainDisruption(disruption);
      if (!disruptionValidation.isValid) {
        errors.push(`supply_chain_disruptions[${index}]: ${disruptionValidation.errors.join(', ')}`);
      }
    });
  }

  if (!Array.isArray(response.data_sources)) {
    errors.push('data_sources must be an array');
  }

  if (errors.length === 0) {
    return { isValid: true, data: data as GeopoliticalDisruptionsResponse, errors: [] };
  }

  return { isValid: false, errors };
}

/**
 * Validate active alerts response
 */
export function validateActiveAlertsResponse(data: unknown): ValidationResult<ActiveAlertsResponse> {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Data must be an object');
    return { isValid: false, errors };
  }

  const response = data as Record<string, unknown>;

  if (!Array.isArray(response.active_alerts)) {
    errors.push('active_alerts must be an array');
  } else {
    // Validate each alert
    response.active_alerts.forEach((alert, index) => {
      const alertValidation = validateProductionAlert(alert);
      if (!alertValidation.isValid) {
        errors.push(`active_alerts[${index}]: ${alertValidation.errors.join(', ')}`);
      }
    });
  }

  if (!response.summary || typeof response.summary !== 'object') {
    errors.push('summary must be an object');
  } else {
    const summary = response.summary as Record<string, unknown>;
    if (typeof summary.total_alerts !== 'number') {
      errors.push('summary.total_alerts must be a number');
    }
    if (typeof summary.critical_alerts !== 'number') {
      errors.push('summary.critical_alerts must be a number');
    }
  }

  if (!response.timestamp || typeof response.timestamp !== 'string') {
    errors.push('timestamp must be a string');
  }

  if (errors.length === 0) {
    return { isValid: true, data: data as ActiveAlertsResponse, errors: [] };
  }

  return { isValid: false, errors };
}

/**
 * Generic API response validator
 */
export function validateApiResponse<T>(
  endpoint: string,
  data: unknown,
  validator: (data: unknown) => ValidationResult<T>
): T {
  const validation = validator(data);
  
  if (!validation.isValid) {
    throw new ContractValidationError(
      endpoint,
      'expected type',
      data,
      validation.errors
    );
  }

  return validation.data!;
}

/**
 * Validate that response contains required pagination fields
 */
export function validatePaginatedResponse(data: unknown): ValidationResult<{ hasValidPagination: boolean }> {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Data must be an object');
    return { isValid: false, errors };
  }

  const response = data as Record<string, unknown>;

  if (response.pagination && typeof response.pagination === 'object') {
    const pagination = response.pagination as Record<string, unknown>;
    
    if (typeof pagination.total !== 'number') {
      errors.push('pagination.total must be a number');
    }
    if (typeof pagination.page !== 'number') {
      errors.push('pagination.page must be a number');
    }
    if (typeof pagination.pageSize !== 'number') {
      errors.push('pagination.pageSize must be a number');
    }
  }

  return { isValid: errors.length === 0, data: { hasValidPagination: true }, errors };
}

/**
 * Contract validation summary for debugging
 */
export function generateValidationReport(
  endpoint: string,
  data: unknown,
  validators: Array<{ name: string; validator: (data: unknown) => ValidationResult<unknown> }>
): { endpoint: string; validations: Array<{ name: string; isValid: boolean; errors: string[] }> } {
  return {
    endpoint,
    validations: validators.map(({ name, validator }) => {
      const result = validator(data);
      return {
        name,
        isValid: result.isValid,
        errors: result.errors
      };
    })
  };
}
