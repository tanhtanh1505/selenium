const { By, Builder, Browser, until } = require("selenium-webdriver");
const { suite } = require("selenium-webdriver/testing");
const assert = require("assert");
const chrome = require("selenium-webdriver/chrome");

const { url, markItem } = require("./data.json");

module.exports.todoListTestMarkItem = () => {
  suite(
    function () {
      describe(markItem.description, function () {
        let driver;

        before(async function () {
          driver = await new Builder().forBrowser("chrome").setChromeService(new chrome.ServiceBuilder("/usr/bin/chromedriver")).build();
          await driver.get(url);
          await driver.manage().setTimeouts({ implicit: 1000 });
        });

        after(async () => {
          await driver.manage().setTimeouts({ implicit: 0 });
          await driver.quit();
        });

        for (let i = 0; i < markItem.testCases.length; i++) {
          it(markItem.testCases[i].description, async function () {
            const input = markItem.testCases[i].input;
            const expected = markItem.testCases[i].expected;

            await driver.manage().setTimeouts({ implicit: 1000 });

            let item = await driver.findElement(By.xpath(`//*[text()="${input}"]`));
            let parent = await item.findElement(By.xpath(".."));
            let checkBox = await parent.findElement(By.className("text-center col-1"));

            await checkBox.click();

            // check item is marked
            item = await driver.findElement(By.xpath(`//*[text()="${input}"]`));
            parent = await item.findElement(By.xpath(".."));
            parent = await parent.findElement(By.xpath(".."));

            const className = await parent.getAttribute("class");
            let output;

            if (className == "item completed container-fluid") output = await item.getText();
            else output = null;

            assert.equal(expected, output);
          });
        }
      });
    },
    { browsers: [Browser.CHROME, Browser.FIREFOX] }
  );
};
