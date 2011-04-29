class CreateConnections < ActiveRecord::Migration
  def self.up
    create_table :connections do |t|
      t.belongs_to :trend
      t.string :tokbox_connection_id
      t.datetime :pinged_at
      t.timestamps
    end

    add_index :connections, :trend_id
    add_index :connections, :tokbox_connection_id
  end

  def self.down
    drop_table :connections
  end
end
