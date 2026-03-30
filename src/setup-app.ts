import cookieParser from "cookie-parser";
import express, { type Express } from "express";
import { RouterPath } from "./core/constants/router.constants";
import { HttpStatus } from "./core/types/http-statuses.types";
import { authRouter } from "./features/auth/routers/auth.router";
import { blogsRouter } from "./features/blogs/routers/blogs.router";
import { commentsRouter } from "./features/comments/routers/comments.router";
import { devicesRouter } from "./features/devices/routers/devices.router";
import { postsRouter } from "./features/posts/routers/posts.router";
import { usersRouter } from "./features/users/routers/users.router";
import { testingRouter } from "./testing/testing.router";

export const setupApp = (app: Express) => {
  app.use(express.json());
  app.use(cookieParser());
  app.set("trust proxy", true);

  // основной роут
  app.get("/", (_req, res) => {
    res.status(HttpStatus.Ok).send("Hello world!");
  });

  app.use(RouterPath.blogs, blogsRouter);
  app.use(RouterPath.posts, postsRouter);
  app.use(RouterPath.testing, testingRouter);
  app.use(RouterPath.users, usersRouter);
  app.use(RouterPath.auth, authRouter);
  app.use(RouterPath.comments, commentsRouter);
  app.use(RouterPath.devices, devicesRouter);

  return app;
};
