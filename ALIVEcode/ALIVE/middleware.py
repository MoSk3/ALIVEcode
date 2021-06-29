from channels.auth import AuthMiddlewareStack

from django.apps import apps
User = apps.get_model('auth', 'User')

"""
@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()
"""

class QueryAuthMiddleware:
    """
    Custom middleware (insecure) that takes user IDs from the query string.
    """

    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app
        print(self.app)

    async def __call__(self, scope, receive, send):
        # Look up user from query string (you should also do things like
        # checking if it is a valid user ID, or if scope["user"] is already
        # populated).
        query_string = scope["query_string"].decode("utf-8")
        if query_string != "":
            for query_param in query_string.split("&"):
                splitted = query_param.split('=')
                if len(splitted) == 2:
                    key, value = query_param.split('=')
                    if key == 'id' and len(value) > 0:
                        scope['id'] = value

        #scope['user'] = await get_user(int(self.scope["query_string"]))

        return await self.app(scope, receive, send)


QueryAuthMiddlewareStack = lambda inner: QueryAuthMiddleware(AuthMiddlewareStack(inner))