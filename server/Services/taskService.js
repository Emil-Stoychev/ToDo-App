const { User } = require("../Models/User");
const { Task } = require("../Models/Task");
const { TaskCnt } = require("../Models/TaskCnt");

const getALlTasks = async (userId) => {
  try {
    let userAcc = await User.findById(userId);

    if (!userAcc) {
      return { message: "User doesn't exist!" };
    }

    return await Task.find({ author: userId });
  } catch (error) {
    return error;
  }
};

const getCurrentTask = async (taskId, userId) => {
  try {
    let userAcc = await User.findById(userId);

    if (!userAcc) {
      return { message: "User doesn't exist!" };
    }

    console.log("Getting data");

    return await Task.findById(taskId)
    .populate(['todo', 'inProgress', 'done', 'admins', 'author', 'employees'])
    
  } catch (error) {
    return error;
  }
};

const createNewMain = async (value, userId) => {
  try {
    let userAcc = await User.findById(userId);

    if (!userAcc) {
      return { message: "User doesn't exist!" };
    }

    if (value.trim() == "" && value.length < 3) {
      return { message: "Title must be at least 3 characters!" };
    }

    let findTask = await Task.find({ mainTitle: value });

    if (findTask._id) {
      return { message: "You already have main task with this title!" };
    }

    let createdMain = await Task.create({
      mainTitle: value,
      author: userId,
      admins: [userId],
    });

    userAcc.tasks.push(createdMain._id);
    userAcc.save();

    return createdMain;
  } catch (error) {
    return error;
  }
};

const createTask = async (value, taskId, userId) => {
    try {
      let userAcc = await User.findById(userId);
  
      if (!userAcc) {
        return { message: "User doesn't exist!" };
      }
  
      if (value.trim() == "" && value.length < 3) {
        return { message: "Title must be at least 3 characters!" };
      }
  
      let findTask = await Task.findById(taskId);
  
      if (!findTask._id) {
        return { message: "Main task not found!" };
      }
  
      let createdTask = await TaskCnt.create({
        title: value,
        author: userId,
      });
  

      findTask.todo.push(createdTask._id);
      findTask.save();
  
      return createdTask;
    } catch (error) {
      return error;
    }
  };

module.exports = {
  getALlTasks,
  createNewMain,
  getCurrentTask,
  createTask
};
