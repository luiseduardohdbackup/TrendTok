# ==============================================================================
# SETUP
# ==============================================================================

home        = "cd #{release_path} && HOME=/home/deploy &&"
env         = "RAILS_ENV=#{node['environment']['framework_env']}"
pid_dir     = '/data/twitalk/shared/tmp/pids'

# ==============================================================================
# CREATE PIDS DIR ONLY IF IT DOES NOT EXIST
# ==============================================================================
run "#{home} mkdir #{pid_dir}" unless ::File.directory? pid_dir

# ==============================================================================
# RUNNING SCHEDULER IN BACKGROUND.
# ==============================================================================
puts 'Running scheduler in background.'
run "#{home} export #{env} && ./script/scheduler start &"

