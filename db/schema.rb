# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20101026152627) do

  create_table "connections", :force => true do |t|
    t.integer  "trend_id"
    t.string   "tokbox_connection_id"
    t.datetime "pinged_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "connections", ["tokbox_connection_id"], :name => "index_connections_on_tokbox_connection_id"
  add_index "connections", ["trend_id"], :name => "index_connections_on_trend_id"

  create_table "slugs", :force => true do |t|
    t.string   "name"
    t.integer  "sluggable_id"
    t.integer  "sequence",                     :default => 1, :null => false
    t.string   "sluggable_type", :limit => 40
    t.string   "scope"
    t.datetime "created_at"
  end

  add_index "slugs", ["name", "sluggable_type", "sequence", "scope"], :name => "index_slugs_on_n_s_s_and_s", :unique => true
  add_index "slugs", ["sluggable_id"], :name => "index_slugs_on_sluggable_id"

  create_table "trends", :force => true do |t|
    t.string   "tokbox_session"
    t.string   "name"
    t.datetime "as_of"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "twitter_id",        :null => false
    t.string   "screen_name",       :null => false
    t.string   "profile_image_url", :null => false
    t.string   "access_token",      :null => false
    t.string   "access_secret",     :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["twitter_id"], :name => "index_users_on_twitter_id"

end
