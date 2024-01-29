import { Command } from "@commander-js/extra-typings";

export const program = new Command().version("0.0.1").description("lpf");

export async function main() {
  await program.parseAsync(process.argv);
}
