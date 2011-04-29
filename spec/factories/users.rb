# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :user do |f|
  f.screen_name "test_user_for_tokbox_demo"
  f.profile_image_url "http://s.twimg.com/a/1286916367/images/default_profile_3_normal.png"
  f.twitter_id "1111111"
  f.access_token "nglnasoiuhtlnaskfnuihflinasfki54bsf"
  f.access_secret "jnfgajd94jnalkdvj2o9rjbfgul45k"
end
