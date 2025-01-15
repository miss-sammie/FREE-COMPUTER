from http.server import HTTPServer, BaseHTTPRequestHandler
import mimetypes
import webbrowser

###########################################################################
# CONFIGURATION ###########################################################
###########################################################################
PORT = 9000
AUTO_LAUNCH_BROWSER = False
###########################################################################

###########################################################################
# CARRIER_BAG_SERVER ######################################################
###########################################################################
class CarrierBagServer(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            self.path = "/index.html"
        # print("Trying to find " + self.path)
        mime_type, encoding = mimetypes.guess_type(self.path)
        try:
            requested_file = open(self.path[1:]).read()
            self.send_response(200)
        except:
            requested_file = "No such file on here I'm afraid :/"
            self.send_response(404)
        self.send_header("Content-type", mime_type)
        self.end_headers()
        self.wfile.write(bytes(requested_file, "utf-8"))

    def get_library(self, url):
        print("Requested Library file: " + url)

###########################################################################
# UTILITY FUNCTIONS #######################################################
###########################################################################
def launch_browser():
    webbrowser.open_new("http://localhost:" + str(PORT))

###########################################################################
# MAIN ####################################################################
###########################################################################
if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", PORT), CarrierBagServer)
    print("💪 Starting Carrier Bag Server on http://localhost:" + str(PORT))
    try:
        if AUTO_LAUNCH_BROWSER:
            launch_browser()
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    server.server_close()
    print("👋 Bye for now")