FROM public.ecr.aws/docker/library/node:latest
WORKDIR /app
COPY package*.json .
RUN npm install
RUN npm install @influxdata/influxdb-client
COPY . .
CMD ["node","app.js"]
