import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { PrismaService } from "./prisma/prisma.service";
import { ApiKeyGuard } from "./common/guards/api-key.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure global prefix and validation
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // Enable CORS
  app.enableCors();

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle("WisePrompt API")
    .setDescription("The WisePrompt API for AI prompts")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
      },
      "JWT"
    )
    .addBearerAuth(
      {
        type: "apiKey",
        in: "header",
        name: "X-API-Key",
      },
      "apiKey"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  // Custom middleware for API key auth header handling
  app.use(async (req, res, next) => {
    const apiKey =
      req.headers["x-api-key"] ||
      (req.headers.authorization?.startsWith("ApiKey ") &&
        req.headers.authorization.split(" ")[1]);

    if (apiKey) {
      // Store the API key in the request for later use
      req.apiKey = apiKey;
    }
    next();
  });

  // Prisma shutdown hooks
  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // Use port 3001 to avoid conflict with frontend port 3000
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API Documentation available at: http://localhost:${port}/docs`);
}

bootstrap();
