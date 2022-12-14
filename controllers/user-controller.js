const { User } = require('../models');

const userController = {
  // get all users
  getAllUsers(req, res) {
    User.find({})
    .populate({
      path: "thoughts",
      select: "-__v",
    })
    .populate({
      path: "friends",
      select: "-__v",
    })
      .select("-__v")
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one user by id
  getUserById(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate('friends')
      .populate('thoughts')
      .select( "-__v")
      .then(dbUserData => {
        // If no user is found, send 404
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // create user
createUser(req, res) {
    User.create(req.body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },

  //update user
  updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId},
      {
        $set: req.body,
      },
      { new: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  //delete user
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

//add friend
addFriend({ params }, res) {
  User.findOneAndUpdate(
    {_id: params.userId },
    { $push: { friends: params.friendId } }, 
    { new: true }
  )
  .then(dbUserData => {
    if (!dbUserData) {
      res.status(404).json({ message: "No user found."});
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => res.json(err));
},

//delete friend
deleteFriend({ params }, res) {
  User.findOneAndUpdate(
    { _id: params.userId },
    { $pull: { friends: params.friendId } },
    { new: true }  
  )
  .then(dbUserData => res.json(dbUserData))
  .catch(err => res.json(err));
}
};

module.exports = userController;