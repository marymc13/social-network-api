const router = require('express').Router();
const { 
    addThoughts,
    getThoughtsById,
    getAllThoughts,
    removeThoughts,
    addReaction,
    removeReaction
    } = require('../../controllers/thoughts-controller');

// /api/thoughts
router
.route('/')
.get(getAllThoughts)
.post(addThoughts);

// /api/thoughts/<userId>
router
.route('/:thoughtsId')
.get(getThoughtsById)
.delete(removeThoughts);

// /api/thoughts/:thoughtId/reactions
router
.route('/:thoughtsId/reactions')
.post(addReaction)
.delete(removeReaction);

module.exports = router;