class AddLayoutIdToPage < ActiveRecord::Migration[5.2]
  def change
    add_reference :pages, :layout, foreign_key: true
  end
end
