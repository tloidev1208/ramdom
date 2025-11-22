const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ranking API",
      version: "1.0.0",
      description: "API lưu người chơi và xếp hạng theo skin / skill",
    },
    servers: [
      {
        url: "https://ramdom-ptp4.onrender.com",
      },
    ],
  },
  apis: ["./server.js"], // file có comment swagger
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swaggerDocs;
