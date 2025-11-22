# Agentic Coder Data

This directory contains JSON files describing various agentic coding tools and their capabilities.

## JSON Schema

Each JSON file should follow this structure:

```json
{
  "name": "Tool Name",
  "vendor": "Company Name",
  "website": "https://example.com",
  "description": "Brief description of the tool",
  "capabilities": {
    "slashCommands": {
      "supported": true/false,
      "customizable": true/false,
      "details": "Additional details about slash commands"
    },
    "multiFileEditing": {
      "supported": true/false,
      "details": "Details about multi-file editing capabilities"
    },
    "codebaseUnderstanding": {
      "supported": true/false,
      "details": "How the tool understands and indexes codebases"
    },
    "gitIntegration": {
      "supported": true/false,
      "details": "Git integration capabilities"
    },
    "terminalAccess": {
      "supported": true/false,
      "details": "Terminal/shell access details"
    },
    "webSearch": {
      "supported": true/false,
      "details": "Web search and fetch capabilities"
    },
    "mcpServers": {
      "supported": true/false,
      "details": "Model Context Protocol support"
    },
    "parallelAgents": {
      "supported": true/false,
      "details": "Ability to run multiple agents in parallel"
    }
  },
  "pricing": {
    "model": "subscription|usage-based|free",
    "details": "Pricing details"
  },
  "lastUpdated": "YYYY-MM-DD"
}
```

## Adding New Tools

To add a new agentic coder:

1. Create a new JSON file in this directory named `tool-name.json`
2. Follow the schema above
3. Include accurate, up-to-date information about the tool's capabilities
4. Update the `lastUpdated` field with the current date

## Current Tools

- **claude-code.json** - Anthropic's Claude Code CLI tool
- **cursor.json** - Anysphere's Cursor IDE

## Future Enhancements

This schema can be extended to include:
- Language support
- IDE/editor compatibility
- Deployment options
- Security features
- API availability
- Extension ecosystem
- Performance metrics
