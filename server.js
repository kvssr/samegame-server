import fastify from "fastify";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = fastify();

app.get("/highscores", (req, res) => {
  const highscores = prisma.highscore.findMany({});

  return highscores;
});

app.listen(3000);
