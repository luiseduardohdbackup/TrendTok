# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :trend do |f|
  f.tokbox_session "111111111111111111"
  f.sequence(:name) { |n| "Chilean miner #{n}" }
  f.as_of Time.now
end
