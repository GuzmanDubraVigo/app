const jwt = require("jsonwebtoken");

const generateToken = (payload, isRefresh) => {
if (isRefresh)  {
    return jwt.sign(payload, process.env.TOKEN_REFRESH,{
        expiresIn: "60min",
    });
}
return jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: "30min"});
};

module.exports = { generateToken };
