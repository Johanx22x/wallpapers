# File for generating a README.md file for each 
# subdirectory and make more enjoyable to watch 
# the wallpapers through the repository.

import os
import sys

# Get the current directory
current_dir = os.getcwd()

# Get the list of subdirectories, not recursively
subdirectories = os.listdir(current_dir)

# Remove the script file from the list
subdirectories.remove("generate_readme.py")
subdirectories.remove(".git")
if "README.md" in subdirectories:
    subdirectories.remove("README.md")

# Generate a main README.md file 
# containing the subdirectories 
# using format: [subdirectory](/path/to/subdirectory/README.md)
print("Generating main README.md file...")
readme_file = open("README.md", "w")
readme_file.write("# Wallpapers\n\n")
readme_file.write("Repository containing wallpapers for my desktop.\n\n")
for subdirectory in subdirectories:
    readme_file.write("[%s](%s)\n\n" % (subdirectory, subdirectory + "/README.md"))
readme_file.close()

# For each subdirectory, generate a README.md file 
# containing the images in the subdirectory
# using format: ![filename](/path/to/filename)
for subdirectory in subdirectories:
    print("Generating README.md file for %s..." % subdirectory)

    # Get the list of files in the subdirectory
    files = os.listdir(subdirectory)
    if "README.md" in files:
        files.remove("README.md")

    # Open the README.md file
    readme_file = open(subdirectory + "/README.md", "w")

    # Write the title of the subdirectory
    readme_file.write("# " + subdirectory + "\n\n")

    # Write the images in the subdirectory
    for file in files:
        readme_file.write("## " + file + "\n\n")
        readme_file.write("![%s](%s)\n\n" % (file, file))

    # Close the README.md file
    readme_file.close()

print("Done!")
