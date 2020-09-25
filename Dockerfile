FROM node:10.1
WORKDIR /usr/src/app
COPY . ./
RUN npm install
RUN npm run build
EXPOSE 3000
ENTRYPOINT ["npm", "start"]