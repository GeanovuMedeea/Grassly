import { chromeLauncher } from '@web/test-runner-chrome';

export default {
    files: ['test/test.js'],
    nodeResolve: true,
    browsers: [chromeLauncher()],
};