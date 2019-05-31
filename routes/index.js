const express = require('express');
const router = express.Router();
const app = require('../app');

let status = 'Waiting for file upload';

router.get('/', (req, res) => {
  res.render('index', {status: status});
  status = 'Waiting for file upload';

});

router.post('/', function(req, res) {
  status = 'Waiting for file upload';
  if (!req.files) {
    status = 'no file';
    return res.status(400).redirect('/');

  }

  let fName = req.files.fName;

  fName.mv('./upload/' + fName.name, function(err) {
    if (err)
      return res.status(500).send(err);

    app.fileRead('./upload/'+fName.name);
    status = 'You file' + ' ' + fName.name + ' ' + 'has been uploaded';
    res.redirect('/');
  });
});



module.exports = router;
