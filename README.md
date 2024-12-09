# weather-api

This code will returns current and historical weather of a city
Current will be todays weather history is set for 3 days ago.

# How to run

1.add your apikey as API_KEY in parameter store

2. Build the lambdas
   cd in to lambda folder and run
   `npm run build`

3. Create lambda zip files to upload to AWS
   //automate this if i have time

- cd lambda/dist/src
- zip getCurrentWeather lambda
  `zip -r getCurrentWeather.zip getCurrentWeather.js ./shared node_modules`
- Zip getHistoricalWeather lambda
  `zip -r getHistoricalWeather.zip getHistoricalWeather.js ./shared node_modules`

4. Run terraform
   - `terraform init`
   - `terraform validate`
   - `terraform apply`

you the following to test the lambda in console

`{
  "pathParameters": {
    "city": "London"
  }
}
`


5. test API gateway indipendantly

`api_gateway_url+/prod/weather/melb`
eg :
curl https://dbsxjsh598.execute-api.ap-southeast-2.amazonaws.com/prod/weather/melb
`api_gateway_url+/prod/weather/history/melb`
curl https://bnnotys1f0.execute-api.ap-southeast-2.amazonaws.com/prod/weather/history/melb

6. Test with front end

- cd in to front-end folder
- build with `docker build -t react-app .`
- run react app with `docker run -p 3000:3000 react-app`
- useful commands
  `docker ps`
  `docker stop`
