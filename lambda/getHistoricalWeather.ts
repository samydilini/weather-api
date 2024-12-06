const axios = require("axios");

exports.handler = async (event) => {
  //   const city = event.pathParameters.city;
  //   const apiKey = process.env.OPENWEATHER_API_KEY;
  //   const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  //   try {
  //     const response = await axios.get(url);
  //     return {
  //       statusCode: 200,
  //       body: JSON.stringify(response.data),
  //     };
  //   } catch (error) {
  //     return {
  //       statusCode: error.response?.status || 500,
  //       body: JSON.stringify({ error: error.message }),
  //     };
  //   }

  return {
    statusCode: 200,
    body: JSON.stringify("same change"),
  };
};
