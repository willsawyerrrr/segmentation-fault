FROM node:lts AS development

WORKDIR /code

ENV PORT=3000
ENV TERM=xterm-256color

COPY . /code

RUN npm clean-install

FROM development AS builder

RUN npm run build

FROM nginx

COPY --from=builder /code/dist /usr/share/nginx/html
