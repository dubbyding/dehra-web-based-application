from flask_restful import Resource
from flask import request, send_file
import json, os, datetime, shutil
import dropbox
from flask_sqlalchemy.utils import engine_config_warning
from werkzeug.utils import secure_filename
from advertisement_management.models.advertisement import AdvertisementModel, ChatMessageModel, ChatUserModel
from advertisement_management.schemas.advertisement import (
    AdvertisementSchema,
    SearchAdvertisementSchema,
    ChatUserSchema,
    ChatMessageSchema,
)

# Instances of schema
advertisement_schema = AdvertisementSchema()
search_advertisement_schema = SearchAdvertisementSchema()
chat_user_schema = ChatUserSchema()
chat_message_schema = ChatMessageSchema()

dropbox_secret_key = "A2z-XnPHnM8AAAAAAAAAAe4U8vdm7L23Lq1QVC8SLFtM1dx5q2gKk9sH1JA65qy6"
dbx = dropbox.Dropbox(dropbox_secret_key)

ALLOWED_EXTENSION = set(['png', 'jpg', 'jpeg', 'gif'])


# Function to check weather the file to be uploaded is an image or not
def allowed_file(filename):
    ext = filename.split('.')[-1]
    return '.' in filename and ext.lower() in ALLOWED_EXTENSION

class PostAdvertisement(Resource):
    @classmethod
    def post(cls):
        user_id = request.form["user_id"]
        property_type = request.form["property_type"]
        property_address = request.form["property_address"]
        geo_location = request.form["geo_location"]
        room_count = request.form["room_count"]
        price = request.form["price"]
        photo = request.files["photo"]
        description = request.form["description"]
        water_source = request.form["water_source"]
        bathroom = request.form["bathroom"]
        terrace_access = request.form["terrace_access"]
        filename=secure_filename(photo.filename)
        extension = filename.split('.')[-1]
        filename = datetime.datetime.now().strftime("%y%m%d_%H%M%S_%f")
        newfilename = filename+"."+extension
        filelocation = os.path.dirname(os.path.realpath(__file__))+"/uploaded_files/"
        if not os.path.isdir(filelocation):
            os.makedirs(filelocation)
        filename_and_location = os.path.join(filelocation ,newfilename)
        photo.save(filename_and_location)
        with open(filename_and_location,'rb') as f:
            dbx.files_upload(f.read(), "/Apps/dehra/"+newfilename)
        for filename in os.listdir(filelocation):
            file_path = os.path.join(filelocation, filename)
            try:
                if(os.path.isfile(file_path) or os.path.islink(file_path)):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print("Failed to delete %s. Reason: %s" % (file_path, e))
        advertisement_json = {
            "user_id" : user_id,
            "property_type" : property_type,
            "property_address" : property_address,
            "geo_location" : geo_location,
            "room_count" : room_count,
            "price" : float(price.split(",")[0]),
            "photo" : newfilename,
            "description" : description,
            "water_source" : water_source,
            "bathroom" : bathroom,
            "terrace_access" : bool(terrace_access)
        }
        advertisement_json = json.dumps(advertisement_json)
        advertisement_data = advertisement_schema.loads(advertisement_json)
        advertisement = AdvertisementModel(
            advertisement_data["user_id"],
            advertisement_data["property_type"],
            advertisement_data["property_address"],
            advertisement_data["geo_location"],
            advertisement_data["room_count"],
            advertisement_data["price"],
            advertisement_data["photo"],
            advertisement_data["description"],
            advertisement_data["water_source"],
            advertisement_data["bathroom"],
            advertisement_data["terrace_access"],
        )
        advertisement.save_to_db()
        # We can only use the backref now i.e advertisement.user as after putting the user_id foreign key
        # then only flask-sqlalchemy can identify user object using the foreign key as there is no magic
        # and sqlalchemy needs to know the foreign key value and then search in the table for back ref using that foreign key
        print(
            advertisement.user.mobile_number
            + "\n"
            + advertisement.user.username
            + "\n"
            + advertisement.user.email
        )
        return {"message": "Advertisement Successfully added"}, 200

