FROM node:16

MAINTAINER The Standard

ARG COMMIT
ARG ENV

WORKDIR /opt/app

ADD . /opt/app

ENV NEXT_PUBLIC_GIT_COMMIT_SHA=${COMMIT}
ENV NEXT_PUBLIC_ENV=${ENV}

RUN \
  rm -rf package-lock.json; \
  rm -rf yarn.lock; \
  yarn install --only=production && \
  yarn run build

EXPOSE 8080

CMD [ "yarn", "start" ]
