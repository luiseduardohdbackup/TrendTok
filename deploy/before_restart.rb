# ==============================================================================
# SETUP
# ==============================================================================

home        = "cd #{release_path} && HOME=/home/deploy &&"
env         = "RAILS_ENV=#{node['environment']['framework_env']}"
scheduler_pid  = 'tmp/pids/scheduler.pid'
pid_dir     = '/data/twitalk/shared/tmp/pids'

# ==============================================================================
# STOP SCHEDULER
# ==============================================================================
if ::File.exist? "#{release_path}/#{scheduler_pid}"
  run "#{home} export #{env} && ./script/scheduler stop"
end

