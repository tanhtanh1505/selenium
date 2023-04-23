const { By, Builder, Browser } = require("selenium-webdriver");
const { suite } = require("selenium-webdriver/testing");
const assert = require("assert");
const chrome = require("selenium-webdriver/chrome");

const { title, url, addItem, removeItem } = require("./data.json");

module.exports.todoListTestAddItem = () => {
  suite(
    function (env) {
      describe(addItem.description, function () {
        let driver;

        before(async function () {
          driver = await new Builder().forBrowser("chrome").setChromeService(new chrome.ServiceBuilder("/usr/bin/chromedriver")).build();
          await driver.get(url);
          await driver.manage().setTimeouts({ implicit: 5000 });
        });

        after(async () => await driver.quit());

        for (let i = 0; i < addItem.testCases.length; i++) {
          it(addItem.testCases[i].description, async function () {
            const input = addItem.testCases[i].input;
            const expected = addItem.testCases[i].expected;

            let textBox = await driver.findElement(By.className("form-control"));
            let submitButton = await driver.findElement(By.className("btn btn-success"));

            await textBox.sendKeys(input);
            await submitButton.click();

            driver.manage().setTimeouts({ implicit: 5000 });

            let listTodo = await driver.wait(async () => {
              let listTodo = await driver.findElements(By.className("item false container-fluid"));
              return listTodo;
            }, 5000);
            const listTodoInnerText = await Promise.all(listTodo.map(async (item) => await item.getText()));

            let output = listTodoInnerText.filter((item) => item === input)[0];

            assert.equal(expected, output);
          });
        }
      });
    },
    { browsers: [Browser.CHROME, Browser.FIREFOX] }
  );
};

module.exports.todoListTestRemoveItem = () => {
  suite(
    function (env) {
      describe(removeItem.description, function () {
        let driver;

        before(async function () {
          driver = await new Builder().forBrowser("chrome").setChromeService(new chrome.ServiceBuilder("/usr/bin/chromedriver")).build();
          await driver.get(url);
          await driver.manage().setTimeouts({ implicit: 5000 });
        });

        after(async () => await driver.quit());

        for (let i = 0; i < removeItem.testCases.length; i++) {
          it(removeItem.testCases[i].description, async function () {
            const input = removeItem.testCases[i].input;
            const expected = removeItem.testCases[i].expected;

            let listTodo = await driver.findElements(By.className("item false container-fluid"));
            let item = listTodo.find(async (item) => (await item.getText()) === input);
            let deleteButton = await item.findElement(By.className("text-center remove col-1"));

            await deleteButton.click();
            listTodo = await driver.wait(async () => {
              listTodo = await driver.findElements(By.className("item false container-fluid"));
              return listTodo;
            }, 5000);
            item = listTodo.find(async (item) => (await item.getText()) === input);

            assert.notEqual(expected, item);
          });
        }
      });
    },
    { browsers: [Browser.CHROME, Browser.FIREFOX] }
  );
};
