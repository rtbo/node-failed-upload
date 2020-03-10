const Koa = require("koa");
const fs = require("fs");
const util = require("util");
const stream = require("stream");

const app = new Koa();

const pipeline = util.promisify(stream.pipeline);

app.use(async ctx => {
  const {
    "content-length": length,
    "x-upload-offset": offset,
    "x-upload-length": uploadLength
  } = ctx.request.headers;

  const openFlags =
    fs.constants.O_WRONLY | fs.constants.O_CREAT;

  // upload is made of a single chunk
  const ws = fs.createWriteStream("test.bin", {
    flags: openFlags,
    encoding: "binary"
  });
  await pipeline(ctx.req, ws);

  ctx.status = 200;
  ctx.response.body = {
    length: parseInt(length),
    offset: parseInt(offset),
    uploadLength: parseInt(uploadLength)
  };
});

module.exports = app;
