const express = require('express');
const router = express.Router();

const requiresAuth = require('../middelware/persmissions');
const ToDo = require('../Models/Todo');
const validateTodoInput = require('../validation/toDoValidation')


//@route GET /api/Todos/Test
//@desc Test the Todos route
//@access Public


router.get("/test", (req, res)=>{
    res.send("ToDo's route working");
});


//@route GET /api/Todos/new
//@desc create a new Todo
//@access Private

router.post("/new", requiresAuth, async(req, res)=>{
    try {
        const {isValid, errors} = validateTodoInput(req.body);
        if(!isValid){
            return res.status(400).json(errors);
        }
        //create new todo
        const newToDo = new ToDo({
            user: req.user._id,
            content: req.body.content,
            complete: false,
        });

        //save the new todo to the database
        await newToDo.save();
        return res.json(newToDo)

    } catch (error) {
        console.log(err);

        return res.status(500).send(error.msg)
    }
});


//@route GET /api/todos/current
//@desc Current users todos
//@access Private

router.get("/current", requiresAuth, async (req, res)=>{
    try {
        const completeToDos = await ToDo.find(
            {
                user: req.user._id,
                complete: true,
            }).sort({completedAt: -1});

            const incomleteToDos = await ToDo.find({
                user: req.user._id,
                complete: false
            }).sort({createdAt: -1});

            return res.json({incomlete: incomleteToDos, complete: completeToDos})
        
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message);
    }
})

module.exports = router;


