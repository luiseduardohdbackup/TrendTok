class Trend < ActiveRecord::Base
  has_many :connections

  has_friendly_id :name, :use_slug => true, :approximate_ascii => true,
    :strip_non_ascii => false

  validates :name, :presence => true,
    :uniqueness => true
  validates :as_of, :presence => true

  attr_accessible :name, :as_of

  default_scope order("as_of DESC")
  scope :latest, limit(10)

  def add_connection_for(tokbox_connection_id)
    connection = Connection.new(:tokbox_connection_id => tokbox_connection_id)
    connections << connection
    connection
  end

  def find_connection_for(connection_id)
    connections.find_by_tokbox_connection_id(connection_id)
  end

  def tokbox_session
    return self[:tokbox_session] if self[:tokbox_session].present?
    set_tokbox_session
    tokbox_session
  end

  def tokbox_token
	tokbox = Tokbox.new(APP_CONFIG['tokbox']['partner_key'],
                        APP_CONFIG['tokbox']['api_secret'])
	return tokbox.generate_token
  end

  def self.populate
    trends = []
    TwitterTrends.current.each do |trend|
      trends << Trend.create(:name => trend.name, :as_of => trend.as_of)
    end
    trends
  end

  private

  def set_tokbox_session
    tokbox = Tokbox.new(APP_CONFIG['tokbox']['partner_key'],
                        APP_CONFIG['tokbox']['api_secret'])
    self.tokbox_session = tokbox.create_session
    save
  end
end
