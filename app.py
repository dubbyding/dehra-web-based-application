from flask import Flask, render_template, request, redirect, url_for, session
import requests, json, os
from werkzeug.utils import secure_filename

app = Flask(__name__)

@app.route('/')
def index():
    
    return render_template('index.html')

@app.route('/login', methods=('GET','POST'))
def login():
    try:
        if session["username"] or session["password"]:
            return redirect(url_for('index'))
    except:
        pass
    if request.method == 'POST':
        username = request.form['Username']
        password = request.form['Password']
        if 'username' in session:
            session['username'] = session.get('username')
        else:
            session["username"] = username
        session["password"] = password
        detail = {"username": username, "password": password}
        headers = {'content-type': 'application/json'}
        details = json.dumps(detail)
        a = requests.post('http://127.0.0.1:5000/login', data=details, headers=headers)
        if(a.status_code==200):
            return redirect(url_for('index'))
        elif a.status_code==400:
            session.pop('username', None)
            session.pop('password', None)
            return render_template('login.html', error=True)
    return render_template('login.html', error=False)

@app.route('/signup', methods=('GET','POST'))
def signup():
    detail = {}
    try:
        if session["username"] or session["password"]:
            return redirect(url_for('index'))
    except:
        pass
    if request.method == 'POST':
        username = request.form['username']
        emailId = request.form['emailid']
        phonenumber = request.form['phonenumber']
        password = request.form['password']
        repassword = request.form['Repassword']
        detail = {
            "username":username,
            "email": emailId,
            "mobile_number": phonenumber,
            "password": password
        }
        details = json.dumps(detail)
        headers = {"Content-Type": "application/json"}
        signupRequest = requests.post('http://127.0.0.1:5000/signup',data=details, headers=headers)
        if signupRequest.status_code == 200:
            session['username'] = username
            session['password'] = password
            return redirect(url_for('index'))
        else:
            error = signupRequest.json()
            return render_template('signup.html', detail=detail, error_on = error["erroron"], message = error["message"])

    return render_template('signup.html', detail=detail)

@app.route('/logout')
def logout():
    session.pop('username', None)
    print('ON Logout')
    return redirect(url_for('login'))

@app.route('/profile', methods=("POST","GET"))
def profile_check():
    userdata = requests.get('http://127.0.0.1:5000/user-data/' + session['username']).json()
    ads_location = os.path.join('http://127.0.0.1:5000/advertisement/user/', str(userdata['userid']))
    userAds = requests.get(ads_location)
    user_ads_data = userAds.json()
    for values in user_ads_data["advertisement_list"]:
        photo_location = os.path.join('http://127.0.0.1:5000/file/', values["photo"])
        photo_get = requests.get(photo_location)
        if photo_get.status_code == 200:
            current_file_location = os.path.dirname(os.path.realpath(__file__)).replace('\\','/') + '/static/style/img/temp/'
            if not os.path.isdir(current_file_location):
                os.makedirs(current_file_location)
            file_path_location = os.path.join(current_file_location, values["photo"])
            with open(file_path_location, 'wb') as f:
                for chunk in photo_get:
                    f.write(chunk)
    if request.method == "POST":
        try:
            username = request.form["Username"]
            emailid = request.form["Email"]
            password = request.form["password"]
            repassword = request.form["ReEnterPassword"]
            picupload = request.files["profile-pic-upload"]
        except:
            propertyType = request.form["propertyType"]
            propertyAddress = request.form["propertyAddress"]
            geolocation = request.form["geolocation"]
            roomCount = request.form["roomCount"]
            Price = request.form["Price"]
            description = request.form["description"]
            ads_photo = request.files["ads-photo"]
            waterSource = request.form["waterSource"]
            bathroom = request.form["bathroom"]
            terraceAccess = request.form["terraceAccess"]
            filename = secure_filename(ads_photo.filename)
            ads_photo.save("./static/style/img/temp/"+filename)
            photo = {"photo":(filename, open("./static/style/img/temp/"+filename, "rb"), "application-type")}
            datas = {
                "user_id" : userdata["userid"],
                "property_type" : propertyType,
                "property_address": propertyAddress,
                "geo_location": geolocation,
                "room_count":roomCount,
                "price": Price,
                "description": description,
                "water_source":waterSource,
                "bathroom": bathroom,
               "terrace_access": terraceAccess
            }
            sendAdsData = requests.post('http://127.0.0.1:5000/advertisement', data = datas, files=photo)
            if(sendAdsData.status_code == 200):
                return redirect(url_for('profile_check'))
    return render_template('profile.html', user_ads_data=user_ads_data["advertisement_list"])

@app.route('/chatting')
def messaging():
    return render_template('chatting.html')

@app.route('/rent')
def rent():
    return render_template("rent.html")
def seephoto():
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

if __name__=='__main__':
    app.config['SECRET_KEY'] = 'secrethaiguys'

    print(type(session))
    app.run(port=5001, debug=True)  