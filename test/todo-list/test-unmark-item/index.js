const { By, Builder, Browser, until } = require("selenium-webdriver");
const { suite } = require("selenium-webdriver/testing");
const assert = require("assert");
const chrome = require("selenium-webdriver/chrome");

const { url, unmarkItem } = require("./data.json");

module.exports.todoListTestUnunmarkItem = () => {
  suite(
    function () {
      describe(unmarkItem.description, function () {
        let driver;

        before(async function () {
          driver = await new Builder().forBrowser("chrome").setChromeService(new chrome.ServiceBuilder("/usr/bin/chromedriver")).build();
          await driver.get(url);
          await driver.manage().setTimeouts({ implicit: 5000 });
        });

        after(async () => {
          await driver.manage().setTimeouts({ implicit: 0 });
          await driver.quit();
        });

        for (let i = 0; i < unmarkItem.testCases.length; i++) {
          it(unmarkItem.testCases[i].description, async function () {
            const input = unmarkItem.testCases[i].input;
            const expected = unmarkItem.testCases[i].expected;

            await driver.manage().setTimeouts({ implicit: 5000 });
            let listTodo = await driver.findElements(By.className("item completed container-fluid"));
            let item = listTodo.find(async (item) => (await item.getText()) === input);
            let checkBox = await item.findElement(By.className("text-center col-1"));

            await checkBox.click();

            // check item is unmarked
            item = await driver.findElement(By.xpath(`//*[text()="${input}"]`));
            parent = await item.findElement(By.xpath(".."));
            parent = await parent.findElement(By.xpath(".."));

            const className = await parent.getAttribute("class");
            let output;

            if (className == "item false container-fluid") output = await item.getText();
            else output = null;

            assert.equal(expected, output);
          });
        }
      });
    },
    { browsers: [Browser.CHROME, Browser.FIREFOX] }
  );
};
