json.extract! page, :id, :name, :path, :content, :site_id, :created_at, :updated_at
json.url page_url(page, format: :json)
