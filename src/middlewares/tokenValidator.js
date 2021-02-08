const { verify } = require('jsonwebtoken');
const config = require('config');

const tokenValidator = (req, res, next) => {
    const token = req.body.token;

    if (!token)
        return res.status(401).send({ errors: [{ msg: 'Token not valid, Authorization denied' }] });
    try {
        const payload = verify(token, config.get('jwtSecretKey'));
        req.user = payload.user;
        return next();

    } catch (error) {
        return res.status(500).send({ errors: [{ msg: 'Token not valid, Authorization denied' }] });
    }
};

module.exports = tokenValidator;
