# Agentic Coder Schema Validation

This directory contains the JSON schema definition and validation tools for agentic coder configuration files.

## Overview

The validation system ensures that all agentic coder JSON files in `data/agentic-coders/` conform to the required structure before deployment. This catches configuration errors at build time rather than at runtime.

## Files

- **`agentic-coder.schema.json`**: JSON Schema definition that specifies the structure and validation rules
- **`../scripts/validate-schemas.ts`**: Bun-based validation script that checks all JSON files against the schema

## Schema Structure

Each agentic coder configuration must include:

### Required Top-Level Fields

- `name` (string): Name of the tool
- `vendor` (string): Company/organization providing the tool
- `website` (string): Valid HTTP/HTTPS URL
- `description` (string): Brief description
- `capabilities` (object): Feature capabilities (see below)
- `pricing` (object): Pricing information
- `last_updated` (string): Date in YYYY-MM-DD format

### Required Capabilities

All 9 capabilities must be present with `supported` (boolean) and `details` (string) fields:

1. `slash_commands` - Also supports optional `customizable` boolean
2. `multi_file_editing`
3. `codebase_understanding`
4. `git_integration`
5. `terminal_access`
6. `web_search`
7. `mcp_servers`
8. `parallel_agents`
9. `hooks`

### Pricing Models

Valid pricing models:
- `subscription`
- `usage-based`
- `free`
- `hybrid`

## Usage

### Local Validation

Run validation locally with:

```bash
bun run validate
```

### Continuous Validation

The validation script runs automatically:

1. **Pre-build**: Configured as `prebuild` script in `package.json`
2. **CI/CD**: Runs in GitHub Actions before Hugo build and deployment

### Adding a New Feature

To add a new capability to all agentic coders:

1. Update `agentic-coder.schema.json`:
   - Add the new capability to `REQUIRED_CAPABILITIES` array
   - Define the capability structure in the `properties.capabilities.properties` section

2. Update `scripts/validate-schemas.ts`:
   - Add the new capability name to the `REQUIRED_CAPABILITIES` constant

3. Update all existing JSON files in `data/agentic-coders/`:
   - Add the new capability with `supported` and `details` fields

4. Run validation to ensure all files are compliant:
   ```bash
   bun run validate
   ```

## Example Valid Configuration

```json
{
  "name": "Example Coder",
  "vendor": "Example Inc",
  "website": "https://example.com",
  "description": "An example agentic coding tool",
  "capabilities": {
    "slash_commands": {
      "supported": true,
      "customizable": true,
      "details": "Supports custom slash commands"
    },
    "multi_file_editing": {
      "supported": true,
      "details": "Can edit multiple files simultaneously"
    },
    "codebase_understanding": {
      "supported": true,
      "details": "Uses semantic code indexing"
    },
    "git_integration": {
      "supported": true,
      "details": "Full git integration"
    },
    "terminal_access": {
      "supported": false,
      "details": "No direct terminal access"
    },
    "web_search": {
      "supported": true,
      "details": "Can search the web for documentation"
    },
    "mcp_servers": {
      "supported": false,
      "details": "No MCP support"
    },
    "parallel_agents": {
      "supported": false,
      "details": "Single agent execution"
    },
    "hooks": {
      "supported": false,
      "details": "No custom hooks"
    }
  },
  "pricing": {
    "model": "subscription",
    "details": "$20/month"
  },
  "last_updated": "2025-11-22"
}
```

## Common Validation Errors

### Missing Required Capability

```
❌ Missing required capability: hooks
```

**Fix**: Add the missing capability to your JSON file with both `supported` and `details` fields.

### Invalid Date Format

```
❌ last_updated must be a valid date in YYYY-MM-DD format
```

**Fix**: Ensure the date follows the format `YYYY-MM-DD` (e.g., `2025-11-22`).

### Invalid Pricing Model

```
❌ pricing.model must be one of: subscription, usage-based, free, hybrid
```

**Fix**: Use one of the allowed pricing model values.

### Unexpected Property

```
❌ Unexpected top-level property: extra_field
```

**Fix**: Remove the unexpected property or add it to the schema definition if it's intentional.

## Benefits

1. **Build-time validation**: Catches errors before deployment
2. **Consistent structure**: Ensures all agentic coder configs follow the same format
3. **Easy maintenance**: Adding new features requires updating schema + existing files
4. **Clear errors**: Detailed error messages show exactly what's wrong and where
5. **CI/CD integration**: Prevents invalid configs from being deployed

## Development Workflow

1. Make changes to JSON files in `data/agentic-coders/`
2. Run `bun run validate` to check your changes
3. Fix any validation errors
4. Commit and push
5. GitHub Actions will run validation automatically
6. Deployment only proceeds if validation passes
