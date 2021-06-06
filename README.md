# README

This is a CMS application tailored for LARKS.

* Ruby version
2.5.9

* System dependencies
Docker

* Configuration before running docker
  Move .sample.env to .env

* Database creation
docker-compose up
docker-compose run app rake db:create db:migrate

* Access app shell
docker-compose exec web bash

* Deployment instructions
# TODO

* How to define a layout.
  1. Create a html file say index.html
  2. Whithin that add the following content
    ```
    <html>
      <body>
        {{ page }} //This is where the pages are loaded
      </body>
    </html>
    ```
* How to define a Page.
  1. Create a new html file say home.html
  2. Whithin that add the following content
    ```
    <!-- index --> // NOTE this is not a comment. This will define what layout the page will use.
    <h1> Welcome to Larks CMS </h1>
    ```

* Configuring a Site
  1. NOTE the domain should be a fully qualified domain 
     EX: http://localhost:3000
