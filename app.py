from flask import Flask, render_template, request, redirect, url_for, session
import requests, json, os

app = Flask(__name__)

@app.route('/')
def index():
    ads = json.loads(requests.get('http://127.0.0.1:5000/search/sanepa').text)
    l = ads["advertisement_list"]
    photo_list = []
    for filetbs in l:
        filetbs = filetbs["photo"]
        photo_list.append(filetbs)
        print(filetbs)
        location_file = os.path.join('http://127.0.0.1:5000/file/',filetbs)
        a = requests.get(location_file)
        print(a)
        if a.status_code == 200:
            current_file_location = os.path.dirname(os.path.realpath(__file__)).replace('\\','/') + '/static/style/img/temp/'
            if not os.path.isdir(current_file_location):
                os.makedirs(current_file_location)
            file_path_location = os.path.join(current_file_location, filetbs)
            with open(file_path_location, 'wb') as f:
                for chunk in a:
                    f.write(chunk)
    print(photo_list)
    return render_template('base.html', photo_list=photo_list)

@app.route('/login', methods=('GET','POST'))
def login():
    if request.method == 'POST':
        username = request.form['Username']
        password = request.form['Password']
        if 'username' in session:
            session['username']=session.get('username')
        else:
            session["username"] = username
        detail = {"username": username, "password": password}
        headers = {'content-type': 'application/json'}
        a = requests.post('http://127.0.0.1:5000/login', data=detail, headers=headers)
        if(a.status_code==400):
            return redirect(url_for('index'))
        elif a.status_code==400:
            return render_template('login.html', error=True)
    return render_template('login.html', error=False)

@app.route('/logout')
def logout():
    session.pop('username', None)
    print('ON Logout')
    return redirect(url_for('login'))

@app.route('/signup')
def signup():
    return render_template('signup.html')

if __name__=='__main__':
    app.config['SECRET_KEY'] = 'secrethaiguys'

    print(type(session))
    app.run(port=5001, debug=True)  