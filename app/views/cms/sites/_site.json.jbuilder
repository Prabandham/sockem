json.extract! site, :id, :name, :domain, :description, :google_analytics_key, :meta, :created_at, :updated_at
json.url site_url(site, format: :json)
