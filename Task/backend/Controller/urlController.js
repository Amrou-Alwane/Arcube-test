const Url = require('../model/urlModel');
const shortid = require('shortid');
const {isWebUri} = require('valid-url');


const getUrlById = async (req, res) => {
    try {
        const { shortId } = req.params;
        if (!shortId) {
            return res.status(404).json({ error: 'shortId is required' });
        }
        const urlEntry = await Url.findOne({ shortId });
    
        if (!urlEntry) {
          return res.status(404).json({ error: 'URL not found' });
        }
        
    
        res.redirect(urlEntry.originalUrl);
      } catch (error) {
        console.error('Error in redirectUrl:', error);
        res.status(500).json({ error: 'Server error' });
      }
}






const postUrl = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!isWebUri(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
}

  const shortId = shortid.generate();
  const newUrl = new Url({ originalUrl: url, shortId });

  await newUrl.save();
  res.json({ shortenedUrl: `http://147.189.175.89:5005/${shortId}` });
};



module.exports = {getUrlById, postUrl };
