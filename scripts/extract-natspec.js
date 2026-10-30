/**
 * Builds src/contracts/natspec.json from the NatSpec comments of the core contracts
 * (notice, details, params and returns per function), read from the Hardhat build info.
 *
 * Usage: node scripts/extract-natspec.js ../core-contracts
 */
const fs = require("fs");
const path = require("path");

const coreDir = process.argv[2];
if (!coreDir) {
  console.error("Usage: node scripts/extract-natspec.js <path to core-contracts>");
  process.exit(1);
}

const buildInfoDir = path.join(coreDir, "artifacts", "build-info");
const contractsDir = path.join(__dirname, "..", "src", "contracts");
const wanted = fs.readdirSync(contractsDir).filter(f => f.endsWith(".json") && f !== "natspec.json").map(f => f.replace(".json", ""));

// Newest build first, so each contract takes the documentation of its latest compilation.
const builds = fs.readdirSync(buildInfoDir)
  .filter(f => f.endsWith(".json"))
  .map(f => ({ file: path.join(buildInfoDir, f), time: fs.statSync(path.join(buildInfoDir, f)).mtimeMs }))
  .sort((a, b) => b.time - a.time);

const result = {};
for (const { file } of builds) {
  const build = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const [source, contracts] of Object.entries(build.output.contracts)) {
    if (!source.startsWith("contracts/")) continue;
    for (const [name, contract] of Object.entries(contracts)) {
      if (!wanted.includes(name) || result[name]) continue;
      const { userdoc, devdoc } = JSON.parse(contract.metadata).output;
      const functions = {};
      const signatures = new Set([...Object.keys(userdoc.methods || {}), ...Object.keys(devdoc.methods || {})]);
      for (const signature of signatures) {
        const user = (userdoc.methods || {})[signature] || {};
        const dev = (devdoc.methods || {})[signature] || {};
        const entry = {};
        if (user.notice) entry.notice = user.notice;
        if (dev.details) entry.details = dev.details;
        if (dev.params) entry.params = dev.params;
        if (dev.returns) entry.returns = dev.returns;
        functions[signature.split("(")[0]] = entry;
      }
      for (const [variable, doc] of Object.entries(devdoc.stateVariables || {})) {
        if (!functions[variable]) functions[variable] = { notice: doc.notice || doc.details };
      }
      result[name] = { notice: userdoc.notice || devdoc.title || "", functions };
    }
  }
}

fs.writeFileSync(path.join(contractsDir, "natspec.json"), JSON.stringify(result, null, 1) + "\n");
console.log(`natspec.json: ${Object.keys(result).length} contracts`);
