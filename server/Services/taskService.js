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

    return await Task.find({
      $or: [{ author: userId }, { employees: userId }],
    });
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
        path: "todo",
        populate: [
          { path: "author", select: ["image", "email", "username"] },
          { path: "workOnIt", select: ["image", "email", "username"] },
        ],
      },
      {
        path: "inProgress",
        populate: [
          { path: "author", select: ["image", "email", "username"] },
          { path: "workOnIt", select: ["image", "email", "username"] },
        ],
      },
      {
        path: "done",
        populate: [
          { path: "author", select: ["image", "email", "username"] },
          { path: "workOnIt", select: ["image", "email", "username"] },
        ],
      },
      {
        path: "admins author employees",
        select: ["image", "email", "username"],
      },
    ]);
  } catch (error) {
    return error;
  }
};

const getCurrentTaskHistory = async (taskId, skipNum, userId) => {
  try {
    let userAcc = await User.findById(userId);

    if (!userAcc) {
      return { message: "User doesn't exist!" };
    }

    let { history } = await TaskCnt.findById(taskId)
      .select("history")
      .slice({
        history: [Number(skipNum), Number(5)],
      })
      .populate({
        path: "history",
        populate: {
          path: "user",
          select: ["image", "email", "username"],
        },
      });

    return history;
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
      priority: priority == "L" ? "low" : priority == "M" ? "medium" : "high",
      $push: {
        history: {
          $each: [{ user: userId, action: "Created" }],
          $position: 0,
        },
      },
    });

    findTask.todo.push(createdTask._id);
    findTask.save();

    return await TaskCnt.findById(createdTask?._id).populate([
      { path: "author", select: ["image", "email", "username"] },
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

    let option;

    if (findTask?.employees.includes(personId)) {
      findTask.employees = findTask.employees.filter((x) => x != personId);
      findTask.admins = findTask.admins.filter((x) => x != personId);
      person.foreignTask = person.foreignTask.filter((x) => x != mainId);
      option = true;
    } else {
      findTask.employees.push(personId);
      person.foreignTask.push(mainId);
      option = false;
    }

    person.save();
    findTask.save();

    return {
      option,
      email: person?.email,
      image: person?.image,
      username: person?.username,
    };
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
      $push: {
        history: {
          $each: [{ user: userId, action: `Edit title to: "${value}"` }],
          $position: 0,
        },
      },
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
        $push: {
          history: {
            $each: [{ user: userId, action: "Move to inProgress" }],
            $position: 0,
          },
        },
      });

      await Task.findByIdAndUpdate(mainId, {
        $pull: { todo: mongoose.Types.ObjectId(taskId) },
        $push: { inProgress: taskId },
      });
    } else if (findTask.in == "inProgress") {
      if (num == 1) {
        await TaskCnt.findByIdAndUpdate(taskId, {
          $set: { in: "todo", workOnIt: undefined },
          $push: {
            history: {
              $each: [{ user: userId, action: "Return to todo" }],
              $position: 0,
            },
          },
        });

        await Task.findByIdAndUpdate(mainId, {
          $pull: { inProgress: mongoose.Types.ObjectId(taskId) },
          $push: { todo: taskId },
        });
      } else {
        await TaskCnt.findByIdAndUpdate(taskId, {
          $set: { in: "done", workOnIt: userId },
          $push: {
            history: {
              $each: [{ user: userId, action: "Move to done" }],
              $position: 0,
            },
          },
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
          $push: {
            history: {
              $each: [{ user: userId, action: "Return to inProgress" }],
              $position: 0,
            },
          },
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
        path: "todo",
        populate: [
          { path: "author", select: ["image", "email", "username"] },
          { path: "workOnIt", select: ["image", "email", "username"] },
        ],
      },
      {
        path: "inProgress",
        populate: [
          { path: "author", select: ["image", "email", "username"] },
          { path: "workOnIt", select: ["image", "email", "username"] },
        ],
      },
      {
        path: "done",
        populate: [
          { path: "author", select: ["image", "email", "username"] },
          { path: "workOnIt", select: ["image", "email", "username"] },
        ],
      },
      {
        path: "admins author employees",
        select: ["image", "email", "username"],
      },
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

    let newPriority =
      findTask.priority == "low"
        ? "medium"
        : findTask.priority == "medium"
        ? "high"
        : "low";

    await TaskCnt.findByIdAndUpdate(taskId, {
      $set: { priority: newPriority },
      $push: {
        history: {
          $each: [
            {
              user: userId,
              action: `Change priority from ${findTask.priority} to ${newPriority}`,
            },
          ],
          $position: 0,
        },
      },
    });

    return newPriority;
  } catch (error) {
    return error;
  }
};

const addOrRemoveAdmin = async (personId, mainId, userId) => {
  try {
    let userAcc = await User.findById(userId);

    if (!userAcc) {
      return { message: "User doesn't exist!" };
    }

    let person = await User.findById(personId);

    if (!person) {
      return { message: "User doesn't exist!" };
    }

    let findTask = await Task.findById(mainId);

    if (!findTask._id) {
      return { message: "Task not found!" };
    }

    let option;

    if (findTask.admins.includes(person?._id)) {
      await Task.findByIdAndUpdate(mainId, { $pull: { admins: person?._id } });
      option = "remove";
    } else {
      findTask.admins.push(person?._id);
      await Task.findByIdAndUpdate(mainId, { $push: { admins: person?._id } });
      option = "add";
    }

    return option == "add"
      ? {
          option,
          email: person.email,
          image: person.image,
          username: person.username,
          _id: person?._id,
        }
      : { option, _id: person._id };
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

    let mainTask = await Task.findById(mainTaskId);

    const idsToDelete = [
      ...mainTask.todo,
      ...mainTask.inProgress,
      ...mainTask.done,
    ];

    await TaskCnt.deleteMany({
      _id: { $in: idsToDelete.map((id) => mongoose.Types.ObjectId(id)) },
    });

    const employeesUsers = await User.find({
      _id: { $in: [...mainTask.employees] },
    });

    await User.updateMany(
      { _id: { $in: employeesUsers.map((user) => user._id) } },
      { $pull: { foreignTask: { $in: mainTask?._id } } }
    );

    await Task.findByIdAndDelete(mainTaskId);

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
  changePriority,
  addOrRemoveAdmin,
  getCurrentTaskHistory,
};