class getGeoLocation(Resource):
    @classmethod
    def get(cls, id):
        geoLocation = AdvertisementModel.find_geo_location(id)
        print(geoLocation)
        try:
            latitude, longitude = geoLocation.split(", ")
        except:
            latitude, longitude = geoLocation.split(",")
        return {
            "latitude": latitude,
            "longitude": longitude
        }

class getAllAdsData(Resource):
    @classmethod
    def get(cls, number_needed):
        advertisement_list = AdvertisementModel.get_all_desc(number_needed)
        advertisements_found = []
        for advertisement in advertisement_list:
            advertisements_found.append(
                {
                    "advertisement_id": advertisement.id,
                    "price": advertisement.price,
                    "property_type": advertisement.property_type,
                    "property_address": advertisement.property_address,
                    "photo": advertisement.photo,
                    "room_count": advertisement.room_count,
                    "description": advertisement.description,
                    "water_source": advertisement.water_source,
                    "bathroom": advertisement.bathroom,
                    "terrace_access": advertisement.terrace_access,
                    "user_id": advertisement.user_id,
                    "username": advertisement.user.username,
                }
            )
        return {"advertisement_list": advertisements_found}, 200
class GetAdvertisementLists(Resource):
    @classmethod
    def get(cls, location_to_search):
        # location_to_search_json = request.get_json()
        # location_to_search_data = search_advertisement_schema.load(location_to_search_json)
        # location_to_search = location_to_search_data['location_to_search']
        # Returns list of AdvertisementModel Object so, we cannot pass it directly and needs to be \
        # converted into json or dictionary or simple list
        advertisement_list = AdvertisementModel.get_advertisement_lists_by_location(
            location_to_search
        )
        # print(location_to_search)
        # generating dictionary
        advertisements_found = []
        for advertisement in advertisement_list:
            advertisements_found.append(
                {
                    "advertisement_id": advertisement.id,
                    "price": advertisement.price,
                    "property_type": advertisement.property_type,
                    "property_address": advertisement.property_address,
                    "photo": advertisement.photo,
                    "room_count": advertisement.room_count,
                    "description": advertisement.description,
                    "water_source": advertisement.water_source,
                    "bathroom": advertisement.bathroom,
                    "terrace_access": advertisement.terrace_access,
                    "user_id": advertisement.user_id,
                    "username": advertisement.user.username,
                }
            )

        return {"advertisement_list": advertisements_found}, 200
class GetFile(Resource):
    @classmethod
    def get(cls, file_name):

        result = dbx.files_get_temporary_link("/Apps/dehra/"+file_name)
        image_link = result.link

        return image_link


class GetSingleAdvertisement(Resource):
    @classmethod
    def get(cls, advertisement_id):
        advertisement = AdvertisementModel.find_by_id(advertisement_id)
        return {
            "user_id": advertisement.user_id,
            "property_type": advertisement.property_type,
            "property_address": advertisement.property_address,
            "geo_location": advertisement.geo_location,
            "room_count": advertisement.room_count,
            "price": advertisement.price,
            "description": advertisement.description,
            "water_source": advertisement.water_source,
            "bathroom": advertisement.bathroom,
            "terrace_access": advertisement.terrace_access,
            "username": advertisement.user.username,
        }, 200


class GetAdvertisementListsByUserId(Resource):
    @classmethod
    def get(cls, user_id):
        advertisement_list = AdvertisementModel.find_by_user_id(user_id)
        advertisements_found = []
        for advertisement in advertisement_list:
            advertisements_found.append(
                {
                    "advertisement_id": advertisement.id,
                    "user_id": advertisement.user_id,
                    "property_type": advertisement.property_type,
                    "property_address": advertisement.property_address,
                    "geo_location": advertisement.geo_location,
                    "room_count": advertisement.room_count,
                    "price": advertisement.price,
                    "photo": advertisement.photo,
                    "description": advertisement.description,
                    "water_source": advertisement.water_source,
                    "bathroom": advertisement.bathroom,
                    "terrace_access": advertisement.terrace_access,
                    "username": advertisement.user.username,
                }
            )
        return {"advertisement_list": advertisements_found}, 200

