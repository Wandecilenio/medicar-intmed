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
FROM nginx:1.18-alpine-perl
RUN rm -rf /usr/share/nginx/html/*

ADD nginx/general.conf /etc/nginx/nginxconfig.io/general.conf
ADD nginx/nginx.conf /etc/nginx/nginx.conf
ADD nginx/proxy.conf /etc/nginx/nginxconfig.io/proxy.conf
ADD nginx/security.conf /etc/nginx/nginxconfig.io/security.conf
ADD nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/Medicar /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
