import fs from "node:fs/promises";
import { WebClient } from "@slack/web-api";
import type { Member } from "@slack/web-api/dist/response/UsersListResponse.d.ts";
(await import("dotenv")).config();

async function main(): Promise<void> {
  const token = process.env.SLACK_BOT_TOKEN;
  const client = new WebClient(token);

  let members: Member[] = [];
  let cursor: string | undefined = undefined;
  const limit = 100;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const usersListResponse = await client.users.list({ cursor, limit });
    if (usersListResponse.members === undefined) {
      break;
    }
    members = members.concat(usersListResponse.members);
    cursor = usersListResponse.response_metadata?.next_cursor;
    console.log(members.length, { cursor });

    if (cursor === undefined || cursor === "") {
      break;
    }
  }

  console.log("done", members.length);

  await fs.writeFile("./members.json", JSON.stringify(members));
}

main();

process.on("unhandledRejection", (reason) => {
  console.error(reason);
  process.exit(1);
});
