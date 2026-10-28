import { execAdlc } from "./utils/exec.ts";
import { type AdlSourceParams, compilerSourceArgsFromParams } from "./utils/sources.ts";

export interface GenRustParams extends AdlSourceParams{
  outputDir: string;
  module: string;

  /**
   * The module holding the adl runtime, relative to the crate root.
   *
   * Leave it unset and the generated code references the published `adl_rt`
   * crate instead, which the project then depends on. Set it, and the code
   * references `crate::<runtimeModule>`, which is where `includeRuntime`
   * writes the runtime source. Needs adlc 1.4.1 or later to leave unset.
   */
  runtimeModule?: string;

  verbose?: boolean;
  noOverwrite?: boolean;
  manifest?: string;
  generateTransitive?: boolean;
  includeRuntime?: boolean;
}

export async function genRust(params: GenRustParams): Promise<void> {
  let args: string[] = ["rust"];
  args = args.concat(["--outputdir", params.outputDir]);
  args = args.concat(["--module", params.module]);
  if (params.runtimeModule !== undefined) {
    args = args.concat(["--runtime-module", params.runtimeModule]);
  }

  if (params.verbose) {
    args.push("--verbose");
  }
  if (params.noOverwrite) {
    args.push("--no-overwrite");
  }
  if (params.manifest) {
    args = args.concat(["--manifest", params.manifest]);
  }
  if (params.generateTransitive) {
    args.push("--generate-transitive");
  }
  if (params.includeRuntime) {
    args.push("--include-rt");
  }
  const sourceArgs = await compilerSourceArgsFromParams(params);
  args = args.concat(sourceArgs);

  if (params.verbose) {
    console.log("Executing", args);
  }

  return execAdlc(args);
}
