import { MCP_TOOLS } from '../../mcp/index.js';
import { FatturaFacileClient } from '../../sdk/typescript/src/client.js';

/**
 * Fattura Facile MCP Server Example
 * Exposes ERP operations as tools for Claude, Cursor, Windsurf, or Copilot.
 */
export class FatturaFacileMcpServer {
  private client: FatturaFacileClient;

  constructor(apiKey: string, tenantId: string) {
    this.client = new FatturaFacileClient({
      apiKey,
      tenantId
    });
  }

  public listTools() {
    return MCP_TOOLS.map(t => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema
    }));
  }

  public async callTool(name: string, args: Record<string, any>) {
    const tool = MCP_TOOLS.find(t => t.name === name);
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }

    const { httpMethod, path } = tool.metadata;
    let resolvedPath = path;

    // Substitute path parameters
    for (const [key, val] of Object.entries(args)) {
      if (resolvedPath.includes(`{${key}}`)) {
        resolvedPath = resolvedPath.replace(`{${key}}`, encodeURIComponent(String(val)));
        delete args[key];
      }
    }

    console.log(`[MCP] Executing ${httpMethod} ${resolvedPath}...`);
    return await this.client.request(httpMethod, resolvedPath, args);
  }
}
