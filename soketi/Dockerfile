FROM node:20-alpine

RUN apk add --no-cache \
  python3 \
  make \
  g++ \
  libstdc++ \
  libc6-compat

RUN npm install -g --unsafe-perm @soketi/soketi

EXPOSE 6001

CMD ["soketi", "start"]