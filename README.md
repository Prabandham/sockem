# README

This is a CMS application tailored for LARKS.

* Ruby version
2.5.9

* System dependencies
Docker

* Configuration before running docker
  Move .sample.env to .env

* Debugging in docker using pry
First, add pry-rails to your Gemfile:  
https://github.com/rweng/pry-rails

```ruby
gem 'pry-rails', group: :development
```

Then you'll want to rebuild your Docker container to install the gems

```sh
docker-compose build
```

You should now be able to add a break point anywhere in your code

```ruby
binding.pry
```

The problem is that Docker just kind of ignores it and moves on. In order to actually halt execution and use pry as normal, you have to these options to docker-compose.yml:

```yaml
app:
  tty: true
  stdin_open: true
```

Source: http://stackoverflow.com/a/37264588/1042144

The next time `binding.pry` is executed, the process should halt and display an IRB-like console on the rails server screen. But you still can't use it directly. You have to attach a terminal to the docker container.

In order to attach to a docker container, you need to know what its ID is. Use `docker ps` to get a list of the running containers and their ids.

```sh
docker ps
```

Source: https://www.liquidweb.com/kb/how-to-list-and-attach-to-docker-containers/

Then you can use the numeric ID to attach to the docker instance:

```sh
docker attach 75cde1ab8133
```

It may not immediately show a rails console, but start typing and it should appear. If you keep this attached, it should show the rails console prompt the next time you hit the pry breakpoint.


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
      <head>
        {{ include_stylesheets }} // This will pull up all the css
        {{ include_javascripts }} // This will pull up all the js
      </head>
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
