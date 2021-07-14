const Key = require('../models/key.model');


module.exports.create = async function(req, res) {
    try {

        const data = {
            userId: req.body.userId,
            publicKey: req.body.publicKey
        };
        const newKey = new Key(data);
        const savedKey = await newKey.save();
        return res.status(201).json(savedKey);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

module.exports.getPublicKeyByUserId = async function(req, res) {
    try {
        const key = await Key.findOne({
            userId: req.params.userId
        });

        if (key)
            return res.status(200).json(key.publicKey);
        return res.status(404).json('Key not found');
    
    } catch (err) {
        return res.status(500).json(err);
    }
}





