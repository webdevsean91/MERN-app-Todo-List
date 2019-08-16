const   express = require("express")
        ,router = express.Router()
        ,bcrypt = require("bcryptjs")
        ,jwt = require("jsonwebtoken")
        ,keys = require("../../config/keys")

// Load input validation
const validateToDoInput = require("../../validation/to_do_data");

// Load ToDoData model
const ToDoData = require("../../models/To_Do_Data");

/*
THE ORDER OF THE ROUTES IS IMPORTANT!!!!
*/

// DEBUG - Simple get
/* router.get("/", (req, res) => {
    res.send("got to to_do.js")
}) */

/* I don't think I need this but will leave it for now.  */
// @route GET api/to_do/all
// @desc Get all list entries
// @access Public
router.get("/all", (req, res) => {
    // get all list items... order by ??
    return ToDoData.find(
        (err, list) => {
            if(err) return console.error(err)
            res.send(list)
        }
    )
})

// @route DELETE api/to_do/:id
// @desc Delete list entry by id
// @access Public
router.delete( '/:id', async (req, res) => {
    //Debug
    //console.log(`in delete id is ${req.params.id}`)

    try{
        let to_do = await ToDoData.findByIdAndDelete(req.params.id);
        if(!to_do) res.status(404).send({"err": "No item found"})
        res.status(200).send({})
    } catch(err) {
        res.status(500).send(err)
    }
})

// @route GET api/to_do/:id
// @desc Get list by user_id
// @access Public
router.get( '/:id', (req, res) => {
    let id = req.params.id
    //Debug
    //console.log(`id is ${req.params.id}`)

    // I was using these functions to insert dummy data
    /* 
    myToDoData = new ToDoData({
        user_id: '5d41b0666510f881c71ac97b',
        to_do: '2nd test item iserted manually'
    });
    
    myToDoData
        .save()
        .then(user => res.json(user))
        .catch(err => console.error(err));
    
     */

    // get the list items for the id... order by ??
    return ToDoData.find(
        { user_id: id },
        (err, list) => {
            if(err) return console.error(err)
            res.send(list)
        }
    )
})

// @route POST api/to_do/
// @desc Post list entry
// @access Public
router.post( '/', (req, res) => {
    // Form validation
    const { errors, isValid } = validateToDoInput(req.body);

    // Check validation
    if (!isValid) {
        //Debug
        //console.log("****** Server Error in routes/api/to_do_data.js: ******")
        //console.log(errors)
        return res.status(400).json(errors);
    }

    // create an object to save
    let ToDoItem = new ToDoData({
        user_id: req.body.user_id,
        to_do: req.body.to_do
    })

    // save the object
    ToDoItem.save(function(err, data) {
        if (err) {
            //Debug
            //console.error(err);
            res.status(500).send({ message: "Some error occurred while saving the list." });
        } else {
            //Debug
            //console.log(data);
            res.status(200).send({ message: "The item has been added to the list."});
        }
    });
})

module.exports = router;