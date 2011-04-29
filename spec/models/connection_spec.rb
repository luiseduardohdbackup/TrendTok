require 'spec_helper'

describe Connection do
  before(:each) do
    Factory(:connection)
  end

  it { should validate_presence_of(:trend_id) }
  it { should validate_presence_of(:tokbox_connection_id) }
  it { should validate_uniqueness_of(:tokbox_connection_id).scoped_to(:trend_id) }
end
