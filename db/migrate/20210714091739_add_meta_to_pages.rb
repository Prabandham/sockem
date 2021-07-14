class AddMetaToPages < ActiveRecord::Migration[5.2]
  def change
    add_column :pages, :meta, :text
  end
end
