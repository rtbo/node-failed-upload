const app = require("..");
const chai = require("chai");
const fs = require("fs");

chai.use(require("chai-http"));

const { expect, request } = chai;

describe("Upload test", function() {
  let server;
  before(function(done) {
    server = app.listen(3000, done);
  });

  it("should work", async function() {
    const content = "abcd".repeat(100);

    const res = await request(server)
      .post("/upload")
      .set({
        "content-length": content.length,
        "x-upload-offset": 0,
        "x-upload-length": content.length
      }).send(content);
    expect(res).to.have.status(200);
    expect(res.body).to.deep.include({
        length: content.length,
        offset: 0,
        uploadLength: content.length,
    });
    const fileContent = await fs.promises.readFile('test.bin');
    expect(fileContent.toString('binary')).to.equal(content);
  });
});
