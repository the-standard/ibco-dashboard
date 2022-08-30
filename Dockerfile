FROM node:16.15.1

MAINTAINER The Standard

ARG COMMIT

WORKDIR /opt/app

ADD . /opt/app

RUN \
  rm -rf package-lock.json; \
  rm -rf yarn.lock; \
  yarn install --only=production && \
  yarn run build

EXPOSE 8080

CMD [ "yarn", "start" ]
