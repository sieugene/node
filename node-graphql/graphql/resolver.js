const Todo = require("../models/todo");

const users = [
  { name: "Test", age: 30, email: "tester@Mail.ru" },
  { name: "Test1", age: 32, email: "tester2@Mail.ru" },
  { name: "Test3", age: 33, email: "tester3@Mail.ru" },
];
module.exports = {
  test() {
    return {
      count: Math.trunc(Math.random() * 10),
      users,
    };
  },
  random({ min, max, count }) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const random = Math.random() * (max - min) + min;
      arr.push(random);
    }
    return arr;
  },
  addTestUser({ user }) {
    const candidate = {
      name: user.name,
      email: user.email,
      age: Math.ceil(Math.random() * 30),
    };
    users.push(candidate);
    return candidate;
  },

  async getTodos() {
    try {
      return await Todo.findAll();
    } catch (error) {
      console.log(error);
      throw new Error("Fetch todos is not available");
    }
  },
  async createTodo({ todo }) {
    try {
      return await Todo.create({
        title: todo.title,
        done: false,
      });
    } catch (error) {
      console.log(error);
      throw new Error("Title is required");
    }
  },
  async completeTodo({ id }) {
    try {
      const todo = await Todo.findByPk(+id);
      todo.done = true;
      await todo.save();
      return todo;
    } catch (error) {
      console.log(error);
      throw new Error("Id is required");
    }
  },
};
