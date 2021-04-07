import uploadFileMiddleware from '../../middlewares/fileUpload'
const config = require('config');
const dir = config.get('fileUpload.dir');

const upload = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);

    if (req.file === undefined) {
      return {completed: false};
    }

    return {completed: true};
  } catch (err) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return {completed: false};
    }
    return {completed: false};
  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

module.exports = {
  upload,
  getListFiles,
  download,
};