const { todoListTestAddItem } = require("./test-add-item/index.js");
const { todoListTestMarkItem } = require("./test-mark-item/index.js");
const { todoListTestRemoveItem } = require("./test-remove-item/index.js");
const { todoListTestUnunmarkItem } = require("../todo-list/test-unmark-item/index.js");
module.exports.todoListTest = () => {
  todoListTestAddItem();
  todoListTestMarkItem();
  todoListTestUnunmarkItem();
  todoListTestRemoveItem();
};
