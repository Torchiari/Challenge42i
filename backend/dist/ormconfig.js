"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_entity_1 = require("./src/tasks/entities/task.entity");
const config = {
    type: 'sqlite',
    database: 'data.sqlite',
    entities: [task_entity_1.Task],
    synchronize: true,
    logging: false
};
exports.default = config;
//# sourceMappingURL=ormconfig.js.map