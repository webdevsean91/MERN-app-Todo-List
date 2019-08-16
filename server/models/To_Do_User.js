const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const ToDoUserSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    });

module.exports = User = mongoose.model("to_do_users", ToDoUserSchema);