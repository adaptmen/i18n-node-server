import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";


export const cliArgs = yargs(hideBin(process.argv))
.option("port", {
  alias: "p",
  type: "number",
  default: 3000,
  description: "Port for http server",
  showInHelp: true,
})
.option("data", {
	alias: "d",
	type: "string",
	default: "./data",
	description: "Directory to store files",
	showInHelp: true,
})
.parseSync();
