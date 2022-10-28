const { Thoughts, User } = require('../models');

const thoughtsController = {

  //get all thoughts
getAllThoughts(req, res) {
  Thoughts.find({})
    .then(dbThoughtsData => res.json(dbThoughtsData))
    .catch(err => res.json(err))
  },
  //add thoughts
  addThoughts(req, res) {
    Thoughts.create(req.body)
      .then((dbThoughtData) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts:dbThoughtData._id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
    
  },

  //get thoughts by id
  getThoughtsById ({ params }, res) {
    Thoughts.findOne({ _id: params.thoughtsId })
    .populate({
      path: "reactions",
      select: "-__v"
    })
    .select('-__v')
    .then (dbThoughtsData => {
      if (!dbThoughtsData) {
        res.status(404).json({ message: "No thought found."});
        return;
      }
      res.json(dbThoughtsData);
    })
    .catch(err => res.json(err));
  },

  //remove thoughts
removeThoughts({ params }, res) {
  Thoughts.findOneAndDelete({ _id: params.thoughtsId })
    .then(deletedThoughts => {
      if (!deletedThoughts) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }
      return Thoughts.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { comments: params.commentId } },
        { new: true }
      );
    })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.json(err));
  
},

// add a reaction to a thought
addReaction({ params, body }, res) {
  Thoughts.findOneAndUpdate(
    { _id: params.thoughtsId },
    { $push: { reactions: body } },
    { new: true }
  )
    .then((dbThoughtsData) => {
      if (!dbThoughtsData) {
    res.status(404).json({ message: 'No thought with this id!' });
  return;    
  }
  res.json(dbThoughtsData);
    })
    .catch(err => res.json(err));
  
  },


// remove reaction from a thought
removeReaction({ params, body }, res) {
  Thoughts.findOneAndUpdate(
    { _id: params.thoughtsId },
    { $pull: { reactions: { reactionId: body.reactionId } } },
    { new: true }
  )
    .then((dbThoughtsData) => {
      if (!dbThoughtsData) {
     res.status(404).json({ message: 'No thought with this id!' });
    return; 
    }
      res.json(dbThoughtsData);
    })
    .catch(err => res.json(err));
  }
};
module.exports = thoughtsController;