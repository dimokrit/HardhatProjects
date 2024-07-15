import apiError from '../exceptions/api.error.js';


export default function ErrorMiddleware(err, req, res, next) {
    console.error(`ERROR: ${err}`);
    if (err instanceof apiError) {
        return res.status(err.status).json({ message: err.message, errors: err.errors });
    }
    return res.status(500).json({ message: 'ERROR: critical error!', error: err });
};