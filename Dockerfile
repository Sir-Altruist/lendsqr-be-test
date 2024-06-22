# Import OS for docker [cached]
FROM node:18.0.0-alpine as base

# Add maintainer of the image
LABEL author="devaltruist@gmail.com"

# Install nodemon globally [volume use-case]
# RUN npm install -g nodemon

# Create working directory [cached]
WORKDIR /app

# Copy package.json contents [cached]
COPY package*.json .

# Install packages [cached]
RUN npm install

# Copy all contents in the project root directory into the app directory
COPY . .

FROM base as production

ENV NODE_PATH=./dist

RUN npm run build

# Expose port to external connection
EXPOSE 8000

ARG PM2_PUBLIC_KEY
ARG PM2_SECRET_KEY
ARG PM2_MACHINE_NAME
ARG APP_PORT
ARG DB_NAME
ARG DB_USER
ARG DB_PASSWORD
ARG DB_HOST
ARG DB_PORT
ARG REDIS_HOST
ARG REDIS_PORT
ARG SECRET_KEY
ARG NODE_ENV


ENV PM2_PUBLIC_KEY ${PM2_PUBLIC_KEY}
ENV PM2_SECRET_KEY ${PM2_SECRET_KEY}
ENV PM2_MACHINE_NAME ${PM2_MACHINE_NAME}
ENV APP_PORT ${APP_PORT}
ENV DB_NAME ${DB_NAME}
ENV DB_USER ${DB_USER}
ENV DB_PASSWORD ${DB_PASSWORD}
ENV DB_HOST ${DB_HOST}
ENV DB_PORT ${DB_PORT}
ENV REDIS_HOST ${REDIS_HOST}
ENV REDIS_PORT ${REDIS_PORT}
ENV SECRET_KEY ${SECRET_KEY}
ENV NODE_ENV ${NODE_ENV}

# Install pm2 globally. This works well on other operating system other than windows. use npm install -g pm2@3.2.4 for windows
RUN npm install pm2 -g

# Install profiler to link pm2 to your app for monitoring
RUN pm2 install profiler

# Run command to start the application
# CMD [ "npm", "run", "start" ]
#Note: pm2-runtime designed for Docker container which keeps an application in the foreground which keep the container running
CMD ["pm2-runtime", "npm", "--", "start"]