import { getAdlStdLibDir } from "./fs.ts";
import * as fs from "@std/fs"
import * as path from "@std/path"

export interface AdlSourceParams {
  verbose?: boolean,
  mergeAdlExts?: string[],
  searchPath: string[],
  adlModules: string[],
}


export async function compilerSourceArgsFromParams(params: AdlSourceParams) : Promise<string[]> {
  let args: string[] = [];
  const searchPath = [
    await getAdlStdLibDir(),
    ...params.searchPath,
  ]

  if (params.verbose) {
    args.push("--verbose")
  }

  searchPath.forEach((dir) => {
    args = args.concat(["--searchdir", dir]);
  });

  const mergeAdlExts = params.mergeAdlExts || [];
  mergeAdlExts.forEach((ext) => {
    args = args.concat(["--merge-adlext", ext]);
  });

  args.push(...params.adlModules)

  return args;
}
