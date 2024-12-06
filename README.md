# weather-api

Returns current and historical weather of a city
npm run build

//automate this if i have time
cd lambda/dist
zip -r dist/getCurrentWeather.zip dist/getCurrentWeather.js node_modules
zip -r dist/getHistoricalWeather.zip dist/getHistoricalWeather.js node_modules

terraform init

terraform validate

terraform apply
