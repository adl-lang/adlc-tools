/** Run an command and check for success */
async function exec(cmd: string, args: string[]): Promise<void> {
  const c = new Deno.Command(cmd, {
    args,
    stdout: 'inherit',
    stderr: 'inherit',
  });
  const {success} = await c.output();
  if (!success) {
    throw new AdlcError(`Failed to run cmd: ${cmd} ${args.join(' ')}`, false);
  }
}

export async function execAdlc(args: string[]): Promise<void> {
  await exec("adlc", args);
}

export class AdlcError extends Error {
  showTraceback: boolean;
  constructor(message: string, showTraceback?: boolean) {
    super(message);
    this.showTraceback = showTraceback === undefined ? true: showTraceback;
  }
}

