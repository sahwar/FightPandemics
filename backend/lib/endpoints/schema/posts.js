const S = require("fluent-schema");
const { strictSchema, strictQueryStringSchema } = require("./utils");

const {
  EXPIRATION_OPTIONS,
  POST_OBJECTIVES,
  POST_TYPES,
  VISIBILITY_OPTIONS,
} = require("../../models/Post");

const getPostsSchema = {
  querystring: strictQueryStringSchema()
    .prop("actorId", S.string())
    .prop("authorId", S.string())
    .prop("filter", S.string()) // URI encoded JSON; TODO: figure out way to custom validation
    .prop("keywords", S.string())
    .prop("ignoreUserLocation", S.boolean().default(false))
    .prop("objective", S.string().enum(POST_OBJECTIVES))
    .prop("skip", S.integer())
    .prop("postMode", S.string())
    .prop("includeMeta", S.boolean().default(false)),
};

const createPostSchema = {
  body: strictSchema()
    .prop("actorId", S.string())
    .prop("content", S.string().required())
    .prop("expireAt", S.string().enum(EXPIRATION_OPTIONS).required())
    .prop(
      "externalLinks",
      S.object()
        .prop("appStore", S.string().format("url"))
        .prop("email", S.string().format("email"))
        .prop("playStore", S.string().format("url"))
        .prop("website", S.string().format("url")),
    )
    .prop("language", S.array().items(S.string()))
    .prop("objective", S.string().enum(POST_OBJECTIVES).required())
    .prop("title", S.string().required())
    .prop(
      "types",
      S.array().minItems(1).items(S.string().enum(POST_TYPES)).required(),
    )
    .prop("visibility", S.string().enum(VISIBILITY_OPTIONS).required()),
};

const getPostByIdSchema = {
  querystring: S.object().prop("actorId", S.string()),
};

const updatePostSchema = {
  body: strictSchema()
    .prop("content", S.string())
    .prop("expireAt", S.string().enum(EXPIRATION_OPTIONS))
    .prop(
      "externalLinks",
      S.object()
        .prop("appStore", S.string().format("url"))
        .prop("email", S.string().format("email"))
        .prop("playStore", S.string().format("url"))
        .prop("website", S.string().format("url")),
    )
    .prop("language", S.array().items(S.string()))
    .prop("objective", S.string().enum(POST_OBJECTIVES))
    .prop("title", S.string())
    .prop("types", S.array().minItems(1).items(S.string().enum(POST_TYPES)))
    .prop("visibility", S.string().enum(VISIBILITY_OPTIONS)),
  params: S.object().prop("postId", S.string()),
};

const likeUnlikePostSchema = {
  params: strictSchema()
    .prop("actorId", S.string().required())
    .prop("postId", S.string().required()),
};

const likeUnlikeCommentSchema = {
  params: strictSchema()
    .prop("actorId", S.string().required())
    .prop("postId", S.string().required())
    .prop("commentId", S.string().required()),
};

const deletePostSchema = {
  params: strictSchema().prop("postId", S.string().required()),
};

const createCommentSchema = {
  body: strictSchema()
    .prop("actorId", S.string())
    .prop("content", S.string().required())
    .prop("parentId", S.string()),
  params: strictSchema().prop("postId", S.string().required()),
};

const getCommentsSchema = {
  params: strictSchema().prop("postId", S.string().required()),
  queryString: strictQueryStringSchema().prop("skip", S.integer()),
};

const deleteCommentSchema = {
  params: strictSchema()
    .prop("commentId", S.string().required())
    .prop("postId", S.string().required()),
};

const updateCommentSchema = {
  body: strictSchema().prop("content", S.string().required()),
  params: strictSchema()
    .prop("commentId", S.string().required())
    .prop("postId", S.string().required()),
};

module.exports = {
  createCommentSchema,
  createPostSchema,
  deleteCommentSchema,
  deletePostSchema,
  getCommentsSchema,
  getPostByIdSchema,
  getPostsSchema,
  likeUnlikeCommentSchema,
  likeUnlikePostSchema,
  updateCommentSchema,
  updatePostSchema,
};
