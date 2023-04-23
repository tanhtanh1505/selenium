const { By, Builder, Browser } = require("selenium-webdriver");
const { suite } = require("selenium-webdriver/testing");
const assert = require("assert");
const chrome = require("selenium-webdriver/chrome");

const { url, addItem } = require("./data.json");

module.exports.todoListTestAddItem = () => {
  suite(
    function () {
      describe(addItem.description, function () {
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

        for (let i = 0; i < addItem.testCases.length; i++) {
          it(addItem.testCases[i].description, async function () {
            const input = addItem.testCases[i].input;
            const expected = addItem.testCases[i].expected;

            driver.manage().setTimeouts({ implicit: 1000 });

            let textBox = await driver.findElement(By.className("form-control"));
            let submitButton = await driver.findElement(By.className("btn btn-success"));

            await textBox.sendKeys(input);
            await submitButton.click();

            let output;

            try {
              let newItem = await driver.findElement(By.xpath(`//*[text()="${input}"]`));
              output = await newItem.getText();
            } catch {
              output = null;
            }

            assert.equal(expected, output);
          });
        }
      });
    },
    { browsers: [Browser.CHROME, Browser.FIREFOX] }
  );
};
