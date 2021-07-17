def get_cookie(name, strCookies):
    cookies = strCookies.split(';')
    matching = list(filter(lambda el: (el[:el.find('=')] == name), cookies))
    if len(matching) == 0:
        return None
    cookie = matching[0]
    return cookie[cookie.find('=') + 1:len(cookie)]
