import { describe, it, expect } from 'vitest';
import {
  LoginRequestSchema,
  MoneySchema,
  AddressSchema,
  ProblemDetailsSchema
} from '../generators/zod/generated/index.js';

describe('Generated Zod Schemas Validation', () => {
  it('validates a valid LoginRequest', () => {
    const valid = {
      email: 'admin@fatturafacile.com',
      password: 'SecurePassword123!',
      tenantId: 'a0000000-0000-0000-0000-000000000001'
    };
    const parsed = LoginRequestSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it('rejects an invalid LoginRequest missing password', () => {
    const invalid = {
      email: 'admin@fatturafacile.com'
    };
    const parsed = LoginRequestSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it('validates Money schema', () => {
    const valid = { amount: 1500.5, currency: 'EUR' };
    const parsed = MoneySchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it('validates Italian Address schema', () => {
    const validAddress = {
      street: 'Via Roma, 1',
      city: 'Milano',
      postalCode: '20121',
      countryCode: 'IT'
    };
    const parsed = AddressSchema.safeParse(validAddress);
    expect(parsed.success).toBe(true);
  });

  it('validates RFC 9457 ProblemDetails schema', () => {
    const validProblem = {
      type: 'https://api.fatturafacile.eu/v1/errors/not-found',
      title: 'Resource Not Found',
      status: 404,
      detail: 'Invoice inv_123 does not exist.'
    };
    const parsed = ProblemDetailsSchema.safeParse(validProblem);
    expect(parsed.success).toBe(true);
  });
});
