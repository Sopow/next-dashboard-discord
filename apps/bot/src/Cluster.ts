import "dotenv/config";
import WebSocket from "ws";
import { CronJob } from "cron";
import { Guild, ShardingManager } from "discord.js";

const manager = new ShardingManager(`${__dirname}/index.js`, {
  totalShards: "auto",
  mode: "process",
  token: process.env.CLIENT_TOKEN,
});

manager.on("shardCreate", (shard) =>
  console.log(
    `Launched Shard ${shard.id}\n-------------------------------------------------------------`,
  ),
);

// const wss = new WebSocket.Server({ port: 3500 });

// interface Shard {
//   id: number;
//   guilds: number;
//   status: "READY" | "DISCONNECTED";
// }

// type ShardStatus = "READY" | "DISCONNECTED";

// const sendShardsToClient = (socket: WebSocket) => {
//   const getRandomStatus = () => {
//     const statuses: ShardStatus[] = ["READY", "DISCONNECTED"];
//     const randomIndex = Math.floor(Math.random() * statuses.length);
//     return statuses[randomIndex];
//   };

//   const generateGuilds = () => {
//     const shards: Shard[] = [];
//     for (let i = 1; i <= 10; i++) {
//       shards.push({
//         id: i,
//         guilds: 0,
//         status: getRandomStatus(),
//       });
//     }
//     return shards;
//   };

//   socket.send(
//     JSON.stringify({
//       type: "shards",
//       content: generateGuilds(),
//     }),
//   );
// };

// wss.on("connection", (socket) => {
//   console.log(manager.shardList);
//   socket.on("message", (message) => {
//     const msg = JSON.parse(message.toString());
//     if (msg.type === "getShards") {
//       sendShardsToClient(socket);
//     }
//   });
//   const job = new CronJob("*/1 * * * *", () => {
//     sendShardsToClient(socket);
//   });

//   job.start();
// });

manager.spawn({ timeout: -1 }).catch((e) => {
  console.error(e);
  process.exit(1);
});
