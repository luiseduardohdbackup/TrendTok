class Connection < ActiveRecord::Base
  belongs_to :trend
  validates :trend_id, :presence => true
  validates :tokbox_connection_id, :presence => true,
    :uniqueness => { :scope => :trend_id }

  def ping!
    update_attribute(:pinged_at, Time.now)
  end

  def is_moderator?
    trend.connections.order("created_at ASC").first == self
  end

  def self.kill_old
    where("pinged_at < :ago", :ago => 1.hour.ago).destroy_all
  end
end
