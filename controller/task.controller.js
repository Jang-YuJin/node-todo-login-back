const Task = require("../model/Task");

const taskController = {};

taskController.createTask = async (req, res) => {
    try {
        const {task, isComplete} = req.body;
        const {userId} = req;
        const newTask = new Task({task, isComplete, author: userId});
        await newTask.save();
    
        res.status(200).json({status: 'ok', data: newTask});
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});        
    }
};

taskController.getTask = async (req, res) => {
    try {
        const taskList = await Task.find({}).populate('author').select('-__v');
        res.status(200).json({status: 'ok', data: taskList});
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

taskController.updateTask = async (req, res) => {
    try {
        const id = req.params.id;
        const {userId} = req;
        const {isComplete, completeDt} = req.body;
        const task = await Task.findById(id);
        task.isComplete = isComplete;
        task.completeDt = completeDt;
        task.author = userId;
        const updateTask = await task.save();

        if(!updateTask){
            res.status(400).json({status: 'fail', message: 'Task not Found'});
        }

        res.status(200).json({status: 'ok', data: updateTask});
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

taskController.deleteTask = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.findByIdAndDelete(id);
        res.status(200).json({status: 'ok', data: {_id: id}});
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

module.exports = taskController;