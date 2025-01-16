import json
import os

############################################################################
# CONSTANTS ################################################################
############################################################################
DEFAULT_ALLOWED_EXTENSIONS = [
    '.jpg', 
    '.jpeg', 
    '.png', 
    '.mov', 
    '.mp4', 
    '.mp3', 
    '.wav', 
    '.glb', 
    '.gltf'
]
DEFAULT_FILES = [
    "library/IMG_1469.JPEG"
    "library/IMG_1502.JPG"
]
############################################################################

############################################################################
# LIBRARY ##################################################################
############################################################################
class Library:
    def __init__(self, folder = "", filetypes = DEFAULT_ALLOWED_EXTENSIONS):
        self.folder = folder
        self.allowed_extensions = filetypes
        self.files =  []
        self.cache = "[]"
        project_dir = os.path.abspath(os.getcwd())
        self.library_path = os.path.join(project_dir, 'library')
        if len(folder) > 0 and folder != '.':
            self.folder_path = os.path.join(self.library_path, folder)
        else:
            self.folder_path = self.library_path
            self.folder = "everything"

    def index(self):
        print(f'（。）（。）Taking a look inside the [{self.folder}] bag..')
        self.files = self.scan(self.folder_path, self.allowed_extensions)
        self.cache = json.dumps(self.files)
        self.save_to_disk()

    def scan(self, folder, extensions):
        filenames = []
        for root, _, files in os.walk(folder):
            for file in files:
                if os.path.splitext(file)[1].lower() in extensions:
                    filenames.append(self.extract_file_path(root, file))
        return filenames

    def extract_file_path(self, root, file):
        file_path = os.path.join(root, file)
        relative_path = os.path.relpath(file_path, self.library_path)
        return os.path.join('library', relative_path)

    def as_json(self):
        return self.cache

    def save_to_disk(self):
        with open("library/library.json", 'w') as file:
            json.dump(self.files, file, indent=4)
############################################################################