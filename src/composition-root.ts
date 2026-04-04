import "reflect-metadata";
import { Container, inject, injectable } from "inversify";
import { RegistrationService } from "./features/auth/application/auth.registration.service.js";
import { AuthService } from "./features/auth/application/auth.service.js";
import { AuthController } from "./features/auth/routers/auth.controller.js";
import { BlogsService } from "./features/blogs/application/blogs.service.js";
import { BlogsQueryRepository } from "./features/blogs/repositories/blogs.query.repository.js";
import { BlogsRepository } from "./features/blogs/repositories/blogs.repository.js";
import { BlogsController } from "./features/blogs/routers/blogs.controller.js";
import { CommentsService } from "./features/comments/application/comments.service.js";
import { CommentsQueryRepository } from "./features/comments/repositories/comments.query.repository.js";
import { CommentsRepository } from "./features/comments/repositories/comments.repository.js";
import { CommentsController } from "./features/comments/routers/comments.controller.js";
import { DevicesService } from "./features/devices/application/devices.service.js";
import { DevicesQueryRepository } from "./features/devices/repositories/devices.query.repository.js";
import { DevicesRepository } from "./features/devices/repositories/devices.repository.js";
import { DevicesController } from "./features/devices/routers/devices.controller.js";
import { PostsService } from "./features/posts/application/posts.service.js";
import { PostsQueryRepository } from "./features/posts/repositories/posts.query.repository.js";
import { PostsRepository } from "./features/posts/repositories/posts.repository.js";
import { PostsController } from "./features/posts/routers/posts.controller.js";
import { UsersService } from "./features/users/application/users.service.js";
import { UsersQueryRepository } from "./features/users/repositories/users.query.repository.js";
import { UsersRepository } from "./features/users/repositories/users.repository.js";
import { UsersController } from "./features/users/routers/users.controller.js";

const commentsRepository = new CommentsRepository();
const commentsQueryRepository = new CommentsQueryRepository();

const postsRepository = new PostsRepository();
const postsQueryRepository = new PostsQueryRepository();

const blogsRepository = new BlogsRepository();
const blogsQueryRepository = new BlogsQueryRepository();

const usersRepository = new UsersRepository();
const usersQueryRepository = new UsersQueryRepository();

const devicesRepository = new DevicesRepository();
const devicesQueryRepository = new DevicesQueryRepository();

const commentsService = new CommentsService(
	commentsRepository,
	postsRepository,
	usersRepository,
);
const postsService = new PostsService(postsRepository, blogsRepository);
const blogsService = new BlogsService(blogsRepository);
const devicesService = new DevicesService(devicesRepository);
const usersService = new UsersService(usersRepository);
const registrationService = new RegistrationService(
	usersRepository,
	usersService,
);
const authService = new AuthService(
	devicesRepository,
	usersRepository,
	devicesService,
);

export const commentsController = new CommentsController(
	commentsService,
	commentsQueryRepository,
);

export const postsController = new PostsController(
	commentsService,
	commentsQueryRepository,
	postsQueryRepository,
	postsRepository,
	postsService,
);

export const blogsController = new BlogsController(
	postsQueryRepository,
	blogsQueryRepository,
	postsService,
	blogsService,
);

export const devicesController = new DevicesController(
	devicesQueryRepository,
	devicesService,
);

export const usersController = new UsersController(
	usersQueryRepository,
	usersService,
);

export const authController = new AuthController(
	usersQueryRepository,
	devicesService,
	registrationService,
	authService,
);

const container: Container = new Container();

container.bind(CommentsRepository).toSelf();
