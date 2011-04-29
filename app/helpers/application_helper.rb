module ApplicationHelper
  def head(&block)
    content_for(:head) { block.call }
  end

  def javascript(*args)
    args = args.map { |arg| arg == :defaults ? arg : arg.to_s }
    content_for(:head) { javascript_include_tag(*args) }
  end

  def twitter_profile_url(user)
    "http://twitter.com/#{user.screen_name}"
  end 
end
