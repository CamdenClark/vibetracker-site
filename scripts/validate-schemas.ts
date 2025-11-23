#!/usr/bin/env bun

import { file } from "bun";
import { join } from "path";
import { readdir } from "node:fs/promises";

interface ValidationError {
  file: string;
  errors: string[];
}

interface Capability {
  supported: boolean;
  customizable?: boolean;
  details: string;
  docs_url?: string;
}

interface AgenticCoderSchema {
  name: string;
  vendor: string;
  website: string;
  description: string;
  capabilities: {
    slash_commands: Capability & { customizable?: boolean };
    multi_file_editing: Capability;
    codebase_understanding: Capability;
    git_integration: Capability;
    terminal_access: Capability;
    web_search: Capability;
    mcp_servers: Capability;
    parallel_agents: Capability;
    hooks: Capability;
  };
  pricing: {
    model: "subscription" | "usage-based" | "free" | "hybrid";
    details: string;
  };
  last_updated: string;
  docs_url?: string;
}

const REQUIRED_CAPABILITIES = [
  "slash_commands",
  "multi_file_editing",
  "codebase_understanding",
  "git_integration",
  "terminal_access",
  "web_search",
  "mcp_servers",
  "parallel_agents",
  "hooks",
] as const;

const VALID_PRICING_MODELS = ["subscription", "usage-based", "free", "hybrid"];

function validateDateFormat(dateStr: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    return false;
  }
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
}

function validateURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function validateCapability(
  capability: any,
  capabilityName: string
): string[] {
  const errors: string[] = [];

  if (typeof capability !== "object" || capability === null) {
    errors.push(`${capabilityName} must be an object`);
    return errors;
  }

  if (typeof capability.supported !== "boolean") {
    errors.push(`${capabilityName}.supported must be a boolean`);
  }

  if (typeof capability.details !== "string" || capability.details.length === 0) {
    errors.push(`${capabilityName}.details must be a non-empty string`);
  }

  // Special validation for slash_commands
  if (capabilityName === "slash_commands" && "customizable" in capability) {
    if (typeof capability.customizable !== "boolean") {
      errors.push(`${capabilityName}.customizable must be a boolean`);
    }
  }

  // Validate docs_url if present
  if ("docs_url" in capability) {
    if (typeof capability.docs_url !== "string" || !validateURL(capability.docs_url)) {
      errors.push(`${capabilityName}.docs_url must be a valid HTTP/HTTPS URL`);
    }
  }

  // Check for unexpected properties
  const allowedProps = capabilityName === "slash_commands"
    ? ["supported", "details", "customizable", "docs_url"]
    : ["supported", "details", "docs_url"];

  for (const key of Object.keys(capability)) {
    if (!allowedProps.includes(key)) {
      errors.push(`${capabilityName} has unexpected property: ${key}`);
    }
  }

  return errors;
}

function validateAgenticCoder(data: any, filename: string): string[] {
  const errors: string[] = [];

  // Check required top-level fields
  if (typeof data.name !== "string" || data.name.length === 0) {
    errors.push("name must be a non-empty string");
  }

  if (typeof data.vendor !== "string" || data.vendor.length === 0) {
    errors.push("vendor must be a non-empty string");
  }

  if (typeof data.website !== "string" || !validateURL(data.website)) {
    errors.push("website must be a valid HTTP/HTTPS URL");
  }

  if (typeof data.description !== "string" || data.description.length === 0) {
    errors.push("description must be a non-empty string");
  }

  // Validate capabilities
  if (typeof data.capabilities !== "object" || data.capabilities === null) {
    errors.push("capabilities must be an object");
  } else {
    // Check all required capabilities are present
    for (const cap of REQUIRED_CAPABILITIES) {
      if (!(cap in data.capabilities)) {
        errors.push(`Missing required capability: ${cap}`);
      } else {
        const capErrors = validateCapability(data.capabilities[cap], cap);
        errors.push(...capErrors);
      }
    }

    // Check for unexpected capabilities
    for (const key of Object.keys(data.capabilities)) {
      if (!REQUIRED_CAPABILITIES.includes(key as any)) {
        errors.push(`Unexpected capability: ${key}`);
      }
    }
  }

  // Validate pricing
  if (typeof data.pricing !== "object" || data.pricing === null) {
    errors.push("pricing must be an object");
  } else {
    if (!VALID_PRICING_MODELS.includes(data.pricing.model)) {
      errors.push(
        `pricing.model must be one of: ${VALID_PRICING_MODELS.join(", ")}`
      );
    }

    if (typeof data.pricing.details !== "string" || data.pricing.details.length === 0) {
      errors.push("pricing.details must be a non-empty string");
    }

    // Check for unexpected properties
    const allowedPricingProps = ["model", "details"];
    for (const key of Object.keys(data.pricing)) {
      if (!allowedPricingProps.includes(key)) {
        errors.push(`pricing has unexpected property: ${key}`);
      }
    }
  }

  // Validate last_updated
  if (typeof data.last_updated !== "string" || !validateDateFormat(data.last_updated)) {
    errors.push("last_updated must be a valid date in YYYY-MM-DD format");
  }

  // Validate docs_url if present
  if ("docs_url" in data) {
    if (typeof data.docs_url !== "string" || !validateURL(data.docs_url)) {
      errors.push("docs_url must be a valid HTTP/HTTPS URL");
    }
  }

  // Check for unexpected top-level properties
  const allowedTopLevel = [
    "name",
    "vendor",
    "website",
    "description",
    "capabilities",
    "pricing",
    "last_updated",
    "docs_url",
  ];
  for (const key of Object.keys(data)) {
    if (!allowedTopLevel.includes(key)) {
      errors.push(`Unexpected top-level property: ${key}`);
    }
  }

  return errors;
}

async function validateAllSchemas(): Promise<boolean> {
  const dataDir = join(import.meta.dir, "..", "data", "agentic-coders");

  let files: string[];
  try {
    files = await readdir(dataDir);
  } catch (error) {
    console.error(`❌ Failed to read directory: ${dataDir}`);
    console.error(error);
    return false;
  }

  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  if (jsonFiles.length === 0) {
    console.warn(`⚠️  No JSON files found in ${dataDir}`);
    return true;
  }

  const validationErrors: ValidationError[] = [];
  let validCount = 0;

  for (const filename of jsonFiles) {
    const filepath = join(dataDir, filename);

    try {
      const f = file(filepath);
      const data = await f.json();

      const errors = validateAgenticCoder(data, filename);

      if (errors.length > 0) {
        validationErrors.push({ file: filename, errors });
      } else {
        validCount++;
        console.log(`✅ ${filename} is valid`);
      }
    } catch (error) {
      validationErrors.push({
        file: filename,
        errors: [`Failed to parse JSON: ${error}`],
      });
    }
  }

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log(`Validation Summary:`);
  console.log(`  Total files: ${jsonFiles.length}`);
  console.log(`  Valid: ${validCount}`);
  console.log(`  Invalid: ${validationErrors.length}`);
  console.log("=".repeat(60));

  // Print errors
  if (validationErrors.length > 0) {
    console.log("\n❌ Validation Errors:\n");
    for (const { file, errors } of validationErrors) {
      console.log(`\n${file}:`);
      for (const error of errors) {
        console.log(`  • ${error}`);
      }
    }
    return false;
  }

  console.log("\n🎉 All schemas are valid!\n");
  return true;
}

// Run validation
const success = await validateAllSchemas();
process.exit(success ? 0 : 1);
