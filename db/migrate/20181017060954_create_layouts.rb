class CreateLayouts < ActiveRecord::Migration[5.2]
  def change
    create_table :layouts do |t|
      t.string :name, unique: true
      t.string :content #65535 limit
      t.belongs_to :site

      t.timestamps
    end

    add_index :layouts, :name
  end
end
