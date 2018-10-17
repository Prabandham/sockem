class CreateSites < ActiveRecord::Migration[5.2]
  def change
    create_table :sites do |t|
      t.string :name, unique: true
      t.string :domain, unique: true
      t.string :description
      t.string :google_analytics_key, unique: true
      t.jsonb :meta, null: false, default: '{}'

      t.timestamps
    end

    add_index :sites, :meta, using: :gin
    add_index :sites, :name
    add_index :sites, :domain
    add_index :sites, :google_analytics_key
  end
end
