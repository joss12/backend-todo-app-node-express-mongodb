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

//@route PUT /api/todos/:toDoId/complete
//@desc Marke todos as complete
//@access Private

router.put("/:toDoId/complete", requiresAuth, async(req, res)=>{
    try {
        const toDo = await ToDo.findOne({
            user: req.user._id,
            _id: req.params.toDoId
        });

    if(!toDo){
        return res.status(401).json({error: "Couldn't find Todo"})
    }

    if(toDo.complete){
        return res.status(400).json({error: "ToDo is already completed"})
    };
    const upodatedTodo = await ToDo.findByIdAndUpdate(
        {
            user:req.user._id,
            _id: req.params.toDoId,
        },{
            complete: true,
            completedAt: new Date(),
        },{
            new: true
        }
        );
        return res.json(upodatedTodo)
        
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message)
    }
});

//@route PUT /api/todos/:toDoId/incomplete
//@desc Marke todos as incomplete
//@access Private

router.put("/:toDoId/incomplete", requiresAuth, async(req, res)=>{
    try {
        const toDo = ToDo.findOne({
            user: req.user._id,
            _id: req.params.toDoId,
        });

        if(!toDo){
            return res.status(404).json({error: "Could not find Todo"})
        }

        if(!toDo.complete){
            return res.status(400).json({error: "ToDo is already incomplte"});
        }

        const upodatedTodo = await ToDo.findByIdAndUpdate(
            {
                user: req.user._id,
                _id: req.params.toDoId,
            },{
                complete: false,
                completedAt: null
            },{
                new: true
            }
        )

        return res.json(upodatedTodo);

    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
        
    }
});

//@route PUT /api/todos/:toDoId
//@desc Updtae a todo
//@access Private


router.put("/:toDoId", requiresAuth, async (req, res)=>{
    try {
        const toDo = await ToDo.findOne({
            user: req.user._id,
            _id: req.params.toDoId
        });

        if(!toDo){
            return res.status(404).json({error: "Could not find ToDo"});
        }

        const {isValid, errors} = validateTodoInput(req.body);

        if(!isValid){
            return res.status(400).json(errors);

        }
        const upodatedTodo = await ToDo.findByIdAndUpdate(
            {
                user: req.user._id,
                _id: req.params.toDoId,
            },{
                content: req.body.content,
            },
            {
                new: true
            }
        );

        return res.json(upodatedTodo)
        
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
})

//@route Delete /api/todos/:toDoId
//@desc Delete a todo
//@access Private

router.delete("/:toDoId", requiresAuth, async(req, res)=>{
    try {
        const toDo = await ToDo.findOne({
            user: req.user._id,
            _id: req.params.toDoId,
        });
        if(!toDo){
            return res.status(400).json({error: "Could not find Todo"});
        }
        
        await ToDo.findOneAndRemove({
            user: req.user._id,
            _id: req.params.toDoId,
        });

        return res.json({success: true})

    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
})

module.exports = router;


