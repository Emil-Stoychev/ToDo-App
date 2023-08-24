const mongoose = require("mongoose");

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

    return await Task.findById(taskId).populate([
      {
        path: 'todo',
        populate: [
          { path: 'author', select: ['image', 'email'] },
          { path: 'workOnIt', select: ['image', 'email'] }
        ]
      },
      {
        path: 'inProgress',
        populate: [
          { path: 'author', select: ['image', 'email'] },
          { path: 'workOnIt', select: ['image', 'email'] }
        ]
      },
      {
        path: 'done',
        populate: [
          { path: 'author', select: ['image', 'email'] },
          { path: 'workOnIt', select: ['image', 'email'] }
        ]
      },
      {
        path: 'admins author employees', select: ['image', 'email']
      }
    ]);
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

const createTask = async (value, priority, taskId, userId) => {
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
      priority: priority == 'L' ? 'low' : priority == 'M' ? 'medium' : 'high'
    });

    findTask.todo.push(createdTask._id);
    findTask.save();

    return await TaskCnt.findById(createdTask?._id)
      .populate([
        { path: 'author', select: ['image', 'email'] }
      ]);
  } catch (error) {
    return error;
  }
};


const addOrRemoveUser = async (personId, mainId, userId) => {
  try {
    let userAcc = await User.findById(userId);

    if (!userAcc) {
      return { message: "User doesn't exist!" };
    }

    let person = await User.findById(personId);

    if (!person) {
      return { message: "This person doesn't exist!" };
    }

    let findTask = await Task.findById(mainId);

    if (!findTask._id) {
      return { message: "Task not found!" };
    }

    let option

    if (findTask?.employees.includes(personId)) {
      findTask.employees = findTask.employees.filter(x => x != personId)
      option = true
    } else {
      findTask.employees.push(personId)
      option = false
    }

    findTask.save()

    return { option, email: person?.email, image: person?.image }
  } catch (error) {
    return error;
  }
};

const editTask = async (taskId, value, userId) => {
  try {
    let userAcc = await User.findById(userId);

    if (!userAcc) {
      return { message: "User doesn't exist!" };
    }

    if (value.trim() == "" && value.length < 3) {
      return { message: "Title must be at least 3 characters!" };
    }

    let findTask = await TaskCnt.findById(taskId);

    if (!findTask._id) {
      return { message: "Task not found!" };
    }

    let editedTask = await TaskCnt.findByIdAndUpdate(taskId, {
      $set: { title: value },
    });

    return editedTask;
  } catch (error) {
    return error;
  }
};

const moveTask = async (taskId, mainId, num, userId) => {
  try {
    let userAcc = await User.findById(userId);

    if (!userAcc) {
      return { message: "User doesn't exist!" };
    }

    let findTask = await TaskCnt.findById(taskId);

    if (!findTask._id) {
      return { message: "Task not found!" };
    }

    if (findTask.in == "todo") {
      await TaskCnt.findByIdAndUpdate(taskId, {
        $set: { in: "inProgress", workOnIt: userId },
      });

      await Task.findByIdAndUpdate(mainId, {
        $pull: { todo: mongoose.Types.ObjectId(taskId) },
        $push: { inProgress: taskId },
      });
    } else if (findTask.in == "inProgress") {
      if (num == 1) {
        await TaskCnt.findByIdAndUpdate(taskId, {
          $set: { in: "todo", workOnIt: undefined },
        });

        await Task.findByIdAndUpdate(mainId, {
          $pull: { inProgress: mongoose.Types.ObjectId(taskId) },
          $push: { todo: taskId },
        });
      } else {
        await TaskCnt.findByIdAndUpdate(taskId, {
          $set: { in: "done", workOnIt: userId },
        });

        await Task.findByIdAndUpdate(mainId, {
          $pull: { inProgress: mongoose.Types.ObjectId(taskId) },
          $push: { done: taskId },
        });
      }
    } else if (findTask.in == "done") {
      if (num == 1) {
        await TaskCnt.findByIdAndUpdate(taskId, {
          $set: { in: "inProgress", workOnIt: userId },
        });

        await Task.findByIdAndUpdate(mainId, {
          $pull: { done: mongoose.Types.ObjectId(taskId) },
          $push: { inProgress: taskId },
        });
      } else {
        await TaskCnt.findByIdAndDelete(taskId);
        await Task.findByIdAndUpdate(mainId, {
          $pull: { done: mongoose.Types.ObjectId(taskId) },
        });
      }
    }

    return await Task.findById(mainId).populate([
      {
        path: 'todo',
        populate: [
          { path: 'author', select: ['image', 'email'] },
          { path: 'workOnIt', select: ['image', 'email'] }
        ]
      },
      {
        path: 'inProgress',
        populate: [
          { path: 'author', select: ['image', 'email'] },
          { path: 'workOnIt', select: ['image', 'email'] }
        ]
      },
      {
        path: 'done',
        populate: [
          { path: 'author', select: ['image', 'email'] },
          { path: 'workOnIt', select: ['image', 'email'] }
        ]
      },
      {
        path: 'admins author employees', select: ['image', 'email']
      }
    ]);
  } catch (error) {
    return error;
  }
};

const changePriority = async (taskId, userId) => {
  try {
    let userAcc = await User.findById(userId);

    if (!userAcc) {
      return { message: "User doesn't exist!" };
    }

    let findTask = await TaskCnt.findById(taskId);

    if (!findTask._id) {
      return { message: "Task not found!" };
    }

    let newPriority = findTask.priority == 'low' ? 'medium' : findTask.priority == 'medium' ? 'high' : 'low'

    let editedTask = await TaskCnt.findByIdAndUpdate(taskId, {
      $set: { priority: newPriority },
    });

    return newPriority;
  } catch (error) {
    return error;
  }
};

const deleteTask = async (taskId, mainTaskId, userId) => {
  try {
    let userAcc = await User.findById(userId);

    if (!userAcc) {
      return { message: "User doesn't exist!" };
    }

    let mainTask = await Task.findByIdAndUpdate(mainTaskId, {
      $pull: {
        todo: mongoose.Types.ObjectId(taskId),
        inProgress: mongoose.Types.ObjectId(taskId),
        done: mongoose.Types.ObjectId(taskId),
      },
    });

    await TaskCnt.findByIdAndDelete(taskId);

    return mainTask;
  } catch (error) {
    return error;
  }
};

const deleteMainTask = async (mainTaskId, userId) => {
  try {
    let userAcc = await User.findById(userId);

    if (!userAcc) {
      return { message: "User doesn't exist!" };
    }

    let mainTask = await Task.findById(mainTaskId)

    const idsToDelete = [...mainTask.todo, ...mainTask.inProgress, ...mainTask.done];

    await TaskCnt.deleteMany({ _id: { $in: idsToDelete.map(id => mongoose.Types.ObjectId(id)) } });

    await Task.findByIdAndDelete(mainTaskId)

    return mainTask;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getALlTasks,
  createNewMain,
  getCurrentTask,
  createTask,
  deleteTask,
  editTask,
  moveTask,
  deleteMainTask,
  addOrRemoveUser,
  changePriority
};
