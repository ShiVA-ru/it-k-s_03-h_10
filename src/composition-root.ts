import { RegistrationService } from "./features/auth/application/auth.registration.service";
import { AuthService } from "./features/auth/application/auth.service";
import { AuthController } from "./features/auth/routers/auth.controller";
import { BlogsService } from "./features/blogs/application/blogs.service";
import { BlogsQueryRepository } from "./features/blogs/repositories/blogs.query.repository";
import { BlogsRepository } from "./features/blogs/repositories/blogs.repository";
import { BlogsController } from "./features/blogs/routers/blogs.controller";
import { CommentsService } from "./features/comments/application/comments.service";
import { CommentsQueryRepository } from "./features/comments/repositories/comments.query.repository";
import { CommentsRepository } from "./features/comments/repositories/comments.repository";
import { CommentsController } from "./features/comments/routers/comments.controller";
import { DevicesService } from "./features/devices/application/devices.service";
import { DevicesQueryRepository } from "./features/devices/repositories/devices.query.repository";
import { DevicesRepository } from "./features/devices/repositories/devices.repository";
import { DevicesController } from "./features/devices/routers/devices.controller";
import { PostsService } from "./features/posts/application/posts.service";
import { PostsQueryRepository } from "./features/posts/repositories/posts.query.repository";
import { PostsRepository } from "./features/posts/repositories/posts.repository";
import { PostsController } from "./features/posts/routers/posts.controller";
import { UsersService } from "./features/users/application/users.service";
import { UsersQueryRepository } from "./features/users/repositories/users.query.repository";
import { UsersRepository } from "./features/users/repositories/users.repository";
import { UsersController } from "./features/users/routers/users.controller";

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
