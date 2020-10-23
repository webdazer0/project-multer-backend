const { Router } = require('express');
const path = require('path');
const fs = require('fs-extra');
const router = Router();
const Image = require('../model/Image');


router.get('/api/', (req, res) => {
    res.json({ message: 'This is API Homepage!' })
});

router.get('/api/upload', async (req, res) => {
    const images = await Image.find();
    res.json(images);
    return images;
})

router.post('/api/upload', async (req, res) => {
    console.log(req.file);
    const { filename } = req.file;
    const public_id = Math.floor(Math.random()*10000);

    const image = new Image({
        imgUrl: filename,
        public_id,
    });
    await image.save();
    res.redirect('/');
});

router.delete('/api/images/:id', async (req, res) => {
    console.log(req.params.id);
    const { id } = req.params;
    try {
        const image = await Image.findById(id);
    const { imgUrl } = image;
    console.log('rolling');
    console.log(path.join(__dirname, `../public/uploads/${imgUrl}`));
    await fs.unlink(path.join(__dirname, `../public/uploads/${imgUrl}`));
    console.log('in the');
    await Image.findByIdAndDelete(id);
    console.log('deep');
    
    } catch(err) { console.log(err)}
    
    return res.json({message: 'deleted!'});
})

module.exports = router;