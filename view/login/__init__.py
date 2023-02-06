class Login:
    def __init__(self):
        with open("view/login/page.html") as page, \
                open("view/login/vars.js") as vars_js, \
                open("view/login/functions.js") as functions_js, \
                open("view/crypto-js.js") as cryptojs_js, \
                open("view/bootstrap.js") as bootstrap_js, \
                open("view/bootstrap.css") as bootstrap_css:
            vars_js = vars_js.read()
            functions_js = functions_js.read()
            cryptojs_js = cryptojs_js.read()
            bootstrap_js = bootstrap_js.read()
            bootstrap_css = bootstrap_css.read()
            content = page.read()
            content = content.replace("/*vars.js*/", vars_js)
            content = content.replace("/*functions.js*/", functions_js)
            content = content.replace("/*crypto-js.js*/", cryptojs_js)
            content = content.replace("/*Bootstrap.css*/", bootstrap_css)
            content = content.replace("/*Bootstrap.js*/", bootstrap_js)
            self.__content = content

    @property
    def content(self):
        return self.__content

