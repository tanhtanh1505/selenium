const { By, Builder, Browser } = require("selenium-webdriver");
const { suite } = require("selenium-webdriver/testing");
const assert = require("assert");
const chrome = require("selenium-webdriver/chrome");

const { url, removeItem } = require("./data.json");

module.exports.todoListTestRemoveItem = () => {
  suite(
    function () {
      describe(removeItem.description, function () {
        let driver;

        before(async function () {
          driver = await new Builder().forBrowser("chrome").setChromeService(new chrome.ServiceBuilder("/usr/bin/chromedriver")).build();
          await driver.get(url);
        });

        after(async () => {
          await driver.manage().setTimeouts({ implicit: 0 });
          await driver.quit();
        });

        for (let i = 0; i < removeItem.testCases.length; i++) {
          it(removeItem.testCases[i].description, async function () {
            const input = removeItem.testCases[i].input;
            const expected = removeItem.testCases[i].expected;

            driver.manage().setTimeouts({ implicit: 1000 });

            //use xpath to find the element with the text
            let item = await driver.findElement(By.xpath(`//*[text()="${input}"]`));
            //find the parent element of the item
            let parent = await item.findElement(By.xpath(".."));
            //find the delete button
            let deleteButton = await parent.findElement(By.className("text-center remove col-1"));

            await deleteButton.click();

            //sleep
            await driver.sleep(100);

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
