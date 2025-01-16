from bottle import route, run, static_file, response
from bottle import redirect, error, abort
from library import Library
from os import getcwd
import webbrowser
import mimetypes
import socket

###########################################################################
# CONFIGURATION ###########################################################
###########################################################################
PORT = 8080                 # Which port to run the web server on
EXPOSE_TO_LAN = False       # Make accessible over the local network
AUTO_LAUNCH_BROWSER = True  # If True launches your default browser
LIBRARY = Library()         # If no subfolder is passed it will scan all
###########################################################################

###########################################################################
# ROUTES ##################################################################
###########################################################################
@route('/')
def home():
    redirect("/index.html")

@route('/library')
def serve_library_json():
    response.content_type = "application/json; charset=UTF8"
    return LIBRARY.as_json()

@route('/server/<filepath:path>')
def restricted(filepath):
    abort(401, "You seem lost little child..")

@route('/<filepath:path>')
def serve_library_asset(filepath):
    return static_file(filepath, root=getcwd())

@error(404)
def file_not_found_route(error):
    return "There was a HOLE here. It's gone now."
###########################################################################

###########################################################################
# UTILITY FUNCTIONS #######################################################
###########################################################################
def launch_browser():
    webbrowser.open_new(get_local_url())

def get_local_url():
    if EXPOSE_TO_LAN:
        ip = socket.gethostbyname(socket.gethostname())
    else:
        ip = "localhost"
    return f'http://{ip}:{PORT}'
###########################################################################

###########################################################################
# MAIN ####################################################################
###########################################################################
if __name__ == "__main__":
    LIBRARY.index()
    if AUTO_LAUNCH_BROWSER: launch_browser()
    print("Starting Carrier Bag on http://localhost:" + str(PORT))
    print("Press CTRL + C or close this Terminal window to abort")
    run(host='0.0.0.0', port=PORT, quiet=True, debug=True)
###########################################################################