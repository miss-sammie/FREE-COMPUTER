import os
import json

# Define the project directory and the library directory
project_directory = os.path.dirname(os.path.abspath(__file__))
library_directory = os.path.join(project_directory, 'library')
os.makedirs(library_directory, exist_ok=True)

# Define the folder to search within the library directory
folder_to_search = input("Please enter the name of the folder you want to search within the 'library' directory: ")
folder_to_search_path = os.path.join(library_directory, folder_to_search)

# Generate the output JSON file name dynamically
output_json_file = os.path.join(library_directory, f'library-{folder_to_search}.json')

# Define the allowed extensions
allowed_extensions = {'.jpg', '.png', '.mov', '.mp4', '.mp3', '.wav', '.glb', '.gltf'}

# Function to recursively get filenames with allowed extensions
def get_filenames_with_extensions(folder, extensions):
    filenames = []
    for root, _, files in os.walk(folder):
        for file in files:
            if os.path.splitext(file)[1].lower() in extensions:
                # Make the path relative to the library directory and prepend 'library'
                relative_path = os.path.relpath(os.path.join(root, file), library_directory)
                filenames.append(os.path.join('library', relative_path))
    return filenames

# Get the list of filenames
filenames = get_filenames_with_extensions(folder_to_search_path, allowed_extensions)

# Write the list to a JSON file
with open(output_json_file, 'w') as json_file:
    json.dump(filenames, json_file, indent=4)

print(f'JSON file created: {output_json_file}')