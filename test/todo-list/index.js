const { By, Builder, Browser } = require("selenium-webdriver");
const { suite } = require("selenium-webdriver/testing");
const assert = require("assert");
const chrome = require("selenium-webdriver/chrome");

const { url, testCase } = require("./data.json");

module.exports.todoListTest = () => {
  suite(
    function (env) {
      describe("TodoList Test", function () {
        let driver;

        before(async function () {
          driver = await new Builder().forBrowser("chrome").setChromeService(new chrome.ServiceBuilder("/usr/bin/chromedriver")).build();
        });

        this.beforeEach(async function () {
          await driver.get(url);

          let title = await driver.getTitle();
          assert.equal("Todo App", title);

          await driver.manage().setTimeouts({ implicit: 500 });
        });

        after(async () => await driver.quit());

        it("add a todo item", async function () {
          let textBox = await driver.findElement(By.className("form-control"));
          let submitButton = await driver.findElement(By.className("btn btn-success"));

          await textBox.sendKeys(testCase.addItem.input);
          await submitButton.click();

          let listTodo = await driver.findElements(By.className("item false container-fluid"));
          let item = listTodo.find(async (item) => (await item.getText()) === testCase.addItem.input);
          let output = await item.getText();

          assert.equal(testCase.addItem.expected, output);
        });

        it("mark a todo item as done", async function () {
          let listTodo = await driver.findElements(By.className("item false container-fluid"));
          let item = listTodo.find(async (item) => (await item.getText()) === testCase.markItem.input);
          let checkBox = await item.findElement(By.className("text-center col-1"));

          await checkBox.click();
          listTodo = await driver.wait(async () => {
            listTodo = await driver.findElements(By.className("item completed container-fluid"));
            return listTodo;
          }, 5000);
          item = listTodo.find(async (item) => (await item.getText()) === testCase.markItem.input);
          let output = await item.getText();

          assert.equal(testCase.markItem.expected, output);
        });

        it("unmark a todo item", async function () {
          let listTodo = await driver.findElements(By.className("item completed container-fluid"));
          let item = listTodo.find(async (item) => (await item.getText()) === testCase.unmarkItem.input);
          let checkBox = await item.findElement(By.className("text-center col-1"));

          await checkBox.click();
          listTodo = await driver.wait(async () => {
            listTodo = await driver.findElements(By.className("item false container-fluid"));
            return listTodo;
          }, 5000);
          item = listTodo.find(async (item) => (await item.getText()) === testCase.unmarkItem.input);
          let output = await item.getText();

          assert.equal(testCase.unmarkItem.expected, output);
        });

        it("delete a todo item", async function () {
          let listTodo = await driver.findElements(By.className("item false container-fluid"));
          let item = listTodo.find(async (item) => (await item.getText()) === testCase.deleteItem.input);
          let deleteButton = await item.findElement(By.className("text-center remove col-1"));

          await deleteButton.click();
          listTodo = await driver.wait(async () => {
            listTodo = await driver.findElements(By.className("item false container-fluid"));
            return listTodo;
          }, 5000);
          item = listTodo.find(async (item) => (await item.getText()) === testCase.deleteItem.input);

          assert.notEqual(testCase.deleteItem.expected, item);
        });
      });
    },
    { browsers: [Browser.CHROME, Browser.FIREFOX] }
  );
};
