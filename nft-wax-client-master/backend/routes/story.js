var express = require('express');
var router = express.Router();
const isAuthenticated = require('../middleware/auth');

const {
  getAllStories,
  getAllLoginBanners,
  updateLastBanner,
  updateCurrentBanner,
  searchStory
} = require('../controllers/stories.controller');

const {
  userLogin,
  getUserAssets,
  verifyUserAssets,
} = require('../controllers/user.controller');



router.post('/login', userLogin);

// Get All stories
router.get('/stories', getAllStories);

// Gett All Login Banners
router.get('/banners', getAllLoginBanners);

//Update/Hide Banner from Login Page
router.put('/updatebannerAsFalse', updateLastBanner);

//Update/Add Banner on Login Page
router.put('/updatebannerAsTrue', updateCurrentBanner);

// Get Assets by User name
router.get('/assets', isAuthenticated, getUserAssets);

// Check user has Asset for the story
router.get('/story/:id', isAuthenticated, verifyUserAssets);

// Search Story
router.get('/search/story', isAuthenticated, searchStory);


module.exports = router;
