namespace :trends do
  task :populate => :environment do
    puts "Fetched #{Trend.populate.length} trends"
  end

  task :clean_connections => :environment do
    puts "Killed #{Connection.kill_old.size} connections"
  end
end 
