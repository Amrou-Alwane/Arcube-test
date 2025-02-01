var express = require('express');
var router = express.Router();
const {getUrlById, postUrl} = require('../Controller/urlController');

router.post('/shorten', postUrl);
router.get('/:shortId', getUrlById);


module.exports = router;
