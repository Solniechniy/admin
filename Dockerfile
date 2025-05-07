FROM node:20.18.0 AS builder

ADD . /build

WORKDIR /build

ARG commit
ENV GENERATE_SOURCEMAP false
ENV NODE_OPTIONS --max_old_space_size=8192
ENV VITE_ENVIRONMENT ${environment:-staging}


RUN yarn && yarn build && echo ${commit:-unknown} > /build/dist/.commit

FROM nginx:1-alpine AS deploy

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /build/dist ./dist

CMD ["nginx"]
