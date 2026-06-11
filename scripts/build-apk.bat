@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

title CISP学习 - 一键打包APK

echo ================================================
echo          CISP学习 APP 一键打包脚本
echo ================================================
echo.
echo 说明: 此脚本将自动构建前端并打包成APK
echo       数据将保存在手机本地(localStorage)
echo       换机器不会保留数据
echo ================================================
echo.

:: 检查Node.js
echo [1/6] 检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)
for /f "delims=" %%v in ('node --version') do set NODE_VERSION=%%v
echo OK: Node.js %NODE_VERSION%

:: 检查npm
echo [2/6] 检查npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: 未找到npm
    pause
    exit /b 1
)
for /f "delims=" %%v in ('npm --version') do set NPM_VERSION=%%v
echo OK: npm %NPM_VERSION%

:: 构建前端
echo.
echo [3/6] 构建前端项目...
cd /d "%~dp0.."
npm run build
if %errorlevel% neq 0 (
    echo ERROR: 前端构建失败
    pause
    exit /b 1
)
echo OK: 前端构建成功

:: 同步Capacitor
echo.
echo [4/6] 同步Capacitor配置...
npx cap sync
if %errorlevel% neq 0 (
    echo ERROR: Capacitor同步失败
    pause
    exit /b 1
)
echo OK: Capacitor同步成功

:: 构建APK
echo.
echo [5/6] 构建APK...
cd android
if not exist "gradlew.bat" (
    echo ERROR: 未找到gradlew.bat
    pause
    exit /b 1
)

:: 检查是否有local.properties配置
if not exist "local.properties" (
    echo 注意: 未找到local.properties，将使用默认配置
)

:: 开始构建
call gradlew.bat assembleRelease
if %errorlevel% neq 0 (
    echo ERROR: APK构建失败
    pause
    exit /b 1
)
echo OK: APK构建成功

:: 查找APK文件
echo.
echo [6/6] 查找APK文件...
set APK_PATH=
for /r "app\build\outputs\apk\release" %%f in (*.apk) do (
    set APK_PATH=%%f
    goto :found_apk
)
:found_apk

if not defined APK_PATH (
    echo ERROR: 未找到APK文件
    pause
    exit /b 1
)

echo.
echo ================================================
echo            打包完成!
echo ================================================
echo.
echo APK文件位置:
echo %APK_PATH%
echo.
echo 数据存储说明:
echo - 应用使用浏览器本地存储(localStorage/indexedDB)
echo - 数据保存在手机本地，换机器不会保留数据
echo - 卸载应用后数据会丢失
echo.
echo 安装方式:
echo 1. 将APK文件复制到手机
echo 2. 在手机上点击APK文件安装
echo 3. 允许安装未知来源应用
echo ================================================

pause