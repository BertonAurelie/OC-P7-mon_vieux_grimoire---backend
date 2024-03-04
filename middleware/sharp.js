const sharp = require('sharp');

module.exports = (req, res, next) => {
    sharp(req.file.path)
        .webp()
        .resize(206, 260)
        .toFile("images\\resizedimages\\" + req.file.filename + ".webp")
        .then(() => console.log("Success"))
        .catch((error ) => console.log("Error occured", error));

    next()
}
