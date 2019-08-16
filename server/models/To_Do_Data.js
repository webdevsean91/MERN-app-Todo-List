const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const ToDoDataSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    to_do: {
        type: String,
        required: true
    }
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'to_do_data'
});

module.exports = to_do = mongoose.model("to_do_data", ToDoDataSchema);