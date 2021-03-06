from flask import Flask, render_template, request, redirect, url_for, session
import requests, json, os
from werkzeug.utils import secure_filename
from flask_socketio import SocketIO, join_room

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/', methods=('GET','POST'))
def index():
    latest_uploaded = requests.get("http://127.0.0.1:5000/advertisement/data/12")
    if latest_uploaded.status_code == 200:
        value = latest_uploaded.json()['advertisement_list']
        photo_link = []
        for values in value:
            photo_location = os.path.join('http://127.0.0.1:5000/file/', values["photo"])
            photo_get = requests.get(photo_location).json()
            photo_link.append(photo_get)
    if request.method == 'POST':
        
        try:
            owner = request.form["owner"]
            session["owner"] = owner
            return redirect(url_for("messaging"))
        except:
            pass
        try:
            location = request.form["EnterLocation"]
            session["location"] = location
            return redirect(url_for("rent"))
        except:
            pass
    return render_template('index.html', latest_upload = value, photo_link=photo_link)

@app.route('/login', methods=('GET','POST'))
def login():
    try:
        if session["username"] and session["password"]:
            return redirect(url_for('index'))
    except:
        pass
    if request.method == 'POST':
        username = request.form['Username']
        password = request.form['Password']
        try:
            remember = request.form["RememberMe"]
            session["rememberme"] = "on"
        except:
            session["rememberme"] = "off"
            pass
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
        if session["username"] and session["password"]:
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
            session["rememberme"] = "on"
            return redirect(url_for('index'))
        else:
            error = signupRequest.json()
            return render_template('signup.html', detail=detail, error_on = error["erroron"], message = error["message"])

    return render_template('signup.html', detail=detail)
@app.route('/rent', methods=("POST", "GET"))
def rent():
    try:
        owner = request.form["owner"]
        session["owner"] = owner
        return redirect(url_for("messaging"))
    except:
        pass
    try:
        location = session["location"]
        session.pop('location', None)
        location_search_address = "http//127.0.0.1:5000/search/" + location
        location_search_ads = requests.get("http://127.0.0.1:5000/search/" + location)
        if location_search_ads.status_code == 200:
            location_searched_ads = location_search_ads.json()["advertisement_list"]
            photo_link = []
            for values in location_searched_ads:
                photo_location = os.path.join('http://127.0.0.1:5000/file/', values["photo"])
                photo_get = requests.get(photo_location).json()
                photo_link.append(photo_get)
        return render_template("rent.html", location=location, location_searched_ads=location_searched_ads, photo_link=photo_link)
    except Exception as e:
        pass
    if request.method == 'POST':
        session["location"] = request.form["EnterLocation"]
        return redirect(url_for("rent"))
    return render_template("rent.html")

@app.route('/logout')
def logout():
    try:
        if session["rememberme"] == "on":
            session.pop("password", None)
        else:
            session.pop('username', None)
            session.pop("password", None)
    except:
        session.pop('username', None)
        session.pop("password", None)
    return redirect(url_for('login'))

