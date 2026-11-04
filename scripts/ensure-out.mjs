import {mkdir} from 'node:fs/promises';

await mkdir('out', {recursive: true});
