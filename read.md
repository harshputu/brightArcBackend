
//Get all Blogs

GET: http://localhost:3000/api/blogs

// Get Single blog by slug

GET: http://localhost:3000/api/blogs/:slug

// Create a post

POST: http://localhost:3000/api/blogs

//Update a blog by slug

PUT:  http://localhost:3000/api/blogs/:slug

//Delete a blog by slug

DELETE : http://localhost:3000/api/blogs/:slug

//Get Blogs by CategoryName

GET :   http://localhost:3000/api/blogs/category/:categoryName /url:url-key

// COMMENT

//Add a comment

POST: http://localhost:3000/api/blogs/:slug/comments

// Approve or Reject a Comment

PATCH : http://localhost:3000/api/blogs/:slug/comments/:commentId/status

// to get All the comments on a blog

GET :  http://localhost:3000/api/blogs/:slug/comments

LIKE AND UNLIKE FEATURE

POST: http://localhost:3000/api/blogs/:slug/like

POST: http://localhost:3000/api/blogs/:slug/unlike


//Login

POST: http://localhost:3000/api/auth/login

//Contact 

To submit the contact details and save it in DB and send mail to user and the admin

POST : http://localhost:3000/api/contact

to get all the contact list saved in DB

GET : http://localhost:3000/api/contact


//Categories

to get all the categories

GET : /api/categories

to create new category

POST : /api/categories

to update  category

PUT : /api/categories/:id

to  delete a category

DELETE : /api/categories/:categoryName



