const Users = require('./users'); // Update with the correct path

const authenticateUser = async (req, res, next) => {
    const kodeLoginCookie = req.cookies.kode_login;

    if (kodeLoginCookie) {
        // Check if the kode_login value is valid (e.g., exists in the Users collection)
        const user = await Users.findOne({ kode_login: kodeLoginCookie });

        if (user) {
            // User is authenticated, proceed to the next middleware or route handler
            next();
        } else {
            // Invalid kode_login value, redirect to login page or handle accordingly
            res.redirect('/login'); // Update with your login route
        }
    } else {
        // kode_login cookie not present, redirect to login page or handle accordingly
        res.redirect('/login'); // Update with your login route
    }
};

module.exports = authenticateUser;
