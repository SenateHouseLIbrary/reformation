#
# This file controls Compass/Sass integration.
#
# You need Ruby, SASS and Compass installed, after which you can run
# 
#   compass compile
# 
# from this directory.
#

# Change this to :production when ready to deploy the CSS to the live server.
#environment = :development
environment = :production

##
### You probably don't need to edit anything below this.
###

# Location of the theme's resources.
css_dir = "css"
sass_dir = "sass"
images_dir = "img"
javascripts_dir = "js"
fonts_dir = "fonts"

# You can select your preferred output style here (can be overridden via the
# command line):
# output_style = :expanded or :nested or :compact or :compressed
output_style = (environment == :development) ? :expanded : :compressed

# To enable relative paths to assets via compass helper functions. Since Drupal
# themes can be installed in multiple locations, we don't need to worry about
# the absolute path to the theme from server root.
relative_assets = true

# Turn on sourcemap output for development. In modern browsers you can show
# original sources to see the .scss line numbers
sourcemap = (environment == :development) ? true: false

# Pass options to sass.
# - For production, we force the CSS to be regenerated even though the source
#   scss may not have changed, since we want the CSS to be compressed and have
#   the debug info removed.
sass_options = (environment == :production) ? {:always_update => true} : {}

