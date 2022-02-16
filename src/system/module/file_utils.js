const {getNowFormatted} = require('../utils');
const fs = require('fs');
const path = require('path');

async function uploadImage(mBase64) {
    if (mBase64 === null || mBase64 === '') return '';
    try {
        let base64 = mBase64.split(',');

        let content = mBase64.split(';')[0].split(':')[1];

        let extension = content.split('/')[1];

        let nameFile = 'image' + getNowFormatted() + '-' + content.split('/')[0] + '.' + extension;

        await fs.writeFileSync('assets/' + nameFile, Buffer.from(base64[1], "base64"));
        return '/file-upload?g=' + nameFile;
    } catch (e) {
        return '';
    }


}


async function showImage(req, res) {
    try {
        let dir = path.join(__dirname, '../../../assets');
        let s1 = '/' + req.query.g;
        let s2 = s1.split('-')[1];
        let file = path.join(dir, s1);
        var s;
        if (fs.existsSync(file)) {
            s = await fs.createReadStream(file);
        }
        if (s) {
            res.setHeader('content-type', s2.replace('-', '/'))
            return s.pipe(res);
        }
        return '';
    } catch (e) {
        console.log(e);
    }

}

module.exports = {
    uploadImage, showImage
}