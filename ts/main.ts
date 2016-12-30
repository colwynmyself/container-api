// Module imports
import * as koa from 'koa';
import * as route from 'koa-route';
import * as chalk from 'chalk';

// Module constructor imports
import * as Debug from 'debug';
import * as Logger from 'koa-logger';
import * as KoaBody from 'koa-better-body';

// Classes
import { Response } from './classes/Response';
import { CustomError } from './classes/CustomError';

// Object inits
const debug = Debug('colwyn:main');
const logger = Logger();

// App initialization
const app = koa();
// Global error handling
app.use(function* globalError(next: any) {
    try {
        yield next;
    } catch (err) {
        const customErr = new CustomError(err.message);
        customErr.debugError(this.request);
        this.status = 500;
        this.body = 'Internal server error: ' + err.message;
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
    // This is pretty lazy right now, the global error handler doesn't do a good job of responding with what the actual
    // problem that occured is.
    const responseObject = new Response(input);
    const output = responseObject.response;
    this.body = { input, output };
}));

// Server listen
app.listen(port, () => {
    debug(chalk.blue('colwyn.me API') + ` started on port ${port} in ${env} mode`);
});