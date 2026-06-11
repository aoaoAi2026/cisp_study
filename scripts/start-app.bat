@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

title CISP学习 - 一键启动

echo ================================================
echo          CISP学习 APP 一键启动脚本
echo ================================================
echo.
echo 说明: 此脚本将启动前端开发服务器和后端API服务
echo ================================================
echo.

:: 检查Node.js
echo [1/3] 检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)
for /f "delims=" %%v in ('node --version') do set NODE_VERSION=%%v
echo OK: Node.js %NODE_VERSION%

:: 安装依赖（如果需要）
echo [2/3] 检查并安装依赖...
cd /d "%~dp0.."
if not exist "node_modules" (
    echo 正在安装前端依赖...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: 前端依赖安装失败
        pause
        exit /b 1
    )
)

if not exist "backend\node_modules" (
    echo 正在安装后端依赖...
    cd backend
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: 后端依赖安装失败
        pause
        exit /b 1
    )
    cd ..
)
echo OK: 依赖检查完成

:: 启动服务
echo.
echo [3/3] 启动服务...
echo 前端地址: http://localhost:5174
echo 后端地址: http://localhost:3003
echo.
echo 按 Ctrl+C 停止服务

:: 启动后端
start "CISP后端" cmd /k "cd backend && npm run dev"

:: 等待后端启动
timeout /t 3 /nobreak >nul

:: 启动前端
cd /d "%~dp0.."
npm run dev