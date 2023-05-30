FROM node:latest

RUN npm install -g nodemon && npm install -g @angular/cli

WORKDIR /

COPY ./BackEnd/package.json .
COPY ./FrontEnd/package.json .

WORKDIR /BackEnd
RUN npm install

WORKDIR /FrontEnd
RUN npm install

COPY ./BackEnd ./BackEnd
COPY ./FrontEnd ./FrontEnd

COPY ./Dockerfile ./Dockerfile

EXPOSE 3000 4200
# required for docker desktop port mapping

WORKDIR /BackEnd
CMD npm start