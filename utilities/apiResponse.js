
function apiResponse(res, sucess, status, message, putData, data) {
    if (sucess) {
        if (putData)
            return res.status(status).json({ "sucess": sucess, message, data });
        else
            return res.status(status).json({ "sucess": sucess, message });
    }
    else {
        return res.status(status).json({ "sucess": sucess, message, error: data });
    }
}

module.exports = apiResponse;