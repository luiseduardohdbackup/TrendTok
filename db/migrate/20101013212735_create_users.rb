class CreateUsers < ActiveRecord::Migration
  def self.up
    create_table :users do |t|
      t.string :twitter_id, :null => false
      t.string :screen_name, :null => false
      t.string :profile_image_url, :null => false
      t.string :access_token, :null => false
      t.string :access_secret, :null => false
      t.timestamps
    end

    add_index :users, :twitter_id
  end

  def self.down
    drop_table :users
  end
end
