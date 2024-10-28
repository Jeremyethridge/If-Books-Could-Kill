//const router = require('express').Router();
const express = require('express');
const session = require('express-session');
const routes = require('./controllers');
const path = require('path');
const exphbs = require('express-handlebars');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: 'ifBooksCouldKill secret session key',
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'strict'
  },
  resave: false,
  saveUninitialized: true,
 store: new SequelizeStore({
  db: sequelize
 })
};

console.log(sess);

app.use(session(sess));

const hbs = exphbs.create();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.resolve(__dirname, 'public')));

app.use(routes);

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Now listening on ${PORT}`));
});
