# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :connection do |f|
  f.association(:trend)
  f.tokbox_connection_id "jwfhjkdfbk4oiwi4lakl5i8wkbc"
end
