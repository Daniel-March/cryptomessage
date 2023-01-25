class Chat:
    def __init__(self):
        with open("view/chat/page.html") as page, \
                open("view/chat/encryption.js") as encryption_js, \
                open("view/chat/functions.js") as functions_js, \
                open("view/chat/socket.js") as socket_js, \
                open("view/chat/vars.js") as vars_js, \
                open("view/crypto-js.js") as cryptojs_js, \
                open("view/bootstrap.js") as bootstrap_js, \
                open("view/bootstrap.css") as bootstrap_css:
            cryptojs_js = cryptojs_js.read()
            encryption_js = encryption_js.read()
            functions_js = functions_js.read()
            socket_js = socket_js.read()
            vars_js = vars_js.read()
            bootstrap_js = bootstrap_js.read()
            bootstrap_css = bootstrap_css.read()
            content = page.read()
            content = content.replace("/*crypto-js*/", cryptojs_js)
            content = content.replace("/*bootstrap.css*/", bootstrap_css)
            content = content.replace("/*bootstrap.js*/", bootstrap_js)
            content = content.replace("/*encryption.js*/", encryption_js)
            content = content.replace("/*functions.js*/", functions_js)
            content = content.replace("/*socket.js*/", socket_js)
            content = content.replace("/*vars.js*/", vars_js)
            self.__content = content

    @property
    def content(self):
        return self.__content
