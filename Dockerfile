# # Dockerfile cho frontend
# FROM node:14

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 3000  # Đảm bảo cổng này khớp với cổng mà ứng dụng đang lắng nghe
# CMD ["npm", "start"]
# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --legacy-peer-deps

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# Stage 2: Serve the Next.js app
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy các file cần thiết từ stage builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose cổng mặc định của Next.js
EXPOSE 3000

# Khởi động ứng dụng Next.js
CMD ["npm", "start"]