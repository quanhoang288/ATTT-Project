# ATTT-Project
End-to-end encrypted chat using RSA encryption
# Dependency
-   NodeJS 14.x
-   MongoDB Server 4.4.x
-   CrypticoJS
-   Argon2
-   Socket.IO
# Installation
## 1. NodeJS
Lên trang chủ NodeJs và download phiên bản phù hợp: https://nodejs.org/en/download/   
Sau khi cài đặt thêm Node vào biến môi trường để có thể gọi câu lệnh npm trên terminal
## 2. MongoDB
Tải phiên bản community của MongoDB Server: https://www.mongodb.com/try/download/community
## 3. Database
- Tạo 1 database mới trong mongodb với tên chat-db
- Sau khi tạo database tiếp tục tạo 4 collections của database vừa tạo: users, keys, messages, conversations
## 4. Các dependencies khác
- Mở terminal, truy cập vào thư mục client và chạy câu lệnh:
``` npm install ```
- Tiếp tục truy cập vào thư mục server và thực hiện câu lệnh tương tự:
``` npm install ```
# Project Structure 
```
/client: Code xây dựng giao diện, load và mã hóa tin nhắn thời gian thực
/server: Code xây dựng WebSocket Server và api để lưu trữ/load dữ liệu từ cơ sở dữ liệu
```

# Usage
- Mở terminal, truy cập vào thư mục server và chạy câu lệnh:
``` npm run dev ```
- Tương tự, truy cập vào thư mục client và chạy câu lệnh: 
``` npm start ```