@app.route('/profile', methods=("POST","GET"))
def profile_check():
    userdata = requests.get('http://127.0.0.1:5000/user-data/' + session['username']).json()
    # print(str(userdata['userid']))
    ads_location = os.path.join('http://127.0.0.1:5000/advertisement/user/', str(userdata['userid']))
    userAds = requests.get(ads_location)
    user_ads_data = userAds.json()
    photo_link=[]
    for values in user_ads_data["advertisement_list"]:
        photo_location = os.path.join('http://127.0.0.1:5000/file/', values["photo"])
        photo_get = requests.get(photo_location).json()
        photo_link.append(photo_get)
    # print(user_ads_data["advertisement_list"])
    if not user_ads_data["advertisement_list"]:
        user_ads_data["advertisement_list"] = False
    # print(user_ads_data)

    # For User Data
    userdata = requests.get('http://127.0.0.1:5000/user-data/' + session['username']).json()
    all_room_id = requests.get('http://127.0.0.1:5000/user-id/' + str(userdata["userid"]))
    if all_room_id.status_code == 200:
        get_room_id = all_room_id.json()["Message"]
        data=[]
        for ids in get_room_id:
            ownerdata = requests.get('http://127.0.0.1:5000/user-data-id/' + str(ids["owner"])).json()
            renterdata = requests.get('http://127.0.0.1:5000/user-data-id/' + str(ids["renter"])).json()
            latestMessage = requests.get('http://127.0.0.1:5000/latest_msg/'+ str(ids["room_id"]))
            if ownerdata["username"] != session["username"]:
                display_username = ownerdata["username"]
            else:
                display_username = renterdata["username"]
            if latestMessage.status_code == 200:
                latestMessage = latestMessage.json()
                data.append(
                    {
                        "username": display_username,
                        "message": latestMessage[0]["latest_message"]
                    }
                )
            else:
                latestMessage = latestMessage.json()
                if latestMessage["Message"]=="No Messages":
                    data.append(
                        {
                            "username": display_username,
                            "message": latestMessage["Message"]
                        }
                    )
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
            try:
                terraceAccess = request.form["terraceAccess"]
            except KeyError:
                terraceAccess = False
            filename = secure_filename(ads_photo.filename)
            current_file_location = os.path.dirname(os.path.realpath(__file__)).replace('\\','/') + '/static/style/img/temp/'
            if not os.path.isdir(current_file_location):
                os.makedirs(current_file_location)
            ads_photo.save(current_file_location+filename)
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
    try:
        return render_template('profile.html', user_ads_data=user_ads_data["advertisement_list"], photo_link=photo_link, data=data)
    except:
        return render_template('profile.html', user_ads_data=user_ads_data["advertisement_list"], photo_link=photo_link)

@app.route('/chatting', methods=("POST","GET"))
def messaging():
    data = None
    new = False
    try:
        if session["username"] and session["password"]:
            pass
    except:
        return redirect(url_for('login'))
    if not session.get("owner") is None:
        owner = session["owner"]
        session.pop("owner", None)
        ownerdata = requests.get('http://127.0.0.1:5000/user-data/' + owner).json()
        renterdata = requests.get('http://127.0.0.1:5000/user-data/' + session['username']).json()
        chatting_requesting_json = {
            "owner_id": ownerdata["userid"],
            "renter_id": renterdata["userid"]
        }
        chatting_requesting_json = json.dumps(chatting_requesting_json)
        headers = {"Content-Type": "application/json"}
        chatting_room_id = requests.post("http://127.0.0.1:5000/chat_id", data=chatting_requesting_json, headers=headers)
        if chatting_room_id.status_code == 404:
            print("error")
        else:
            new = True
    userdata = requests.get('http://127.0.0.1:5000/user-data/' + session['username']).json()
    all_room_id = requests.get('http://127.0.0.1:5000/user-id/' + str(userdata["userid"]))
    if all_room_id.status_code == 200:
        get_room_id = all_room_id.json()["Message"]
        data=[]
        for ids in get_room_id:
            ownerdata = requests.get('http://127.0.0.1:5000/user-data-id/' + str(ids["owner"])).json()
            renterdata = requests.get('http://127.0.0.1:5000/user-data-id/' + str(ids["renter"])).json()
            latestMessage = requests.get('http://127.0.0.1:5000/latest_msg/'+ str(ids["room_id"]))
            if latestMessage.status_code == 200:
                latestMessage = latestMessage.json()
                data.append(
                    {
                        "owner_name": ownerdata["username"],
                        "renter_name": renterdata["username"],
                        "message": latestMessage[0]["latest_message"]
                    }
                )
            else:
                latestMessage = latestMessage.json()
                if latestMessage["Message"]=="No Messages":
                    data.append(
                        {
                            "owner_name": ownerdata["username"],
                            "renter_name": renterdata["username"],
                            "message": latestMessage["Message"]
                        }
                    )
        return render_template('chatting.html',data=data, displayChat=True, getRoomId=get_room_id)
    else:
        return render_template('chatting.html',data=data, displayChat=False)

