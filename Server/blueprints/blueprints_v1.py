from flask.views import MethodView
from flask_smorest import Blueprint
from flask import session, request, jsonify
from sqlalchemy import or_, desc
from app import app, db

import time
import traceback
import models

apiv1 = Blueprint(
    "apiv1", 
    "apiv1", 
    url_prefix="/api/v1/", 
    description="Version 1 of the backend rest api for help.gcc.edu"
)

@apiv1.route("/articles", methods=["OPTIONS", "GET"])
class Articles(MethodView):
    # The options method always needs to be included in
    # a route class. The options method completes the handshaking
    # between the front end and the backend. You can copy
    # this exact options method for any future route classes
    def options(self):
        return '', 200
    # There should always be two parts to your return statement.
    # First, the json object that is being returned. This object 
    # can be as complec or simple as you need it to be. Second the
    # return code. This is to tell the front end what has taken place.
    # There are different codes for different errors and different 
    # actions that have taken place.
    # 
    # You should always wrap the entire methof in a try except block
    # and return a code 500 in the except block, but make sure to always
    # handle errors as thoroughly as possible within the try block. The
    # Try Except block is just there to catch any anomolies we have not 
    # accounted for.
    # 
    # checking if current_user_id is in session is essentially doing our authentication
    # Once single sign on is figured out we will dynamically set this but for now it is hard
    # coded in. The is also a variable callee current_user_role stored in the session
    # it can either be 'admin' or 'user' this will eventually helo us determine what
    # page to display to the user but is not important for now
    # 
    # All models have two helper function .toJSONPartial and .toJSON these return different
    # json objects if the respective models. As a general rule when returning a list of 
    # model objects you should return using .toJSONPartial if you are returning a single
    # model object, you should use .toJSON
    def get(self):
        try:
            if 'current_user_id' in session:
                articles: list[models.Article] = models.Article.query.all()
                
                returnableArticles = [article.toJSONPartial() for article in articles]
                return {'articles': returnableArticles}, 200
            else:
                return {'msg': 'Unauthorized access'}, 401
        except Exception as e:
            print(f"Error: {e}")
            traceback.print_exc()
            return {'msg': f"Error: {e}"}, 500
        
@apiv1.route("/articles/search", methods=["OPTIONS", "GET"])
class Search(MethodView):
    def options(self):
        return '', 200
    
    def get(self):
        try:
            if 'current_user_id' in session:
                searchQuery = request.args.get("searchQuery")

                articles = models.Article.query.filter(
                    or_(
                        models.Article.Title.ilike(f"%{searchQuery}%"),
                        models.Article.Content.ilike(f"%{searchQuery}%"),
                        models.Article.Article_Description.ilike(f"%{searchQuery}%")
                    )
                ).all()

                returnedArticles = [article.toJSONPartial() for article in articles]

                topResult = returnedArticles[0] if len(returnedArticles) > 0 else None
                secondResult = returnedArticles[1] if len(returnedArticles) > 1 else None
                thirdResult = returnedArticles[2] if len(returnedArticles) > 2 else None
                fourthResult = returnedArticles[3] if len(returnedArticles) > 3 else None
                fifthResult = returnedArticles[4] if len(returnedArticles) > 4 else None

                search = models.Search(SearchQuery=searchQuery, UserID=session.get('current_user_id'), TopResult=topResult,
                                       SecondResult=secondResult, ThirdResult=thirdResult,
                                       FourthResult=fourthResult, FifthResult=fifthResult)
                db.session.add(search)
                
                return {'results': returnedArticles}, 200
            else:
                return {'msg': 'Unauthorized access'}, 401
        except Exception as e:
            print(f"Error: {e}")
            traceback.print_exc()
            return {'msg': f"Error: {e}"}, 500
        
@apiv1.route("/user/viewedarticles", methods=["OPTIONS", "GET"])
class UserViewHistory(MethodView):
    def options(self):
        return '', 200
    
    def get(self):
        try:
            if 'current_user_id' in session:
                recentlyViewedArticles: list[models.Article] = models.Article.query.join(
                    models.ViewHistory, models.Article.ID==models.ViewHistory.ArticleID
                ).filter(
                    models.ViewHistory.UserID == session.get('current_user_id')
                ).order_by(
                    models.ViewHistory.View_Time
                ).all()
                
                returnableArticles = [article.toJSONPartial() for article in recentlyViewedArticles]
                return {'articles': returnableArticles}, 200
            else:
                return {'msg': 'Unauthorized access'}, 401
        except Exception as e:
            print(f"Error: {e}")
            traceback.print_exc()
            return {'msg': f"Error: {e}"}, 500