import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import * as child_process from "node:child_process";
import util from "node:util";
import type { Member } from "@slack/web-api/dist/response/UsersListResponse.d.ts";

const exec = util.promisify(child_process.exec);

async function main(): Promise<void> {
  const members: Member[] = JSON.parse(
    await fs.readFile("./members.json", "utf-8"),
  );
  const names: string[] = (await fs.readFile("./names.txt", "utf-8"))
    .trim()
    .split("\n")
    .map((name) => name.trim().replace(/(@|＠)/, ""));

  for (const name of names) {
    const iconFile = `./icons/${name.replace(/\//, "")}.jpg`;
    if (existsSync(iconFile)) {
      console.log(`Already exists: ${name}`);
      continue;
    }

    const member = members.find((member) => {
      if (member.profile?.display_name === name) {
        return true;
      }
      if (member.profile?.first_name === name) {
        return true;
      }
    });
    if (!member) {
      console.log(`Not found: ${name}`);
      continue;
    }
    console.log(`Found: ${name}`);

    const iconUrl = member.profile?.image_1024 ?? member.profile?.image_512;

    await exec(`curl -o "${iconFile}" ${iconUrl}`, {
      maxBuffer: 1024 * 1024 * 10,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

main();
