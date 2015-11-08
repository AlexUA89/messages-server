FROM debian:jessie

RUN apt-get update && apt-get install -y \
    nodejs \
    npm

# Bundle app source
COPY . .

RUN pwd

RUN ls

# Install app dependencies
RUN npm install

EXPOSE  3000
CMD ["node", "app.js"]