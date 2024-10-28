const router = require('express').Router();
const Book = require('../models/books');
const User = require('../models/user')
const Auth = require('../utils/auth');

  router.get("/", function(req, res) {
    if (req.user) {
      res.redirect("/");
    } else {
      res.render('login');
    }
  });

  
router.get('/book/:id', async (req, res) => {
  try {
    const booksData = await Book.findByPk(req.params.id, {
      include: [
        {
          model: User,
        },
      ],
    });
    const book = booksData.get({ plain: true });
    res.render('book', {
      ...book,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/homepage', Auth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Book }],
    });
    const user = userData.get({ plain: true });
    res.render('homepage', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/checkout', (req, res) => {
  try {
    res.render('checkout-page');
  } catch (err) {
    console.log(err);
    res.status(500).json(err)
  }
});

router.get('/login', (req, res) => {
  try {
    res.render('login');
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}); 

router.post('/create-account', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email: email,
            password: hashedPassword 
        });
        req.session.user_id = newUser.id;
        req.session.logged_in = true;
        res.redirect('/homepage');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create account' });
    }
});
  module.exports = router;