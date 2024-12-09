# weather-api

add your apikey as API_KEY in parameter store
Returns current and historical weather of a city
npm run build

//automate this if i have time
cd lambda/dist

zip -r getCurrentWeather.zip getCurrentWeather.js ./shared node_modules

zip -r getHistoricalWeather.zip getHistoricalWeather.js ./shared node_modules

fix lambda.tf

terraform init

terraform validate

terraform apply
