const sharp = require('sharp');
const fs = require('fs');

module.exports = async function(req, res, next) {
    if(req.file) {
        console.log(req.file)
        sharp.cache(false);
        await sharp(req.file.path)
            .webp()
            .resize(206, 260)
            .toFile("images\\resizedimages\\" + req.file.filename + ".webp")
            .then(() => 
            {console.log("Success");
            fs.unlinkSync(req.file.path,err => {if (err) console.log(err);})})
            .catch((error ) => console.log("Error occured", error));
    } 
    
    next()
}
