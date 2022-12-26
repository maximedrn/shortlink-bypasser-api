// ./main.js


import express from 'express'
import cors from 'cors';
import fetch from 'node-fetch';
import { API } from './const.js';
import { METHOD, NO_PARAMETERS, NO_URL, NO_RESULT } from './errors.js';


// Middlewares.
const app = express();
app.use(express.json());
app.use(cors());


// Port listening.
const port = process.env.PORT || 5500;
app.listen(port, () => console.info(`Listening on port: ${port}`));


// Wrong method request used.
app.post('/', (_, response) => response.json(METHOD));
app.put('/', (_, response) => response.json(METHOD));
app.delete('/', (_, response) => response.json(METHOD));


app.get('/', async (request, response) => {
    // Get the paramaters from the GET request.
    const parameters = request.query;

    if (!parameters) response.json(NO_PARAMETERS);
    else if (!parameters.url) response.json(NO_URL);
    else {
        const url = API + parameters.url;
        const data = await fetch(url).then(result => {
            return result.ok ? result.json() : result.text()
                .then(error => { throw JSON.parse(error) })
        }).catch(error => { return error });

        // Check the result and change the success value.
        const success = data.success && !!data.destination;
        const message = success ? data.destination : NO_RESULT;
        response.json({ success, message });
    }
});
