import type { NextFunction, Request, Response } from "express";
import { requestsCollection } from "../../../db/mongo";
import config from "../../settings/config";
import { HttpStatus } from "../../types/http-statuses.types";

export const rateLimitGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestIp = req.ip;
  // req.headers["x-forwarded-for"]as ||

  if (!requestIp) {
    throw new Error("now ip in request");
  }

  const requestPathname = req.originalUrl;

  await requestsCollection.insertOne({
    ip: requestIp,
    url: requestPathname,
    date: new Date(),
  });

  const requestCount = await requestsCollection.countDocuments({
    $and: [
      { ip: { $regex: requestIp, $options: "i" } },
      { url: { $regex: requestPathname, $options: "i" } },
      {
        date: { $gte: new Date(Date.now() - +config.rateLimitInterval * 1000) },
      },
    ],
  });

  if (requestCount > +config.rateLimitCount) {
    return res.sendStatus(HttpStatus.TooManyRequests);
  }

  next();
};
