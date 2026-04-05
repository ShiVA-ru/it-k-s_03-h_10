import { Router } from "express";
import { container } from "../../../composition-root.js";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware.js";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware.js";
import { accessTokenGuardMiddleware } from "../../auth/middlewares/access-token.guard.js";
import { commentInputDtoValidation } from "../validation/comments.input-dto.validation.middleware.js";
import { CommentsController } from "./comments.controller.js";

export const commentsRouter = Router();

const commentsController = container.get(CommentsController);

commentsRouter
	.get(
		"/:id",
		idValidation,
		inputValidationResultMiddleware,
		commentsController.getComment.bind(commentsController),
	)
	//UPDATE
	.put(
		"/:id",
		accessTokenGuardMiddleware,
		idValidation,
		commentInputDtoValidation,
		inputValidationResultMiddleware,
		commentsController.updateComment.bind(commentsController),
	)
	// DELETE
	.delete(
		"/:id",
		accessTokenGuardMiddleware,
		idValidation,
		inputValidationResultMiddleware,
		commentsController.deleteComment.bind(commentsController),
	);
