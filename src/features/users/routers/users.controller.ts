import type { Request, Response } from "express";
import { matchedData } from "express-validator";
import type {
  validationErrorsDto,
  validationErrorType,
} from "../../../core/types/errors.types";
import { HttpStatus } from "../../../core/types/http-statuses.types";
import type { Paginator } from "../../../core/types/paginator.type";
import type {
  RequestWithBody,
  RequestWithParams,
} from "../../../core/types/request.types";
import type { URIParamsId } from "../../../core/types/uri-params.type";
import { resultCodeToHttpException } from "../../../core/utils/result-code-to-http-exception";
import { isSuccessResult } from "../../../core/utils/type-guards";
import { UsersService } from "../application/users.service";
import { UsersQueryRepository } from "../repositories/users.query.repository";
import type { UserInput } from "../types/users.input.type";
import type { UsersQueryInput } from "../types/users.query.type";
import type { UserView } from "../types/users.view.type";

class UsersController {
  private usersQueryRepository: UsersQueryRepository;
  private usersService: UsersService;

  constructor() {
    this.usersQueryRepository = new UsersQueryRepository();
    this.usersService = new UsersService();
  }

  async getUser(
    req: RequestWithParams<URIParamsId>,
    res: Response<UserView | validationErrorsDto>,
  ) {
    try {
      const findEntity = await this.usersQueryRepository.findOneById(
        req.params.id,
      );

      if (!findEntity) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      res.status(HttpStatus.Ok).json(findEntity);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.NotFound);
    }
  }

  async getUsers(req: Request, res: Response<Paginator<UserView>>) {
    try {
      const queryData = matchedData<UsersQueryInput>(req, {
        locations: ["query"],
      });

      const blogsListOutput =
        await this.usersQueryRepository.findAll(queryData);

      res.status(HttpStatus.Ok).json(blogsListOutput);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async createUser(
    req: RequestWithBody<UserInput>,
    res: Response<UserView | validationErrorType[]>,
  ) {
    try {
      const result = await this.usersService.create(req.body, true);

      if (!isSuccessResult(result)) {
        return res
          .status(resultCodeToHttpException(result.status))
          .send(result.extensions);
      }

      const createdEntity = await this.usersQueryRepository.findOneById(
        result.data.insertedId,
      );

      if (!createdEntity) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      res.status(HttpStatus.Created).json(createdEntity);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async deleteUser(req: RequestWithParams<URIParamsId>, res: Response) {
    try {
      const isDeleted = await this.usersService.deleteOneById(req.params.id);

      if (!isDeleted) {
        res.sendStatus(HttpStatus.NotFound);
        return;
      }

      return res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.NotFound);
    }
  }
}

export const usersControllerInstance = new UsersController();
