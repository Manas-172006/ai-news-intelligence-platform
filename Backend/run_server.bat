@echo off
REM Run the backend server using the virtual environment Python
cd /d %~dp0
if not exist venv\Scripts\python.exe (
  echo Virtual environment not found. Please create it with:
  echo python -m venv venv
  exit /b 1
)
call venv\Scripts\activate.bat
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
