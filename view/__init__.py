class Login:
    def __init__(self):
        with open("view/login.html") as page, \
                open("view/crypto-js.js") as cryptojs, \
                open("view/bootstrap.js") as bootstrap_js, \
                open("view/bootstrap.css") as bootstrap_css:
            cryptojs = cryptojs.read()
            bootstrap_js = bootstrap_js.read()
            bootstrap_css = bootstrap_css.read()
            content = page.read()
            content = content.replace("/*crypto-js*/", cryptojs)
            content = content.replace("/*Bootstrap.css*/", bootstrap_css)
            content = content.replace("/*Bootstrap.js*/", bootstrap_js)
            self.__content = content

    @property
    def content(self):
        return self.__content

