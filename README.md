# Web Scraping

Simple examples of web scrapping using node.js

[Online demo](https://webscraping-nodejs.herokuapp.com/)

## Common setup

Clone the repo and install the dependencies.

```bash
git clone https://github.com/MostafaTaghipour/WebScraping-NodeJS.git
cd WebScraping-NodeJS
```

```bash
npm install
```

## Run It

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) and take a look around.

#### IMDB Example

`http://localhost:3000/movie/tt0111161`

#### Live Score Example

`http://localhost:3000/league/football/italy/serie-a`

#### Static Maps Example

`http://localhost:3000/map/51.3890/35.6892?zoom=11&width=800&height=500`

#### Proxy Example

`http://localhost:3000/proxy?url=developer.android.com`

## Deployment

This repository deploayed on [Heroku](https://webscraping-nodejs.herokuapp.com/).

### How

- Use [this tutorial](https://www.freecodecamp.org/news/how-to-deploy-a-nodejs-app-to-heroku-from-github-without-installing-heroku-on-your-machine-433bec770efe/) to delpoy.

### Troubleshooting

- If you have problem to deploy puppeteer use [this thread on stackoverflow](https://stackoverflow.com/a/67596057) to solve it.
