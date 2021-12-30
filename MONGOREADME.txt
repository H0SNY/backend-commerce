Queriess 
	await find();  *returns document if found and null if not (note that if the query is object id it throws an error if its not a valid objectID)
	await save();  *returns document saved if saved succesfully and throws an error if not saved
	await update(); *returns and object : {                             
 						 acknowledged: true,
  						modifiedCount: 0, //number of documents modified
  						upsertedId: null,
 					 	upsertedCount: 0,  //number of documents created
  						matchedCount: 0 //matched count
									}
	await delete(); *returns an object : {deletedCount : 1 //number of documents deleted}



ObjectIDs:
		new ObjectId(id) //creates a new object id , throws an error if id is not valid
