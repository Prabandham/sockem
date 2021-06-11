class Site < ApplicationRecord
  has_many :layouts, dependent: :destroy
  has_many :pages,   dependent: :destroy
  has_many :assets,  dependent: :destroy

  validates :name, :description, :domain, presence: true

  attribute :initialize_with, :string

  def link_assets_from(framework)
    Rails.logger.debug "Site #{name} wants to be initialized with #{framework}"
    framework_files = Dir.entries(File.join('public', framework.downcase)).reject { |f| f.starts_with?('.') } 

    framework_files.each do |file_path|
      full_path = File.join('public', framework.downcase, file_path)
      next unless File.exist?(full_path)

      asset = Asset.new
      asset.attachment = File.open(full_path)
      asset.site_id = id
      asset.save!
    end
    
    if assets.count >= 1
      layout = Layout.new
      layout.name = 'home.html'
      layout.site_id = id
      layout.content = layout_template
      layout.save!

      page = Page.new
      page.site_id = id
      page.content = landing_page_template
      page.layout_id = layout.id
      page.name = 'index.html'
      page.save!
    end
  
  end

  private

  def landing_page_template
    <<~HTML
      <!-- home -->
      <div class='jumbotron'>
	      <h1>Sockem generated Site.</h1>
	      <p class="lead">
          This example is a quick exercise to illustrate how fixed to top navbar works. 
          As you scroll, it will remain fixed to the top of your browser's viewport.
  	    </p>
      </div>
    HTML
  end

  def layout_template
    <<~HTML
      <!doctype html>
        <html lang='en'>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <title>Sockem generated site using Bootstrap 4.0</title>

            {{ include_stylesheets }}  
            {{ include_javascripts }}
          </head>
          <body class='bg-light'>
            <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
              <a class="navbar-brand" href="#">#{name}</a>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav mr-auto">
                  <li class="nav-item active">
                    <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link disabled" href="#">Disabled</a>
                  </li>
                </ul>
                <form class="form-inline mt-2 mt-md-0">
                  <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
                  <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>
              </div>
            </nav>
            <main role="main" class="container">
              {{ page }}
            </main>
          </body>
        </html>
    HTML
  end
end
