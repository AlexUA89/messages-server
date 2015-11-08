To install project:

1) git clone git@bitbucket.org:avorobiov/social-map-express.git social-map-express
2) cd social-map-express
3) put env.json file in config folder
3) sudo npm install
4) sudo bower install
5) gulp --production (to watch for changes: gulp watch --production)
6) add as application parameter NODE_PATH=. (windows: set NODE_PATH=.  ___ ubuntu: export NODE_PATH=.)
7) node app.js
8) check localhost:3000

Good tool to run node: sudo npm install -g nodemon
And then just: nodemon app.js