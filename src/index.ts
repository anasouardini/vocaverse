import fs, { promises as fsp } from 'fs';
import path from 'path';
import db from './model/db';
import schema from './model/schema';
import controllers from './controller';
import { type Stage } from './types';

// schema.update();
// process.exit(0);

const args = process.argv.slice(2);
type Mode = 'consume';
const mode: Mode = args[0] as Mode;
if (mode !== 'consume') {
  process.exit(0);
}

// dispatcher
controllers[mode](args.slice(1));
