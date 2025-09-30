/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_50156962")

  // remove field
  collection.fields.removeById("file3949269562")

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3949269562",
    "max": 0,
    "min": 0,
    "name": "code_svg",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_50156962")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "file3949269562",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "code_svg",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // remove field
  collection.fields.removeById("text3949269562")

  return app.save(collection)
})
