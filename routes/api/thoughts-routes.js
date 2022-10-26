const router = require('express').Router();
const { 
    addThoughts,
    removeThoughts,
    addReaction,
    removeReaction
    } = require('../../controllers/thoughts-controller');

// /api/thoughts/<userId>
router.route('/:userId').post(addThoughts);

// /api/thoughts/<userId>/<thoughtsId>
router.route('/:userId/:thoughtsId').delete(removeThoughts);

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(addReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;