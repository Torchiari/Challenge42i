"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    const config = app.get(config_1.ConfigService);
    const port = config.get('PORT') || 3000;
    const prefix = config.get('API_PREFIX') || 'api';
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.setGlobalPrefix(prefix);
    await app.listen(port);
    console.log(`🚀 Server running on http://localhost:${port}/${prefix}`);
}
bootstrap();
//# sourceMappingURL=main.js.map