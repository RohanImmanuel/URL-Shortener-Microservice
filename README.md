# URL Shortener Microservice

1. You can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
2. When you visit that shortened URL, it will redirect me to my original link.

## Example creation usage:
`https://shurli.herokuapp.com/new/https://www.google.com`
`https://shurli.herokuapp.com/new/http://freecodecamp.com/news`


If you want to pass a site that doesn't exist (or an invalid url) for some reason you can do:
`https://shurli.herokuapp.com/new/invalid?allow=true`
## Example creation output:
`{ "original_url": "http://freecodecamp.com/news", "short_url": "https://url-shortener-microservice-rohanimmanuel.c9users.io/56a3574baf87a17f0e857a87" }`

### Usage:
`https://url-shortener-microservice-rohanimmanuel.c9users.io/56a3574baf87a17f0e857a87`
### Will redirect to:
`http://freecodecamp.com/news`