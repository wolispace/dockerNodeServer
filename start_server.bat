echo off
:: read the .env file
for /F "delims=" %%i in (.env) do (set "%%i")
docker compose up -d
start "" http://localhost:%EXTERNAL_PORT%

echo press any key to stop container...
pause

docker compose down
