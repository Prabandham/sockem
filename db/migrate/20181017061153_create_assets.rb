class CreateAssets < ActiveRecord::Migration[5.2]
  def change
    create_table :assets do |t|
      t.string :name
      t.string :priority
      t.string :attachment
      t.belongs_to :site, foreign_key: true

      t.timestamps
    end

    add_index :assets, :name
  end
end