class PostChatId(Resource):
    @classmethod
    def post(cls):
        chat_id_json = request.get_json()
        print(chat_id_json)
        chat_id_data = chat_user_schema.load(chat_id_json)
        try:
            print("try")
            if ChatUserModel.find_owner_id(chat_id_data["owner_id"]) and ChatUserModel.find_renter_id(
                    chat_id_data["renter_id"]):
                print("Try")
                user_id = ChatUserModel.get_room_id(chat_id_data["owner_id"], chat_id_data["renter_id"])
                return {"chat_user_id": user_id}, 200
            else:
                chat_id = ChatUserModel(
                    chat_id_data["owner_id"],
                    chat_id_data["renter_id"],
                )
                print(chat_id)
                chat_id.save_to_db()
                print("Except")
                if ChatUserModel.find_owner_id(chat_id_data["owner_id"]) and ChatUserModel.find_renter_id(
                    chat_id_data["renter_id"]):
                    user_id = ChatUserModel.get_room_id(chat_id_data["owner_id"], chat_id_data["renter_id"])
                    return {"chat_user_id": user_id}, 200
        except:
            chat_id = ChatUserModel(
                chat_id_data["owner_id"],
                chat_id_data["renter_id"],
            )
            print(chat_id)
            chat_id.save_to_db()
            print("Except")
            if ChatUserModel.find_owner_id(chat_id_data["owner_id"]) and ChatUserModel.find_renter_id(
                chat_id_data["renter_id"]):
                user_id = ChatUserModel.get_room_id(chat_id_data["owner_id"], chat_id_data["renter_id"])
                return {"chat_user_id": user_id}, 200
        return{"chat_user_id": None}, 404

class GetChatId(Resource):
    @classmethod
    def get(cls, id):
        details = []
        try:
            for i in ChatUserModel.get_id_by_owner(id):
                details.append(
                    {
                        "room_id":i.id,
                        "owner":i.owner_id,
                        "renter": i.renter_id
                    }
                )
        except:
            pass
        try:
            for i in ChatUserModel.get_id_by_renter(id):
                details.append(
                    {
                        "room_id":i.id,
                        "owner":i.owner_id,
                        "renter": i.renter_id
                    }
                )
        except:
            pass
        if not details:
            return {"Message": "No chatting data"}, 404
        print(details)
        return {"Message": details}, 200

class getUsersByRoomId(Resource):
    @classmethod
    def get(cls, room_id):
        get_datas = ChatUserModel.get_users(room_id)
        print(get_datas)
        return {
            "owner": get_datas.owner_id,
            "renter": get_datas.renter_id
        }, 200

class ChatMessage(Resource):
    @classmethod
    def post(cls):
        chat_message_json = request.get_json()
        chat_message_data = chat_message_schema.load(chat_message_json)
        chat_message = ChatMessageModel(
            chat_message_data["message"],
            chat_message_data["sent_user"],
            chat_message_data["room_id"],
        )
        chat_message.save_to_db()
        return {"message": "successfully added"}, 200


class getMessageAll(Resource):
    @classmethod
    def get(cls, room_id):
        message_list = ChatMessageModel.order_message_dec(room_id)
        message_found = []
        for message in message_list:
            message_found.append(
                {
                    "username": message.sent_user,
                    "message": message.message,
                }
            )
        return {"message_index": message_found}, 200
class ChatMessageAll(Resource):
    @classmethod
    def get(cls, user_id):
        if ChatUserModel.query.all() is None:
            if ChatUserModel.find_owner_id(user_id) and ChatUserModel.find_renter_id(user_id):
                room_id = ChatMessageModel.get_room_id(user_id)
                return {"room_id": room_id}, 200
            else:
                return {"Message": "Not In Room"}, 404
        else:
            return {"message": "Sorry, Database is empty!!!"}, 404

        
class ChatLatestMessage(Resource):
    @classmethod
    def get(cls, room_id):
        try:
            if room_id:
                latest_message = ChatMessageModel.get_latest_msg(room_id)
                print(latest_message)
                msg = [{
                    "latest_message": latest_message.message
                }]
                # print(msg)
                return msg, 200
            else:
                return {"Message": "No Messages"}, 404
        except AttributeError:
            return {"Message": "No Messages"}, 404