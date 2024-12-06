# weather-api

Returns current and historical weather of a city
node install

zip -r getCurrentWeather.zip getCurrentWeather.js node_modules
zip -r getHistoricalWeather.zip getHistoricalWeather.js node_modules

terraform init

terraform validate

terraform apply
