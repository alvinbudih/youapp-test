FROM node:18.17

WORKDIR /user-service

ENV PORT=3000

# ENV JWT_TOKEN=secret

# ENV DB_CONNECTION=mongodb+srv://evandraavin21:0AOI9cfKf2676jdV@cluster0.p0pwbkh.mongodb.net/youapp?retryWrites=true&w=majority

COPY package.json package-lock.json /user-service/

RUN npm install && npm cache clean --force

COPY ./ ./

CMD ["npm", "run", "start"]