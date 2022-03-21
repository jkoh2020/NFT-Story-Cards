const Story = require('../models/stories');
const Banner = require('../models/banners');

const getAllStories = async (req, res) => {
  try {
    console.log("get All storiesss-----")
    const stories = await Story.find();
    res.status(200).json(stories);
  } catch (err) {
    res.status(401).json({ Message: err });
  }
};


const getAllLoginBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (err) {
    res.status(401).json({ Message: err });
  }
};

const updateLastBanner = async (req, res) => {
console.log("req updateLastBanner" , req.body )
  try {
    const bannerId = req.body._id;
    const { image, bannername, path, showBanner } = req.body;
    const fields = {
      image, 
      bannername, 
      path,
      showBanner: false,
    };
console.log("Fields::::::::" , fields)
     const result = await Banner.updateOne(
      { _id: bannerId },
      { $set: { ...fields } }
    ); 

    res.status(200).json({ message: `${result.bannername} which is the Last Banner is Updated successfully` });
  } catch (err) {
    res.status(204).json({ message: err });
  }
};

const updateCurrentBanner = async (req, res) => {
  try {
    console.log("req updateCurrentBanner::::" , req.body)
    const bannerId = req.body._id;
    const { image, bannername, path, showBanner } = req.body;
    const fields = {
      image, 
      bannername, 
      path,
      showBanner: true,
    };

    const result = await Banner.updateOne(
      { _id: bannerId },
      { $set: { ...fields } }
    );

    res.status(200).json({ message: `${result.bannername} which is the Current Updated successfully on Login Page` });
  } catch (err) {
    res.status(204).json({ message: err });
  }
};


const searchStory = async (req, res) => {
  try {
    const s = await Story.find({
      name: { $regex: req.query.query || '', $options: 'i' },
    });
    res.json(s);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};


module.exports = {
  getAllStories,
  getAllLoginBanners,
  updateLastBanner,
  updateCurrentBanner,
  searchStory,
};