@socketio.on('joined_room')
def handle_join_room_event(data):
    address = "http://127.0.0.1:5000/getMessage/"+data["room"]
    current_user_id = requests.get('http://127.0.0.1:5000/user-data/' + session['username']).json()["userid"]
    
    value = requests.get(address)
    if value.status_code == 200:
        item = value.json()["message_index"]
        user_id_list=[]
        message_list=[]
        for i in item:
            user_id, message = [value for key, value in i.items()]
            user_id_list.append(user_id)
            message_list.append([user_id,message])
                
        for_usernames = list(set(user_id_list))
        usernames=[]
        username_dicts={}
        for id in for_usernames:
            user_searching_address = 'http://127.0.0.1:5000/user-data-id/'+str(id)
            user = requests.get(user_searching_address).json()
            usernames.append(user["username"])
        for i, names in enumerate(usernames):
            username_dicts[for_usernames[i]] = names
        datas = {
            "current_username": session['username'],
            "Username": username_dicts,
            "Message": message_list,
            "owner_status": data["owner_status"]
        }
        join_room(data['room'])
        room_user = requests.get("http://127.0.0.1:5000/user-id-from/"+str(data["room"])).json()
        owner_id = room_user["owner"]
        renter_id = room_user["renter"]
        if data["owner_status"] == 0:
            owner_advertisement_get = requests.get("http://127.0.0.1:5000/advertisement/user/"+str(owner_id)).json()["advertisement_list"]
            # print(owner_advertisement_get)
            photo_link_get = [requests.get("http://127.0.0.1:5000/file/"+i["photo"]).json() for i in owner_advertisement_get]
            # print(photo_link_get)
            all_info_data = {
                "data": datas,
                "advertisement_list": owner_advertisement_get,
                "photo_link":photo_link_get
            }

        else:
            owner_advertisement_get = requests.get("http://127.0.0.1:5000/advertisement/user/"+str(owner_id)).json()["advertisement_list"]
            advertisment_geolocation_to_send = [requests.get("http://127.0.0.1:5000/getGeoLocation/"+str(i["advertisement_id"])).json() for i in owner_advertisement_get]
            owner_contact_info = [requests.get("http://127.0.0.1:5000/user-contact-info/"+username_dicts[i]).json() for i in for_usernames if i == current_user_id][0]
            photo_link_get = [requests.get("http://127.0.0.1:5000/file/"+i["photo"]).json() for i in owner_advertisement_get]
            all_info_data = {
                "data": datas,
                "advertisement_list": owner_advertisement_get,
                "geoLocation": advertisment_geolocation_to_send,
                "photo_link":photo_link_get,
                "contact_info": owner_contact_info
            }
        if value is not None:
            socketio.emit('join_room', all_info_data ,room=data["room"])
        
@socketio.on('send_message')
def handle_send_messsage_event(data):
    message_posting_json = json.dumps({
            "message": data["message"],
            "sent_user": data["username"],
            "room_id": data["room"]
        }
    )
    headers = {"Content-Type": "application/json"}
    username = requests.get('http://127.0.0.1:5000/user-data-id/'+data["username"]).json()
    data["username"] = username["username"]
    message_adding_to_database = requests.post("http://127.0.0.1:5000/message", data=message_posting_json, headers=headers)
    if not message_adding_to_database.status_code == 200:
        print("error")
    socketio.emit('recieve_message', data, room=data['room'])

if __name__=='__main__':
    app.config['SECRET_KEY'] = '\x15\r\x19\x19\xad\x042\x1a]r\xb5\xb0\x14\xa8\x87\xe2\xa2\xb9\x14\n\x0fgn\xe5'
    app.run(port=5001, debug=True)  