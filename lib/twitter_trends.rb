class TwitterResponseError < RuntimeError; end

class TwitterTrends
  include HTTParty
  format :json
  base_uri 'http://api.twitter.com/1/trends'

  attr_reader :name, :as_of

  def initialize(name, as_of)
    @name = name
    @as_of = Time.at(as_of)
  end

  def self.current
    response = get("/current.json")
    trends = []
    if response['trends']
      key = response['trends'].keys.first
      response['trends'][key].each do |trend|
        trends << new(trend['name'], response['as_of'])
      end
    elsif response['error']
      raise TwitterResponseError.new(response['error'])
    end
    trends
  end
end
