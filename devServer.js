var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var compiler = webpack(config);
var Project = require('./client/models/project');
var Property = require('./client/models/property');

mongoose.connect('mongodb://localhost/managizer'); 

app.use('/', express.static(path.join(__dirname, 'client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// ----------------------------------------------------
router.route('/projects')

  .get(function(req, res) {
    Project.find(function(err, projects) {
      if (err)
        res.send(err);

      res.json(projects);
    });
  })
  
  .post(function(req, res){
    var project = new Project(req.body);

    project.save(function(err) {
      if (err)
        res.send(err);

      res.json({ project: 'Project Created' });
    });
  })

  // ----------------------------------------------------
  router.route('/projects/:project_id')

    .get(function(req, res) {
      Project.findById(req.params.project_id, function(err, project){
        if (err) 
          res.send(err);
        res.json(project);
      });
    })

    .delete(function(req, res){
      Project.remove({
        _id: req.params.project_id
      }, function(err, project) {
        if (err)
          res.send(err);
          res.json({ message: 'Successfully Deleted' })
      });
    });


// ----------------------------------------------------
router.route('/properties')
  
  .get(function(req, res) {
    Property.find(function(err, properties) {
      if (err)
        res.send(err);

      res.json(properties);
    });
  });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// =============================================================================

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(7770, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:7770');
});
