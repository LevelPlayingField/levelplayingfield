FROM node:7-onbuild

EXPOSE 3001
ENTRYPOINT ["/usr/bin/env", "npm", "start", "--", "--release"]
