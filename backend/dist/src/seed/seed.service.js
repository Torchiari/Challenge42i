"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const ormconfig_1 = __importDefault(require("../../ormconfig"));
const task_entity_1 = require("../tasks/entities/task.entity");
async function run() {
    const ds = new typeorm_1.DataSource(ormconfig_1.default);
    await ds.initialize();
    const repo = ds.getRepository(task_entity_1.Task);
    await repo.clear();
    const t1 = repo.create({
        title: 'Estudiar React',
        description: 'Repasar hooks y componentes',
        status: 'Backlog',
        priority: 'Medium',
        estimate: 3
    });
    const saved1 = await repo.save(t1);
    const t2 = repo.create({
        title: 'Hacer examen técnico',
        description: 'Entregar antes del viernes',
        status: 'Unstarted',
        priority: 'High',
        estimate: 5
    });
    const saved2 = await repo.save(t2);
    const sub = repo.create({
        title: 'Repasar useEffect',
        status: 'Backlog',
        estimate: 1,
        parent: saved1
    });
    await repo.save(sub);
    console.log('Seed done');
    await ds.destroy();
}
run().catch((e) => { console.error(e); process.exit(1); });
//# sourceMappingURL=seed.service.js.map