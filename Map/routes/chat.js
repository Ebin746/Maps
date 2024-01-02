const axios = require("axios");
const fetch = require("node-fetch");
require("dotenv").config();
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI(process.env.newsApi);
const apiKey = process.env.apikey;
const apiUrl = "https://api.openai.com/v1/chat/completions";
let message;
let queries;
let Newsarticles ;
let NewsDescription
async function generateResponse(messages, id) {
  // News
  queries = messages.map((msg) => {
    const category = msg.category || 'N/A';
    const description = msg.description || 'N/A';
  
    return `${category}  ${description}`;
  });
  console.log("News API Query:", queries);

  try {
    const resultNews = await newsapi.v2.everything({
      q: queries,
      language: "en",
      sortBy: "relevancy",
      pageSize: 1,
      page: 1,
    });

    const articles = resultNews.articles;

    if (articles && articles.length > 0) {
      articles.forEach((article) => {
        console.log("Description:", article.description);
        console.log("Content:", article.content);
        NewsDescription=article.description;
        Newsarticles=article.content;
      });
    } else {
      console.log("No articles found");
    }
  } catch (error) {
    console.error("Error fetching news:", error);
  }

  // Prompt
  if (id === "1") {
    message = messages.map(
      (msg) =>
        ` In a devastating turn of events, a ${msg.category} struck ${msg.location} on ${msg.DateBegin}(show date to user in understanding manner), leaving ${NewsDescription}. 
        As real-time updates unfold, reports from ${Newsarticles} shed light on the unfolding crisis. 
        The situation remains critical, and authorities are working tirelessly to mitigate the impact. 
        Stay tuned for further developments on this evolving disaster. in less than 140 words ,do not say undifend or unknow thing, any you want to make it impersive`
    );
  } else if (id === "2") {
    message = messages.map(
      (msg) =>
        ` How to best prepare for a ${msg.category} ${msg.description} that started on ${msg.DateBegin}, don not say sorry or behavie like you don't know ,30 words or less.`
    );
  } else if (id === "3") {
    message = messages.map(
      (msg) =>
        `How can first responders respond to a ${msg.category} ${msg.description} that started on ${msg.DateBegin}, don not say sorry or behavie like you don't know ,30 words or less.`
    );
  } else if (id === "4") {
    message = messages.map(
      (msg) => `How can I help for ${msg.category} ${msg.description} that started on ${msg.DateBegin}? Give me a couple of links, if link is not there then send adivce or tips ,do not say sorry or behavie like you don't know ,30 words or less .`
    );
  }

  // GPT
  try {
    const response = await axios.post(
      apiUrl,
      {
        model: "gpt-3.5-turbo",
        messages: message.map((msg) => ({ role: "system", content: msg })),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error &&
      error.response.data.error.code === "rate_limit_exceeded"
    ) {
      console.log(`Rate limit exceeded. Waiting for 20 seconds...`);
      await sleep(20000); // Wait for 20 seconds
      return generateResponse(messages); // Retry the request
    } else {
      console.error(
        "Error generating response:",
        error.response ? error.response.data : error.message
      );
      return "Sorry, I encountered an error.";
    }
  }
}

// Sleep
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = generateResponse;
