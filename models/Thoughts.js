const { Schema, model, Types } = require('mongoose');

const ReactionSchema = new Schema (
    {
     reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    }, 
    reactionBody: {
        type: String,
        required: true, 
        maxLength: 280
    }, 
    username: {
        type: String, 
        required: true
    }, 
    createdAt: {
        type: Date, 
        default: Date.now
    }

}, 
{
    toJSON: {
        getters: true
    },
    id: false
});

const ThoughtsSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    username: {
        type: String,
        required: true
    },
    reactions: [ReactionSchema]
},
    {
        toJSON: {
            getters: true
        },
        id: false
    }
);

ThoughtsSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thoughts = model('Thoughts', ThoughtsSchema);

module.exports = Thoughts;
