FROM node:latest
# Set the working directory
RUN mkdir -p /app

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8000

CMD [ "node", "index.js" ]

