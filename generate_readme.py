# File for generating a README.md file for each 
# subdirectory and make more enjoyable to watch 
# the wallpapers through the repository.

import os
import sys
from PIL import Image
from fractions import Fraction


def get_image_metadata(image_path):
    try:
        image = Image.open(image_path)
        width, height = image.size
        aspect_ratio = width / height
        return {
            "resolution": (width, height),
            "aspect_ratio": aspect_ratio
        }
    except Exception as e:
        return None

# Get the current directory
current_dir = os.path.abspath(__file__)
current_dir = os.path.dirname(current_dir)

# Get the list of subdirectories, not recursively
subdirectories = os.listdir(current_dir)

# Remove the script file from the list
subdirectories.remove("generate_readme.py")
subdirectories.remove(".git")
subdirectories.remove(".github")
if "README.md" in subdirectories:
    subdirectories.remove("README.md")

# Generate a main README.md file 
# containing the subdirectories 
# using format: [subdirectory](/path/to/subdirectory)
print("Generating main README.md file...")
readme_file = open(current_dir + "/README.md", "w")
readme_file.write("# Wallpapers\n\n")
readme_file.write("Repository containing wallpapers for my desktop.\n\n---\n\n")
for subdirectory in subdirectories:
    readme_file.write("[%s](%s)\n\n" % (subdirectory, subdirectory))
readme_file.close()

# For each subdirectory, generate a README.md file 
# containing the images in the subdirectory
# using format: ![filename](/path/to/filename)
for subdirectory in subdirectories:
    print("Generating README.md file for %s..." % subdirectory)

    # Get the list of files in the subdirectory
    files = os.listdir(current_dir + "/" + subdirectory)
    if "README.md" in files:
        files.remove("README.md")

    # Open the README.md file
    readme_file = open(current_dir + "/" + subdirectory + "/README.md", "w")

    # Write the title of the subdirectory
    readme_file.write("# " + subdirectory + "\n\n")

    # Write the images in the subdirectory
    for file in files:
        readme_file.write("## " + file + "\n\n")
        readme_file.write("![%s](%s)\n\n" % (file, file))
        metadata = get_image_metadata(subdirectory + "/" + file)
        if metadata is None:
            continue
        readme_file.write("- Resolution: %s\n" % str(metadata["resolution"]))
        readme_file.write("- Aspect ratio: %s\n\n" % str(Fraction(metadata["aspect_ratio"]).limit_denominator()))

    # Close the README.md file
    readme_file.close()

print("Done!")
