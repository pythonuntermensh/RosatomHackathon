FROM node
LABEL authors="Арсений"

WORKDIR /app
COPY . .

RUN npm install
EXPOSE 3000

CMD ["npm", "run", "dev"]