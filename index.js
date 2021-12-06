import express from "express";
import multer from "multer";
import path from "path";
import imageSize from "image-size";
import serveStatic from "serve-static";
import nodersa from "node-rsa";
import fs from "fs";

const app = express();
    const CORS = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Accept'
      };
    const login = 'tatiana.shirshikova';

    const tempPath = path.resolve();
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads");
      },
      filename: function (req, file, cb) {
        cb(null, file.fieldname);
      },
    });

    var upload = multer({ storage: storage });

    app
    .all('/login/', (req, res) => {
        res.set(CORS);
        res.send(login);
    })

    .use(express.json())

/* var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname);
  },
}); */

    .use("/", serveStatic(path.join(tempPath, "/public")))

    .get("/", function (req, res) {
        res.sendFile(path.join(tempPath, "/public/index.html"));
    })

    .post( "/decypher/",
        upload.fields([
            {
              name: "secret",
              maxCount: 1,
            },
            {
              name: "key",
              maxCount: 1,
            },
        ]),
    (req, res, next) => {
        const files = req.files;

        if (!files) {
          const error = new Error("Please choose files");
          error.httpStatusCode = 400;
          return next(error);
        }

        const privateKey = fs.readFileSync("./uploads/key", "utf8");
        const decrypted = new nodersa(privateKey).decrypt(
          fs.readFileSync("./uploads/secret"),
          "utf8"
        );

        res.send(decrypted);
        }
    )
    .listen(process.env.PORT || 4321);
