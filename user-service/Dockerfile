FROM node:18.17

WORKDIR /usr/local/app

ENV PORT=3000

COPY package.json package-lock.json /usr/local/app/

COPY .env.example .env

RUN npm install -g typescript

RUN npm install && npm cache clean --force

RUN npm install -g @nestjs/cli

COPY ./ ./

CMD ["nest", "start"]