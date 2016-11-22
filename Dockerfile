FROM node:7-onbuild

RUN npm run build -- --release

EXPOSE 3000
ENTRYPOINT ["/usr/bin/env", "node", "build/server.js"]
