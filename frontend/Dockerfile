# The builder from node image
FROM node:alpine as builder

# build-time variables
# prod|sandbox its value will be come from outside
ARG env=prod

RUN apk update && apk add --no-cache make git

# Move our files into directory name "app"
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json package-lock.json  /app/
RUN npm install @angular/cli -g
RUN cd /app && npm install
COPY .  /app

# Build with $env variable from outside
RUN cd /app && npm run build:$env

# Build a small nginx image with static website
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/Medicar /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
