# IDATT2900-17

# setup
## frontend
1. cd frontend
2. sett din LAN-IP i config.js baseURL
kjør med
- yarn android
- yarn ios
- yarn web
- expo start (Developer Mode)


## backend
1. pip install pipenv
2. cd backend
3. pipenv install 
4. pipenv run python manage.py makemigrations
5. pipenv run python manage.py migrate
6. pipenv run python manage.py runserver {LANIP}:8080
