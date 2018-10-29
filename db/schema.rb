# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_10_29_052848) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "assets", force: :cascade do |t|
    t.string "name"
    t.string "priority"
    t.string "attachment"
    t.bigint "site_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_assets_on_name"
    t.index ["site_id"], name: "index_assets_on_site_id"
  end

  create_table "layouts", force: :cascade do |t|
    t.string "name"
    t.string "content"
    t.bigint "site_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_layouts_on_name"
    t.index ["site_id"], name: "index_layouts_on_site_id"
  end

  create_table "pages", force: :cascade do |t|
    t.string "name"
    t.string "path"
    t.text "content"
    t.bigint "site_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "layout_id"
    t.index ["layout_id"], name: "index_pages_on_layout_id"
    t.index ["name"], name: "index_pages_on_name"
    t.index ["path"], name: "index_pages_on_path"
    t.index ["site_id"], name: "index_pages_on_site_id"
  end

  create_table "sites", force: :cascade do |t|
    t.string "name"
    t.string "domain"
    t.string "description"
    t.string "google_analytics_key"
    t.jsonb "meta", default: "{}", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["domain"], name: "index_sites_on_domain"
    t.index ["google_analytics_key"], name: "index_sites_on_google_analytics_key"
    t.index ["meta"], name: "index_sites_on_meta", using: :gin
    t.index ["name"], name: "index_sites_on_name"
  end

  add_foreign_key "assets", "sites"
  add_foreign_key "pages", "layouts"
  add_foreign_key "pages", "sites"
end
