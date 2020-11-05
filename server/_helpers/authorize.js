const expressJwt = require('express-jwt');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];



module.exports = authorize;

function authorize(roles = []) {
    // if (typeof roles !== 'string') {
    //     roles = [roles];
    // }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        // expressJwt( {secret: config.jwtSecret }),

        // authorize based on user role
        (req, res, next) => {
            console.log('------- ROLES--------');
            console.log(roles,'==',req.user.role);
            console.log('------- ROLES--------',roles.includes(req.user.role));
            if (roles.length && !roles.includes(req.user.role)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            next();
        }
    ];
}