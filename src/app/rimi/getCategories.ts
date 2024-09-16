import puppeteer from "puppeteer";

const getCategories = async () => {
  // Launch the Puppeteer browser
  const browser = await puppeteer.launch({ headless: true }); // Set headless to false for debugging
  const page = await browser.newPage();

  // Navigate to the target page
  await page.goto("https://www.rimi.lv/e-veikals", {
    waitUntil: "networkidle2", // Waits for all network requests to finish
  });

  // Click on the "Produkti" button
  await page.evaluate(() => {
    const categoryElements = document.querySelectorAll(".nav-list__item");
    categoryElements.forEach((categoryElement) => {
      const categoryLink = categoryElement.querySelector("a");
      if (
        categoryLink?.textContent &&
        categoryLink.textContent.includes("Produkti")
      ) {
        categoryLink.click();
      }
    });
  });

  // Wait for the menu to appear
  await page.waitForSelector("#desktop_category_menu", { visible: true });

  // Extract all categories from the newly opened menu
  const categories = await page.evaluate(() => {
    const categoryElements = document.querySelectorAll(
      "#desktop_category_menu .category-list-item",
    );

    const categories = Array.from(categoryElements).map((categoryElement) => {
      const button = categoryElement.querySelector("button");
      const name = button?.querySelector(".name")?.textContent;
      const href = button?.getAttribute("href");

      return {
        name: name?.trim(),
        link: href,
      };
    });

    return categories;
  });

  console.log("Categories:", categories);

  // Close the browser
  await browser.close();
};

export default getCategories;
