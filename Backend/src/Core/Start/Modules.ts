type Modules = 'START_SCREEN' | 'OLD_PAGE' | 'CONVERSATION' | 'INFO';

export const START_REPLICATION_MODULES: Array<Modules> = [
    'START_SCREEN',
    'OLD_PAGE',
    'CONVERSATION',
    'INFO'
];

export function isStartReplicationModule(value: unknown): value is Modules {
    return typeof value === 'string' && START_REPLICATION_MODULES.includes(value as Modules);
}

export default Modules;
