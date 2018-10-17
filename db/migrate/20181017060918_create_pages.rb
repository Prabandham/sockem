class CreatePages < ActiveRecord::Migration[5.2]
  def change
    create_table :pages do |t|
      t.string :name, unique: true
      t.string :path, unique: true
      t.text :content
      t.belongs_to :site, foreign_key: true

      t.timestamps
    end

    add_index :pages, :name
    add_index :pages, :path
  end
end
