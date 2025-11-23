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
  "docs_url": "https://docs.example.com",
  "description": "Brief description of the tool",
  "capabilities": {
    "slash_commands": {
      "supported": true/false,
      "customizable": true/false,
      "details": "Additional details about slash commands",
      "docs_url": "https://docs.example.com/slash-commands"
    },
    "multi_file_editing": {
      "supported": true/false,
      "details": "Details about multi-file editing capabilities",
      "docs_url": "https://docs.example.com/multi-file-editing"
    },
    "codebase_understanding": {
      "supported": true/false,
      "details": "How the tool understands and indexes codebases",
      "docs_url": "https://docs.example.com/codebase-understanding"
    },
    "git_integration": {
      "supported": true/false,
      "details": "Git integration capabilities",
      "docs_url": "https://docs.example.com/git-integration"
    },
    "terminal_access": {
      "supported": true/false,
      "details": "Terminal/shell access details",
      "docs_url": "https://docs.example.com/terminal"
    },
    "web_search": {
      "supported": true/false,
      "details": "Web search and fetch capabilities",
      "docs_url": "https://docs.example.com/web-search"
    },
    "mcp_servers": {
      "supported": true/false,
      "details": "Model Context Protocol support",
      "docs_url": "https://docs.example.com/mcp"
    },
    "parallel_agents": {
      "supported": true/false,
      "details": "Ability to run multiple agents in parallel",
      "docs_url": "https://docs.example.com/agents"
    },
    "hooks": {
      "supported": true/false,
      "details": "Support for custom hooks/callbacks that execute on events",
      "docs_url": "https://docs.example.com/hooks"
    }
  },
  "pricing": {
    "model": "subscription|usage-based|free",
    "details": "Pricing details"
  },
  "last_updated": "YYYY-MM-DD"
}
```

### Documentation URL Fields

- **`docs_url`** (top-level): Optional. General documentation URL for the tool. This link will appear in the table header next to the tool name.
- **`docs_url`** (capability-level): Optional. Specific documentation URL for a particular feature. This link will appear next to the feature details as a `[docs]` link.

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
