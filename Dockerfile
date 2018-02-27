FROM node:9
ENV WEBSITE_HOSTNAME levelplayingfield.io

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN yarn \
 && yarn cache clean

COPY . /usr/src/app
RUN npm run build --release

EXPOSE 3000
CMD ["/bin/bash", "./tools/docker-run.sh"]
