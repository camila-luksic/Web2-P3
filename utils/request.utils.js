module.exports = {
     isRequestValid(requiredFields, body, res) {
        for (let field of requiredFields) {
            if (!body[field]) {
                res.status(400).json({ msg: `Falta el campo ${field}` });
                return false;
            }
        }
        return true;
    },
    
    sendError500: (error) => {
        console.log('Error', error);
        res.status(500).json({
            msg: 'Error en el servidor'
        });
    },
}