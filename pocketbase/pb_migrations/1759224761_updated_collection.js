/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_50156962")

  // update collection data
  unmarshal({
    "name": "svg"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_50156962")

  // update collection data
  unmarshal({
    "name": "collection"
  }, collection)

  return app.save(collection)
})
