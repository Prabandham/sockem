class CreateMessages < ActiveRecord::Migration[5.2]
  def change
    create_table :messages do |t|
      t.belongs_to :site
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :content
      t.string :blob
      t.boolean :read, default: false

      t.timestamps
    end
  end
end
