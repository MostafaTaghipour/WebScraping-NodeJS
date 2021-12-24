const StaticMaps = require("staticmaps");
const express = require("express");
const absolutify = require("absolutify");
/**
 * To deploy puppeteer use below link
 * https://stackoverflow.com/a/67596057
 */
 const puppeteer = require("puppeteer");

const app = express();
const port = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.send("Hello World!");
});


/**
 * Proxy
 * fore example: http://localhost:3000/proxy?url=developer.android.com
 */
app.get("/proxy", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.send("No url provided");
  } else {
    try {
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      });
      const page = await browser.newPage();
      await page.goto(`https://${url}`);

      let document = await page.evaluate(() => document.documentElement.outerHTML);
      document = absolutify(document, `/proxy?url=${url.split("/")[0]}`);

      return res.send(document);
    } catch (error) {
      return res.send(document);
    }
  }
});

/**
 * IMDB
 * for example : http://localhost:3000/movie/tt0111161
 */
app.get("/movie/:id", async (req, res) => {
  const id = req.params.id;
  const IMDB_URL = `https://www.imdb.com/title/${id}/`;

  /* Initiate the Puppeteer browser */
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  /* Go to the IMDB Movie page and wait for it to load */
  await page.goto(IMDB_URL, { waitUntil: "networkidle0" });
  /* Run javascript inside of the page */
  let data = await page.evaluate(() => {
    let title = document.querySelector(
      'h1[class^="TitleHeader__TitleText"]'
    )?.innerText;
    let rating = document.querySelector(
      'span[class^="AggregateRatingButton__RatingScore"]'
    )?.innerText;
    let ratingCount = document.querySelector(
      'div[class^="AggregateRatingButton__TotalRatingAmount"]'
    )?.innerText;
    /* Returning an object filled with the scraped data */
    return {
      title,
      rating,
      ratingCount,
    };
  });

  /* Close Puppeteer browser */
  await browser.close();

  res.json(data);
});

/**
 * Live Score
 * for example: http://localhost:3000/league/football/italy/serie-a
 */
app.get("/league/:sport/:country/:league", async (req, res) => {
  const { sport, country, league } = req.params;

  const URL = `https://www.livescore.com/en/${sport}/${country}/${league}/table/`;

  /* Initiate the Puppeteer browser */
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  /* Go to the IMDB Movie page and wait for it to load */
  await page.goto(URL, { waitUntil: "networkidle0" });
  /* Run javascript inside of the page */

  let data = await page.evaluate(() => {
    let array = [];
    let rows = document.querySelectorAll("tr[id$='league-row']");

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rank = row.querySelector(
        "td[id$='league-column__position']"
      )?.innerText;
      const title = row.querySelector(
        "td[id$='league-column__name']"
      )?.innerText;
      const logo = row.querySelector(
        "td[id$='league-column__name'] div[class^='LeagueTableTab_teamBadgeImg'] img[src^='http']"
      )?.src;
      // const title = row.getElementsByClassName("span[class^='LeagueTablePositionCell']")[0].innerText;
      array.push({
        rank,
        title,
        logo,
      });
    }

    /* Returning an object filled with the scraped data */
    return {
      items: array,
    };
  });

  /* Close Puppeteer browser */
  await browser.close();

  res.json(data);
});

/**
 * Static Map
 * http://localhost:3000/map/51.3890/35.6892?zoom=11&width=800&height=500
 */
app.get("/map/:lat/:lng", async (req, res) => {
  const { lat, lng } = req.params;

  const { width = 600, height = 400, zoom = 13 } = req.query;

  const options = { width: +width, height: +height };
  const center = [+lat, +lng];
  const map = new StaticMaps(options);

  map
    .render(center, zoom)
    .then(function () {
      return map.image.buffer();
    })
    .then(function (buffer) {
      res.setHeader("Content-type", "image/png");
      res.setHeader("Content-Length", buffer.length);
      res.status(200).send(buffer);
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).end();
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
