// Module imports
const koa = require('koa');
const route = require('koa-route');
const chalk = require('chalk');

// Module constructor imports
const Debug = require('debug');
const Logger = require('koa-logger');
const KoaBody = require('koa-better-body');

// Classes
import { Response } from './classes/Response';

// Object inits
const debug = Debug('colwyn:main');
const logger = Logger();

// App initialization
const app = koa();
// Global error handling
app.use(function* globalError(next) {
    try {
        yield next;
    } catch (systemErr) {
        debug(systemErr);
        this.status = 500;
        this.body = 'Internal server error.';
    }
});

// Server variables
const port = 3000;
const env = process.env.NODE_ENV || 'development';

// App middleware
app.use(logger);
app.use(KoaBody());

// Routes
app.use(route.post('/terminal-input', function* terminalnput() {
    const data = this.request.fields;
    const input = data.input;
    const responseObject = new Response(input);
    const output = responseObject.response;
    this.body = { input, output };
}));

// Server listen
app.listen(port, () => {
    debug(chalk.blue('colwyn.me API') + ` started on port ${port} in ${env} mode`);
});