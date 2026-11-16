import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { MCP_TOOLS } from '../mcp/index.js';

describe('Model Context Protocol (MCP) Metadata Quality', () => {
  it('generates tools for all modeled endpoints', () => {
    expect(MCP_TOOLS.length).toBeGreaterThanOrEqual(30);
  });

  it('each tool includes description, inputSchema, and metadata', () => {
    for (const tool of MCP_TOOLS) {
      expect(tool.name).toBeTypeOf('string');
      expect(tool.name.length).toBeGreaterThan(0);
      expect(tool.description).toBeTypeOf('string');
      expect(tool.inputSchema.type).toBe('object');
      expect(tool.inputSchema.properties).toBeDefined();
      expect(tool.metadata.domain).toBeDefined();
      expect(tool.metadata.httpMethod).toBeDefined();
      expect(tool.metadata.path).toBeDefined();
    }
  });

  it('includes key business tools for invoices and SDI transmission', () => {
    const toolNames = MCP_TOOLS.map(t => t.name);
    expect(toolNames).toContain('createInvoice');
    expect(toolNames).toContain('listInvoices');
    expect(toolNames).toContain('transmitInvoiceToSdi');
    expect(toolNames).toContain('createCustomer');
    expect(toolNames).toContain('recordPayment');
  });
});
