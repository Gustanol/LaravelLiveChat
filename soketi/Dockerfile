FROM node:20-slim

RUN apt-get update && apt-get install -y \
  git \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g --unsafe-perm @soketi/soketi

EXPOSE 6001

CMD ["soketi", "start"]