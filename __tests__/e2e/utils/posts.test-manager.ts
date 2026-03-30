import express, { Express } from "express";
import request from "supertest";
import { setupApp } from "../../../src/setup-app";
import { PostInput } from "../../../src/features/posts/types/posts.input.type";
import { HttpStatus } from "../../../src/core/types/http-statuses.types";
import { HttpStatusType } from "../../../src/core/types/http-statuses.types";
import { RouterPath } from "../../../src/core/constants/router.constants";
import { PostView } from "../../../src/features/posts/types/posts.view.type";
import { commonTestManager } from "./common.test-manager";

export const postsTestManager = {
  adminToken: commonTestManager.adminToken,
  async createEntity(
    app: Express,
    data: PostInput,
    expectedStatusCode: HttpStatusType = HttpStatus.Created,
  ) {
    const response = await request(app)
      .post(RouterPath.posts)
      .set("Authorization", this.adminToken)
      .send(data)
      .expect(expectedStatusCode);

    let createdEntity;

    if (expectedStatusCode === HttpStatus.Created) {
      createdEntity = response.body;

      expect(createdEntity).toEqual({
        id: expect.any(String),
        title: data.title,
        shortDescription: data.shortDescription,
        content: data.content,
        blogId: data.blogId,
        blogName: expect.any(String),
        createdAt: expect.any(String),
      });
    }

    return { response, createdEntity };
  },
};
