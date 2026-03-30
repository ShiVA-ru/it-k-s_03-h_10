import type { Request, Response } from "express";
import { matchedData } from "express-validator";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { Paginator } from "../../../../core/types/paginator.type";
import { usersQueryRepository } from "../../repositories/users.query.repository";
import type { UsersQueryInput } from "../../types/users.query.type";
import type { UserView } from "../../types/users.view.type";

export async function getUserListHandler(
  req: Request,
  res: Response<Paginator<UserView>>,
) {
  try {
    const queryData = matchedData<UsersQueryInput>(req, {
      locations: ["query"],
    });

    const blogsListOutput = await usersQueryRepository.findAll(queryData);

    res.status(HttpStatus.Ok).json(blogsListOutput);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
