class CreateTrends < ActiveRecord::Migration
  def self.up
    create_table :trends do |t|
      t.string :tokbox_session
      t.string :name
      t.datetime :as_of
      t.timestamps
    end
  end

  def self.down
    drop_table :trends
  end
end
