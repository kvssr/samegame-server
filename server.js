import fastify from "fastify";
import cors from "@fastify/cors";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = fastify();

app.register(cors, {});

app.register(
  (instance, opt, done) => {
    const opts_get = {
      schema: {
        querystring: {
          type: "object",
          properties: {
            days: { type: "number" },
            limit: { type: "number" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "number" },
              created_at: { type: "datetime" },
              username: { type: "string" },
              categoryId: { type: "number" },
              score: { type: "number" },
            },
          },
        },
      },
    };

    instance.get("/highscores", { opts_get }, async (req, res) => {
      console.log("GET /highscores");
      // console.log("req", req.params);
      // console.log("req", req.query);
      let today = new Date();
      if (Number(req.query["days"]) === 0) {
        today = new Date(0);
      }
      try {
        const highscores = await prisma.highscore.findMany({
          take: Number(req.query["limit"]),
          where: {
            created_at: {
              gt: new Date(
                today.setDate(today.getDate() - Number(req.query["days"]))
              ),
            },
          },
          orderBy: {
            score: "desc",
          },
        });
        // console.log("highscores", highscores);
        // return res.send({ highscores });
        return highscores;
      } catch (error) {
        console.log("GET /highscore error", error);
      }
    });

    const opts_post = {
      schema: {
        body: {
          type: "object",
          properties: {
            username: { type: "string" },
            value: { type: "number" },
          },
        },
      },
    };

    instance.post("/highscore", opts_post, (req, res) => {
      console.log("POST /highscore");
      console.log("req", req.body);
      try {
        const highscore = prisma.highscore.create({
          data: {
            username: req.body["username"],
            score: req.body["value"],
            categoryId: 1,
          },
        });
        return highscore;
      } catch (error) {
        console.log("POST /highscore error", error);
      }
    });

    done();
  },
  { prefix: "/server/samegame" }
);

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`listening on port ${address}`);
});
