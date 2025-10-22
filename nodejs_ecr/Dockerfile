FROM public.ecr.aws/docker/library/node:latest
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
CMD ["node","app.js"]
