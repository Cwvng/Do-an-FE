FROM node:20.3.1

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--force"]
