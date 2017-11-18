// server
import path from "path";
import * as fs from "fs";
import express from "express";
import bodyParser from "body-parser";

import graphQLHttp from "express-graphql";
import { schema } from "./schema/schema";

// webpack
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import config from "../../config/webpack.config.dev";

const isDeveloping = process.env.NODE_ENV !== "production";
const server = express();

// graphql
server.use(bodyParser.json());
server.use(
    "/graphql",
    graphQLHttp({
        schema,
        graphiql: true
    })
);

if (isDeveloping) {
    const compiler = webpack(config);
    const devMiddleware = webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        stats: { colors: true }
    });
    const hotMiddleware = webpackHotMiddleware(compiler, {
        log: console.log,
        path: "/__webpack_hmr",
        heartbeat: 10 * 1000
    });

    server.use(devMiddleware);
    server.use(hotMiddleware);

    server.use("*", function(req, res, next) {
        var filename = path.join(compiler.outputPath, "index.html");
        compiler.outputFileSystem.readFile(filename, function(err, result) {
            if (err) {
                return next(err);
            }
            res.set("content-type", "text/html");
            res.send(result);
            res.end();
        });
    });
} else {
    server.use(express.static(path.join(__dirname, "..", "..", "/build/")));
    server.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "..", "/build/index.html"));
    });
}

export default server;
