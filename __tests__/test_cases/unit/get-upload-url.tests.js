require("dotenv").config();
const chance = require("chance").Chance();
const when = require("../../steps/when");

describe("When getImageUloadUrl runs", () => {
  it.each([
    [".png", "image/png"],
    ["jpeg", "image/jpeg"],
    [".png", null],
    [null, "image/jpeg"],
    [null, null],
  ])(
    "Returns a signed S3 url for extension %s and contentType %s",
    async (extension, contentType) => {
      const username = chance.guid();
      const signedUrl = await when.we_invoke_image_upload_url(
        username,
        extension,
        contentType
      );

      const { BUCKET_NAME } = process.env;
      const regex = new RegExp(
        `https://${BUCKET_NAME}.s3-accelerate.amazonaws.com/${username}/.*${
          extension || ""
        }\?.*Content-Type=${
          contentType ? contentType.replace("/", "%2F") : "image%2Fjpeg"
        }.*`
      );
      expect(signedUrl).toMatch(regex);
    }
  );
});
