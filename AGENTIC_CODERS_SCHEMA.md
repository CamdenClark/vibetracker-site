# Agentic Coder Data Schema

This file documents the JSON schema for agentic coding tool data stored in `/data/agentic-coders/`.

The comparison pages are dynamically generated from these JSON files using Hugo templates.

## JSON Schema

Each JSON file should follow this structure:

```json
{
  "name": "Tool Name",
  "vendor": "Company Name",
  "website": "https://example.com",
  "description": "Brief description of the tool",
  "capabilities": {
    "slash_commands": {
      "supported": true/false,
      "customizable": true/false,
      "details": "Additional details about slash commands"
    },
    "multi_file_editing": {
      "supported": true/false,
      "details": "Details about multi-file editing capabilities"
    },
    "codebase_understanding": {
      "supported": true/false,
      "details": "How the tool understands and indexes codebases"
    },
    "git_integration": {
      "supported": true/false,
      "details": "Git integration capabilities"
    },
    "terminal_access": {
      "supported": true/false,
      "details": "Terminal/shell access details"
    },
    "web_search": {
      "supported": true/false,
      "details": "Web search and fetch capabilities"
    },
    "mcp_servers": {
      "supported": true/false,
      "details": "Model Context Protocol support"
    },
    "parallel_agents": {
      "supported": true/false,
      "details": "Ability to run multiple agents in parallel"
    },
    "hooks": {
      "supported": true/false,
      "details": "Support for custom hooks/callbacks that execute on events"
    }
  },
  "pricing": {
    "model": "subscription|usage-based|free",
    "details": "Pricing details"
  },
  "last_updated": "YYYY-MM-DD"
}
```

## Adding New Tools

To add a new agentic coder:

1. Create a new JSON file in this directory named `tool-name.json`
2. Follow the schema above
3. Include accurate, up-to-date information about the tool's capabilities
4. Update the `last_updated` field with the current date

## Current Tools

- **claude-code.json** - Anthropic's Claude Code CLI tool
- **cursor.json** - Anysphere's Cursor IDE
- **codex-cli.json** - OpenAI's Codex CLI tool

## Future Enhancements

This schema can be extended to include:
- Language support
- IDE/editor compatibility
- Deployment options
- Security features
- API availability
- Extension ecosystem
- Performance metrics
