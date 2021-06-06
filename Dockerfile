FROM ruby:2.5.9

RUN apt-get update -yqq \
  && apt-get install -yqq \
    postgresql-client \
    nodejs \
  && apt-get -q clean \
  && rm -rf /var/lib/apt/lists

WORKDIR /usr/src/app
COPY Gemfile* ./
RUN bundle install
COPY . .

CMD bundle exec rails s -p 3000
  