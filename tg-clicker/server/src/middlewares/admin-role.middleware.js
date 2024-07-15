import ApiError from '../exceptions/api.error.js';


export default function AdminRoleMiddleware(req, res, next) {
    try {
        if (!req.user.role === 'ADMIN') {
            return next(ApiError.Forbiden());
        }

        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};