import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export async function resolveAlias(specifier, context, nextResolve) {
  if (specifier === "server-only") {
    return {
      shortCircuit: true,
      url: "data:text/javascript,export {};",
    };
  }

  if (specifier.startsWith("@/")) {
    const base = resolve(projectRoot, specifier.slice(2));
    const path = [base, `${base}.ts`, `${base}.tsx`].find(existsSync);
    if (path) {
      return { shortCircuit: true, url: pathToFileURL(path).href };
    }
  }

  return nextResolve(specifier, context);
}

export { resolveAlias as resolve };
