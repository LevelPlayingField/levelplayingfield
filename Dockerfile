FROM node:7-onbuild
ENV WEBSITE_HOSTNAME levelplayingfield.io

RUN npm run build -- --release

EXPOSE 3000
ENTRYPOINT ["/bin/bash", "./tools/docker-run.sh"]
