const { Thoughts, User } = require('../models');

const thoughtsController = {
  addThoughts({ params, body }, res) {
    console.log(body);
    Thoughts.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
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

removeThoughts({ params }, res) {
  Thoughts.findOneAndDelete({ _id: params.thoughtsId })
    .then(deletedThoughts => {
      if (!deletedThoughts) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }
      return Thoughts.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { comments: params.userId } },
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
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
     res.status(404).json({ message: 'No thought with this id!' });
    return; 
    }
      res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
  }
};
module.exports = thoughtsController;