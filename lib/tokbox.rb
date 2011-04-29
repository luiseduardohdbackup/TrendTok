require 'cgi'
require 'openssl'
require 'base64'
require 'uri'
require 'net/http'
DIGEST  = OpenSSL::Digest::Digest.new('sha1')


class Tokbox
  @@digest = OpenSSL::Digest::Digest.new('sha1')
  @@token_sentinel = "T1=="
  @@sdk_version = "tbruby-1.0"

  include HTTParty
  format :xml
  base_uri 'https://api.opentok.com/hl'

  def initialize(api_key, secret_key, ip_address = nil)
    @partner_id = api_key
    @partner_secret = secret_key
    @ip_address = ip_address
  end

  def generate_token(opts = {})
    {:session_id=>nil, :permissions=>[], :create_time=>nil, :expire_time=>nil}.merge!(opts)

    create_time = opts[:create_time].nil? ? Time.now  :  opts[:create_time]
    session_id = opts[:session_id].nil? ? '' : opts[:session_id]

    data_params = {
      :session_id => session_id,
      :create_time => create_time.to_i,
      :permissions => opts[:permissions]
    }

    if not opts[:expire_time].nil?
      data_params[:expire_time] = opts[:expire_time].to_i
    end

    data_string = data_params.urlencode

    sig = sign_string(data_string, @partner_secret)
    meta_string = {
      :partner_id => @partner_id,
      :sdk_version => @@sdk_version,
      :sig => sig
    }.urlencode
    puts data_string
    puts meta_string
    @@token_sentinel + Base64.b64encode(meta_string + ":" + data_string).gsub("\n","")
  end

  def create_session
    response = self.class.post '/session/create', :body => {
      :partner_id => @partner_id,
      :location_hint => @ip_address
    }, :headers => {
      "X-TB-PARTNER-AUTH" => "#{@partner_id}:#{@partner_secret}"
    }
    response['Sessions']['Session']['session_id']
  end

  def self.urlencode(params)
    params.to_a.map do |name_value|
      if name_value[1].is_a? Array
        name_value[0] = CGI.escape name_value[0].to_s
        name_value[1].map { |e| CGI.escape e.to_s }
        name_value[1] = name_value[1].join "&" + name_value[0] + "="
        name_value.join '='
      else
        name_value.map { |e| CGI.escape e.to_s }.join '='
      end
    end.join '&'
  end

  protected

  def sign_string(data, secret)
    OpenSSL::HMAC.hexdigest(DIGEST, secret, data)
  end
end

class Hash
  def urlencode
    to_a.map do |name_value|
      if name_value[1].is_a? Array
        name_value[0] = CGI.escape name_value[0].to_s
        name_value[1].map { |e| CGI.escape e.to_s }
        name_value[1] = name_value[1].join "&" + name_value[0] + "="
        name_value.join '='
      else
        name_value.map { |e| CGI.escape e.to_s }.join '='
      end
    end.join '&'
  end
end
